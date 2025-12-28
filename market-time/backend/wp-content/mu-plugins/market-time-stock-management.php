<?php
/**
 * Market-Time Stock Management
 *
 * Custom logic pentru out-of-stock products:
 * - Protejează produse AI-optimized de ștergere
 * - Smart delete logic based pe indexing status
 * - Back-in-stock notifications
 *
 * @package Market-Time
 * @version 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Prevent deletion of AI-optimized & indexed products
 * Instead, mark them as out-of-stock
 */
add_action('pmxi_before_delete_post', 'market_time_prevent_delete_optimized', 10, 2);

function market_time_prevent_delete_optimized($post_id, $import_id) {
    global $wpdb;

    // Check if product exists in optimized table
    $product = $wpdb->get_row($wpdb->prepare("
        SELECT has_ai_optimization, indexed, stock_status
        FROM wp_products_optimized
        WHERE post_id = %d
    ", $post_id));

    if (!$product) {
        return; // Not in optimized table, allow normal delete
    }

    // Scenario 1: AI optimized + Indexed → KEEP indefinitely
    if ($product->has_ai_optimization && $product->indexed) {
        // Prevent delete by removing the action temporarily
        remove_action('pmxi_before_delete_post', 'market_time_prevent_delete_optimized', 10);

        // Mark as out of stock instead
        $wpdb->update(
            'wp_products_optimized',
            array(
                'stock_status' => 'out_of_stock',
                'out_of_stock_since' => current_time('mysql'),
                'stock_quantity' => 0
            ),
            array('post_id' => $post_id),
            array('%s', '%s', '%d'),
            array('%d')
        );

        // Change post status to draft (hide from frontend but keep for SEO)
        wp_update_post(array(
            'ID' => $post_id,
            'post_status' => 'draft'
        ));

        error_log("Market-Time Stock: Kept AI-optimized product $post_id as out-of-stock");

        // Re-add the action for next products
        add_action('pmxi_before_delete_post', 'market_time_prevent_delete_optimized', 10, 2);

        return;
    }

    // Scenario 2: AI optimized + NOT indexed → Check if >90 days
    if ($product->has_ai_optimization && !$product->indexed) {
        $out_since = strtotime($product->out_of_stock_since);
        $days_out = ($out_since) ? (time() - $out_since) / (60 * 60 * 24) : 0;

        if ($days_out < 90) {
            // Keep for now
            remove_action('pmxi_before_delete_post', 'market_time_prevent_delete_optimized', 10);

            $wpdb->update(
                'wp_products_optimized',
                array('stock_status' => 'out_of_stock'),
                array('post_id' => $post_id)
            );

            add_action('pmxi_before_delete_post', 'market_time_prevent_delete_optimized', 10, 2);
            return;
        }
        // Else: allow delete (>90 days)
    }

    // Scenario 3: NOT AI optimized + Indexed → Keep 30 days
    if (!$product->has_ai_optimization && $product->indexed) {
        $out_since = strtotime($product->out_of_stock_since);
        $days_out = ($out_since) ? (time() - $out_since) / (60 * 60 * 24) : 0;

        if ($days_out < 30) {
            remove_action('pmxi_before_delete_post', 'market_time_prevent_delete_optimized', 10);

            $wpdb->update(
                'wp_products_optimized',
                array('stock_status' => 'out_of_stock'),
                array('post_id' => $post_id)
            );

            add_action('pmxi_before_delete_post', 'market_time_prevent_delete_optimized', 10, 2);
            return;
        }
        // Else: allow delete (>30 days)
    }

    // Scenario 4: NOT AI optimized + NOT indexed → DELETE immediately
    // (falls through, normal WP All Import delete happens)
}

/**
 * Detect when product comes back in stock
 * and send notifications to subscribers
 */
add_action('acf/save_post', 'market_time_back_in_stock_notification', 25);

function market_time_back_in_stock_notification($post_id) {
    global $wpdb;

    // Only for products
    if (get_post_type($post_id) !== 'products') {
        return;
    }

    // Check if ACF is available
    if (!function_exists('get_field')) {
        return;
    }

    // Get current stock from database
    $old_stock = $wpdb->get_var($wpdb->prepare("
        SELECT stock_quantity
        FROM wp_products_optimized
        WHERE post_id = %d
    ", $post_id));

    // Get new stock from feed/ACF (you might need a stock field in ACF)
    // For now, assume in_stock if price exists
    $new_price = get_field('product_price', $post_id);
    $new_stock = (!empty($new_price)) ? 1 : 0;

    // Product came back in stock!
    if ($old_stock == 0 && $new_stock > 0) {
        // Get subscribers
        $subscribers = $wpdb->get_results($wpdb->prepare("
            SELECT email
            FROM wp_stock_notifications
            WHERE product_id = %d AND notified = 0
        ", $post_id));

        if ($subscribers) {
            $product_title = get_the_title($post_id);
            $product_url = get_permalink($post_id);
            $product_price = get_field('product_price', $post_id);

            foreach ($subscribers as $subscriber) {
                // Send email notification
                wp_mail(
                    $subscriber->email,
                    "✅ {$product_title} e din nou în stoc!",
                    "Bună ziua,\n\nProdusul pe care l-ați urmărit este din nou disponibil:\n\n" .
                    "{$product_title}\n" .
                    "Preț: {$product_price} RON\n\n" .
                    "Vezi produsul: {$product_url}\n\n" .
                    "Comandă rapid înainte să se termine din nou!\n\n" .
                    "Echipa Market-Time"
                );
            }

            // Mark as notified
            $wpdb->update(
                'wp_stock_notifications',
                array('notified' => 1),
                array('product_id' => $post_id)
            );

            error_log("Market-Time Stock: Sent " . count($subscribers) . " notifications for product $post_id");
        }

        // Update stock status in database
        $wpdb->update(
            'wp_products_optimized',
            array(
                'stock_status' => 'in_stock',
                'stock_quantity' => $new_stock,
                'out_of_stock_since' => null
            ),
            array('post_id' => $post_id)
        );

        // Change post status back to published
        wp_update_post(array(
            'ID' => $post_id,
            'post_status' => 'publish'
        ));
    }
}

/**
 * Cleanup old out-of-stock products
 * Runs daily via WP Cron
 */
add_action('market_time_cleanup_old_stock', 'market_time_cleanup_out_of_stock_products');

function market_time_cleanup_out_of_stock_products() {
    global $wpdb;

    // Find products to delete:
    // - NOT AI optimized
    // - NOT indexed
    // - Out of stock >30 days
    $products = $wpdb->get_results("
        SELECT post_id
        FROM wp_products_optimized
        WHERE stock_status = 'out_of_stock'
        AND has_ai_optimization = 0
        AND indexed = 0
        AND out_of_stock_since < DATE_SUB(NOW(), INTERVAL 30 DAY)
    ");

    $deleted = 0;
    foreach ($products as $product) {
        wp_delete_post($product->post_id, true); // Force delete
        $deleted++;
    }

    if ($deleted > 0) {
        error_log("Market-Time Stock: Cleaned up $deleted old out-of-stock products");
    }
}

// Schedule cleanup cron if not scheduled
if (!wp_next_scheduled('market_time_cleanup_old_stock')) {
    wp_schedule_event(time(), 'daily', 'market_time_cleanup_old_stock');
}

<?php
/**
 * Market-Time Database Optimization
 *
 * TASK 10-13: Custom optimized table + synchronization hooks
 *
 * @package MarketTime
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * TASK 10: Create custom optimized table wp_products_optimized
 *
 * This table replaces slow postmeta queries for 1.5M products
 */
function market_time_create_optimized_table() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'products_optimized';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        post_id BIGINT(20) UNSIGNED NOT NULL,
        site_id INT(11) NOT NULL DEFAULT 1,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        merchant_id INT(11) NOT NULL,
        merchant_name VARCHAR(100) NOT NULL,
        image_url VARCHAR(500) DEFAULT NULL,
        product_url VARCHAR(500) NOT NULL,
        category_ids VARCHAR(100) DEFAULT NULL,
        ai_descriptions JSON DEFAULT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        KEY idx_post_id (post_id),
        KEY idx_site (site_id),
        KEY idx_merchant (merchant_id),
        KEY idx_price (price),
        KEY idx_category (category_ids(50)),
        KEY idx_site_cat (site_id, category_ids(50)),
        KEY idx_site_merchant (site_id, merchant_id),
        KEY idx_updated (last_updated)
    ) ENGINE=InnoDB {$charset_collate};";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    // Log table creation
    error_log('Market-Time: Created/updated wp_products_optimized table');
}

// Create table on plugin activation
register_activation_hook(__FILE__, 'market_time_create_optimized_table');

// Also create on admin init (for multisite compatibility)
add_action('admin_init', 'market_time_create_optimized_table');

/**
 * TASK 11: Hook to synchronize ACF data to custom table
 *
 * Runs on every product save
 */
function market_time_sync_product_to_optimized_table($post_id) {
    global $wpdb;

    // Only for products post type
    if (get_post_type($post_id) !== 'products') {
        return;
    }

    // Skip autosaves and revisions
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (wp_is_post_revision($post_id)) {
        return;
    }

    // Get post data
    $post = get_post($post_id);
    if (!$post || $post->post_status !== 'publish') {
        return;
    }

    // Get ACF fields
    $sku = get_field('product_sku', $post_id);
    $price = get_field('product_price', $post_id);
    $price_regular = get_field('price_regular', $post_id);
    $brand = get_field('brand', $post_id);
    $vendor = get_field('vendor', $post_id);
    $affiliate_code = get_field('affiliate_code', $post_id);
    $merchant_name = get_field('merchant_name', $post_id);
    $merchant_id = get_field('merchant_id', $post_id);
    $product_url = get_field('product_url', $post_id);
    $external_image_url = get_field('external_image_url', $post_id);
    $gallery_images = get_field('gallery_images', $post_id);
    $short_description = get_field('short_description', $post_id);
    $category_ids = get_field('category_ids', $post_id);
    $ai_descriptions = get_field('ai_descriptions', $post_id);

    // Validate required fields
    if (empty($price) || $price <= 0) {
        error_log("Market-Time: Invalid price for product ID {$post_id}");
        return;
    }

    if (empty($product_url) || !filter_var($product_url, FILTER_VALIDATE_URL)) {
        error_log("Market-Time: Invalid product URL for product ID {$post_id}");
        return;
    }

    if (empty($merchant_id) || $merchant_id <= 0) {
        error_log("Market-Time: Invalid merchant ID for product ID {$post_id}");
        return;
    }

    // Get site ID (for multisite)
    $site_id = function_exists('get_current_blog_id') ? get_current_blog_id() : 1;

    // Prepare category IDs as comma-separated string
    $category_ids_string = is_array($category_ids) ? implode(',', $category_ids) : '';

    // Prepare AI descriptions as JSON
    $ai_descriptions_json = null;
    if (!empty($ai_descriptions)) {
        // Check if already JSON
        if (is_string($ai_descriptions)) {
            $decoded = json_decode($ai_descriptions, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $ai_descriptions_json = $ai_descriptions;
            }
        } else if (is_array($ai_descriptions)) {
            $ai_descriptions_json = json_encode($ai_descriptions);
        }
    }

    // Calculate discount percentage
    $discount_percentage = 0;
    if (!empty($price_regular) && $price_regular > 0 && !empty($price) && $price > 0) {
        $discount_percentage = round((($price_regular - $price) / $price_regular) * 100);
        // Update ACF field with calculated value
        update_field('discount_percentage', $discount_percentage, $post_id);
    }

    // Get featured image URL or use external URL
    $image_url = $external_image_url;
    if (empty($image_url)) {
        $image_url = get_the_post_thumbnail_url($post_id, 'large');
    }

    // Get WordPress taxonomies (Categories, Brands, Tags)
    $wp_categories = wp_get_post_terms($post_id, 'product_category', array('fields' => 'ids'));
    $wp_brands = wp_get_post_terms($post_id, 'product_brand', array('fields' => 'names'));
    $wp_tags = wp_get_post_terms($post_id, 'product_tag', array('fields' => 'names'));

    // If brand field is empty but taxonomy has brand, use taxonomy
    if (empty($brand) && !empty($wp_brands)) {
        $brand = $wp_brands[0];
    }

    // Prepare data for insertion/update
    $data = array(
        'post_id' => $post_id,
        'sku' => sanitize_text_field($sku),
        'site_id' => $site_id,
        'title' => sanitize_text_field($post->post_title),
        'price' => floatval($price),
        'price_regular' => !empty($price_regular) ? floatval($price_regular) : null,
        'discount_percentage' => intval($discount_percentage),
        'merchant_id' => intval($merchant_id),
        'merchant_name' => sanitize_text_field($merchant_name),
        'brand' => sanitize_text_field($brand),
        'vendor' => sanitize_text_field($vendor),
        'affiliate_code' => sanitize_text_field($affiliate_code),
        'image_url' => esc_url_raw($image_url),
        'gallery_images' => sanitize_textarea_field($gallery_images),
        'product_url' => esc_url_raw($product_url),
        'category_ids' => $category_ids_string,
        'ai_descriptions' => $ai_descriptions_json,
        'short_description' => sanitize_textarea_field($short_description),
        'last_updated' => current_time('mysql'),
    );

    $table_name = $wpdb->prefix . 'products_optimized';

    // Check if record exists
    $existing = $wpdb->get_var($wpdb->prepare(
        "SELECT id FROM {$table_name} WHERE post_id = %d AND site_id = %d",
        $post_id,
        $site_id
    ));

    if ($existing) {
        // UPDATE existing record
        $result = $wpdb->update(
            $table_name,
            $data,
            array(
                'post_id' => $post_id,
                'site_id' => $site_id,
            ),
            array(
                '%d', // post_id
                '%s', // sku
                '%d', // site_id
                '%s', // title
                '%f', // price
                '%f', // price_regular
                '%d', // discount_percentage
                '%d', // merchant_id
                '%s', // merchant_name
                '%s', // brand
                '%s', // vendor
                '%s', // affiliate_code
                '%s', // image_url
                '%s', // gallery_images
                '%s', // product_url
                '%s', // category_ids
                '%s', // ai_descriptions
                '%s', // short_description
                '%s', // last_updated
            ),
            array('%d', '%d')
        );

        if ($result === false) {
            error_log("Market-Time: Failed to UPDATE product {$post_id} in optimized table: " . $wpdb->last_error);
        }
    } else {
        // INSERT new record
        $result = $wpdb->insert(
            $table_name,
            $data,
            array(
                '%d', '%s', '%d', '%s', '%f', '%f', '%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'
            )
        );

        if ($result === false) {
            error_log("Market-Time: Failed to INSERT product {$post_id} into optimized table: " . $wpdb->last_error);
        }
    }
}
// Priority 20 ensures this runs AFTER ACF saves fields (ACF uses priority 10)
add_action('acf/save_post', 'market_time_sync_product_to_optimized_table_acf', 20);

/**
 * Wrapper function specifically for ACF hook
 */
function market_time_sync_product_to_optimized_table_acf($post_id) {
    // Only for products post type
    if (get_post_type($post_id) !== 'products') {
        return;
    }

    // Call the main sync function
    market_time_sync_product_to_optimized_table($post_id);
}

/**
 * Delete from optimized table when product is deleted
 */
function market_time_delete_from_optimized_table($post_id) {
    global $wpdb;

    if (get_post_type($post_id) !== 'products') {
        return;
    }

    $site_id = function_exists('get_current_blog_id') ? get_current_blog_id() : 1;
    $table_name = $wpdb->prefix . 'products_optimized';

    $wpdb->delete(
        $table_name,
        array(
            'post_id' => $post_id,
            'site_id' => $site_id,
        ),
        array('%d', '%d')
    );
}
add_action('before_delete_post', 'market_time_delete_from_optimized_table');

/**
 * TASK 12: Add performance indexes to wp_postmeta
 *
 * Runs once on activation
 */
function market_time_optimize_postmeta_indexes() {
    global $wpdb;

    // Check if index already exists
    $indexes = $wpdb->get_results("SHOW INDEX FROM {$wpdb->postmeta} WHERE Key_name = 'meta_key_value'");

    if (empty($indexes)) {
        $wpdb->query("ALTER TABLE {$wpdb->postmeta} ADD INDEX meta_key_value(meta_key, meta_value(50))");
        error_log('Market-Time: Added meta_key_value index to wp_postmeta');
    }

    // Optimize wp_posts indexes
    $posts_indexes = $wpdb->get_results("SHOW INDEX FROM {$wpdb->posts} WHERE Key_name = 'type_status_date'");

    if (empty($posts_indexes)) {
        $wpdb->query("ALTER TABLE {$wpdb->posts} ADD INDEX type_status_date(post_type, post_status, post_date)");
        error_log('Market-Time: Added type_status_date index to wp_posts');
    }

    // TASK 12: Analyze tables for optimization
    $wpdb->query("ANALYZE TABLE {$wpdb->postmeta}");
    $wpdb->query("ANALYZE TABLE {$wpdb->posts}");

    error_log('Market-Time: Analyzed postmeta and posts tables');
}

// Run on plugin activation
register_activation_hook(__FILE__, 'market_time_optimize_postmeta_indexes');

/**
 * Admin notice to remind about Redis cache
 */
function market_time_redis_cache_notice() {
    if (!class_exists('Redis')) {
        ?>
        <div class="notice notice-warning">
            <p><strong>Market-Time:</strong> Redis extension is not installed. For optimal performance with 1.5M products, please install Redis and activate the Redis Object Cache plugin.</p>
        </div>
        <?php
    }
}
add_action('admin_notices', 'market_time_redis_cache_notice');

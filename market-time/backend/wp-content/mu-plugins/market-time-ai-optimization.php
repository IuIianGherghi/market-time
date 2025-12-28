<?php
/**
 * Market-Time AI Optimization
 *
 * TASK 32-39: AI-powered product descriptions using OpenRouter
 *
 * @package MarketTime
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Configuration: Add to wp-config.php:
 * define('OPENROUTER_API_KEY', 'your-api-key');
 * define('OPENROUTER_MODEL', 'meta-llama/llama-3.1-70b-instruct'); // or other model
 */

/**
 * TASK 35: Get domain configuration for AI context
 */
function market_time_get_domain_configuration($site_id) {
    $mapping_file = WP_CONTENT_DIR . '/../docs/category-mapping.json';

    if (file_exists($mapping_file)) {
        $mapping = json_decode(file_get_contents($mapping_file), true);
        $site_mapping = $mapping['site_mapping'] ?? array();

        foreach ($site_mapping as $id => $site_data) {
            if (intval($id) === $site_id) {
                return $site_data;
            }
        }
    }

    // Default configuration
    return array(
        'domain_name' => 'market-time.ro',
        'niche' => 'general',
        'target_audience' => 'General consumers',
        'preferred_tone' => 'Professional',
        'focus_keywords' => array('price', 'comparison', 'offers'),
        'usps' => array('Best prices', 'Daily updates', '50+ stores'),
    );
}

/**
 * TASK 36: Generate domain-specific product description using AI
 */
function market_time_generate_domain_specific_description($product_data, $site_id) {
    // Check if OpenRouter is configured
    if (!defined('OPENROUTER_API_KEY') || empty(OPENROUTER_API_KEY)) {
        error_log('Market-Time AI: OpenRouter API key not configured');
        return false;
    }

    $domain_config = market_time_get_domain_configuration($site_id);

    // Build prompt for AI
    $prompt = market_time_build_ai_prompt($product_data, $domain_config);

    // Call OpenRouter API
    $model = defined('OPENROUTER_MODEL') ? OPENROUTER_MODEL : 'meta-llama/llama-3.1-70b-instruct';

    $response = wp_remote_post('https://openrouter.ai/api/v1/chat/completions', array(
        'timeout' => 30,
        'headers' => array(
            'Authorization' => 'Bearer ' . OPENROUTER_API_KEY,
            'Content-Type' => 'application/json',
            'HTTP-Referer' => site_url(),
            'X-Title' => 'Market-Time Product Descriptions',
        ),
        'body' => json_encode(array(
            'model' => $model,
            'messages' => array(
                array(
                    'role' => 'system',
                    'content' => 'You are an expert e-commerce copywriter specializing in product descriptions. Write compelling, SEO-optimized descriptions that convert browsers into buyers.',
                ),
                array(
                    'role' => 'user',
                    'content' => $prompt,
                ),
            ),
            'max_tokens' => 500,
            'temperature' => 0.7,
        )),
    ));

    if (is_wp_error($response)) {
        error_log('Market-Time AI: API call failed - ' . $response->get_error_message());
        return false;
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    if (isset($data['choices'][0]['message']['content'])) {
        return trim($data['choices'][0]['message']['content']);
    }

    error_log('Market-Time AI: Invalid API response - ' . $body);
    return false;
}

/**
 * Build AI prompt with product data and domain context
 */
function market_time_build_ai_prompt($product_data, $domain_config) {
    $prompt = "Write a compelling product description for the following product:\n\n";

    $prompt .= "**Product Details:**\n";
    $prompt .= "- Title: {$product_data['title']}\n";
    $prompt .= "- Price: {$product_data['price']} RON\n";
    $prompt .= "- Merchant: {$product_data['merchant_name']}\n";

    if (!empty($product_data['category'])) {
        $prompt .= "- Category: {$product_data['category']}\n";
    }

    $prompt .= "\n**Target Audience & Context:**\n";
    $prompt .= "- Website: {$domain_config['domain_name']}\n";
    $prompt .= "- Niche: {$domain_config['niche']}\n";
    $prompt .= "- Target Audience: {$domain_config['target_audience']}\n";
    $prompt .= "- Tone: {$domain_config['preferred_tone']}\n";

    if (!empty($domain_config['focus_keywords'])) {
        $keywords = is_array($domain_config['focus_keywords'])
            ? implode(', ', $domain_config['focus_keywords'])
            : $domain_config['focus_keywords'];
        $prompt .= "- Focus Keywords: {$keywords}\n";
    }

    if (!empty($domain_config['usps'])) {
        $usps = is_array($domain_config['usps'])
            ? implode(', ', $domain_config['usps'])
            : $domain_config['usps'];
        $prompt .= "- Unique Selling Points: {$usps}\n";
    }

    $prompt .= "\n**Requirements:**\n";
    $prompt .= "- Length: 180-220 words\n";
    $prompt .= "- Write specifically for the {$domain_config['niche']} niche\n";
    $prompt .= "- Use the specified tone: {$domain_config['preferred_tone']}\n";
    $prompt .= "- Include focus keywords naturally (avoid keyword stuffing)\n";
    $prompt .= "- Highlight benefits relevant to {$domain_config['target_audience']}\n";
    $prompt .= "- Make it unique and engaging\n";
    $prompt .= "- Focus on what matters to the target audience\n";
    $prompt .= "- Do NOT include title or headings, just the description paragraph\n";
    $prompt .= "- Write in Romanian language\n";

    return $prompt;
}

/**
 * TASK 37: Create AI generation queue table
 */
function market_time_create_ai_queue_table() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'ai_generation_queue';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        product_id BIGINT(20) NOT NULL,
        site_id INT(11) NOT NULL,
        priority_score INT(11) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pending',
        attempts INT(11) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP NULL,
        error_message TEXT,
        PRIMARY KEY (id),
        KEY idx_status (status),
        KEY idx_priority (priority_score),
        KEY idx_product_site (product_id, site_id)
    ) ENGINE=InnoDB {$charset_collate};";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    // Also create priority scores table (TASK 34)
    $priority_table = $wpdb->prefix . 'product_priority';
    $sql_priority = "CREATE TABLE IF NOT EXISTS {$priority_table} (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        product_id BIGINT(20) NOT NULL,
        site_id INT(11) NOT NULL,
        priority_score INT(11) DEFAULT 0,
        impressions INT(11) DEFAULT 0,
        clicks INT(11) DEFAULT 0,
        ctr DECIMAL(5,2) DEFAULT 0.00,
        position DECIMAL(5,2) DEFAULT 0.00,
        bounce_rate DECIMAL(5,2) DEFAULT 0.00,
        conversions INT(11) DEFAULT 0,
        last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_product_site (product_id, site_id),
        KEY idx_priority (priority_score),
        KEY idx_site (site_id)
    ) ENGINE=InnoDB {$charset_collate};";

    dbDelta($sql_priority);

    error_log('Market-Time AI: Created/updated AI queue and priority tables');
}
register_activation_hook(__FILE__, 'market_time_create_ai_queue_table');
add_action('admin_init', 'market_time_create_ai_queue_table');

/**
 * TASK 37: Queue high-priority products for AI generation
 */
function market_time_queue_priority_products() {
    global $wpdb;

    $products_table = $wpdb->prefix . 'products_optimized';
    $priority_table = $wpdb->prefix . 'product_priority';
    $queue_table = $wpdb->prefix . 'ai_generation_queue';

    // Get products with priority >= 50 that don't have AI descriptions
    $query = "
        SELECT p.post_id, p.site_id, pr.priority_score
        FROM {$products_table} p
        INNER JOIN {$priority_table} pr ON p.post_id = pr.product_id AND p.site_id = pr.site_id
        WHERE pr.priority_score >= 50
        AND (p.ai_descriptions IS NULL OR p.ai_descriptions = '' OR p.ai_descriptions = 'null')
        AND NOT EXISTS (
            SELECT 1 FROM {$queue_table} q
            WHERE q.product_id = p.post_id AND q.site_id = p.site_id
            AND q.status IN ('pending', 'processing')
        )
        ORDER BY pr.priority_score DESC
        LIMIT 10000
    ";

    $products_to_queue = $wpdb->get_results($query);

    $queued_count = 0;
    foreach ($products_to_queue as $product) {
        $wpdb->insert(
            $queue_table,
            array(
                'product_id' => $product->post_id,
                'site_id' => $product->site_id,
                'priority_score' => $product->priority_score,
                'status' => 'pending',
            ),
            array('%d', '%d', '%d', '%s')
        );
        $queued_count++;
    }

    error_log("Market-Time AI: Queued {$queued_count} high-priority products for AI generation");
    return $queued_count;
}

/**
 * TASK 38: WP Cron job to process AI generation queue
 */
function market_time_process_ai_queue() {
    global $wpdb;

    if (!defined('OPENROUTER_API_KEY')) {
        return; // Skip if not configured
    }

    $queue_table = $wpdb->prefix . 'ai_generation_queue';
    $products_table = $wpdb->prefix . 'products_optimized';

    // Get next 50 items from queue
    $items = $wpdb->get_results(
        "SELECT * FROM {$queue_table}
         WHERE status = 'pending' AND attempts < 3
         ORDER BY priority_score DESC
         LIMIT 50",
        ARRAY_A
    );

    if (empty($items)) {
        return;
    }

    $processed_count = 0;
    $failed_count = 0;

    foreach ($items as $item) {
        // Mark as processing
        $wpdb->update(
            $queue_table,
            array('status' => 'processing'),
            array('id' => $item['id']),
            array('%s'),
            array('%d')
        );

        // Get product data
        $product = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$products_table} WHERE post_id = %d AND site_id = %d",
            $item['product_id'],
            $item['site_id']
        ), ARRAY_A);

        if (!$product) {
            $wpdb->update(
                $queue_table,
                array('status' => 'failed', 'error_message' => 'Product not found'),
                array('id' => $item['id']),
                array('%s', '%s'),
                array('%d')
            );
            continue;
        }

        // Get all relevant sites for this product's categories
        $category_ids = array_filter(explode(',', $product['category_ids']));
        $relevant_sites = market_time_get_sites_for_categories($category_ids);

        // Generate descriptions for all relevant domains
        $ai_descriptions = array();

        foreach ($relevant_sites as $site_id) {
            $description = market_time_generate_domain_specific_description($product, $site_id);

            if ($description) {
                $ai_descriptions[$site_id] = $description;
            }

            // Rate limiting: sleep 1 second between API calls
            sleep(1);
        }

        // Save AI descriptions to database
        if (!empty($ai_descriptions)) {
            $wpdb->update(
                $products_table,
                array('ai_descriptions' => json_encode($ai_descriptions)),
                array('post_id' => $item['product_id']),
                array('%s'),
                array('%d')
            );

            // Mark as completed
            $wpdb->update(
                $queue_table,
                array(
                    'status' => 'completed',
                    'processed_at' => current_time('mysql'),
                ),
                array('id' => $item['id']),
                array('%s', '%s'),
                array('%d')
            );

            $processed_count++;
        } else {
            // Mark as failed
            $wpdb->update(
                $queue_table,
                array(
                    'status' => 'failed',
                    'attempts' => $item['attempts'] + 1,
                    'error_message' => 'Failed to generate description',
                ),
                array('id' => $item['id']),
                array('%s', '%d', '%s'),
                array('%d')
            );

            $failed_count++;
        }
    }

    error_log("Market-Time AI: Processed {$processed_count} products, {$failed_count} failed");
}

// Schedule cron job to run every 2 minutes
if (!wp_next_scheduled('market_time_ai_generation')) {
    wp_schedule_event(time(), 'twominutes', 'market_time_ai_generation');
}
add_action('market_time_ai_generation', 'market_time_process_ai_queue');

// Add custom cron interval
add_filter('cron_schedules', function($schedules) {
    $schedules['twominutes'] = array(
        'interval' => 120,
        'display' => 'Every 2 Minutes',
    );
    return $schedules;
});

/**
 * Helper: Get sites that should display products from these categories
 */
function market_time_get_sites_for_categories($category_ids) {
    $mapping_file = WP_CONTENT_DIR . '/../docs/category-mapping.json';

    if (!file_exists($mapping_file)) {
        return array(1); // Default to main site
    }

    $mapping = json_decode(file_get_contents($mapping_file), true);
    $site_mapping = $mapping['site_mapping'] ?? array();

    $relevant_sites = array();

    foreach ($site_mapping as $site_id => $site_data) {
        $site_categories = $site_data['categories'] ?? array();

        // If site shows all categories, include it
        if (in_array('all', $site_categories)) {
            $relevant_sites[] = intval($site_id);
            continue;
        }

        // Check if any product category matches site categories
        foreach ($category_ids as $cat_id) {
            if (in_array(intval($cat_id), $site_categories)) {
                $relevant_sites[] = intval($site_id);
                break;
            }
        }
    }

    return array_unique($relevant_sites);
}

/**
 * Admin notice for AI configuration
 */
function market_time_ai_admin_notice() {
    if (!defined('OPENROUTER_API_KEY')) {
        ?>
        <div class="notice notice-warning">
            <p><strong>Market-Time AI:</strong> OpenRouter API key not configured. Add <code>define('OPENROUTER_API_KEY', 'your-key');</code> to wp-config.php to enable AI-powered product descriptions.</p>
            <p><a href="https://openrouter.ai/" target="_blank">Get OpenRouter API Key</a></p>
        </div>
        <?php
    }
}
add_action('admin_notices', 'market_time_ai_admin_notice');

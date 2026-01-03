<?php
/**
 * Market-Time REST API
 *
 * TASK 27-31: Custom REST API endpoints for multi-domain product queries
 *
 * @package MarketTime
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Helper: Sanitize float value for REST API
 */
function market_time_sanitize_float($value, $request, $param) {
    return floatval($value);
}

/**
 * Register custom REST API routes
 */
function market_time_register_rest_routes() {
    $namespace = 'market-time/v1';

    // TASK 27: GET /products - Lista produse cu filtrare multi-domain
    register_rest_route($namespace, '/products', array(
        'methods' => 'GET',
        'callback' => 'market_time_get_products',
        'permission_callback' => '__return_true',
        'args' => array(
            'page' => array(
                'default' => 1,
                'sanitize_callback' => 'absint',
            ),
            'per_page' => array(
                'default' => 20,
                'sanitize_callback' => 'absint',
                'validate_callback' => function($param) {
                    return $param > 0 && $param <= 100;
                },
            ),
            'merchant_id' => array(
                'sanitize_callback' => 'sanitize_text_field',
                'description' => 'Merchant ID or comma-separated list of merchant IDs',
            ),
            'brand' => array(
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'min_price' => array(
                'sanitize_callback' => 'market_time_sanitize_float',
            ),
            'max_price' => array(
                'sanitize_callback' => 'market_time_sanitize_float',
            ),
            'min_discount' => array(
                'sanitize_callback' => 'absint',
                'validate_callback' => function($param) {
                    return $param >= 0 && $param <= 100;
                },
            ),
            'on_sale' => array(
                'sanitize_callback' => 'rest_sanitize_boolean',
            ),
            'orderby' => array(
                'default' => 'date',
                'enum' => array('price', 'date', 'title', 'discount'),
            ),
            'order' => array(
                'default' => 'DESC',
                'enum' => array('ASC', 'DESC'),
            ),
        ),
    ));

    // TASK 28: GET /products/{id} - Produs individual cu descriere per domain
    register_rest_route($namespace, '/products/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'market_time_get_product',
        'permission_callback' => '__return_true',
        'args' => array(
            'id' => array(
                'validate_callback' => function($param) {
                    return is_numeric($param);
                },
            ),
        ),
    ));

    // TASK 29: GET /merchants - Lista merchants per site
    register_rest_route($namespace, '/merchants', array(
        'methods' => 'GET',
        'callback' => 'market_time_get_merchants',
        'permission_callback' => '__return_true',
    ));

    // TASK 29: GET /categories - Lista categorii per site
    register_rest_route($namespace, '/categories', array(
        'methods' => 'GET',
        'callback' => 'market_time_get_categories',
        'permission_callback' => '__return_true',
    ));

    // TASK 30: POST /track-click - Tracking clicks (affiliate)
    register_rest_route($namespace, '/track-click', array(
        'methods' => 'POST',
        'callback' => 'market_time_track_click',
        'permission_callback' => '__return_true',
        'args' => array(
            'product_id' => array(
                'required' => true,
                'validate_callback' => function($param) {
                    return is_numeric($param);
                },
            ),
        ),
    ));
}
add_action('rest_api_init', 'market_time_register_rest_routes');

/**
 * TASK 27: Get products with multi-domain filtering
 */
function market_time_get_products($request) {
    global $wpdb;

    $page = $request->get_param('page');
    $per_page = $request->get_param('per_page');
    $merchant_id = $request->get_param('merchant_id');
    $brand = $request->get_param('brand');
    $min_price = $request->get_param('min_price');
    $max_price = $request->get_param('max_price');
    $min_discount = $request->get_param('min_discount');
    $on_sale = $request->get_param('on_sale');
    $orderby = $request->get_param('orderby');
    $order = $request->get_param('order');

    // Get current site ID
    $site_id = function_exists('get_current_blog_id') ? get_current_blog_id() : 1;

    // Get allowed categories for this site from mapping
    $allowed_categories = market_time_get_site_categories($site_id);

    $table_name = $wpdb->prefix . 'products_optimized';

    // Build WHERE clause
    $where = array("site_id = %d");
    $where_values = array($site_id);

    // Filter by categories (unless "all")
    if ($allowed_categories !== array('all')) {
        $category_conditions = array();
        foreach ($allowed_categories as $cat_id) {
            $category_conditions[] = "FIND_IN_SET(%s, category_ids)";
            $where_values[] = $cat_id;
        }
        if (!empty($category_conditions)) {
            $where[] = '(' . implode(' OR ', $category_conditions) . ')';
        }
    }

    // Filter by merchant (supports multiple IDs separated by comma)
    if ($merchant_id) {
        // Split comma-separated merchant IDs
        $merchant_ids = array_map('intval', explode(',', $merchant_id));
        $merchant_ids = array_filter($merchant_ids); // Remove empty values

        if (!empty($merchant_ids)) {
            $placeholders = implode(',', array_fill(0, count($merchant_ids), '%d'));
            $where[] = "merchant_id IN ($placeholders)";
            $where_values = array_merge($where_values, $merchant_ids);
        }
    }

    // Filter by brand
    if ($brand) {
        $where[] = "brand = %s";
        $where_values[] = $brand;
    }

    // Filter by price range
    if ($min_price) {
        $where[] = "price >= %f";
        $where_values[] = $min_price;
    }
    if ($max_price) {
        $where[] = "price <= %f";
        $where_values[] = $max_price;
    }

    // Filter by discount percentage
    if ($min_discount) {
        $where[] = "discount_percentage >= %d";
        $where_values[] = $min_discount;
    }

    // Filter by on sale (has discount)
    if ($on_sale) {
        $where[] = "discount_percentage > 0";
    }

    $where_clause = implode(' AND ', $where);

    // Build ORDER BY clause
    $order_map = array(
        'price' => 'price',
        'date' => 'last_updated',
        'title' => 'title',
        'discount' => 'discount_percentage',
    );
    $order_field = $order_map[$orderby] ?? 'last_updated';
    $order_direction = $order === 'ASC' ? 'ASC' : 'DESC';

    // Count total products
    $count_query = $wpdb->prepare(
        "SELECT COUNT(*) FROM {$table_name} WHERE {$where_clause}",
        $where_values
    );
    $total_count = $wpdb->get_var($count_query);

    // Calculate pagination
    $offset = ($page - 1) * $per_page;
    $total_pages = ceil($total_count / $per_page);

    // Get products
    $query = $wpdb->prepare(
        "SELECT * FROM {$table_name}
         WHERE {$where_clause}
         ORDER BY {$order_field} {$order_direction}
         LIMIT %d OFFSET %d",
        array_merge($where_values, array($per_page, $offset))
    );

    $products = $wpdb->get_results($query, ARRAY_A);

    // Format products
    $formatted_products = array_map('market_time_format_product', $products);

    // Prepare response
    $response = new WP_REST_Response(array(
        'data' => $formatted_products,
        'pagination' => array(
            'page' => $page,
            'per_page' => $per_page,
            'total_count' => intval($total_count),
            'total_pages' => intval($total_pages),
        ),
    ));

    // Add headers
    $response->header('X-Total-Count', $total_count);
    $response->header('X-Total-Pages', $total_pages);

    return $response;
}

/**
 * TASK 28: Get single product with domain-specific description
 */
function market_time_get_product($request) {
    global $wpdb;

    $product_id = $request->get_param('id');
    $site_id = function_exists('get_current_blog_id') ? get_current_blog_id() : 1;

    $table_name = $wpdb->prefix . 'products_optimized';

    $query = $wpdb->prepare(
        "SELECT * FROM {$table_name} WHERE post_id = %d AND site_id = %d LIMIT 1",
        $product_id,
        $site_id
    );

    $product = $wpdb->get_row($query, ARRAY_A);

    if (!$product) {
        return new WP_Error('product_not_found', 'Product not found', array('status' => 404));
    }

    // Format product
    $formatted = market_time_format_product($product);

    // Add domain-specific description
    $ai_descriptions = json_decode($product['ai_descriptions'], true);
    if (is_array($ai_descriptions) && isset($ai_descriptions[$site_id])) {
        $formatted['description_full'] = $ai_descriptions[$site_id];
    } else {
        // Fallback to WordPress post content
        $post = get_post($product_id);
        $formatted['description_full'] = $post ? $post->post_content : '';
    }

    // Add SEO meta
    $formatted['seo'] = array(
        'title' => $product['title'] . ' - ' . get_bloginfo('name'),
        'description' => substr(wp_strip_all_tags($formatted['description_full']), 0, 155),
        'canonical' => get_permalink($product_id),
    );

    return new WP_REST_Response($formatted);
}

/**
 * TASK 29: Get merchants for current site
 */
function market_time_get_merchants($request) {
    global $wpdb;

    $site_id = function_exists('get_current_blog_id') ? get_current_blog_id() : 1;
    $table_name = $wpdb->prefix . 'products_optimized';

    // Get from transient cache (1 hour)
    $cache_key = "site_{$site_id}_merchants";
    $merchants = get_transient($cache_key);

    if ($merchants === false) {
        $query = $wpdb->prepare(
            "SELECT
                merchant_id as id,
                merchant_name as name,
                COUNT(*) as product_count,
                AVG(price) as avg_price,
                MIN(price) as min_price,
                MAX(price) as max_price
             FROM {$table_name}
             WHERE site_id = %d
             GROUP BY merchant_id, merchant_name
             ORDER BY product_count DESC",
            $site_id
        );

        $merchants = $wpdb->get_results($query, ARRAY_A);

        // Format prices
        foreach ($merchants as &$merchant) {
            $merchant['avg_price'] = floatval($merchant['avg_price']);
            $merchant['min_price'] = floatval($merchant['min_price']);
            $merchant['max_price'] = floatval($merchant['max_price']);
            $merchant['product_count'] = intval($merchant['product_count']);
        }

        set_transient($cache_key, $merchants, 3600); // Cache for 1 hour
    }

    return new WP_REST_Response($merchants);
}

/**
 * TASK 29: Get categories for current site
 */
function market_time_get_categories($request) {
    global $wpdb;

    $site_id = function_exists('get_current_blog_id') ? get_current_blog_id() : 1;
    $allowed_categories = market_time_get_site_categories($site_id);

    // Get categories from mapping file
    $mapping_file = WP_CONTENT_DIR . '/../docs/category-mapping.json';
    if (file_exists($mapping_file)) {
        $mapping = json_decode(file_get_contents($mapping_file), true);
        $categories = $mapping['categories'] ?? array();

        // Filter to only allowed categories
        if ($allowed_categories !== array('all')) {
            $categories = array_filter($categories, function($cat_id) use ($allowed_categories) {
                return in_array($cat_id, $allowed_categories);
            }, ARRAY_FILTER_USE_KEY);
        }

        // Get product counts
        $table_name = $wpdb->prefix . 'products_optimized';
        $result = array();

        foreach ($categories as $cat_id => $cat_name) {
            $count = $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM {$table_name}
                 WHERE site_id = %d AND FIND_IN_SET(%s, category_ids)",
                $site_id,
                $cat_id
            ));

            $result[] = array(
                'id' => intval($cat_id),
                'name' => $cat_name,
                'slug' => sanitize_title($cat_name),
                'count' => intval($count),
            );
        }

        return new WP_REST_Response($result);
    }

    return new WP_REST_Response(array());
}

/**
 * TASK 30: Track product click (affiliate tracking)
 */
function market_time_track_click($request) {
    global $wpdb;

    $product_id = $request->get_param('product_id');
    $site_id = function_exists('get_current_blog_id') ? get_current_blog_id() : 1;

    // Rate limiting: Check if table exists, create if not
    $table_name = $wpdb->prefix . 'product_clicks';
    $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") === $table_name;

    if (!$table_exists) {
        $charset_collate = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE {$table_name} (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            product_id BIGINT(20) NOT NULL,
            clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_ip VARCHAR(45),
            referrer VARCHAR(500),
            site_id INT(11) NOT NULL,
            PRIMARY KEY (id),
            KEY idx_product (product_id),
            KEY idx_site (site_id),
            KEY idx_date (clicked_at)
        ) ENGINE=InnoDB {$charset_collate};";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    // Simple rate limiting: max 1000 requests per hour per IP
    $user_ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $one_hour_ago = date('Y-m-d H:i:s', strtotime('-1 hour'));

    $recent_clicks = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$table_name}
         WHERE user_ip = %s AND clicked_at >= %s",
        $user_ip,
        $one_hour_ago
    ));

    if ($recent_clicks > 1000) {
        return new WP_Error('rate_limit_exceeded', 'Too many requests', array('status' => 429));
    }

    // Insert click tracking
    $wpdb->insert(
        $table_name,
        array(
            'product_id' => $product_id,
            'user_ip' => $user_ip,
            'referrer' => $_SERVER['HTTP_REFERER'] ?? '',
            'site_id' => $site_id,
        ),
        array('%d', '%s', '%s', '%d')
    );

    return new WP_REST_Response(array(
        'success' => true,
        'message' => 'Click tracked successfully',
    ));
}

/**
 * Helper: Get allowed categories for a site
 */
function market_time_get_site_categories($site_id) {
    if (defined('SITE_CATEGORY_MAP')) {
        $map = unserialize(SITE_CATEGORY_MAP);
        return $map[$site_id] ?? array();
    }

    // Fallback to JSON file
    $mapping_file = WP_CONTENT_DIR . '/../docs/category-mapping.json';
    if (file_exists($mapping_file)) {
        $mapping = json_decode(file_get_contents($mapping_file), true);
        $site_mapping = $mapping['site_mapping'] ?? array();

        foreach ($site_mapping as $id => $site_data) {
            if (intval($id) === $site_id) {
                return $site_data['categories'] ?? array();
            }
        }
    }

    return array('all');
}

/**
 * Helper: Format product for API response
 */
function market_time_format_product($product) {
    // Parse gallery images (newline-separated URLs)
    $gallery = array();
    if (!empty($product['gallery_images'])) {
        $gallery = array_filter(array_map('trim', explode("\n", $product['gallery_images'])));
    }

    $formatted = array(
        'id' => intval($product['post_id']),
        'sku' => $product['sku'],
        'title' => $product['title'],
        'price' => round(floatval($product['price']), 2),
        'price_regular' => !empty($product['price_regular']) ? round(floatval($product['price_regular']), 2) : null,
        'discount_percentage' => intval($product['discount_percentage']),
        'on_sale' => intval($product['discount_percentage']) > 0,
        'merchant' => array(
            'id' => intval($product['merchant_id']),
            'name' => $product['merchant_name'],
        ),
        'brand' => $product['brand'],
        'vendor' => $product['vendor'],
        'image_url' => $product['image_url'],
        'gallery_images' => $gallery,
        'product_url' => $product['product_url'],
        'affiliate_code' => $product['affiliate_code'],
        'short_description' => $product['short_description'],
        'category_ids' => array_filter(explode(',', $product['category_ids'])),
        'last_updated' => $product['last_updated'],
    );

    return $formatted;
}

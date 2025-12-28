<?php
/**
 * Market-Time Theme Functions
 *
 * Custom Post Types, ACF Fields, and Core Functionality
 *
 * @package MarketTime
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * TASK 8: Custom Post Type 'Products'
 *
 * Registers the Products CPT with REST API support
 */
function market_time_register_product_cpt() {
    $labels = array(
        'name'                  => 'Products',
        'singular_name'         => 'Product',
        'menu_name'             => 'Products',
        'add_new'               => 'Add New Product',
        'add_new_item'          => 'Add New Product',
        'edit_item'             => 'Edit Product',
        'new_item'              => 'New Product',
        'view_item'             => 'View Product',
        'search_items'          => 'Search Products',
        'not_found'             => 'No products found',
        'not_found_in_trash'    => 'No products found in trash',
    );

    $args = array(
        'labels'                => $labels,
        'public'                => true,
        'publicly_queryable'    => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'show_in_rest'          => true, // Enable REST API
        'rest_base'             => 'products',
        'query_var'             => true,
        'rewrite'               => array('slug' => 'products'),
        'capability_type'       => 'product',
        'map_meta_cap'          => true,
        'has_archive'           => true,
        'hierarchical'          => false,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-products',
        'supports'              => array('title', 'editor', 'thumbnail'),
        'taxonomies'            => array('product_category'),
    );

    register_post_type('products', $args);

    // Add capabilities to administrator role
    $admin_role = get_role('administrator');
    if ($admin_role) {
        $admin_role->add_cap('edit_product');
        $admin_role->add_cap('read_product');
        $admin_role->add_cap('delete_product');
        $admin_role->add_cap('edit_products');
        $admin_role->add_cap('edit_others_products');
        $admin_role->add_cap('publish_products');
        $admin_role->add_cap('read_private_products');
        $admin_role->add_cap('delete_products');
        $admin_role->add_cap('delete_private_products');
        $admin_role->add_cap('delete_published_products');
        $admin_role->add_cap('delete_others_products');
        $admin_role->add_cap('edit_private_products');
        $admin_role->add_cap('edit_published_products');
    }
}
add_action('init', 'market_time_register_product_cpt');

/**
 * Register Product Taxonomies
 */
function market_time_register_product_taxonomy() {
    // Product Categories (hierarchical)
    $category_labels = array(
        'name'              => 'Product Categories',
        'singular_name'     => 'Product Category',
        'search_items'      => 'Search Categories',
        'all_items'         => 'All Categories',
        'parent_item'       => 'Parent Category',
        'parent_item_colon' => 'Parent Category:',
        'edit_item'         => 'Edit Category',
        'update_item'       => 'Update Category',
        'add_new_item'      => 'Add New Category',
        'new_item_name'     => 'New Category Name',
        'menu_name'         => 'Categories',
    );

    register_taxonomy('product_category', 'products', array(
        'hierarchical'      => true,
        'labels'            => $category_labels,
        'show_ui'           => true,
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'category'),
    ));

    // Product Brands (non-hierarchical)
    $brand_labels = array(
        'name'                       => 'Brands',
        'singular_name'              => 'Brand',
        'search_items'               => 'Search Brands',
        'popular_items'              => 'Popular Brands',
        'all_items'                  => 'All Brands',
        'edit_item'                  => 'Edit Brand',
        'update_item'                => 'Update Brand',
        'add_new_item'               => 'Add New Brand',
        'new_item_name'              => 'New Brand Name',
        'separate_items_with_commas' => 'Separate brands with commas',
        'add_or_remove_items'        => 'Add or remove brands',
        'choose_from_most_used'      => 'Choose from most used brands',
        'menu_name'                  => 'Brands',
    );

    register_taxonomy('product_brand', 'products', array(
        'hierarchical'      => false,
        'labels'            => $brand_labels,
        'show_ui'           => true,
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'brand'),
    ));

    // Product Tags (optional - for additional filtering)
    $tag_labels = array(
        'name'                       => 'Product Tags',
        'singular_name'              => 'Product Tag',
        'search_items'               => 'Search Tags',
        'popular_items'              => 'Popular Tags',
        'all_items'                  => 'All Tags',
        'edit_item'                  => 'Edit Tag',
        'update_item'                => 'Update Tag',
        'add_new_item'               => 'Add New Tag',
        'new_item_name'              => 'New Tag Name',
        'separate_items_with_commas' => 'Separate tags with commas',
        'add_or_remove_items'        => 'Add or remove tags',
        'choose_from_most_used'      => 'Choose from most used tags',
        'menu_name'                  => 'Tags',
    );

    register_taxonomy('product_tag', 'products', array(
        'hierarchical'      => false,
        'labels'            => $tag_labels,
        'show_ui'           => true,
        'show_in_rest'      => true,
        'show_admin_column' => false,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'tag'),
    ));
}
add_action('init', 'market_time_register_product_taxonomy');

/**
 * TASK 9: ACF Field Groups Configuration
 *
 * Creates Advanced Custom Fields for Products CPT
 */
function market_time_register_acf_fields() {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group(array(
        'key' => 'group_product_details',
        'title' => 'Product Details',
        'fields' => array(
            // SKU / Product ID
            array(
                'key' => 'field_product_sku',
                'label' => 'SKU / Product ID',
                'name' => 'product_sku',
                'type' => 'text',
                'required' => 0,
                'instructions' => 'Unique product identifier from feed',
                'maxlength' => 100,
            ),
            // Price Regular (pret_intreg)
            array(
                'key' => 'field_price_regular',
                'label' => 'Regular Price (Preț Întreg)',
                'name' => 'price_regular',
                'type' => 'number',
                'required' => 0,
                'min' => 0,
                'step' => 0.01,
                'prepend' => 'RON',
                'instructions' => 'Original price before discount',
            ),
            // Price Sale (pret_redus) - PRIMARY PRICE
            array(
                'key' => 'field_product_price',
                'label' => 'Sale Price (Preț Redus)',
                'name' => 'product_price',
                'type' => 'number',
                'required' => 1,
                'min' => 0,
                'step' => 0.01,
                'prepend' => 'RON',
                'instructions' => 'Current sale price (used for display)',
            ),
            // Discount Percentage (auto-calculated)
            array(
                'key' => 'field_discount_percentage',
                'label' => 'Discount %',
                'name' => 'discount_percentage',
                'type' => 'number',
                'required' => 0,
                'readonly' => 1,
                'min' => 0,
                'max' => 100,
                'step' => 1,
                'append' => '%',
                'instructions' => 'Auto-calculated from regular vs sale price',
            ),
            // Brand
            array(
                'key' => 'field_product_brand',
                'label' => 'Brand',
                'name' => 'brand',
                'type' => 'text',
                'required' => 0,
                'maxlength' => 100,
                'instructions' => 'Product brand (Samsung, Apple, Nike, etc.)',
            ),
            // Vendor
            array(
                'key' => 'field_product_vendor',
                'label' => 'Vendor / Advertiser',
                'name' => 'vendor',
                'type' => 'text',
                'required' => 0,
                'maxlength' => 100,
                'instructions' => 'Affiliate network advertiser name',
            ),
            // Merchant Name
            array(
                'key' => 'field_merchant_name',
                'label' => 'Merchant Name',
                'name' => 'merchant_name',
                'type' => 'text',
                'required' => 1,
                'maxlength' => 100,
                'instructions' => 'Store name (eMAG, Altex, etc.)',
            ),
            // Merchant ID
            array(
                'key' => 'field_merchant_id',
                'label' => 'Merchant ID',
                'name' => 'merchant_id',
                'type' => 'number',
                'required' => 1,
                'min' => 1,
            ),
            // Affiliate Code / Tracking
            array(
                'key' => 'field_affiliate_code',
                'label' => 'Affiliate Tracking Code',
                'name' => 'affiliate_code',
                'type' => 'text',
                'required' => 0,
                'instructions' => '2Performant or Profitshare tracking code',
            ),
            // Product URL (affiliate link)
            array(
                'key' => 'field_product_url',
                'label' => 'Product URL (Affiliate Link)',
                'name' => 'product_url',
                'type' => 'url',
                'required' => 1,
            ),
            // External Image URL (Primary CDN)
            array(
                'key' => 'field_external_image_url',
                'label' => 'Primary Image URL',
                'name' => 'external_image_url',
                'type' => 'url',
                'required' => 0,
                'instructions' => 'Main product image URL from feed',
            ),
            // Gallery Images (Multiple URLs)
            array(
                'key' => 'field_gallery_images',
                'label' => 'Gallery Images',
                'name' => 'gallery_images',
                'type' => 'textarea',
                'required' => 0,
                'instructions' => 'Additional product images, one URL per line',
                'rows' => 5,
            ),
            // Short Description
            array(
                'key' => 'field_short_description',
                'label' => 'Short Description',
                'name' => 'short_description',
                'type' => 'textarea',
                'required' => 0,
                'rows' => 3,
                'maxlength' => 255,
                'instructions' => 'Brief product description for listings (max 255 chars)',
            ),
            // NOTE: Long description uses WordPress native post_content (editor)

            // Category IDs (DEPRECATED - use WordPress taxonomy instead)
            array(
                'key' => 'field_category_ids',
                'label' => 'Category IDs (Legacy)',
                'name' => 'category_ids',
                'type' => 'select',
                'required' => 0,
                'multiple' => 1,
                'instructions' => 'DEPRECATED: Use WordPress Categories taxonomy instead',
                'choices' => array(
                    '1' => 'Laptops',
                    '2' => 'Phones',
                    '3' => 'Tablets',
                    '8' => 'Shoes',
                    '9' => 'Clothing',
                    '10' => 'Accessories',
                    '15' => 'Furniture',
                    '16' => 'Decor',
                    '20' => 'Gifts',
                    '25' => 'Sports Equipment',
                ),
            ),
            // Last Updated
            array(
                'key' => 'field_last_updated',
                'label' => 'Last Updated',
                'name' => 'last_updated',
                'type' => 'date_time_picker',
                'required' => 0,
                'display_format' => 'd/m/Y H:i',
                'return_format' => 'Y-m-d H:i:s',
            ),
            // AI Descriptions (JSON - will be populated by AI)
            array(
                'key' => 'field_ai_descriptions',
                'label' => 'AI Descriptions (JSON)',
                'name' => 'ai_descriptions',
                'type' => 'textarea',
                'required' => 0,
                'instructions' => 'Auto-generated AI descriptions per domain (JSON format)',
                'rows' => 8,
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'products',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
    ));
}
add_action('acf/init', 'market_time_register_acf_fields');

/**
 * Add custom capabilities for Products CPT
 */
function market_time_add_product_caps() {
    $role = get_role('administrator');

    if ($role) {
        $role->add_cap('edit_product');
        $role->add_cap('read_product');
        $role->add_cap('delete_product');
        $role->add_cap('edit_products');
        $role->add_cap('edit_others_products');
        $role->add_cap('publish_products');
        $role->add_cap('read_private_products');
        $role->add_cap('delete_products');
    }
}
add_action('admin_init', 'market_time_add_product_caps');

/**
 * Flush rewrite rules on theme activation
 */
function market_time_theme_activation() {
    market_time_register_product_cpt();
    market_time_register_product_taxonomy();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'market_time_theme_activation');

/**
 * Auto-update last_updated field on product save
 */
function market_time_auto_update_timestamp($post_id) {
    if (get_post_type($post_id) !== 'products') {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Check if ACF function exists
    if (function_exists('update_field')) {
        update_field('last_updated', current_time('Y-m-d H:i:s'), $post_id);
    }
}
add_action('save_post_products', 'market_time_auto_update_timestamp', 20);

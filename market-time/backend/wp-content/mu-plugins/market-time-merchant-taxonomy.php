<?php
/**
 * Plugin Name: Market-Time Merchant Taxonomy & SEO
 * Description: Creates Merchant taxonomy for products with SEO fields
 * Version: 1.0.0
 * Author: Market-Time.ro
 */

if (!defined('ABSPATH')) {
    exit;
}

class MarketTime_Merchant_Taxonomy {

    public function __construct() {
        // Register taxonomy
        add_action('init', [$this, 'register_merchant_taxonomy']);

        // Add custom fields
        add_action('merchant_add_form_fields', [$this, 'add_merchant_fields']);
        add_action('merchant_edit_form_fields', [$this, 'edit_merchant_fields']);

        // Save custom fields
        add_action('created_merchant', [$this, 'save_merchant_fields']);
        add_action('edited_merchant', [$this, 'save_merchant_fields']);

        // Add columns to merchant list table
        add_filter('manage_edit-merchant_columns', [$this, 'add_merchant_columns']);
        add_filter('manage_merchant_custom_column', [$this, 'add_merchant_column_content'], 10, 3);
    }

    /**
     * Register Merchant Taxonomy
     */
    public function register_merchant_taxonomy() {
        $labels = array(
            'name'                       => 'Merchants',
            'singular_name'              => 'Merchant',
            'search_items'               => 'Search Merchants',
            'popular_items'              => 'Popular Merchants',
            'all_items'                  => 'All Merchants',
            'edit_item'                  => 'Edit Merchant',
            'update_item'                => 'Update Merchant',
            'add_new_item'               => 'Add New Merchant',
            'new_item_name'              => 'New Merchant Name',
            'separate_items_with_commas' => 'Separate merchants with commas',
            'add_or_remove_items'        => 'Add or remove merchants',
            'choose_from_most_used'      => 'Choose from most used merchants',
            'menu_name'                  => 'Merchants',
        );

        register_taxonomy('merchant', 'products', array(
            'hierarchical'      => false,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_in_rest'      => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'magazin'),
        ));
    }

    /**
     * Add fields when creating a new merchant
     */
    public function add_merchant_fields() {
        ?>
        <div class="form-field">
            <label for="merchant_id"><?php _e('Merchant ID', 'market-time'); ?></label>
            <input type="number" name="merchant_id" id="merchant_id" value="" />
            <p class="description"><?php _e('Unique merchant identifier from affiliate network.', 'market-time'); ?></p>
        </div>

        <div class="form-field">
            <label for="seo_title"><?php _e('SEO Title', 'market-time'); ?></label>
            <input type="text" name="seo_title" id="seo_title" value="" />
            <p class="description"><?php _e('Custom title for search engines. Leave empty to use merchant name.', 'market-time'); ?></p>
        </div>

        <div class="form-field">
            <label for="seo_meta_description"><?php _e('Meta Description', 'market-time'); ?></label>
            <textarea name="seo_meta_description" id="seo_meta_description" rows="3" cols="50"></textarea>
            <p class="description"><?php _e('Description for search engines (150-160 characters recommended).', 'market-time'); ?></p>
        </div>

        <div class="form-field">
            <label for="seo_meta_keywords"><?php _e('Meta Keywords', 'market-time'); ?></label>
            <input type="text" name="seo_meta_keywords" id="seo_meta_keywords" value="" />
            <p class="description"><?php _e('Comma-separated keywords for this merchant.', 'market-time'); ?></p>
        </div>

        <div class="form-field">
            <label for="seo_content"><?php _e('SEO Content (Optional)', 'market-time'); ?></label>
            <?php
            wp_editor('', 'seo_content', [
                'textarea_name' => 'seo_content',
                'textarea_rows' => 8,
                'media_buttons' => false,
                'teeny' => true,
            ]);
            ?>
            <p class="description"><?php _e('Additional SEO content to display on merchant page (below products).', 'market-time'); ?></p>
        </div>
        <?php
    }

    /**
     * Add fields when editing an existing merchant
     */
    public function edit_merchant_fields($term) {
        $term_id = $term->term_id;

        // Get existing values
        $merchant_id = get_term_meta($term_id, 'merchant_id', true);
        $seo_title = get_term_meta($term_id, 'seo_title', true);
        $seo_meta_description = get_term_meta($term_id, 'seo_meta_description', true);
        $seo_meta_keywords = get_term_meta($term_id, 'seo_meta_keywords', true);
        $seo_content = get_term_meta($term_id, 'seo_content', true);
        ?>
        <tr class="form-field">
            <th scope="row">
                <label for="merchant_id"><?php _e('Merchant ID', 'market-time'); ?></label>
            </th>
            <td>
                <input type="number" name="merchant_id" id="merchant_id" value="<?php echo esc_attr($merchant_id); ?>" class="regular-text" />
                <p class="description"><?php _e('Unique merchant identifier from affiliate network.', 'market-time'); ?></p>
            </td>
        </tr>

        <tr class="form-field">
            <th scope="row">
                <label for="seo_title"><?php _e('SEO Title', 'market-time'); ?></label>
            </th>
            <td>
                <input type="text" name="seo_title" id="seo_title" value="<?php echo esc_attr($seo_title); ?>" class="regular-text" />
                <p class="description"><?php _e('Custom title for search engines. Leave empty to use merchant name.', 'market-time'); ?></p>
                <p class="description"><strong><?php _e('Preview:', 'market-time'); ?></strong> <?php echo esc_html($seo_title ?: $term->name . ' - Produse și Oferte'); ?></p>
            </td>
        </tr>

        <tr class="form-field">
            <th scope="row">
                <label for="seo_meta_description"><?php _e('Meta Description', 'market-time'); ?></label>
            </th>
            <td>
                <textarea name="seo_meta_description" id="seo_meta_description" rows="3" cols="50" class="large-text"><?php echo esc_textarea($seo_meta_description); ?></textarea>
                <p class="description">
                    <?php _e('Description for search engines (150-160 characters recommended).', 'market-time'); ?>
                    <span id="meta-desc-counter-merchant" style="font-weight: bold; color: <?php echo strlen($seo_meta_description) > 160 ? 'red' : 'green'; ?>;">
                        <?php echo strlen($seo_meta_description); ?> characters
                    </span>
                </p>
            </td>
        </tr>

        <tr class="form-field">
            <th scope="row">
                <label for="seo_meta_keywords"><?php _e('Meta Keywords', 'market-time'); ?></label>
            </th>
            <td>
                <input type="text" name="seo_meta_keywords" id="seo_meta_keywords" value="<?php echo esc_attr($seo_meta_keywords); ?>" class="large-text" />
                <p class="description"><?php _e('Comma-separated keywords (e.g., eMAG, eMAG Romania, magazine online).', 'market-time'); ?></p>
            </td>
        </tr>

        <tr class="form-field">
            <th scope="row">
                <label for="seo_content"><?php _e('Additional SEO Content', 'market-time'); ?></label>
            </th>
            <td>
                <?php
                wp_editor($seo_content, 'seo_content', [
                    'textarea_name' => 'seo_content',
                    'textarea_rows' => 10,
                    'media_buttons' => true,
                    'teeny' => false,
                ]);
                ?>
                <p class="description"><?php _e('Additional SEO-rich content to display on the merchant page (below products).', 'market-time'); ?></p>
            </td>
        </tr>

        <script type="text/javascript">
        jQuery(document).ready(function($) {
            // Character counter for meta description
            $('#seo_meta_description').on('input', function() {
                var length = $(this).val().length;
                var counter = $('#meta-desc-counter-merchant');
                counter.text(length + ' characters');

                if (length > 160) {
                    counter.css('color', 'red');
                } else if (length < 120) {
                    counter.css('color', 'orange');
                } else {
                    counter.css('color', 'green');
                }
            });
        });
        </script>
        <?php
    }

    /**
     * Save custom fields
     */
    public function save_merchant_fields($term_id) {
        if (isset($_POST['merchant_id'])) {
            update_term_meta($term_id, 'merchant_id', absint($_POST['merchant_id']));
        }

        if (isset($_POST['seo_title'])) {
            update_term_meta($term_id, 'seo_title', sanitize_text_field($_POST['seo_title']));
        }

        if (isset($_POST['seo_meta_description'])) {
            update_term_meta($term_id, 'seo_meta_description', sanitize_textarea_field($_POST['seo_meta_description']));
        }

        if (isset($_POST['seo_meta_keywords'])) {
            update_term_meta($term_id, 'seo_meta_keywords', sanitize_text_field($_POST['seo_meta_keywords']));
        }

        if (isset($_POST['seo_content'])) {
            update_term_meta($term_id, 'seo_content', wp_kses_post($_POST['seo_content']));
        }
    }

    /**
     * Add custom columns to merchant list
     */
    public function add_merchant_columns($columns) {
        $new_columns = [];

        foreach ($columns as $key => $value) {
            $new_columns[$key] = $value;

            // Add SEO column after name
            if ($key === 'name') {
                $new_columns['merchant_id_col'] = __('Merchant ID', 'market-time');
                $new_columns['seo_status'] = __('SEO Status', 'market-time');
            }
        }

        return $new_columns;
    }

    /**
     * Display custom column content
     */
    public function add_merchant_column_content($content, $column_name, $term_id) {
        if ($column_name === 'merchant_id_col') {
            $merchant_id = get_term_meta($term_id, 'merchant_id', true);
            $content = $merchant_id ? '<strong>#' . $merchant_id . '</strong>' : '<span style="color: red;">Not set</span>';
        }

        if ($column_name === 'seo_status') {
            $seo_title = get_term_meta($term_id, 'seo_title', true);
            $seo_meta_description = get_term_meta($term_id, 'seo_meta_description', true);
            $seo_meta_keywords = get_term_meta($term_id, 'seo_meta_keywords', true);

            $status = [];

            if (!empty($seo_title)) {
                $status[] = '<span style="color: green;">✓ Title</span>';
            } else {
                $status[] = '<span style="color: orange;">⚠ Title</span>';
            }

            if (!empty($seo_meta_description)) {
                $desc_length = strlen($seo_meta_description);
                if ($desc_length >= 120 && $desc_length <= 160) {
                    $status[] = '<span style="color: green;">✓ Desc</span>';
                } else {
                    $status[] = '<span style="color: orange;">⚠ Desc (' . $desc_length . ')</span>';
                }
            } else {
                $status[] = '<span style="color: red;">✗ Desc</span>';
            }

            if (!empty($seo_meta_keywords)) {
                $status[] = '<span style="color: green;">✓ Keywords</span>';
            } else {
                $status[] = '<span style="color: orange;">⚠ Keywords</span>';
            }

            $content = implode(' | ', $status);
        }

        return $content;
    }
}

// Initialize the plugin
new MarketTime_Merchant_Taxonomy();

/**
 * Helper function to get merchant SEO data
 * Usage in API: get_merchant_seo_data($term_id)
 */
function get_merchant_seo_data($term_id) {
    $term = get_term($term_id, 'merchant');

    if (!$term || is_wp_error($term)) {
        return null;
    }

    return [
        'merchant_id' => get_term_meta($term_id, 'merchant_id', true) ?: 0,
        'seo_title' => get_term_meta($term_id, 'seo_title', true) ?: $term->name . ' - Produse și Oferte',
        'seo_meta_description' => get_term_meta($term_id, 'seo_meta_description', true) ?: '',
        'seo_meta_keywords' => get_term_meta($term_id, 'seo_meta_keywords', true) ?: '',
        'seo_content' => get_term_meta($term_id, 'seo_content', true) ?: '',
        'description' => $term->description ?: '', // Native WordPress description
    ];
}

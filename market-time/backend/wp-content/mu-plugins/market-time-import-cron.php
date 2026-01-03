<?php
/**
 * Market-Time Import Cron
 *
 * Automatic import scheduling using WordPress Cron
 * FREE alternative to WP All Import's paid scheduling
 *
 * @package Market-Time
 * @version 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Schedule the import cron event
 */
function market_time_schedule_import_cron() {
    // Schedule event if not already scheduled
    if (!wp_next_scheduled('market_time_run_import')) {
        // Run every 6 hours
        wp_schedule_event(time(), 'sixhourly', 'market_time_run_import');
        error_log('Market-Time: Import cron scheduled (every 6 hours)');
    }
}
add_action('init', 'market_time_schedule_import_cron');

/**
 * Add custom cron schedule for 6 hours
 */
function market_time_custom_cron_schedules($schedules) {
    $schedules['sixhourly'] = array(
        'interval' => 6 * 60 * 60, // 6 hours in seconds
        'display'  => __('Every 6 Hours')
    );
    return $schedules;
}
add_filter('cron_schedules', 'market_time_custom_cron_schedules');

/**
 * Run the import via WP All Import's own trigger
 */
function market_time_run_import_cron() {
    if (!class_exists('PMXI_Plugin')) {
        error_log('Market-Time Cron: WP All Import not found');
        return;
    }

    global $wpdb;

    // Get all active imports
    $table = $wpdb->prefix . 'pmxi_imports';
    $imports = $wpdb->get_results("SELECT id FROM $table WHERE deleted = 0");

    if (empty($imports)) {
        error_log('Market-Time Cron: No imports configured');
        return;
    }

    foreach ($imports as $import) {
        error_log("Market-Time Cron: Triggering import ID {$import->id}");

        // Trigger import using WP All Import's cron processing URL
        // This simulates clicking "Run Import" in the admin
        $url = admin_url('admin.php?page=pmxi-admin-manage&id=' . $import->id . '&action=update&type=upload');

        // Use wp_remote_post to trigger the import
        $response = wp_remote_post($url, array(
            'timeout' => 300,
            'sslverify' => false,
            'body' => array(
                'is_cron' => '1'
            )
        ));

        if (is_wp_error($response)) {
            error_log('Market-Time Cron: Import failed - ' . $response->get_error_message());
        } else {
            error_log('Market-Time Cron: Import triggered successfully for ID ' . $import->id);
        }
    }
}
add_action('market_time_run_import', 'market_time_run_import_cron');

/**
 * Manually trigger import (for testing)
 * Access via: yourdomain.com/?market_time_trigger_import=1
 */
function market_time_manual_import_trigger() {
    if (isset($_GET['market_time_trigger_import']) && current_user_can('manage_options')) {
        error_log('Market-Time: Manual import triggered');
        market_time_run_import_cron();
        wp_die('Import triggered! Check logs or WP All Import dashboard.');
    }
}
add_action('init', 'market_time_manual_import_trigger');

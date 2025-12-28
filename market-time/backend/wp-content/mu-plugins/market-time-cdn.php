<?php
/**
 * Market-Time CDN Integration
 *
 * TASK 14-17: BunnyCDN + Cloudinary fallback for images
 *
 * @package MarketTime
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * CDN Configuration
 *
 * To configure:
 * 1. Create BunnyCDN Pull Zone at bunny.net
 * 2. Set origin URL to your WordPress site
 * 3. Add CDN URL to wp-config.php:
 *    define('BUNNYCDN_URL', 'https://xyz.b-cdn.net');
 *    OR
 *    define('BUNNYCDN_URL', 'https://cdn.market-time.ro'); // custom domain
 * 4. (Optional) For Cloudinary fallback:
 *    define('CLOUDINARY_CLOUD_NAME', 'your-cloud-name');
 *    define('CLOUDINARY_API_KEY', 'your-api-key');
 *    define('CLOUDINARY_API_SECRET', 'your-api-secret');
 */

/**
 * TASK 16 & 17: Filter all attachment URLs to use CDN
 *
 * Replaces site URL with CDN URL for all images
 */
function market_time_cdn_attachment_url($url) {
    // Check if BunnyCDN is configured
    if (!defined('BUNNYCDN_URL') || empty(BUNNYCDN_URL)) {
        return $url;
    }

    $site_url = get_site_url();
    $cdn_url = rtrim(BUNNYCDN_URL, '/');

    // Replace site URL with CDN URL
    $cdn_url_final = str_replace($site_url, $cdn_url, $url);

    return $cdn_url_final;
}
add_filter('wp_get_attachment_url', 'market_time_cdn_attachment_url');
add_filter('wp_get_attachment_image_src', function($image) {
    if (isset($image[0])) {
        $image[0] = market_time_cdn_attachment_url($image[0]);
    }
    return $image;
});

/**
 * Upload to Cloudinary for external products
 *
 * When a product is saved with an external image URL,
 * upload it to Cloudinary and save the CDN URL
 */
function market_time_upload_to_cloudinary($image_url) {
    // Check if Cloudinary is configured
    if (!defined('CLOUDINARY_CLOUD_NAME') ||
        !defined('CLOUDINARY_API_KEY') ||
        !defined('CLOUDINARY_API_SECRET')) {
        return $image_url; // Return original URL if not configured
    }

    $cloud_name = CLOUDINARY_CLOUD_NAME;
    $api_key = CLOUDINARY_API_KEY;
    $api_secret = CLOUDINARY_API_SECRET;

    // Generate upload signature
    $timestamp = time();
    $params_to_sign = [
        'timestamp' => $timestamp,
        'folder' => 'market-time-products',
    ];

    ksort($params_to_sign);
    $signature_string = '';
    foreach ($params_to_sign as $key => $value) {
        $signature_string .= $key . '=' . $value . '&';
    }
    $signature_string .= $api_secret;
    $signature = sha1($signature_string);

    // Prepare upload request
    $upload_url = "https://api.cloudinary.com/v1_1/{$cloud_name}/image/upload";

    $post_data = [
        'file' => $image_url,
        'folder' => 'market-time-products',
        'timestamp' => $timestamp,
        'api_key' => $api_key,
        'signature' => $signature,
    ];

    // Send request to Cloudinary
    $response = wp_remote_post($upload_url, [
        'body' => $post_data,
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        error_log('Market-Time CDN: Cloudinary upload failed - ' . $response->get_error_message());
        return $image_url;
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    if (isset($data['secure_url'])) {
        return $data['secure_url'];
    }

    error_log('Market-Time CDN: Cloudinary upload failed - Invalid response');
    return $image_url;
}

/**
 * Process external image URL on product save
 *
 * For products with external image URLs (from merchants),
 * optionally upload to Cloudinary and delete local copy
 */
function market_time_process_external_image($post_id) {
    if (get_post_type($post_id) !== 'products') {
        return;
    }

    // Check if ACF is available
    if (!function_exists('get_field')) {
        return;
    }

    $external_image_url = get_field('external_image_url', $post_id);

    if (empty($external_image_url)) {
        return;
    }

    // Check if URL is already from Cloudinary or BunnyCDN
    if (strpos($external_image_url, 'cloudinary.com') !== false ||
        strpos($external_image_url, 'b-cdn.net') !== false) {
        return; // Already on CDN
    }

    // Upload to Cloudinary if configured
    if (defined('CLOUDINARY_CLOUD_NAME')) {
        $cdn_url = market_time_upload_to_cloudinary($external_image_url);

        if ($cdn_url !== $external_image_url) {
            // Update the ACF field with CDN URL
            update_field('external_image_url', $cdn_url, $post_id);
            error_log("Market-Time CDN: Uploaded product {$post_id} image to Cloudinary");
        }
    }
}
add_action('save_post_products', 'market_time_process_external_image', 25);

/**
 * Admin notice for CDN configuration
 */
function market_time_cdn_admin_notice() {
    if (!defined('BUNNYCDN_URL')) {
        ?>
        <div class="notice notice-info">
            <p><strong>Market-Time CDN:</strong> BunnyCDN is not configured. Add <code>define('BUNNYCDN_URL', 'https://your-cdn-url.b-cdn.net');</code> to wp-config.php for CDN support.</p>
            <p><a href="https://bunny.net" target="_blank">Create BunnyCDN Account</a> (Free trial available)</p>
        </div>
        <?php
    }

    if (!defined('CLOUDINARY_CLOUD_NAME')) {
        ?>
        <div class="notice notice-info is-dismissible">
            <p><strong>Market-Time CDN:</strong> Cloudinary fallback is not configured. For automatic image uploads from external merchants, configure Cloudinary credentials in wp-config.php.</p>
        </div>
        <?php
    }
}
add_action('admin_notices', 'market_time_cdn_admin_notice');

/**
 * Helper function to get optimized image URL
 *
 * Returns CDN URL with optional transformations
 */
function market_time_get_image_url($image_url, $width = null, $height = null, $quality = 85) {
    if (empty($image_url)) {
        return '';
    }

    // If using Cloudinary, add transformations
    if (strpos($image_url, 'cloudinary.com') !== false) {
        $transformations = [];

        if ($width) {
            $transformations[] = "w_{$width}";
        }
        if ($height) {
            $transformations[] = "h_{$height}";
        }
        $transformations[] = "q_{$quality}";
        $transformations[] = "f_auto"; // Auto format (WebP, AVIF)

        if (!empty($transformations)) {
            $transform_string = implode(',', $transformations);
            $image_url = str_replace('/upload/', "/upload/{$transform_string}/", $image_url);
        }
    }

    return $image_url;
}

/**
 * Add CDN info to REST API product response
 */
function market_time_add_cdn_to_rest_response($response, $post, $request) {
    if ($post->post_type !== 'products') {
        return $response;
    }

    $data = $response->get_data();

    // Add CDN URL info
    $external_image = get_field('external_image_url', $post->ID);
    $featured_image = get_the_post_thumbnail_url($post->ID, 'large');

    $data['image_cdn'] = [
        'original' => $external_image ?: $featured_image,
        'thumbnail' => market_time_get_image_url($external_image ?: $featured_image, 300, 300),
        'medium' => market_time_get_image_url($external_image ?: $featured_image, 600, 600),
        'large' => market_time_get_image_url($external_image ?: $featured_image, 1200, 1200),
    ];

    $response->set_data($data);
    return $response;
}
add_filter('rest_prepare_products', 'market_time_add_cdn_to_rest_response', 10, 3);

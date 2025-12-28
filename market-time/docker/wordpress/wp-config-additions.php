<?php
/**
 * Market-Time WordPress Configuration Additions
 *
 * This file is automatically included by the Docker entrypoint script
 */

// OpenRouter API Configuration
if (getenv('OPENROUTER_API_KEY')) {
    define('OPENROUTER_API_KEY', getenv('OPENROUTER_API_KEY'));
}
if (getenv('OPENROUTER_MODEL')) {
    define('OPENROUTER_MODEL', getenv('OPENROUTER_MODEL'));
}

// CDN Configuration
if (getenv('BUNNYCDN_URL')) {
    define('BUNNYCDN_URL', getenv('BUNNYCDN_URL'));
}

// Cloudinary Configuration
if (getenv('CLOUDINARY_CLOUD_NAME')) {
    define('CLOUDINARY_CLOUD_NAME', getenv('CLOUDINARY_CLOUD_NAME'));
}
if (getenv('CLOUDINARY_API_KEY')) {
    define('CLOUDINARY_API_KEY', getenv('CLOUDINARY_API_KEY'));
}
if (getenv('CLOUDINARY_API_SECRET')) {
    define('CLOUDINARY_API_SECRET', getenv('CLOUDINARY_API_SECRET'));
}

// Category to Site Mapping
define('SITE_CATEGORY_MAP', serialize(array(
    1 => array('all'),           // Main site - all categories
    2 => array(1, 2, 3),          // electronica.market-time.ro
    3 => array(8, 9, 10),         // fashion.market-time.ro
    4 => array(8),                // incaltaminte.market-time.ro
    5 => array(15, 16),           // casa-living.market-time.ro
    6 => array(20),               // cadouri.market-time.ro
    7 => array(25),               // sport-fitness.market-time.ro
)));

// Development settings
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);

// Increase memory limit for large product imports
define('WP_MEMORY_LIMIT', '512M');
define('WP_MAX_MEMORY_LIMIT', '512M');

// Disable automatic updates (handled manually)
define('AUTOMATIC_UPDATER_DISABLED', true);
define('WP_AUTO_UPDATE_CORE', false);

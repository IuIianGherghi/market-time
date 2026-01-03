<?php
/**
 * Market-Time Import Helper Functions
 *
 * Funcții helper pentru WP All Import:
 * - Category mapping automat
 * - Merchant ID extraction
 * - Affiliate code extraction
 * - Image extraction (prima imagine din listă)
 *
 * @package Market-Time
 * @version 1.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Mapare automată categorii din feed către WordPress taxonomies
 *
 * Folosește keyword matching pentru a potrivi categoriile din feed
 * cu categoriile WordPress predefinite.
 *
 * @param string $feed_category - Categoria din feed (ex: "Health & Beauty > Health Care > Suplimente nutritive")
 * @return string - Slug-ul categoriei WordPress (ex: "health-beauty")
 */
function market_time_map_category($feed_category) {
    if (empty($feed_category)) {
        return 'uncategorized';
    }

    // Convertește la lowercase pentru matching
    $feed_lower = strtolower($feed_category);

    // Mapping table - categorii WordPress → keywords din feed
    $category_map = array(
        'electronics-it' => array('electronic', 'computer', 'laptop', 'telefon', 'tablet', 'gadget', 'tech'),
        'fashion-beauty' => array('fashion', 'beauty', 'haine', 'imbracaminte', 'cosmetice', 'makeup', 'parfum'),
        'home-garden' => array('home', 'garden', 'casa', 'gradina', 'mobilier', 'decoratiuni'),
        'health-sports' => array('health', 'sport', 'fitness', 'supliment', 'nutritie', 'vitamina', 'sanatate'),
        'auto-moto' => array('auto', 'moto', 'masina', 'motocicleta', 'accesorii auto'),
        'kids-toys' => array('kids', 'toys', 'copii', 'jucarii', 'bebe', 'baby'),
        'food-drink' => array('food', 'drink', 'mancare', 'bautura', 'alimente'),
        'books-media' => array('book', 'media', 'carte', 'film', 'muzica', 'joc'),
    );

    // Caută match în keywords
    foreach ($category_map as $wp_category => $keywords) {
        foreach ($keywords as $keyword) {
            if (strpos($feed_lower, $keyword) !== false) {
                error_log("Market-Time Import: Mapped '$feed_category' → '$wp_category'");
                return $wp_category;
            }
        }
    }

    // Fallback la uncategorized
    error_log("Market-Time Import: No match for '$feed_category', using fallback 'uncategorized'");
    return 'uncategorized';
}

/**
 * Extrage merchant ID din campaign name sau alt câmp
 *
 * @param string $campaign_name - Numele campaniei (ex: "eMAG - Electronics")
 * @return string - Merchant ID (ex: "emag")
 */
function market_time_extract_merchant_id($campaign_name) {
    if (empty($campaign_name)) {
        return 'unknown';
    }

    // Convertește la lowercase și elimină spații
    $merchant = strtolower(trim($campaign_name));

    // Extrage primul cuvânt (de obicei e numele merchant-ului)
    $parts = explode(' ', $merchant);
    $merchant_id = preg_replace('/[^a-z0-9-]/', '', $parts[0]);

    // Mapare cunoscută pentru merchant-i comuni
    $known_merchants = array(
        'emag' => 'emag',
        'altex' => 'altex',
        'flanco' => 'flanco',
        'pcgarage' => 'pcgarage',
        'cel.ro' => 'cel',
        'cel' => 'cel',
        'fashion days' => 'fashiondays',
        'fashiondays' => 'fashiondays',
        'answear' => 'answear',
        'aboutyou' => 'aboutyou',
    );

    foreach ($known_merchants as $pattern => $id) {
        if (strpos($merchant, $pattern) !== false) {
            return $id;
        }
    }

    return $merchant_id;
}

/**
 * Extrage affiliate code din URL
 *
 * @param string $affiliate_url - URL-ul cu tracking (ex: "https://track.2performant.com/click?...")
 * @return string - Codul de afiliere (ex: "aff123")
 */
function market_time_extract_affiliate_code($affiliate_url) {
    if (empty($affiliate_url)) {
        return '';
    }

    // Parse URL și extrage parametri
    $parsed = parse_url($affiliate_url);

    if (!isset($parsed['query'])) {
        return '';
    }

    parse_str($parsed['query'], $params);

    // Caută parametri comuni de tracking
    $tracking_params = array('unique_id', 'aff_unique', 'aff_id', 'affiliate_id', 'unique');

    foreach ($tracking_params as $param) {
        if (isset($params[$param])) {
            return $params[$param];
        }
    }

    return '';
}

/**
 * Extrage prima imagine din listă separată prin virgulă
 *
 * @param string $image_list - Lista de URL-uri separate prin virgulă
 * @return string - URL-ul primei imagini
 */
function market_time_extract_first_image($image_list) {
    if (empty($image_list)) {
        return '';
    }

    // Split prin virgulă și ia primul element
    $images = array_map('trim', explode(',', $image_list));

    // Returnează prima imagine non-empty
    foreach ($images as $image) {
        if (!empty($image) && filter_var($image, FILTER_VALIDATE_URL)) {
            return $image;
        }
    }

    return '';
}

/**
 * Extrage toate imaginile din listă pentru gallery
 * Returnează array serializat pentru ACF gallery
 *
 * @param string $image_list - Lista de URL-uri separate prin virgulă
 * @return string - JSON array cu URL-uri
 */
function market_time_extract_gallery_images($image_list) {
    if (empty($image_list)) {
        return '';
    }

    // Split prin virgulă și validează
    $images = array_map('trim', explode(',', $image_list));
    $valid_images = array();

    foreach ($images as $image) {
        if (!empty($image) && filter_var($image, FILTER_VALIDATE_URL)) {
            $valid_images[] = $image;
        }
    }

    // Limitează la maxim 10 imagini pentru performance
    $valid_images = array_slice($valid_images, 0, 10);

    // Returnează ca string separat prin virgulă (ACF poate procesa așa)
    return implode(',', $valid_images);
}

/**
 * Calculează discount percentage automat
 *
 * @param float $price - Prețul curent
 * @param float $price_regular - Prețul vechi
 * @return int - Procentul de discount
 */
function market_time_calculate_discount($price, $price_regular) {
    $price = floatval($price);
    $price_regular = floatval($price_regular);

    if ($price_regular <= 0 || $price >= $price_regular) {
        return 0;
    }

    $discount = round((($price_regular - $price) / $price_regular) * 100);
    return max(0, min(100, $discount)); // Între 0-100%
}

/**
 * Validează și curăță SKU
 *
 * @param string $sku - SKU din feed
 * @return string - SKU curat
 */
function market_time_sanitize_sku($sku) {
    if (empty($sku)) {
        return '';
    }

    // Elimină caractere speciale, păstrează doar alfanumerice și dash
    $sku = preg_replace('/[^a-zA-Z0-9-_]/', '', $sku);

    // Limitează la 50 caractere
    return substr($sku, 0, 50);
}

/**
 * Auto-create merchant taxonomy term from merchant name and ID
 * Folosit la import pentru a crea automat merchant-ul în taxonomy
 *
 * @param string $merchant_name - Numele merchant-ului (ex: "DyFashion.ro")
 * @param int $merchant_id - ID-ul merchant-ului din feed (ex: 2405)
 * @return int|WP_Error - Term ID sau WP_Error
 */
function market_time_auto_create_merchant($merchant_name, $merchant_id) {
    if (empty($merchant_name) || empty($merchant_id)) {
        error_log("Market-Time: Cannot create merchant - missing name or ID");
        return null;
    }

    // Verifică dacă term-ul există deja după merchant_id
    $existing_terms = get_terms(array(
        'taxonomy' => 'merchant',
        'hide_empty' => false,
        'meta_query' => array(
            array(
                'key' => 'merchant_id',
                'value' => $merchant_id,
                'compare' => '='
            )
        )
    ));

    if (!empty($existing_terms) && !is_wp_error($existing_terms)) {
        error_log("Market-Time: Merchant already exists - ID: $merchant_id, Name: $merchant_name");
        return $existing_terms[0]->term_id;
    }

    // Generează slug din numele merchant-ului
    $slug = sanitize_title($merchant_name);

    // Creează term-ul merchant
    $term = wp_insert_term(
        $merchant_name, // Numele afișat
        'merchant',     // Taxonomy
        array(
            'slug' => $slug,
        )
    );

    if (is_wp_error($term)) {
        error_log("Market-Time: Error creating merchant term - " . $term->get_error_message());
        return $term;
    }

    $term_id = $term['term_id'];

    // Salvează merchant_id ca meta pentru term
    update_term_meta($term_id, 'merchant_id', $merchant_id);

    error_log("Market-Time: Created new merchant - ID: $merchant_id, Name: $merchant_name, Term ID: $term_id");

    return $term_id;
}

/**
 * Hook: Creare automată merchant la salvarea produsului (WP All Import)
 * Se execută înainte de salvarea produsului
 */
add_action('pmxi_saved_post', 'market_time_sync_merchant_on_import', 10, 1);

function market_time_sync_merchant_on_import($post_id) {
    // Verifică dacă e post type 'products'
    if (get_post_type($post_id) !== 'products') {
        return;
    }

    // Preia merchant_name și merchant_id din ACF fields
    $merchant_name = get_field('merchant_name', $post_id);
    $merchant_id = get_field('merchant_id', $post_id);

    if (empty($merchant_name) || empty($merchant_id)) {
        return;
    }

    // Creează sau găsește merchant-ul
    $term_id = market_time_auto_create_merchant($merchant_name, $merchant_id);

    if ($term_id && !is_wp_error($term_id)) {
        // Atașează merchant taxonomy la produs
        wp_set_object_terms($post_id, $term_id, 'merchant', false);
        error_log("Market-Time: Attached merchant (Term ID: $term_id) to product ID: $post_id");
    }
}

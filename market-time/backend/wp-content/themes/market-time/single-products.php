<?php
/**
 * Single Product Template
 *
 * Template pentru afișarea unui singur produs
 *
 * @package Market-Time
 * @version 1.0
 */

get_header();
?>

<main id="main" class="site-main product-single">
    <?php
    while (have_posts()) :
        the_post();

        // Get ACF fields
        $product_sku = get_field('product_sku');
        $product_price = get_field('product_price');
        $price_regular = get_field('price_regular');
        $discount_percentage = get_field('discount_percentage');
        $on_sale = get_field('on_sale');
        $merchant_name = get_field('merchant_name'); // Store name (DyFashion, eMAG, etc.)
        $product_image = get_field('product_image');
        $gallery_images = get_field('gallery_images');
        $affiliate_url = get_field('affiliate_url');
        $short_description = get_field('short_description');

        // Get taxonomies
        $categories = get_the_terms(get_the_ID(), 'product_category');
        $brands = get_the_terms(get_the_ID(), 'product_brand');
        ?>

        <article id="product-<?php the_ID(); ?>" <?php post_class('product'); ?>>

            <div class="product-container">

                <!-- Breadcrumbs -->
                <nav class="breadcrumbs">
                    <a href="<?php echo home_url('/'); ?>">Acasă</a>
                    <?php if ($categories && !is_wp_error($categories)) : ?>
                        <?php foreach ($categories as $category) : ?>
                            <span class="separator">/</span>
                            <a href="<?php echo get_term_link($category); ?>"><?php echo esc_html($category->name); ?></a>
                        <?php endforeach; ?>
                    <?php endif; ?>
                    <span class="separator">/</span>
                    <span class="current"><?php the_title(); ?></span>
                </nav>

                <!-- Product Header -->
                <header class="product-header">
                    <h1 class="product-title"><?php the_title(); ?></h1>

                    <?php if ($product_sku) : ?>
                        <p class="product-sku">SKU: <?php echo esc_html($product_sku); ?></p>
                    <?php endif; ?>

                    <?php if ($brands && !is_wp_error($brands)) : ?>
                        <p class="product-brand">
                            Brand:
                            <?php foreach ($brands as $brand) : ?>
                                <a href="<?php echo get_term_link($brand); ?>"><?php echo esc_html($brand->name); ?></a>
                            <?php endforeach; ?>
                        </p>
                    <?php endif; ?>
                </header>

                <div class="product-content">

                    <!-- Product Images -->
                    <div class="product-gallery">
                        <?php if ($product_image) : ?>
                            <div class="product-main-image">
                                <img src="<?php echo esc_url($product_image); ?>" alt="<?php the_title(); ?>" />
                            </div>
                        <?php endif; ?>

                        <?php if ($gallery_images) : ?>
                            <div class="product-gallery-thumbs">
                                <?php
                                $images = is_array($gallery_images) ? $gallery_images : explode(',', $gallery_images);
                                foreach ($images as $image_url) :
                                    $image_url = trim($image_url);
                                    if (!empty($image_url)) :
                                ?>
                                    <img src="<?php echo esc_url($image_url); ?>" alt="<?php the_title(); ?>" class="gallery-thumb" />
                                <?php
                                    endif;
                                endforeach;
                                ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- Product Info -->
                    <div class="product-info">

                        <!-- Price -->
                        <div class="product-price-section">
                            <?php if ($on_sale && $price_regular) : ?>
                                <p class="price-regular">
                                    <del><?php echo number_format($price_regular, 2); ?> RON</del>
                                </p>
                            <?php endif; ?>

                            <?php if ($product_price) : ?>
                                <p class="price-current <?php echo $on_sale ? 'on-sale' : ''; ?>">
                                    <?php echo number_format($product_price, 2); ?> RON
                                </p>
                            <?php endif; ?>

                            <?php if ($discount_percentage > 0) : ?>
                                <span class="discount-badge">-<?php echo intval($discount_percentage); ?>%</span>
                            <?php endif; ?>
                        </div>

                        <!-- Merchant/Store -->
                        <?php if ($merchant_name) : ?>
                            <p class="product-vendor">
                                <strong>Magazin:</strong> <?php echo esc_html($merchant_name); ?>
                            </p>
                        <?php endif; ?>

                        <!-- Short Description -->
                        <?php if ($short_description) : ?>
                            <div class="product-short-description">
                                <?php echo wp_kses_post($short_description); ?>
                            </div>
                        <?php endif; ?>

                        <!-- Buy Button -->
                        <?php if ($affiliate_url) : ?>
                            <a href="<?php echo esc_url($affiliate_url); ?>"
                               class="btn-buy"
                               target="_blank"
                               rel="nofollow noopener">
                                Vezi Oferta →
                            </a>
                        <?php endif; ?>

                        <!-- Categories -->
                        <?php if ($categories && !is_wp_error($categories)) : ?>
                            <div class="product-categories">
                                <strong>Categorii:</strong>
                                <?php foreach ($categories as $category) : ?>
                                    <a href="<?php echo get_term_link($category); ?>" class="category-tag">
                                        <?php echo esc_html($category->name); ?>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>

                </div>

                <!-- Full Description -->
                <?php if (get_the_content()) : ?>
                    <div class="product-description">
                        <h2>Descriere</h2>
                        <?php the_content(); ?>
                    </div>
                <?php endif; ?>

            </div>

        </article>

    <?php endwhile; ?>
</main>

<style>
/* Basic Styling pentru Product Page */
.product-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.breadcrumbs {
    margin-bottom: 20px;
    font-size: 14px;
    color: #666;
}

.breadcrumbs a {
    color: #0066cc;
    text-decoration: none;
}

.breadcrumbs a:hover {
    text-decoration: underline;
}

.breadcrumbs .separator {
    margin: 0 8px;
}

.product-header {
    margin-bottom: 30px;
}

.product-title {
    font-size: 28px;
    margin-bottom: 10px;
    color: #333;
}

.product-sku, .product-brand {
    font-size: 14px;
    color: #666;
    margin: 5px 0;
}

.product-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.product-main-image img {
    width: 100%;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.product-gallery-thumbs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 10px;
}

.gallery-thumb {
    width: 100%;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
}

.product-price-section {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.price-regular {
    font-size: 18px;
    color: #999;
    margin-bottom: 5px;
}

.price-current {
    font-size: 32px;
    font-weight: bold;
    color: #333;
    margin: 10px 0;
}

.price-current.on-sale {
    color: #e74c3c;
}

.discount-badge {
    display: inline-block;
    background: #e74c3c;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
}

.product-vendor {
    margin: 15px 0;
    font-size: 16px;
}

.product-short-description {
    margin: 20px 0;
    line-height: 1.6;
    color: #555;
}

.btn-buy {
    display: inline-block;
    background: #27ae60;
    color: white;
    padding: 15px 40px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    transition: background 0.3s;
}

.btn-buy:hover {
    background: #229954;
}

.product-categories {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.category-tag {
    display: inline-block;
    background: #ecf0f1;
    padding: 5px 12px;
    border-radius: 4px;
    margin: 5px;
    text-decoration: none;
    color: #333;
    font-size: 14px;
}

.category-tag:hover {
    background: #bdc3c7;
}

.product-description {
    margin-top: 40px;
    padding-top: 40px;
    border-top: 2px solid #eee;
}

.product-description h2 {
    font-size: 24px;
    margin-bottom: 20px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .product-content {
        grid-template-columns: 1fr;
    }

    .product-title {
        font-size: 22px;
    }

    .price-current {
        font-size: 26px;
    }
}
</style>

<?php
get_footer();
?>

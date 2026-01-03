<?php
/**
 * Product Category Archive Template
 *
 * Afișează toate produsele dintr-o categorie
 *
 * @package Market-Time
 * @version 1.0
 */

get_header();

$term = get_queried_object();
?>

<main id="main" class="site-main category-archive">
    <div class="category-container">

        <!-- Category Header -->
        <header class="category-header">
            <h1 class="category-title"><?php echo esc_html($term->name); ?></h1>

            <?php if ($term->description) : ?>
                <p class="category-description"><?php echo esc_html($term->description); ?></p>
            <?php endif; ?>

            <p class="product-count">
                <?php echo $term->count; ?> produse găsite
            </p>
        </header>

        <!-- Products Grid -->
        <div class="products-grid">
            <?php
            if (have_posts()) :
                while (have_posts()) :
                    the_post();

                    // Get ACF fields
                    $product_price = get_field('product_price');
                    $price_regular = get_field('price_regular');
                    $discount_percentage = get_field('discount_percentage');
                    $on_sale = get_field('on_sale');
                    $product_image = get_field('product_image');
                    $merchant_name = get_field('merchant_name'); // Store name
                    $brands = get_the_terms(get_the_ID(), 'product_brand');
                    ?>

                    <article class="product-card">
                        <a href="<?php the_permalink(); ?>" class="product-link">

                            <!-- Product Image -->
                            <div class="product-image">
                                <?php if ($product_image) : ?>
                                    <img src="<?php echo esc_url($product_image); ?>" alt="<?php the_title(); ?>" />
                                <?php else : ?>
                                    <div class="no-image">No Image</div>
                                <?php endif; ?>

                                <?php if ($discount_percentage > 0) : ?>
                                    <span class="discount-badge">-<?php echo intval($discount_percentage); ?>%</span>
                                <?php endif; ?>
                            </div>

                            <!-- Product Info -->
                            <div class="product-card-info">
                                <h2 class="product-card-title"><?php the_title(); ?></h2>

                                <?php if ($brands && !is_wp_error($brands)) : ?>
                                    <p class="product-card-brand"><?php echo esc_html($brands[0]->name); ?></p>
                                <?php endif; ?>

                                <!-- Price -->
                                <div class="product-card-price">
                                    <?php if ($on_sale && $price_regular) : ?>
                                        <span class="price-old"><?php echo number_format($price_regular, 2); ?> RON</span>
                                    <?php endif; ?>

                                    <?php if ($product_price) : ?>
                                        <span class="price-current <?php echo $on_sale ? 'on-sale' : ''; ?>">
                                            <?php echo number_format($product_price, 2); ?> RON
                                        </span>
                                    <?php endif; ?>
                                </div>

                                <?php if ($merchant_name) : ?>
                                    <p class="product-card-vendor">la <?php echo esc_html($merchant_name); ?></p>
                                <?php endif; ?>
                            </div>

                        </a>
                    </article>

                <?php endwhile; ?>

                <!-- Pagination -->
                <div class="pagination">
                    <?php
                    echo paginate_links(array(
                        'prev_text' => '← Anterioare',
                        'next_text' => 'Următoare →',
                    ));
                    ?>
                </div>

            <?php else : ?>

                <div class="no-products">
                    <p>Nu am găsit produse în această categorie.</p>
                </div>

            <?php endif; ?>
        </div>

    </div>
</main>

<style>
/* Category Archive Styling */
.category-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.category-header {
    text-align: center;
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 2px solid #eee;
}

.category-title {
    font-size: 36px;
    margin-bottom: 10px;
    color: #333;
}

.category-description {
    font-size: 16px;
    color: #666;
    max-width: 600px;
    margin: 10px auto;
}

.product-count {
    font-size: 14px;
    color: #999;
    margin-top: 10px;
}

/* Products Grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
}

.product-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.product-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.product-image {
    position: relative;
    width: 100%;
    height: 280px;
    overflow: hidden;
    background: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.product-card:hover .product-image img {
    transform: scale(1.05);
}

.no-image {
    color: #ccc;
    font-size: 14px;
}

.discount-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #e74c3c;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
}

.product-card-info {
    padding: 20px;
}

.product-card-title {
    font-size: 16px;
    margin: 0 0 8px;
    color: #333;
    height: 40px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.product-card-brand {
    font-size: 13px;
    color: #999;
    margin: 5px 0;
}

.product-card-price {
    margin: 15px 0;
}

.price-old {
    display: block;
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
    margin-bottom: 5px;
}

.price-current {
    display: block;
    font-size: 22px;
    font-weight: bold;
    color: #333;
}

.price-current.on-sale {
    color: #e74c3c;
}

.product-card-vendor {
    font-size: 13px;
    color: #666;
    margin-top: 10px;
}

.no-products {
    text-align: center;
    padding: 60px 20px;
    color: #999;
}

/* Pagination */
.pagination {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 40px;
}

.pagination a,
.pagination span {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-decoration: none;
    color: #333;
}

.pagination a:hover {
    background: #f5f5f5;
}

.pagination .current {
    background: #0066cc;
    color: white;
    border-color: #0066cc;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 15px;
    }

    .category-title {
        font-size: 28px;
    }

    .product-image {
        height: 200px;
    }

    .product-card-info {
        padding: 15px;
    }

    .product-card-title {
        font-size: 14px;
    }

    .price-current {
        font-size: 18px;
    }
}
</style>

<?php
get_footer();
?>

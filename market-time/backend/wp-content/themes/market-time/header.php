<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header id="masthead" class="site-header">
    <div class="header-container">
        <div class="site-branding">
            <h1 class="site-title">
                <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                    <?php bloginfo('name'); ?>
                </a>
            </h1>
            <p class="site-description"><?php bloginfo('description'); ?></p>
        </div>

        <nav id="site-navigation" class="main-navigation">
            <a href="<?php echo esc_url(home_url('/products/')); ?>">Toate Produsele</a>
            <a href="<?php echo esc_url(home_url('/wp-json/market-time/v1/products')); ?>">API</a>
        </nav>
    </div>
</header>

<style>
.site-header {
    background: #fff;
    border-bottom: 1px solid #eee;
    padding: 20px 0;
    margin-bottom: 30px;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.site-branding .site-title {
    margin: 0;
    font-size: 24px;
}

.site-branding .site-title a {
    color: #333;
    text-decoration: none;
}

.site-description {
    margin: 5px 0 0;
    font-size: 14px;
    color: #666;
}

.main-navigation a {
    margin-left: 20px;
    color: #0066cc;
    text-decoration: none;
    font-weight: 500;
}

.main-navigation a:hover {
    text-decoration: underline;
}

body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #f5f5f5;
}
</style>

<?php
/**
 * Market-Time Headless Theme
 *
 * This is a headless WordPress installation.
 * The frontend is powered by Next.js.
 *
 * API Endpoint: /wp-json/market-time/v1/
 */

// Redirect to admin or API docs
if (is_user_logged_in()) {
    wp_redirect(admin_url());
} else {
    wp_die('
        <h1>Market-Time Headless CMS</h1>
        <p>This is a headless WordPress installation.</p>
        <p>Frontend is powered by Next.js.</p>
        <h2>API Documentation</h2>
        <ul>
            <li><a href="/wp-json/market-time/v1/products">GET /wp-json/market-time/v1/products</a></li>
            <li><a href="/wp-json/market-time/v1/products/{id}">GET /wp-json/market-time/v1/products/{id}</a></li>
            <li><a href="/wp-json/market-time/v1/merchants">GET /wp-json/market-time/v1/merchants</a></li>
            <li><a href="/wp-json/market-time/v1/categories">GET /wp-json/market-time/v1/categories</a></li>
        </ul>
        <p><a href="/wp-admin">WordPress Admin</a></p>
    ', 'Market-Time API');
}

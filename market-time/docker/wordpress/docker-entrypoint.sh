#!/bin/bash
set -e

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
until wp db check --allow-root 2>/dev/null; do
    echo "MySQL is unavailable - sleeping"
    sleep 2
done

echo "MySQL is ready!"

# Check if WordPress is already installed
if ! wp core is-installed --allow-root 2>/dev/null; then
    echo "WordPress not installed. Installing..."

    # Install WordPress
    wp core install \
        --url="http://localhost:8080" \
        --title="Market-Time Development" \
        --admin_user="${WP_ADMIN_USER:-admin}" \
        --admin_password="${WP_ADMIN_PASSWORD:-admin123}" \
        --admin_email="${WP_ADMIN_EMAIL:-admin@market-time.local}" \
        --skip-email \
        --allow-root

    echo "WordPress installed successfully!"

    # Activate Market-Time theme
    if [ -d "/var/www/html/wp-content/themes/market-time" ]; then
        echo "Activating Market-Time theme..."
        wp theme activate market-time --allow-root
    fi

    # Install and activate Advanced Custom Fields
    echo "Installing ACF..."
    wp plugin install advanced-custom-fields --activate --allow-root

    # Flush permalinks
    echo "Flushing permalinks..."
    wp rewrite structure '/%postname%/' --allow-root
    wp rewrite flush --allow-root

    echo "Setup complete!"
else
    echo "WordPress is already installed."
fi

# Include wp-config additions if they exist
if [ -f "/var/www/html/wp-config-additions.php" ]; then
    # Check if additions are already included
    if ! grep -q "wp-config-additions.php" /var/www/html/wp-config.php; then
        echo "Adding Market-Time configuration to wp-config.php..."
        sed -i "/That's all, stop editing/i require_once(ABSPATH . 'wp-config-additions.php');" /var/www/html/wp-config.php
    fi
fi

# Continue with the default WordPress entrypoint
exec docker-entrypoint.sh "$@"

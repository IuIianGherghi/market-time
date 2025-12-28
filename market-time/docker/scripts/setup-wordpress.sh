#!/bin/bash
#
# Market-Time WordPress Setup Script
# Automated installation and configuration using WP-CLI
#

set -e

echo "=========================================="
echo "Market-Time WordPress Setup"
echo "=========================================="
echo ""

# Wait for WordPress to be accessible
echo "Waiting for WordPress to be ready..."
sleep 5

# Check if WordPress is installed
if wp core is-installed --allow-root 2>/dev/null; then
    echo "✅ WordPress is already installed!"
else
    echo "❌ WordPress is not installed. Run 'docker-compose up' first."
    exit 1
fi

echo ""
echo "Installing and configuring plugins..."
echo "=========================================="

# Install Advanced Custom Fields
if ! wp plugin is-installed advanced-custom-fields --allow-root; then
    echo "Installing ACF..."
    wp plugin install advanced-custom-fields --activate --allow-root
else
    echo "✅ ACF already installed"
    wp plugin activate advanced-custom-fields --allow-root
fi

# Activate Market-Time theme
echo ""
echo "Activating Market-Time theme..."
if wp theme is-installed market-time --allow-root; then
    wp theme activate market-time --allow-root
    echo "✅ Theme activated"
else
    echo "❌ Market-Time theme not found in wp-content/themes/"
    echo "Make sure the theme files are mounted correctly."
fi

# Flush permalinks
echo ""
echo "Configuring permalinks..."
wp rewrite structure '/%postname%/' --allow-root
wp rewrite flush --allow-root
echo "✅ Permalinks configured"

# Create sample products
echo ""
echo "Creating sample products..."
echo "=========================================="

# Product 1: iPhone 15 Pro
PRODUCT_1=$(wp post create \
    --post_type=products \
    --post_title="iPhone 15 Pro 256GB Space Black" \
    --post_content="Cel mai nou iPhone cu procesor A17 Pro și camera de 48MP. Display Super Retina XDR de 6.1 inch, Dynamic Island, și titaniu aerospace." \
    --post_status=publish \
    --porcelain \
    --allow-root)

if [ ! -z "$PRODUCT_1" ]; then
    wp post meta update $PRODUCT_1 product_price 5499.99 --allow-root
    wp post meta update $PRODUCT_1 merchant_name "eMAG" --allow-root
    wp post meta update $PRODUCT_1 merchant_id 1 --allow-root
    wp post meta update $PRODUCT_1 product_url "https://www.emag.ro/telefon-iphone-15-pro" --allow-root
    wp post meta update $PRODUCT_1 category_ids "2" --allow-root
    echo "✅ Created: iPhone 15 Pro (ID: $PRODUCT_1)"
fi

# Product 2: Samsung Galaxy S24 Ultra
PRODUCT_2=$(wp post create \
    --post_type=products \
    --post_title="Samsung Galaxy S24 Ultra" \
    --post_content="Flagship Samsung cu S Pen integrat, camera de 200MP și display AMOLED 6.8 inch. Procesor Snapdragon 8 Gen 3." \
    --post_status=publish \
    --porcelain \
    --allow-root)

if [ ! -z "$PRODUCT_2" ]; then
    wp post meta update $PRODUCT_2 product_price 6299.00 --allow-root
    wp post meta update $PRODUCT_2 merchant_name "Altex" --allow-root
    wp post meta update $PRODUCT_2 merchant_id 2 --allow-root
    wp post meta update $PRODUCT_2 product_url "https://altex.ro/samsung-galaxy-s24-ultra" --allow-root
    wp post meta update $PRODUCT_2 category_ids "2" --allow-root
    echo "✅ Created: Samsung Galaxy S24 Ultra (ID: $PRODUCT_2)"
fi

# Product 3: MacBook Pro
PRODUCT_3=$(wp post create \
    --post_type=products \
    --post_title="MacBook Pro 14\" M3 Pro 512GB" \
    --post_content="Cel mai puternic laptop pentru profesioniști. Procesor M3 Pro, 512GB SSD, ecran Liquid Retina XDR." \
    --post_status=publish \
    --porcelain \
    --allow-root)

if [ ! -z "$PRODUCT_3" ]; then
    wp post meta update $PRODUCT_3 product_price 12999.00 --allow-root
    wp post meta update $PRODUCT_3 merchant_name "iStyle" --allow-root
    wp post meta update $PRODUCT_3 merchant_id 3 --allow-root
    wp post meta update $PRODUCT_3 product_url "https://istyle.ro/macbook-pro-14-m3-pro" --allow-root
    wp post meta update $PRODUCT_3 category_ids "1" --allow-root
    echo "✅ Created: MacBook Pro (ID: $PRODUCT_3)"
fi

# Product 4: Nike Air Max
PRODUCT_4=$(wp post create \
    --post_type=products \
    --post_title="Nike Air Max Plus Triple Black" \
    --post_content="Iconic sneakers Nike Air Max Plus în versiunea total black. Design futuristic cu tehnologia Air Max." \
    --post_status=publish \
    --porcelain \
    --allow-root)

if [ ! -z "$PRODUCT_4" ]; then
    wp post meta update $PRODUCT_4 product_price 799.99 --allow-root
    wp post meta update $PRODUCT_4 merchant_name "SportVision" --allow-root
    wp post meta update $PRODUCT_4 merchant_id 4 --allow-root
    wp post meta update $PRODUCT_4 product_url "https://sportvision.ro/nike-air-max-plus-black" --allow-root
    wp post meta update $PRODUCT_4 category_ids "8" --allow-root
    echo "✅ Created: Nike Air Max Plus (ID: $PRODUCT_4)"
fi

# Product 5: Adidas Ultraboost
PRODUCT_5=$(wp post create \
    --post_type=products \
    --post_title="Adidas Ultraboost 23 Running Shoes" \
    --post_content="Pantofi de alergare premium cu tehnologia Boost. Confort superior și design modern." \
    --post_status=publish \
    --porcelain \
    --allow-root)

if [ ! -z "$PRODUCT_5" ]; then
    wp post meta update $PRODUCT_5 product_price 899.00 --allow-root
    wp post meta update $PRODUCT_5 merchant_name "eMAG" --allow-root
    wp post meta update $PRODUCT_5 merchant_id 1 --allow-root
    wp post meta update $PRODUCT_5 product_url "https://emag.ro/adidas-ultraboost-23" --allow-root
    wp post meta update $PRODUCT_5 category_ids "8" --allow-root
    echo "✅ Created: Adidas Ultraboost (ID: $PRODUCT_5)"
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "WordPress Admin:"
echo "  URL: http://localhost:8080/wp-admin"
echo "  User: admin"
echo "  Pass: admin123"
echo ""
echo "API Endpoints:"
echo "  Products: http://localhost:8080/wp-json/market-time/v1/products"
echo "  Merchants: http://localhost:8080/wp-json/market-time/v1/merchants"
echo "  Categories: http://localhost:8080/wp-json/market-time/v1/categories"
echo ""
echo "phpMyAdmin: http://localhost:8081"
echo ""

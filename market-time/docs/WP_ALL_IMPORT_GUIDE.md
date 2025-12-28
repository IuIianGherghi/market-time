# 📥 WP All Import - Ghid de Mapping Feed-uri

## Ghid Complet pentru Import Produse din 2Performant & Profitshare

---

## 📋 Pregătire Backend (COMPLETAT ✅)

Backend-ul Market-Time este pregătit pentru import masiv cu:
- ✅ **19 câmpuri ACF** pentru detalii produse
- ✅ **3 Taxonomii WordPress** (Categories, Brands, Tags)
- ✅ **Database optimizat** cu indecși pentru căutare rapidă
- ✅ **Sync automat** WordPress → Database → REST API

---

## 🎯 Structură Câmpuri Disponibile

### ACF Fields (Custom Fields)

| Câmp ACF | Tip | Required | Mapare din Feed |
|----------|-----|----------|-----------------|
| `product_sku` | text | Nu | Product ID / SKU |
| `product_price` | number | **DA** | Preț curent (pret_redus) |
| `price_regular` | number | Nu | Preț original (pret_intreg) |
| `discount_percentage` | number | Auto | Auto-calculat din cele 2 prețuri |
| `brand` | text | Nu | Brand produs |
| `vendor` | text | Nu | Advertiser name |
| `merchant_name` | text | **DA** | Nume magazin (eMAG, Altex) |
| `merchant_id` | number | **DA** | ID magazin (unique) |
| `affiliate_code` | text | Nu | Tracking code 2Perf/Profitshare |
| `product_url` | url | **DA** | Link affiliate |
| `external_image_url` | url | Nu | URL imagine principală |
| `gallery_images` | textarea | Nu | Multiple URLs (câte una pe linie) |
| `short_description` | textarea | Nu | Descriere scurtă (max 255 chars) |

### WordPress Native Fields

| Câmp | Tip | Required | Mapare din Feed |
|------|-----|----------|-----------------|
| `post_title` | text | **DA** | Nume produs |
| `post_content` | wysiwyg | Nu | Descriere lungă |
| `post_status` | select | **DA** | Întotdeauna "publish" |

### Taxonomies (Categories, Brands, Tags)

| Taxonomie | Tip | Mapare |
|-----------|-----|--------|
| `product_category` | hierarchical | Category din feed |
| `product_brand` | non-hierarchical | Brand (Samsung, Apple, etc.) |
| `product_tag` | non-hierarchical | Tags (opțional) |

---

## 🔧 Instalare WP All Import

### 1. Install Plugin

```bash
# WordPress Admin
Plugins → Add New → Search "WP All Import"
Install → Activate
```

**IMPORTANT:** Ai nevoie de **WP All Import Pro** pentru ACF support!
Link: https://www.wpallimport.com/

### 2. Install ACF Add-On

WP All Import Pro include ACF Add-On built-in. Verifică:
```
WP All Import → Settings → Add-Ons
→ Advanced Custom Fields Add-On (should be active)
```

---

## 📥 Import Feed 2Performant

### Exemplu Structură Feed 2Performant (XML/CSV)

```xml
<product>
    <id>12345</id>
    <name>iPhone 15 Pro 256GB Space Black</name>
    <description>Cel mai nou iPhone...</description>
    <short_description>iPhone 15 Pro cu A17 Pro chip</short_description>
    <price>5499.99</price>
    <old_price>6299.00</old_price>
    <brand>Apple</brand>
    <category>Telefoane Mobile</category>
    <merchant>eMAG</merchant>
    <url>https://event.2performant.com/events/click?...</url>
    <image>https://cdn.example.com/iphone15.jpg</image>
    <images>
        <image>https://cdn.example.com/img1.jpg</image>
        <image>https://cdn.example.com/img2.jpg</image>
    </images>
</product>
```

### Mapping Step-by-Step

#### **Pas 1: New Import**

1. WP All Import → New Import
2. Upload File (XML/CSV URL from 2Performant)
3. Continue to Step 2

#### **Pas 2: Select Post Type**

- Choose: **Products** (Custom Post Type)
- Unique Identifier: `id` (pentru update la re-import)

#### **Pas 3: Drag & Drop Mapping**

**WordPress Title:**
```
Drag: {name} → Post Title
```

**WordPress Content (descriere lungă):**
```
Drag: {description} → Post Content
```

**Post Status:**
```
Set as: "Published"
```

#### **Pas 4: Custom Fields (ACF)**

Scroll down la **Custom Fields** section:

| ACF Field | Mapping | Exemplu XPath |
|-----------|---------|---------------|
| product_sku | `{id}` | `id` sau `sku` |
| product_price | `{price}` | `price` |
| price_regular | `{old_price}` | `old_price` sau `list_price` |
| brand | `{brand}` | `brand` |
| vendor | Static: "2Performant Partner" | - |
| merchant_name | `{merchant}` | `merchant` sau `shop` |
| merchant_id | Folosește **PHP Function** (vezi mai jos) | - |
| affiliate_code | Extrage din URL (vezi PHP Function) | - |
| product_url | `{url}` | `url` sau `link` |
| external_image_url | `{image}` | `image` sau `image_url` |
| gallery_images | `{images/image[1]} {images/image[2]}` (câte una pe linie) | - |
| short_description | `{short_description}` | `short_description` |

#### **Pas 5: Taxonomies**

**Product Categories:**
```
Taxonomy: product_category
Map to: {category}
Options:
  ☑ Create categories if they don't exist
  ☑ Use first category as primary
```

**Product Brands:**
```
Taxonomy: product_brand
Map to: {brand}
Options:
  ☑ Create brands if they don't exist
```

#### **Pas 6: PHP Functions pentru Mapping Complex**

**A. Auto-assign Merchant ID** (baserat pe nume merchant)

```php
// În câmpul merchant_id, folosește "PHP Function"
function($merchant_name) {
    $merchants = array(
        'eMAG' => 1,
        'Altex' => 2,
        'iStyle' => 3,
        'SportVision' => 4,
        'Fashion Days' => 5,
        // Adaugă restul merchantilor aici
    );
    return isset($merchants[$merchant_name]) ? $merchants[$merchant_name] : 999;
}
```

**B. Extract Affiliate Code din URL**

```php
// În câmpul affiliate_code
function($url) {
    // Extract tracking code from 2Performant URL
    if (preg_match('/aff_code=([^&]+)/', $url, $matches)) {
        return $matches[1];
    }
    // Sau folosește întreg URL-ul ca tracking
    return parse_url($url, PHP_URL_QUERY);
}
```

**C. Format Gallery Images** (câte unul pe linie)

```php
// În câmpul gallery_images
function($images_array) {
    if (is_array($images_array)) {
        return implode("\n", $images_array);
    }
    return $images_array;
}
```

**D. Category Mapping** (din nume în ID pentru categoriimapa)

```php
// În câmpul category_ids (legacy field)
function($category_name) {
    $map = array(
        'Laptops' => '1',
        'Telefoane' => '2',
        'Tablete' => '3',
        'Încălțăminte' => '8',
        'Îmbrăcăminte' => '9',
        // etc
    );
    return isset($map[$category_name]) ? $map[$category_name] : '';
}
```

---

## 📥 Import Feed Profitshare

Structură similară, doar câmpurile pot avea alte nume:

### Mapping Profitshare Specific

| Campo Profitshare | Map la ACF | Notă |
|-------------------|------------|------|
| `product_id` | product_sku | ID unic |
| `product_name` | post_title | Titlu |
| `product_price` | product_price | Preț curent |
| `product_old_price` | price_regular | Preț vechi |
| `product_brand` | brand | Brand |
| `product_category` | product_category (taxonomy) | Categorie |
| `product_manufacturer` | vendor | Vendor |
| `product_url` | product_url | Link affiliate |
| `product_image` | external_image_url | Imagine |
| `product_images` | gallery_images | Galerie |

---

## ⚙️ Configurări Avansate Import

### Scheduling (Update Automat)

WP All Import Pro → Edit Import → Scheduling
```
✓ Automatic Scheduling
Frequency: Every 6 hours
Action: Update existing posts
```

### Update Rules

```
☑ Update all data
☑ Update product title
☑ Update product content
☑ Update custom fields
☑ Update taxonomies
☑ Update images

Delete Rule:
☑ Delete products that are no longer in feed
```

### Error Handling

```
☑ Continue on error
☑ Log errors to file
Maximum errors: 100
```

---

## 🧪 Test Import (Pas Important!)

**ÎNAINTE de import masiv:**

1. **Test cu 10 produse:**
   - WP All Import → Records to Import: **10**
   - Click Import

2. **Verifică în WordPress:**
   - Products → All Products (ar trebui să vezi 10)
   - Check ACF fields sunt completate
   - Check categories & brands create

3. **Verifică în Database:**
   ```sql
   SELECT * FROM wp_products_optimized ORDER BY id DESC LIMIT 10;
   ```
   - Toate cele 19 coloane populate?

4. **Verifică API:**
   ```
   http://market-time.local/wp-json/market-time/v1/products?per_page=10
   ```
   - JSON valid?
   - Toate câmpurile prezente?

**Dacă totul e OK → Rulează import complet!**

---

## 📊 Import Masiv - Best Practices

### Pentru 1.5M Produse

**1. Server Requirements:**
```
PHP Memory: 512M minimum (1GB recomandat)
Max Execution Time: 300s
MySQL Max Connections: 100+
```

**2. Import în Batch-uri:**
```
Records per iteration: 500
Pause between iterations: 10 seconds
```

**3. Disable Automat în timpul importului:**
```php
// În wp-config.php TEMPORARY
define('WP_POST_REVISIONS', false);
define('AUTOSAVE_INTERVAL', 999999);
```

**4. Monitor Progress:**
- WP All Import → Import History
- Check logs: `/wp-content/uploads/wpallimport/logs/`

---

## 🔍 Debug & Troubleshooting

### Problema: Produsele nu apar în API

**Soluție:**
1. Check dacă tabelul `wp_products_optimized` e populat:
   ```sql
   SELECT COUNT(*) FROM wp_products_optimized;
   ```
2. Dacă e gol, sync-ul nu a funcționat:
   - Re-save un produs manual
   - Check PHP error log
   - Verifică că mu-plugins sunt active

### Problema: Categories nu se creează

**Soluție:**
```
WP All Import → Edit Import → Taxonomies
☑ Create terms if they don't exist
☑ Try to match by slug
```

### Problema: Import foarte lent

**Soluție:**
1. Dezactivează temporar:
   - Yoast SEO
   - Redis cache
   - Alte heavy plugins

2. Crește PHP limits:
   ```php
   ini_set('memory_limit', '1024M');
   ini_set('max_execution_time', '600');
   ```

---

## 📋 Checklist Final Import

Înainte de production import:

- [ ] ACF fields mapping complet (toate cele 13 fields)
- [ ] Taxonomies mapping (categories, brands)
- [ ] PHP functions pentru merchant_id
- [ ] PHP functions pentru affiliate_code
- [ ] Test import 10 produse OK
- [ ] Verificat în database (wp_products_optimized populat)
- [ ] Verificat API returnează JSON corect
- [ ] Scheduling configurat (6 ore)
- [ ] Update rules configurate
- [ ] Error handling activat
- [ ] Backup database făcut (înainte de import masiv!)

---

## 🎯 Exemplu Complet: Import 1 Produs

### Feed Input (XML):

```xml
<product>
    <id>ABC123</id>
    <name>Samsung Galaxy S24 Ultra 256GB</name>
    <description>Flagship Samsung cu S Pen...</description>
    <short_desc>Galaxy S24 Ultra - 200MP camera</short_desc>
    <price>6299.00</price>
    <old_price>6999.00</old_price>
    <brand>Samsung</brand>
    <category>Telefoane Mobile > Smartphone Android</category>
    <merchant>Altex</merchant>
    <url>https://event.2performant.com/events/click?...</url>
    <image>https://cdn.com/s24-main.jpg</image>
</product>
```

### WordPress Output:

**Post:**
- Title: "Samsung Galaxy S24 Ultra 256GB"
- Content: "Flagship Samsung cu S Pen..."
- Status: Published

**ACF Fields:**
- product_sku: "ABC123"
- product_price: 6299.00
- price_regular: 6999.00
- discount_percentage: 10 (auto-calculated)
- brand: "Samsung"
- merchant_name: "Altex"
- merchant_id: 2
- product_url: "https://event.2performant.com..."
- external_image_url: "https://cdn.com/s24-main.jpg"
- short_description: "Galaxy S24 Ultra - 200MP camera"

**Taxonomies:**
- product_category: "Telefoane Mobile" (created if not exists)
- product_brand: "Samsung" (created if not exists)

**Database (wp_products_optimized):**
```sql
INSERT INTO wp_products_optimized VALUES (
    NULL, -- id (auto)
    123, -- post_id (WordPress post ID)
    'ABC123', -- sku
    1, -- site_id
    'Samsung Galaxy S24 Ultra 256GB', -- title
    6299.00, -- price
    6999.00, -- price_regular
    10, -- discount_percentage
    2, -- merchant_id
    'Altex', -- merchant_name
    'Samsung', -- brand
    '2Performant Partner', -- vendor
    'tracking_code_here', -- affiliate_code
    'https://cdn.com/s24-main.jpg', -- image_url
    NULL, -- gallery_images
    'https://event.2performant.com...', -- product_url
    '2', -- category_ids
    NULL, -- ai_descriptions
    'Galaxy S24 Ultra - 200MP camera', -- short_description
    NOW() -- last_updated
);
```

**API Response:**
```json
{
  "id": 123,
  "sku": "ABC123",
  "title": "Samsung Galaxy S24 Ultra 256GB",
  "price": 6299.00,
  "price_regular": 6999.00,
  "discount_percentage": 10,
  "on_sale": true,
  "merchant": {
    "id": 2,
    "name": "Altex"
  },
  "brand": "Samsung",
  "image_url": "https://cdn.com/s24-main.jpg",
  "product_url": "https://event.2performant.com...",
  "short_description": "Galaxy S24 Ultra - 200MP camera"
}
```

---

## 🚀 Next Steps După Import

1. **Verifică produsele:**
   ```
   http://market-time.local/wp-json/market-time/v1/products
   ```

2. **Activează AI generation** (opțional):
   - Configurează OpenRouter API key
   - WP Cron va genera descrieri AI

3. **Setup CDN:**
   - BunnyCDN pentru imagini
   - Update links în database

4. **Performance:**
   - Activează Redis cache
   - Setup cron pentru feed updates

---

**Import Success! 🎉**

Ai toate instrumentele pentru import masiv 1.5M produse din 2Performant & Profitshare!

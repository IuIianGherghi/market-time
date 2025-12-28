# 📥 WP All Import - Setup Complet Import Produse

## Ghid Pas cu Pas pentru Import 1.5M Produse

---

## Pas 1: Pregătire Server

### 1.1 Update Database Schema

În SSH pe server:

```bash
# Upload SQL script
nano /tmp/update-stock-columns.sql
# (paste conținutul din scripts/update-stock-columns.sql)

# Rulează update
mysql -h 127.0.0.1 -P 3306 -u market-time-api -p'eL1C8ah09pro8w0ShLry' market-time-api < /tmp/update-stock-columns.sql

# Verifică
mysql -h 127.0.0.1 -P 3306 -u market-time-api -p'eL1C8ah09pro8w0ShLry' market-time-api -e "DESCRIBE wp_products_optimized;"
```

Ar trebui să vezi noile coloane: `stock_status`, `stock_quantity`, `out_of_stock_since`, etc.

---

## Pas 2: Instalare WP All Import Pro

### 2.1 Download Plugin

1. Cumpără **WP All Import Pro** de la: https://www.wpallimport.com/
   - License: Business ($399/an) - include ACF Add-on
   - SAU Developer ($799/an) - unlimited sites

2. Download `.zip` file

### 2.2 Instalare în WordPress

**Opțiunea A - Via WordPress Admin:**
1. **Plugins** → **Add New** → **Upload Plugin**
2. Choose file: `wpai-acf-add-on.zip`
3. Click **Install Now** → **Activate**

**Opțiunea B - Via SSH (mai rapid):**

```bash
# Upload zip la server
scp wpai-acf-add-on.zip root@185.104.181.59:/tmp/

# SSH în server
ssh root@185.104.181.59

# Unzip în plugins folder
cd /home/market-time-api/htdocs/api.market-time.ro/wp-content/plugins/
unzip /tmp/wpai-acf-add-on.zip

# Set permissions
chown -R market-time-api:market-time-api wp-all-import-pro/
chmod -R 755 wp-all-import-pro/

# Activate via WP-CLI (dacă e instalat)
cd /home/market-time-api/htdocs/api.market-time.ro
sudo -u market-time-api wp plugin activate wp-all-import-pro
```

### 2.3 Verificare Instalare

WordPress Admin → **Plugins** → Ar trebui să vezi:
- ✅ WP All Import Pro (active)
- ✅ ACF Add-On for WP All Import (active)

---

## Pas 3: Obține URL Feed

### 3.1 2Performant Feed

1. Login la 2Performant: https://app.2performant.com/
2. **Catalog** → **Product Feeds**
3. Găsește advertiser-ul dorit (ex: eMAG, Altex, etc.)
4. Click **Get Feed URL**
5. Copiază URL-ul (ex: `https://feed.2performant.com/advertiser/123/products.xml`)

### 3.2 Profitshare Feed

Similar, obții URL de la dashboard Profitshare.

**IMPORTANT:** Păstrează URL-urile într-un document sigur!

---

## Pas 4: Primul Import - Test cu 100 Produse

### 4.1 Creează Import Nou

WordPress Admin → **All Import** → **New Import**

### 4.2 Upload/Enter File

**Step 1: Import Data**
- Select: **Download from URL**
- Paste feed URL: `https://feed.2performant.com/...`
- Click **Continue to Step 2**

### 4.3 Select Post Type

**Step 2: Choose Data to Import**
- Select: **Products** (custom post type)
- Click **Continue to Step 3**

### 4.4 Drag & Drop Mapping

**Step 3: Map Fields**

#### A. WordPress Native Fields

| Feed Element | WordPress Field | Example Value |
|--------------|----------------|---------------|
| `{name[1]}` | **Title** | Samsung Galaxy S24 Ultra |
| `{description[1]}` | **Content** | Descriere completă... |
| `{description[1]}` | **Excerpt** | (optional) |

**Post Status:** `Published`

#### B. ACF Custom Fields

Scroll jos la **Custom Fields** section:

| ACF Field | Feed Mapping | Notes |
|-----------|--------------|-------|
| **product_sku** | `{id[1]}` sau `{product_id[1]}` | ID unic produs |
| **product_price** | `{price[1]}` | Preț curent (redus) |
| **price_regular** | `{old_price[1]}` sau `{list_price[1]}` | Preț întreg |
| **brand** | `{brand[1]}` | Brand produs |
| **vendor** | Static: `2Performant` | Hardcoded |
| **merchant_name** | `{merchant[1]}` sau `{shop[1]}` | Nume magazin |
| **merchant_id** | **PHP Function** (vezi mai jos) | ID numeric magazin |
| **product_url** | `{url[1]}` sau `{link[1]}` | Link affiliate |
| **external_image_url** | `{image_url[1]}` | URL imagine externă |
| **gallery_images** | `{images/image[1]}` (câte una pe linie) | Multiple imagini |
| **short_description** | `{short_description[1]}` sau substring din `{description[1]}` | Max 255 chars |
| **affiliate_code** | **PHP Function** (vezi mai jos) | Tracking code |

#### C. PHP Functions pentru Mapping Complex

**1. Merchant ID Mapping:**

Click pe câmpul `merchant_id` → **Use PHP function**

```php
function($merchant_name) {
    // Mapping merchant name → ID
    $merchants = array(
        'eMAG' => 1,
        'Altex' => 2,
        'iStyle' => 3,
        'PCGarage' => 4,
        'SportVision' => 5,
        'FashionDays' => 6,
        'Answear' => 7,
        'Flanco' => 8,
        'Media Galaxy' => 9,
        'CEL.ro' => 10,
        // Adaugă restul merchantilor aici
    );

    // Return ID sau 999 pentru unknown
    return isset($merchants[$merchant_name]) ? $merchants[$merchant_name] : 999;
}
```

**2. Affiliate Code Extraction:**

Click pe câmpul `affiliate_code` → **Use PHP function**

```php
function($url) {
    // Extract tracking code din 2Performant URL
    // URL format: https://event.2performant.com/events/click?ad_type=quicklink&aff_code=aeca5b241&unique=a5e9e1225&redirect_to={url}

    if (preg_match('/aff_code=([^&]+)/', $url, $matches)) {
        return $matches[1]; // Return: aeca5b241
    }

    // Sau extrage unique code
    if (preg_match('/unique=([^&]+)/', $url, $matches)) {
        return $matches[1];
    }

    // Fallback: return întreg query string
    $parsed = parse_url($url);
    return isset($parsed['query']) ? $parsed['query'] : '';
}
```

**3. Gallery Images Format:**

Click pe câmpul `gallery_images` → **Use PHP function**

```php
function($images_array) {
    // Dacă feed-ul returnează array de imagini
    if (is_array($images_array)) {
        // Join cu newline (câte o imagine pe linie)
        return implode("\n", $images_array);
    }

    // Dacă e string deja, return as-is
    return $images_array;
}
```

**4. Short Description (substring din description):**

Dacă feed-ul nu are `short_description`, extract din `description`:

```php
function($description) {
    // Strip HTML tags
    $clean = strip_tags($description);

    // Get first 250 chars
    if (strlen($clean) > 250) {
        $short = substr($clean, 0, 250);
        // Cut la ultimul spațiu (nu tăia cuvintele)
        $short = substr($short, 0, strrpos($short, ' '));
        return $short . '...';
    }

    return $clean;
}
```

#### D. Taxonomies

**Product Categories:**
- Taxonomy: `product_category`
- Map to: `{category[1]}` sau `{categories/category[1]}`
- Options:
  - ✅ Create categories if they don't exist
  - ✅ Try to match by name first

**Product Brands:**
- Taxonomy: `product_brand`
- Map to: `{brand[1]}`
- Options:
  - ✅ Create brands if they don't exist

**Product Tags** (optional):
- Taxonomy: `product_tag`
- Map to: Static values sau custom logic

### 4.5 Unique Identifier

**Step 4: Import Settings**

**Unique Identifier:** `{id[1]}` sau `{product_id[1]}`

Acesta e crucial pentru:
- Update la re-import (nu duplicate)
- Tracking same product de la același advertiser

**Create posts that don't already exist:**
- ✅ Enabled

**Update existing posts:**
- ✅ Update all data
- ✅ Update title
- ✅ Update content
- ✅ Update custom fields
- ✅ Update taxonomies

**Delete missing posts:**
- ⚠️ **NU bifa** pentru primul import
- Activează după ce totul funcționează OK

### 4.6 Scheduling (pentru mai târziu)

**Step 5: Import Scheduling**

Pentru **test import**, skip scheduling.

Pentru **production import:**
- ✅ Automatic Scheduling
- Frequency: **Every 6 hours** (pentru Tier 1 merchants)
- Processing: **500 records per iteration**
- Pause between iterations: **10 seconds**

### 4.7 Confirmă & Import

**Step 6: Confirm & Run**

**IMPORTANT pentru TEST:**
- La **Records to import:** setează **100** (nu tot feed-ul!)
- Click **Confirm & Run Import**

Ar trebui să vezi progress bar. Durează ~2-5 minute pentru 100 produse.

---

## Pas 5: Verificare Import

### 5.1 Check WordPress

WordPress Admin → **Products** → **All Products**

Ar trebui să vezi 100 produse:
- ✅ Titluri corecte
- ✅ Categories assigned
- ✅ Brands assigned

Click pe un produs → Edit:
- ✅ Toate ACF fields completate
- ✅ SKU, prices, merchant, etc.

### 5.2 Check Database

SSH pe server:

```bash
mysql -h 127.0.0.1 -P 3306 -u market-time-api -p'eL1C8ah09pro8w0ShLry' market-time-api -e "
  SELECT id, sku, title, price, price_regular, discount_percentage, brand, merchant_name
  FROM wp_products_optimized
  ORDER BY id DESC
  LIMIT 10;
"
```

Ar trebui să vezi 100+ produse (inclusiv cel de test creat anterior).

**Verificări:**
- ✅ `sku` populat
- ✅ `price` și `price_regular` corecte
- ✅ `discount_percentage` calculat automat (ex: 10)
- ✅ `brand`, `merchant_name` completate

### 5.3 Check API

Browser sau Postman:

```
https://api.market-time.ro/?rest_route=/market-time/v1/products&per_page=10
```

Răspuns așteptat: JSON cu 10+ produse, toate câmpurile populate.

**Test Filtre:**

```
# Filtrare pe brand
https://api.market-time.ro/?rest_route=/market-time/v1/products&brand=Samsung

# Filtrare pe merchant
https://api.market-time.ro/?rest_route=/market-time/v1/products&merchant_id=1

# Doar produse cu discount
https://api.market-time.ro/?rest_route=/market-time/v1/products&on_sale=true

# Sortare pe discount
https://api.market-time.ro/?rest_route=/market-time/v1/products&orderby=discount&order=DESC
```

---

## Pas 6: Import Complet (După Validare)

### 6.1 Când Totul Funcționează OK

Dacă verificările din Pas 5 sunt ✅, rulează import complet:

WordPress Admin → **All Import** → **Manage Imports**
- Găsește import-ul tău
- Click **Edit**
- **Settings** → **Records to import:** setează **0** (unlimited)
- Click **Save & Run Import**

**Estimare durată:**
- 500 produse/iterație × 10 sec pauză = ~50 produse/min
- 100,000 produse = ~33 ore
- 1,500,000 produse = ~20 zile (continuous)

**Recomandare:** Rulează noaptea când traffic e low.

### 6.2 Monitor Import

Check progress:
- **All Import** → **Manage Imports** → vezi progress bar
- Logs: `/wp-content/uploads/wpallimport/logs/`

SSH monitor:

```bash
# Count produse în database
watch -n 60 'mysql -h 127.0.0.1 -P 3306 -u market-time-api -peL1C8ah09pro8w0ShLry market-time-api -e "SELECT COUNT(*) FROM wp_products_optimized;"'

# Monitor server resources
htop
```

### 6.3 Dacă Întâmpini Probleme

**Error: Memory limit exceeded**
```bash
# În wp-config.php (pe server)
define('WP_MEMORY_LIMIT', '1024M');
define('WP_MAX_MEMORY_LIMIT', '2048M');
```

**Error: Execution timeout**
```bash
# PHP settings au fost deja setate în CloudPanel la 5 minute
# Dacă tot timeout, reduce batch size:
# All Import → Edit Import → Settings → Records per iteration: 250
```

**Error: Database connection lost**
```bash
# Pause între iterații mai mare:
# All Import → Settings → Pause: 30 seconds
```

---

## Pas 7: Import Multiple Advertisers

### 7.1 Creează Import Separat pentru Fiecare

**De ce separate?**
- Control individual pe advertiser
- Schedule diferit (Tier 1 vs Tier 2)
- Easy disable dacă un advertiser e problematic

**Setup:**

1. **eMAG Feed:**
   - Merchant ID: 1
   - Update frequency: 6 ore
   - Priority: HIGH

2. **Altex Feed:**
   - Merchant ID: 2
   - Update frequency: 6 ore
   - Priority: HIGH

3. **Smaller merchants:**
   - Update frequency: zilnic
   - Priority: MEDIUM

### 7.2 Evită Duplicate Cross-Advertiser

**Problemă:**
Același produs (ex: Samsung S24) la 5 merchantși diferițI
→ 5 produse separate (OK!)

**Unique Identifier format:**
```
SKU format: {advertiser_id}_{product_id}
Example:
- eMAG: emag_ABC123
- Altex: altex_ABC123
```

**Implementation în PHP Function:**

```php
function($product_id, $merchant_name) {
    $prefix = strtolower(str_replace(' ', '_', $merchant_name));
    return $prefix . '_' . $product_id;
}
```

Aplică la câmpul `product_sku` în mapping.

---

## Pas 8: Automatizare & Scheduling

### 8.1 Enable Automatic Updates

Pentru fiecare import:

**All Import** → **Manage Imports** → **Edit Import** → **Scheduling**

**Tier 1 Merchants (eMAG, Altex, etc.):**
```
✅ Automatic Scheduling
Frequency: Every 6 hours
Processing: 500 records/iteration
Update: All data
Delete: Products missing from feed (după 30 zile)
```

**Tier 2 Merchants (smaller shops):**
```
Frequency: Once per day
Processing: 500 records/iteration
```

### 8.2 WP Cron Configuration

Verifică că WP Cron rulează:

```bash
# SSH pe server
cd /home/market-time-api/htdocs/api.market-time.ro

# Check scheduled crons
sudo -u market-time-api wp cron event list

# Ar trebui să vezi WP All Import crons
```

**SAU setup System Cron (mai reliable):**

```bash
# Editează crontab
crontab -e

# Adaugă:
0 */6 * * * cd /home/market-time-api/htdocs/api.market-time.ro && sudo -u market-time-api wp cron event run --due-now > /dev/null 2>&1
```

---

## Pas 9: Out of Stock Management

### 9.1 Când Produs Dispare din Feed

WP All Import options:
- ✅ **Delete posts that are no longer in the feed**

Dar vrem logică custom (keep AI optimized products).

### 9.2 Custom Hook pentru Delete Logic

Creează mu-plugin: `/wp-content/mu-plugins/market-time-stock-management.php`

```php
<?php
/**
 * Market-Time Stock Management
 *
 * Custom logic pentru out-of-stock products
 */

// Hook into WP All Import before delete
add_action('pmxi_before_delete_post', 'market_time_prevent_delete_optimized', 10, 2);

function market_time_prevent_delete_optimized($post_id, $import_id) {
    global $wpdb;

    // Check if product has AI optimization
    $product = $wpdb->get_row($wpdb->prepare("
        SELECT has_ai_optimization, indexed
        FROM wp_products_optimized
        WHERE post_id = %d
    ", $post_id));

    if (!$product) return; // Not in optimized table, allow delete

    // Logic: Keep AI optimized + indexed products
    if ($product->has_ai_optimization && $product->indexed) {
        // Prevent delete
        remove_action('pmxi_before_delete_post', 'market_time_prevent_delete_optimized', 10);

        // Instead, mark as out of stock
        $wpdb->update(
            'wp_products_optimized',
            array(
                'stock_status' => 'out_of_stock',
                'out_of_stock_since' => current_time('mysql')
            ),
            array('post_id' => $post_id)
        );

        // Update post status
        wp_update_post(array(
            'ID' => $post_id,
            'post_status' => 'draft' // Hide from frontend
        ));

        error_log("Market-Time: Kept optimized product $post_id as out-of-stock");
    }
    // Else: allow normal delete
}
```

Deploy pe server:

```bash
# Local → GitHub
cd market-time
git add backend/wp-content/mu-plugins/market-time-stock-management.php
git commit -m "Add: Stock management with AI optimization protection"
git push origin main

# Server → Pull
ssh root@185.104.181.59
cd /tmp/market-time-repo
git pull origin main
cp market-time/backend/wp-content/mu-plugins/market-time-stock-management.php /home/market-time-api/htdocs/api.market-time.ro/wp-content/mu-plugins/
chown market-time-api:market-time-api /home/market-time-api/htdocs/api.market-time.ro/wp-content/mu-plugins/market-time-stock-management.php
```

---

## 📊 Monitoring & Analytics

### Track Import Success Rate

```sql
-- Produse totale importate
SELECT COUNT(*) as total FROM wp_products_optimized;

-- Produse pe merchant
SELECT merchant_name, COUNT(*) as count
FROM wp_products_optimized
GROUP BY merchant_name
ORDER BY count DESC;

-- Produse cu discount
SELECT COUNT(*) as products_on_sale
FROM wp_products_optimized
WHERE discount_percentage > 0;

-- Average discount
SELECT AVG(discount_percentage) as avg_discount
FROM wp_products_optimized
WHERE discount_percentage > 0;

-- Produse out of stock
SELECT COUNT(*) as out_of_stock
FROM wp_products_optimized
WHERE stock_status = 'out_of_stock';
```

---

## 🎯 Checklist Final Import

- [ ] Database schema actualizat (stock columns)
- [ ] WP All Import Pro instalat + activated
- [ ] ACF Add-On active
- [ ] Feed URL obținut (2Performant/Profitshare)
- [ ] Test import 100 produse SUCCESS
- [ ] Verificat WordPress (products visible)
- [ ] Verificat Database (wp_products_optimized populated)
- [ ] Verificat API (JSON response OK)
- [ ] Filtre API testate (brand, merchant, on_sale)
- [ ] Merchant ID mapping creat
- [ ] Affiliate code extraction testat
- [ ] Taxonomies create automat
- [ ] Import complet rulat (sau scheduled)
- [ ] Automatic scheduling configurat
- [ ] Stock management mu-plugin deployed
- [ ] Monitoring queries setup

---

## 🚀 Success!

Backend-ul e pregătit pentru import masiv! După ce importul complet se termină, ai:
- ✅ 1.5M produse în database
- ✅ API funcțional cu toate filtrele
- ✅ Sync automat WordPress → Database
- ✅ Auto-update prețuri la 6 ore (Tier 1)
- ✅ Smart stock management (keep AI optimized)
- ✅ Ready pentru AI optimization (Tier 1 → scoring)

**Next steps:**
1. Monitorizare import progress
2. Google Search Console integration
3. AI optimization pentru top produse indexate
4. Frontend Next.js development

---

Mult succes cu import-ul! 🎉

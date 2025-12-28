# 🧪 Ghid de Testare - Market-Time.ro

## PASUL 1: Instalare WordPress Local

### Opțiunea A: Local by Flywheel (RECOMANDAT - Mai Ușor)

1. **Download Local**
   - https://localwp.com
   - Descarcă versiunea pentru Windows
   - Instalează aplicația

2. **Creează Site Nou**
   - Deschide Local
   - Click pe "+" (Add Local Site)
   - Site name: `market-time`
   - Environment:
     - PHP: 8.1.9 sau mai nou
     - Web server: nginx (recomandat)
     - Database: MySQL 8.0
   - WordPress:
     - Username: `admin`
     - Password: `admin123` (sau ce preferi)
     - Email: `admin@market-time.local`
   - Click "Add Site"

3. **Pornește Site-ul**
   - Click "Start site"
   - Așteaptă 30 secunde
   - URLs:
     - **Site**: http://market-time.local
     - **Admin**: http://market-time.local/wp-admin

### Opțiunea B: XAMPP (Alternativă)

1. **Instalează XAMPP**
   - https://www.apachefriends.org/
   - Download pentru Windows
   - Instalează în `C:\xampp`

2. **Pornește Apache + MySQL**
   - Deschide XAMPP Control Panel
   - Click "Start" pentru Apache
   - Click "Start" pentru MySQL

3. **Download WordPress**
   - https://wordpress.org/latest.zip
   - Extract în `C:\xampp\htdocs\market-time`

4. **Creează Database**
   - Browser: http://localhost/phpmyadmin
   - Click "New" (stânga)
   - Database name: `market_time`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

5. **Instalează WordPress**
   - Browser: http://localhost/market-time
   - Urmează setup wizard:
     - Database: `market_time`
     - Username: `root`
     - Password: (gol)
     - Host: `localhost`
   - Site Title: `Market-Time`
   - Username: `admin`
   - Password: `admin123`
   - Email: `admin@local.test`
   - Click "Install WordPress"

---

## PASUL 2: Copiază Fișierele Backend (5 min)

### Găsește Directorul WordPress

**Local by Flywheel:**
- Right-click pe site în Local app
- Click "Reveal in Explorer"
- Navighează la: `app/public/wp-content/`

**XAMPP:**
- Navighează la: `C:\xampp\htdocs\market-time\wp-content\`

### Copiază Tema

**Sursa:**
```
D:\Claude Code Test\market-time\backend\wp-content\themes\market-time\
```

**Destinație:**
```
[WORDPRESS_PATH]\wp-content\themes\market-time\
```

**Fișiere de copiat:**
- ✅ functions.php
- ✅ style.css
- ✅ index.php

### Copiază Must-Use Plugins

**Sursa:**
```
D:\Claude Code Test\market-time\backend\wp-content\mu-plugins\
```

**Destinație:**
```
[WORDPRESS_PATH]\wp-content\mu-plugins\
```

**Creează directorul `mu-plugins` dacă nu există!**

**Fișiere de copiat:**
- ✅ market-time-db-optimization.php
- ✅ market-time-cdn.php
- ✅ market-time-rest-api.php
- ✅ market-time-ai-optimization.php

---

## PASUL 3: Activează Tema & Plugin-uri (5 min)

1. **Login WordPress Admin**
   - URL: http://market-time.local/wp-admin (sau http://localhost/market-time/wp-admin)
   - Username: `admin`
   - Password: `admin123`

2. **Activează Tema**
   - Meniu: **Appearance → Themes**
   - Găsește "Market-Time Headless CMS"
   - Click **Activate**

3. **Instalează Advanced Custom Fields**
   - Meniu: **Plugins → Add New**
   - Caută: "Advanced Custom Fields"
   - Click **Install Now** (versiunea FREE e ok)
   - Click **Activate**

4. **Verificare Must-Use Plugins**
   - Meniu: **Plugins → Must-Use**
   - Ar trebui să vezi cele 4 plugin-uri:
     - ✅ Market-Time Database Optimization
     - ✅ Market-Time CDN
     - ✅ Market-Time REST API
     - ✅ Market-Time AI Optimization

---

## PASUL 4: Configurare wp-config.php (5 min)

1. **Găsește wp-config.php**
   - **Local by Flywheel**: `[Site Path]/app/public/wp-config.php`
   - **XAMPP**: `C:\xampp\htdocs\market-time\wp-config.php`

2. **Editează cu Notepad++ sau VS Code**

3. **Adaugă ÎNAINTE de linia:**
   ```php
   /* That's all, stop editing! Happy publishing. */
   ```

   **Adaugă acest cod:**

```php
/* ============================================
   MARKET-TIME CONFIGURATION
   ============================================ */

// OpenRouter API Key (OBLIGATORIU pentru AI)
// Get your key from: https://openrouter.ai
define('OPENROUTER_API_KEY', 'sk-or-v1-YOUR-API-KEY-HERE');
define('OPENROUTER_MODEL', 'meta-llama/llama-3.1-70b-instruct');

// CDN Configuration (OPȚIONAL - pentru teste locale poți lăsa comentat)
// define('BUNNYCDN_URL', 'https://your-cdn.b-cdn.net');

// Cloudinary (OPȚIONAL)
// define('CLOUDINARY_CLOUD_NAME', 'your-cloud');
// define('CLOUDINARY_API_KEY', 'your-key');
// define('CLOUDINARY_API_SECRET', 'your-secret');

// Category to Site Mapping (se va folosi după Multisite)
define('SITE_CATEGORY_MAP', serialize(array(
    1 => array('all'),
    2 => array(1, 2, 3),      // electronica
    3 => array(8, 9, 10),     // fashion
    4 => array(8),            // incaltaminte
    5 => array(15, 16),       // casa-living
    6 => array(20),           // cadouri
    7 => array(25),           // sport-fitness
)));
```

4. **Salvează fișierul**

**⚠️ IMPORTANT: Dacă nu ai OpenRouter API key:**
- Mergi la https://openrouter.ai
- Sign up (e gratuit)
- Dashboard → Keys → Create New Key
- Copiază key-ul și înlocuiește `sk-or-v1-YOUR-API-KEY-HERE`

---

## PASUL 5: Creează Produse Test (10 min)

1. **Adaugă Primul Produs**
   - Meniu: **Products → Add New**

   **Detalii produs:**
   - Title: `iPhone 15 Pro 256GB`
   - Content: `Cel mai nou iPhone cu procesor A17 Pro și camera de 48MP`

   **Product Details (scroll down):**
   - Product Price: `5499.99`
   - Merchant Name: `eMAG`
   - Merchant ID: `1`
   - Product URL: `https://www.emag.ro/telefon-iphone-15-pro`
   - External Image URL: (lasă gol pentru test)
   - Category IDs: Select `Phones & Tablets` (ID: 2)

   - Click **Publish**

2. **Adaugă Mai Multe Produse**

   **Produs 2:**
   - Title: `Samsung Galaxy S24 Ultra`
   - Price: `6299.00`
   - Merchant: `Altex`
   - Merchant ID: `2`
   - URL: `https://altex.ro/samsung-s24`
   - Category: `Phones & Tablets`

   **Produs 3:**
   - Title: `MacBook Pro 14" M3`
   - Price: `12999.00`
   - Merchant: `iStyle`
   - Merchant ID: `3`
   - URL: `https://istyle.ro/macbook-pro`
   - Category: `Laptops`

   **Produs 4:**
   - Title: `Nike Air Max Plus`
   - Price: `799.99`
   - Merchant: `SportVision`
   - Merchant ID: `4`
   - URL: `https://sportvision.ro/nike-air-max`
   - Category: `Shoes`

   **Produs 5:**
   - Title: `Adidas Ultraboost`
   - Price: `899.00`
   - Merchant: `eMAG`
   - Merchant ID: `1`
   - URL: `https://emag.ro/adidas-ultraboost`
   - Category: `Shoes`

---

## PASUL 6: Verifică Database (2 min)

1. **Deschide phpMyAdmin**
   - **Local by Flywheel**: Click "Database" în Local app
   - **XAMPP**: http://localhost/phpmyadmin

2. **Verifică Tabelele**
   - Click pe database-ul `local` sau `market_time`
   - Caută tabele:
     - ✅ `wp_products_optimized` - ar trebui să existe
     - ✅ `wp_ai_generation_queue` - ar trebui să existe
     - ✅ `wp_product_priority` - ar trebui să existe

3. **Verifică Datele**
   - Click pe `wp_products_optimized`
   - Click "Browse"
   - **Ar trebui să vezi cele 5 produse create!**

---

## PASUL 7: Test API Endpoints (5 min)

### Test în Browser

1. **Lista Produse:**
   ```
   http://market-time.local/wp-json/market-time/v1/products
   ```

   **Răspuns așteptat:**
   ```json
   {
     "data": [
       {
         "id": 1,
         "title": "iPhone 15 Pro 256GB",
         "price": 5499.99,
         "merchant": {
           "id": 1,
           "name": "eMAG"
         },
         "image_url": null,
         "product_url": "https://www.emag.ro/...",
         "category_ids": ["2"],
         "last_updated": "2025-12-24 ..."
       },
       ...
     ],
     "pagination": {
       "page": 1,
       "per_page": 20,
       "total_count": 5,
       "total_pages": 1
     }
   }
   ```

2. **Produs Individual:**
   ```
   http://market-time.local/wp-json/market-time/v1/products/1
   ```

3. **Merchants:**
   ```
   http://market-time.local/wp-json/market-time/v1/merchants
   ```

   **Ar trebui să vezi:**
   ```json
   [
     {
       "id": 1,
       "name": "eMAG",
       "product_count": 2,
       "avg_price": 3149.495,
       "min_price": 799.99,
       "max_price": 5499.99
     },
     ...
   ]
   ```

4. **Categories:**
   ```
   http://market-time.local/wp-json/market-time/v1/categories
   ```

### Test cu Postman/Insomnia (Opțional)

- Importă collection
- Test POST pentru track-click
- Verifică rate limiting

---

## PASUL 8: Test AI Generation (10 min)

**⚠️ Necesită OpenRouter API Key configurat!**

1. **Trigger Manual AI Generation**

   **Metoda 1: Via WP Cron**
   - Instalează plugin "WP Crontrol"
   - Plugins → Add New → Search "WP Crontrol"
   - Install + Activate
   - Tools → Cron Events
   - Găsește `market_time_ai_generation`
   - Click "Run Now"

   **Metoda 2: Via URL (Trigger WP Cron)**
   ```
   http://market-time.local/wp-cron.php?doing_wp_cron
   ```

2. **Verifică Queue**
   - phpMyAdmin → `wp_ai_generation_queue`
   - Ar trebui să vezi produse în queue cu status `pending` sau `completed`

3. **Verifică AI Descriptions**
   - phpMyAdmin → `wp_products_optimized`
   - Click "Browse"
   - Găsește coloana `ai_descriptions`
   - Ar trebui să vezi JSON cu descrieri generate:

   ```json
   {
     "1": "iPhone 15 Pro este cel mai avansat smartphone...",
     "2": "Laptopul cu specificații premium pentru...",
     ...
   }
   ```

---

## PASUL 9: Test Frontend Next.js (5 min)

1. **Navighează la Frontend**
   ```bash
   cd "D:\Claude Code Test\market-time\frontend"
   ```

2. **Verifică .env.local**
   ```bash
   notepad .env.local
   ```

   **Trebuie să conțină:**
   ```env
   NEXT_PUBLIC_SITE_DOMAIN=market-time.local
   NEXT_PUBLIC_WP_API_URL=http://market-time.local/wp-json/market-time/v1
   WORDPRESS_API_URL=http://market-time.local/wp-json/market-time/v1
   ```

3. **Pornește Next.js**
   ```bash
   npm run dev
   ```

4. **Deschide în Browser**
   ```
   http://localhost:3000
   ```

   **Ar trebui să vezi pagina Next.js default**

5. **Test API din Next.js**

   Creează fișier test: `frontend/test-api.js`

   ```javascript
   const { getProducts } = require('./lib/api');

   async function test() {
     const response = await getProducts({ per_page: 5 });
     console.log('Produse:', response.data.length);
     console.log('Total:', response.pagination.total_count);
   }

   test();
   ```

   Rulează:
   ```bash
   node test-api.js
   ```

---

## ✅ CHECKLIST TESTARE

### Backend WordPress
- [ ] WordPress instalat și funcțional
- [ ] Tema "Market-Time" activată
- [ ] Plugin ACF instalat
- [ ] Must-Use Plugins active (4 bucăți)
- [ ] wp-config.php configurat cu API keys
- [ ] Minim 5 produse create
- [ ] Tabelul `wp_products_optimized` populat

### API Endpoints
- [ ] GET /products returnează JSON valid
- [ ] GET /products/{id} returnează detalii produs
- [ ] GET /merchants returnează listă merchants
- [ ] GET /categories returnează categorii
- [ ] Pagination funcționează corect

### Database
- [ ] Tabelul `wp_products_optimized` există
- [ ] Tabelul `wp_ai_generation_queue` există
- [ ] Tabelul `wp_product_priority` există
- [ ] Produsele apar în tabel după save
- [ ] Indecși creați corect

### AI System (Opțional - dacă ai API key)
- [ ] OpenRouter API key configurat
- [ ] WP Cron job rulează
- [ ] Queue procesează produse
- [ ] Descrieri AI generate
- [ ] JSON salvat în `ai_descriptions`

### Frontend Next.js
- [ ] npm install fără erori
- [ ] npm run dev pornește serverul
- [ ] localhost:3000 accesibil
- [ ] API client funcționează (test-api.js)

---

## 🐛 Troubleshooting

### Eroare: "Cannot modify header information"
**Soluție:** Verifică că nu ai spații/linii goale înainte de `<?php` în fișierele PHP

### API returnează 404
**Soluție:**
```bash
# WP Admin → Settings → Permalinks → Save Changes
# SAU via URL:
http://market-time.local/?rest_route=/market-time/v1/products
```

### Produsele nu apar în wp_products_optimized
**Soluție:**
- Re-salvează fiecare produs (Edit → Update)
- Verifică că tema e activată
- Check PHP error log

### Must-Use Plugins nu apar
**Soluție:**
- Verifică că directorul `mu-plugins` există
- Verifică permissions (chmod 755)
- Verifică că fișierele sunt în root-ul `mu-plugins/`, nu într-un subdirector

### AI nu generează descrieri
**Soluție:**
- Verifică OpenRouter API key în wp-config.php
- Test manual: Tools → Cron Events → Run `market_time_ai_generation`
- Check error_log pentru erori API

---

## 📊 Rezultate Așteptate

După testare, ar trebui să ai:

✅ **5+ produse** în WordPress
✅ **4 tabele custom** în database
✅ **API funcțional** cu JSON valid
✅ **Frontend Next.js** pornit pe localhost:3000
✅ **(Opțional) AI descriptions** generate

---

## 🎯 Next Steps După Testare

Când totul funcționează local:

1. **Dezvoltă Frontend Pages** (vezi COMPLETION_CHECKLIST.md)
2. **Setup Multisite** (vezi docs/MULTISITE_SETUP.md)
3. **Deploy Production** (vezi README.md)

---

**Timp total testare: ~1 oră**

Mult succes! 🚀

# 🚀 Quick Start Guide - Market-Time.ro

**Setup rapid în 30 minute!**

## ✅ Pre-requisites Check

```bash
node --version  # v18+
npm --version   # 10+
php --version   # 8.1+
mysql --version # 8.0+
```

---

## 📦 Pas 1: WordPress Local (10 min)

### Opțiunea Rapidă: Local by Flywheel

1. **Download & Install**
   - https://localwp.com → Download → Install

2. **Create Site**
   - Click "+" (Create a new site)
   - Site name: `market-time`
   - Environment: Preferred (PHP 8.1+, MySQL 8.0+)
   - Username: `admin`
   - Password: (alege una)
   - Advanced: Domain → `market-time.local`

3. **Start Site**
   - Click "Start site"
   - Note URLs:
     - Site: `http://market-time.local`
     - Admin: `http://market-time.local/wp-admin`

---

## 📁 Pas 2: Instalare Fișiere Backend (5 min)

### În Local by Flywheel:

1. **Deschide Site Shell** (buton în Local app)

2. **Navighează la wp-content:**

```bash
cd app/public/wp-content
```

3. **Copiază Tema:**

```bash
# Windows (din PowerShell/cmd, NU din Local shell)
xcopy /E /I "D:\Claude Code Test\market-time\backend\wp-content\themes\market-time" "C:\Users\[USER]\Local Sites\market-time\app\public\wp-content\themes\market-time"

# Sau manual: copy-paste folder în Windows Explorer
# Sursa: D:\Claude Code Test\market-time\backend\wp-content\themes\market-time
# Destinație: C:\Users\[USER]\Local Sites\market-time\app\public\wp-content\themes\
```

4. **Copiază Must-Use Plugins:**

```bash
# Creează directorul mu-plugins dacă nu există
mkdir mu-plugins

# Windows: copy-paste fișierele .php
# Sursa: D:\Claude Code Test\market-time\backend\wp-content\mu-plugins\*.php
# Destinație: C:\Users\[USER]\Local Sites\market-time\app\public\wp-content\mu-plugins\
```

**Fișiere de copiat:**
- ✅ market-time-db-optimization.php
- ✅ market-time-cdn.php
- ✅ market-time-rest-api.php
- ✅ market-time-ai-optimization.php

---

## 🎨 Pas 3: Activare Temă & Plugin-uri (3 min)

1. **Login WordPress Admin**
   - URL: `http://market-time.local/wp-admin`
   - User: `admin`
   - Password: (ce ai setat)

2. **Activează Tema**
   - Appearance → Themes
   - Găsește "Market-Time Headless CMS"
   - Click "Activate"

3. **Instalează ACF**
   - Plugins → Add New
   - Search: "Advanced Custom Fields"
   - Install + Activate (versiunea FREE e ok)

4. **Verificare**
   - În meniu lateral ar trebui să apară "Products"
   - Click pe "Products" → "Add New"
   - Ar trebui să vezi câmpurile: Price, Merchant Name, etc.

---

## ⚙️ Pas 4: Configurare wp-config.php (5 min)

### În Local by Flywheel:

1. **Deschide fișierul wp-config.php:**
   - Local app → Right-click site → "Reveal in Finder" (Mac) / "Show in Explorer" (Windows)
   - Navighează la: `app/public/wp-config.php`
   - Deschide cu Notepad++ sau VS Code

2. **Adaugă ÎNAINTE de linia** `/* That's all, stop editing! Happy publishing. */`:

```php
/* ============================================
   MARKET-TIME CONFIGURATION
   ============================================ */

// AI - OpenRouter (adaugă API key-ul tău aici)
define('OPENROUTER_API_KEY', 'sk-or-v1-YOUR-KEY-HERE'); // Get from https://openrouter.ai
define('OPENROUTER_MODEL', 'meta-llama/llama-3.1-70b-instruct');

// CDN - BunnyCDN (opțional, pentru production)
// define('BUNNYCDN_URL', 'https://your-cdn.b-cdn.net');

// Cloudinary (opțional)
// define('CLOUDINARY_CLOUD_NAME', 'your-cloud');
// define('CLOUDINARY_API_KEY', 'your-key');
// define('CLOUDINARY_API_SECRET', 'your-secret');

// Category to Site Mapping (se va folosi după Multisite setup)
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

3. **Salvează fișierul**

**IMPORTANT:** Dacă nu ai OpenRouter API key:
- Mergi la https://openrouter.ai
- Sign up (gratis)
- Dashboard → Keys → Create Key
- Copiază key-ul și înlocuiește `sk-or-v1-YOUR-KEY-HERE`

---

## 🧪 Pas 5: Test Backend (2 min)

1. **Creează un produs test:**
   - WP Admin → Products → Add New
   - Title: `iPhone 15 Pro - Test`
   - Content: (opțional)
   - Scroll down → Product Details:
     - Product Price: `5499.99`
     - Merchant Name: `eMAG`
     - Merchant ID: `1`
     - Product URL: `https://emag.ro`
     - Category IDs: Select `Phones & Tablets`
   - Click "Publish"

2. **Verifică API:**
   - Deschide în browser: `http://market-time.local/wp-json/market-time/v1/products`
   - Ar trebui să vezi JSON cu produsul tău

**Răspuns așteptat:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "iPhone 15 Pro - Test",
      "price": 5499.99,
      "merchant": {
        "id": 1,
        "name": "eMAG"
      },
      ...
    }
  ],
  "pagination": {...}
}
```

✅ **Dacă vezi JSON-ul → Backend funcționează perfect!**

---

## ⚛️ Pas 6: Setup Frontend Next.js (5 min)

1. **Editează .env.local:**

```bash
cd "D:\Claude Code Test\market-time\frontend"
notepad .env.local
```

Verifică/editează:

```env
NEXT_PUBLIC_SITE_DOMAIN=market-time.local
NEXT_PUBLIC_WP_API_URL=http://market-time.local/wp-json/market-time/v1
WORDPRESS_API_URL=http://market-time.local/wp-json/market-time/v1
```

2. **Pornește Next.js:**

```bash
npm run dev
```

**Răspuns așteptat:**

```
   ▲ Next.js 14.x
   - Local:        http://localhost:3000

 ✓ Ready in 2.3s
```

3. **Deschide în browser:**
   - http://localhost:3000
   - Ar trebui să vezi pagina Next.js default

---

## 🎉 Succes! Setup Complet

### Ce ai acum:

✅ WordPress local cu tema Market-Time
✅ Custom Post Type "Products"
✅ ACF Fields pentru produse
✅ Tabel optimizat `wp_products_optimized`
✅ REST API funcțional la `/wp-json/market-time/v1/`
✅ AI Optimization sistem (cu OpenRouter)
✅ Next.js frontend la `localhost:3000`

---

## 📋 Next Steps

### Nivel 1: Test & Explorare (30 min)

1. **Adaugă mai multe produse test** (5-10 produse)
   - Diferite categorii
   - Diferite prețuri
   - Diferiți merchants

2. **Test API endpoints:**
   ```
   GET http://market-time.local/wp-json/market-time/v1/products
   GET http://market-time.local/wp-json/market-time/v1/products/1
   GET http://market-time.local/wp-json/market-time/v1/merchants
   GET http://market-time.local/wp-json/market-time/v1/categories
   ```

3. **Verifică tabelul optimizat:**
   - Deschide phpMyAdmin (în Local: Database → Adminer)
   - Table: `wp_products_optimized`
   - Verifică că produsele apar aici

### Nivel 2: Multisite Setup (1 oră)

Urmează ghidul detaliat: [docs/MULTISITE_SETUP.md](docs/MULTISITE_SETUP.md)

1. Activează WordPress Multisite
2. Instalează Mercator
3. Creează 7 site-uri
4. Mapează domeniile

### Nivel 3: Frontend Development (2-3 ore)

1. **Homepage cu lista produse:**
   - Editează `frontend/app/page.tsx`
   - Folosește `getProducts()` din `lib/api.ts`
   - Afișează produsele într-un grid

2. **Product detail page:**
   - Creează `frontend/app/products/[id]/page.tsx`
   - Folosește `getProduct(id)` din `lib/api.ts`

3. **Componente UI:**
   - ProductCard.tsx
   - ProductGrid.tsx
   - FilterSidebar.tsx
   - etc.

---

## 🆘 Probleme Comune

### "Cannot find module" în Next.js

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### API returnează 404

```bash
# În WP Admin
Settings → Permalinks → Save Changes (fără modificări)

# Sau via WP-CLI în Local Shell
wp rewrite flush
```

### Products nu apar în tabelul optimizat

```bash
# Re-salvează produsele
# WP Admin → Products → Edit fiecare produs → Update
```

### ACF fields nu apar

- Dezactivează și reactivează tema
- Sau reinstalează Advanced Custom Fields plugin

---

## 📞 Need Help?

- 📖 Vezi documentația: [docs/](docs/)
- 📊 Status implementare: [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md)
- 🐛 Check troubleshooting în README.md

---

**Timp total setup: ~30 minute** ⏱️

Mult succes! 🚀

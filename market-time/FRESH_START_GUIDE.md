# Fresh Start Guide - Lansare Site Nou de Nișă

**Document:** Ghid pentru clonarea stack-ului Market-Time.ro pentru un domeniu nou
**Versiune:** 1.0
**Data:** 2026-01-03

---

## 📋 OBIECTIV

Acest ghid descrie cum să lansezi un site nou de nișă (ex: **rochii.ro**, **electrocasnice.ro**) folosind arhitectura Market-Time.ro ca template, dar cu **fresh start** (instalație curată) pentru a evita overhead-ul de date irelevante.

---

## 🎯 STRATEGIE: Fresh Start vs Clone

### ❌ NU Recomandăm: Clone + Cleanup
- Clonezi tot (WordPress + DB complet)
- Apoi ștergi produsele irelevante → risc de erori
- DB rămâne mare și fragmentat
- Timp: 4-6 ore

### ✅ RECOMANDAT: Fresh Start
- Instalare fresh WordPress
- Import doar configurări (ACF, plugins)
- Import doar feeduri relevante pentru nișă
- DB optimizat de la început
- Timp: 2-3 ore

---

## 🚀 PROCES COMPLET - FRESH START

### **FASE 1: PREGĂTIRE TEMPLATE (Făcut O SINGURĂ DATĂ)**

#### 1.1. Export ACF Field Groups

```bash
# Din WordPress Admin → ACF → Tools → Export Field Groups
# Selectează toate field groups:
- Category SEO
- Brand SEO
- Merchant SEO
- Product Fields

# Export to PHP sau JSON (salvează în /market-time/templates/acf-fields/)
```

#### 1.2. Salvează Custom Code

```bash
# Copiază mu-plugins în templates folder
cp /home/market-time-api/htdocs/api.market-time.ro/wp-content/mu-plugins/*.php \
   d:/Claude\ Code\ Test/market-time/templates/mu-plugins/

# Rezultat:
/market-time/templates/
├── mu-plugins/
│   ├── market-time-rest-api.php
│   ├── market-time-db-optimization.php
│   ├── market-time-brand-seo.php
│   ├── market-time-category-seo.php
│   ├── market-time-merchant-taxonomy.php
│   └── market-time-import-helpers.php
└── acf-fields/
    └── acf-export.json
```

#### 1.3. Documentează WP All Import Mapping

Creează un document cu mapping-ul standard pentru produse:

```
MAPPING TEMPLATE - WP All Import

XML Structure:
- product_id → SKU
- title → Post Title
- price → ACF: price
- price_regular → ACF: price_regular
- image_url → Featured Image
- product_url → ACF: product_url
- category_name → Taxonomy: product_category
- brand → Taxonomy: product_brand
- merchant → Taxonomy: merchant
- description → ACF: short_description
```

Salvează în: `/market-time/templates/wpallimport-mapping.txt`

---

### **FASE 2: LANSARE SITE NOU (EX: ROCHII.RO)**

#### 2.1. Setup Server - WordPress Backend

```bash
# SSH în server
ssh root@185.104.181.59

# Creează folder pentru noul site
mkdir -p /home/rochii-api/htdocs/api.rochii.ro

# Descarcă WordPress fresh
cd /home/rochii-api/htdocs/api.rochii.ro
wget https://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz
mv wordpress/* .
rm -rf wordpress latest.tar.gz

# Creează baza de date
mysql -u root -p
CREATE DATABASE rochii_ro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'rochii_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON rochii_ro.* TO 'rochii_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Configurează wp-config.php
cp wp-config-sample.php wp-config.php
nano wp-config.php

# Update:
define('DB_NAME', 'rochii_ro');
define('DB_USER', 'rochii_user');
define('DB_PASSWORD', 'STRONG_PASSWORD_HERE');

# Generate keys: https://api.wordpress.org/secret-key/1.1/salt/
```

#### 2.2. Instalare WordPress

```bash
# Accesează în browser: http://185.104.181.59/api.rochii.ro
# Completează wizard:
- Site Title: Rochii.ro API
- Username: admin
- Password: STRONG_PASSWORD
- Email: contact@rochii.ro

# SAU via WP-CLI:
cd /home/rochii-api/htdocs/api.rochii.ro
wp core install \
  --url="http://api.rochii.ro" \
  --title="Rochii.ro API" \
  --admin_user="admin" \
  --admin_password="STRONG_PASSWORD" \
  --admin_email="contact@rochii.ro" \
  --allow-root
```

#### 2.3. Instalare Plugins

```bash
# ACF Pro (manual - upload .zip din contul ACF)
# SAU instalare alte plugins via WP-CLI:

wp plugin install advanced-custom-fields --activate --allow-root
wp plugin install wp-all-import --activate --allow-root
wp plugin install wp-all-import-pro --activate --allow-root
```

#### 2.4. Copy Custom MU-Plugins

```bash
# Copiază mu-plugins din template
scp -r d:/Claude\ Code\ Test/market-time/templates/mu-plugins/* \
  root@185.104.181.59:/home/rochii-api/htdocs/api.rochii.ro/wp-content/mu-plugins/

# Verifică ownership
ssh root@185.104.181.59
chown -R www-data:www-data /home/rochii-api/htdocs/api.rochii.ro/wp-content/mu-plugins
```

#### 2.5. Import ACF Fields

```bash
# Opțiunea A: Via WordPress Admin
# ACF → Tools → Import Field Groups
# Upload: acf-export.json

# Opțiunea B: Via code în functions.php
# (Dacă ai exportat în PHP format)
```

#### 2.6. Configurare WP All Import - Feeduri Fashion

```bash
# WordPress Admin → All Import → New Import

# Import 1: Answear.ro (Fashion)
URL: https://feed.2performant.com/answear-feed-id.xml
Filter XPath: //product[category='Fashion']
Schedule: Daily at 3:00 AM

# Import 2: FashionDays.ro
URL: https://feed.2performant.com/fashiondays-feed-id.xml
Schedule: Daily at 4:00 AM

# Import 3: DyFashion.ro (deja configurat pe market-time.ro)
URL: https://feed.2performant.com/dyfashion-feed-id.xml
Schedule: Daily at 5:00 AM

# Import 4: Zalando.ro
URL: https://feed.2performant.com/zalando-feed-id.xml
Schedule: Daily at 6:00 AM
```

**Mapping Template (aplică la toate importurile):**
```
Unique Identifier: product_id (SKU)

Content:
- Post Title: {title}
- Post Type: products
- Post Status: publish

ACF Fields:
- price: {price}
- price_regular: {price_regular}
- image_url: {image_url}
- product_url: {product_url}
- affiliate_code: {affiliate_link}
- short_description: {description}
- vendor: 2Performant

Taxonomies:
- product_category: {category_name} (Create if doesn't exist)
- product_brand: {brand} (Create if doesn't exist)
- merchant: {merchant_name} (Create if doesn't exist)

Featured Image:
- Download from URL: {image_url}
```

#### 2.7. Run First Imports

```bash
# WordPress Admin → All Import → Manage Imports
# Pentru fiecare import:
1. Click "Run Import"
2. Așteaptă finalizare (monitorizează progress)
3. Verifică în Products dacă produsele sunt importate

# Verificare în DB:
ssh root@185.104.181.59
mysql -u rochii_user -p rochii_ro

SELECT COUNT(*) FROM wp_posts WHERE post_type='products';
SELECT COUNT(*) FROM wp_products_optimized;

# Trebuie să fie egal (sau wp_products_optimized poate fi gol inițial)
```

#### 2.8. Setup wp_products_optimized

```bash
# Dacă market-time-db-optimization.php e activat, va popula automat
# Verifică cu:
SELECT COUNT(*) FROM wp_products_optimized;

# Dacă e gol, run manual sync script (dacă există în mu-plugins)
```

---

### **FASE 3: FRONTEND NEXT.JS - ROCHII.RO**

#### 3.1. Clone Frontend Folder

```bash
# Pe local machine
cd d:/Claude\ Code\ Test/market-time/

# Clone frontend
cp -r frontend rochii-frontend

# Rename în package.json
cd rochii-frontend
nano package.json
# Change: "name": "rochii-frontend"
```

#### 3.2. Update Environment Variables

```bash
# Creează .env.local
cp .env.local.example .env.local
nano .env.local

# Update:
NEXT_PUBLIC_API_URL=https://api.rochii.ro/wp-json/market-time/v1
NEXT_PUBLIC_WP_API_URL=https://api.rochii.ro/wp-json
NEXT_PUBLIC_SITE_URL=https://rochii.ro
```

#### 3.3. Customizare Design (Opțional dar Recomandat)

```bash
# Culori și branding în tailwind.config.js
nano tailwind.config.ts

# Exemplu pentru rochii.ro (fashion theme):
theme: {
  extend: {
    colors: {
      primary: '#FF1493',    // DeepPink - fashion
      secondary: '#FFB6C1',  // LightPink
      accent: '#FF69B4',     // HotPink
    }
  }
}

# Logo
# Înlocuiește /public/logo.png cu logo-ul rochii.ro

# Metadata SEO în app/layout.tsx
nano app/layout.tsx

# Update:
export const metadata: Metadata = {
  title: {
    default: 'Rochii.ro - Compară Prețuri la Rochii Online',
    template: '%s | Rochii.ro',
  },
  description: 'Compară prețurile la rochii din magazinele online. Găsește cele mai bune oferte la rochii elegante, casual, de seară.',
  // ...
}
```

#### 3.4. Test Local

```bash
npm install
npm run dev

# Accesează: http://localhost:3000
# Testează:
- Homepage loads
- /produse shows products
- Filters work (categories, merchants)
- Product detail pages load
```

#### 3.5. Deploy pe Vercel

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit - Rochii.ro frontend"
git branch -M main
git remote add origin https://github.com/username/rochii-frontend.git
git push -u origin main

# Vercel Dashboard:
1. Import Git Repository
2. Select: rochii-frontend
3. Framework: Next.js
4. Root Directory: ./
5. Environment Variables:
   - NEXT_PUBLIC_API_URL
   - NEXT_PUBLIC_WP_API_URL
   - NEXT_PUBLIC_SITE_URL
6. Deploy
```

---

### **FASE 4: DNS & DOMAIN CONFIGURATION**

#### 4.1. Configurare DNS în Cloudflare

```
rochii.ro:
  Type: A
  Name: @
  Content: 76.76.21.21 (Vercel IP)
  Proxy: ON

  Type: CNAME
  Name: www
  Content: cname.vercel-dns.com
  Proxy: OFF

api.rochii.ro:
  Type: A
  Name: api
  Content: 185.104.181.59 (Server WordPress)
  Proxy: OFF (important pentru API)
```

#### 4.2. Adaugă Domain în Vercel

```
Vercel Dashboard → Project Settings → Domains

Add Domain:
- rochii.ro (Production)
- www.rochii.ro (Redirect to rochii.ro)

Vercel va auto-provision SSL (Let's Encrypt)
```

#### 4.3. Update WordPress Site URL

```bash
ssh root@185.104.181.59
cd /home/rochii-api/htdocs/api.rochii.ro

wp option update siteurl 'https://api.rochii.ro' --allow-root
wp option update home 'https://api.rochii.ro' --allow-root

# Verifică:
wp option get siteurl --allow-root
```

---

### **FASE 5: TESTARE & VERIFICARE**

#### 5.1. Checklist Backend

```bash
✅ WordPress Admin accessible: https://api.rochii.ro/wp-admin
✅ REST API funcțional: https://api.rochii.ro/wp-json/market-time/v1/products
✅ Produse importate: Minimum 50-100 produse
✅ Taxonomii create: Categories, Brands, Merchants
✅ ACF fields funcționale
✅ Cron jobs active (WP All Import)
```

#### 5.2. Checklist Frontend

```bash
✅ Site accesibil: https://rochii.ro
✅ SSL activ (HTTPS funcționează)
✅ Homepage loads
✅ /produse afișează produsele
✅ Filters work (category, brand, merchant)
✅ Product detail pages (/p/[category]/[slug])
✅ Legal pages (/pg/termeni-si-conditii, etc.)
✅ Footer cu linkuri
✅ Mobile responsive
```

#### 5.3. SEO Checklist

```bash
✅ Meta tags prezente (View Source)
✅ Sitemap.xml: https://rochii.ro/sitemap.xml
✅ Robots.txt: https://rochii.ro/robots.txt
✅ Structured Data (JSON-LD în product pages)
✅ No broken links (test cu Screaming Frog)
```

---

## 🔄 MENTENANȚĂ & UPDATES

### Import Feeduri Noi

```bash
# Când adaugi un merchant nou:
1. WordPress Admin → All Import → New Import
2. Configure feed URL
3. Apply template mapping (folosește același mapping ca feedurile existente)
4. Set schedule
5. Run manual first import
6. Verifică produsele în DB
```

### Update ACF Fields

```bash
# Dacă modifici ACF fields pe market-time.ro:
1. Export field groups din market-time.ro
2. Import în rochii.ro (WordPress Admin → ACF → Tools → Import)
3. Verifică că fields apar corect
```

### Update Custom Code (mu-plugins)

```bash
# Dacă modifici market-time-rest-api.php pe market-time.ro:
1. Test local pe market-time.ro
2. Copy fișierul modificat:
scp market-time-rest-api.php root@185.104.181.59:/home/rochii-api/htdocs/api.rochii.ro/wp-content/mu-plugins/

3. Verifică că API funcționează:
curl https://api.rochii.ro/wp-json/market-time/v1/products?per_page=1
```

### Update Frontend

```bash
# Modificări în frontend (ex: design, features):
1. Dezvoltă pe market-time.ro
2. Test local
3. Când e gata, copy changes în rochii-frontend
4. Commit & push to GitHub
5. Vercel auto-deploy
```

---

## 💰 COST ESTIMATE per Site Nou

### One-Time Costs:
- Domain (.ro): €10/an
- Setup timp: 2-3 ore (dacă ai template pregătit)

### Recurring Costs:
- Domain renewal: €10/an
- Vercel Hosting: FREE (Hobby plan suficient)
- WordPress Hosting: €0 (shared VPS cu market-time.ro)
- SSL: FREE (Vercel auto)

**Total per site nou:** ~€10/an + 3 ore setup

### Scalare:
- 5 site-uri: €50/an
- 10 site-uri: €100/an
- Hosting: Același VPS poate ține 5-10 site-uri fără probleme

---

## 🎯 TIMELINE ESTIMAT

### Cu Template Pregătit:

| Fază | Timp Estimat |
|------|--------------|
| Setup WordPress Backend | 30 min |
| Install plugins + ACF import | 15 min |
| Copy mu-plugins | 10 min |
| Configure WP All Import (4 feeduri) | 45 min |
| Run first imports | 30 min (automat) |
| Clone + customize frontend | 30 min |
| Deploy Vercel | 15 min |
| DNS configuration | 10 min |
| Testing & verification | 30 min |
| **TOTAL** | **~3 ore** |

---

## 📋 CHECKLIST LANSARE - ROCHII.RO

### Pre-Launch:
- [ ] Domain rochii.ro achiziționat
- [ ] VPS are spațiu disponibil (minim 1GB disk)
- [ ] Template ACF + mu-plugins pregătit
- [ ] Merchant feeds identificate (Answear, FashionDays, etc.)

### Backend Setup:
- [ ] WordPress instalat la api.rochii.ro
- [ ] Baza de date creată (rochii_ro)
- [ ] Plugins instalate (ACF, WP All Import)
- [ ] ACF fields importate
- [ ] mu-plugins copiate
- [ ] WP All Import configured (4 feeduri fashion)
- [ ] First imports completed (minim 100 produse)
- [ ] wp_products_optimized populated
- [ ] REST API testat

### Frontend Setup:
- [ ] Frontend clonat (rochii-frontend)
- [ ] .env.local configurat
- [ ] Design customizat (colors, logo)
- [ ] SEO metadata updated
- [ ] Test local passed
- [ ] Git push to GitHub
- [ ] Vercel deployment successful

### DNS & Domain:
- [ ] DNS configured în Cloudflare
- [ ] Domain adăugat în Vercel
- [ ] SSL activ
- [ ] WordPress site URLs updated

### Go Live:
- [ ] rochii.ro accesibil (HTTPS)
- [ ] Toate paginile funcționează
- [ ] Filters work
- [ ] Product URLs cu slug
- [ ] Legal pages live
- [ ] SEO tags prezente
- [ ] Sitemap.xml funcțional

### Post-Launch:
- [ ] Google Analytics setup
- [ ] Google Search Console added
- [ ] Sitemap submitted
- [ ] Monitor imports daily (first week)
- [ ] Check affiliate tracking

---

## 🚨 TROUBLESHOOTING COMMON ISSUES

### Issue: Produsele nu apar în wp_products_optimized

**Soluție:**
```bash
# Verifică dacă hook-ul market-time-db-optimization.php e activat
# Dacă nu, run manual populate script (dacă există)
# SAU instalează plugin separat pentru sync
```

### Issue: REST API returnează 404

**Soluție:**
```bash
# Regenerează permalinks
wp rewrite flush --allow-root

# Verifică .htaccess
ls -la /home/rochii-api/htdocs/api.rochii.ro/.htaccess

# Dacă lipsește, creează:
wp rewrite flush --hard --allow-root
```

### Issue: ACF fields nu se salvează

**Soluție:**
```bash
# Verifică versiunea ACF (trebuie Pro pentru taxonomy fields)
wp plugin list --allow-root | grep acf

# Verifică permissions DB
SHOW GRANTS FOR 'rochii_user'@'localhost';
```

### Issue: WP All Import nu rulează schedule

**Soluție:**
```bash
# Verifică WP-Cron
wp cron event list --allow-root

# Force run WP-Cron
wp cron event run --due-now --allow-root

# SAU setup real cron:
crontab -e
# Add: */15 * * * * wget -q -O - https://api.rochii.ro/wp-cron.php?doing_wp_cron
```

---

## 📞 SUPPORT

Dacă întâmpini probleme în timpul setup-ului:

1. **Verifică acest ghid** pas cu pas
2. **Check logs:**
   - WordPress: `/home/rochii-api/htdocs/api.rochii.ro/wp-content/debug.log`
   - Vercel: Dashboard → Deployments → View Logs
3. **Test REST API direct:**
   ```bash
   curl https://api.rochii.ro/wp-json/market-time/v1/products?per_page=1
   ```

---

**Document creat:** 2026-01-03
**Versiune:** 1.0
**Autor:** Claude (Anthropic)
**Pentru:** Market-Time.ro Multi-Site Expansion

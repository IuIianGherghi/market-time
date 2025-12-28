# 🛒 MARKET-TIME.RO

**Sistem Headless CMS Multi-Domain cu AI Optimization**

Platformă de comparare prețuri pentru 1.5M produse, 50+ magazine, cu 7 domenii specializate pe nișe și descrieri generate de AI.

---

## 📋 Specificații Tehnice

| Categorie | Detalii |
|-----------|---------|
| **Versiune** | v4.0 FINAL - Multi-Domain + AI |
| **Backend** | WordPress Multisite 6.x + PHP 8.1+ + MySQL 8.0+ |
| **Frontend** | Next.js 14 App Router + TypeScript + Tailwind CSS |
| **AI Engine** | OpenRouter API (Llama 3.1-70B) |
| **CDN** | BunnyCDN + Cloudinary fallback |
| **Cache** | Redis Object Cache (obligatoriu) |
| **Capacitate** | 1.5M produse, 50+ merchants, 7 domenii |

---

## 🌐 Arhitectură Multi-Domain

### Domenii Nișă

| Domeniu | Nișă | Categorii | Target Audience |
|---------|------|-----------|-----------------|
| **market-time.ro** | General | Toate | Consumatori care caută preț |
| **electronica.ro** | Tech & IT | Laptops, Phones, Tablets | Tech enthusiasts, gameri |
| **fashion.ro** | Modă | Clothing, Accessories | Fashion-conscious |
| **incaltaminte.ro** | Încălțăminte | Shoes | Focus pe comfort |
| **casa-living.ro** | Casă & Grădină | Furniture, Decor | Home design |
| **cadouri.ro** | Cadouri | Gifts & Toys | Cumpărători cadouri |
| **sport-fitness.ro** | Sport | Equipment | Sportivi, fitness |

---

## 🚀 Pornire Rapidă

### 🐳 Opțiunea 1: Docker (RECOMANDAT - Setup Automat)

**Cel mai rapid mod de a porni proiectul - 3 comenzi:**

```bash
cp .env.example .env     # Creează config
make install             # Instalare completă WordPress + MySQL + phpMyAdmin
make setup               # Creează 5 produse demo
```

**Acces instant:**
- WordPress Admin: http://localhost:8080/wp-admin (admin/admin123)
- API: http://localhost:8080/wp-json/market-time/v1/products
- phpMyAdmin: http://localhost:8081

📚 **Documentație completă:** [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md)
⚡ **Quick Reference:** [DOCKER_QUICK_REFERENCE.md](DOCKER_QUICK_REFERENCE.md)

**Avantaje Docker:**
- ✅ Setup complet în 5 minute
- ✅ Zero configurare manuală
- ✅ Reproducibil 100% pe orice sistem
- ✅ Includes: WordPress, MySQL, phpMyAdmin, WP-CLI
- ✅ Hot reload - modificările sunt instant vizibile

---

### 💻 Opțiunea 2: Local by Flywheel (Manual)

```bash
# Download de la https://localwp.com
# Creează site nou: "market-time"
# Server: Nginx (recomandat)
```

📚 **Ghid complet:** [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

### ⚙️ Opțiunea 3: Manual (Avansat)

### Cerințe Preliminare

- Node.js v18+
- WordPress 6.x
- MySQL 8.0+
- PHP 8.1+
- Redis Server (recomandat)

### 1. Instalare Backend WordPress

```bash
# Instalează WordPress manual
# Creează database "market_time"
```

### 2. Copiază Fișierele

```bash
# Tema
cp -r backend/wp-content/themes/market-time /path/to/wp/wp-content/themes/

# Must-Use Plugins
cp backend/wp-content/mu-plugins/* /path/to/wp/wp-content/mu-plugins/
```

### 3. Activează & Configurează

1. **WordPress Admin**
   - Themes → Activate "Market-Time Headless CMS"
   - Plugins → Install "Advanced Custom Fields"
   - Plugins → Install "Redis Object Cache" (dacă ai Redis)

2. **wp-config.php** - Adaugă:

```php
// Multisite
define('WP_ALLOW_MULTISITE', true);

// CDN
define('BUNNYCDN_URL', 'https://your-cdn.b-cdn.net');

// AI
define('OPENROUTER_API_KEY', 'sk-or-v1-...');

// Site-Category Mapping
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

3. **Setup Multisite**
   - Urmează ghidul: [docs/MULTISITE_SETUP.md](docs/MULTISITE_SETUP.md)

### 4. Instalare Frontend

```bash
cd frontend
npm install
```

### 5. Configurare Environment

Editează `frontend/.env.local`:

```env
NEXT_PUBLIC_SITE_DOMAIN=market-time.local
NEXT_PUBLIC_WP_API_URL=http://market-time.local/wp-json/market-time/v1
WORDPRESS_API_URL=http://market-time.local/wp-json/market-time/v1
```

### 6. Pornește Aplicațiile

```bash
# Frontend Next.js
cd frontend
npm run dev
# → http://localhost:3000

# Backend WordPress
# → http://market-time.local (sau Local site URL)
```

---

## 📂 Structură Proiect

```
market-time/
├── backend/
│   └── wp-content/
│       ├── themes/
│       │   └── market-time/          # Tema headless WordPress
│       │       ├── functions.php     # CPT Products + ACF Fields
│       │       ├── style.css
│       │       └── index.php
│       └── mu-plugins/
│           ├── market-time-db-optimization.php    # Tabel optimizat + sync
│           ├── market-time-cdn.php                # BunnyCDN + Cloudinary
│           ├── market-time-rest-api.php           # Custom API endpoints
│           └── market-time-ai-optimization.php    # AI descriptions + queue
│
├── frontend/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Homepage (ISR)
│   │   ├── products/[id]/page.tsx    # Product detail (SSG+ISR)
│   │   └── search/page.tsx           # Search & filter
│   ├── lib/
│   │   ├── types.ts                  # TypeScript interfaces
│   │   └── api.ts                    # API client cu retry logic
│   ├── .env.local                    # Environment variables
│   └── next.config.js                # Multi-domain config
│
├── docs/
│   ├── CONFIG.md                     # Configurare generală
│   ├── WORDPRESS_SETUP.md            # Ghid instalare WP
│   ├── MULTISITE_SETUP.md            # Configurare Multisite
│   ├── IMPLEMENTATION_STATUS.md      # Status implementare
│   └── category-mapping.json         # Mapping categorii + AI config
│
└── scripts/                          # Scripturi automation (viitor)
```

---

## 🔌 API Endpoints

### Products

```http
GET /wp-json/market-time/v1/products
```

**Parametri:**
- `page` (default: 1)
- `per_page` (default: 20, max: 100)
- `merchant_id` - Filtrare după merchant
- `min_price`, `max_price` - Range de preț
- `orderby` - `price`, `date`, `title`
- `order` - `ASC`, `DESC`

**Response:**

```json
{
  "data": [
    {
      "id": 123,
      "title": "iPhone 15 Pro",
      "price": 5499.99,
      "merchant": {
        "id": 5,
        "name": "eMAG"
      },
      "image_url": "https://cdn.market-time.ro/...",
      "product_url": "https://emag.ro/...",
      "category_ids": [2],
      "last_updated": "2025-12-24 10:30:00"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_count": 1500000,
    "total_pages": 75000
  }
}
```

### Product Detail

```http
GET /wp-json/market-time/v1/products/{id}
```

**Response:** Include `description_full` (AI-generated per domain) + `seo` metadata

### Merchants & Categories

```http
GET /wp-json/market-time/v1/merchants
GET /wp-json/market-time/v1/categories
```

### Tracking

```http
POST /wp-json/market-time/v1/track-click
Content-Type: application/json

{
  "product_id": 123
}
```

---

## 🤖 AI Optimization

### Generare Descrieri

Sistemul generează automat descrieri unice pentru fiecare domeniu folosind OpenRouter API (Llama 3.1-70B).

**Configurare per domeniu:**

```json
{
  "domain": "electronica.ro",
  "niche": "tech",
  "tone": "Tehnic, detaliat",
  "focus_keywords": ["specs", "performanță", "tehnologie"],
  "target_audience": "Tech enthusiasts"
}
```

**Prompt AI:**
- 180-220 cuvinte
- Specific pentru audiența domeniului
- Keywords naturale (fără keyword stuffing)
- Ton adaptat nișei

### Priority Scoring

Produsele sunt prioritizate pentru generare AI bazat pe:

- Impressions Google Search Console (20 pts)
- Clicks (20 pts)
- Position 5-15 în SERP (20 pts)
- CTR < 2% (15 pts)
- Bounce rate > 70% (10 pts)
- Price > 2000 RON (10 pts)
- Merchant conversion > 5% (5 pts)

**Total:** 0-100 puncte

Produsele cu score >= 50 intră în coada de generare AI.

### Queue Processing

WP Cron job rulează la fiecare 2 minute:
- Procesează 50 produse/batch
- Rate limiting: 1s între API calls
- Retry logic: max 3 attempts
- Generare pentru toate domeniile relevante

---

## ⚡ Optimizare Performanță

### Database

- **Tabel custom** `wp_products_optimized` - 12 indecși optimizați
- **Redis Cache** - Obligatoriu pentru 1.5M produse (impact 300-500%)
- **Query optimization** - Evită wp_postmeta pentru produse

### CDN

- **BunnyCDN** - Pull Zone cu origin WordPress
- **Cloudinary** - Fallback + transformări imagini
- **Next.js Image** - Auto-optimization (WebP, AVIF)

### ISR (Incremental Static Regeneration)

| Tip Pagină | Revalidation Time |
|------------|-------------------|
| Homepage | 1800s (30 min) |
| Product Detail | 21600s (6h) |
| Search | 0s (on-demand) |
| Category | 3600s (1h) |
| Static pages | 86400s (24h) |

### Target Metrics

- **Lighthouse Performance:** 90+
- **SEO:** 100
- **API Response Time:** <200ms
- **Page Load:** <2s
- **Bundle Size:** <200KB initial

---

## 📊 Baza de Date

### Tabele Custom

#### `wp_products_optimized`
Tabel principal pentru produse (înlocuiește postmeta):

```sql
- id, post_id, site_id
- title, price, merchant_id, merchant_name
- image_url, product_url, category_ids
- ai_descriptions (JSON)
- last_updated
```

**Indecși:** site_id, merchant_id, price, category_ids, site+category, etc.

#### `wp_ai_generation_queue`
Coada pentru generare AI:

```sql
- id, product_id, site_id, priority_score
- status (pending/processing/completed/failed)
- attempts, created_at, processed_at
```

#### `wp_product_priority`
Priority scores pentru AI optimization:

```sql
- product_id, site_id, priority_score
- impressions, clicks, ctr, position
- bounce_rate, conversions
```

#### `wp_product_clicks`
Tracking affiliate clicks:

```sql
- product_id, clicked_at, user_ip
- referrer, site_id
```

---

## 🔧 Configurare Avansată

### BunnyCDN Setup

1. Creează cont la [bunny.net](https://bunny.net)
2. Creează Pull Zone:
   - Origin URL: `https://market-time.ro`
   - Primești CDN URL: `https://xyz.b-cdn.net`
3. (Opțional) Custom domain:
   - CNAME: `cdn.market-time.ro` → `xyz.b-cdn.net`
4. Adaugă în wp-config.php:

```php
define('BUNNYCDN_URL', 'https://cdn.market-time.ro');
```

### Cloudinary Setup

1. Cont la [cloudinary.com](https://cloudinary.com)
2. Adaugă în wp-config.php:

```php
define('CLOUDINARY_CLOUD_NAME', 'your-cloud');
define('CLOUDINARY_API_KEY', 'your-key');
define('CLOUDINARY_API_SECRET', 'your-secret');
```

### Redis Cache

```bash
# Linux/Mac
sudo apt install redis-server
sudo systemctl start redis

# Activează în WordPress
wp redis enable
```

---

## 📈 Deployment Production

Vezi ghidul complet: [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md)

**Checklist:**
- [ ] WordPress pe server production
- [ ] DNS A records pentru toate domeniile
- [ ] SSL certificates (Certbot sau Cloudflare)
- [ ] Next.js deploy pe Vercel (multi-domain)
- [ ] Environment variables production
- [ ] Google Analytics + Search Console
- [ ] Backup automation (UpdraftPlus)

---

## 📝 Status Implementare

**Progres:** 60% (40/67 tasks completate)

✅ **Completat:**
- Pregătire mediu
- Backend WordPress complet (CPT, ACF, DB optimization)
- CDN integration (BunnyCDN + Cloudinary)
- REST API custom endpoints
- AI Optimization system
- Frontend Next.js setup (types, API client)

🚧 **În lucru:**
- Frontend pages (homepage, product detail, search)
- UI components

⏳ **De făcut:**
- Performance optimization
- Import & automation scripturi
- Deployment production

---

## 🆘 Troubleshooting

### WordPress nu creează tabelele custom

```bash
# Verifică în phpMyAdmin dacă tabelele există
# Dacă nu, rulează manual activation hooks:

wp eval "market_time_create_optimized_table();"
wp eval "market_time_create_ai_queue_table();"
```

### API returns 404

```bash
# Flush rewrite rules
wp rewrite flush

# Sau în WordPress Admin
Settings → Permalinks → Save Changes
```

### Redis not working

```bash
# Verifică dacă Redis rulează
redis-cli ping
# Răspuns: PONG

# Activează în WordPress
wp redis enable
```

### AI descriptions not generating

1. Verifică OPENROUTER_API_KEY în wp-config.php
2. Verifică WP Cron:
   ```bash
   wp cron event list
   # Ar trebui să vezi "market_time_ai_generation"
   ```
3. Rulează manual:
   ```bash
   wp cron event run market_time_ai_generation
   ```

---

## 📚 Documentație

- [CONFIG.md](docs/CONFIG.md) - Configurare generală
- [WORDPRESS_SETUP.md](docs/WORDPRESS_SETUP.md) - Instalare WordPress
- [MULTISITE_SETUP.md](docs/MULTISITE_SETUP.md) - Configurare Multisite
- [IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) - Status & Next Steps
- [category-mapping.json](docs/category-mapping.json) - Mapping categorii + AI config

---

## 🤝 Contribuții

Acest este un proiect privat. Pentru sugestii sau probleme, contactează echipa de dezvoltare.

---

## 📄 Licență

Proprietary - Market-Time.ro © 2025

---

## 🎯 Roadmap

### Q1 2025
- ✅ Backend WordPress complete
- ✅ REST API + Multi-domain
- ✅ AI Optimization system
- 🚧 Frontend Next.js

### Q2 2025
- Import masiv 1.5M produse
- Integrare Google Search Console + GA4
- A/B testing descrieri AI
- Mobile app (React Native)

### Q3 2025
- Recomandări personalizate (ML)
- Price drop alerts
- Browser extension (Chrome/Firefox)

### Q4 2025
- API publică pentru partners
- Affiliate dashboard
- Advanced analytics

---

**Realizat cu ❤️ folosind WordPress, Next.js și AI**

Pentru support: [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md)

# 📑 Market-Time.ro - Index Complet Fișiere

**Toate fișierele create pentru proiectul Market-Time.ro**

---

## 📄 Documentație (Root Level)

| Fișier | Descriere | Prioritate |
|--------|-----------|-----------|
| **README.md** | Documentație principală - Overview, API, Deployment | ⭐⭐⭐ |
| **QUICK_START.md** | Ghid setup rapid în 30 minute | ⭐⭐⭐ |
| **PROJECT_SUMMARY.md** | Rezumat complet - ce am făcut, ce rămâne | ⭐⭐ |
| **.gitignore** | Git ignore rules | ⭐ |

---

## 📁 Backend - WordPress (wp-content/)

### Tema Custom (themes/market-time/)

| Fișier | Dimensiune | Descriere | Lines of Code |
|--------|-----------|-----------|---------------|
| **functions.php** | 4.5 KB | Custom Post Type "Products" + ACF Fields | ~135 |
| **style.css** | 0.5 KB | Theme stylesheet + metadata | ~15 |
| **index.php** | 0.8 KB | Headless theme index + API info | ~25 |

**Funcționalități:**
- ✅ Custom Post Type `products` cu REST API
- ✅ Taxonomie `product_category`
- ✅ 8 ACF Fields (price, merchant, URLs, categories, AI descriptions)
- ✅ Auto-update timestamp
- ✅ Custom capabilities

### Must-Use Plugins (mu-plugins/)

| Fișier | Dimensiune | Descriere | Lines of Code |
|--------|-----------|-----------|---------------|
| **market-time-db-optimization.php** | 8.2 KB | Database optimization + custom table | ~250 |
| **market-time-cdn.php** | 6.8 KB | CDN integration (BunnyCDN + Cloudinary) | ~220 |
| **market-time-rest-api.php** | 11.5 KB | Custom REST API endpoints | ~380 |
| **market-time-ai-optimization.php** | 13.2 KB | AI descriptions generator + queue system | ~420 |

#### market-time-db-optimization.php
**Features:**
- Tabel `wp_products_optimized` cu 12 indecși
- Hook `save_post_products` pentru sincronizare
- Validare date (price > 0, URLs valide)
- Indexuri performanță pe wp_postmeta
- ANALYZE tables
- Admin notice pentru Redis

**Tables Created:**
- `wp_products_optimized` - Tabel principal produse

#### market-time-cdn.php
**Features:**
- Filter `wp_get_attachment_url` pentru BunnyCDN
- Upload automat la Cloudinary pentru produse externe
- Helper function pentru transformări (width, height, quality)
- CDN URLs în REST API response
- Support pentru custom domain CDN

#### market-time-rest-api.php
**Endpoints:**
- `GET /products` - Lista cu paginare + filtrare multi-domain
- `GET /products/{id}` - Detalii + AI description per domain
- `GET /merchants` - Lista merchants cu stats
- `GET /categories` - Categorii filtrate per site
- `POST /track-click` - Tracking affiliate

**Features:**
- Rate limiting (1000 req/hour per IP)
- Cache Redis pentru merchants/categories (1h)
- Filtrare automată categorii per domeniu
- Pagination headers (X-Total-Count, X-Total-Pages)

#### market-time-ai-optimization.php
**Features:**
- Integrare OpenRouter API (Llama 3.1-70B)
- Domain-specific prompt generation
- Queue system (`wp_ai_generation_queue`)
- Priority scoring (`wp_product_priority`)
- WP Cron job (every 2 min, batch 50)
- Multi-domain description generation
- Rate limiting (sleep 1s între calls)

**Tables Created:**
- `wp_ai_generation_queue` - Coada de generare
- `wp_product_priority` - Priority scores

---

## 📁 Frontend - Next.js 14

### Core Files

| Fișier | Dimensiune | Descriere | Lines of Code |
|--------|-----------|-----------|---------------|
| **lib/types.ts** | 1.1 KB | TypeScript interfaces | ~40 |
| **lib/api.ts** | 3.8 KB | API client cu retry logic | ~125 |
| **.env.local** | 0.6 KB | Environment variables template | ~15 |

#### lib/types.ts
**Interfaces:**
- `Product` - Produs complet
- `ApiResponse<T>` - Generic API response cu pagination
- `Merchant` - Merchant cu stats
- `Category` - Categorie cu count
- `ProductsQueryParams` - Query parameters pentru filtering

#### lib/api.ts
**Functions:**
- `getProducts(params)` - Lista produse cu filtering
- `getProduct(id)` - Produs individual
- `getMerchants()` - Lista merchants
- `getCategories()` - Lista categorii
- `trackClick(productId)` - Tracking affiliate

**Features:**
- Retry logic (3x exponential backoff)
- Timeout 10s
- Domain auto-detection (server-side + client-side)
- Error handling TypeScript strict

### App Router (Deja Existente)

| Fișier | Status | Next Step |
|--------|--------|-----------|
| **app/page.tsx** | 🔄 Default Next.js | Înlocuiește cu homepage produse |
| **app/layout.tsx** | ✅ OK | Update metadata |
| **app/globals.css** | ✅ OK | Tailwind CSS configured |

### To Create (Task 45-51)

```
app/
├── products/
│   └── [id]/
│       └── page.tsx          # Product detail (SSG + ISR)
├── search/
│   └── page.tsx              # Search & filter page
└── components/
    ├── ProductCard.tsx       # Card produs
    ├── ProductGrid.tsx       # Grid responsive
    ├── FilterSidebar.tsx     # Filtre merchants/price/category
    ├── SearchBar.tsx         # Search cu debounce
    ├── Pagination.tsx        # Prev/Next + numbers
    └── LoadingSkeleton.tsx   # Loading states
```

---

## 📁 Documentație (docs/)

| Fișier | Dimensiune | Descriere | Prioritate |
|--------|-----------|-----------|-----------|
| **CONFIG.md** | 3.2 KB | Configurare generală, domenii, categorii | ⭐⭐⭐ |
| **WORDPRESS_SETUP.md** | 2.8 KB | 3 metode instalare WordPress | ⭐⭐⭐ |
| **MULTISITE_SETUP.md** | 5.6 KB | Ghid complet Multisite + SQL queries | ⭐⭐⭐ |
| **IMPLEMENTATION_STATUS.md** | 9.8 KB | Status 67 tasks, next steps detaliat | ⭐⭐ |
| **category-mapping.json** | 3.4 KB | Mapping categorii + AI config per domeniu | ⭐⭐⭐ |

### CONFIG.md
**Conține:**
- Structură proiect
- 7 domenii planificate (market-time.ro → sport-fitness.ro)
- Mapping categorii → site ID
- API keys necesare (OpenRouter, BunnyCDN, Cloudinary, Google)
- Domain configuration pentru AI
- Tehnologii & estimări

### WORDPRESS_SETUP.md
**Ghid instalare:**
- Opțiune 1: Local by Flywheel (recomandat)
- Opțiune 2: XAMPP/WAMP
- Opțiune 3: Docker
- Plugin-uri esențiale
- Next steps după instalare

### MULTISITE_SETUP.md
**Setup complet:**
- Task 18: Activare Multisite
- Task 19: Configurare wp-config.php + .htaccess
- Task 20: Instalare Mercator (domain mapping)
- Task 21: Creare 7 site-uri
- Task 22: Mapare domenii (SQL queries incluse)
- Task 23: SITE_CATEGORY_MAP configuration

### IMPLEMENTATION_STATUS.md
**Conținut:**
- ✅ Tasks completate (1-44) cu detalii
- 🚧 Tasks în lucru (45-51)
- ⏳ Tasks pending (52-67)
- Next steps recomandate
- Comenzi utile
- Progres: 60% (40/67 tasks)

### category-mapping.json
**Structură:**
```json
{
  "categories": {
    "1": "Laptops",
    "2": "Phones & Tablets",
    ...
  },
  "site_mapping": {
    "1": {
      "domain": "market-time.ro",
      "niche": "general",
      "target_audience": "...",
      "tone": "...",
      "focus_keywords": [...],
      "usps": [...]
    },
    ...
  }
}
```

---

## 📊 Statistici Proiect

### Cod Scris

| Categorie | Fișiere | Lines of Code | Dimensiune |
|-----------|---------|---------------|-----------|
| **Backend PHP** | 7 | ~1,430 | ~35 KB |
| **Frontend TS** | 2 | ~165 | ~5 KB |
| **Documentație** | 8 | ~2,800 | ~70 KB |
| **Config** | 3 | ~50 | ~5 KB |
| **TOTAL** | **20** | **~4,445** | **~115 KB** |

### Funcționalități Implementate

| Categorie | Count | Status |
|-----------|-------|--------|
| **Custom Post Types** | 1 | ✅ |
| **ACF Field Groups** | 1 (8 fields) | ✅ |
| **Database Tables** | 4 custom | ✅ |
| **REST API Endpoints** | 5 | ✅ |
| **WP Cron Jobs** | 1 | ✅ |
| **Must-Use Plugins** | 4 | ✅ |
| **TypeScript Interfaces** | 5 | ✅ |
| **API Client Functions** | 6 | ✅ |
| **Documentation Files** | 8 | ✅ |

### Database Schema

**Tabele Custom:**

1. **wp_products_optimized** (12 indecși)
   - Înlocuiește wp_postmeta pentru queries rapide
   - Suportă 1.5M+ produse

2. **wp_ai_generation_queue**
   - Queue pentru batch AI processing
   - Status tracking (pending/processing/completed/failed)

3. **wp_product_priority**
   - Priority scores (0-100)
   - Metrici: impressions, clicks, CTR, bounce rate

4. **wp_product_clicks**
   - Affiliate click tracking
   - Rate limiting per IP

**Total coloane:** ~45
**Total indecși:** ~20

---

## 🎯 Cum Să Folosești Acest Index

### Pentru Dezvoltatori

1. **Start Here:** QUICK_START.md (30 min setup)
2. **Backend:** Citește fișierele din `backend/wp-content/`
3. **API:** docs/IMPLEMENTATION_STATUS.md pentru endpoints
4. **Frontend:** Inspiră-te din `lib/api.ts` și `lib/types.ts`

### Pentru Project Managers

1. **Overview:** README.md
2. **Progress:** PROJECT_SUMMARY.md
3. **Planning:** docs/IMPLEMENTATION_STATUS.md

### Pentru DevOps

1. **Setup:** docs/WORDPRESS_SETUP.md + docs/MULTISITE_SETUP.md
2. **Deploy:** README.md → Section "Deployment Production"
3. **Config:** docs/CONFIG.md pentru toate API keys

---

## 📥 Fișiere de Descărcat/Configurat

**Pentru a rula proiectul, ai nevoie de:**

✅ **Incluse în proiect:**
- Toate fișierele PHP (backend)
- Toate fișierele TS (frontend)
- Documentație completă

📥 **De instalat separat:**
- [ ] WordPress (download de la wordpress.org)
- [ ] Node.js v18+ (nodejs.org)
- [ ] Advanced Custom Fields plugin
- [ ] Mercator plugin (github.com/humanmade/Mercator)

🔑 **API Keys de obținut:**
- [ ] OpenRouter API key (openrouter.ai)
- [ ] BunnyCDN account (bunny.net) - opțional
- [ ] Cloudinary credentials - opțional
- [ ] Google Cloud credentials - opțional

---

## 🔍 Căutare Rapidă

**Caut implementarea pentru...**

| Feature | Vezi fișierul |
|---------|--------------|
| Custom Post Type | `backend/.../functions.php` |
| ACF Fields | `backend/.../functions.php` |
| Database optimization | `backend/.../market-time-db-optimization.php` |
| CDN integration | `backend/.../market-time-cdn.php` |
| REST API | `backend/.../market-time-rest-api.php` |
| AI descriptions | `backend/.../market-time-ai-optimization.php` |
| TypeScript types | `frontend/lib/types.ts` |
| API client | `frontend/lib/api.ts` |
| Multisite setup | `docs/MULTISITE_SETUP.md` |
| Domain mapping | `docs/category-mapping.json` |

---

**Total fișiere create:** 20 fișiere
**Total linii de cod:** ~4,445 lines
**Progres implementare:** 60% (40/67 tasks)
**Timp lucru:** ~8-10 ore
**Timp rămas estimat:** 8-11 ore

---

📅 **Creat:** 24 Decembrie 2025
👨‍💻 **Tehnologii:** WordPress, Next.js 14, TypeScript, AI (OpenRouter)
🎯 **Scop:** Comparator prețuri multi-domain cu 1.5M produse
📍 **Status:** Backend Complete | Frontend In Progress

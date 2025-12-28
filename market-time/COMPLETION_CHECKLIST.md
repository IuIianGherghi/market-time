# ✅ Checklist Completare Market-Time.ro

**Proiect:** Market-Time.ro - Headless CMS Multi-Domain
**Status actual:** 60% completat (40/67 tasks)
**Rămas:** 27 tasks (~8-11 ore)

---

## 📋 Ce Am Făcut (40 Tasks Completate)

### ✅ Backend WordPress (100% Complete)

- [x] Custom Post Type "Products" cu REST API
- [x] ACF Fields (8 câmpuri: price, merchant, URLs, etc.)
- [x] Tabel optimizat `wp_products_optimized` (12 indecși)
- [x] Hook sincronizare ACF → tabel custom
- [x] BunnyCDN integration cu filter toate imaginile
- [x] Cloudinary upload automat pentru produse externe
- [x] REST API 5 endpoints (/products, /products/{id}, /merchants, /categories, /track-click)
- [x] AI Optimization cu OpenRouter (Llama 3.1-70B)
- [x] Queue system pentru batch AI processing
- [x] Priority scoring pentru produse
- [x] WP Cron job (every 2 min, 50 produse/batch)
- [x] Rate limiting (API + AI)
- [x] Cache Redis pentru merchants/categories

### ✅ Frontend Next.js (70% Complete)

- [x] Next.js 14 instalat cu App Router
- [x] TypeScript interfaces (Product, ApiResponse, Merchant, Category)
- [x] API client cu retry logic + timeout
- [x] Domain auto-detection
- [x] Environment variables template
- [x] Dependencies instalate (axios, react-query, sharp)

### ✅ Documentație (100% Complete)

- [x] README.md (12.9 KB - documentație completă)
- [x] QUICK_START.md (8.2 KB - setup 30 min)
- [x] PROJECT_SUMMARY.md (11.8 KB - rezumat complet)
- [x] INDEX.md (9.2 KB - index toate fișierele)
- [x] docs/CONFIG.md (3.2 KB)
- [x] docs/WORDPRESS_SETUP.md (2.8 KB)
- [x] docs/MULTISITE_SETUP.md (5.6 KB)
- [x] docs/IMPLEMENTATION_STATUS.md (9.8 KB)
- [x] docs/category-mapping.json (3.4 KB)
- [x] .gitignore

---

## 🚧 Ce Trebuie Făcut (27 Tasks)

### Task 45-51: Frontend Pages & Components (2-3 ore)

#### Pagini de Creat

**1. Homepage cu Lista Produse** (`app/page.tsx`)

```typescript
// app/page.tsx
import { getProducts } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';

export const revalidate = 1800; // ISR: 30 min

export default async function HomePage() {
  const response = await getProducts({ page: 1, per_page: 50 });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        Cele Mai Bune Oferte
      </h1>
      <ProductGrid products={response.data} />
      {/* Pagination aici */}
    </div>
  );
}
```

**2. Product Detail Page** (`app/products/[id]/page.tsx`)

```typescript
// app/products/[id]/page.tsx
import { getProduct, getProducts } from '@/lib/api';
import { notFound } from 'next/navigation';

export const revalidate = 21600; // ISR: 6h

export async function generateStaticParams() {
  // Generate static pages for top 1000 products
  const response = await getProducts({ per_page: 100 });
  return response.data.slice(0, 1000).map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(parseInt(params.id));

  return {
    title: `${product.title} - ${product.price} RON`,
    description: product.seo?.description || product.title,
    openGraph: {
      title: product.title,
      images: [product.image_url],
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(parseInt(params.id));

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.image_url} alt={product.title} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="text-2xl font-bold text-blue-600 my-4">
            {product.price} RON
          </div>
          <div className="mb-4">
            <span className="text-gray-600">de la</span> {product.merchant.name}
          </div>
          <a
            href={product.product_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick(product.id)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Vezi Oferta
          </a>
          <div className="mt-8 prose">
            {product.description_full}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**3. Search & Filter Page** (`app/search/page.tsx`)

```typescript
// app/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProducts } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import FilterSidebar from '@/components/FilterSidebar';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('q') || '';
  const merchant_id = searchParams.get('merchant') || '';
  const min_price = searchParams.get('min_price') || '';
  const max_price = searchParams.get('max_price') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await getProducts({
        merchant_id: merchant_id ? parseInt(merchant_id) : undefined,
        min_price: min_price ? parseFloat(min_price) : undefined,
        max_price: max_price ? parseFloat(max_price) : undefined,
      });
      setProducts(response.data);
      setLoading(false);
    };

    fetchProducts();
  }, [query, merchant_id, min_price, max_price]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <FilterSidebar />
        </aside>
        <main className="md:col-span-3">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <ProductGrid products={products} />
          )}
        </main>
      </div>
    </div>
  );
}
```

#### Componente de Creat

**1. ProductCard.tsx**

```typescript
// components/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <Link href={`/products/${product.id}`}>
        <Image
          src={product.image_url}
          alt={product.title}
          width={300}
          height={300}
          className="w-full h-48 object-cover rounded"
        />
        <h3 className="font-semibold mt-2 line-clamp-2">
          {product.title}
        </h3>
        <div className="text-xl font-bold text-blue-600 mt-2">
          {product.price} RON
        </div>
        <div className="text-sm text-gray-600">
          {product.merchant.name}
        </div>
      </Link>
    </div>
  );
}
```

**2. ProductGrid.tsx**
**3. FilterSidebar.tsx**
**4. SearchBar.tsx**
**5. Pagination.tsx**
**6. LoadingSkeleton.tsx**

#### Configurare next.config.js

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.market-time.ro',
      },
      {
        protocol: 'https',
        hostname: '*.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1200, 1920],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

#### Middleware pentru Domain Detection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // Detectează domeniul și setează în header
  const domain = hostname.includes('electronica') ? 'electronica' :
                 hostname.includes('fashion') ? 'fashion' :
                 hostname.includes('incaltaminte') ? 'incaltaminte' :
                 hostname.includes('casa-living') ? 'casa-living' :
                 hostname.includes('cadouri') ? 'cadouri' :
                 hostname.includes('sport-fitness') ? 'sport-fitness' :
                 'market-time';

  const url = request.nextUrl.clone();
  url.searchParams.set('domain', domain);

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: '/:path*',
};
```

---

### Task 52-55: Performance Optimization (1-2 ore)

- [ ] **Image optimization** în next.config.js (AVIF, WebP, device sizes)
- [ ] **ISR revalidation** granular:
  - Homepage: 1800s (30 min)
  - Product pages: 21600s (6h)
  - Search: 0s (on-demand)
  - Category: 3600s (1h)
- [ ] **Error boundaries:**
  - `app/error.tsx` - Error boundary cu retry button
  - `app/loading.tsx` - Loading skeleton
  - `app/not-found.tsx` - Custom 404
  - `app/global-error.tsx` - Fatal errors
- [ ] **Lighthouse audit:**
  - Performance: 90+
  - SEO: 100
  - Best Practices: 95+
  - Accessibility: 90+

---

### Task 56-61: Import & Automation (2-3 ore)

**1. WP-CLI Import Command**

```php
// wp-content/mu-plugins/market-time-importer.php

class Market_Time_Import_Command {
    public function import($args, $assoc_args) {
        $file = $args[0];
        $dry_run = isset($assoc_args['dry-run']);
        $batch_size = isset($assoc_args['batch-size'])
            ? intval($assoc_args['batch-size'])
            : 1000;

        // Parse CSV/JSON
        $products = $this->parse_file($file);

        // Import în batches
        $this->import_products($products, $batch_size, $dry_run);
    }
}

WP_CLI::add_command('market-time import',
    ['Market_Time_Import_Command', 'import']);
```

**2. Cron Jobs**

```php
// Cron: Update prețuri zilnic (02:00)
add_action('market_time_daily_sync', function() {
    // Foreach merchant API, update prices
});

// Cron: Calculare priority scores (01:00)
add_action('calculate_product_priorities', function() {
    // Call GSC + GA4 APIs, calculate scores
});

// Cron: System health check (hourly)
add_action('check_system_health', function() {
    // Verify Redis, disk space, MySQL, API endpoints
    // Email admin if issues
});
```

**3. Import Sample & Full Catalog**

- [ ] Creează sample-10k.csv cu 10,000 produse
- [ ] Test import: `wp market-time import sample-10k.csv --dry-run`
- [ ] Import real: `wp market-time import sample-10k.csv`
- [ ] Verifică în database
- [ ] Import full 1.5M overnight

---

### Task 62-67: Deployment Production (2-3 ore)

#### WordPress Production

- [ ] Server VPS (4 CPU, 8GB RAM)
- [ ] Deploy WordPress via rsync sau All-in-One WP Migration
- [ ] Database import
- [ ] wp-config.php production credentials
- [ ] Fix permissions: `chown -R www-data:www-data`

#### DNS & SSL

- [ ] DNS A records pentru toate 7 domeniile
- [ ] SSL certificates:
  ```bash
  sudo certbot --apache \
    -d electronica.ro -d www.electronica.ro \
    -d fashion.ro -d www.fashion.ro \
    -d incaltaminte.ro -d www.incaltaminte.ro \
    -d casa-living.ro -d www.casa-living.ro \
    -d cadouri.ro -d www.cadouri.ro \
    -d sport-fitness.ro -d www.sport-fitness.ro
  ```
- [ ] Test fiecare domeniu: `curl -I https://electronica.ro`

#### Next.js Vercel Deployment

```bash
cd frontend
vercel --prod
```

În Vercel Dashboard:
- [ ] Settings → Domains → Add toate cele 7 domenii
- [ ] Environment Variables:
  - `NEXT_PUBLIC_WP_API_URL` per domain
  - `WORDPRESS_API_URL` global
  - `NEXT_PUBLIC_CDN_URL`

#### Monitoring & Backup

- [ ] Google Analytics 4 (separate properties sau single cu dimension)
- [ ] Google Search Console (verify ownership for each domain)
- [ ] UptimeRobot (50 monitors gratuit)
- [ ] UpdraftPlus: daily DB backup, weekly files, retention 30 days

---

## 📊 Estimare Timp Rămas

| Categorie | Tasks | Ore estimate |
|-----------|-------|--------------|
| Frontend Pages | 7 | 2-3 |
| Performance | 4 | 1-2 |
| Import/Automation | 6 | 2-3 |
| Deployment | 10 | 2-3 |
| **TOTAL** | **27** | **7-11 ore** |

---

## 🎯 Plan Săptămânal Recomandat

### Săptămâna 1: Development (Zile 1-5)

**Zi 1 (2-3h):** Frontend Homepage + ProductGrid
**Zi 2 (2-3h):** Product Detail Page + Components
**Zi 3 (2h):** Search Page + FilterSidebar
**Zi 4 (1-2h):** Performance optimization + Error boundaries
**Zi 5 (1h):** Lighthouse audit + fixes

### Săptămâna 2: Content & Setup (Zile 6-10)

**Zi 6 (1h):** WordPress Multisite setup
**Zi 7 (2h):** Domain mapping + SQL
**Zi 8 (2h):** Import 10K sample products
**Zi 9 (3h):** AI generation pentru sample (queue test)
**Zi 10 (1h):** Testing & bug fixes

### Săptămâna 3: Production (Zile 11-15)

**Zi 11-12 (4h):** WordPress production deploy + DNS
**Zi 13 (2h):** Next.js Vercel deploy
**Zi 14 (2h):** SSL + monitoring setup
**Zi 15 (overnight):** Import full 1.5M products

### Săptămâna 4: Launch (Zile 16-20)

**Zi 16-17 (3h):** Google Analytics + Search Console
**Zi 18 (2h):** SEO optimization per domain
**Zi 19 (2h):** Performance monitoring & tweaks
**Zi 20 (2h):** Soft launch + marketing

---

## ✅ Checklist Final Înainte de Launch

### Backend
- [ ] Toate produsele în `wp_products_optimized`
- [ ] AI descriptions generate pentru top products
- [ ] Redis cache funcționează
- [ ] WP Cron jobs active
- [ ] Backup automation configurată

### Frontend
- [ ] Toate paginile funcționează
- [ ] Lighthouse scores ok (Performance 90+, SEO 100)
- [ ] Mobile responsive
- [ ] Error handling implementat
- [ ] Loading states peste tot

### Infrastructure
- [ ] SSL valid pe toate domeniile
- [ ] DNS propagated
- [ ] CDN funcționează (BunnyCDN)
- [ ] Monitoring activ (UptimeRobot)
- [ ] Google Analytics tracking

### Testing
- [ ] Test API endpoints pe toate domeniile
- [ ] Test product pages (min 100 produse)
- [ ] Test search & filters
- [ ] Test affiliate click tracking
- [ ] Test mobile + desktop + tablet

### Documentation
- [ ] README.md actualizat cu production URLs
- [ ] Credentials documentate sigur
- [ ] Runbook pentru troubleshooting
- [ ] Contact info pentru support

---

## 🆘 Ajutor & Resources

- 📖 Vezi documentația: `docs/`
- 🚀 Quick start: `QUICK_START.md`
- 📊 Status: `docs/IMPLEMENTATION_STATUS.md`
- 🔍 Index: `INDEX.md`

**Succes la finalizare! 🎉**

---

**Creat:** 24 Decembrie 2025
**Progres actual:** 60% (40/67 tasks)
**Target:** 100% în 2-4 săptămâni

# Market-Time.ro - Frontend Next.js 14 Implementation Plan

**Started:** 2025-12-28
**Tech Stack:** Next.js 14 App Router + TypeScript + TailwindCSS

---

## 🎯 **Project Goals**

Build a modern, fast, SEO-optimized price comparison frontend that:
- Consumes WordPress headless CMS API
- Supports 1.5M products across 7 specialized domains
- Delivers 100/100 PageSpeed score
- Provides excellent UX with search, filters, sorting

---

## 📋 **Phase 1: Setup & Core Architecture (Day 1)**

### **1.1 Project Initialization**
- [x] Create Next.js 14 project with App Router
- [ ] TypeScript configuration
- [ ] TailwindCSS + Shadcn/UI setup
- [ ] ESLint + Prettier configuration
- [ ] Environment variables (.env.local)

### **1.2 API Integration Layer**
- [ ] API client (fetch/axios wrapper)
- [ ] TypeScript types for API responses
- [ ] API endpoints configuration
- [ ] Error handling utilities
- [ ] Data fetching hooks

### **1.3 Project Structure**
```
market-time-frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── c/
│   │   └── [category]/
│   │       └── page.tsx    # Category listing
│   ├── p/
│   │   └── [category]/
│   │       └── [slug]/
│   │           └── page.tsx # Product detail
│   └── api/                # API routes (if needed)
├── components/
│   ├── ui/                 # Shadcn components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductDetail.tsx
│   │   └── ProductFilters.tsx
│   └── common/
│       ├── Breadcrumbs.tsx
│       ├── Pagination.tsx
│       └── SearchBar.tsx
├── lib/
│   ├── api.ts              # API client
│   ├── utils.ts            # Utilities
│   └── constants.ts        # Constants
├── types/
│   └── product.ts          # TypeScript types
└── public/                 # Static assets
```

---

## 📋 **Phase 2: Core Features (Day 2-3)**

### **2.1 Homepage**
- [ ] Hero section
- [ ] Featured categories
- [ ] Top deals (highest discount)
- [ ] Latest products
- [ ] Search bar

### **2.2 Category Page**
- [ ] Product grid (responsive)
- [ ] Filters sidebar:
  - [ ] Price range
  - [ ] Brands
  - [ ] Merchants
  - [ ] Discount range
  - [ ] On sale toggle
- [ ] Sorting options:
  - [ ] Price (asc/desc)
  - [ ] Discount (highest first)
  - [ ] Newest
  - [ ] Popularity
- [ ] Pagination
- [ ] Product count display
- [ ] Breadcrumbs

### **2.3 Product Detail Page**
- [ ] Product gallery (main image + thumbs)
- [ ] Product info (title, brand, SKU)
- [ ] Price display (current + old + discount)
- [ ] Merchant info
- [ ] "Vezi Oferta" CTA button (affiliate link)
- [ ] Product description
- [ ] Breadcrumbs
- [ ] Related products
- [ ] Schema.org markup (SEO)

---

## 📋 **Phase 3: Advanced Features (Day 4-5)**

### **3.1 Search**
- [ ] Global search bar
- [ ] Search results page
- [ ] Search suggestions (autocomplete)
- [ ] Recent searches

### **3.2 Performance Optimization**
- [ ] Image optimization (next/image)
- [ ] Static generation (SSG) for popular pages
- [ ] Incremental Static Regeneration (ISR)
- [ ] API response caching
- [ ] Code splitting
- [ ] Lazy loading

### **3.3 SEO Optimization**
- [ ] Dynamic meta tags (title, description)
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Canonical URLs
- [ ] Sitemap generation
- [ ] Robots.txt
- [ ] Schema.org Product markup
- [ ] Breadcrumb schema

---

## 📋 **Phase 4: Multi-Domain Setup (Day 6)**

### **4.1 Domain Configuration**
- [ ] Environment-based domain detection
- [ ] Category filtering per domain
- [ ] Domain-specific branding
- [ ] Domain-specific meta tags

### **4.2 Domains Structure**
```
1. electronics-tech.market-time.ro  → Electronics & IT
2. fashion-beauty.market-time.ro    → Fashion & Beauty
3. home-garden.market-time.ro       → Home & Garden
4. health-sports.market-time.ro     → Health & Sports
5. auto-moto.market-time.ro         → Auto & Moto
6. kids-toys.market-time.ro         → Kids & Toys
7. food-drink.market-time.ro        → Food & Drink
```

---

## 📋 **Phase 5: Deployment & Testing (Day 7)**

### **5.1 Deployment**
- [ ] Deploy to Vercel (recommended)
- [ ] Configure environment variables
- [ ] Setup custom domains
- [ ] SSL configuration
- [ ] CDN configuration

### **5.2 Testing**
- [ ] Manual testing all pages
- [ ] Mobile responsiveness
- [ ] Cross-browser testing
- [ ] Performance testing (Lighthouse)
- [ ] SEO audit
- [ ] Accessibility audit

### **5.3 Monitoring**
- [ ] Vercel Analytics
- [ ] Google Analytics 4
- [ ] Google Search Console
- [ ] Error tracking (Sentry)

---

## 🛠️ **Tech Stack Details**

### **Core**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **React 18** - UI library

### **Styling**
- **TailwindCSS** - Utility-first CSS
- **Shadcn/UI** - Pre-built components
- **CSS Modules** - Component-scoped styles (if needed)

### **Data Fetching**
- **Native fetch** with Next.js caching
- **SWR** or **React Query** for client-side (if needed)

### **SEO**
- **next-sitemap** - Sitemap generation
- **next-seo** - Meta tags management

### **Development**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

---

## 🎨 **Design Principles**

### **1. Performance First**
- Target: 90+ Lighthouse score
- Code splitting by route
- Lazy load images
- Minimize JavaScript bundle

### **2. Mobile First**
- Responsive design
- Touch-friendly UI
- Fast mobile loading

### **3. Accessibility**
- WCAG 2.1 AA compliance
- Semantic HTML
- Keyboard navigation
- Screen reader friendly

### **4. SEO Optimized**
- Server-side rendering (SSR)
- Static generation (SSG) where possible
- Proper meta tags
- Structured data

---

## 📊 **Expected Results**

### **Performance Metrics**
- **Lighthouse Performance:** 95+
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Total Bundle Size:** <200KB (initial)

### **SEO Metrics**
- **SEO Score:** 95+
- **Meta tags:** 100% coverage
- **Structured data:** Product, Breadcrumb, Organization
- **Sitemap:** Auto-generated

### **User Experience**
- **Mobile-friendly:** 100%
- **Accessibility:** WCAG AA compliant
- **Cross-browser:** Chrome, Firefox, Safari, Edge

---

## 🚀 **Next Steps**

**Immediate:**
1. Initialize Next.js 14 project
2. Setup TypeScript + TailwindCSS
3. Create API integration layer
4. Build first page (Homepage or Category)

**This Week:**
- Complete core pages (Home, Category, Product)
- Implement search & filters
- Deploy to Vercel staging

**Next Week:**
- Multi-domain setup
- SEO optimization
- Production deployment

---

## 📝 **Notes**

- Backend API is ready: `https://api.market-time.ro/wp-json/market-time/v1/products`
- 100 test products available
- Auto-import running every 6 hours
- SSL certificate valid (Let's Encrypt)

---

**Ready to start building! 🎯**

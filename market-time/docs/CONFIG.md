# MARKET-TIME.RO - Configurare Proiect

## Versiune
v4.0 FINAL - Multi-Domain + AI Optimization

## Structura Proiect
```
market-time/
├── backend/          # WordPress Multisite
├── frontend/         # Next.js 14 aplicații
├── docs/            # Documentație
└── scripts/         # Scripturi automation
```

## Domenii Planificate

### Site Principal
- **market-time.ro** - Site principal aggregator (Site ID: 1)

### Site-uri Nișă (Multisite)
- **electronica.ro** - Electronică & IT (Site ID: 2)
  - Categorii: Laptops, Phones, Tablets, Audio, Gaming

- **fashion.ro** - Modă & Îmbrăcăminte (Site ID: 3)
  - Categorii: Clothing, Accessories, Shoes (overlap cu incaltaminte.ro)

- **incaltaminte.ro** - Încălțăminte (Site ID: 4)
  - Categorii: Shoes (specializat)

- **casa-living.ro** - Casă & Grădină (Site ID: 5)
  - Categorii: Furniture, Decor, Kitchen, Garden

- **cadouri.ro** - Cadouri (Site ID: 6)
  - Categorii: Gifts, Toys, Occasions

- **sport-fitness.ro** - Sport & Fitness (Site ID: 7)
  - Categorii: Sports Equipment, Fitness, Outdoor

## Mapping Categorii -> Site ID

```javascript
SITE_CATEGORY_MAP = {
  1: ['all'],                    // market-time.ro - toate
  2: [1, 2, 3],                 // electronica.ro - tech categories
  3: [8, 9, 10],                // fashion.ro - clothing/accessories/shoes
  4: [8],                       // incaltaminte.ro - doar shoes
  5: [15, 16],                  // casa-living.ro - furniture/decor
  6: [20],                      // cadouri.ro - gifts
  7: [25]                       // sport-fitness.ro - sports
}
```

## API Keys Necesare

### ✅ Disponibile
- **OpenRouter API**: Pentru generare descrieri AI (Llama 3.1-70B)

### ⏳ De Obținut
- **Anthropic API**: Pentru Claude Code (opțional, se folosește deja pentru CLI)
- **BunnyCDN**: Account gratuit trial pentru CDN imagini
- **Google Cloud**: Pentru Search Console + Analytics 4 API (opțional pentru AI optimization)

## Configurare Domain pentru AI Context

Fiecare domeniu are configurări specifice pentru generare conținut AI:

1. **market-time.ro**: General, focus pe preț și comparare
2. **electronica.ro**: Tech specs, performanță, inovație
3. **fashion.ro**: Stil, tendințe, materiale
4. **incaltaminte.ro**: Comfort, durabilitate, design
5. **casa-living.ro**: Amenajare, funcționalitate, estetică
6. **cadouri.ro**: Emoțional, ocazii, unicitate
7. **sport-fitness.ro**: Performanță, rezistență, rezultate

## Tehnologii

### Backend
- WordPress Multisite 6.x
- MySQL 8.0+ cu indexuri optimizate
- Redis Cache (obligatoriu pentru 1.5M produse)
- PHP 8.1+

### Frontend
- Next.js 14 cu App Router
- TypeScript
- Tailwind CSS
- React Query pentru state management

### CDN & Imagini
- BunnyCDN pentru hosting imagini
- Cloudinary ca fallback
- Next.js Image Optimization

### AI & Analytics
- OpenRouter (Llama 3.1-70B) pentru descrieri
- Google Search Console API (priority scores)
- Google Analytics 4 API (conversions tracking)

## Estimări

- **Implementare completă**: 12-18 ore
- **Produse**: 1.5M produse din 50+ merchants
- **Domenii**: 7 domenii (1 principal + 6 nișă)
- **Performance target**:
  - Lighthouse Performance: 90+
  - SEO: 100
  - Response time API: <200ms
  - Page load: <2s

## Status Implementare

- [ ] Pregătire mediu (Task 1-5)
- [ ] Backend WordPress (Task 6-9)
- [ ] Optimizare DB (Task 10-13)
- [ ] CDN Setup (Task 14-17)
- [ ] Multisite + Domains (Task 18-26)
- [ ] REST API (Task 27-31)
- [ ] AI Optimization (Task 32-39)
- [ ] Frontend Next.js (Task 40-55)
- [ ] Import & Automation (Task 56-61)
- [ ] Deployment (Task 62-67)

---
Data start: 24.12.2025

# WP All Import - Ghid Pas cu Pas pentru Primul Import

## ✅ Pregătire (Verifică că ai făcut)

- [x] WP All Import Pro instalat
- [x] ACF Add-On instalat
- [x] Database schema actualizată cu stock columns
- [x] Mu-plugin `market-time-import-helpers.php` deployed pe server
- [x] Backend gata pentru import (19 ACF fields, taxonomies)

---

## 📋 Pasul 1: Accesează WP All Import

1. Intră în WordPress Admin: `https://api.market-time.ro/wp-admin`
2. Mergi la **All Import → New Import**

---

## 📋 Pasul 2: Upload/Specify Feed URL

### Opțiunea A: Feed URL Direct (RECOMANDAT)

1. Selectează **"Download from URL"**
2. Introdu URL-ul feed-ului 2Performant:
   ```
   https://api.2performant.com/feeds/YOUR_AFFILIATE_ID.xml
   ```
   *(Înlocuiește cu URL-ul real din 2Performant dashboard)*

3. Click **"Continue to Step 2"**

### Opțiunea B: Upload Manual

1. Download feed XML manual din 2Performant
2. Selectează **"Upload a file"**
3. Upload fișierul
4. Click **"Continue to Step 2"**

---

## 📋 Pasul 3: Alege Element Type

1. WP All Import va detecta automat structura XML
2. Dacă feed-ul are `<product>` sau `<item>` nodes, selectează:
   ```
   //product
   ```
   sau
   ```
   //item
   ```

3. În preview, vei vedea câmpuri precum:
   - `{name}`
   - `{price}`
   - `{old_price}`
   - `{category}`
   - `{image_url}`
   - etc.

4. Click **"Continue to Step 3"**

---

## 📋 Pasul 4: Configurare Import Settings

### Choose a post type:
- Selectează **"Products"** (custom post type-ul nostru)

### Unique Identifier:
- Selectează câmpul **"product_id"** sau **"sku"** din feed
- Acesta previne duplicate
- Exemplu: `{product_id}` sau `{sku}`

### Import Options:
- **Create new products** - Bifează
- **Update existing products** - Bifează
- **Delete products that are no longer in feed** - **NU bifa** (lăsăm stock management să se ocupe)

Click **"Continue to Step 4"**

---

## 📋 Pasul 5: Mapare Câmpuri (CEL MAI IMPORTANT!)

Aici mapezi câmpurile din feed către ACF fields și taxonomies WordPress.

### A. TITLU PRODUS

**WordPress Field:** Title
```
{name}
```

---

### B. CONTENT (DESCRIERE)

**WordPress Field:** Content
```
{description}
```

Sau dacă vrei să lași gol (AI va genera mai târziu):
```
(leave empty)
```

---

### C. TAXONOMIES (CATEGORII)

Scroll jos până la secțiunea **"Taxonomies, Categories, Tags"**

#### Product Category (Hierarchical)

1. Selectează **"Set with XPath"**
2. În câmpul XPath pune:
   ```php
   [market_time_map_category({category[1]})]
   ```

   **Explicație:** Funcția noastră PHP `market_time_map_category()` va converti automat categoria din feed (ex: "Health & Beauty > Health Care") în categoria WordPress (ex: "health-sports")

#### Product Brand (Non-hierarchical)

1. Selectează **"Set with XPath"**
2. În câmpul XPath pune:
   ```
   {brand}
   ```

   Dacă feed-ul nu are câmp `brand` dar are în `manufacturer`:
   ```
   {manufacturer}
   ```

#### Product Tags (Non-hierarchical)

Lasă gol sau adaugă manual dacă vrei (ex: "oferta", "reducere")

---

### D. ACF CUSTOM FIELDS

Scroll jos până la secțiunea **"Advanced Custom Fields"**

Vei vedea toate cele 19 ACF fields. Iată maparea completă:

#### 1. Product SKU
```
[market_time_sanitize_sku({sku})]
```

#### 2. Product Price (Prețul curent/final)
```
{price}
```

Sau dacă e inversat în feed (pentru 2Performant):
```
{old_price}
```

#### 3. Price Regular (Prețul vechi/inițial)
```
{old_price}
```

Sau dacă e inversat:
```
{price}
```

**IMPORTANT:** Fix-ul automat de price inversion va funcționa în backend, deci nu-ți face griji!

#### 4. Discount Percentage
Lasă gol - **se calculează automat în backend**

#### 5. On Sale
Lasă gol - **se calculează automat în backend**

#### 6. Vendor (Magazin)
```
[market_time_extract_merchant_id({campaign_name})]
```

Sau dacă feed-ul are câmp direct `merchant`:
```
{merchant}
```

#### 7. Product Image (Prima imagine)
```
[market_time_extract_first_image({image_url})]
```

Sau dacă feed-ul are doar o imagine:
```
{image_url}
```

#### 8. Gallery Images (Toate imaginile)
```
[market_time_extract_gallery_images({image_url})]
```

#### 9. Affiliate URL (Link tracking)
```
{product_url}
```

Sau dacă e alt câmp:
```
{tracking_url}
```

#### 10. Affiliate Code (Cod afiliere)
```
[market_time_extract_affiliate_code({product_url})]
```

#### 11. Stock Status
```
in_stock
```
*(hardcoded - toate produsele din feed sunt în stoc)*

#### 12. Stock Quantity
```
1
```
*(hardcoded - external products, nu avem stoc real)*

#### 13. Merchant ID
```
[market_time_extract_merchant_id({campaign_name})]
```

#### 14. Last Updated
Lasă gol - **se completează automat în backend cu timestamp-ul curent**

#### 15. AI Optimization (Has AI Content)
```
0
```
*(hardcoded - inițial fără optimizare AI)*

#### 16. Indexed (Google Search Console)
```
0
```
*(hardcoded - inițial neindexat)*

#### 17. Out of Stock Since
Lasă gol

#### 18. Last Price Update
Lasă gol - **se completează automat în backend**

#### 19. Short Description
Lasă gol sau:
```
{short_description}
```

---

### E. POST STATUS

În secțiunea **"Other Post Options"**

**Post Status:** Publish

**Post Date:** Current date/time

---

## 📋 Pasul 6: Salvare și Test Import

1. Click **"Continue"**
2. Ai opțiunile:
   - **"Save import settings"** - Bifează pentru a rula periodic
   - **"Import only specific records"** - Bifează pentru test

3. Pentru primul test:
   - Bifează **"Import only specific records"**
   - Setează **"Import from record: 1 to 20"** (doar 20 produse pentru test)

4. Click **"Confirm & Run Import"**

---

## 📋 Pasul 7: Monitorizare Import

1. Vei vedea progress bar
2. După finalizare, verifică:
   - **"X products created"**
   - **"X products updated"**
   - **"0 products skipped"** (ideal)

3. Dacă apar erori:
   - Citește error log-ul
   - Verifică mapping-ul câmpurilor
   - Re-run import cu fix-uri

---

## 📋 Pasul 8: Verificare Rezultate

### A. Verifică în WordPress Admin

1. Mergi la **Products → All Products**
2. Deschide un produs
3. Verifică:
   - ✅ Titlu corect
   - ✅ Preț afișat corect (fix inversion funcționează?)
   - ✅ Categorie atribuită
   - ✅ Brand atribuit
   - ✅ Imagine afișată
   - ✅ SKU completat
   - ✅ Affiliate URL funcțional

### B. Verifică în Database

SSH pe server:
```bash
ssh root@185.104.181.59
mysql -u root -p
```

Verifică că produsele sunt sincronizate în `wp_products_optimized`:
```sql
USE market_time_db;

SELECT COUNT(*) FROM wp_products_optimized;

SELECT post_id, title, price, price_regular, discount_percentage, vendor, stock_status
FROM wp_products_optimized
LIMIT 10;
```

Expected: Toate produsele importate trebuie să apară aici cu date corecte.

### C. Verifică API

Testează endpoint-ul API:
```
https://api.market-time.ro/wp-json/market-time/v1/products?per_page=10
```

Expected: JSON cu produse, imagini, prețuri corecte.

---

## 📋 Pasul 9: Schedule Automatic Imports

După ce totul funcționează perfect cu 20 produse:

1. Mergi la **All Import → Manage Imports**
2. Click **"Edit"** pe import-ul tău
3. Setează **"Automatic Scheduling"**:
   - Frequency: **Every 6 hours** (pentru actualizări frecvente)
   - sau **Daily** dacă feed-ul nu se schimbă des

4. Dezactivează **"Import only specific records"** pentru import complet

5. Salvează setările

---

## 🐛 Troubleshooting Comun

### Problema 1: Categorii nu se atribuie

**Cauză:** Funcția PHP nu găsește match pentru keyword-uri

**Fix:**
- Verifică că mu-plugin `market-time-import-helpers.php` e activ
- Adaugă mai multe keywords în `$category_map`
- Verifică log-urile: `tail -f /home/market-time-api/htdocs/api.market-time.ro/wp-content/debug.log`

### Problema 2: Prețuri inversate

**Cauză:** 2Performant are `price` și `old_price` inversate

**Fix:** Fix-ul automat din `market-time-db-optimization.php` rezolvă asta. Verifică log:
```
Market-Time: Fixed inverted prices for product X
```

### Problema 3: Imagini nu apar

**Cauză:** URL-ul nu e valid sau funcția de extractare eșuează

**Fix:**
- Verifică că feed-ul are câmpul `{image_url}`
- Testează URL-ul manual în browser
- Verifică că funcția `market_time_extract_first_image()` returnează URL valid

### Problema 4: Produsele nu apar în API

**Cauză:** Sync hook nu se declanșează sau ACF nu e încărcat

**Fix:**
- Verifică că `market-time-db-optimization.php` e activ
- Verifică log-uri pentru "Market-Time: Synced product X to database"
- Re-save manual un produs pentru a declanșa hook-ul

---

## 📊 Rezultate Așteptate După Import

✅ 20 produse create în WordPress
✅ 20 produse sincronizate în `wp_products_optimized`
✅ Categorii atribuite automat prin keyword matching
✅ Prețuri corecte (inversate dacă necesar)
✅ Imagini externe linkate (nu downloadate)
✅ Affiliate URL-uri funcționale
✅ API returnează produse cu toate câmpurile
✅ 0 erori în log-uri

---

## 🚀 Next Steps După Import Reușit

1. **Extinde mapping-ul categoriilor** dacă unele produse cad în "uncategorized"
2. **Run full import** cu toate produsele (scoate limitarea la 20)
3. **Setup cron job** pentru sync automat la 6 ore
4. **Test AI optimization** pe primele 10 produse indexate
5. **Dezvoltă frontend Next.js** pentru afișare produse

---

## 🆘 Ai nevoie de ajutor?

Verifică log-urile:
```bash
ssh root@185.104.181.59
tail -f /home/market-time-api/htdocs/api.market-time.ro/wp-content/debug.log
```

Verifică erori WP All Import:
- WordPress Admin → All Import → Manage Imports → Settings → View Log

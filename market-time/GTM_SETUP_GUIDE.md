# Google Tag Manager Setup Guide - Market-Time.ro

**GTM Container ID:** GTM-K2MSZJRR

## ✅ Ce am implementat în Next.js:

### 1. **GTM Integration**
- ✅ GTM script instalat în `layout.tsx`
- ✅ DataLayer implementat corect
- ✅ Tracking automat pentru URL parameters (gclid, fbclid, msclkid)

### 2. **Tracking Events disponibile:**

#### **Product View** (`view_item`)
Declanșat automat când utilizatorul vizualizează un produs.

**DataLayer structure:**
```javascript
{
  event: 'view_item',
  ecommerce: {
    items: [{
      item_id: 'SKU123',
      item_name: 'Nume Produs',
      item_brand: 'Brand',
      item_category: 'categorie-slug',
      price: 199.99,
      discount: 20,
      merchant: 'eMag'
    }]
  },
  product_id: 123,
  product_slug: 'produs-slug',
  merchant_id: 456,
  tracking_data: {
    gclid: 'xxx',  // Dacă vine din Google Ads
    fbclid: 'yyy', // Dacă vine din Facebook Ads
    msclkid: 'zzz' // Dacă vine din Microsoft Ads
  }
}
```

#### **Affiliate Click** (`affiliate_click`)
Declanșat când utilizatorul dă click pe "Vezi Preț pe [Merchant]".

**DataLayer structure:**
```javascript
{
  event: 'affiliate_click',
  ecommerce: {
    items: [{
      item_id: 'SKU123',
      item_name: 'Nume Produs',
      item_brand: 'Brand',
      item_category: 'categorie-slug',
      price: 199.99,
      discount: 20,
      merchant: 'eMag'
    }]
  },
  click_url: 'https://emag.ro/produs',
  product_id: 123,
  product_slug: 'produs-slug',
  merchant_id: 456,
  merchant_name: 'eMag',
  tracking_source: 'google', // sau 'facebook', 'microsoft', 'direct'
  tracking_data: {
    gclid: 'xxx',
    fbclid: 'yyy',
    msclkid: 'zzz'
  }
}
```

#### **Tracking Parameters Captured** (`tracking_params_captured`)
Declanșat când se detectează parametri de tracking în URL.

**DataLayer structure:**
```javascript
{
  event: 'tracking_params_captured',
  tracking_data: {
    gclid: 'xxx',
    fbclid: 'yyy',
    msclkid: 'zzz',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'campaign_name'
  }
}
```

---

## 📋 Configurare GTM - Pași:

### **STEP 1: Setup Google Analytics 4**

#### 1.1 Creează GA4 Tag
- Type: **Google Analytics: GA4 Configuration**
- Measurement ID: `G-XXXXXXXXXX` (din GA4 Property)
- Trigger: **All Pages**

#### 1.2 Creează GA4 Product View Event
- Type: **Google Analytics: GA4 Event**
- Configuration Tag: (selectează GA4 tag-ul creat mai sus)
- Event Name: `view_item`
- Event Parameters:
  ```
  items: {{DLV - ecommerce.items}}
  ```
- Trigger: **Custom Event** = `view_item`

#### 1.3 Creează GA4 Affiliate Click Event
- Type: **Google Analytics: GA4 Event**
- Configuration Tag: (selectează GA4 tag-ul creat mai sus)
- Event Name: `affiliate_click`
- Event Parameters:
  ```
  items: {{DLV - ecommerce.items}}
  merchant_name: {{DLV - merchant_name}}
  tracking_source: {{DLV - tracking_source}}
  ```
- Trigger: **Custom Event** = `affiliate_click`

---

### **STEP 2: Setup Variables (Data Layer Variables)**

Creează următoarele **Data Layer Variables**:

1. **DLV - ecommerce.items**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `ecommerce.items`

2. **DLV - merchant_name**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `merchant_name`

3. **DLV - tracking_source**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `tracking_source`

4. **DLV - tracking_data**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `tracking_data`

5. **DLV - product_slug**
   - Variable Type: Data Layer Variable
   - Data Layer Variable Name: `product_slug`

---

### **STEP 3: Setup Triggers**

Creează următoarele **Custom Event Triggers**:

1. **Trigger: Product View**
   - Trigger Type: Custom Event
   - Event name: `view_item`

2. **Trigger: Affiliate Click**
   - Trigger Type: Custom Event
   - Event name: `affiliate_click`

3. **Trigger: Tracking Params Captured**
   - Trigger Type: Custom Event
   - Event name: `tracking_params_captured`

---

### **STEP 4: Conversion Tracking (Opțional - când ai acces la date conversii)**

#### 4.1 Google Ads Conversion Tag
- Type: **Google Ads Conversion Tracking**
- Conversion ID: (din Google Ads)
- Conversion Label: (din Google Ads)
- Conversion Value: `{{DLV - ecommerce.items.0.price}}`
- Transaction ID: `{{DLV - product_slug}}`
- Trigger: **Custom Event** = `affiliate_click`
- **IMPORTANT:** Adaugă condition: `tracking_source` = `google`

#### 4.2 Facebook Conversions API (opțional)
- Type: **Custom HTML**
- HTML:
  ```html
  <script>
    fbq('track', 'Purchase', {
      value: {{DLV - ecommerce.items.0.price}},
      currency: 'RON',
      content_ids: [{{DLV - ecommerce.items.0.item_id}}],
      content_type: 'product'
    });
  </script>
  ```
- Trigger: **Custom Event** = `affiliate_click`
- **IMPORTANT:** Adaugă condition: `tracking_source` = `facebook`

---

## 🔍 **Testing & Debugging**

### 1. GTM Preview Mode
1. În GTM, click pe **Preview**
2. Introdu URL-ul: `https://market-time.ro`
3. Navighează pe site și verifică evenimente

### 2. Test URLs cu parametri tracking:
```
https://market-time.ro/?gclid=test123
https://market-time.ro/?fbclid=test456
https://market-time.ro/?msclkid=test789
```

### 3. Verifică în Console (DevTools):
```javascript
// Verifică tracking data
dataLayer
```

### 4. Google Analytics Realtime
- Verifică în GA4 → Realtime → Events
- Ar trebui să vezi `view_item` și `affiliate_click`

---

## 🎯 **Advanced: Affiliate Link Enhancement**

**Ce face sistemul:**
1. Capturează automat `gclid`, `fbclid`, `msclkid` din URL
2. Stochează în localStorage (30 zile expiry)
3. Adaugă automat acești parametri la toate linkurile affiliate

**Exemplu:**
```
Original affiliate link:
https://event.2performant.com/events/click?...&redirect_to=https://emag.ro/produs

Enhanced affiliate link (cu gclid din Google Ads):
https://event.2performant.com/events/click?...&redirect_to=https://emag.ro/produs?gclid=xxx
```

**Beneficii:**
- 2Performant primește `gclid`/`fbclid` în stats_tags
- Poți atribui conversiile la sursa corectă
- WordPress plugin-ul tău poate extrage tracking data din conversii

---

## 📊 **Raportare & Attribution**

### GTM Variables disponibile pentru raportare:
- `tracking_source` - google/facebook/microsoft/direct
- `merchant_name` - Numele magazinului
- `product_slug` - Slug-ul produsului
- `tracking_data.gclid` - Google Click ID
- `tracking_data.fbclid` - Facebook Click ID
- `tracking_data.msclkid` - Microsoft Click ID

### Recomandări raportare:
1. **Google Ads:** Folosește `gclid` pentru enhanced conversions
2. **Facebook Ads:** Folosește `fbclid` pentru Conversions API
3. **Microsoft Ads:** Folosește `msclkid` pentru UET tracking

---

## ✅ **Checklist Final**

- [ ] GA4 Configuration Tag creat și activ
- [ ] GA4 Product View Event configurat
- [ ] GA4 Affiliate Click Event configurat
- [ ] Data Layer Variables create
- [ ] Triggers create pentru evenimente
- [ ] GTM Preview Mode testat
- [ ] GA4 Realtime verificat
- [ ] Test cu parametri tracking (gclid, fbclid)
- [ ] Verificat că linkurile affiliate conțin parametri tracking

---

## 🚀 **Next Steps (după configurare GTM):**

1. **Google Search Console**
   - Adaugă proprietatea market-time.ro
   - Submit sitemap.xml
   - Verifică indexare

2. **Google Ads Conversion Tracking**
   - Configurează conversii bazate pe `affiliate_click` event
   - Adaugă enhanced conversions cu `gclid`

3. **Facebook Conversions API**
   - Integrează cu WordPress plugin pentru server-side tracking
   - Sincronizează conversii de la 2Performant/Profitshare

---

**💡 Notă:** Tracking-ul este deja implementat în Next.js. Trebuie doar să configurezi tag-urile în GTM containerul tău (GTM-K2MSZJRR).

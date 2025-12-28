# 🚀 Deployment pe Subdomeniu - Market-Time Backend

## Instalare WordPress pe Subdomeniu (CloudPanel)

---

## Pas 1: Creează Subdomeniul în CloudPanel

### 1.1 Login în CloudPanel

```
URL: https://your-server-ip:8443
User: admin
Password: your-cloudpanel-password
```

### 1.2 Creează Nou Site WordPress

1. Click **Sites** → **Add Site**
2. Completează:
   - **Domain Name**: `api.market-time.ro` (sau alt subdomeniu dorit)
   - **Site Type**: WordPress
   - **PHP Version**: 8.1 sau 8.2
   - **Database Name**: `market_time_api`
   - **Database User**: `market_time_user`
   - **Database Password**: (generează automat sau alege unul puternic)

3. Click **Create**

### 1.3 Notează Detaliile (IMPORTANT!)

CloudPanel va afișa:
```
WordPress URL: https://api.market-time.ro
WordPress Admin: https://api.market-time.ro/wp-admin
Admin User: admin
Admin Password: (generat automat)
Database: market_time_api
DB User: market_time_user
DB Password: (cel generat)
Site Root: /home/cloudpanel/htdocs/api.market-time.ro
```

**Salvează aceste detalii undeva sigur!**

---

## Pas 2: Configurează DNS pentru Subdomeniu

### 2.1 La Registrar-ul Domeniului

Mergi la panoul de control al domeniului tău (ex: GoDaddy, Namecheap, etc.)

**Adaugă DNS Record:**

```
Type: A
Host: api
Value: your-server-ip (ex: 123.45.67.89)
TTL: 3600
```

**SAU dacă folosești CNAME:**

```
Type: CNAME
Host: api
Value: market-time.ro (domeniul principal)
TTL: 3600
```

### 2.2 Verifică DNS Propagation

Așteaptă 5-30 minute, apoi testează:

```bash
# Local - în Command Prompt
nslookup api.market-time.ro
```

Ar trebui să returneze IP-ul serverului tău.

---

## Pas 3: Setup SSL Certificate (HTTPS)

### 3.1 În CloudPanel

1. Click pe site-ul tău: **api.market-time.ro**
2. Tab **SSL/TLS**
3. Click **Actions** → **New Let's Encrypt Certificate**
4. Bifează:
   - [x] Include www subdomain
5. Click **Create and Install**

Certificatul se instalează automat. Site-ul va fi accesibil pe HTTPS.

---

## Pas 4: Deploy Cod de pe GitHub la Server

### 4.1 SSH în Server

```bash
# Windows - în Command Prompt sau PowerShell
ssh root@your-server-ip
# SAU
ssh cloudpanel@your-server-ip
```

Introdu password-ul.

### 4.2 Navigate la WordPress Directory

```bash
# Path-ul afișat în CloudPanel
cd /home/cloudpanel/htdocs/api.market-time.ro
```

### 4.3 Clone Repository GitHub

**Dacă repository-ul e public:**

```bash
# Creează folder temporar
git clone https://github.com/your-username/market-time.git temp-repo
cd temp-repo
```

**Dacă repository-ul e privat:**

```bash
# Va cere GitHub username & password/token
git clone https://github.com/your-username/market-time.git temp-repo
```

### 4.4 Copy Tema la wp-content

```bash
# Din temp-repo folder
cp -r backend/wp-content/themes/market-time ../wp-content/themes/

# Copy must-use plugins
mkdir -p ../wp-content/mu-plugins
cp backend/wp-content/mu-plugins/*.php ../wp-content/mu-plugins/

# Cleanup
cd ..
rm -rf temp-repo
```

### 4.5 Set Permissions

```bash
# Set owner corect (important pentru CloudPanel)
chown -R cloudpanel:cloudpanel wp-content/themes/market-time
chown -R cloudpanel:cloudpanel wp-content/mu-plugins

# Set permissions
chmod -R 755 wp-content/themes/market-time
chmod -R 755 wp-content/mu-plugins
```

---

## Pas 5: Rulează SQL Scripts pentru Database

### 5.1 Upload SQL Scripts

**Metoda 1: Via SCP (din local)**

```bash
# Windows - în folder-ul proiectului
scp scripts/create-tables-v2.sql root@your-server-ip:/tmp/
```

**Metoda 2: Copy manual în SSH**

```bash
# În SSH session
nano /tmp/create-tables-v2.sql
```

Copiază conținutul din `scripts/create-tables-v2.sql` și paste în nano.
Salvează: `Ctrl+O`, Enter, `Ctrl+X`

### 5.2 Import SQL în Database

```bash
# SSH în server
mysql -u market_time_user -p market_time_api < /tmp/create-tables-v2.sql
```

Introdu database password-ul (cel notat la Pas 1.3).

### 5.3 Verifică Tabela Creată

```bash
mysql -u market_time_user -p market_time_api
```

În MySQL console:

```sql
SHOW TABLES;
-- Ar trebui să vezi: wp_products_optimized

DESCRIBE wp_products_optimized;
-- Ar trebui să vezi 19 coloane

EXIT;
```

---

## Pas 6: Configurează WordPress (wp-config.php)

### 6.1 Editează wp-config.php

```bash
# SSH în server
cd /home/cloudpanel/htdocs/api.market-time.ro
nano wp-config.php
```

### 6.2 Adaugă Configurații ÎNAINTE de "/* That's all, stop editing! */"

```php
// OpenRouter API Key (opțional pentru AI descriptions)
define('OPENROUTER_API_KEY', 'sk-or-v1-YOUR-KEY-HERE');
define('OPENROUTER_MODEL', 'meta-llama/llama-3.1-70b-instruct');

// Category Mapping pentru Multi-site (când vei activa)
define('SITE_CATEGORY_MAP', serialize(array(
    1 => array('all'),
    2 => array(1, 2, 3),  // Electronice
    3 => array(8, 9, 10), // Fashion
)));

// Debug (disable în production după testing)
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Memory Limit pentru import masiv
define('WP_MEMORY_LIMIT', '512M');
define('WP_MAX_MEMORY_LIMIT', '1024M');
```

Salvează: `Ctrl+O`, Enter, `Ctrl+X`

---

## Pas 7: Activează Tema și Plugins în WordPress Admin

### 7.1 Login în WordPress Admin

```
URL: https://api.market-time.ro/wp-admin
User: admin
Password: (cel notat la Pas 1.3)
```

### 7.2 Instalează Advanced Custom Fields

1. **Plugins** → **Add New**
2. Search: "Advanced Custom Fields"
3. Install **Advanced Custom Fields** by WP Engine
4. Click **Activate**

### 7.3 Activează Tema Market-Time

1. **Appearance** → **Themes**
2. Find: "Market-Time Headless CMS"
3. Click **Activate**

### 7.4 Salvează Permalinks (IMPORTANT!)

1. **Settings** → **Permalinks**
2. Click **Save Changes** (fără să schimbi nimic)

Acest pas este crucial pentru REST API!

---

## Pas 8: Verifică Instalarea

### 8.1 Check Products Post Type

1. În WordPress Admin, ar trebui să vezi meniul: **Products**
2. Click **Products** → **All Products**
3. Ar trebui să vezi produsul creat anterior (dacă ai făcut backup și import database)

### 8.2 Check ACF Fields

1. **Products** → **Add New**
2. Scroll jos - ar trebui să vezi **Product Details** cu toate cele 13 câmpuri

### 8.3 Check Taxonomies

În sidebar ar trebui să vezi:
- **Product Categories**
- **Product Brands**
- **Product Tags**

### 8.4 Check REST API

Testează în browser sau Postman:

```
https://api.market-time.ro/wp-json/market-time/v1/products
```

**Response așteptat:**

```json
{
  "data": [
    {
      "id": 1,
      "sku": "ABC123",
      "title": "Nume produs",
      "price": 5499.99,
      "price_regular": 6299.00,
      "discount_percentage": 12,
      "on_sale": true,
      "merchant": {
        "id": 1,
        "name": "eMAG"
      },
      "brand": "Samsung",
      "image_url": "https://...",
      "product_url": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_count": 1,
    "total_pages": 1
  }
}
```

---

## Pas 9: Migrează Date din Local la Server (Opțional)

Dacă ai produse create în local și vrei să le aduci pe server:

### 9.1 Export Database din Local

```bash
# Local - în Docker environment
docker-compose exec db mysqldump -u root -prootpassword market_time > local-backup.sql
```

### 9.2 Upload la Server

```bash
# Local
scp local-backup.sql root@your-server-ip:/tmp/
```

### 9.3 Import în Database pe Server

```bash
# SSH în server
mysql -u market_time_user -p market_time_api < /tmp/local-backup.sql
```

**ATENȚIE:** Acest lucru va suprascrie întreaga database! Folosește doar dacă vrei să copiezi totul din local.

---

## Pas 10: Test Live Product

### 10.1 Creează un Produs de Test (dacă nu ai)

WordPress Admin → **Products** → **Add New**

Completează:
- **Title**: Samsung Galaxy S24 Ultra
- **Content**: Descriere lungă...
- **Product Details** (ACF):
  - SKU: `SAMSUNG-S24-ULTRA`
  - Sale Price: `6299.99`
  - Regular Price: `6999.00`
  - Brand: `Samsung`
  - Merchant Name: `eMAG`
  - Merchant ID: `1`
  - Product URL: `https://affiliate-link.com`
  - External Image URL: `https://cdn.example.com/s24.jpg`
  - Short Description: `Flagship cu S Pen integrat`

- **Categories**: Electronice → Telefoane
- **Brands**: Samsung

Click **Publish**

### 10.2 Verifică în API

```
https://api.market-time.ro/wp-json/market-time/v1/products
```

Ar trebui să vezi produsul nou creat!

### 10.3 Verifică în Database

```bash
# SSH
mysql -u market_time_user -p market_time_api

SELECT * FROM wp_products_optimized ORDER BY id DESC LIMIT 1;
```

Toate cele 19 coloane ar trebui populate!

---

## Pas 11: Securizare și Optimizare

### 11.1 Disable XML-RPC (previne atacuri)

Adaugă în wp-config.php:

```php
// Disable XML-RPC
add_filter('xmlrpc_enabled', '__return_false');
```

### 11.2 Limitează Login Attempts

Install plugin: **Limit Login Attempts Reloaded**

### 11.3 Setup Backup Automat

CloudPanel oferă backup automat în **Sites** → **Backups**

---

## 🎯 Checklist Final

- [ ] Subdomeniu creat în CloudPanel: `api.market-time.ro`
- [ ] DNS configurat (A record pentru subdomain)
- [ ] SSL certificate instalat (HTTPS funcționează)
- [ ] Cod copiat de pe GitHub la server
- [ ] SQL scripts rulate (wp_products_optimized exists)
- [ ] wp-config.php configurat cu API keys
- [ ] ACF plugin instalat și activat
- [ ] Tema Market-Time activată
- [ ] Permalinks salvate
- [ ] REST API funcționează: `/wp-json/market-time/v1/products`
- [ ] Produs test creat și vizibil în API
- [ ] Database sync funcționează (produs apare în wp_products_optimized)

---

## 🔗 URLs Importante

După deployment, vei avea:

```
WordPress Admin:
https://api.market-time.ro/wp-admin

REST API Base:
https://api.market-time.ro/wp-json/market-time/v1

API Endpoints:
https://api.market-time.ro/wp-json/market-time/v1/products
https://api.market-time.ro/wp-json/market-time/v1/products/{id}
https://api.market-time.ro/wp-json/market-time/v1/merchants
https://api.market-time.ro/wp-json/market-time/v1/categories

API cu Filtre:
https://api.market-time.ro/wp-json/market-time/v1/products?brand=Samsung
https://api.market-time.ro/wp-json/market-time/v1/products?min_discount=20
https://api.market-time.ro/wp-json/market-time/v1/products?on_sale=true
https://api.market-time.ro/wp-json/market-time/v1/products?orderby=discount&order=DESC
```

---

## 🐛 Troubleshooting

### API returnează 404

**Soluție:**
```
WordPress Admin → Settings → Permalinks → Save Changes
```

### "Permission denied" când copiezi fișiere

**Soluție:**
```bash
sudo chown -R cloudpanel:cloudpanel /path/to/folder
```

### Database connection error

**Soluție:**
Verifică credentials în wp-config.php:
- DB_NAME
- DB_USER
- DB_PASSWORD
- DB_HOST (ar trebui `localhost`)

### Produsele nu apar în API dar sunt în WordPress

**Soluție:**
```bash
# Verifică dacă tabelul există
mysql -u user -p database_name
SHOW TABLES;

# Re-save un produs manual în WordPress Admin
# Verifică wp-content/mu-plugins/*.php sunt copiate corect
```

---

## 📞 Next Steps După Deployment

1. **Test API complet:**
   - Toate endpoint-urile
   - Toate filtrele
   - Pagination

2. **Install WP All Import Pro:**
   - Pentru import masiv produse
   - Vezi [WP_ALL_IMPORT_GUIDE.md](WP_ALL_IMPORT_GUIDE.md)

3. **Setup Frontend Next.js:**
   - Point NEXT_PUBLIC_WP_API_URL la `https://api.market-time.ro`

4. **Monitor Performance:**
   - Check server resources
   - Optimize dacă e necesar

---

**Backend Live pe Subdomeniu! 🚀**

Acum ai acces live la API și poți continua cu development frontend sau import masiv de produse.

# WordPress Multisite + Domain Mapping Setup

## TASK 18-23: Configurare Multi-Domain

### Task 18: Activare WordPress Multisite

1. **Editează wp-config.php** (ÎNAINTE de linia `/* That's all, stop editing! Happy publishing. */`):

```php
/* Multisite Configuration */
define('WP_ALLOW_MULTISITE', true);
```

2. **Accesează WordPress Admin**
   - Mergi la Tools → Network Setup
   - Alege: **Sub-directories** (nu subdomains)
   - Site Title: `Market-Time Network`
   - Admin Email: `admin@market-time.ro`
   - Click **Install**

### Task 19: Completează Configurare Multisite

După instalare, WordPress va afișa cod pentru wp-config.php și .htaccess.

**Adaugă în wp-config.php** (după `WP_ALLOW_MULTISITE`):

```php
define('MULTISITE', true);
define('SUBDOMAIN_INSTALL', false);
define('DOMAIN_CURRENT_SITE', 'market-time.local'); // sau market-time.ro în production
define('PATH_CURRENT_SITE', '/');
define('SITE_ID_CURRENT_SITE', 1);
define('BLOG_ID_CURRENT_SITE', 1);
```

**Modifică .htaccess** (înlocuiește conținutul existent):

```apache
# BEGIN WordPress Multisite
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]

# add a trailing slash to /wp-admin
RewriteRule ^([_0-9a-zA-Z-]+/)?wp-admin$ $1wp-admin/ [R=301,L]

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^([_0-9a-zA-Z-]+/)?(wp-(content|admin|includes).*) $2 [L]
RewriteRule ^([_0-9a-zA-Z-]+/)?(.*\.php)$ $2 [L]
RewriteRule . index.php [L]
# END WordPress Multisite
```

3. **Reloginează în WordPress Admin** (vei fi delogat automat)

### Task 20: Instalare Mercator (Domain Mapping)

**Opțiunea 1: Manual via Git**

```bash
cd wp-content/mu-plugins
git clone https://github.com/humanmade/Mercator.git mercator
```

**Opțiunea 2: Download ZIP**

1. Download: https://github.com/humanmade/Mercator/archive/refs/heads/master.zip
2. Extract în `wp-content/mu-plugins/mercator/`

**Opțiunea 3: Composer**

```bash
composer require humanmade/mercator
```

**Activare:**
- Mercator se activează automat ca must-use plugin
- Verifică în Network Admin → Plugins → Must-Use că "Mercator" apare

### Task 21: Creare Site-uri pentru fiecare Domeniu

În **Network Admin → Sites → Add New**, creează:

| ID | Site Name | URL (temporar) | Admin Email |
|----|-----------|----------------|-------------|
| 1 | Market-Time Main | market-time.local | admin@market-time.ro |
| 2 | Electronica | market-time.local/electronica | admin@market-time.ro |
| 3 | Fashion | market-time.local/fashion | admin@market-time.ro |
| 4 | Incaltaminte | market-time.local/incaltaminte | admin@market-time.ro |
| 5 | Casa & Living | market-time.local/casa-living | admin@market-time.ro |
| 6 | Cadouri | market-time.local/cadouri | admin@market-time.ro |
| 7 | Sport & Fitness | market-time.local/sport-fitness | admin@market-time.ro |

### Task 22: Mapare Domenii Proprii

**Metoda 1: Via Database (Recomandat)**

Rulează acest SQL în phpMyAdmin sau MySQL:

```sql
-- Creează tabelul pentru Mercator (dacă nu există)
CREATE TABLE IF NOT EXISTS `wp_blogmeta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `blog_id` bigint(20) NOT NULL DEFAULT '0',
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` longtext,
  PRIMARY KEY (`meta_id`),
  KEY `blog_id` (`blog_id`),
  KEY `meta_key` (`meta_key`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Mapare domenii
INSERT INTO wp_blogmeta (blog_id, meta_key, meta_value) VALUES
(2, 'mercator_aliases', 'a:1:{i:0;s:14:"electronica.ro";}'),
(3, 'mercator_aliases', 'a:1:{i:0;s:10:"fashion.ro";}'),
(4, 'mercator_aliases', 'a:1:{i:0;s:16:"incaltaminte.ro";}'),
(5, 'mercator_aliases', 'a:1:{i:0;s:15:"casa-living.ro";}'),
(6, 'mercator_aliases', 'a:1:{i:0;s:10:"cadouri.ro";}'),
(7, 'mercator_aliases', 'a:1:{i:0;s:17:"sport-fitness.ro";}');
```

**Metoda 2: Via WP-CLI**

```bash
wp site meta update 2 mercator_aliases 'a:1:{i:0;s:14:"electronica.ro";}'
wp site meta update 3 mercator_aliases 'a:1:{i:0;s:10:"fashion.ro";}'
wp site meta update 4 mercator_aliases 'a:1:{i:0;s:16:"incaltaminte.ro";}'
wp site meta update 5 mercator_aliases 'a:1:{i:0;s:15:"casa-living.ro";}'
wp site meta update 6 mercator_aliases 'a:1:{i:0;s:10:"cadouri.ro";}'
wp site meta update 7 mercator_aliases 'a:1:{i:0;s:17:"sport-fitness.ro";}'
```

### Task 23: Configurare Categorie → Site Mapping

Adaugă în **wp-config.php**:

```php
/* Category to Site Mapping */
define('SITE_CATEGORY_MAP', serialize(array(
    1 => array('all'),                                    // market-time.ro - toate produsele
    2 => array(1, 2, 3),                                 // electronica.ro - Laptops, Phones, Tablets
    3 => array(8, 9, 10),                                // fashion.ro - Shoes, Clothing, Accessories
    4 => array(8),                                       // incaltaminte.ro - doar Shoes
    5 => array(15, 16),                                  // casa-living.ro - Furniture, Decor
    6 => array(20),                                      // cadouri.ro - Gifts
    7 => array(25),                                      // sport-fitness.ro - Sports Equipment
)));
```

**Documentare mapping complet** (salvează în `/docs/category-mapping.json`):

```json
{
  "categories": {
    "1": "Laptops",
    "2": "Phones & Tablets",
    "3": "Audio & Gaming",
    "8": "Shoes",
    "9": "Clothing",
    "10": "Accessories",
    "15": "Furniture",
    "16": "Home Decor",
    "20": "Gifts & Toys",
    "25": "Sports Equipment"
  },
  "site_mapping": {
    "1": {
      "domain": "market-time.ro",
      "name": "Market-Time Main",
      "categories": ["all"],
      "description": "Toate produsele"
    },
    "2": {
      "domain": "electronica.ro",
      "name": "Electronica & IT",
      "categories": [1, 2, 3],
      "description": "Laptops, Phones, Audio, Gaming"
    },
    "3": {
      "domain": "fashion.ro",
      "name": "Fashion & Style",
      "categories": [8, 9, 10],
      "description": "Shoes, Clothing, Accessories"
    },
    "4": {
      "domain": "incaltaminte.ro",
      "name": "Încălțăminte",
      "categories": [8],
      "description": "Pantofi, Adidași, Sandale"
    },
    "5": {
      "domain": "casa-living.ro",
      "name": "Casă & Grădină",
      "categories": [15, 16],
      "description": "Mobilier, Decor, Amenajări"
    },
    "6": {
      "domain": "cadouri.ro",
      "name": "Cadouri & Surprize",
      "categories": [20],
      "description": "Cadouri pentru orice ocazie"
    },
    "7": {
      "domain": "sport-fitness.ro",
      "name": "Sport & Fitness",
      "categories": [25],
      "description": "Echipamente sportive"
    }
  }
}
```

## Verificare Configurare

După configurare, verifică:

1. **Network Admin → Sites**: Toate cele 7 site-uri apar
2. **Database**: Tabelul `wp_blogmeta` conține mapările
3. **wp-config.php**: Conține toate constantele MULTISITE
4. **.htaccess**: Conține rewrite rules pentru multisite

## Next Steps

După Multisite setup:
- Task 24-26: Configurare DNS și SSL (când ești gata pentru production)
- Task 27-31: Crearea REST API endpoints custom

# Setup Local by Flywheel cu Nginx

## Creare Site - Configurare Optimă

### Pas 1: Create New Site

Click pe **"+"** (Add Local Site)

### Pas 2: Site Name
```
Site name: market-time
Continue →
```

### Pas 3: Environment

**Alege: "Preferred"** (Recommended - folosește Nginx by default)

SAU

**Alege: "Custom"** și configurează:
```
PHP version:   8.1.9 (sau mai nou)
Web server:    nginx    ← IMPORTANT!
Database:      MySQL 8.0.16
```

Click **Continue →**

### Pas 4: WordPress Setup
```
WordPress Username:  admin
WordPress Password:  admin123
WordPress Email:     admin@market-time.local
Advanced options:
  ✓ Make site HTTPS (recommended)
  Multisite: None (for now - vom activa mai târziu)
```

Click **Add Site**

### Pas 5: Wait & Start

- Local va crea site-ul (~2 minute)
- Click **Start site**
- Așteaptă "Running" (verde)

### Pas 6: Verify Nginx

Click pe site-ul tău → **Open site shell**

```bash
# Verifică că rulează Nginx
ps aux | grep nginx

# Ar trebui să vezi:
# nginx: master process
# nginx: worker process
```

### Pas 7: URLs

Site-ul tău va fi disponibil la:
```
🌐 Site:     https://market-time.local
🔧 Admin:    https://market-time.local/wp-admin
📊 Database: Click "Database" în Local app
```

## 🎯 De Ce Nginx Pentru Market-Time?

### 1. Performance pentru API
```
Nginx: ~10,000 requests/sec
Apache: ~5,000 requests/sec

Pentru REST API cu multe request-uri, Nginx e de 2x mai rapid!
```

### 2. Memory Usage
```
Nginx:  50-100 MB RAM
Apache: 100-200 MB RAM

Pentru 1.5M produse în database, fiecare MB contează!
```

### 3. Static Files (CDN)
```
Nginx e excelent pentru:
- Serving product images
- Proxy către BunnyCDN
- Cache static assets
```

### 4. Reverse Proxy pentru Next.js
```
În production, Nginx va face proxy de la:
market-time.ro → WordPress API (backend)
market-time.ro → Next.js (frontend)

Nginx e standard pentru această arhitectură!
```

## 📁 Structură Site după Creare

```
~/Local Sites/market-time/
├── app/
│   └── public/              ← WordPress root
│       ├── wp-content/
│       │   ├── themes/
│       │   │   └── market-time/  ← Copiază tema aici
│       │   └── mu-plugins/       ← Copiază plugins aici
│       └── wp-config.php    ← Editează acest fișier
├── conf/
│   └── nginx/
│       └── site.conf.hbs    ← Nginx config (auto-generat)
└── logs/
    ├── nginx/
    │   ├── access.log
    │   └── error.log
    └── php/
        └── error.log
```

## 🔧 Nginx Config (Informativ - nu trebuie editat)

Local generează automat config optimizat pentru WordPress:

```nginx
# Auto-generated în site.conf.hbs
server {
    listen 80;
    server_name market-time.local;

    root /app/public;
    index index.php;

    # WordPress permalinks
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # PHP processing
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php-fpm.sock;
        include fastcgi_params;
    }

    # REST API optimization
    location ~ ^/wp-json/ {
        try_files $uri $uri/ /index.php?$args;
    }
}
```

## ✅ Verificare După Instalare

### 1. Test Nginx Status
```bash
# În site shell:
curl -I https://market-time.local

# Ar trebui să vezi:
# HTTP/1.1 200 OK
# Server: nginx/1.x.x
```

### 2. Test WordPress
```
Browser: https://market-time.local
→ Ar trebui să vezi pagina WordPress default
```

### 3. Test Admin
```
Browser: https://market-time.local/wp-admin
→ Login cu admin/admin123
```

### 4. Check Logs (Dacă Ceva Nu Merge)
```bash
# În Local app:
# Right-click site → "Open site shell"

# Nginx error log:
tail -f ~/Local\ Sites/market-time/logs/nginx/error.log

# PHP error log:
tail -f ~/Local\ Sites/market-time/logs/php/error.log
```

## 🐛 Troubleshooting Nginx

### Site nu pornește

**Check 1: Port 80/443 ocupat?**
```bash
# Windows PowerShell:
netstat -ano | findstr :80
netstat -ano | findstr :443

# Dacă vezi alt proces, oprește-l sau schimbă port în Local
```

**Check 2: Restart site**
```
Local app → Click pe site → Stop → Start
```

### Eroare 502 Bad Gateway

**Cauză:** PHP-FPM nu rulează

**Soluție:**
```bash
# În site shell:
ps aux | grep php-fpm

# Dacă nu vezi procese, restart site în Local
```

### REST API returnează 404

**Soluție:**
```bash
# WordPress Admin:
Settings → Permalinks → Save Changes

# SAU via WP-CLI în site shell:
wp rewrite flush
```

## 🎯 Next Steps

După ce site-ul e creat cu Nginx:

1. ✅ Copiază fișierele din `backend/wp-content/`
2. ✅ Editează `wp-config.php`
3. ✅ Activează tema în WP Admin
4. ✅ Creează produse test
5. ✅ Test API: https://market-time.local/wp-json/market-time/v1/products

---

**Nginx Setup Complete! 🚀**

Site-ul tău WordPress cu Nginx e gata pentru development!

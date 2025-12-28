# WordPress Setup Guide - MARKET-TIME.RO

## Task 6: Instalare WordPress Local

### Opțiune 1: Local by Flywheel (Recomandat în document)

1. **Download Local**
   - Vizitează: https://localwp.com
   - Download pentru Windows
   - Instalează aplicația

2. **Creare site WordPress**
   - Deschide Local
   - Click "+" (Create a new site)
   - Site name: `market-time`
   - Environment: Custom
     - PHP: 8.1+
     - Web Server: nginx sau Apache
     - Database: MySQL 8.0+
   - WordPress:
     - Username: `admin`
     - Password: (alege o parolă sigură)
     - Email: admin@market-time.ro

3. **Notează credențialele**
   - Site URL: `http://market-time.local`
   - Admin URL: `http://market-time.local/wp-admin`
   - Database: `local`
   - DB User: `root`
   - DB Password: `root`

### Opțiune 2: XAMPP/WAMP (Alternativă)

1. Instalează XAMPP: https://www.apachefriends.org/
2. Download WordPress: https://wordpress.org/latest.zip
3. Extract în `C:/xampp/htdocs/market-time`
4. Creează database `market_time` în phpMyAdmin
5. Rulează instalarea WordPress

### Opțiune 3: Docker (Pentru dezvoltatori avansați)

```bash
cd market-time/backend
docker-compose up -d
```

Vezi `docker-compose.yml` în acest director.

## Task 7: Plugin-uri Esențiale

După instalarea WordPress, instalează:

### Via WordPress Admin (GUI)
1. Plugins → Add New
2. Caută și instalează:
   - **Advanced Custom Fields PRO** (licență necesară sau free version)
   - **Redis Object Cache**
   - **WP-CLI** (opțional)

### Via WP-CLI (dacă ai instalat)
```bash
wp plugin install advanced-custom-fields --activate
wp plugin install redis-cache --activate
```

## Task 8 & 9: Sunt implementate în cod

Toate fișierele necesare pentru:
- Custom Post Type 'Products'
- ACF Field Groups
- Database optimization
- REST API endpoints

Sunt pregătite în directorul `backend/wp-content/`

## Next Steps

După instalarea WordPress:
1. Copiază fișierele din `backend/wp-content/` în instalarea ta WordPress
2. Activează tema și plugin-urile custom
3. Verifică în WP Admin că Custom Post Type "Products" apare
4. Continuă cu Task 10 (Optimizare bază date)

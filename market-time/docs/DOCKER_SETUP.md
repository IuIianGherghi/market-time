# 🐳 Market-Time Docker Setup

## Instalare Automată WordPress Direct din VS Code

Acest ghid descrie cum să instalezi și să rulezi întregul proiect Market-Time folosind Docker, **fără Local by Flywheel sau alte GUI tools**.

---

## 📋 Cerințe

Înainte de a începe, asigură-te că ai instalat:

- ✅ **Docker Desktop** (Windows/Mac) sau **Docker Engine** (Linux)
  - Download: https://www.docker.com/products/docker-desktop
  - Versiune minimă: Docker 20.10+, Docker Compose 2.0+
- ✅ **Make** (opțional, dar recomandat)
  - Windows: Instalează via Chocolatey: `choco install make`
  - Mac: Preinstalat cu Xcode Command Line Tools
  - Linux: `sudo apt-get install make`
- ✅ **Git** (pentru clonare repository)

**Verificare instalare:**
```bash
docker --version
docker-compose --version
make --version  # opțional
```

---

## 🚀 Quick Start - 3 Comenzi

Cea mai rapidă metodă de a porni proiectul:

```bash
# 1. Creează fișierul .env din template
cp .env.example .env

# 2. Editează .env cu API keys (opțional pentru început)
# notepad .env  (Windows)
# nano .env     (Linux/Mac)

# 3. Instalează și pornește totul
make install

# 4. Creează produse demo
make setup
```

**Gata!** 🎉

Accesează:
- **WordPress Admin**: http://localhost:8080/wp-admin
  - User: `admin`
  - Pass: `admin123`
- **API Products**: http://localhost:8080/wp-json/market-time/v1/products
- **phpMyAdmin**: http://localhost:8081

---

## 📦 Ce Include Setup-ul Docker?

Când rulezi `make install`, se creează automat:

### 🐘 MySQL 8.0 Database
- Database: `market_time`
- User: `market_time_user`
- Port: `3306`
- Volumes persistente pentru date

### 🌐 WordPress 6.x cu:
- **Tema Market-Time** pre-activată
- **Advanced Custom Fields** instalat
- **WP-CLI** pentru automation
- **Must-Use Plugins** (4 bucăți):
  - Database Optimization
  - CDN Integration
  - REST API
  - AI Optimization
- Port: `8080`

### 🗄️ phpMyAdmin
- Management interfață pentru MySQL
- Port: `8081`

### ⚙️ WP-CLI Container
- Pentru comenzi WP-CLI și scripturi automation
- Pre-configurat cu acces la WordPress și database

---

## 🛠️ Comenzi Disponibile

### Via Makefile (Recomandat)

```bash
# Setup & Instalare
make install        # Instalare inițială completă
make setup          # Creează 5 produse demo + configurare

# Управління Containere
make start          # Pornește toate containerele
make stop           # Oprește toate containerele
make restart        # Restart containere
make status         # Arată status containere

# Development
make logs           # Afișează logs (toate containerele)
make logs-wp        # Afișează doar logs WordPress
make shell          # Deschide bash în container WordPress
make db-shell       # Deschide MySQL command line

# Testing
make test           # Testează toate API endpoints
make test-db        # Testează conexiune database

# Cleanup
make clean          # Oprește și șterge containere
make clean-all      # ⚠️ Șterge TOT (containere + volumes + images)
```

### Via Docker Compose (Manual)

```bash
# Pornește toate serviciile
docker-compose up -d

# Vezi logs
docker-compose logs -f

# Oprește serviciile
docker-compose stop

# Șterge tot
docker-compose down -v
```

### Via VS Code Tasks

Apasă `Ctrl+Shift+P` → **Tasks: Run Task** → Selectează:

- **Docker: Install Market-Time** - Instalare completă
- **Docker: Start Containers** - Pornește containere
- **Docker: Run WordPress Setup** - Creează produse demo
- **Docker: View Logs** - Vezi logs live
- **Docker: Open WordPress Shell** - Terminal în container
- **Open WordPress Admin** - Deschide browser la wp-admin
- **Open API Products Endpoint** - Deschide browser la API

---

## 📝 Configurare .env

Fișierul `.env` conține toate variabilele de mediu. Template disponibil în `.env.example`.

```bash
# Copiază template-ul
cp .env.example .env

# Editează cu valorile tale
nano .env
```

### Configurații Importante:

```env
# Database
DB_ROOT_PASSWORD=rootpassword
DB_NAME=market_time
DB_USER=market_time_user
DB_PASSWORD=market_time_pass

# WordPress Admin
WP_ADMIN_USER=admin
WP_ADMIN_PASSWORD=admin123
WP_ADMIN_EMAIL=admin@market-time.local

# OpenRouter AI (OBLIGATORIU pentru AI descriptions)
OPENROUTER_API_KEY=sk-or-v1-YOUR-KEY-HERE
OPENROUTER_MODEL=meta-llama/llama-3.1-70b-instruct

# CDN (Opțional)
BUNNYCDN_URL=https://your-cdn.b-cdn.net
CLOUDINARY_CLOUD_NAME=your-cloud
```

**Obține OpenRouter API Key:**
1. Mergi la https://openrouter.ai
2. Sign up (gratuit)
3. Dashboard → Keys → Create New Key
4. Copiază în `.env`

---

## 🔧 Workflow Development

### 1. Pornește Containerele

```bash
make start
# SAU
docker-compose up -d
```

### 2. Modifică Fișiere Theme/Plugins

Fișierele sunt **mounted ca volumes** - modificările sunt **instant vizibile**:

```
backend/wp-content/themes/market-time/     → /var/www/html/wp-content/themes/market-time/
backend/wp-content/mu-plugins/             → /var/www/html/wp-content/mu-plugins/
```

**Nu trebuie să copiezi manual fișiere!** Salvează în VS Code și refresh browser.

### 3. Vezi Logs în Real-Time

```bash
make logs-wp
```

### 4. Rulează Comenzi WP-CLI

```bash
# Intră în container
make shell

# Apoi rulează comenzi WP-CLI
wp plugin list
wp post list --post_type=products
wp cache flush
```

### 5. Verifică Database

```bash
# Opțiunea 1: phpMyAdmin
# Browser: http://localhost:8081

# Opțiunea 2: MySQL CLI
make db-shell

# Apoi:
USE market_time;
SELECT * FROM wp_products_optimized;
```

---

## 🧪 Testare API

### Test Automat

```bash
make test
```

Sau manual:

```bash
# Lista produse
curl http://localhost:8080/wp-json/market-time/v1/products

# Filtrare pe merchant
curl http://localhost:8080/wp-json/market-time/v1/products?merchant_id=1

# Filtrare pe preț
curl "http://localhost:8080/wp-json/market-time/v1/products?min_price=1000&max_price=7000"

# Merchants
curl http://localhost:8080/wp-json/market-time/v1/merchants

# Categories
curl http://localhost:8080/wp-json/market-time/v1/categories
```

---

## 🐛 Troubleshooting

### Port-uri Ocupate

**Eroare:** `Bind for 0.0.0.0:8080 failed: port is already allocated`

**Soluție:** Schimbă porturile în `docker-compose.yml`:

```yaml
wordpress:
  ports:
    - "8090:80"  # Changed from 8080

phpmyadmin:
  ports:
    - "8091:80"  # Changed from 8081
```

### Containere Nu Pornesc

```bash
# Vezi logs pentru detalii
docker-compose logs

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

### WordPress Nu Se Instalează

```bash
# Verifică că MySQL e healthy
docker-compose ps

# Restart WordPress container
docker-compose restart wordpress

# Vezi logs
docker-compose logs -f wordpress
```

### Plugin-urile Nu Apar

```bash
# Verifică că fișierele sunt montate corect
docker-compose exec wordpress ls -la /var/www/html/wp-content/mu-plugins

# Ar trebui să vezi:
# market-time-db-optimization.php
# market-time-cdn.php
# market-time-rest-api.php
# market-time-ai-optimization.php
```

### Reset Complet

```bash
# Șterge tot și restart
make clean-all
make install
make setup
```

---

## 📂 Structură Fișiere Docker

```
market-time/
├── docker-compose.yml                 # Configurare servicii
├── .env                               # Variabile de mediu (nu commit!)
├── .env.example                       # Template .env
├── Makefile                           # Comenzi shortcut
├── docker/
│   ├── wordpress/
│   │   ├── Dockerfile                 # WordPress custom image
│   │   ├── php.ini                    # PHP config
│   │   ├── docker-entrypoint.sh       # Entrypoint script
│   │   └── wp-config-additions.php    # Market-Time config
│   └── scripts/
│       └── setup-wordpress.sh         # Script creare produse demo
├── backend/
│   └── wp-content/                    # Montat în container
│       ├── themes/market-time/
│       └── mu-plugins/
└── .vscode/
    └── tasks.json                     # VS Code tasks
```

---

## 🎯 Next Steps După Instalare

1. ✅ **Verifică că API funcționează:**
   ```bash
   make test
   ```

2. ✅ **Adaugă produse noi:**
   - WordPress Admin → Products → Add New
   - SAU folosește WP-CLI

3. ✅ **Configurează OpenRouter API Key:**
   - Editează `.env`
   - Restart containere: `make restart`

4. ✅ **Dezvoltă Frontend Next.js:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - Next.js va comunica cu API WordPress pe `http://localhost:8080`

5. ✅ **Setup Multisite (când e gata):**
   - Vezi `docs/MULTISITE_SETUP.md`

---

## 🚢 Deployment Production

Când vrei să deploiezi în production:

1. **Nu folosi acest setup Docker direct în production!**
2. Folosește servicii managed:
   - **WordPress:** Cloudways, Kinsta, WP Engine
   - **Database:** AWS RDS, DigitalOcean Managed MySQL
   - **Frontend:** Vercel, Netlify

3. **SAU** setup custom production Docker cu:
   - Nginx reverse proxy
   - SSL certificates (Let's Encrypt)
   - Redis cache
   - Security hardening

---

## 💡 Tips & Tricks

### Backup Database

```bash
# Export
docker-compose exec db mysqldump -u root -prootpassword market_time > backup.sql

# Import
docker-compose exec -T db mysql -u root -prootpassword market_time < backup.sql
```

### Update Theme/Plugins

Fișierele sunt mounted - nu trebuie să faci nimic special!

Doar salvează în VS Code și refresh browser.

### Rulează Scripturi Custom WP-CLI

```bash
# Creează script în docker/scripts/my-script.sh
# Apoi:
docker-compose exec -T wpcli bash /scripts/my-script.sh
```

### Performance Monitoring

```bash
# Resource usage
docker stats

# Container specific
docker stats market-time-wordpress
```

---

## ✅ Checklist Instalare

- [ ] Docker Desktop instalat și pornit
- [ ] Repository clonat local
- [ ] Fișier `.env` creat din `.env.example`
- [ ] Rulat `make install` cu succes
- [ ] Rulat `make setup` pentru produse demo
- [ ] Accesat http://localhost:8080/wp-admin
- [ ] Testat API: http://localhost:8080/wp-json/market-time/v1/products
- [ ] 5 produse demo vizibile în API

---

**🎉 Setup Docker Complet! Acum poți dezvolta fără Local by Flywheel!**

Pentru suport sau întrebări, vezi fișierele din `docs/` sau deschide un issue pe GitHub.

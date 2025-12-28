# 📦 Deployment Simplu - Market-Time

## Procesul: VS Code → GitHub → Server Cloud

---

## Pas 1: Pregătire Locală (VS Code)

### 1.1 Creează repository GitHub

```bash
# În VS Code Terminal
cd "D:\Claude Code Test\market-time"

# Initialize Git (dacă nu e deja)
git init

# Add toate fișierele
git add .
git commit -m "Initial commit"
```

### 1.2 Creează repository pe GitHub

- Mergi la https://github.com
- Click **New repository**
- Nume: `market-time`
- **NU** adăuga README, .gitignore (le ai deja)
- Click **Create repository**

### 1.3 Link local repository cu GitHub

```bash
# Copiază URL-ul de pe GitHub (ex: https://github.com/username/market-time.git)
git remote add origin https://github.com/username/market-time.git
git branch -M main
git push -u origin main
```

✅ **Acum codul tău e pe GitHub!**

---

## Pas 2: Pregătire Server Cloud

### 2.1 Instalare WordPress pe Server

**Dacă folosești CloudPanel:**

1. Login în CloudPanel
2. Creează nou site WordPress
3. Notează:
   - URL site: `https://market-time.ro`
   - Path: (ex: `/home/market-time/htdocs`)
   - Database: nume, user, password
   - SSH user & password

**Dacă instalezi manual:**

1. SSH în server
2. Instalează WordPress normal
3. Notează path-ul: `/var/www/market-time/`

### 2.2 Configurare SSH Key (Opțional - pentru no password)

```bash
# Local - generează key
ssh-keygen -t rsa

# Copy la server
ssh-copy-id user@your-server-ip

# Acum poți face SSH fără password
ssh user@your-server-ip
```

---

## Pas 3: Deploy Cod de pe GitHub la Server

### Metoda 1: Git Clone Direct (Prima dată)

```bash
# SSH în server
ssh user@your-server-ip

# Navigate la WordPress wp-content
cd /path/to/wordpress/wp-content

# Clone repository
git clone https://github.com/username/market-time.git temp
cd temp

# Copy tema
cp -r backend/wp-content/themes/market-time ../themes/

# Copy must-use plugins
mkdir -p ../mu-plugins
cp backend/wp-content/mu-plugins/* ../mu-plugins/

# Cleanup
cd ..
rm -rf temp

# Set permissions
chown -R www-data:www-data themes/market-time
chown -R www-data:www-data mu-plugins
```

### Metoda 2: Git Pull (Pentru Updates Viitoare)

**Setup (prima dată):**

```bash
# SSH în server
ssh user@server

# Navigate la tema
cd /path/to/wp-content/themes/market-time

# Initialize Git
git init
git remote add origin https://github.com/username/market-time.git
git fetch
git checkout main
git pull origin main
```

**Update (când faci modificări):**

```bash
# Local - commit & push
git add .
git commit -m "Update feature X"
git push origin main

# Server - pull changes
ssh user@server
cd /path/to/wp-content/themes/market-time
git pull origin main
```

---

## Pas 4: Configurare WordPress pe Server

### 4.1 Editează wp-config.php

```bash
# SSH în server
ssh user@server
nano /path/to/wordpress/wp-config.php
```

**Adaugă ÎNAINTE de "That's all, stop editing":**

```php
// OpenRouter API Key
define('OPENROUTER_API_KEY', 'sk-or-v1-YOUR-KEY');
define('OPENROUTER_MODEL', 'meta-llama/llama-3.1-70b-instruct');

// Category Mapping
define('SITE_CATEGORY_MAP', serialize(array(
    1 => array('all'),
    2 => array(1, 2, 3),
    3 => array(8, 9, 10),
)));

// Debug (disable în production)
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### 4.2 Activează Tema & Plugins

WordPress Admin:
- Themes → Activate "Market-Time Headless CMS"
- Plugins → Install "Advanced Custom Fields"
- Settings → Permalinks → Save

---

## 🔄 Workflow Zilnic

### Când Lucrezi la Cod

```bash
# 1. Editezi în VS Code (local)
# - Modifici fișiere în backend/wp-content/themes/market-time/
# - Testezi local cu Docker (optional): make start

# 2. Commit changes
git add .
git commit -m "Descriere modificare"
git push origin main

# 3. Deploy pe server
ssh user@server
cd /path/to/wp-content/themes/market-time
git pull origin main

# 4. Verifică
# Browser: https://market-time.ro
```

---

## 📋 TODO pentru Începători

### □ Setup Inițial (Once)

- [ ] 1. Creează repository GitHub
- [ ] 2. Push cod local la GitHub
- [ ] 3. Obține server cloud (cloudify.ro)
- [ ] 4. Instalează WordPress pe server (via CloudPanel)
- [ ] 5. Notează: SSH credentials, WordPress path
- [ ] 6. Setup SSH key (opțional)
- [ ] 7. Clone repository pe server
- [ ] 8. Copy tema & plugins la wp-content
- [ ] 9. Editează wp-config.php cu API keys
- [ ] 10. Activează tema în WordPress Admin

### □ Verificare Setup

- [ ] 11. WordPress Admin funcționează: https://site.ro/wp-admin
- [ ] 12. API returnează date: https://site.ro/wp-json/market-time/v1/products
- [ ] 13. Creează 1 produs test
- [ ] 14. Verifică că apare în API

### □ Workflow Zilnic

- [ ] 15. Editezi cod local în VS Code
- [ ] 16. Git commit & push
- [ ] 17. SSH în server
- [ ] 18. Git pull
- [ ] 19. Testezi modificările pe site live

---

## 🔧 Comenzi Esențiale

### Git Commands

```bash
# Adaugă modificări
git add .

# Commit
git commit -m "Mesajul tau"

# Push la GitHub
git push origin main

# Pull de pe GitHub (pe server)
git pull origin main

# Status (vezi ce ai modificat)
git status
```

### SSH Commands

```bash
# Connect la server
ssh user@server-ip

# Copy fișier local → server
scp local-file.php user@server:/path/to/destination/

# Copy folder local → server
scp -r local-folder/ user@server:/path/to/destination/
```

### Server Commands

```bash
# Navigate
cd /path/to/folder

# List files
ls -la

# Edit file
nano file.php

# Set permissions
chown -R www-data:www-data folder/
chmod -R 755 folder/
```

---

## ⚠️ Important

### NU Urca pe GitHub:
- ❌ `.env` (contine API keys)
- ❌ `wp-config.php` (contine database passwords)
- ❌ Fișiere mari (imagini, uploads)

Acestea sunt deja în `.gitignore` ✅

### CE Urci pe GitHub:
- ✅ Cod PHP (tema, plugins)
- ✅ CSS, JavaScript
- ✅ Documentație
- ✅ Configurații (fără passwords)

---

## 🐛 Probleme Comune

### "Permission denied" când faci git pull pe server

```bash
# SSH în server
ssh user@server
cd /path/to/theme
sudo chown -R your-user:your-user .
git pull origin main
sudo chown -R www-data:www-data .
```

### Modificările nu apar pe site

```bash
# Pe server - clear cache
# WordPress Admin → Tools → Clear Cache
# SAU restart server
```

### "Fatal: not a git repository"

```bash
# În folderul respectiv
git init
git remote add origin https://github.com/username/market-time.git
git fetch
git checkout main
```

---

## 📞 Quick Help

**Setup complet în 10 pași:**

1. `git init` → `git add .` → `git commit`
2. Create GitHub repo
3. `git remote add origin URL`
4. `git push origin main`
5. SSH în server
6. `git clone` repository
7. Copy fișiere la wp-content
8. Edit wp-config.php
9. Activate theme
10. Test API

**Update cod (zilnic):**

1. Edit în VS Code
2. `git add . && git commit -m "msg" && git push`
3. SSH în server → `git pull`
4. Test

---

Simplu, nu? 🚀

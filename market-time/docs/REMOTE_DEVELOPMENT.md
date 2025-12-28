# 🌐 Development cu Server Extern - Market-Time

## Arhitectura: VS Code Local + WordPress pe Server Extern

Acest ghid descrie cum să dezvolți local în VS Code dar să ai WordPress rulând pe un server extern (VPS/Cloud).

---

## 🎯 Scenarii de Lucru

### Scenariul 1: WordPress pe Server + Frontend Local

**Cel mai comun pentru development Next.js:**

```
VS Code (Local)                    Server Extern
┌──────────────────┐              ┌─────────────────────┐
│  Frontend        │              │  WordPress          │
│  Next.js Dev     │─── API ─────►│  + Database         │
│  localhost:3000  │              │  + REST API         │
└──────────────────┘              │  https://api.ro     │
                                  └─────────────────────┘
```

**Configurare Frontend Local:**

```bash
# frontend/.env.local
NEXT_PUBLIC_WP_API_URL=https://api.market-time.ro/wp-json/market-time/v1
WORDPRESS_API_URL=https://api.market-time.ro/wp-json/market-time/v1
```

**Pornești doar frontend local:**
```bash
cd frontend
npm run dev
```

Frontend-ul va face API calls către serverul extern.

---

### Scenariul 2: Hybrid - Backend Local + Sync la Server

**Pentru development plugin/theme cu test rapid:**

```
VS Code (Local)                    Server Extern
┌──────────────────┐              ┌─────────────────────┐
│  WordPress       │              │  WordPress          │
│  Docker Local    │   Deploy     │  Production         │
│  localhost:8080  │─────────────►│  https://api.ro     │
└──────────────────┘              └─────────────────────┘
      │
      └─ Develop here
      └─ Test here
      └─ Deploy când e gata
```

**Workflow:**

1. **Dezvoltă local cu Docker:**
   ```bash
   make start
   # Lucrezi pe localhost:8080
   ```

2. **Test local:**
   ```bash
   # Editezi fișiere în VS Code
   # Changes sunt instant vizibile (volume mounts)
   ```

3. **Deploy la server când e gata:**
   ```bash
   # Via Git
   git push origin main

   # SAU via SFTP/rsync (vezi mai jos)
   ```

---

## 🚀 Metode de Deploy la Server

### Metoda 1: **SFTP din VS Code** (Cel mai simplu)

Instalează extensia **SFTP** în VS Code:

1. **Install Extension:**
   - Press `Ctrl+Shift+X`
   - Search "SFTP"
   - Install "SFTP" by Natizyskunk

2. **Configurează SFTP:**

Creează `.vscode/sftp.json`:

```json
{
  "name": "Market-Time Production",
  "host": "your-server-ip",
  "protocol": "sftp",
  "port": 22,
  "username": "root",
  "password": "your-password",
  "privateKeyPath": "~/.ssh/id_rsa",
  "remotePath": "/var/www/market-time/wp-content",
  "uploadOnSave": false,
  "ignore": [
    ".vscode",
    ".git",
    "node_modules",
    ".env"
  ],
  "watcher": {
    "files": "**/*.{php,css,js}",
    "autoUpload": false,
    "autoDelete": false
  }
}
```

3. **Deploy Manual:**
   - Right-click pe folder `backend/wp-content/themes/market-time`
   - Select **SFTP: Upload Folder**

4. **SAU Auto-upload pe Save:**
   - Set `"uploadOnSave": true` în `sftp.json`
   - Fiecare salvare uploadează automat

**Avantaje:**
- ✅ Direct din VS Code
- ✅ Preview changes instant
- ✅ Undo ușor

**Dezavantaje:**
- ⚠️ Requires SSH access
- ⚠️ Poate overwrite manual changes pe server

---

### Metoda 2: **Git Deploy** (Profesional)

Setup Git deployment cu automatic pull pe server.

**1. Setup pe Server:**

```bash
# SSH în server
ssh root@your-server-ip

# Navigate la WordPress
cd /var/www/market-time

# Initialize Git (dacă nu e deja)
git init
git remote add origin https://github.com/your-username/market-time.git
```

**2. Create Deploy Script pe Server:**

```bash
# Creează script
nano /home/deploy.sh
```

Conținut:
```bash
#!/bin/bash
cd /var/www/market-time
git pull origin main
# Restart services dacă e necesar
# systemctl restart nginx
echo "Deployment complete!"
```

```bash
chmod +x /home/deploy.sh
```

**3. Deploy din VS Code Terminal:**

```bash
# Local - commit changes
git add .
git commit -m "Update theme"
git push origin main

# SSH și run deploy script
ssh root@your-server-ip "/home/deploy.sh"
```

**4. SAU Automatic Deploy cu GitHub Actions:**

Creează `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_IP }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/market-time
            git pull origin main
            # Restart services
```

Setează secrets în GitHub: Settings → Secrets → Actions

**Avantaje:**
- ✅ Version control
- ✅ Automatic deployment
- ✅ Rollback ușor

---

### Metoda 3: **rsync** (Rapid & Eficient)

Sync selectiv doar fișierele modificate.

**Creează script local: `deploy.sh`**

```bash
#!/bin/bash

echo "🚀 Deploying Market-Time to production..."

# Sync theme
rsync -avz --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.DS_Store' \
  backend/wp-content/themes/market-time/ \
  root@your-server-ip:/var/www/market-time/wp-content/themes/market-time/

# Sync must-use plugins
rsync -avz --delete \
  backend/wp-content/mu-plugins/ \
  root@your-server-ip:/var/www/market-time/wp-content/mu-plugins/

echo "✅ Deployment complete!"
```

**Usage:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Avantaje:**
- ✅ Foarte rapid (doar fișiere modificate)
- ✅ Poate exclude fișiere
- ✅ Reliable

---

## 🔧 Setup VS Code pentru Remote Development

### Varianta A: VS Code Remote SSH

Editezi fișiere **direct pe server** în VS Code.

**1. Install Extension:**
- `Ctrl+Shift+X` → Search "Remote - SSH"
- Install by Microsoft

**2. Connect la Server:**
- `Ctrl+Shift+P` → "Remote-SSH: Connect to Host"
- Enter: `root@your-server-ip`
- Enter password

**3. Open Folder pe Server:**
- File → Open Folder
- `/var/www/market-time/wp-content`

**4. Edit Direct:**
- Toate modificările se fac direct pe server
- Nu mai trebuie deploy

**Avantaje:**
- ✅ Zero sync delay
- ✅ Editezi production code direct
- ✅ Terminal rulează pe server

**Dezavantaje:**
- ⚠️ Requires bună conexiune internet
- ⚠️ Risk de erori în production
- ⚠️ No local backup

---

### Varianta B: Local Dev + Manual Sync

**Workflow:**

1. **Dezvoltă Local (Docker):**
   ```bash
   make start
   # Edit files în backend/wp-content/
   # Test la http://localhost:8080
   ```

2. **Test API Local:**
   ```bash
   curl http://localhost:8080/wp-json/market-time/v1/products
   ```

3. **Deploy când e gata:**
   ```bash
   ./deploy.sh
   # SAU
   git push origin main
   ssh root@server "/home/deploy.sh"
   ```

4. **Verifică Production:**
   ```bash
   curl https://api.market-time.ro/wp-json/market-time/v1/products
   ```

---

## 🗄️ Database Sync (Local ↔ Server)

### Export din Production → Import Local

```bash
# Pe server - export database
ssh root@your-server-ip
mysqldump -u root -p market_time_prod > /tmp/production-backup.sql

# Download local
scp root@your-server-ip:/tmp/production-backup.sql ./backup.sql

# Import în Docker local
cat backup.sql | docker-compose exec -T db mysql -u root -prootpassword market_time
```

### Export Local → Import în Production

```bash
# Local - export
docker-compose exec db mysqldump -u root -prootpassword market_time > local-backup.sql

# Upload la server
scp local-backup.sql root@your-server-ip:/tmp/

# Import pe server
ssh root@your-server-ip
mysql -u root -p market_time_prod < /tmp/local-backup.sql
```

---

## ⚡ Quick Commands Cheat Sheet

### Deploy Theme Changes
```bash
# SFTP (from VS Code)
Right-click folder → SFTP: Upload Folder

# Git
git add . && git commit -m "Update" && git push
ssh root@server "/home/deploy.sh"

# rsync
./deploy.sh
```

### Test Production API
```bash
# Products
curl https://api.market-time.ro/wp-json/market-time/v1/products

# Single product
curl https://api.market-time.ro/wp-json/market-time/v1/products/7

# Merchants
curl https://api.market-time.ro/wp-json/market-time/v1/merchants
```

### SSH Quick Access
```bash
# Setup SSH key pentru no-password login
ssh-copy-id root@your-server-ip

# Apoi connect direct:
ssh root@your-server-ip
```

### View Server Logs
```bash
# Nginx
ssh root@server "tail -f /var/log/nginx/error.log"

# PHP
ssh root@server "tail -f /var/log/php8.1-fpm.log"

# WordPress debug
ssh root@server "tail -f /var/www/market-time/wp-content/debug.log"
```

---

## 🔐 Security Best Practices

### 1. SSH Key Authentication
```bash
# Local - generează SSH key
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy to server
ssh-copy-id root@your-server-ip

# Disable password authentication pe server
ssh root@server
nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
systemctl restart sshd
```

### 2. Firewall Setup
```bash
# Pe server
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

### 3. Environment Variables
```bash
# NEVER commit .env to Git!
# Add la .gitignore:
echo ".env" >> .gitignore

# Pe server, creează .env separat manual
```

---

## 📊 Recommended Workflow

### Pentru Most Projects:

1. **Backend pe Server Extern** (managed WordPress hosting)
2. **Frontend Local Development** (Next.js cu Docker optional)
3. **Deploy via Git** (automatic cu GitHub Actions)

### Setup Steps:

```bash
# 1. Server Setup (once)
# - Buy VPS sau managed WordPress
# - Install WordPress
# - Upload tema & plugins via Git

# 2. Local Development
cd frontend
npm run dev
# Editezi Next.js code
# API calls merg la production server

# 3. Deploy
git add .
git commit -m "New feature"
git push origin main
# GitHub Actions deploy automat (sau manual pull pe server)
```

---

## 🎯 Summary

| Aspect | Local Development | Production Server |
|--------|------------------|-------------------|
| **WordPress** | Docker (optional) | VPS/Cloud |
| **Database** | Docker MySQL | Production MySQL |
| **Frontend** | localhost:3000 | Vercel/Netlify |
| **API** | Points to → | Production API |
| **Deploy** | Git push → | Auto-pull |
| **Edit Code** | VS Code local | Sync via Git/SFTP |

**Best Practice:** Develop local, test local, deploy to production când features sunt complete.

---

Ai întrebări despre vreun aspect specific? 🚀

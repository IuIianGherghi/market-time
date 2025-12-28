# 🐳 Docker Quick Reference - Market-Time

## 🚀 Quick Start

```bash
cp .env.example .env     # Creează config
make install             # Instalare completă
make setup               # Creează produse demo
```

**Acces:**
- WordPress Admin: http://localhost:8080/wp-admin (admin/admin123)
- API: http://localhost:8080/wp-json/market-time/v1/products
- phpMyAdmin: http://localhost:8081

---

## ⚡ Comenzi Frecvente

### Container Management
```bash
make start               # Pornește containere
make stop                # Oprește containere
make restart             # Restart containere
make status              # Status containere
make logs                # Vezi logs (toate)
make logs-wp             # Vezi logs WordPress
```

### Development
```bash
make shell               # Bash în WordPress container
make db-shell            # MySQL command line
make test                # Test API endpoints
```

### Cleanup
```bash
make clean               # Oprește și șterge containere
make clean-all           # ⚠️ Șterge TOT (inclusiv data)
```

---

## 📁 Fișiere Importante

| Fișier | Scop |
|--------|------|
| `docker-compose.yml` | Configurare servicii Docker |
| `.env` | Variabile de mediu (API keys, passwords) |
| `Makefile` | Comenzi shortcut |
| `docker/wordpress/Dockerfile` | WordPress custom image |
| `docker/scripts/setup-wordpress.sh` | Script WP-CLI pentru setup |

---

## 🔧 Modificări Cod

Fișierele sunt **mounted ca volumes** - modificările sunt instant:

```
backend/wp-content/themes/market-time/  → Container
backend/wp-content/mu-plugins/          → Container
```

**Nu trebuie să copiezi manual!** Salvează în VS Code → Refresh browser.

---

## 🧪 Test API

```bash
# Lista produse
curl http://localhost:8080/wp-json/market-time/v1/products

# Filtrare merchant
curl http://localhost:8080/wp-json/market-time/v1/products?merchant_id=1

# Filtrare preț
curl "http://localhost:8080/wp-json/market-time/v1/products?min_price=1000&max_price=7000"
```

---

## 🐛 Probleme Comune

### Port 8080 ocupat
Schimbă în `docker-compose.yml`:
```yaml
wordpress:
  ports:
    - "8090:80"  # Changed
```

### WordPress nu pornește
```bash
docker-compose logs wordpress
docker-compose restart wordpress
```

### Reset complet
```bash
make clean-all
make install
make setup
```

---

## 📚 Documentație Completă

Vezi [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md) pentru ghid detaliat.

---

## 💡 VS Code Tasks

`Ctrl+Shift+P` → **Tasks: Run Task**

- Docker: Install Market-Time
- Docker: Start Containers
- Docker: Run WordPress Setup
- Open WordPress Admin
- Open API Products Endpoint

---

**🎯 3 Comenzi pentru Setup Complet:**

```bash
make install && make setup && make test
```

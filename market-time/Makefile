# Market-Time Makefile
# Shortcut commands for Docker operations

.PHONY: help install start stop restart logs shell db-shell setup clean status test

# Default target
help:
	@echo "Market-Time Docker Commands"
	@echo "============================"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make install      - Initial setup (create .env, build, start)"
	@echo "  make setup        - Run WordPress setup script (create products)"
	@echo ""
	@echo "Container Management:"
	@echo "  make start        - Start all containers"
	@echo "  make stop         - Stop all containers"
	@echo "  make restart      - Restart all containers"
	@echo "  make status       - Show container status"
	@echo ""
	@echo "Development:"
	@echo "  make logs         - Show container logs (all)"
	@echo "  make logs-wp      - Show WordPress logs only"
	@echo "  make shell        - Open WordPress container shell"
	@echo "  make db-shell     - Open MySQL shell"
	@echo ""
	@echo "Testing:"
	@echo "  make test         - Test API endpoints"
	@echo "  make test-db      - Test database connection"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean        - Stop and remove all containers"
	@echo "  make clean-all    - Remove containers, volumes, and images"
	@echo ""

# Initial installation
install:
	@echo "🚀 Installing Market-Time..."
	@if [ ! -f .env ]; then \
		echo "Creating .env file from template..."; \
		cp .env.example .env; \
		echo "⚠️  Please edit .env file with your configuration!"; \
	fi
	@echo "Building Docker images..."
	docker-compose build
	@echo "Starting containers..."
	docker-compose up -d
	@echo "Waiting for WordPress to be ready..."
	@sleep 15
	@echo "✅ Installation complete!"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Edit .env file with your API keys"
	@echo "  2. Run 'make setup' to create sample products"
	@echo "  3. Visit http://localhost:8080"

# Start containers
start:
	@echo "▶️  Starting Market-Time containers..."
	docker-compose up -d
	@echo "✅ Containers started!"
	@make status

# Stop containers
stop:
	@echo "⏸️  Stopping Market-Time containers..."
	docker-compose stop
	@echo "✅ Containers stopped!"

# Restart containers
restart:
	@echo "🔄 Restarting Market-Time containers..."
	docker-compose restart
	@echo "✅ Containers restarted!"

# Show container status
status:
	@echo "📊 Container Status:"
	@docker-compose ps

# Show logs
logs:
	docker-compose logs -f

logs-wp:
	docker-compose logs -f wordpress

# WordPress container shell
shell:
	@echo "🐚 Opening WordPress container shell..."
	docker-compose exec wordpress bash

# MySQL shell
db-shell:
	@echo "🗄️  Opening MySQL shell..."
	docker-compose exec db mysql -u root -p$(shell grep DB_ROOT_PASSWORD .env | cut -d '=' -f2)

# Run setup script
setup:
	@echo "⚙️  Running WordPress setup script..."
	docker-compose exec -T wpcli bash /scripts/setup-wordpress.sh
	@echo ""
	@echo "✅ Setup complete!"
	@echo "Visit: http://localhost:8080/wp-json/market-time/v1/products"

# Test API endpoints
test:
	@echo "🧪 Testing Market-Time API..."
	@echo ""
	@echo "1. Products endpoint:"
	@curl -s http://localhost:8080/wp-json/market-time/v1/products | head -c 200
	@echo "..."
	@echo ""
	@echo "2. Merchants endpoint:"
	@curl -s http://localhost:8080/wp-json/market-time/v1/merchants | head -c 200
	@echo "..."
	@echo ""
	@echo "3. Categories endpoint:"
	@curl -s http://localhost:8080/wp-json/market-time/v1/categories | head -c 200
	@echo "..."
	@echo ""

# Test database connection
test-db:
	@echo "🗄️  Testing database connection..."
	docker-compose exec db mysqladmin ping -h localhost -u root -p$(shell grep DB_ROOT_PASSWORD .env | cut -d '=' -f2)

# Clean up (stop and remove containers)
clean:
	@echo "🧹 Cleaning up containers..."
	docker-compose down
	@echo "✅ Cleanup complete!"

# Clean all (including volumes and images)
clean-all:
	@echo "🧹 Removing all containers, volumes, and images..."
	@echo "⚠️  This will delete all data! Press Ctrl+C to cancel..."
	@sleep 5
	docker-compose down -v --rmi all
	@echo "✅ Complete cleanup done!"

# Update theme and plugins
update:
	@echo "📦 Copying latest theme and plugin files..."
	@echo "Files are mounted via volumes - no copy needed!"
	@echo "Just restart containers to pick up changes:"
	@make restart

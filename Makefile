.PHONY: up down restart build logs shell-backend shell-frontend migrate seed test help

# Start containers
up:
	docker compose up -d

# Stop containers
down:
	docker compose down

# Restart containers
restart:
	docker compose down && docker compose up -d

# Build containers
build:
	docker compose build --no-cache

# View container logs
logs:
	docker compose logs -f

# Shell into Laravel backend
shell-backend:
	docker compose exec backend sh

# Shell into Next.js frontend
shell-frontend:
	docker compose exec frontend sh

# Run database migrations
migrate:
	docker compose exec backend php artisan migrate

# Seed database with sample data
seed:
	docker compose exec backend php artisan db:seed

# Run backend tests
test:
	docker compose exec backend php artisan test

# Show available commands
help:
	@echo "Available commands:"
	@echo "  make up             - Start all docker containers in background"
	@echo "  make down           - Stop all docker containers"
	@echo "  make restart        - Restart all containers"
	@echo "  make build          - Build docker images from scratch"
	@echo "  make logs           - View real-time logs from all containers"
	@echo "  make shell-backend  - Access backend container terminal"
	@echo "  make shell-frontend - Access frontend container terminal"
	@echo "  make migrate        - Run Laravel database migrations"
	@echo "  make seed           - Seed database with default content"
	@echo "  make test           - Run Laravel phpunit/pest test suites"

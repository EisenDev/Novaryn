#!/usr/bin/env bash
set -e

# Clear styling variables
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0;37m'

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}        NOVARYN PLATFORM BOOTSTRAPPER          ${NC}"
echo -e "${BLUE}===============================================${NC}"

# 1. Setup local env configs
if [ ! -f backend/.env ]; then
    echo -e "${YELLOW}[1/5] Creating backend .env file...${NC}"
    cp backend/.env.example backend/.env
    # Adjust SQLite config parameters to PostgreSQL mappings for docker compose
    sed -i 's/DB_CONNECTION=sqlite/DB_CONNECTION=pgsql/' backend/.env
    sed -i 's/# DB_HOST=127.0.0.1/DB_HOST=db/' backend/.env
    sed -i 's/# DB_PORT=3306/DB_PORT=5432/' backend/.env
    sed -i 's/# DB_DATABASE=laravel/DB_DATABASE=novaryn_db/' backend/.env
    sed -i 's/# DB_USERNAME=root/DB_USERNAME=novaryn_user/' backend/.env
    sed -i 's/# DB_PASSWORD=/DB_PASSWORD=novaryn_pass/' backend/.env
    sed -i 's/CACHE_STORE=database/CACHE_STORE=redis/' backend/.env
    sed -i 's/REDIS_HOST=127.0.0.1/REDIS_HOST=redis/' backend/.env
    echo -e "${GREEN}✓ Created backend/.env successfully.${NC}"
else
    echo -e "${GREEN}✓ backend/.env configuration file already exists. Skipping.${NC}"
fi

# 2. Boot docker containers
echo -e "${YELLOW}[2/5] Compiling and starting Docker containers...${NC}"
docker compose up --build -d

# 3. Wait for PostgreSQL container
echo -e "${YELLOW}[3/5] Waiting for PostgreSQL database container to accept connections...${NC}"
until docker compose exec -T db pg_isready -U novaryn_user -d novaryn_db >/dev/null 2>&1; do
    echo -n "."
    sleep 1
done
echo ""
echo -e "${GREEN}✓ Database service is ready and accepting connections!${NC}"

# 4. Verify composer vendor packages
echo -e "${YELLOW}[4/5] Syncing PHP packages inside container...${NC}"
docker compose exec -T backend composer install --no-interaction
docker compose exec -T backend composer update laravel/sanctum --no-interaction

# 5. Run migrations & seeders
echo -e "${YELLOW}[5/5] Running migrations & seeders...${NC}"
docker compose exec -T backend php artisan migrate:fresh --seed --force

echo -e "${BLUE}===============================================${NC}"
echo -e "${GREEN}   Setup Completed Successfully!               ${NC}"
echo -e "${BLUE}===============================================${NC}"
echo -e "Access URLs:"
echo -e "  - ${BLUE}Marketing Frontend${NC}: http://localhost:3001"
echo -e "  - ${BLUE}Backend API Gateway${NC}: http://localhost:8000/api/v1"
echo -e "  - ${BLUE}Backend Health Status${NC}: http://localhost:8000/up"
echo ""
echo -e "Default Administrator Credentials:"
echo -e "  - ${YELLOW}Email${NC}: admin@novaryn.tech"
echo -e "  - ${YELLOW}Password${NC}: password123"
echo -e "${BLUE}===============================================${NC}"

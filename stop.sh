#!/usr/bin/env bash
set -e

# Clear styling variables
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0;37m'

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}        NOVARYN PLATFORM SHUTDOWN              ${NC}"
echo -e "${BLUE}===============================================${NC}"

echo -e "${YELLOW}Stopping all Docker Compose services...${NC}"
docker compose down

echo -e "${BLUE}===============================================${NC}"
echo -e "${GREEN}✓ All services stopped successfully!${NC}"
echo -e "${YELLOW}Note: Your database storage volumes have been preserved.${NC}"
echo -e "${BLUE}===============================================${NC}"

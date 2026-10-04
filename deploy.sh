#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}transitsg Deployment CLI${NC}"
echo -e "${BLUE}------------------------${NC}\n"

echo "Pulling latest changes..."
git pull
echo ""

echo "Installing dependencies..."
npm install
echo ""

echo "Building application..."
npm run build
echo ""

echo "Verifying .env exists..."

ENV_FILE=".env"

if [[ -f "$ENV_FILE" ]]; then
	echo -e "${GREEN}.env file exists!${NC}"
else
	echo "Creating .env file..."
	touch .env
fi

set -a
source .env
set +a

if [[ ! -v NODE_ENV ]]; then
	echo "NODE_ENV=production" >> .env
fi

if [[ ! -v PORT ]]; then
	read -p "Port to listen on: " SELECTED_PORT
	echo "PORT=$SELECTED_PORT" >> .env
fi

if [[ ! -v NUXT_DATAMALL_API_KEY ]]; then
	read -p "LTA DataMall API key: " DATAMALL_KEY
	echo "NUXT_DATAMALL_API_KEY=$DATAMALL_KEY" >> .env
fi

echo -e "${GREEN}Environment variables set up!${NC}\n"

echo "Running application..."

node --env-file=.env .output/server/index.mjs
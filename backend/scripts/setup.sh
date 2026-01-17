#!/bin/bash

# =============================================================================
# Backend Setup Script
# =============================================================================
# This script helps you set up the backend project for the first time
# Usage: ./scripts/setup.sh
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log_info "========================================="
log_info "Backend Setup Script"
log_info "========================================="

cd "$PROJECT_DIR"

# Check if .env exists
if [ ! -f ".env" ]; then
    log_info "Creating .env file from .env.example..."
    cp .env.example .env
    log_info ".env file created! Please update with your configuration."
else
    log_warn ".env file already exists. Skipping..."
fi

# Install dependencies
log_info "Installing dependencies..."
npm install

# Create logs directory
if [ ! -d "logs" ]; then
    log_info "Creating logs directory..."
    mkdir -p logs
fi

# Create backups directory
if [ ! -d "backups" ]; then
    log_info "Creating backups directory..."
    mkdir -p backups
fi

# Start MongoDB with Docker Compose
log_info "Starting MongoDB with Docker Compose..."
docker-compose up -d

log_info ""
log_info "========================================="
log_info "Setup completed! ✓"
log_info "========================================="
log_info ""
log_info "Next steps:"
log_info "  1. Update .env file with your configuration"
log_info "  2. Run 'npm run start:dev' to start the development server"
log_info "  3. Access http://localhost:3001"
log_info ""
log_info "MongoDB is running on localhost:27017"
log_info "Username: root"
log_info "Password: 123456 (change this in .env)"
log_info ""


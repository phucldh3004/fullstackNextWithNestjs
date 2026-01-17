#!/bin/bash

# =============================================================================
# NestJS Backend Deployment Script
# =============================================================================
# This script automates the deployment process for the NestJS backend
# Usage: ./scripts/deploy.sh [production|development]
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Environment (default to production)
ENV=${1:-production}

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE=".env.${ENV}"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
check_env_file() {
    log_info "Checking environment file..."
    if [ ! -f "${PROJECT_DIR}/${ENV_FILE}" ]; then
        log_error "Environment file ${ENV_FILE} not found!"
        log_warn "Please create ${ENV_FILE} based on .env.production.example"
        exit 1
    fi
    log_info "Environment file found: ${ENV_FILE}"
}

# Check if Docker is installed
check_docker() {
    log_info "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed!"
        exit 1
    fi
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed!"
        exit 1
    fi
    log_info "Docker and Docker Compose are installed"
}

# Pull latest code
pull_code() {
    log_info "Pulling latest code from repository..."
    git pull origin main || log_warn "Could not pull from git (might be local development)"
}

# Build Docker image
build_docker() {
    log_info "Building Docker image..."
    docker build -t nestjs-backend:${ENV} .
    log_info "Docker image built successfully"
}

# Deploy with Docker Compose
deploy_docker_compose() {
    log_info "Deploying with Docker Compose..."
    
    # Stop existing containers
    log_info "Stopping existing containers..."
    docker-compose -f docker-compose.production.yml --env-file ${ENV_FILE} down || true
    
    # Start new containers
    log_info "Starting new containers..."
    docker-compose -f docker-compose.production.yml --env-file ${ENV_FILE} up -d --build
    
    log_info "Deployment completed!"
}

# Check application health
check_health() {
    log_info "Checking application health..."
    sleep 10  # Wait for application to start
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3001/health &> /dev/null; then
            log_info "Application is healthy! ✓"
            return 0
        fi
        log_warn "Attempt $attempt/$max_attempts: Application not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "Application health check failed after $max_attempts attempts"
    log_error "Please check logs: docker-compose -f docker-compose.production.yml logs"
    return 1
}

# View logs
view_logs() {
    log_info "Viewing application logs..."
    docker-compose -f docker-compose.production.yml logs -f backend
}

# Cleanup old images
cleanup() {
    log_info "Cleaning up old Docker images..."
    docker image prune -f
    log_info "Cleanup completed"
}

# Backup database
backup_database() {
    log_info "Creating database backup..."
    local backup_dir="${PROJECT_DIR}/backups"
    local backup_file="${backup_dir}/mongodb_backup_$(date +%Y%m%d_%H%M%S).gz"
    
    mkdir -p "$backup_dir"
    
    docker exec backend-mongodb-prod mongodump --archive --gzip > "$backup_file"
    
    if [ $? -eq 0 ]; then
        log_info "Database backup created: $backup_file"
    else
        log_error "Database backup failed"
        return 1
    fi
}

# Rollback deployment
rollback() {
    log_warn "Rolling back to previous deployment..."
    docker-compose -f docker-compose.production.yml down
    docker-compose -f docker-compose.production.yml up -d
    log_info "Rollback completed"
}

# Main deployment flow
main() {
    log_info "========================================="
    log_info "Starting deployment for: ${ENV}"
    log_info "========================================="
    
    cd "$PROJECT_DIR"
    
    # Pre-deployment checks
    check_env_file
    check_docker
    
    # Backup before deployment (production only)
    if [ "$ENV" = "production" ]; then
        backup_database || log_warn "Backup failed, continuing deployment..."
    fi
    
    # Deploy
    pull_code
    build_docker
    deploy_docker_compose
    
    # Post-deployment checks
    if check_health; then
        log_info "========================================="
        log_info "Deployment successful! ✓"
        log_info "========================================="
        cleanup
    else
        log_error "========================================="
        log_error "Deployment failed! ✗"
        log_error "========================================="
        log_warn "Consider rolling back: ./scripts/deploy.sh rollback"
        exit 1
    fi
    
    # Show useful commands
    log_info ""
    log_info "Useful commands:"
    log_info "  View logs: docker-compose -f docker-compose.production.yml logs -f"
    log_info "  Stop app:  docker-compose -f docker-compose.production.yml down"
    log_info "  Restart:   docker-compose -f docker-compose.production.yml restart"
}

# Command routing
case "${1}" in
    production|development)
        main
        ;;
    rollback)
        rollback
        ;;
    logs)
        view_logs
        ;;
    backup)
        backup_database
        ;;
    health)
        check_health
        ;;
    cleanup)
        cleanup
        ;;
    *)
        log_info "Usage: $0 [production|development|rollback|logs|backup|health|cleanup]"
        log_info ""
        log_info "Commands:"
        log_info "  production  - Deploy to production environment"
        log_info "  development - Deploy to development environment"
        log_info "  rollback    - Rollback to previous deployment"
        log_info "  logs        - View application logs"
        log_info "  backup      - Create database backup"
        log_info "  health      - Check application health"
        log_info "  cleanup     - Remove old Docker images"
        exit 1
        ;;
esac


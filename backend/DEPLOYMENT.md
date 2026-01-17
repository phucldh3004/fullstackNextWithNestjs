# Backend Deployment Guide

Hướng dẫn đầy đủ để deploy NestJS backend application với nhiều phương pháp khác nhau.

## Mục lục

1. [Chuẩn bị](#1-chuẩn-bị)
2. [Docker Deployment](#2-docker-deployment)
3. [Docker Compose Deployment](#3-docker-compose-deployment)
4. [PM2 Deployment (VPS/EC2)](#4-pm2-deployment-vpsec2)
5. [Cloud Platform Deployment](#5-cloud-platform-deployment)
6. [Health Check Endpoint](#6-health-check-endpoint)
7. [Monitoring & Logs](#7-monitoring--logs)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Chuẩn bị

### Prerequisites

- Node.js 20+ (nếu deploy trực tiếp)
- Docker & Docker Compose (nếu dùng Docker)
- PM2 (nếu deploy với PM2)
- MongoDB instance hoặc MongoDB Atlas

### Environment Variables

Tạo file `.env.production` dựa trên `.env.production.example`:

```bash
cp .env.production.example .env.production
```

Cập nhật các giá trị quan trọng:
- `JWT_SECRET`: Đổi thành một chuỗi random phức tạp
- `MONGO_ROOT_PASSWORD`: Mật khẩu mạnh cho MongoDB
- `MONGODB_URI_USER` & `MONGODB_URI_APP`: URI kết nối MongoDB
- `FRONTEND_URL`: URL của frontend (cho CORS)

**⚠️ Lưu ý bảo mật:**
- Không commit file `.env` vào Git
- Sử dụng secret management cho production (AWS Secrets Manager, HashiCorp Vault, etc.)
- Tạo JWT_SECRET ngẫu nhiên: `openssl rand -base64 32`

---

## 2. Docker Deployment

### Build Docker Image

```bash
# Build production image
docker build -t nestjs-backend:latest .

# Build với tag cụ thể
docker build -t nestjs-backend:v1.0.0 .
```

### Run Container

```bash
# Run với environment variables
docker run -d \
  --name nestjs-backend \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e MONGODB_URI_USER=your_mongodb_uri \
  -e MONGODB_URI_APP=your_mongodb_uri \
  -e JWT_SECRET=your_jwt_secret \
  nestjs-backend:latest

# Run với .env file
docker run -d \
  --name nestjs-backend \
  -p 3001:3001 \
  --env-file .env.production \
  nestjs-backend:latest
```

### Kiểm tra Container

```bash
# Xem logs
docker logs -f nestjs-backend

# Kiểm tra health
docker ps
curl http://localhost:3001/health

# Stop/Start/Restart
docker stop nestjs-backend
docker start nestjs-backend
docker restart nestjs-backend
```

---

## 3. Docker Compose Deployment

Đơn giản nhất và được khuyến nghị cho hầu hết trường hợp.

### Bước 1: Cấu hình Environment

```bash
# Copy và chỉnh sửa file .env
cp .env.production.example .env.production
```

### Bước 2: Deploy

```bash
# Start tất cả services (backend + MongoDB)
docker-compose -f docker-compose.production.yml --env-file .env.production up -d

# Start với MongoDB Express (database management tool)
docker-compose -f docker-compose.production.yml --env-file .env.production --profile tools up -d

# Build lại nếu có thay đổi code
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d
```

### Bước 3: Kiểm tra

```bash
# Xem logs tất cả services
docker-compose -f docker-compose.production.yml logs -f

# Xem logs backend only
docker-compose -f docker-compose.production.yml logs -f backend

# Check status
docker-compose -f docker-compose.production.yml ps

# Test health endpoint
curl http://localhost:3001/health
```

### Bước 4: Management Commands

```bash
# Stop tất cả services
docker-compose -f docker-compose.production.yml down

# Stop và xóa volumes (⚠️ Cẩn thận: Xóa data!)
docker-compose -f docker-compose.production.yml down -v

# Restart services
docker-compose -f docker-compose.production.yml restart

# View logs
docker-compose -f docker-compose.production.yml logs -f backend
docker-compose -f docker-compose.production.yml logs -f mongodb

# Scale backend (multiple instances)
docker-compose -f docker-compose.production.yml up -d --scale backend=3
```

### MongoDB Express Access

Nếu bạn start với profile `tools`, truy cập MongoDB Express tại:
- URL: `http://localhost:8081`
- Username: `admin` (hoặc theo `.env.production`)
- Password: `admin` (hoặc theo `.env.production`)

---

## 4. PM2 Deployment (VPS/EC2)

Cho traditional server deployment.

### Bước 1: Cài đặt trên Server

```bash
# SSH vào server
ssh user@your-server-ip

# Clone repository
git clone your-repo-url
cd backend

# Install dependencies
npm ci --only=production

# Install PM2 globally
npm install -g pm2

# Build application
npm run build
```

### Bước 2: Cấu hình Environment

```bash
# Tạo .env file trên server
nano .env.production

# Hoặc export environment variables
export NODE_ENV=production
export PORT=3001
export MONGODB_URI_USER=your_mongodb_uri
export MONGODB_URI_APP=your_mongodb_uri
export JWT_SECRET=your_jwt_secret
```

### Bước 3: Start với PM2

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup PM2 auto-start on boot
pm2 startup
# Chạy command mà PM2 đưa ra
```

### Bước 4: PM2 Management

```bash
# View status
pm2 status
pm2 list

# View logs
pm2 logs nestjs-backend
pm2 logs nestjs-backend --lines 100

# Monitor
pm2 monit

# Restart
pm2 restart nestjs-backend

# Reload (zero-downtime)
pm2 reload nestjs-backend

# Stop
pm2 stop nestjs-backend

# Delete
pm2 delete nestjs-backend
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci --only=production

# Build
npm run build

# Reload với PM2 (zero-downtime)
pm2 reload ecosystem.config.js --env production
```

---

## 5. Cloud Platform Deployment

### 5.1 Heroku

```bash
# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set PORT=3001

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Procfile** (tạo file này ở root):
```
web: npm run start:prod
```

### 5.2 AWS EC2

1. Launch EC2 instance (Ubuntu/Amazon Linux)
2. SSH vào instance
3. Cài đặt Node.js, MongoDB, PM2
4. Follow [PM2 Deployment](#4-pm2-deployment-vpsec2) steps
5. Setup Nginx reverse proxy (optional):

```nginx
# /etc/nginx/sites-available/backend
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.3 Digital Ocean / Linode

Tương tự AWS EC2, follow PM2 deployment.

### 5.4 Render / Railway

Cả hai đều hỗ trợ Dockerfile deployment:
1. Connect repository
2. Chọn Dockerfile deployment
3. Set environment variables trong dashboard
4. Deploy

### 5.5 Google Cloud Run

```bash
# Build và push image
gcloud builds submit --tag gcr.io/PROJECT_ID/nestjs-backend

# Deploy
gcloud run deploy nestjs-backend \
  --image gcr.io/PROJECT_ID/nestjs-backend \
  --platform managed \
  --region asia-southeast1 \
  --set-env-vars NODE_ENV=production,JWT_SECRET=your_secret
```

---

## 6. Health Check Endpoint

Thêm health check endpoint vào application:

**src/app.controller.ts**:
```typescript
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
```

Test health endpoint:
```bash
curl http://localhost:3001/health
```

---

## 7. Monitoring & Logs

### Docker Logs

```bash
# Follow logs
docker logs -f nestjs-backend

# Last 100 lines
docker logs --tail 100 nestjs-backend

# With timestamps
docker logs -t nestjs-backend
```

### PM2 Logs

```bash
# View logs
pm2 logs

# Flush logs
pm2 flush

# Rotate logs
pm2 install pm2-logrotate
```

### Log Files

Logs được lưu trong thư mục `logs/`:
- `pm2-error.log` - PM2 error logs
- `pm2-out.log` - PM2 output logs
- `pm2-combined.log` - Combined logs

### Monitoring Tools

- **PM2 Plus**: `pm2 plus` (real-time monitoring)
- **Datadog**: Install Datadog agent
- **New Relic**: Install New Relic APM
- **Sentry**: Cho error tracking

---

## 8. Troubleshooting

### Container không start

```bash
# Check logs
docker logs nestjs-backend

# Check container status
docker ps -a

# Inspect container
docker inspect nestjs-backend
```

### MongoDB connection issues

```bash
# Test MongoDB connection
docker exec -it backend-mongodb-prod mongosh -u root -p

# Check MongoDB logs
docker logs backend-mongodb-prod

# Verify connection string trong .env
```

### Port already in use

```bash
# Tìm process sử dụng port 3001
lsof -i :3001
netstat -tuln | grep 3001

# Kill process
kill -9 PID
```

### PM2 application crashed

```bash
# View error logs
pm2 logs nestjs-backend --err

# Restart with fresh state
pm2 delete nestjs-backend
pm2 start ecosystem.config.js --env production
```

### Memory issues

```bash
# Check memory usage
docker stats

# PM2 memory monitoring
pm2 monit

# Increase Node memory limit
node --max-old-space-size=4096 dist/main.js
```

### Build failures

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## Best Practices

1. **Security**:
   - Luôn sử dụng HTTPS trong production
   - Không expose MongoDB port ra public
   - Sử dụng strong passwords và JWT secrets
   - Enable rate limiting
   - Keep dependencies updated

2. **Performance**:
   - Use PM2 cluster mode cho multiple instances
   - Enable compression middleware
   - Implement caching (Redis)
   - Use CDN cho static files
   - Database indexing

3. **Reliability**:
   - Setup automated backups cho MongoDB
   - Implement health checks
   - Use process managers (PM2, systemd)
   - Setup monitoring và alerting
   - Implement graceful shutdown

4. **CI/CD**:
   - Setup automated testing
   - Use GitHub Actions / GitLab CI
   - Automated deployment
   - Rollback strategy

---

## Quick Commands Reference

```bash
# Docker
docker build -t nestjs-backend .
docker run -d -p 3001:3001 --env-file .env.production nestjs-backend
docker logs -f nestjs-backend

# Docker Compose
docker-compose -f docker-compose.production.yml up -d
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml logs -f

# PM2
pm2 start ecosystem.config.js --env production
pm2 restart all
pm2 logs
pm2 monit

# Health Check
curl http://localhost:3001/health
```

---

## Support

Nếu gặp vấn đề, check:
1. Logs của application
2. MongoDB connection
3. Environment variables
4. Network và firewall rules
5. Port availability

Để được hỗ trợ thêm, tạo issue trong repository hoặc liên hệ team.


# Deploy NestJS Backend lên Render.com

Hướng dẫn chi tiết deploy backend lên Render.com.

## 🚀 Quick Start

### Bước 1: Chuẩn bị Repository

Đảm bảo code đã được push lên GitHub/GitLab:

```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Bước 2: Tạo MongoDB Database trên Render

1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Database"**
3. Chọn **MongoDB**
4. Điền thông tin:
   - **Name**: `nestjs-mongodb`
   - **Database**: `fullstackjs_db`
   - **User**: `admin`
   - **Region**: `Singapore` (hoặc gần bạn nhất)
   - **Plan**: `Free` hoặc `Starter`
5. Click **"Create Database"**
6. **Lưu lại Internal Connection String** (dạng: `mongodb://admin:password@mongodb:27017/fullstackjs_db`)

### Bước 3: Deploy Backend Service

#### Option A: Sử dụng Dashboard (Khuyến nghị)

1. Click **"New +"** → **"Web Service"**
2. Connect repository của bạn
3. Điền thông tin:
   - **Name**: `nestjs-backend`
   - **Region**: `Singapore`
   - **Branch**: `main`
   - **Root Directory**: `backend` (nếu backend nằm trong subfolder)
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     npm run start:prod
     ```
   - **Plan**: `Free` hoặc `Starter`

4. Click **"Advanced"** và thêm **Environment Variables**:

   ```
   NODE_ENV=production
   PORT=3001
   
   # MongoDB URIs (lấy từ MongoDB service vừa tạo)
   MONGODB_URI_USER=mongodb://admin:password@your-mongodb-host:27017/users_db
   MONGODB_URI_APP=mongodb://admin:password@your-mongodb-host:27017/app_db
   
   # JWT Secret (generate random)
   JWT_SECRET=your-super-secret-jwt-key-here-change-this
   JWT_EXPIRES_IN=7d
   
   # Frontend URL
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

5. Thêm **Health Check Path**: `/health`

6. Click **"Create Web Service"**

#### Option B: Sử dụng render.yaml (Infrastructure as Code)

1. File `render.yaml` đã có sẵn trong project
2. Trong Render Dashboard:
   - Click **"New +"** → **"Blueprint"**
   - Connect repository
   - Render sẽ tự động detect `render.yaml`
   - Review và click **"Apply"**

3. Sau khi tạo, vào Settings của service và update Environment Variables

### Bước 4: Cấu hình Environment Variables

Vào **Environment** tab của service và thêm/update:

#### MongoDB Connection (Quan trọng!)

Lấy connection string từ MongoDB service:

```bash
# Internal Connection String (dùng khi backend và MongoDB cùng trên Render)
mongodb://admin:password@your-mongodb:27017/fullstackjs_db

# External Connection String (dùng khi MongoDB ở nơi khác)
mongodb+srv://admin:password@cluster.mongodb.net/fullstackjs_db
```

Update 2 biến:
```
MONGODB_URI_USER=mongodb://admin:password@your-mongodb:27017/users_db
MONGODB_URI_APP=mongodb://admin:password@your-mongodb:27017/app_db
```

#### JWT Secret

Generate random JWT secret:

```bash
# Trên terminal/Mac/Linux
openssl rand -base64 32

# Hoặc online: https://randomkeygen.com/
```

Update:
```
JWT_SECRET=abc123xyz789... (chuỗi random bạn vừa generate)
```

#### Frontend URL (CORS)

```
FRONTEND_URL=https://your-frontend.vercel.app
```

### Bước 5: Deploy

1. Service sẽ tự động deploy sau khi save environment variables
2. Hoặc click **"Manual Deploy"** → **"Deploy latest commit"**
3. Theo dõi logs trong **"Logs"** tab

### Bước 6: Verify Deployment

Sau khi deploy thành công:

```bash
# Test health endpoint
curl https://your-app-name.onrender.com/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2026-01-17T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

## 📋 Checklist

- [ ] MongoDB database đã được tạo trên Render
- [ ] Connection strings đã được lưu lại
- [ ] Web service đã được tạo
- [ ] All environment variables đã được set
- [ ] Health check path đã được cấu hình: `/health`
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm run start:prod`
- [ ] Service đã deploy thành công
- [ ] Health endpoint response OK
- [ ] Frontend có thể connect đến backend

## 🔧 Troubleshooting

### Lỗi: "nest: not found"

**Nguyên nhân**: `@nestjs/cli` không được cài đặt

**Giải pháp**:
```bash
# Build command phải là:
npm install && npm run build

# KHÔNG dùng:
npm ci && npm run build
```

### Lỗi: "Cannot connect to MongoDB"

**Nguyên nhân**: Connection string sai hoặc MongoDB chưa ready

**Giải pháp**:
1. Kiểm tra MongoDB service đã running
2. Verify connection string:
   - Đúng username/password
   - Đúng host (internal vs external)
   - Đúng database name
3. Test connection string trên terminal trước:
   ```bash
   mongosh "mongodb://admin:password@host:27017/dbname"
   ```

### Lỗi: "Module not found"

**Nguyên nhân**: Dependencies không được cài đủ

**Giải pháp**:
1. Check `package.json` có đầy đủ dependencies
2. Clear build cache:
   - Settings → "Clear build cache & deploy"

### Lỗi: Health Check Failed

**Nguyên nhân**: Service chưa start xong hoặc health endpoint chưa có

**Giải pháp**:
1. Verify `/health` endpoint exists trong code
2. Tăng Health Check grace period:
   - Settings → Health Check → Grace Period: 60 seconds

### Lỗi: Port Already in Use

**Nguyên nhân**: Đang dùng hardcoded port thay vì `process.env.PORT`

**Giải pháp**: Trong `src/main.ts`:
```typescript
await app.listen(process.env.PORT ?? 3001);
```

### Service crashed sau một thời gian

**Nguyên nhân**: Free tier của Render sleep sau 15 phút không hoạt động

**Giải pháp**:
1. Upgrade lên Starter plan ($7/month) để có instance luôn running
2. Hoặc dùng external monitoring service để ping health endpoint

## 💡 Tips & Best Practices

### 1. Environment-specific Configuration

Sử dụng different configs cho staging vs production:

```bash
# Production
MONGODB_URI_USER=mongodb://...production...
FRONTEND_URL=https://production.com

# Staging
MONGODB_URI_USER=mongodb://...staging...
FRONTEND_URL=https://staging.vercel.app
```

### 2. Logs Monitoring

```bash
# View real-time logs trong Dashboard
# Hoặc dùng Render CLI:
render logs -s nestjs-backend -f
```

### 3. Database Backups

Render Free tier không có auto backup. Tạo cron job để backup:

```bash
# Trong backend, tạo endpoint backup (protected)
@Post('admin/backup')
async createBackup() {
  // Backup logic
}
```

### 4. Custom Domain

1. Settings → Custom Domains
2. Add domain: `api.yourdomain.com`
3. Update DNS records theo hướng dẫn
4. Wait for SSL certificate (tự động)

### 5. Auto-Deploy

- Default: Auto-deploy on push to `main` branch
- Disable: Settings → Auto-Deploy → Off
- Branch: Có thể đổi branch khác

### 6. Health Check Configuration

Settings → Health Check:
- **Path**: `/health`
- **Grace Period**: 60 seconds (time to start)
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Threshold**: 3 failures

### 7. Scaling

Free tier limitations:
- 512 MB RAM
- 0.1 CPU
- Sleep after 15 min inactivity

Starter tier ($7/month):
- 512 MB RAM
- 0.5 CPU
- Always on
- No sleep

Pro tier ($25/month):
- 2 GB RAM
- 1 CPU
- High availability

## 🔐 Security

### 1. Environment Variables

- ✅ Dùng environment variables cho secrets
- ❌ KHÔNG hardcode secrets trong code
- ✅ Generate strong JWT_SECRET

### 2. CORS

Chỉ allow frontend domain:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

### 3. Rate Limiting

Cài đặt rate limiting:
```bash
npm install @nestjs/throttler
```

### 4. Helmet

Security headers:
```bash
npm install helmet
```

## 📊 Monitoring

### Built-in Render Metrics

Dashboard → Metrics:
- CPU usage
- Memory usage
- Request count
- Response time
- Error rate

### External Monitoring (Optional)

1. **UptimeRobot**: Ping health endpoint
2. **Sentry**: Error tracking
3. **LogDNA/Datadog**: Log aggregation
4. **New Relic**: APM

## 🔄 Updates & Rollback

### Deploy New Version

```bash
git add .
git commit -m "Update feature"
git push origin main
# Auto-deploy will trigger
```

### Manual Deploy

Dashboard → Manual Deploy → Deploy latest commit

### Rollback

Dashboard → Events → Click on previous successful deploy → "Rollback to this version"

## 💰 Cost Estimation

### Free Tier
- **Web Service**: Free (với limitations)
- **MongoDB**: Free 256 MB
- **Total**: $0/month

### Starter Tier
- **Web Service**: $7/month
- **MongoDB**: $7/month (1 GB)
- **Total**: $14/month

### Production Tier
- **Web Service Pro**: $25/month
- **MongoDB Standard**: $15/month
- **Total**: $40/month

## 🆘 Support

### Render Documentation
- Docs: https://render.com/docs
- Status: https://status.render.com/

### Community
- Discord: https://discord.gg/render
- Forum: https://community.render.com/

### Common Issues
- Build fails: Check logs trong "Events" tab
- Service crashes: Check logs trong "Logs" tab
- Database connection: Verify connection string

## 📝 Next Steps

Sau khi deploy thành công:

1. ✅ Update frontend với backend URL mới
2. ✅ Test all endpoints
3. ✅ Setup monitoring
4. ✅ Configure custom domain (optional)
5. ✅ Setup CI/CD với auto-deploy
6. ✅ Document API endpoints
7. ✅ Setup error tracking (Sentry)
8. ✅ Configure backups

---

**Happy Deploying! 🚀**

Nếu gặp vấn đề, check logs đầu tiên. Phần lớn issues có thể solve bằng cách xem logs.


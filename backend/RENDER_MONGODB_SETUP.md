# Setup MongoDB cho Render Deployment

## 🔥 Lỗi: Unable to connect to the database

Lỗi này xảy ra vì **environment variables** cho MongoDB chưa được set trên Render.

## ✅ Giải pháp: 3 Options

---

## Option 1: Dùng MongoDB Atlas (Khuyến nghị - FREE)

### Bước 1: Tạo MongoDB Atlas Cluster

1. Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Đăng ký/Đăng nhập
3. Tạo cluster mới:
   - Click **"Build a Database"**
   - Chọn **FREE** tier (M0)
   - Region: **Singapore** (gần Render Singapore)
   - Cluster Name: `fullstackjs-cluster`

### Bước 2: Tạo Database User

1. Vào **Database Access**
2. Click **"Add New Database User"**
3. Tạo user:
   - Username: `admin`
   - Password: Generate hoặc tự tạo (LƯU LẠI!)
   - Database User Privileges: **Read and write to any database**

### Bước 3: Whitelist IP (Quan trọng!)

1. Vào **Network Access**
2. Click **"Add IP Address"**
3. Chọn **"Allow Access from Anywhere"**: `0.0.0.0/0`
   - Cần thiết vì Render có dynamic IPs
4. Click **Confirm**

### Bước 4: Lấy Connection String

1. Vào **Database** → Click **"Connect"**
2. Chọn **"Connect your application"**
3. Copy connection string:
   ```
   mongodb+srv://admin:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. **Thay `<password>` bằng password thực tế** của user

### Bước 5: Cấu hình trên Render

1. Vào Render Dashboard → Service của bạn
2. Tab **"Environment"**
3. Thêm/Update 2 biến:

   ```bash
   MONGODB_URI_USER=mongodb+srv://admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/users_db?retryWrites=true&w=majority
   
   MONGODB_URI_APP=mongodb+srv://admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/app_db?retryWrites=true&w=majority
   ```

   **Lưu ý**: 
   - Thay `YOUR_PASSWORD` bằng password thật
   - Thêm database name: `/users_db` và `/app_db`

4. Click **"Save Changes"**
5. Service sẽ tự động restart

---

## Option 2: Dùng Render MongoDB (Có phí)

### Bước 1: Tạo MongoDB trên Render

1. Render Dashboard → **"New +"** → **"Database"**
2. Chọn **"MongoDB"**
3. Cấu hình:
   - Name: `nestjs-mongodb`
   - Plan: **Starter** ($7/month) - FREE tier không có MongoDB
4. Click **"Create Database"**

### Bước 2: Lấy Connection String

1. Vào MongoDB service vừa tạo
2. Copy **Internal Connection String**:
   ```
   mongodb://admin:password@mongodb:27017/fullstackjs_db
   ```

### Bước 3: Cấu hình Environment Variables

1. Vào backend service → Tab **"Environment"**
2. Thêm:
   ```bash
   MONGODB_URI_USER=mongodb://admin:password@your-mongodb-host:27017/users_db
   
   MONGODB_URI_APP=mongodb://admin:password@your-mongodb-host:27017/app_db
   ```

---

## Option 3: Development - Dùng Single Connection String

Nếu muốn đơn giản hơn (dùng 1 database cho cả users và app):

### Bước 1: Update Database Module

Tạm thời comment code và dùng single connection:

```typescript
// backend/src/database/database.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 
             configService.get<string>('MONGODB_URI_USER'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

### Bước 2: Cấu hình Render

Chỉ cần 1 biến:
```bash
MONGODB_URI=mongodb+srv://admin:password@cluster.xxxxx.mongodb.net/fullstackjs_db?retryWrites=true&w=majority
```

### Bước 3: Update Models

Remove `connectionName` từ models:

```typescript
// Trước:
@InjectModel(User.name, 'usersConnection')

// Sau:
@InjectModel(User.name)
```

---

## 🧪 Test Connection String

Test connection string trước khi deploy:

### Dùng mongosh (CLI)

```bash
mongosh "mongodb+srv://admin:password@cluster.xxxxx.mongodb.net/test"
```

### Dùng Node.js

```javascript
const mongoose = require('mongoose');

mongoose.connect('your-connection-string')
  .then(() => console.log('✅ Connected!'))
  .catch(err => console.error('❌ Error:', err));
```

---

## 📋 Checklist

- [ ] MongoDB cluster/database đã được tạo
- [ ] Database user đã được tạo với password
- [ ] Network Access: Allow 0.0.0.0/0 (nếu dùng Atlas)
- [ ] Connection string đã được copy
- [ ] Password đã được thay thế trong connection string
- [ ] Database name đã được thêm vào connection string
- [ ] Environment variables đã được set trên Render
- [ ] Service đã restart sau khi update env vars
- [ ] Test connection thành công

---

## 🔍 Debug Connection Issues

### Xem logs trên Render

1. Vào service → Tab **"Logs"**
2. Tìm error message chi tiết:
   ```
   MongooseModule] Unable to connect to the database
   ```

### Common Issues

#### 1. Authentication Failed

```
MongoServerError: Authentication failed
```

**Fix**: 
- Check username/password đúng chưa
- Password có ký tự đặc biệt → encode URL:
  ```bash
  # Password: p@ssw0rd!
  # Encoded: p%40ssw0rd%21
  ```

#### 2. Network Timeout

```
MongooseServerSelectionError: connection timed out
```

**Fix**:
- MongoDB Atlas: Check Network Access whitelist
- Render MongoDB: Check internal connection string

#### 3. Database Name Missing

```
MongoParseError: Invalid connection string
```

**Fix**:
- Thêm database name vào URI:
  ```
  mongodb+srv://...mongodb.net/database_name?retryWrites=true
  ```

#### 4. Wrong Connection String Format

**MongoDB Atlas** (cloud):
```
mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/dbname
```

**Self-hosted/Render**:
```
mongodb://user:pass@host:27017/dbname
```

---

## 🚀 Quick Fix Command

Nếu dùng MongoDB Atlas, chạy command này (thay values):

```bash
# Set environment variables trên Render
MONGODB_URI_USER="mongodb+srv://admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/users_db?retryWrites=true&w=majority"

MONGODB_URI_APP="mongodb+srv://admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/app_db?retryWrites=true&w=majority"
```

Save và service sẽ restart tự động.

---

## 💡 Tips

1. **Free Tier Limits**:
   - MongoDB Atlas Free: 512MB storage
   - Render không có free MongoDB

2. **Security**:
   - Dùng strong password
   - Rotate credentials thường xuyên
   - Không commit credentials vào Git

3. **Performance**:
   - Chọn region gần nhau (Atlas Singapore + Render Singapore)
   - Dùng connection pooling (NestJS default)

4. **Monitoring**:
   - MongoDB Atlas có monitoring dashboard miễn phí
   - Check connection count, query performance

---

Sau khi setup xong, deploy lại và check logs để verify connection thành công! ✅


# Test MongoDB Connection

Script để test kết nối MongoDB trước khi deploy lên Render.

## 🚀 Cách sử dụng

### Bước 1: Chuẩn bị

Đảm bảo bạn đã có MongoDB connection string (từ MongoDB Atlas hoặc local).

### Bước 2: Cấu hình .env

Thêm MongoDB URIs vào file `.env`:

```bash
# .env
MONGODB_URI_USER=mongodb+srv://admin:password@cluster.xxxxx.mongodb.net/users_db?retryWrites=true&w=majority
MONGODB_URI_APP=mongodb+srv://admin:password@cluster.xxxxx.mongodb.net/app_db?retryWrites=true&w=majority
```

**Hoặc** tạo file `.env.test`:

```bash
cp .env.test.example .env.test
# Chỉnh sửa .env.test với connection strings của bạn
```

### Bước 3: Chạy Test

```bash
# Chạy test
npm run test:db

# Hoặc trực tiếp
node test-db-connection.js
```

## 📋 Test sẽ kiểm tra gì?

1. ✅ **Connection**: Có connect được tới MongoDB không
2. ✅ **Authentication**: Username/password có đúng không
3. ✅ **Write Permission**: Có quyền ghi dữ liệu không
4. ✅ **Read Permission**: Có quyền đọc dữ liệu không
5. ✅ **Network Access**: IP có được whitelist không (MongoDB Atlas)

## 🎯 Kết quả

### Thành công ✅

```
==========================================
  MongoDB Connection Test
==========================================

ℹ️  === Testing USERS Database ===

ℹ️  Testing connection to: Users DB...
ℹ️  URI: mongodb+srv://admin:****@cluster.mongodb.net/users_db
✅ Connected to Users DB!
✅ Write test successful! Document ID: 65abc123...
✅ Read test successful! Message: Connection test successful
✅ Cleanup successful!
✅ Users DB connection test completed!

ℹ️  === Testing APP Database ===

ℹ️  Testing connection to: App DB...
ℹ️  URI: mongodb+srv://admin:****@cluster.mongodb.net/app_db
✅ Connected to App DB!
✅ Write test successful! Document ID: 65def456...
✅ Read test successful! Message: Connection test successful
✅ Cleanup successful!
✅ App DB connection test completed!

==========================================
✅ All database connections successful! 🎉
ℹ️  You can deploy to Render now!
==========================================
```

### Thất bại ❌

```
==========================================
  MongoDB Connection Test
==========================================

ℹ️  === Testing USERS Database ===

ℹ️  Testing connection to: Users DB...
ℹ️  URI: mongodb+srv://admin:****@cluster.mongodb.net/users_db
❌ Failed to connect to Users DB
❌ Error: Authentication failed
⚠️  Tip: Check username and password are correct

==========================================
❌ Some database connections failed! 😞
ℹ️  Please fix the issues above before deploying
==========================================
```

## 🔧 Common Errors & Solutions

### 1. Authentication Failed

```
❌ Error: Authentication failed
```

**Giải pháp**:
- Check username/password có đúng không
- Nếu password có ký tự đặc biệt, cần URL encode:
  ```
  Password: p@ssw0rd!
  Encoded:  p%40ssw0rd%21
  ```

### 2. Connection Timeout

```
❌ Error: connection timed out
```

**Giải pháp**:
- MongoDB Atlas: Check **Network Access** → Add IP `0.0.0.0/0`
- Check firewall/VPN có block port 27017 không

### 3. Host Not Found

```
❌ Error: ENOTFOUND cluster.xxxxx.mongodb.net
```

**Giải pháp**:
- Check connection string URL có đúng không
- Copy lại connection string từ MongoDB Atlas

### 4. No MongoDB URIs Found

```
❌ No MongoDB URIs found in environment variables!
```

**Giải pháp**:
- Tạo file `.env` với `MONGODB_URI_USER` và `MONGODB_URI_APP`
- Hoặc export environment variables:
  ```bash
  export MONGODB_URI_USER="mongodb+srv://..."
  export MONGODB_URI_APP="mongodb+srv://..."
  ```

## 💡 Tips

### Test với MongoDB Atlas mới

1. Tạo cluster trên MongoDB Atlas
2. Tạo database user
3. Whitelist IP: `0.0.0.0/0`
4. Copy connection string
5. Thay password trong connection string
6. Thêm database name vào cuối: `/users_db` hoặc `/app_db`
7. Run test script

### Test Local MongoDB

```bash
# .env
MONGODB_URI_USER=mongodb://localhost:27017/users_db
MONGODB_URI_APP=mongodb://localhost:27017/app_db
```

### Test với Docker MongoDB

```bash
# Start MongoDB với Docker
docker run -d -p 27017:27017 --name test-mongo mongo:7.0

# .env
MONGODB_URI_USER=mongodb://localhost:27017/users_db
MONGODB_URI_APP=mongodb://localhost:27017/app_db

# Run test
npm run test:db
```

## 🔐 Security Notes

- ⚠️ Không commit file `.env` vào Git
- ⚠️ Không share connection strings publicly
- ✅ Sử dụng strong passwords
- ✅ Rotate credentials thường xuyên
- ✅ Limit IP access khi có thể (production)

## 📝 Test trước khi Deploy

```bash
# 1. Test local
npm run test:db

# 2. Nếu thành công, copy connection strings
# 3. Paste vào Render Environment Variables
# 4. Deploy

# 5. Verify trên Render logs
```

## 🎯 Expected Output trên Render

Sau khi set environment variables đúng, check Render logs sẽ thấy:

```
[NestApplication] Nest application successfully started
Server running on port 3001
```

Không còn lỗi "Unable to connect to the database".

---

**Happy Testing! 🧪**


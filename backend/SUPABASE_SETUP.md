# Supabase Setup Guide

## 1. Tạo Supabase Project

1. Truy cập [supabase.com](https://supabase.com)
2. Tạo tài khoản và đăng nhập
3. Click "New Project"
4. Điền thông tin:
   - Name: `crm-nestjs-backend`
   - Database Password: Chọn mật khẩu mạnh
   - Region: Chọn region gần nhất (Asia Southeast - Singapore)

## 2. Cấu hình Database

Sau khi project được tạo, vào **Settings > Database**:

1. Copy **Connection string** (URI)
2. Chọn **Pooled connection** để có performance tốt hơn

## 3. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `backend`:

```env
# Database - Sử dụng Pooled connection từ Supabase
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_ACCESS_TOKEN_EXPIRED=3600s

# Supabase (optional - for Supabase Auth integration)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

> **Quan trọng**: Thay thế `[project-ref]`, `[password]`, `[region]` bằng thông tin thực từ Supabase dashboard.

## 4. Chạy Database Migration

```bash
# Cài đặt dependencies (nếu chưa có)
npm install

# Tạo và chạy migration
npx prisma migrate dev --name init

# Tạo Prisma Client
npx prisma generate
```

## 5. Kiểm tra kết nối

```bash
# Chạy server
npm run start:dev

# Test API
curl http://localhost:3001
```

## 6. Supabase Dashboard

Trong Supabase dashboard, bạn có thể:

- **Table Editor**: Xem và chỉnh sửa dữ liệu
- **SQL Editor**: Chạy queries trực tiếp
- **Authentication**: Cấu hình auth rules
- **Storage**: Upload files
- **Edge Functions**: Serverless functions

## 7. Cấu trúc Database

Sau khi migration, bạn sẽ có các bảng:

- `users` - Thông tin người dùng và phân quyền
- `customers` - Quản lý khách hàng
- `leads` - Quản lý lead
- `campaigns` - Chiến dịch marketing

## Troubleshooting

### Lỗi kết nối database:
- Kiểm tra `DATABASE_URL` có đúng không
- Đảm bảo project chưa bị pause (Supabase tự động pause sau 7 ngày không hoạt động)

### Lỗi migration:
- Xóa database và tạo lại nếu cần: `npx prisma migrate reset`

### Performance:
- Sử dụng **Pooled connection** thay vì Direct connection
- Cấu hình `connection_limit=1` cho serverless environments

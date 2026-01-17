# Hướng dẫn sử dụng Biến Môi Trường (Environment Variables)

## 📁 Vị trí file

Các file biến môi trường trong Next.js được đặt ở **root của thư mục frontend**:

```
frontend/
├── .env.local           # File chứa biến môi trường (không commit lên git)
├── .env.example         # File template (commit lên git)
├── .env.development     # Môi trường development (optional)
├── .env.production      # Môi trường production (optional)
└── src/
```

## 🔧 Setup ban đầu

1. Copy file `.env.example` thành `.env.local`:
```bash
cp .env.example .env.local
```

2. Chỉnh sửa `.env.local` với các giá trị phù hợp:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 Quy tắc đặt tên

### Biến public (có thể dùng ở client-side):
- **Phải** có prefix `NEXT_PUBLIC_`
- Ví dụ: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_NAME`
- Có thể truy cập từ components, pages

### Biến private (chỉ dùng ở server-side):
- **Không** có prefix `NEXT_PUBLIC_`
- Ví dụ: `DATABASE_URL`, `SECRET_KEY`
- Chỉ có thể truy cập trong API routes, getServerSideProps, getStaticProps

## 💻 Cách sử dụng trong code

### Trong Components/Pages (Client-side):
```typescript
// ✅ Đúng - sử dụng biến có prefix NEXT_PUBLIC_
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log(apiUrl); // http://localhost:3001

// ❌ Sai - biến không có prefix sẽ là undefined
const secret = process.env.SECRET_KEY; // undefined
```

### Trong API Routes (Server-side):
```typescript
// ✅ Đúng - có thể dùng cả 2 loại biến
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const secret = process.env.SECRET_KEY;
```

## 🌍 Các loại file môi trường

| File | Mô tả | Commit lên Git? |
|------|-------|----------------|
| `.env` | Biến chung cho tất cả môi trường | ❌ Không |
| `.env.local` | Biến local, override tất cả (trừ test) | ❌ Không |
| `.env.development` | Biến cho development mode | ✅ Có thể |
| `.env.production` | Biến cho production build | ✅ Có thể |
| `.env.test` | Biến cho test mode | ✅ Có thể |
| `.env.example` | Template cho developers | ✅ Có |

## 📊 Thứ tự ưu tiên (cao xuống thấp)

1. `.env.local` (luôn được ưu tiên)
2. `.env.development` / `.env.production` / `.env.test` (tùy NODE_ENV)
3. `.env`

## 🔄 Restart server sau khi thay đổi

**Quan trọng:** Sau khi thay đổi biến môi trường, **PHẢI restart development server**:

```bash
# Ctrl + C để stop
# Sau đó chạy lại:
npm run dev
```

## 📖 Ví dụ thực tế

### File `.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_TIMEOUT=5000

# App Configuration
NEXT_PUBLIC_APP_NAME=My Awesome App
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true

# Private Keys (chỉ dùng server-side)
DATABASE_URL=postgresql://localhost:5432/mydb
JWT_SECRET=super-secret-key-dont-expose
```

### Sử dụng trong code:
```typescript
// pages/api/users.ts
export default async function handler(req, res) {
  // ✅ Server-side: có thể dùng cả 2 loại
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const dbUrl = process.env.DATABASE_URL;
  
  // ... logic
}

// components/Header.tsx
export default function Header() {
  // ✅ Client-side: chỉ dùng NEXT_PUBLIC_*
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  
  return <h1>{appName}</h1>;
}
```

## 🚀 Deployment

### Vercel:
1. Vào project settings
2. Thêm biến môi trường trong tab "Environment Variables"
3. Redeploy

### Netlify:
1. Site settings → Build & deploy → Environment
2. Thêm biến môi trường
3. Trigger new deploy

### Docker:
```dockerfile
# Dockerfile
ENV NEXT_PUBLIC_API_URL=https://api.example.com
```

Hoặc dùng docker-compose:
```yaml
# docker-compose.yml
services:
  frontend:
    environment:
      - NEXT_PUBLIC_API_URL=https://api.example.com
```

## ⚠️ Lưu ý bảo mật

1. **KHÔNG BAO GIỜ** commit file `.env.local` lên git
2. **KHÔNG** lưu API keys, secrets vào biến `NEXT_PUBLIC_*`
3. Luôn thêm `.env*.local` vào `.gitignore`
4. Sử dụng `.env.example` để chia sẻ cấu trúc (không chứa giá trị thật)

## 🔗 Tài liệu tham khảo

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Environment Variables Best Practices](https://12factor.net/config)



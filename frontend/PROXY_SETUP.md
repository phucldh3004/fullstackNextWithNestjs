# Next.js 16 API Proxy Setup

Hướng dẫn setup proxy/middleware cho Next.js 16 frontend kết nối với NestJS backend.

## 🎯 Architecture

```
Browser → Next.js (localhost:3000) → Proxy → NestJS Backend (localhost:3001)
```

Có 2 cách chính:

---

## 1️⃣ Dùng Rewrites (Khuyến nghị) ⭐

**File**: `next.config.ts`

### Cách hoạt động:
- Browser gọi: `/api/users`
- Next.js proxy tới: `http://localhost:3001/users`
- Không có CORS issues vì same-origin

### Setup:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
    ];
  },
};
```

### Sử dụng trong code:

```typescript
// ✅ Good - Dùng relative path (sẽ được proxy)
const response = await fetch('/api/users');

// ❌ Avoid - Direct backend call (CORS issues)
const response = await fetch('http://localhost:3001/users');
```

### Environment Variables:

```bash
# .env.local (Development)
NEXT_PUBLIC_API_URL=http://localhost:3001

# .env.production (Production)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## 2️⃣ Dùng Middleware

**File**: `src/middleware.ts`

### Cách hoạt động:
- Intercept requests trước khi đến page
- Có thể modify request/response
- Chạy trên Edge Runtime (fast!)

### Use cases:
- ✅ Authentication/Authorization
- ✅ Request logging
- ✅ Bot protection
- ✅ A/B testing
- ✅ Feature flags
- ✅ Redirects

### Example:

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check authentication
  const token = request.cookies.get('token');
  
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
```

---

## 🔧 API Helper (Recommended)

Tạo centralized API client:

**File**: `src/lib/api.ts`

```typescript
export const api = {
  get: (endpoint: string) => 
    fetch(`/api${endpoint}`).then(r => r.json()),
  
  post: (endpoint: string, data: unknown) =>
    fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
};

// Usage
const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'John' });
```

---

## 📋 So sánh Rewrites vs Middleware

| Feature | Rewrites | Middleware |
|---------|----------|------------|
| **Proxy API** | ✅ Perfect | ⚠️ Có thể nhưng phức tạp |
| **Auth Protection** | ❌ Không | ✅ Perfect |
| **CORS Bypass** | ✅ Tự động | ❌ Cần config thêm |
| **Performance** | ⚡ Fast | ⚡⚡ Faster (Edge) |
| **Use Case** | API proxying | Auth, redirects, logging |
| **Complexity** | 🟢 Đơn giản | 🟡 Trung bình |

---

## 🚀 Setup Instructions

### Bước 1: Cấu hình next.config.ts

```bash
# File đã được update với rewrites
# Check: frontend/next.config.ts
```

### Bước 2: Tạo .env.local

```bash
cd frontend
cp .env.local.example .env.local
```

Edit `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Bước 3: Sử dụng API Helper

```typescript
// app/users/page.tsx
import { apiHelpers } from '@/lib/api';

export default async function UsersPage() {
  const users = await apiHelpers.users.getAll();
  
  return (
    <div>
      {users.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  );
}
```

### Bước 4: Start servers

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Bước 5: Test

```bash
# Frontend: http://localhost:3000
# API call: /api/users → proxied to → http://localhost:3001/users
```

---

## 🎯 Production Deployment

### Option A: Same Domain (với Rewrites)

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : 'http://localhost:3001/:path*',
      },
    ];
  },
};
```

**Environment**:
```bash
# Vercel/Netlify
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Option B: Different Domains (Direct)

Update API client:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Calls will go directly to backend
fetch(`${API_URL}/users`)
```

**Environment**:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

⚠️ **Lưu ý**: Cần config CORS trên backend!

```typescript
// backend/src/main.ts
app.enableCors({
  origin: 'https://your-frontend.vercel.app',
  credentials: true,
});
```

---

## 🧪 Testing Proxy

### Test trong Browser Console:

```javascript
// Should work without CORS errors
fetch('/api/users')
  .then(r => r.json())
  .then(console.log);
```

### Test với curl:

```bash
# Direct backend (có thể có CORS)
curl http://localhost:3001/users

# Qua Next.js proxy (no CORS)
curl http://localhost:3000/api/users
```

---

## 🔐 Advanced: Auth with Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Public routes
  const publicPaths = ['/login', '/register', '/'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add token to API requests
  if (pathname.startsWith('/api')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${token.value}`);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 📚 Resources

- [Next.js Rewrites](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## 🎉 Summary

**Khuyến nghị**:
- 🥇 **Rewrites**: Cho API proxying
- 🥈 **Middleware**: Cho authentication
- 🥉 **API Helper**: Cho code organization

**Setup hiện tại đã include**:
- ✅ Rewrites in `next.config.ts`
- ✅ Middleware template in `src/middleware.ts`
- ✅ API helper in `src/lib/api.ts`
- ✅ Environment variables example

Start developing! 🚀


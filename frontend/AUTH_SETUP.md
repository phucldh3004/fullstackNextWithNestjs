# Cookie-Based Authentication Setup

## 🎯 Overview

Authentication flow sử dụng **HTTP-only cookies** để lưu trữ access token một cách bảo mật.

## 🏗️ Architecture

```
┌─────────────┐     Login      ┌──────────────┐      Auth      ┌─────────────┐
│   Browser   │ ──────────────> │  Next.js API │ ────────────> │   NestJS    │
│             │                 │    Routes    │               │   Backend   │
│             │ <────────────── │              │ <──────────── │             │
└─────────────┘   Set Cookie    └──────────────┘  Access Token └─────────────┘
       │
       │ Visit any page
       ↓
┌─────────────┐
│ Middleware  │ ─────> Check cookie ─────> Redirect to /login if not found
└─────────────┘
```

## 📁 File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── login/route.ts      # Login endpoint (sets cookie)
│   │   │       ├── logout/route.ts     # Logout endpoint (clears cookie)
│   │   │       ├── register/route.ts   # Register endpoint
│   │   │       └── check/route.ts      # Check auth status
│   │   ├── login/
│   │   │   └── page.tsx               # Login page (updated)
│   │   └── page.tsx                   # Home page (protected)
│   ├── components/
│   │   └── LogoutButton.tsx           # Logout component
│   ├── lib/
│   │   └── auth.ts                    # Auth helper functions
│   └── middleware.ts                  # Authentication guard
```

## 🔑 Key Features

### 1. **HTTP-Only Cookies** 🔒
```typescript
// Set cookie from server-side
cookieStore.set('access_token', token, {
  httpOnly: true,      // Cannot access via JavaScript (XSS protection)
  secure: true,        // Only HTTPS in production
  sameSite: 'lax',     // CSRF protection
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: '/',
});
```

### 2. **Middleware Authentication Guard** 🛡️
```typescript
// Automatically checks every request
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  
  if (!token && !isPublicRoute(pathname)) {
    return NextResponse.redirect('/login');
  }
}
```

### 3. **Auto-Redirect** 🔄
```typescript
// Saves where user wanted to go
const redirectTo = searchParams.get('redirect') || '/';
router.push(redirectTo);
```

## 🚀 How It Works

### Login Flow:

1. **User submits login form**
   ```typescript
   // frontend/src/app/login/page.tsx
   const response = await fetch('/api/auth/login', {
     method: 'POST',
     body: JSON.stringify({ username, password })
   });
   ```

2. **Next.js API route calls backend**
   ```typescript
   // frontend/src/app/api/auth/login/route.ts
   const backendResponse = await fetch(`${BACKEND_URL}/auth/login`, {
     method: 'POST',
     body: JSON.stringify({ username, password })
   });
   ```

3. **Backend returns access_token**
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

4. **Next.js sets HTTP-only cookie**
   ```typescript
   cookieStore.set('access_token', access_token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
     // ... other options
   });
   ```

5. **User is redirected to dashboard**
   ```typescript
   router.push(redirectTo);
   ```

### Protected Route Access:

1. **User visits any page** (e.g., `/dashboard`)

2. **Middleware intercepts request**
   ```typescript
   // src/middleware.ts
   const token = request.cookies.get('access_token');
   ```

3. **If no token → Redirect to login**
   ```typescript
   if (!token) {
     const loginUrl = new URL('/login', request.url);
     loginUrl.searchParams.set('redirect', pathname);
     return NextResponse.redirect(loginUrl);
   }
   ```

4. **If has token → Allow access**
   ```typescript
   return NextResponse.next();
   ```

### Logout Flow:

1. **User clicks logout button**
   ```typescript
   // src/components/LogoutButton.tsx
   await fetch('/api/auth/logout', { method: 'POST' });
   ```

2. **API route deletes cookie**
   ```typescript
   // src/app/api/auth/logout/route.ts
   cookieStore.delete('access_token');
   ```

3. **User is redirected to login**
   ```typescript
   router.push('/login');
   ```

## 🔧 Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Public Routes

Update in `middleware.ts`:

```typescript
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth/login',
  '/api/auth/register',
];
```

## 📋 API Routes

### POST `/api/auth/login`
**Request:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful"
}
```

**Side Effect:** Sets `access_token` cookie

---

### POST `/api/auth/logout`
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Side Effect:** Deletes `access_token` cookie

---

### POST `/api/auth/register`
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": { ... }
}
```

**Side Effect:** Auto-login, sets `access_token` cookie

---

### GET `/api/auth/check`
**Response:**
```json
{
  "authenticated": true
}
```

## 🛠️ Helper Functions

### Server-Side (use in Server Components)

```typescript
import { isAuthenticated, getAccessToken } from '@/lib/auth';

// Check if user is authenticated
const authed = await isAuthenticated();

// Get access token
const token = await getAccessToken();
```

### Client-Side (use in Client Components)

```typescript
import { login, logout, checkAuthClient } from '@/lib/auth';

// Login
await login(username, password);

// Logout
await logout();

// Check auth status
const isAuthed = await checkAuthClient();
```

## 🔐 Security Benefits

| Feature | Benefit |
|---------|---------|
| **HTTP-Only Cookie** | Cannot be accessed via JavaScript → XSS protection |
| **Secure Flag** | Only transmitted over HTTPS in production |
| **SameSite=Lax** | CSRF protection |
| **Server-Side** | Token never exposed to client-side code |
| **Auto-Expire** | Cookie expires after 7 days |
| **Middleware Guard** | Automatic protection for all routes |

## 🆚 Comparison: Cookie vs LocalStorage

| Feature | Cookie (✅ Current) | LocalStorage (❌ Old) |
|---------|---------------------|----------------------|
| **XSS Protection** | ✅ Protected (HTTP-only) | ❌ Vulnerable |
| **CSRF Protection** | ✅ SameSite flag | ⚠️ Need extra work |
| **Auto-Send** | ✅ Sent automatically | ❌ Manual header |
| **Server Access** | ✅ Available | ❌ Client-only |
| **Expires** | ✅ Auto-expire | ❌ Never expires |
| **Security** | 🟢 High | 🔴 Low |

## 🧪 Testing

### Test Login:
```bash
# Start backend
cd backend
npm run start:dev

# Start frontend
cd frontend
npm run dev

# Visit http://localhost:3000
# Should redirect to /login
# Login with credentials
# Should redirect back to home
```

### Test Protection:
```bash
# Clear cookies in browser
# Visit http://localhost:3000/dashboard
# Should redirect to /login with ?redirect=/dashboard
```

### Test Logout:
```bash
# Click logout button
# Should redirect to /login
# Try to access protected route
# Should redirect to /login
```

## 📱 Usage Examples

### Update Register Page

```typescript
// src/app/register/page.tsx
import { register } from '@/lib/auth';

const handleRegister = async () => {
  try {
    await register({
      name,
      email,
      password,
      phone
    });
    
    // Auto-logged in, redirect to home
    router.push('/');
  } catch (error) {
    setError(error.message);
  }
};
```

### Protected Server Component

```typescript
// src/app/dashboard/page.tsx
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // Double-check auth (middleware already checked)
  const authed = await isAuthenticated();
  
  if (!authed) {
    redirect('/login');
  }

  return <div>Protected Dashboard</div>;
}
```

### API Call with Token

```typescript
// src/lib/api.ts
export async function fetchProtectedData() {
  // Cookie is automatically sent with fetch
  const response = await fetch('/api/users');
  return response.json();
}
```

## 🔄 Migration from LocalStorage

If you have existing code using localStorage:

**Before:**
```typescript
// ❌ Old way
localStorage.setItem('access_token', token);
const token = localStorage.getItem('access_token');
```

**After:**
```typescript
// ✅ New way
// Token is set automatically by API route
await fetch('/api/auth/login', { ... });

// Token is sent automatically with requests
// No need to manually add headers
```

## 🚨 Troubleshooting

### Cookie not being set?
- Check browser console for errors
- Verify `httpOnly`, `secure`, `sameSite` settings
- In development, `secure: false` is okay

### Redirect loop?
- Check middleware `PUBLIC_ROUTES` includes `/login`
- Verify cookie name matches: `access_token`

### Token not being sent to backend?
- Use Next.js proxy (rewrites in `next.config.ts`)
- Or manually add cookie to backend requests:
  ```typescript
  const token = await getAccessToken();
  headers: { 'Authorization': `Bearer ${token}` }
  ```

## ✨ Summary

✅ **Implemented:**
- HTTP-only cookie storage
- Automatic authentication check on every route
- Redirect to login if not authenticated
- Secure token handling
- Auto-redirect back after login

✅ **Security:**
- XSS protection
- CSRF protection
- No token exposure to client
- Auto-expire cookies

✅ **User Experience:**
- Seamless redirects
- Remember where user wanted to go
- Auto-login after registration

---

**All set! Your authentication is now production-ready! 🎉**


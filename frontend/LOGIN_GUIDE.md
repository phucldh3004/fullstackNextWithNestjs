# 🔐 Hướng Dẫn Sử Dụng Màn Hình Login

## 📌 Tổng Quan
Màn hình login đẹp và responsive cho cả mobile và desktop, được xây dựng với Next.js 16 và Tailwind CSS 4.

## 🚀 Cách Sử Dụng

### 1. Truy cập màn hình login
```
http://localhost:3000/login
```

### 2. Nhập thông tin đăng nhập
- **Tên đăng nhập**: Nhập username của bạn
- **Mật khẩu**: Nhập password của bạn

### 3. Đăng nhập
- Click nút **"Đăng nhập"** màu gradient tím-hồng
- Hệ thống sẽ gọi API: `POST http://localhost:3001/auth/login`
- Nếu thành công, access token sẽ được lưu vào localStorage và chuyển hướng về trang chủ

## 🎨 Tính Năng

### ✨ Design Đẹp Mắt
- Gradient background động với hiệu ứng blob animation
- Card login với backdrop blur và shadow đẹp
- Icon và màu sắc chuyên nghiệp
- Hover effects và smooth transitions

### 📱 Responsive Design
- **Mobile**: Tối ưu cho màn hình nhỏ
- **Desktop**: Layout rộng rãi và đẹp mắt
- Tự động điều chỉnh padding và font size

### 🔄 Loading State
- Hiển thị spinner khi đang đăng nhập
- Disable button khi đang xử lý
- Prevent double submission

### ❌ Error Handling
- Hiển thị thông báo lỗi với animation shake
- Style đỏ để dễ nhận biết
- Clear error khi submit lại

### 🎯 Form Validation
- Required fields (username và password)
- HTML5 validation
- Clear input với icon đẹp

## 🔧 Cấu Hình

### Backend API
- **URL**: `http://localhost:3001/auth/login`
- **Method**: POST
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "jwt_token_here"
  }
  ```

### CORS Configuration
Backend đã được cấu hình CORS để accept requests từ `http://localhost:3000`

## 📦 Dependencies
- Next.js 16.1.1
- React 19.2.3
- Tailwind CSS 4
- TypeScript 5

## 🎨 Màu Sắc
- **Primary**: Purple (#9333EA)
- **Secondary**: Pink (#EC4899)
- **Gradient**: Purple → Pink
- **Background**: White với backdrop blur
- **Error**: Red (#EF4444)

## 🚦 Trạng Thái

### Success (200 OK)
- Lưu access_token vào localStorage
- Redirect về trang home (/)

### Error (400, 401, etc)
- Hiển thị error message từ server
- Shake animation để thu hút attention
- User có thể thử lại

## 💡 Tips
- Sử dụng "Remember me" để ghi nhớ đăng nhập
- Click "Quên mật khẩu?" nếu cần reset
- Có thể đăng ký tài khoản mới qua link "Đăng ký ngay"

## 🔐 Security
- Password field type="password" (hidden)
- HTTPS recommended cho production
- JWT token được lưu trong localStorage
- Credentials được gửi qua POST request body

## 🎬 Demo Features
- Google login button (UI only)
- Facebook login button (UI only)
- Remember me checkbox
- Forgot password link
- Sign up link

---

**Enjoy your beautiful login page! 🎉**


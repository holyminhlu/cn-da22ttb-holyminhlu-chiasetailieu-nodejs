# Admin API Architecture

## 🎯 Tại sao tách Admin API riêng?

### 1. **Separation of Concerns (Tách biệt trách nhiệm)**
- **Auth routes** (`/api/auth/*`): Chỉ xử lý authentication & authorization cơ bản
  - Đăng ký, đăng nhập
  - Quản lý profile cá nhân
  - Upload avatar/cover
  
- **Admin routes** (`/api/admin/*`): Xử lý quản trị hệ thống
  - Quản lý users
  - Quản lý nội dung
  - Thống kê, báo cáo

### 2. **Security & Authorization**
- Admin routes yêu cầu **2 lớp bảo vệ**:
  1. JWT Authentication (`authenticateToken`)
  2. Role-based Authorization (`checkRole(['admin'])`)
  
- Auth routes chỉ cần authentication cơ bản hoặc public

### 3. **Scalability (Khả năng mở rộng)**
- Dễ dàng tách admin service thành microservice riêng sau này
- Có thể scale admin API độc lập với auth API
- Dễ dàng thêm rate limiting, caching riêng cho admin

### 4. **Code Organization**
- Code rõ ràng, dễ maintain
- Mỗi module có trách nhiệm riêng
- Dễ test và debug

## 📁 Cấu trúc Files

```
server/auth-service/
├── routes/
│   ├── authRoute.js      # Public auth routes
│   └── adminRoute.js     # Admin routes (JWT + Admin role)
├── controllers/
│   ├── authController.js # Auth logic
│   └── adminController.js # Admin logic
└── middleware/
    └── authMiddleware.js # JWT + Role checking
```

## 🔌 API Endpoints

### Admin Endpoints (Protected)
- `GET /api/admin/users` - Lấy danh sách users
- `GET /api/admin/users/:id` - Lấy user theo ID
- `PUT /api/admin/users/:id` - Cập nhật user
- `DELETE /api/admin/users/:id` - Xóa user

### Auth Endpoints (Public/Protected)
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/customer` - Lấy thông tin user
- `POST /api/auth/profile/avatar` - Upload avatar

## 🔐 Security Flow

```
Frontend Request
    ↓
API Gateway (/api/admin/users)
    ↓
Admin Proxy (forward to auth-service)
    ↓
Auth Service (/admin/users)
    ↓
authenticateToken middleware (verify JWT)
    ↓
checkRole(['admin']) middleware (verify role)
    ↓
adminController.getAllUsers
    ↓
Response
```

## 🚀 Deployment Notes

1. **Restart Auth Service** sau khi thêm admin routes
2. **Restart API Gateway** sau khi thêm admin proxy
3. **Test với JWT token** có role = 'admin'

## 📝 Best Practices

1. ✅ Tách biệt routes theo chức năng
2. ✅ Sử dụng middleware cho authentication/authorization
3. ✅ Không expose password trong response
4. ✅ Logging đầy đủ cho debugging
5. ✅ Error handling chuẩn


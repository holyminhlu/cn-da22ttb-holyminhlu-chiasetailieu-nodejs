# 🔒 Chức năng Khóa/Mở khóa Tài khoản

## 📋 Tổng quan

Admin có thể khóa/mở khóa tài khoản người dùng để quản lý truy cập hệ thống.

## 🎯 Cách hoạt động

### 1. **Trong Admin Dashboard**

- Vào trang **Admin → Tài khoản người dùng**
- Mỗi user có cột **Trạng thái** hiển thị:
  - 🟢 **Hoạt động** (nếu `is_active = true`)
  - 🔴 **Khóa** (nếu `is_active = false`)
- Nút **"Khóa"** hoặc **"Mở khóa"** ở cột Thao tác

### 2. **Khi Admin khóa tài khoản**

1. Click nút **"Khóa"** → Xác nhận
2. Frontend gọi API: `PUT /api/admin/users/:id` với `{ is_active: false }`
3. Backend cập nhật `is_active = false` trong database
4. User bị khóa không thể đăng nhập

### 3. **Khi User bị khóa cố đăng nhập**

- Middleware `authenticateToken` kiểm tra `is_active`
- Nếu `is_active = false` → Trả về lỗi 403:
  ```json
  {
    "success": false,
    "message": "Tài khoản đã bị khóa!"
  }
  ```

### 4. **Khi Admin mở khóa**

1. Click nút **"Mở khóa"** → Xác nhận
2. Frontend gọi API: `PUT /api/admin/users/:id` với `{ is_active: true }`
3. Backend cập nhật `is_active = true`
4. User có thể đăng nhập lại bình thường

## 🔐 Security

- **Chỉ Admin** mới có quyền khóa/mở khóa (qua middleware `checkRole(['admin'])`)
- **JWT Authentication** bắt buộc
- **Không thể khóa chính mình** (có thể thêm validation sau)

## 📊 Database Schema

```javascript
{
  is_active: {
    type: Boolean,
    default: true
  }
}
```

## 🛠️ API Endpoint

```
PUT /api/admin/users/:id
Body: {
  is_active: true | false
}
```

## ✅ Kết quả

- User bị khóa → Không thể đăng nhập
- User được mở khóa → Có thể đăng nhập lại
- Trạng thái hiển thị rõ ràng trong admin dashboard


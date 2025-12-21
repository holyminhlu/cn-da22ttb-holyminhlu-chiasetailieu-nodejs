# Auth Service Scripts

## Tạo Admin User

Script này tạo một tài khoản admin trong MongoDB database `EduShareDB`.

### Cách chạy:

#### 1. Sử dụng credentials mặc định:

```bash
# Từ thư mục auth-service
npm run create-admin

# Hoặc chạy trực tiếp
node scripts/create-admin-user.js
```

**Credentials mặc định:**
- Email: `admin@olf.edu.vn`
- Password: `admin123456`
- Full Name: `Admin OLF`

#### 2. Tùy chỉnh credentials:

```bash
node scripts/create-admin-user.js --email your-email@example.com --password yourpassword --name "Your Name"
```

**Ví dụ:**
```bash
node scripts/create-admin-user.js --email admin@mycompany.com --password SecurePass123 --name "System Administrator"
```

### Thông tin:

- **Database:** `EduShareDB`
- **Collection:** `UserCollection`
- **Connection:** `mongodb://127.0.0.1:27017/EduShareDB`

### Tính năng:

- ✅ Tự động hash password với bcrypt
- ✅ Kiểm tra email đã tồn tại chưa
- ✅ Kiểm tra đã có admin user chưa
- ✅ Tự động set `is_verified: true` và `is_active: true`
- ✅ Tạo `user_id` unique tự động

### Lưu ý:

1. **Bảo mật:** Lưu credentials một cách an toàn sau khi tạo
2. **Email unique:** Mỗi email chỉ có thể đăng ký một lần
3. **Password:** Phải có ít nhất 6 ký tự
4. **Existing admin:** Nếu đã có admin user, script sẽ thông báo và không tạo mới

### Sau khi tạo:

Bạn có thể đăng nhập với tài khoản admin vừa tạo:
- Sử dụng API: `POST /api/auth/login`
- Hoặc đăng nhập qua frontend

### Troubleshooting:

**Lỗi: Email already exists**
- Email đã được sử dụng, hãy chọn email khác hoặc cập nhật user hiện có

**Lỗi: Cannot connect to MongoDB**
- Kiểm tra MongoDB đã chạy chưa: `mongod` hoặc MongoDB service
- Kiểm tra connection string trong script

**Lỗi: Password too short**
- Password phải có ít nhất 6 ký tự


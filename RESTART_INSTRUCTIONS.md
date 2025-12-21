# 🔄 HƯỚNG DẪN RESTART SERVICES

## ⚠️ QUAN TRỌNG: Phải restart cả 2 services sau khi thêm Admin API

### 1. Restart API Gateway

```bash
cd server/api-gateway
# Dừng service hiện tại (Ctrl+C)
node src/index.js
```

**Kiểm tra log khi start:**
- Phải thấy: `API Gateway chạy tại http://localhost:3000`
- Không có lỗi khi load `adminProxy`

### 2. Restart Auth Service

```bash
cd server/auth-service
# Dừng service hiện tại (Ctrl+C)
node index.js
```

**Kiểm tra log khi start:**
- Phải thấy: `✅ Auth-Service đang lắng nghe tại http://localhost:3001`
- Phải thấy: `🔐 Admin Endpoints (JWT + Admin role required):`
- Phải thấy: `   - Get Users: GET http://localhost:3001/admin/users`

### 3. Test Admin API

Sau khi restart cả 2 services, test:

```bash
# 1. Login để lấy JWT token
POST http://localhost:8080/api/auth/login
{
  "email": "admin@olf.edu.vn",
  "passWord": "admin123456"
}

# 2. Gọi admin API với token
GET http://localhost:8080/api/admin/users
Headers: {
  "Authorization": "Bearer <JWT_TOKEN_FROM_STEP_1>"
}
```

### 4. Kiểm tra Logs

**API Gateway log phải có:**
```
🔐 ========== ADMIN ROUTE MATCHED ==========
Path: /admin/users
Routing to adminProxy...
🔐 ========== ADMIN PROXY REQUEST ==========
Request URL (after rewrite): /admin/users
Target: http://localhost:3001/admin/users
```

**Auth Service log phải có:**
```
🎯 Admin Route hit: GET /admin/users
Method: GET, Path: /users
```

### ❌ Nếu vẫn lỗi 404

1. **Kiểm tra API Gateway có load adminProxy không:**
   - Xem log khi start API Gateway
   - Phải không có lỗi `Cannot find module './adminProxy'`

2. **Kiểm tra Auth Service có load adminRoute không:**
   - Xem log khi start Auth Service
   - Phải thấy admin endpoints được list ra

3. **Kiểm tra thứ tự routes:**
   - Admin route phải đứng TRƯỚC auth route trong `proxyRoutes.js`
   - Đã được sửa: admin route ở dòng 24-31, auth route ở dòng 33-36

4. **Clear cache và restart lại:**
   ```bash
   # Dừng tất cả services
   # Xóa node_modules/.cache nếu có
   # Restart lại từ đầu
   ```


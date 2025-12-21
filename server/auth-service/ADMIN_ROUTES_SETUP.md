# Admin Routes Setup

## Routes đã được thêm

Các routes sau đã được thêm vào auth service:

- `GET /users` - Lấy danh sách tất cả users (admin only)
- `PUT /users/:id` - Cập nhật user (admin only)
- `DELETE /users/:id` - Xóa user (admin only)

## Controllers

Các controllers đã được thêm vào `controllers/authController.js`:

- `exports.getAllUsers` - Lấy danh sách users với pagination và search
- `exports.updateUser` - Cập nhật thông tin user
- `exports.deleteUser` - Xóa user

## Cách sử dụng

### 1. Restart Auth Service

**QUAN TRỌNG**: Sau khi thêm routes mới, bạn **PHẢI** restart auth service:

```bash
cd server/auth-service
# Dừng service hiện tại (Ctrl+C)
# Sau đó start lại:
node index.js
```

### 2. Kiểm tra routes đã được load

Khi start auth service, bạn sẽ thấy log:

```
✅ Controllers loaded successfully
   - getAllUsers: function
   - updateUser: function
   - deleteUser: function
🔍 Checking admin controllers...
✅ Registering GET /users route
✅ Registering PUT /users/:id route
✅ Registering DELETE /users/:id route
```

Nếu không thấy các log này, có nghĩa là controllers chưa được load đúng.

### 3. Test endpoints

Sau khi restart, test các endpoints:

```bash
# Test trực tiếp trên auth service
GET http://localhost:3001/users

# Test qua API Gateway
GET http://localhost:8080/api/auth/users
```

## Lưu ý

- Routes này nên được bảo vệ bằng admin middleware trong production
- Hiện tại routes chưa có authentication middleware, cần thêm sau
- Routes được mount tại root (`/`) trong auth service, nên URL đầy đủ là `/users`


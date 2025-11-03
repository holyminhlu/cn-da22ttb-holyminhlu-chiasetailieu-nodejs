# 🔍 Debug Lỗi Đăng Ký - "Có lỗi xảy ra khi đăng ký"

## ⚡ Các Bước Kiểm Tra Nhanh

### **Bước 1: Kiểm Tra MongoDB Đã Chạy**

```bash
# Windows
net start MongoDB

# Hoặc test connection
mongosh mongodb://127.0.0.1:27017
```

Nếu không kết nối được → MongoDB chưa chạy → Khởi động MongoDB trước!

---

### **Bước 2: Test Connection Script**

```bash
cd server/auth-service
node test-connection.js
```

**Kết quả mong đợi:**
```
✅ MongoDB Connected Successfully!
✅ Database: EduShareDB
✅ Host: 127.0.0.1:27017
```

**Nếu lỗi:** Xem message và fix theo hướng dẫn

---

### **Bước 3: Xem Console Log Chi Tiết**

Khi đăng ký, **mở terminal chạy auth-service** và xem log:

```bash
cd server/auth-service
npm start
```

**Khi có lỗi, bạn sẽ thấy:**
```
Lỗi đăng ký: {error object}
Error name: ValidationError | MongoServerError | ...
Error message: {chi tiết}
Error stack: {stack trace}
```

**Copy toàn bộ error này** để biết nguyên nhân chính xác!

---

### **Bước 4: Kiểm Tra Dependencies**

```bash
cd server/auth-service
npm list uuid
```

**Nếu không có uuid:**
```bash
npm install uuid
```

---

## 🎯 Nguyên Nhân Thường Gặp

### **1. MongoDB Chưa Chạy (90% trường hợp)**

**Lỗi:**
- "MongoNetworkError: connect ECONNREFUSED"
- "Cannot connect to MongoDB"

**Fix:**
```bash
# Windows
net start MongoDB

# Sau đó restart auth-service
npm start
```

---

### **2. Package UUID Chưa Cài**

**Lỗi:**
- "Cannot find module 'uuid'"
- "MODULE_NOT_FOUND"

**Fix:**
```bash
cd server/auth-service
npm install uuid
```

---

### **3. Email Đã Tồn Tại**

**Lỗi:**
- "E11000 duplicate key error"
- Code 11000

**Fix:**
- Dùng email khác
- Hoặc xóa user cũ:
```bash
mongosh mongodb://127.0.0.1:27017
use EduShareDB
db.UserCollection.deleteOne({ email: "email@example.com" })
```

---

### **4. Dữ Liệu Không Hợp Lệ**

**Lỗi:**
- "ValidationError"
- "Email không hợp lệ"
- "Mật khẩu phải có ít nhất 6 ký tự"

**Kiểm tra request body:**
```json
{
  "fullName": "Test User",        // Không được trống
  "email": "test@example.com",   // Phải có @ và .
  "passWord": "password123"       // >= 6 ký tự
}
```

---

## 📋 Checklist Debug

Chạy lần lượt:

```bash
# 1. MongoDB đang chạy?
mongosh mongodb://127.0.0.1:27017

# 2. Test connection
cd server/auth-service
node test-connection.js

# 3. Packages đã cài?
npm list uuid
npm list bcrypt
npm list mongoose

# 4. Restart service
npm start

# 5. Test đăng ký với cURL
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com","passWord":"password123"}'
```

---

## 🔧 Quick Fix Commands

```bash
# 1. Cài tất cả dependencies
cd server/auth-service
npm install

# 2. Khởi động MongoDB
net start MongoDB

# 3. Test connection
node test-connection.js

# 4. Start service với debug mode
set NODE_ENV=development
npm start
```

---

## 📞 Cần Thêm Thông Tin?

**Nếu vẫn lỗi, cung cấp:**

1. **Error message đầy đủ** từ console (copy toàn bộ)
2. **Request body** bạn đang gửi
3. **Kết quả** của `node test-connection.js`
4. **MongoDB status** (đang chạy hay không)

**Xem thêm:** `server/auth-service/TROUBLESHOOTING.md`





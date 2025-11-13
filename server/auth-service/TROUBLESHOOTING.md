# 🔧 Troubleshooting - Lỗi Đăng Ký

## ⚠️ Lỗi: "Có lỗi xảy ra khi đăng ký"

### **Các Nguyên Nhân Thường Gặp:**

---

## 🔴 1. MongoDB Chưa Chạy

**Triệu chứng:**
- Lỗi connection timeout
- "Cannot connect to MongoDB"

**Giải pháp:**
```bash
# Windows
net start MongoDB

# Kiểm tra MongoDB đang chạy
mongosh mongodb://127.0.0.1:27017
```

**Hoặc khởi động MongoDB thủ công:**
```bash
# Windows
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe" --dbpath="C:\data\db"

# macOS/Linux
mongod --dbpath /data/db
```

---

## 🔴 2. Package UUID Chưa Cài Đặt

**Triệu chứng:**
- "Cannot find module 'uuid'"
- "MODULE_NOT_FOUND"

**Giải pháp:**
```bash
cd server/auth-service
npm install uuid
```

**Hoặc:**
```bash
cd server/auth-service
npm install
```

---

## 🔴 3. Email Đã Tồn Tại

**Triệu chứng:**
- Lỗi 11000 (duplicate key)
- "Email đã được sử dụng"

**Giải pháp:**
- Dùng email khác
- Hoặc xóa user cũ trong MongoDB:
```javascript
use EduShareDB
db.UserCollection.deleteOne({ email: "email@example.com" })
```

---

## 🔴 4. Dữ Liệu Không Hợp Lệ

**Triệu chứng:**
- ValidationError
- "Email không hợp lệ"
- "Mật khẩu phải có ít nhất 6 ký tự"

**Kiểm tra:**
- Email phải đúng format (có @ và .)
- Password >= 6 ký tự
- fullName không được trống

---

## 🔴 5. Port 27017 Đã Bị Chiếm

**Triệu chứng:**
- "Address already in use"
- "EADDRINUSE"

**Giải pháp:**
```bash
# Kiểm tra process đang dùng port 27017
netstat -ano | findstr 27017

# Kill process (thay PID bằng process ID)
taskkill /PID <PID> /F
```

---

## 🔍 Cách Debug

### **Bước 1: Kiểm Tra Console Log**

Khi đăng ký, xem console của auth-service để thấy lỗi chi tiết:

```bash
cd server/auth-service
npm start
```

**Trong console sẽ hiện:**
```
Lỗi đăng ký: {error object}
Error name: ValidationError | MongoServerError | ...
Error message: {chi tiết lỗi}
Error stack: {stack trace}
```

### **Bước 2: Kiểm Tra MongoDB Connection**

```javascript
// Test trong mongosh
mongosh mongodb://127.0.0.1:27017

// Kiểm tra database tồn tại
show dbs

// Kiểm tra collection
use EduShareDB
show collections
```

### **Bước 3: Test API với cURL**

```bash
# Test đăng ký
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "passWord": "password123"
  }' \
  -v
```

Flag `-v` sẽ show chi tiết response.

---

## 📋 Checklist Debug

- [ ] MongoDB đã chạy trên port 27017
- [ ] Package uuid đã được cài (`npm install uuid`)
- [ ] Tất cả dependencies đã cài (`npm install`)
- [ ] Auth service đang chạy (`npm start`)
- [ ] Database EduShareDB có thể kết nối
- [ ] Email chưa được sử dụng
- [ ] Dữ liệu đúng format (email hợp lệ, password >= 6 ký tự)

---

## 🐛 Common Errors và Fixes

### **Error: "MongoNetworkError: connect ECONNREFUSED"**
```
Fix: MongoDB chưa chạy → net start MongoDB
```

### **Error: "MODULE_NOT_FOUND: Cannot find module 'uuid'"**
```
Fix: npm install uuid
```

### **Error: "E11000 duplicate key error"**
```
Fix: Email đã tồn tại → Dùng email khác hoặc xóa user cũ
```

### **Error: "ValidationError: Email không hợp lệ"**
```
Fix: Email phải có format: user@domain.com
```

### **Error: "MongoServerError: bad auth"**
```
Fix: Kiểm tra MongoDB connection string
```

---

## ✅ Test Connection

Tạo file test: `server/auth-service/test-connection.js`

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/EduShareDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    process.exit(0);
})
.catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
});
```

**Chạy test:**
```bash
cd server/auth-service
node test-connection.js
```

---

## 🔄 Restart Service

Nếu vẫn lỗi, thử restart:

```bash
# Stop auth-service (Ctrl+C)

# Clear npm cache (optional)
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart service
npm start
```

---

## 📞 Cần Giúp?

Nếu vẫn gặp lỗi:
1. Copy toàn bộ error message từ console
2. Copy request body bạn đang gửi
3. Check MongoDB đang chạy
4. Check tất cả packages đã cài

**Lưu ý:** Bật `NODE_ENV=development` để xem error chi tiết:

```bash
# Windows
set NODE_ENV=development
npm start

# macOS/Linux
NODE_ENV=development npm start
```







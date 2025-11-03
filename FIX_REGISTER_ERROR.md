# 🔧 Sửa Lỗi Đăng Ký

## ✅ Đã Sửa

1. ✅ Removed deprecated options (useNewUrlParser, useUnifiedTopology)
2. ✅ Added detailed error logging
3. ✅ Added step-by-step console logs

---

## 🔍 Cách Debug Chi Tiết

### **Bước 1: Restart Auth Service**

```bash
cd server/auth-service

# Stop service hiện tại (Ctrl+C nếu đang chạy)

# Start lại với logging chi tiết
npm start
```

### **Bước 2: Thử Đăng Ký**

Khi bạn đăng ký, **xem console** của auth-service sẽ hiện:

```
📝 Creating new user: { fullName: '...', email: '...', role: 'student' }
🆔 Generated user_id: user_abc123...
💾 Saving user to database...
✅ User saved successfully: { id: '...', user_id: '...', email: '...' }
```

**Nếu có lỗi, bạn sẽ thấy:**
```
❌ ========== LỖI ĐĂNG KÝ ==========
Error name: ValidationError | MongoServerError | ...
Error message: ...
Error code: ...
Error details:
  - field_name: error message
=====================================
```

---

### **Bước 3: Test với Script**

```bash
cd server/auth-service

# Trong terminal khác (auth-service phải đang chạy)
node test-register.js
```

Script này sẽ test endpoint và hiển thị response chi tiết.

---

## 📋 Các Lỗi Thường Gặp và Fix

### **1. ValidationError**

**Lỗi:**
```
Error name: ValidationError
Error details:
  - email: Email không hợp lệ
```

**Nguyên nhân:** Email format sai
**Fix:** Email phải có format: `user@domain.com`

---

### **2. MongoServerError (E11000)**

**Lỗi:**
```
Error code: 11000
Error message: E11000 duplicate key error
```

**Nguyên nhân:** Email hoặc user_id đã tồn tại
**Fix:** 
- Dùng email khác
- Hoặc xóa user cũ trong MongoDB

---

### **3. Mongoose Cast Error**

**Lỗi:**
```
CastError: Cast to [type] failed for value
```

**Nguyên nhân:** Data type sai
**Fix:** Check request body đúng format

---

### **4. Lỗi UUID**

**Lỗi:**
```
Cannot find module 'uuid'
```

**Fix:**
```bash
npm install uuid
```

---

## 🧪 Test Thủ Công

### **Test với cURL:**

```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test_new@example.com",
    "passWord": "password123"
  }' \
  -v
```

### **Test với Postman:**

1. Method: POST
2. URL: `http://localhost:3001/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "fullName": "Test User",
  "email": "test_new@example.com",
  "passWord": "password123"
}
```

---

## 🔍 Xem Log Chi Tiết

**Khi đăng ký, mở terminal chạy `npm start` và xem:**

```
📝 Creating new user: { ... }
🆔 Generated user_id: user_...
💾 Saving user to database...
```

**Nếu có lỗi:**
```
❌ ========== LỖI ĐĂNG KÝ ==========
[Chi tiết lỗi ở đây]
=====================================
```

**Copy toàn bộ log này** để debug!

---

## ⚡ Quick Fixes

### **Nếu vẫn báo "Có lỗi xảy ra khi đăng ký":**

1. **Check console log** của auth-service (copy toàn bộ error)
2. **Check MongoDB** đang chạy:
   ```bash
   mongosh mongodb://127.0.0.1:27017
   ```
3. **Check packages:**
   ```bash
   cd server/auth-service
   npm list uuid mongoose bcrypt
   ```
4. **Restart service:**
   ```bash
   # Ctrl+C để stop
   npm start
   ```

---

## 📞 Cần Giúp?

**Cung cấp thông tin sau:**

1. **Toàn bộ error log** từ console (copy từ `❌ ========== LỖI ĐĂNG KÝ ==========` đến `=====================================`)
2. **Request body** bạn đang gửi
3. **Status code** từ response
4. **Response body** đầy đủ

Với thông tin này, tôi có thể xác định nguyên nhân chính xác!

---

## ✅ Checklist

- [ ] Auth service đang chạy (`npm start`)
- [ ] MongoDB đang chạy (`mongosh` kết nối được)
- [ ] Console log hiển thị chi tiết
- [ ] Đã xem error log trong console
- [ ] Email format đúng (`user@domain.com`)
- [ ] Password >= 6 ký tự
- [ ] fullName không trống





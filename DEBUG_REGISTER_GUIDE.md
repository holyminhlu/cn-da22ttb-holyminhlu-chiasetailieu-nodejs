# 🔍 Hướng Dẫn Xác Định Lỗi Đăng Ký

## 🚀 Công Cụ Debug Tự Động

Tôi đã tạo **2 script debug** để tự động kiểm tra và xác định lỗi:

---

## 📋 Script 1: `debug-register.js` - Kiểm Tra Hệ Thống

Script này kiểm tra **tất cả thành phần** của hệ thống.

### **Chạy:**

```bash
cd server/auth-service
node debug-register.js
```

### **Script sẽ kiểm tra:**

1. ✅ **MongoDB Connection** - Kết nối database
2. ✅ **Model Import** - Import User model
3. ✅ **Dependencies** - bcrypt, jwt, mongoose, uuid
4. ✅ **Create User** - Thử tạo user thật (sau đó xóa)
5. ✅ **Email Check** - Kiểm tra email exists
6. ✅ **Existing Users** - Liệt kê users hiện có

### **Output:**

```
🚀 ========== DEBUG REGISTER - TỰ ĐỘNG KIỂM TRA ==========

📊 ========== TEST 1: MONGODB CONNECTION ==========
✅ MongoDB Connected Successfully
✅ Found 1 collections

📊 ========== TEST 2: MODEL IMPORT ==========
✅ User Model imported successfully
✅ User Schema exists
✅ Schema has 20 fields

📊 ========== TEST 3: DEPENDENCIES ==========
✅ bcrypt - OK
✅ jsonwebtoken - OK
✅ mongoose - OK
✅ uuid - OK

📊 ========== TEST 4: CREATE USER (DRY RUN) ==========
✅ Validation passed
✅ Password hashed successfully
✅ User object created
✅ User saved successfully

📋 ========== KẾT QUẢ ==========
  ✅ MongoDB Connection: PASS
  ✅ Model Import: PASS
  ✅ Dependencies: PASS
  ✅ Create User: PASS
  ✅ Email Check: PASS
  ✅ Existing Users: PASS

✅ TẤT CẢ TEST PASS! Hệ thống hoạt động bình thường.
```

**Nếu có lỗi, script sẽ chỉ ra:**
- ❌ MongoDB không kết nối được → Hướng dẫn fix
- ❌ Thiếu dependency → Lệnh cài đặt
- ❌ Lỗi validation → Chi tiết field nào lỗi
- ❌ Duplicate key → Email/user_id đã tồn tại

---

## 📋 Script 2: `debug-request.js` - Test Request Thật

Script này test **request đăng ký thật** với logging chi tiết.

### **Chạy:**

```bash
cd server/auth-service

# Terminal 1: Chạy service
npm start

# Terminal 2: Chạy debug
node debug-request.js
```

### **Script sẽ:**

1. ✅ **Check service health** - Service có chạy không
2. ✅ **Send register request** - Gửi POST /register
3. ✅ **Log response** - Hiển thị response chi tiết
4. ✅ **Identify errors** - Xác định lỗi cụ thể

### **Output:**

```
🚀 ========== DEBUG REQUEST - KIỂM TRA ĐĂNG KÝ ==========

🔍 Checking service health...
✅ Service is running

🧪 ========== TEST REGISTER REQUEST ==========

Request Data:
{
  "fullName": "Test User Debug",
  "email": "test_debug_1234567890@example.com",
  "passWord": "password123",
  "phone": "0123456789"
}

📤 Sending request...
URL: http://localhost:3001/register
Method: POST
Headers: {...}

📥 Response received (150ms)
Status Code: 201
Status Message: Created

📄 Response Body:
{
  "success": true,
  "message": "Đăng ký thành công!",
  "data": { ... }
}

✅ REGISTER SUCCESS!
```

**Nếu có lỗi:**
```
❌ REGISTER FAILED!
   Message: Email đã được sử dụng!
   Error: ...
```

---

## 🎯 Cách Sử Dụng

### **Bước 1: Chạy System Check**

```bash
cd server/auth-service
node debug-register.js
```

**Xem kết quả:**
- Nếu tất cả PASS → Hệ thống OK, có thể là vấn đề request
- Nếu có FAIL → Fix lỗi đó trước

### **Bước 2: Start Service**

```bash
cd server/auth-service
npm start
```

**Kiểm tra output:**
```
🚀 =======================================
✅ Auth-Service đang lắng nghe tại http://localhost:3001
...
```

### **Bước 3: Test Request**

```bash
# Trong terminal khác
cd server/auth-service
node debug-request.js
```

**Xem kết quả:**
- Success → Mọi thứ OK
- Failed → Xem message và error

---

## 🔍 Xác Định Lỗi Cụ Thể

### **Lỗi: MongoDB Connection Failed**

**Nguyên nhân:** MongoDB chưa chạy

**Fix:**
```bash
net start MongoDB
# Hoặc
mongod --dbpath C:\data\db
```

---

### **Lỗi: Model Import Failed**

**Nguyên nhân:** Lỗi syntax trong model hoặc thiếu dependency

**Fix:**
```bash
cd server/auth-service
npm install
```

---

### **Lỗi: Dependencies Missing**

**Nguyên nhân:** Package chưa cài

**Fix:**
```bash
cd server/auth-service
npm install bcrypt jsonwebtoken mongoose uuid
```

---

### **Lỗi: Validation Failed**

**Nguyên nhân:** Dữ liệu không hợp lệ

**Check:**
- Email có đúng format không
- Password có >= 6 ký tự không
- fullName có trống không

---

### **Lỗi: Duplicate Key (E11000)**

**Nguyên nhân:** Email hoặc user_id đã tồn tại

**Fix:**
- Dùng email khác
- Hoặc xóa user cũ trong MongoDB

---

### **Lỗi: Service Not Running**

**Nguyên nhân:** Service chưa start hoặc port bị chiếm

**Fix:**
```bash
# Check port
netstat -ano | findstr 3001

# Start service
cd server/auth-service
npm start
```

---

## 📊 So Sánh Kết Quả

### **Trường Hợp 1: System Check PASS, Request FAIL**

→ **Vấn đề ở request hoặc client-side**
- Check request format
- Check headers
- Check URL

### **Trường Hợp 2: System Check FAIL**

→ **Vấn đề ở server-side**
- Fix lỗi được chỉ ra trong system check
- Chạy lại system check
- Sau đó test request

### **Trường Hợp 3: Cả 2 Đều PASS nhưng Client Vẫn Lỗi**

→ **Vấn đề ở client hoặc network**
- Check client code
- Check CORS
- Check network connection

---

## 🎯 Quick Debug

```bash
# 1. System check
cd server/auth-service
node debug-register.js

# 2. Nếu OK, start service
npm start

# 3. Test request (terminal khác)
node debug-request.js

# 4. Xem console log của service để thấy chi tiết
```

---

## 📞 Nếu Vẫn Không Tìm Ra Lỗi

**Cung cấp:**

1. **Output của `debug-register.js`** (toàn bộ)
2. **Output của `debug-request.js`** (toàn bộ)
3. **Console log của `npm start`** (khi chạy debug-request)
4. **Client code** đang gọi API

Với thông tin này, tôi có thể xác định chính xác vấn đề!

---

## ✅ Kết Quả Mong Đợi

**Nếu tất cả OK:**
- ✅ System check: All PASS
- ✅ Service: Running
- ✅ Request: Success (201)
- ✅ User: Created in database

**Nếu có lỗi:**
- Script sẽ chỉ ra **chính xác** lỗi ở đâu và cách fix!

---

**Chạy ngay `node debug-register.js` để xem kết quả!** 🚀





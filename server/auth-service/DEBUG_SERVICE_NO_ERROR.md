# 🔍 Debug: Service Không Báo Lỗi Khi Đăng Ký

## ⚠️ Vấn Đề

Khi đăng ký, client báo lỗi nhưng **service không hiển thị lỗi gì** trong console.

---

## ✅ Đã Thêm Logging Chi Tiết

Tôi đã thêm **logging ở nhiều điểm** để theo dõi toàn bộ flow:

### **1. Request Logging (index.js)**
Mọi request sẽ được log:
```
📥 ========== NEW REQUEST ==========
2024-01-15T10:00:00.000Z - POST /register
Headers: {...}
Body: {...}
=====================================
```

### **2. Route Logging (authRoute.js)**
Mỗi route hit sẽ được log:
```
🎯 Route hit: POST /register
Method: POST, Path: /register
```

### **3. Controller Logging (authController.js)**
Chi tiết từng bước trong controller:
```
🔵 ========== CREATE ACCOUNT CALLED ==========
Request received at: ...
Request body: {...}
Extracted data: {...}
🔍 Validating input...
✅ Validation passed
🔍 Checking if email exists: ...
✅ Email is available
🔐 Hashing password...
✅ Password hashed
📝 Creating new user: {...}
💾 Saving user to database...
✅ User saved successfully: {...}
🎫 Generating JWT token...
✅ Token generated
📤 Sending success response...
✅ Response prepared: {...}
```

### **4. Error Logging (Nếu có lỗi)**
```
❌ ========== LỖI ĐĂNG KÝ ==========
Error name: ...
Error message: ...
Error code: ...
Error details: ...
=====================================
```

---

## 🔍 Cách Debug

### **Bước 1: Restart Service**

```bash
cd server/auth-service

# Stop service (Ctrl+C)

# Start lại
npm start
```

### **Bước 2: Xem Console Log**

Khi bạn đăng ký, **mở terminal chạy `npm start`** và quan sát:

**Nếu thấy:**
```
📥 ========== NEW REQUEST ==========
🎯 Route hit: POST /register
🔵 ========== CREATE ACCOUNT CALLED ==========
```

→ **Request đã đến được service**

**Nếu KHÔNG thấy gì:**
→ Request không đến được service
- Check URL có đúng không (`http://localhost:3001/register`)
- Check service có đang chạy không
- Check CORS settings

---

### **Bước 3: Kiểm Tra Request**

Xem log `Request body:` để đảm bảo data đúng:
```json
{
  "fullName": "...",
  "email": "...",
  "passWord": "..."
}
```

---

### **Bước 4: Kiểm Tra Response**

Xem log `Response prepared:` để thấy response được gửi về.

---

## 🎯 Các Trường Hợp

### **Case 1: Không Thấy Log "NEW REQUEST"**

**Nguyên nhân:** Request không đến được service

**Fix:**
- Check service đang chạy: `http://localhost:3001`
- Check URL client gọi có đúng không
- Check CORS settings
- Check network connection

---

### **Case 2: Thấy "NEW REQUEST" Nhưng Không Thấy "CREATE ACCOUNT CALLED"**

**Nguyên nhân:** Route không match hoặc middleware chặn

**Fix:**
- Check URL path (`/register` vs `/api/register`)
- Check route registration trong `index.js`
- Check middleware có lỗi không

---

### **Case 3: Thấy "CREATE ACCOUNT CALLED" Nhưng Dừng Ở Một Bước**

**Xem log ở bước cuối cùng:**
- Nếu dừng ở "Validating input" → Validation failed
- Nếu dừng ở "Checking if email exists" → Database query error
- Nếu dừng ở "Hashing password" → bcrypt error
- Nếu dừng ở "Saving user" → Database save error

---

### **Case 4: Thấy Tất Cả Log Nhưng Client Vẫn Báo Lỗi**

**Nguyên nhân:** Response không đến được client

**Fix:**
- Check response status code
- Check CORS headers
- Check network timeout
- Check client error handling

---

## 🧪 Test Thủ Công

### **Test với cURL:**

```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test_debug@example.com",
    "passWord": "password123"
  }' \
  -v
```

**Xem cả:**
- Console log của service
- Response từ curl

---

## 📋 Checklist Debug

Khi test, check:

- [ ] Service đang chạy (`npm start` output)
- [ ] Thấy log `NEW REQUEST` trong console
- [ ] Thấy log `Route hit: POST /register`
- [ ] Thấy log `CREATE ACCOUNT CALLED`
- [ ] Thấy log `Validating input`
- [ ] Thấy log `Checking if email exists`
- [ ] Thấy log `Hashing password`
- [ ] Thấy log `Saving user to database`
- [ ] Thấy log `User saved successfully`
- [ ] Thấy log `Response prepared`

**Nếu thiếu bước nào → Lỗi ở bước đó!**

---

## 🔧 Quick Fix

```bash
# 1. Stop service
Ctrl+C

# 2. Clear và restart
cd server/auth-service
npm start

# 3. Trong terminal khác, test
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com","passWord":"password123"}'

# 4. Xem console output
```

---

## 📞 Cần Giúp?

**Cung cấp:**

1. **Toàn bộ console log** từ khi start service đến khi đăng ký
2. **Request URL** client đang gọi
3. **Request body** client đang gửi
4. **Response** client nhận được (nếu có)

Với logging mới này, chúng ta sẽ thấy **chính xác** request đi đến đâu và dừng ở đâu!






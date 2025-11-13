# 🔍 Debug: Service Không Hoạt Động và Không Báo Lỗi

## ⚠️ Vấn Đề

- Đăng ký không hoạt động
- Đăng nhập không hoạt động  
- Service không báo lỗi gì trong console

---

## ✅ Đã Cải Thiện

1. ✅ Thêm global error handler
2. ✅ Thêm 404 handler với thông báo rõ ràng
3. ✅ Thêm test endpoint (`GET /test`)
4. ✅ Cải thiện logging chi tiết
5. ✅ Thêm async handler wrapper để catch errors
6. ✅ Tạo test script để kiểm tra service

---

## 🔍 Các Bước Debug

### **Bước 1: Test Service Có Chạy Không**

```bash
# Terminal 1: Chạy service
cd server/auth-service
npm start
```

**Kiểm tra output:**
```
🚀 =======================================
✅ Auth-Service đang lắng nghe tại http://localhost:3001
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
✅ Test endpoint: http://localhost:3001/test
✅ Register: POST http://localhost:3001/register
✅ Login: POST http://localhost:3001/login
======================================
```

Nếu **KHÔNG thấy** output này → Service chưa start thành công!

---

### **Bước 2: Test Root Endpoint**

Mở browser hoặc dùng cURL:
```bash
curl http://localhost:3001/
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "EduShare Auth Service đang chạy",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

**Nếu không có response:**
- Service chưa chạy
- Port 3001 bị chiếm
- Có lỗi khi start

---

### **Bước 3: Test Endpoint**

```bash
curl http://localhost:3001/test
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "Service đang chạy bình thường!",
  "timestamp": "...",
  "endpoints": { ... }
}
```

---

### **Bước 4: Chạy Test Script Tự Động**

```bash
cd server/auth-service
node test-service.js
```

Script này sẽ test:
- ✅ Root endpoint
- ✅ Test endpoint
- ✅ Register endpoint
- ✅ Login endpoint
- ✅ Wrong method handling

**Xem kết quả để biết endpoint nào lỗi!**

---

### **Bước 5: Xem Console Log Khi Test**

Khi chạy test, **mở terminal chạy `npm start`** và quan sát:

**Nếu thấy:**
```
📥 ========== NEW REQUEST ==========
Method: POST
Path: /register
...
🎯 Route hit: POST /register
🔵 ========== CREATE ACCOUNT CALLED ==========
```

→ **Request đã đến service!**

**Nếu KHÔNG thấy gì:**
→ Request không đến được service
- Check URL có đúng không
- Check service có đang chạy không
- Check firewall/network

---

## 🎯 Các Trường Hợp Cụ Thể

### **Case 1: Service Không Start**

**Triệu chứng:** Không thấy log "Auth-Service đang lắng nghe"

**Nguyên nhân:**
- Port 3001 đã bị dùng
- Có lỗi syntax trong code
- Dependencies chưa cài

**Fix:**
```bash
# Check port
netstat -ano | findstr 3001

# Check dependencies
cd server/auth-service
npm install

# Start lại
npm start
```

---

### **Case 2: Request Không Đến Service**

**Triệu chứng:** Không thấy log "NEW REQUEST"

**Nguyên nhân:**
- URL sai
- Service chưa chạy
- Network issue

**Fix:**
- Check service đang chạy: `curl http://localhost:3001/`
- Check URL client gọi có đúng không
- Check CORS settings

---

### **Case 3: Route Không Match**

**Triệu chứng:** Thấy "NEW REQUEST" nhưng không thấy "Route hit"

**Nguyên nhân:**
- Route path sai
- Method sai

**Fix:**
- Check URL path: `/register` không phải `/api/register`
- Check method: `POST` không phải `GET`

---

### **Case 4: Controller Không Được Gọi**

**Triệu chứng:** Thấy "Route hit" nhưng không thấy "CREATE ACCOUNT CALLED"

**Nguyên nhân:**
- Controller import lỗi
- Middleware chặn

**Fix:**
- Check console có lỗi import không
- Check middleware có throw error không

---

### **Case 5: Lỗi Trong Controller**

**Triệu chứng:** Thấy "CREATE ACCOUNT CALLED" nhưng dừng ở một bước

**Fix:**
- Xem log bước cuối cùng
- Check error log chi tiết

---

## 🧪 Test Nhanh

### **Quick Test:**

```bash
# 1. Start service
cd server/auth-service
npm start

# 2. Trong terminal khác, test
curl http://localhost:3001/test

# 3. Nếu OK, test register
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com","passWord":"password123"}'

# 4. Hoặc chạy test script
node test-service.js
```

---

## 📋 Checklist Debug

- [ ] Service đang chạy (`npm start` output OK)
- [ ] MongoDB đang chạy (`mongosh` kết nối được)
- [ ] Test endpoint hoạt động (`GET /test`)
- [ ] Thấy log "NEW REQUEST" khi test
- [ ] Thấy log "Route hit" khi test
- [ ] Thấy log "CREATE ACCOUNT CALLED" khi test
- [ ] Không có lỗi trong console

---

## 🔧 Quick Fixes

```bash
# 1. Stop service (Ctrl+C)

# 2. Clear và restart
cd server/auth-service
npm install
npm start

# 3. Test ngay
curl http://localhost:3001/test

# 4. Nếu OK, test register
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test_123@example.com","passWord":"password123"}'
```

---

## 📞 Cần Giúp?

**Cung cấp:**

1. **Output của `npm start`** (toàn bộ từ đầu)
2. **Kết quả của `curl http://localhost:3001/test`**
3. **Kết quả của `node test-service.js`**
4. **Console log** khi test đăng ký (copy toàn bộ)
5. **URL và method** client đang gọi

Với thông tin này, tôi có thể xác định chính xác vấn đề!







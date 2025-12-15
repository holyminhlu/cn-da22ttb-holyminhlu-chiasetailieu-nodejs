# 🔍 Debug Checklist - Payment API ECONNRESET Error

## 📋 Nguyên Nhân Phân Tích

### 1. ECONNRESET - Connection Reset by Peer

**Nguyên nhân có thể:**
- ✅ **Backend crash** - Server crash khi xử lý request
- ✅ **Route không tồn tại** - 404 nhưng proxy không handle đúng
- ✅ **Body parsing error** - JSON parsing fail, server đóng connection
- ✅ **Async/await không được handle** - Unhandled promise rejection
- ✅ **Proxy configuration sai** - Body không được forward đúng
- ✅ **Timeout** - Request timeout, connection bị đóng

### 2. 500 Internal Server Error

**Nguyên nhân có thể:**
- ✅ **Missing required fields** - `user_id` hoặc `course_id` thiếu
- ✅ **Database error** - MongoDB connection issue
- ✅ **Service không chạy** - Course Service (port 3004) không running
- ✅ **Unhandled exception** - Error không được catch

## ✅ Checklist Debug Từng Bước

### Bước 1: Kiểm Tra Services Đang Chạy

```bash
# Terminal 1: Kiểm tra Course Service
curl http://localhost:3004/test
# Phải trả về: {"success":true,...}

# Terminal 2: Kiểm tra API Gateway
curl http://localhost:3000/test
# Phải trả về: {"success":true,...}

# Terminal 3: Kiểm tra MongoDB
# Kiểm tra MongoDB đang chạy
```

**✅ Pass nếu:** Cả 2 services đều trả về response thành công

**❌ Fail nếu:** 
- Service không chạy → Start service
- Port conflict → Check port 3000, 3004
- Connection refused → Service crash, check logs

---

### Bước 2: Kiểm Tra Payment Route Tồn Tại

```bash
# Test payment endpoint trực tiếp
curl -X POST http://localhost:3004/payments \
  -H "Content-Type: application/json" \
  -d '{"course_id":"test","user_id":"test"}'
```

**✅ Pass nếu:** Trả về response (có thể 400/401 nhưng không phải 404)

**❌ Fail nếu:**
- 404 Not Found → Route chưa được mount
- Connection refused → Service không chạy
- Timeout → Service crash hoặc hang

**Fix:**
```bash
# Kiểm tra paymentRoute.js đã được mount trong index.js
cd server/course-service
grep -r "paymentRoute" index.js
# Phải thấy: app.use('/payments', paymentRoute)
```

---

### Bước 3: Kiểm Tra API Gateway Proxy

```bash
# Test qua API Gateway
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"course_id":"test","user_id":"test"}'
```

**✅ Pass nếu:** Request được proxy đến Course Service (check logs)

**❌ Fail nếu:**
- ECONNRESET → Proxy không forward body đúng
- 500 Error → Backend crash

**Fix:**
- Kiểm tra `paymentsProxy.js` có handle body đúng không
- Kiểm tra logs của API Gateway

---

### Bước 4: Kiểm Tra Request Body Format

**Frontend phải gửi:**
```javascript
{
  "course_id": "6909807aece94ce94df477ca",
  "user_id": "6908204708e0d1762ce43424",
  "customer_name": "Nguyễn Văn A", // Optional
  "customer_email": "user@example.com", // Optional
  "customer_phone": "0123456789" // Optional
}
```

**Kiểm tra trong Browser DevTools:**
1. Network tab → Xem request payload
2. Console → Xem logs từ `paymentAPI.js`

**✅ Pass nếu:** 
- `course_id` và `user_id` có trong body
- Content-Type: `application/json`

**❌ Fail nếu:**
- Thiếu `user_id` → Frontend không gửi user_id
- Thiếu `course_id` → Frontend không gửi course_id
- Content-Type sai → Proxy không parse body

---

### Bước 5: Kiểm Tra Backend Logs

**Course Service logs phải có:**
```
💳 ========== CREATE PAYMENT REQUEST ==========
Time: 2024-...
Request body: {"course_id":"...","user_id":"..."}
✅ Payment record created: payment_...
```

**API Gateway logs phải có:**
```
💳 ========== PAYMENT PROXY REQUEST ==========
📤 Body data: {"course_id":"...","user_id":"..."}
✅ Body forwarded successfully
```

**✅ Pass nếu:** Logs hiển thị đầy đủ, không có error

**❌ Fail nếu:**
- Không có logs → Request không đến backend
- Error trong logs → Check error message
- Logs dừng giữa chừng → Server crash

---

### Bước 6: Kiểm Tra Database Connection

```bash
# Test MongoDB connection
# Trong Course Service, check logs:
# "MongoDB connected" hoặc "MongoDB connection error"
```

**✅ Pass nếu:** MongoDB connected

**❌ Fail nếu:**
- MongoDB connection error → Check MONGODB_URI
- Database operations fail → Check MongoDB đang chạy

---

### Bước 7: Kiểm Tra Error Handling

**Backend phải:**
- ✅ Catch tất cả errors
- ✅ Trả về JSON response (không crash)
- ✅ Log errors chi tiết

**Test với invalid data:**
```bash
# Missing user_id
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"course_id":"test"}'
# Phải trả về 401 với message rõ ràng

# Missing course_id
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test"}'
# Phải trả về 400 với message rõ ràng
```

**✅ Pass nếu:** Trả về error response, không crash

**❌ Fail nếu:** Server crash hoặc không trả về response

---

### Bước 8: Kiểm Tra Frontend Code

**Frontend phải:**
```javascript
// ✅ ĐÚNG
const paymentResponse = await createPayment(courseId, userId, {
  customer_name: userName,
  customer_email: userEmail
})

// ❌ SAI - Thiếu userId
const paymentResponse = await createPayment(courseId, {
  customer_name: userName
})
```

**Kiểm tra:**
1. `paymentAPI.js` có nhận `userId` parameter không?
2. `CourseIntroductionView.vue` có truyền `userId` không?
3. Console có log request data không?

---

### Bước 9: Kiểm Tra Vue Proxy Config

**vue.config.js phải có:**
```javascript
devServer: {
  proxy: {
    '^/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

**✅ Pass nếu:** Proxy config đúng

**❌ Fail nếu:**
- Proxy không được config → Frontend không thể gọi API
- Target sai → Request đến sai server

---

### Bước 10: Test End-to-End

**Flow hoàn chỉnh:**
1. User click "Đăng ký" trên khóa học có phí
2. Frontend gọi `POST /api/payments` với `course_id` và `user_id`
3. API Gateway proxy đến Course Service
4. Course Service tạo payment và trả về `payment_url`
5. Frontend redirect đến payment URL

**✅ Pass nếu:** Tất cả các bước trên thành công

**❌ Fail nếu:** Bất kỳ bước nào fail → Check logs của bước đó

---

## 🔧 Quick Fixes

### Fix 1: Missing user_id

**Problem:** Frontend không gửi `user_id`

**Solution:**
```javascript
// Frontend: paymentAPI.js
export const createPayment = async (courseId, userId, customerInfo = {}) => {
  const response = await axios.post(`${API_BASE_URL}`, {
    course_id: courseId,
    user_id: userId, // ✅ Bắt buộc
    ...customerInfo
  });
}

// Frontend: CourseIntroductionView.vue
const paymentResponse = await createPayment(courseId, userId, {
  customer_name: userName
})
```

### Fix 2: Proxy Body Not Forwarded

**Problem:** Proxy không forward body

**Solution:**
```javascript
// paymentsProxy.js
onProxyReq: (proxyReq, req, res) => {
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData); // ✅ Forward body
  }
}
```

### Fix 3: Server Crash

**Problem:** Unhandled error làm server crash

**Solution:**
```javascript
// paymentController.js
exports.createPayment = async (req, res) => {
  try {
    // ... code ...
  } catch (error) {
    // ✅ Luôn catch error và trả về response
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo payment',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
}
```

---

## 📊 Success Criteria

**API hoạt động đúng khi:**
- ✅ POST `/api/payments` trả về 200 OK (hoặc 400/401 với message rõ ràng)
- ✅ Không có ECONNRESET error
- ✅ Không có 500 Internal Server Error (trừ khi có lỗi thật)
- ✅ Frontend nhận được JSON response hợp lệ
- ✅ Payment được tạo trong database
- ✅ User được redirect đến payment URL

---

## 🚨 Common Issues & Solutions

### Issue 1: ECONNRESET khi gọi API

**Cause:** Backend crash hoặc đóng connection

**Solution:**
1. Check backend logs
2. Đảm bảo error handling đầy đủ
3. Test backend trực tiếp (bypass proxy)

### Issue 2: 500 Internal Server Error

**Cause:** Missing fields hoặc database error

**Solution:**
1. Check request body có đủ `course_id` và `user_id`
2. Check database connection
3. Check error logs

### Issue 3: Request không đến backend

**Cause:** Proxy config sai hoặc route không tồn tại

**Solution:**
1. Test API Gateway trực tiếp
2. Check proxy config
3. Check route mounting

---

**Lưu ý:** Sau mỗi fix, restart cả 2 services và test lại từ đầu.


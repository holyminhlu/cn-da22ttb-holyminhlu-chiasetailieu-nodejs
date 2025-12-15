# 🧪 Hướng Dẫn Test Payment API

Hướng dẫn chi tiết cách test Payment API sau khi đã khắc phục lỗi timeout.

---

## 📋 Prerequisites

Trước khi test, đảm bảo:

- ✅ **MongoDB** đang chạy tại `mongodb://127.0.0.1:27017/EduShareDB`
- ✅ **API Gateway** chạy tại `http://localhost:3000`
- ✅ **Course Service** chạy tại `http://localhost:3004`
- ✅ **Frontend** chạy tại `http://localhost:8080` (nếu test từ browser)

---

## 🚀 Bước 1: Khởi động Services

### 1.1. Khởi động MongoDB
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
# hoặc
mongod --dbpath /path/to/data
```

### 1.2. Khởi động API Gateway
```bash
cd server/api-gateway
npm start
```

**Expected output:**
```
API Gateway chạy tại http://localhost:3000
```

### 1.3. Khởi động Course Service
```bash
cd server/course-service
npm start
```

**Expected output:**
```
✅ Course-Service đang lắng nghe tại http://localhost:3004
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
```

### 1.4. Khởi động Frontend (nếu test từ browser)
```bash
cd client/olf
npm run serve
```

---

## 🧪 Bước 2: Test Connectivity Cơ Bản

### 2.1. Test API Gateway Root
```bash
curl http://localhost:3000/
```

**Expected:**
```json
{
  "success": true,
  "message": "API Gateway is running",
  "version": "1.0.0",
  "endpoints": {
    "courses": "GET /api/courses",
    "documents": "GET /api/documents",
    "auth": "POST /api/auth/login",
    "payments": "POST /api/payments",
    "test": "GET /test"
  }
}
```

### 2.2. Test API Gateway Test Endpoint
```bash
curl http://localhost:3000/test
```

**Expected:**
```json
{
  "success": true,
  "message": "API Gateway is running",
  "routes": {
    "courses": "/api/courses",
    "documents": "/api/documents",
    "auth": "/api/auth",
    "payments": "/api/payments"
  }
}
```

### 2.3. Test Course Service
```bash
curl http://localhost:3004/test
```

**Expected:**
```json
{
  "success": true,
  "message": "Course Service đang chạy bình thường!",
  "endpoints": {
    "createPayment": "POST /payments",
    ...
  }
}
```

### 2.4. Test Payment Route Info
```bash
curl http://localhost:3000/api/payments
```

**Expected:**
```json
{
  "success": true,
  "message": "Payment API is running",
  "endpoints": {
    "createPayment": "POST /payments",
    ...
  }
}
```

---

## 💳 Bước 3: Test Create Payment API

### 3.1. Chuẩn bị Test Data

Bạn cần có:
- **courseId**: ID của một khóa học có phí (không phải free)
- **userId**: ID của user đã đăng ký

**Cách lấy courseId:**
```bash
# Lấy danh sách courses
curl http://localhost:3000/api/courses

# Tìm course có pricing.isFree = false và pricing.price > 0
```

**Cách lấy userId:**
```bash
# Đăng ký user mới hoặc đăng nhập
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "passWord": "password123"
  }'

# Lưu userId từ response
```

---

## 📝 Bước 4: Test với cURL

### 4.1. Test Case 1: Tạo Payment Thành Công

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "YOUR_COURSE_ID",
    "user_id": "YOUR_USER_ID",
    "customer_name": "Nguyễn Văn A",
    "customer_email": "test@example.com",
    "customer_phone": "0123456789"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Tạo payment link thành công",
  "data": {
    "payment_id": "payment_xxx",
    "payment_url": "http://localhost:8080/payment/success?payment_id=xxx&mock=true",
    "amount": 50000,
    "currency": "VND",
    "expires_at": "2024-01-01T12:00:00.000Z",
    "course": {
      "course_id": "xxx",
      "title": "Course Title",
      "thumbnail": "..."
    },
    "payment_method": "mock"
  }
}
```

**Response Time:** < 1 second (mock mode) hoặc < 10 seconds (real SePay)

---

### 4.2. Test Case 2: Missing courseId

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "course_id là bắt buộc",
  "required": ["course_id", "user_id"],
  "received": {
    "course_id": "❌",
    "user_id": "✅"
  }
}
```

---

### 4.3. Test Case 3: Missing userId

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "YOUR_COURSE_ID"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Người dùng chưa đăng nhập. Vui lòng cung cấp user_id trong request body.",
  "required": ["course_id", "user_id"],
  "received": {
    "course_id": "✅",
    "user_id": "❌"
  }
}
```

---

### 4.4. Test Case 4: Course Không Tồn Tại

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "INVALID_COURSE_ID",
    "user_id": "YOUR_USER_ID"
  }'
```

**Expected Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Khóa học không tồn tại",
  "course_id": "INVALID_COURSE_ID"
}
```

---

### 4.5. Test Case 5: Course Miễn Phí

```bash
# Sử dụng course có pricing.isFree = true hoặc price = 0
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "FREE_COURSE_ID",
    "user_id": "YOUR_USER_ID"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Khóa học này miễn phí, không cần thanh toán",
  "course_id": "FREE_COURSE_ID"
}
```

---

## 📮 Bước 5: Test với Postman

### 5.1. Setup Postman Collection

1. **Tạo Collection:** "Payment API Tests"
2. **Base URL:** `http://localhost:3000/api/payments`

### 5.2. Request 1: Create Payment

- **Method:** `POST`
- **URL:** `http://localhost:3000/api/payments`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "course_id": "YOUR_COURSE_ID",
    "user_id": "YOUR_USER_ID",
    "customer_name": "Nguyễn Văn A",
    "customer_email": "test@example.com",
    "customer_phone": "0123456789"
  }
  ```

**Expected:**
- Status: `200 OK`
- Response time: < 10 seconds
- Body có `payment_url`

### 5.3. Request 2: Get Payment Status

- **Method:** `GET`
- **URL:** `http://localhost:3000/api/payments/{payment_id}/status`
- **Replace `{payment_id}`** với payment_id từ response trước

**Expected:**
```json
{
  "success": true,
  "data": {
    "payment_id": "payment_xxx",
    "status": "processing",
    "amount": 50000,
    ...
  }
}
```

### 5.4. Request 3: Get User Payments

- **Method:** `GET`
- **URL:** `http://localhost:3000/api/payments/user?user_id=YOUR_USER_ID`

**Expected:**
```json
{
  "success": true,
  "data": [
    {
      "payment_id": "payment_xxx",
      "status": "processing",
      ...
    }
  ]
}
```

---

## 🌐 Bước 6: Test từ Frontend (Browser)

### 6.1. Setup

1. Mở browser: `http://localhost:8080`
2. Đăng nhập với user đã có
3. Mở DevTools → **Network** tab
4. Filter: `payments`

### 6.2. Test Flow

1. **Navigate** đến trang khóa học có phí
2. **Click** nút "Đăng ký" hoặc "Thanh toán"
3. **Quan sát Network tab:**

**Expected Request:**
```
POST /api/payments
Status: 200 OK
Time: < 10 seconds
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "payment_url": "...",
    ...
  }
}
```

4. **Verify:** Browser tự động redirect đến `payment_url`

### 6.3. Check Console Logs

**Frontend Console:**
```
💳 Creating payment: { courseId, userId, customerInfo }
✅ Payment created successfully: { ... }
🔗 Redirecting to payment URL
```

**Không có error:**
- ❌ `timeout of 30000ms exceeded`
- ❌ `ECONNABORTED`
- ❌ `Network Error`

---

## 📊 Bước 7: Kiểm Tra Backend Logs

### 7.1. Logs Phải Có

Khi test thành công, backend logs phải có **tất cả các checkpoint:**

```
💳 ========== CREATE PAYMENT REQUEST ==========
Time: 2024-01-01T12:00:00.000Z
Method: POST
Path: /payments

💳 [CHECKPOINT 1] Creating payment for course: xxx, user: yyy
📚 [CHECKPOINT 2] Looking up course: xxx
✅ [CHECKPOINT 2] Course found: Course Title
💰 [CHECKPOINT 3] Checking course pricing...
✅ [CHECKPOINT 3] Course has price: 50000 VND
📋 [CHECKPOINT 4] Checking existing enrollment...
✅ [CHECKPOINT 4] No existing enrollment
💳 [CHECKPOINT 5] Checking pending payments...
✅ [CHECKPOINT 5] No pending payment
💾 [CHECKPOINT 6] Creating payment record...
✅ [CHECKPOINT 6] Payment record created: payment_xxx
📤 [CHECKPOINT 7] Calling SePay service to create payment...
   ⏳ Waiting for SePay response (max 10s)...
✅ [CHECKPOINT 7] SePay service response received in XXXms
💾 [CHECKPOINT 8] Updating payment with SePay info...
✅ [CHECKPOINT 8] Payment updated with SePay info
📦 [CHECKPOINT 9] Building response data...
✅ [CHECKPOINT 9] Payment created successfully in XXXms
```

### 7.2. Logs Khi Timeout

Nếu SePay timeout, logs sẽ có:
```
❌ [CHECKPOINT 7] SePay error after 10000ms:
   Error: SePay service timeout after 10 seconds
   Error name: Error
   Error code: undefined
   🧹 Cleaning up payment record...
   ✅ Payment record deleted
```

**Response vẫn được gửi:**
```json
{
  "success": false,
  "message": "SePay service không phản hồi kịp thời. Vui lòng thử lại sau.",
  "errorType": "Error",
  "elapsed": 10000
}
```

---

## ⏱️ Bước 8: Test Timeout Scenarios

### 8.1. Test với Mock Mode (Fast Response)

**Setup:**
```bash
# Set environment variable
export SEPAY_API_KEY=""
# hoặc trong .env file
SEPAY_API_KEY=
```

**Restart Course Service:**
```bash
cd server/course-service
npm start
```

**Test:**
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "YOUR_COURSE_ID",
    "user_id": "YOUR_USER_ID"
  }'
```

**Expected:**
- Response time: **< 1 second**
- Payment method: `"mock"`
- Payment URL: `http://localhost:8080/payment/success?payment_id=xxx&mock=true`

---

### 8.2. Test với SePay Timeout

**Setup:**
```bash
# Set invalid SePay URL để force timeout
export SEPAY_API_URL="https://invalid-url-that-will-timeout.com"
```

**Test:**
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "YOUR_COURSE_ID",
    "user_id": "YOUR_USER_ID"
  }' \
  --max-time 30
```

**Expected:**
- Response time: **8-10 seconds** (không phải 30s)
- Status: `500 Internal Server Error`
- Message: `"SePay service không phản hồi kịp thời. Vui lòng thử lại sau."`
- **Không có ECONNABORTED error**

---

### 8.3. Test Response Timeout (25s)

**Setup:**
- Block MongoDB connection hoặc tạo delay lớn

**Expected:**
- Response trong **25 seconds** với status `504 Gateway Timeout`
- Message: `"Request timeout - server took too long to respond"`

---

## ✅ Bước 9: Success Criteria Checklist

Sau khi test, đảm bảo:

- [ ] ✅ API trả response trong **< 10 seconds** (mock) hoặc **< 15 seconds** (real)
- [ ] ✅ **Không có ECONNABORTED error**
- [ ] ✅ Frontend nhận được **JSON response hợp lệ**
- [ ] ✅ Payment được tạo trong **MongoDB database**
- [ ] ✅ User được **redirect đến payment URL**
- [ ] ✅ Tất cả **checkpoints được log** trong backend
- [ ] ✅ **Error cases** trả về status code và message đúng
- [ ] ✅ **Timeout scenarios** được xử lý đúng (không treo request)

---

## 🐛 Troubleshooting

### Vấn đề 1: Timeout vẫn xảy ra

**Kiểm tra:**
1. Course Service có đang chạy không?
   ```bash
   curl http://localhost:3004/test
   ```

2. MongoDB có kết nối không?
   - Check logs: `✅ MONGODB CONNECTED`

3. SePay service có timeout không?
   - Check logs: `❌ [CHECKPOINT 7] SePay error`

**Giải pháp:**
- Sử dụng mock mode: `SEPAY_API_KEY=""`
- Kiểm tra network connection
- Tăng timeout nếu cần (không khuyến khích)

---

### Vấn đề 2: 404 Not Found

**Kiểm tra:**
1. Route có được mount đúng không?
   ```bash
   curl http://localhost:3000/api/payments
   # Phải trả về info endpoint
   ```

2. API Gateway có proxy đúng không?
   - Check logs: `🔗 Routing to paymentsProxy`

**Giải pháp:**
- Restart API Gateway
- Kiểm tra `proxyRoutes.js`

---

### Vấn đề 3: 500 Internal Server Error

**Kiểm tra logs:**
```bash
# Backend logs sẽ có:
❌ ========== CREATE PAYMENT ERROR ==========
Error: ...
```

**Giải pháp:**
- Xem error message trong logs
- Kiểm tra MongoDB connection
- Kiểm tra SePay configuration

---

### Vấn đề 4: Frontend vẫn bị timeout

**Kiểm tra:**
1. Frontend có gọi đúng URL không?
   - Check Network tab: `POST /api/payments`
   - Không phải `POST /payments` (thiếu `/api`)

2. Axios timeout có đúng không?
   - Check `paymentAPI.js`: `timeout: 30000`

**Giải pháp:**
- Kiểm tra `API_BASE_URL` trong `paymentAPI.js`
- Đảm bảo API Gateway đang chạy

---

## 📝 Test Scripts

### Script 1: Quick Test (Bash)

```bash
#!/bin/bash

# Test 1: Connectivity
echo "Testing connectivity..."
curl -s http://localhost:3000/test | jq '.success'

# Test 2: Create Payment
echo "Testing create payment..."
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "YOUR_COURSE_ID",
    "user_id": "YOUR_USER_ID"
  }' | jq '.success'

# Test 3: Get Payment Status
echo "Testing get payment status..."
PAYMENT_ID=$(curl -s -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "YOUR_COURSE_ID",
    "user_id": "YOUR_USER_ID"
  }' | jq -r '.data.payment_id')

curl -s "http://localhost:3000/api/payments/${PAYMENT_ID}/status" | jq '.success'
```

### Script 2: Node.js Test

```javascript
const axios = require('axios');

async function testPayment() {
  const baseURL = 'http://localhost:3000/api/payments';
  
  try {
    // Test 1: Create Payment
    console.log('Testing create payment...');
    const createResponse = await axios.post(baseURL, {
      course_id: 'YOUR_COURSE_ID',
      user_id: 'YOUR_USER_ID'
    }, {
      timeout: 30000
    });
    
    console.log('✅ Create payment success:', createResponse.data);
    
    // Test 2: Get Payment Status
    const paymentId = createResponse.data.data.payment_id;
    console.log('Testing get payment status...');
    const statusResponse = await axios.get(`${baseURL}/${paymentId}/status`);
    console.log('✅ Get status success:', statusResponse.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testPayment();
```

---

## 📚 Tài Liệu Tham Khảo

- [Payment Fix Complete](./PAYMENT_FIX_COMPLETE.md)
- [SePay Integration Guide](./SEPAY_INTEGRATION_GUIDE.md)
- [Test Checklist](./TEST_CHECKLIST.md)

---

**Sau khi test xong, restart services và verify lại!** 🚀


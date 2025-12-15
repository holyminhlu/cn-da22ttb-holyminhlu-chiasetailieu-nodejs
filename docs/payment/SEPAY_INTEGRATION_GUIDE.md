# Hướng Dẫn Tích Hợp Thanh Toán SePay cho Khóa Học

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Cấu Hình Môi Trường](#cấu-hình-môi-trường)
3. [Cấu Trúc Hệ Thống](#cấu-trúc-hệ-thống)
4. [API Endpoints](#api-endpoints)
5. [Quy Trình Thanh Toán](#quy-trình-thanh-toán)
6. [Xử Lý Webhook](#xử-lý-webhook)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

## 🎯 Tổng Quan

Hệ thống thanh toán SePay được tích hợp để cho phép người dùng thanh toán mua khóa học có phí. Sau khi thanh toán thành công, hệ thống sẽ tự động tạo enrollment cho người dùng.

### Tính Năng

- ✅ Tạo payment link từ SePay
- ✅ Redirect người dùng đến trang thanh toán SePay
- ✅ Xử lý webhook callback từ SePay
- ✅ Tự động tạo enrollment sau khi thanh toán thành công
- ✅ Theo dõi trạng thái payment
- ✅ Hỗ trợ payment success/cancel pages

## ⚙️ Cấu Hình Môi Trường

### 1. Đăng Ký Tài Khoản SePay

1. Truy cập [SePay](https://sepay.vn/) và đăng ký tài khoản
2. Xác thực tài khoản và liên kết tài khoản ngân hàng
3. Lấy API credentials từ trang quản trị

### 2. Cài Đặt Dependencies

Cài đặt axios trong `course-service`:

```bash
cd server/course-service
npm install axios
```

### 3. Cấu Hình Environment Variables

Thêm các biến môi trường sau vào file `.env` của **course-service** (tạo file nếu chưa có):

```env
# SePay Configuration
SEPAY_API_KEY=your_sepay_api_key
SEPAY_SECRET_KEY=your_sepay_secret_key
SEPAY_MERCHANT_ID=your_merchant_id
SEPAY_API_URL=https://api.sepay.vn
SEPAY_SANDBOX=true

# Frontend & API Gateway URLs (cho return URLs và webhook)
FRONTEND_URL=http://localhost:8080
API_GATEWAY_URL=http://localhost:3000
```

**Lưu ý:** 
- Set `SEPAY_SANDBOX=true` khi test, `false` cho production
- Nếu chưa có SePay credentials, có thể để trống và test với mock data

### 4. Restart Services

**QUAN TRỌNG:** Sau khi cài đặt và cấu hình, cần restart cả 2 services:

```bash
# Terminal 1: Restart Course Service
cd server/course-service
# Dừng service hiện tại (Ctrl+C)
npm start

# Terminal 2: Restart API Gateway
cd server/api-gateway
# Dừng service hiện tại (Ctrl+C)
npm start
```

Kiểm tra services đã chạy:
- Course Service: http://localhost:3004/test
- API Gateway: http://localhost:3000/test
- Payment endpoint: http://localhost:3000/api/payments (sẽ trả về 404 cho GET, nhưng POST sẽ work)

## 🏗️ Cấu Trúc Hệ Thống

### Backend Structure

```
server/course-service/
├── models/
│   └── paymentModel.js          # Payment schema
├── controllers/
│   └── paymentController.js     # Payment logic
├── services/
│   └── sepayService.js          # SePay API integration
└── routes/
    └── paymentRoute.js           # Payment routes
```

### Frontend Structure

```
client/olf/src/
├── utils/
│   └── paymentAPI.js            # Payment API calls
├── views/
│   ├── PaymentSuccessView.vue   # Success page
│   └── PaymentCancelView.vue     # Cancel page
└── views/
    └── CourseIntroductionView.vue # Updated với payment flow
```

## 📡 API Endpoints

### 1. Tạo Payment Request

**Endpoint:** `POST /api/payments`

**Request Body:**
```json
{
  "course_id": "course_123",
  "customer_name": "Nguyễn Văn A",
  "customer_email": "user@example.com",
  "customer_phone": "0123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo payment link thành công",
  "data": {
    "payment_id": "payment_abc123",
    "payment_url": "https://sepay.vn/payment/...",
    "qr_code": "data:image/png;base64,...",
    "amount": 500000,
    "currency": "VND",
    "expires_at": "2024-12-15T10:30:00Z",
    "course": {
      "course_id": "course_123",
      "title": "Khóa học lập trình",
      "thumbnail": "..."
    }
  }
}
```

### 2. Kiểm Tra Trạng Thái Payment

**Endpoint:** `GET /api/payments/:payment_id/status`

**Response:**
```json
{
  "success": true,
  "data": {
    "payment_id": "payment_abc123",
    "status": "completed",
    "amount": 500000,
    "currency": "VND",
    "course_id": "course_123",
    "enrollment_id": "enrollment_xyz",
    "paid_at": "2024-12-15T10:25:00Z",
    "created_at": "2024-12-15T10:20:00Z",
    "expires_at": "2024-12-15T10:50:00Z"
  }
}
```

### 3. Lấy Danh Sách Payments của User

**Endpoint:** `GET /api/payments/user`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "payment_id": "payment_abc123",
      "course_id": "course_123",
      "amount": 500000,
      "currency": "VND",
      "status": "completed",
      "enrollment_id": "enrollment_xyz",
      "paid_at": "2024-12-15T10:25:00Z",
      "created_at": "2024-12-15T10:20:00Z"
    }
  ]
}
```

### 4. IPN (Instant Payment Notification) - SePay → Backend

**Endpoint:** `POST /api/payments/ipn`

**Alternative Endpoint (Webhook):** `POST /api/payments/webhook` (alias của IPN)

**Headers:**
```
X-SePay-Signature: <hmac_signature>
Content-Type: application/json
```

**Request Body (từ SePay):**
```json
{
  "transaction_id": "sepay_txn_123",
  "order_id": "payment_abc123",
  "status": "completed",
  "amount": 500000,
  "currency": "VND",
  "paid_at": "2024-12-15T10:25:00Z",
  "payment_method": "bank_transfer"
}
```

**Response (phải trả về 200 OK):**
```json
{
  "success": true,
  "message": "IPN processed successfully",
  "payment_id": "payment_abc123",
  "status": "completed",
  "enrollment_created": true
}
```

**Lưu ý quan trọng:**
- IPN endpoint **PHẢI** luôn trả về 200 OK, ngay cả khi có lỗi
- SePay sẽ retry nếu nhận được status code khác 200
- Implement idempotency để xử lý duplicate IPN

## 🔄 Quy Trình Thanh Toán

### Flow Diagram

```
User → Course Page → Click "Đăng ký" 
  → Check if course is free
    → Free: Enroll directly
    → Paid: Create payment
      → Redirect to SePay
        → User pays on SePay
          → SePay sends webhook
            → Backend processes webhook
              → Create enrollment
                → Redirect to success page
```

### Chi Tiết Các Bước

#### 1. User Click "Đăng Ký" trên Course Page

```javascript
// CourseIntroductionView.vue
const handleEnroll = async () => {
  // Check if course is free
  if (course.value.pricing.isFree) {
    // Enroll directly
    await enrollCourse(courseId, userId)
  } else {
    // Create payment
    const payment = await createPayment(courseId, customerInfo)
    // Redirect to SePay
    window.location.href = payment.data.payment_url
  }
}
```

#### 2. Backend Tạo Payment Record

```javascript
// paymentController.js
const payment = new Payment({
  user_id,
  course_id,
  amount: course.pricing.price,
  status: 'pending'
})
await payment.save()

// Create SePay payment link
const sepayResult = await sepayService.createPayment({
  orderId: payment.payment_id,
  amount: payment.amount,
  // ... other params
})
```

#### 3. User Thanh Toán trên SePay

- User được redirect đến SePay payment page
- Chọn phương thức thanh toán (Bank transfer, Wallet, etc.)
- Hoàn tất thanh toán

#### 4. SePay Gửi Webhook

```javascript
// paymentController.js - handleWebhook
exports.handleWebhook = async (req, res) => {
  // 1. Verify signature
  const isValid = sepayService.verifyWebhookSignature(webhookData, signature)
  
  // 2. Update payment status
  payment.status = 'completed'
  payment.paid_at = new Date()
  
  // 3. Create enrollment
  await createEnrollmentAfterPayment(payment)
  
  // 4. Return success
  res.json({ success: true })
}
```

#### 5. User Được Redirect về Success Page

- SePay redirect user về `/payment/success?payment_id=...`
- Frontend hiển thị thông tin thanh toán thành công
- User có thể vào học ngay hoặc xem "Khóa học của tôi"

## 🔔 Xử Lý IPN (Instant Payment Notification)

### Cấu Hình IPN trong SePay

1. Đăng nhập vào SePay Admin Panel
2. Vào mục "Tích hợp" > "IPN/Webhooks"
3. Thêm IPN URL: `http://your-domain.com/api/payments/ipn`
   - Hoặc sử dụng webhook URL: `http://your-domain.com/api/payments/webhook` (cùng endpoint)
4. Chọn events: `payment.completed`, `payment.failed`, `payment.cancelled`
5. Lưu IPN URL và verify signature

### IPN vs Webhook

- **IPN**: Instant Payment Notification - endpoint chuyên dụng cho payment notifications
- **Webhook**: Tên gọi chung cho callback mechanism
- Trong hệ thống này, cả 2 endpoint đều xử lý giống nhau (`/ipn` và `/webhook`)

### IPN Security

IPN được bảo mật bằng HMAC-SHA256 signature:

```javascript
// sepayService.js
verifyWebhookSignature(ipnData, signature) {
  const crypto = require('crypto')
  const payload = JSON.stringify(ipnData)
  const expectedSignature = crypto
    .createHmac('sha256', this.secretKey)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

### IPN Processing Flow

1. **Nhận IPN** từ SePay
2. **Verify Signature** để đảm bảo request hợp lệ
3. **Parse IPN Data** và validate format
4. **Tìm Payment Record** trong database
5. **Idempotency Check** - kiểm tra đã xử lý chưa
6. **Amount Validation** - đảm bảo amount không bị thay đổi
7. **Update Payment Status** trong database
8. **Create Enrollment** nếu payment completed
9. **Return 200 OK** cho SePay

### IPN Retry Policy

SePay sẽ tự động retry IPN nếu:
- Server trả về status code != 200
- Timeout (> 30s)
- Connection error

**QUAN TRỌNG:** 
- Luôn trả về **200 OK** ngay cả khi có lỗi để tránh retry không cần thiết
- Implement **idempotency** để xử lý duplicate IPN an toàn
- Log tất cả errors để xử lý manual nếu cần

### Idempotency

IPN handler đảm bảo idempotency bằng cách:
- Lưu IPN hash trong `sepay_callback_data`
- Kiểm tra hash trước khi xử lý
- Skip nếu IPN đã được xử lý trước đó

## 🧪 Testing

### 1. Test với SePay Sandbox

1. Set `SEPAY_SANDBOX=true` trong `.env`
2. Sử dụng sandbox API key từ SePay
3. Test payment flow với test cards/accounts

### 2. Test Payment Flow

```bash
# 1. Tạo payment
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "course_123",
    "customer_name": "Test User",
    "customer_email": "test@example.com"
  }'

# 2. Kiểm tra status
curl http://localhost:3000/api/payments/payment_abc123/status

# 3. Simulate webhook (development only)
curl -X POST http://localhost:3000/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "test_txn_123",
    "order_id": "payment_abc123",
    "status": "completed",
    "amount": 500000
  }'
```

### 3. Test Scenarios

- ✅ Free course enrollment (không qua payment)
- ✅ Paid course payment flow
- ✅ Payment success
- ✅ Payment cancel
- ✅ Payment timeout/expired
- ✅ Webhook processing
- ✅ Duplicate payment prevention

## 🐛 Troubleshooting

### Lỗi: "Failed to create payment link"

**Nguyên nhân:**
- SePay API key không đúng
- Network error
- Invalid request data

**Giải pháp:**
- Kiểm tra `SEPAY_API_KEY` trong `.env`
- Kiểm tra network connection
- Xem log trong `sepayService.js`

### Lỗi: "Webhook signature verification failed"

**Nguyên nhân:**
- Secret key không đúng
- Webhook data bị modify
- Signature header không đúng

**Giải pháp:**
- Kiểm tra `SEPAY_SECRET_KEY` trong `.env`
- Đảm bảo webhook URL là HTTPS (production)
- Kiểm tra header `X-SePay-Signature`

### Lỗi: "Payment completed but enrollment not created"

**Nguyên nhân:**
- Webhook không được gọi
- Enrollment creation failed
- Database error

**Giải pháp:**
- Kiểm tra webhook logs
- Kiểm tra enrollment creation logic
- Xem MongoDB logs

### Payment Status không cập nhật

**Nguyên nhân:**
- Webhook không đến
- Payment status check không hoạt động

**Giải pháp:**
- Implement polling mechanism (check status mỗi 5s)
- Kiểm tra webhook configuration
- Manual status check từ admin panel

## 📝 Best Practices

1. **Idempotency**: Đảm bảo webhook có thể được xử lý nhiều lần mà không tạo duplicate enrollment
2. **Error Handling**: Luôn log errors và trả về 200 OK cho webhook
3. **Security**: Verify webhook signature trước khi xử lý
4. **Timeout**: Set timeout hợp lý cho payment links (30 phút)
5. **Monitoring**: Monitor payment success rate và webhook delivery

## 🔐 Security Considerations

1. **API Keys**: Không commit API keys vào git
2. **Webhook Security**: Luôn verify signature
3. **HTTPS**: Sử dụng HTTPS cho webhook URLs (production)
4. **Rate Limiting**: Implement rate limiting cho payment endpoints
5. **Input Validation**: Validate tất cả input từ user và webhook

## 📚 Tài Liệu Tham Khảo

- [SePay Developer Documentation](https://developer.sepay.vn/)
- [SePay API Reference](https://developer.sepay.vn/api-reference)
- [Webhook Guide](https://developer.sepay.vn/webhooks)

## ✅ Checklist Triển Khai

- [ ] Đăng ký tài khoản SePay
- [ ] Lấy API credentials
- [ ] Cấu hình environment variables
- [ ] Test với sandbox
- [ ] Cấu hình webhook URL
- [ ] Test payment flow end-to-end
- [ ] Deploy lên production
- [ ] Monitor payment success rate
- [ ] Setup alerts cho failed payments

---

**Lưu ý:** Tài liệu này được cập nhật lần cuối vào: 2024-12-15


# Hướng Dẫn Cấu Hình SePay với Ngrok

## 📋 Thông Tin Cấu Hình

### SePay Configuration
- **Environment:** Sandbox
- **Authentication:** API Key + Secret Key
- **IPN Endpoint:** `https://restrainingly-cabbagy-eliz.ngrok-free.dev/api/payment/sepay/ipn`
- **Public URL:** `https://restrainingly-cabbagy-eliz.ngrok-free.dev`
- **Local Backend:** `http://localhost:3000` (API Gateway)

## ⚙️ Cấu Hình Environment Variables

### 1. Course Service (.env)

Thêm vào file `.env` của `server/course-service/`:

```env
# SePay Configuration
SEPAY_API_KEY=your_sepay_api_key
SEPAY_SECRET_KEY=your_sepay_secret_key
SEPAY_SANDBOX=true
SEPAY_ENV=sandbox

# Ngrok Configuration
NGROK_URL=https://restrainingly-cabbagy-eliz.ngrok-free.dev
SEPAY_IPN_PATH=/api/payment/sepay/ipn
SEPAY_IPN_URL=https://restrainingly-cabbagy-eliz.ngrok-free.dev/api/payment/sepay/ipn

# Frontend URLs
FRONTEND_URL=http://localhost:8080
API_GATEWAY_URL=http://localhost:3000
```

### 2. API Gateway (.env)

Thêm vào file `.env` của `server/api-gateway/` (nếu có):

```env
# Ngrok Configuration
NGROK_URL=https://restrainingly-cabbagy-eliz.ngrok-free.dev
```

## 🔧 Cấu Hình Ngrok

### 1. Khởi động Ngrok

```bash
ngrok http 3000
```

Ngrok sẽ tạo public URL: `https://restrainingly-cabbagy-eliz.ngrok-free.dev`

### 2. Kiểm tra Ngrok hoạt động

```bash
curl https://restrainingly-cabbagy-eliz.ngrok-free.dev/test
```

Phải trả về response từ API Gateway.

## 📨 Cấu Hình IPN trong SePay

### 1. Đăng nhập SePay Admin Panel

1. Truy cập SePay Sandbox Admin Panel
2. Vào mục **"Tích hợp"** > **"IPN/Webhooks"**
3. Thêm IPN URL: `https://restrainingly-cabbagy-eliz.ngrok-free.dev/api/payment/sepay/ipn`

### 2. Cấu Hình IPN Settings

- **IPN URL:** `https://restrainingly-cabbagy-eliz.ngrok-free.dev/api/payment/sepay/ipn`
- **Method:** POST
- **Content-Type:** application/json
- **Signature Header:** `X-SePay-Signature` hoặc `X-Signature`
- **Events:** `payment.completed`, `payment.failed`, `payment.cancelled`

## 🔐 Xác Thực SePay

### API Key + Secret Authentication

SePay sử dụng API Key và Secret Key để xác thực:

1. **API Key:** Dùng trong request headers và payload
2. **Secret Key:** Dùng để tạo signature cho IPN verification

### Request Headers

```javascript
{
  'Content-Type': 'application/json',
  'X-API-Key': 'your_api_key',
  'Authorization': 'Bearer your_api_key',
  'X-Signature': 'hmac_sha256_signature' // Nếu SePay yêu cầu
}
```

### IPN Signature Verification

SePay gửi IPN với signature trong header:

```javascript
// SePay gửi IPN với header
X-SePay-Signature: <hmac_sha256_signature>

// Backend verify signature
const crypto = require('crypto')
const payloadString = JSON.stringify(ipnData)
const expectedSignature = crypto
  .createHmac('sha256', secretKey)
  .update(payloadString)
  .digest('hex')
```

## 🔄 Flow Hoàn Chỉnh

### 1. User Click "Đăng ký"

```
Frontend → POST /api/payments
```

### 2. Backend Tạo Payment

```javascript
// Backend tạo payment với SePay
const payment = await sepayService.createPayment({
  orderId: 'payment_abc123',
  amount: 500000,
  description: 'Thanh toán khóa học',
  ipn_url: 'https://restrainingly-cabbagy-eliz.ngrok-free.dev/api/payment/sepay/ipn'
})
```

### 3. User Thanh Toán

```
User → SePay Checkout Page → Thanh toán
```

### 4. SePay Gửi IPN

```
SePay → POST https://restrainingly-cabbagy-eliz.ngrok-free.dev/api/payment/sepay/ipn
       Headers: X-SePay-Signature: <signature>
       Body: { transaction_id, order_id, status, amount, ... }
```

### 5. Backend Xử Lý IPN

```javascript
// API Gateway nhận IPN
/api/payment/sepay/ipn → Proxy → Course Service /payments/ipn

// Course Service verify signature và update payment
1. Verify signature với Secret Key
2. Tìm payment record
3. Update payment status
4. Tạo enrollment nếu completed
5. Return 200 OK
```

### 6. Redirect về Frontend

```
SePay → Frontend Success/Cancel Page
```

## 🧪 Testing

### 1. Test IPN Endpoint

```bash
# Test IPN endpoint với mock data
curl -X POST https://restrainingly-cabbagy-eliz.ngrok-free.dev/api/payment/sepay/ipn \
  -H "Content-Type: application/json" \
  -H "X-SePay-Signature: test_signature" \
  -d '{
    "transaction_id": "test_txn_123",
    "order_id": "payment_test_123",
    "status": "completed",
    "amount": 500000,
    "currency": "VND"
  }'
```

### 2. Test với SePay Sandbox

1. Tạo payment trong SePay Sandbox
2. Thực hiện thanh toán test
3. Kiểm tra IPN được gửi đến ngrok URL
4. Verify payment status được update trong database

### 3. Kiểm Tra Logs

```bash
# API Gateway logs
📨 SePay IPN Proxy: POST /api/payment/sepay/ipn

# Course Service logs
📨 ========== IPN RECEIVED ==========
✅ IPN signature verified
✅ Payment found: payment_abc123
📊 Status changed: processing -> completed
✅ Enrollment created successfully
```

## 🐛 Troubleshooting

### IPN không được nhận

**Nguyên nhân:**
- Ngrok không chạy
- IPN URL chưa được cấu hình trong SePay
- Firewall blocking

**Giải pháp:**
1. Kiểm tra ngrok đang chạy: `ngrok http 3000`
2. Verify IPN URL trong SePay admin panel
3. Test IPN endpoint với curl

### Signature Verification Failed

**Nguyên nhân:**
- Secret key không đúng
- Signature format không đúng
- Payload bị thay đổi

**Giải pháp:**
1. Kiểm tra `SEPAY_SECRET_KEY` trong `.env`
2. Verify signature generation trong SePay
3. Check logs để xem signature received vs expected

### Payment không được update

**Nguyên nhân:**
- Payment record không tìm thấy
- IPN data format không đúng
- Database error

**Giải pháp:**
1. Kiểm tra logs để xem payment có được tìm thấy không
2. Verify IPN data format
3. Check MongoDB connection

## ✅ Checklist

- [ ] Ngrok đã được khởi động và public URL hoạt động
- [ ] SePay API Key và Secret Key đã được cấu hình
- [ ] IPN URL đã được cấu hình trong SePay admin panel
- [ ] IPN endpoint `/api/payment/sepay/ipn` hoạt động
- [ ] Signature verification hoạt động đúng
- [ ] Payment status được update sau khi nhận IPN
- [ ] Enrollment được tạo tự động sau khi payment completed
- [ ] Test với SePay Sandbox thành công

## 📝 Lưu Ý

1. **Ngrok URL thay đổi:** Mỗi lần restart ngrok, URL sẽ thay đổi. Cần cập nhật lại trong SePay admin panel.

2. **Ngrok Free Plan:** Có giới hạn số request. Nên dùng ngrok paid plan cho production.

3. **IPN Timeout:** SePay có timeout cho IPN. Đảm bảo endpoint trả về response nhanh (< 5s).

4. **Signature Verification:** Luôn verify signature để đảm bảo IPN đến từ SePay thật.

5. **Idempotency:** Xử lý duplicate IPN an toàn để tránh tạo duplicate enrollment.

---

**Production:** Khi deploy production, thay ngrok URL bằng domain thật và cập nhật trong SePay admin panel.


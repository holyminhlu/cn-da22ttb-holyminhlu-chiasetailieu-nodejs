# Hướng Dẫn IPN (Instant Payment Notification) Endpoint

## 📋 Tổng Quan

IPN (Instant Payment Notification) là endpoint chuyên dụng để nhận thông báo thanh toán từ SePay. Khi có giao dịch thanh toán, SePay sẽ gửi IPN đến server của bạn để thông báo trạng thái thanh toán.

## 🔗 Endpoint

### IPN Endpoint
```
POST /api/payments/ipn
```

### Webhook Endpoint (Alias)
```
POST /api/payments/webhook
```

Cả 2 endpoint đều xử lý giống nhau, chỉ khác tên để tương thích với các hệ thống khác nhau.

## 🔐 Bảo Mật

### Signature Verification

IPN được bảo mật bằng HMAC-SHA256 signature. Header signature có thể là:
- `X-SePay-Signature`
- `X-Signature`
- `SePay-Signature`
- Query parameter `signature`

### Cấu Hình

Set `SEPAY_SECRET_KEY` trong environment variables để enable signature verification:

```env
SEPAY_SECRET_KEY=your_secret_key
```

Nếu không có secret key, signature verification sẽ bị skip (chỉ dùng cho development).

## 📥 IPN Request Format

### Headers
```
Content-Type: application/json
X-SePay-Signature: <hmac_sha256_signature>
```

### Body
```json
{
  "transaction_id": "sepay_txn_123456",
  "order_id": "payment_abc123",
  "status": "completed",
  "amount": 500000,
  "currency": "VND",
  "paid_at": "2024-12-15T10:25:00Z",
  "payment_method": "bank_transfer",
  "customer_info": {
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789"
  }
}
```

### Status Values

- `completed` / `success` / `paid` → Payment thành công
- `failed` / `fail` → Payment thất bại
- `cancelled` / `cancel` → Payment bị hủy
- `pending` / `processing` → Payment đang xử lý

## 📤 IPN Response Format

### Success Response
```json
{
  "success": true,
  "message": "IPN processed successfully",
  "payment_id": "payment_abc123",
  "status": "completed",
  "enrollment_created": true
}
```

### Error Response (vẫn trả về 200 OK)
```json
{
  "success": false,
  "message": "IPN processing error",
  "error": "Error details (development only)",
  "note": "Error logged for manual review"
}
```

**QUAN TRỌNG:** Luôn trả về 200 OK để SePay không retry liên tục.

## 🔄 Quy Trình Xử Lý IPN

### 1. Nhận IPN Request
```
SePay → POST /api/payments/ipn
```

### 2. Verify Signature
```javascript
const isValid = sepayService.verifyWebhookSignature(ipnData, signature)
if (!isValid) {
  return res.status(401).json({ success: false, message: 'Invalid signature' })
}
```

### 3. Parse IPN Data
```javascript
const parsedData = sepayService.parseWebhook(ipnData)
// Returns: { transactionId, orderId, status, amount, currency, paidAt, ... }
```

### 4. Tìm Payment Record
```javascript
const payment = await Payment.findOne({
  $or: [
    { payment_id: parsedData.orderId },
    { sepay_transaction_id: parsedData.transactionId }
  ]
})
```

### 5. Idempotency Check
```javascript
// Kiểm tra IPN đã được xử lý chưa
const ipnHash = `${transactionId}_${status}_${amount}`
if (payment.sepay_callback_data?.ipn_hash === ipnHash && 
    payment.status === 'completed') {
  // Skip - đã xử lý
  return res.json({ success: true, message: 'IPN already processed' })
}
```

### 6. Amount Validation
```javascript
// Đảm bảo amount không bị thay đổi (bảo mật)
if (Math.abs(payment.amount - parsedData.amount) > 0.01) {
  return res.status(400).json({ 
    success: false, 
    message: 'Amount mismatch - possible fraud attempt' 
  })
}
```

### 7. Update Payment Status
```javascript
payment.status = 'completed'
payment.paid_at = parsedData.paidAt || new Date()
payment.sepay_callback_data = { ...ipnData, ipn_hash: ipnHash }
await payment.save()
```

### 8. Create Enrollment
```javascript
if (payment.status === 'completed' && !payment.enrollment_id) {
  await createEnrollmentAfterPayment(payment)
}
```

### 9. Return Response
```javascript
return res.status(200).json({
  success: true,
  message: 'IPN processed successfully',
  payment_id: payment.payment_id,
  status: payment.status
})
```

## 🛡️ Security Features

### 1. Signature Verification
- Verify HMAC-SHA256 signature từ SePay
- Reject nếu signature không hợp lệ

### 2. Amount Validation
- Kiểm tra amount không bị thay đổi
- Reject nếu amount mismatch (có thể là fraud)

### 3. Idempotency
- Xử lý duplicate IPN an toàn
- Không tạo duplicate enrollment

### 4. Error Handling
- Luôn trả về 200 OK để tránh retry
- Log tất cả errors để xử lý manual

## 🧪 Testing IPN

### 1. Test với Mock IPN

```bash
curl -X POST http://localhost:3000/api/payments/ipn \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "test_txn_123",
    "order_id": "payment_test_123",
    "status": "completed",
    "amount": 500000,
    "currency": "VND",
    "paid_at": "2024-12-15T10:25:00Z"
  }'
```

### 2. Test với Signature

```bash
# Generate signature (example)
SIGNATURE=$(echo -n '{"transaction_id":"test","order_id":"test","status":"completed","amount":500000}' | \
  openssl dgst -sha256 -hmac "your_secret_key" | cut -d' ' -f2)

curl -X POST http://localhost:3000/api/payments/ipn \
  -H "Content-Type: application/json" \
  -H "X-SePay-Signature: $SIGNATURE" \
  -d '{
    "transaction_id": "test_txn_123",
    "order_id": "payment_test_123",
    "status": "completed",
    "amount": 500000
  }'
```

### 3. Test Scenarios

- ✅ IPN với status `completed` → Tạo enrollment
- ✅ IPN với status `failed` → Update payment status
- ✅ Duplicate IPN → Skip (idempotency)
- ✅ Invalid signature → Reject
- ✅ Amount mismatch → Reject
- ✅ Payment not found → Log và return 200

## 📊 IPN Logging

Tất cả IPN requests được log chi tiết:

```
📨 ========== IPN RECEIVED ==========
Time: 2024-12-15T10:25:00Z
Headers: {...}
Body: {...}
✅ IPN signature verified
📋 Parsed IPN data: {...}
✅ Payment found: payment_abc123
📊 Status changed: processing -> completed
✅ Payment updated
🎓 Creating enrollment after payment completion...
✅ Enrollment created successfully
✅ IPN processed successfully in 150ms
```

## 🔍 Troubleshooting

### IPN không được gọi

**Nguyên nhân:**
- IPN URL chưa được cấu hình trong SePay
- Firewall/Network blocking
- Server không accessible từ internet

**Giải pháp:**
- Kiểm tra IPN URL trong SePay admin panel
- Test IPN endpoint với curl/Postman
- Sử dụng ngrok để expose local server (development)

### IPN bị reject (401)

**Nguyên nhân:**
- Signature không đúng
- Secret key không đúng

**Giải pháp:**
- Kiểm tra `SEPAY_SECRET_KEY` trong `.env`
- Verify signature generation trong SePay
- Tạm thời disable signature verification để test (development only)

### Payment không được update

**Nguyên nhân:**
- Payment record không tìm thấy
- IPN data format không đúng
- Database error

**Giải pháp:**
- Kiểm tra logs để xem payment có được tìm thấy không
- Verify IPN data format
- Kiểm tra MongoDB connection

### Duplicate Enrollment

**Nguyên nhân:**
- IPN được xử lý nhiều lần
- Idempotency check không hoạt động

**Giải pháp:**
- Kiểm tra idempotency logic
- Verify `sepay_callback_data.ipn_hash` được lưu đúng
- Xóa duplicate enrollment manual nếu cần

## ✅ Best Practices

1. **Always return 200 OK** - Ngay cả khi có lỗi
2. **Implement idempotency** - Xử lý duplicate IPN an toàn
3. **Validate amount** - Đảm bảo không bị fraud
4. **Log everything** - Để debug và audit
5. **Handle errors gracefully** - Không throw error, chỉ log
6. **Test thoroughly** - Test tất cả scenarios
7. **Monitor IPN delivery** - Track success rate

## 📝 Checklist

- [ ] IPN endpoint đã được tạo (`/api/payments/ipn`)
- [ ] Signature verification đã được implement
- [ ] Idempotency check đã được implement
- [ ] Amount validation đã được implement
- [ ] Error handling đã được implement
- [ ] Logging đã được setup
- [ ] IPN URL đã được cấu hình trong SePay
- [ ] Test với mock IPN đã pass
- [ ] Test với real SePay IPN đã pass

---

**Lưu ý:** IPN endpoint phải luôn accessible và trả về response nhanh (< 5s) để tránh timeout.


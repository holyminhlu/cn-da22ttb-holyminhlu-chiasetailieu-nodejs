# Hướng Dẫn Tích Hợp SePay SDK

## 📦 Cài Đặt

### 1. Cài đặt package

```bash
cd server/course-service
npm install sepay-pg-node
```

### 2. Cấu hình Environment Variables

Thêm vào file `.env` của `course-service`:

```env
# SePay Configuration
SEPAY_MERCHANT_ID=your_merchant_id
SEPAY_SECRET_KEY=your_secret_key
SEPAY_SANDBOX=true  # Set false cho production

# Frontend URLs
FRONTEND_URL=http://localhost:8080
API_GATEWAY_URL=http://localhost:3000
```

## 🔧 Cấu Hình SDK

SDK sẽ tự động được khởi tạo trong `sepayService.js`:

```javascript
const sepayService = new SePayService()
// SDK client sẽ tự động được tạo nếu có merchant_id và secret_key
```

## 💳 Tạo Checkout Form

### Backend (sepayService.js)

SDK tự động tạo checkout form khi gọi `createPayment()`:

```javascript
const checkout = sepayService.createCheckoutForm({
  orderId: 'payment_abc123',
  amount: 500000,
  description: 'Thanh toán khóa học',
  returnUrl: 'http://localhost:8080/payment/success',
  cancelUrl: 'http://localhost:8080/payment/cancel',
  errorUrl: 'http://localhost:8080/payment/cancel',
  paymentMethod: 'BANK_TRANSFER' // Optional
})
```

### Response Format

```json
{
  "success": true,
  "checkout_url": "https://checkout.sepay.vn/...",
  "form_fields": {
    "field1": "value1",
    "field2": "value2",
    ...
  },
  "method": "sdk"
}
```

## 🎨 Frontend Integration

### 1. Nhận Checkout Form từ API

```javascript
const paymentResponse = await createPayment(courseId, {
  customer_name: 'Nguyễn Văn A',
  customer_email: 'user@example.com',
  customer_phone: '0123456789'
})
```

### 2. Submit Form (Tự động)

Nếu response có `form_fields` và `checkout_url`, hệ thống sẽ tự động submit form:

```javascript
if (paymentResponse.data.form_fields && paymentResponse.data.checkout_url) {
  submitCheckoutForm(
    paymentResponse.data.checkout_url,
    paymentResponse.data.form_fields
  )
}
```

### 3. Function submitCheckoutForm

```javascript
const submitCheckoutForm = (checkoutUrl, formFields) => {
  // Tạo form element
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = checkoutUrl
  form.style.display = 'none'
  
  // Thêm các form fields
  Object.keys(formFields).forEach(key => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = formFields[key]
    form.appendChild(input)
  })
  
  // Submit form
  document.body.appendChild(form)
  form.submit()
}
```

## 📋 Payment Methods

SePay hỗ trợ các payment methods:

- `BANK_TRANSFER` - Chuyển khoản ngân hàng (mặc định)
- `CREDIT_CARD` - Thẻ tín dụng
- `E_WALLET` - Ví điện tử
- `QR_CODE` - QR Code

Ví dụ:

```javascript
const checkout = sepayService.createCheckoutForm({
  // ...
  paymentMethod: 'BANK_TRANSFER'
})
```

## 🔄 Flow Hoàn Chỉnh

### 1. User Click "Đăng ký"

```
User → Frontend → POST /api/payments
```

### 2. Backend Tạo Payment

```javascript
// Backend tạo payment record
const payment = new Payment({ ... })
await payment.save()

// Tạo checkout form với SDK
const checkout = sepayService.createCheckoutForm({ ... })

// Return checkout URL và form fields
return {
  checkout_url: checkout.checkoutUrl,
  form_fields: checkout.formFields
}
```

### 3. Frontend Submit Form

```javascript
// Frontend tự động submit form
submitCheckoutForm(checkoutUrl, formFields)
```

### 4. User Thanh Toán

```
User → SePay Checkout Page → Thanh toán
```

### 5. SePay Callback

```
SePay → POST /api/payments/ipn → Update payment status
```

### 6. Redirect về Frontend

```
SePay → Frontend Success/Cancel Page
```

## 🧪 Testing

### 1. Test với Sandbox

Set `SEPAY_SANDBOX=true` trong `.env`:

```env
SEPAY_SANDBOX=true
SEPAY_MERCHANT_ID=test_merchant_id
SEPAY_SECRET_KEY=test_secret_key
```

### 2. Test Checkout Form

```bash
# Tạo payment
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "test_course_id",
    "user_id": "test_user_id"
  }'
```

Response sẽ có `form_fields` và `checkout_url` nếu SDK hoạt động.

### 3. Test Form Submission

Mở browser console và test:

```javascript
const formFields = { /* từ API response */ }
const checkoutUrl = 'https://sandbox.sepay.vn/checkout'
submitCheckoutForm(checkoutUrl, formFields)
```

## 🐛 Troubleshooting

### SDK không được load

**Lỗi:** `SePay SDK not found`

**Giải pháp:**
```bash
cd server/course-service
npm install sepay-pg-node
```

### SDK Client không được khởi tạo

**Lỗi:** `SePay SDK client not initialized`

**Nguyên nhân:**
- Thiếu `SEPAY_MERCHANT_ID` hoặc `SEPAY_SECRET_KEY`
- Environment variables chưa được load

**Giải pháp:**
- Kiểm tra `.env` file
- Restart service sau khi thêm env vars

### Form không submit

**Nguyên nhân:**
- `form_fields` hoặc `checkout_url` không có trong response
- JavaScript error khi submit

**Giải pháp:**
- Kiểm tra browser console
- Verify API response có `form_fields`
- Kiểm tra `submitCheckoutForm` function

## 📚 Tài Liệu Tham Khảo

- [SePay SDK Documentation](https://www.npmjs.com/package/sepay-pg-node)
- [SePay API Documentation](https://developer.sepay.vn/)
- [SePay Integration Guide](./SEPAY_INTEGRATION_GUIDE.md)

## ✅ Checklist

- [ ] Đã cài `npm install sepay-pg-node`
- [ ] Đã cấu hình `SEPAY_MERCHANT_ID` và `SEPAY_SECRET_KEY`
- [ ] SDK client đã được khởi tạo (check logs)
- [ ] Checkout form được tạo thành công
- [ ] Frontend có thể submit form
- [ ] User có thể thanh toán trên SePay
- [ ] IPN callback hoạt động đúng
- [ ] Enrollment được tạo sau khi thanh toán

---

**Lưu ý:** SDK sẽ tự động fallback về manual API nếu không có SDK package hoặc credentials.


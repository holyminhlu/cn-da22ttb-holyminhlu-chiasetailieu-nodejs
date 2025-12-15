# Quick Start - SePay Payment Integration

## ⚡ Các Bước Nhanh

### 1. Cài Đặt Dependencies

```bash
cd server/course-service
npm install axios
```

### 2. Restart Services (QUAN TRỌNG!)

Sau khi thêm payment routes, **BẮT BUỘC** phải restart cả 2 services:

#### Terminal 1: Course Service
```bash
cd server/course-service
# Dừng service hiện tại (Ctrl+C nếu đang chạy)
npm start
```

**Kiểm tra:** Mở http://localhost:3004/test - phải thấy response thành công

#### Terminal 2: API Gateway
```bash
cd server/api-gateway
# Dừng service hiện tại (Ctrl+C nếu đang chạy)
npm start
```

**Kiểm tra:** Mở http://localhost:3000/test - phải thấy response thành công

### 3. Kiểm Tra Payment Route

Sau khi restart, kiểm tra payment endpoint:

```bash
# Test POST payment (sẽ trả về lỗi validation nhưng route phải tồn tại)
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"course_id":"test"}'
```

Nếu thấy lỗi validation (400/401) thay vì 404 → Route đã hoạt động ✅

### 4. Cấu Hình SePay (Tùy chọn cho testing)

Nếu chưa có SePay credentials, có thể test với mock data bằng cách:

1. Tạo file `.env` trong `server/course-service/`:
```env
SEPAY_SANDBOX=true
FRONTEND_URL=http://localhost:8080
API_GATEWAY_URL=http://localhost:3000
```

2. Sửa `sepayService.js` để return mock data khi không có API key (tùy chọn)

### 5. Test Payment Flow

1. Tạo một khóa học có phí (price > 0, isFree = false)
2. Vào trang chi tiết khóa học
3. Click "Đăng ký"
4. Nếu khóa học có phí → Sẽ redirect đến SePay (hoặc hiển thị payment link)

## 🐛 Troubleshooting

### Lỗi 404: Route không tồn tại

**Nguyên nhân:** Services chưa restart

**Giải pháp:**
1. Dừng tất cả services (Ctrl+C)
2. Restart Course Service trước
3. Restart API Gateway sau
4. Kiểm tra logs xem có lỗi khi load routes không

### Lỗi: "Cannot find module 'axios'"

**Giải pháp:**
```bash
cd server/course-service
npm install axios
```

### Lỗi: "Payment controllers loaded successfully" không xuất hiện

**Nguyên nhân:** Có lỗi khi load paymentController

**Giải pháp:**
1. Kiểm tra console logs của course-service
2. Xem có lỗi syntax trong paymentController.js không
3. Đảm bảo tất cả dependencies đã được cài đặt

## ✅ Checklist

- [ ] Đã cài `npm install axios` trong course-service
- [ ] Đã restart Course Service
- [ ] Đã restart API Gateway  
- [ ] Test endpoint `/api/payments` không còn 404
- [ ] Có thể tạo payment cho khóa học có phí

---

**Lưu ý:** Nếu vẫn gặp lỗi 404 sau khi restart, kiểm tra:
1. Logs của API Gateway xem có load paymentsProxy không
2. Logs của Course Service xem có load paymentRoute không
3. Đảm bảo không có syntax errors trong các file mới tạo


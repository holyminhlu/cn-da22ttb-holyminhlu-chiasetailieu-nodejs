# Environment Variables Setup cho SePay với Ngrok

## 📋 File .env cho Course Service

Tạo hoặc cập nhật file `.env` trong `server/course-service/`:

```env
# ============================================
# SePay Configuration
# ============================================
SEPAY_API_KEY=your_sepay_api_key_here
SEPAY_SECRET_KEY=your_sepay_secret_key_here
SEPAY_SANDBOX=true
SEPAY_ENV=sandbox

# SePay API URLs (optional, có default)
SEPAY_API_URL=https://api.sepay.vn
SEPAY_SANDBOX_URL=https://sandbox.sepay.vn

# ============================================
# Ngrok Configuration
# ============================================
NGROK_URL=https://restrainingly-cabbagy-eliz.ngrok-free.dev
SEPAY_IPN_PATH=/api/payment/sepay/ipn
SEPAY_IPN_URL=https://restrainingly-cabbagy-eliz.ngrok-free.dev/api/payment/sepay/ipn

# ============================================
# Frontend & API Gateway URLs
# ============================================
FRONTEND_URL=http://localhost:8080
API_GATEWAY_URL=http://localhost:3000

# ============================================
# MongoDB Configuration (nếu cần)
# ============================================
MONGODB_URI=mongodb://localhost:27017/edushare
```

## 📋 File .env cho API Gateway

Tạo hoặc cập nhật file `.env` trong `server/api-gateway/` (nếu có):

```env
# ============================================
# Server Configuration
# ============================================
PORT=3000
NODE_ENV=development

# ============================================
# Ngrok Configuration (optional)
# ============================================
NGROK_URL=https://restrainingly-cabbagy-eliz.ngrok-free.dev
```

## 🔑 Lấy SePay Credentials

### 1. Đăng nhập SePay Sandbox

1. Truy cập SePay Sandbox Admin Panel
2. Vào mục **"Tài khoản"** > **"API Credentials"**
3. Copy **API Key** và **Secret Key**

### 2. Cập nhật .env

```env
SEPAY_API_KEY=sk_sandbox_xxxxxxxxxxxxx
SEPAY_SECRET_KEY=secret_xxxxxxxxxxxxx
```

## 🚀 Khởi Động Services

### 1. Start MongoDB

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

### 2. Start Ngrok

```bash
ngrok http 3000
```

Copy public URL: `https://restrainingly-cabbagy-eliz.ngrok-free.dev`

### 3. Start Course Service

```bash
cd server/course-service
npm install  # Nếu chưa cài dependencies
npm start
```

### 4. Start API Gateway

```bash
cd server/api-gateway
npm install  # Nếu chưa cài dependencies
npm start
```

## ✅ Verification

### 1. Kiểm tra Course Service

```bash
curl http://localhost:3004/test
```

Phải thấy logs:
```
🔧 SePay Service Configuration:
   Environment: SANDBOX
   API URL: https://sandbox.sepay.vn
   IPN URL: https://restrainingly-cabbagy-eliz.ngrok-free.dev/api/payment/sepay/ipn
   API Key: ✅ Set
   Secret Key: ✅ Set
```

### 2. Kiểm tra API Gateway

```bash
curl http://localhost:3000/test
```

### 3. Kiểm tra Ngrok

```bash
curl https://restrainingly-cabbagy-eliz.ngrok-free.dev/test
```

### 4. Kiểm tra IPN Endpoint

```bash
curl -X POST https://restrainingly-cabbagy-eliz.ngrok-free.dev/api/payment/sepay/ipn \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 🔄 Cập Nhật Ngrok URL

Nếu ngrok URL thay đổi:

1. **Cập nhật .env:**
```env
NGROK_URL=https://new-ngrok-url.ngrok-free.dev
SEPAY_IPN_URL=https://new-ngrok-url.ngrok-free.dev/api/payment/sepay/ipn
```

2. **Restart Course Service:**
```bash
cd server/course-service
npm start
```

3. **Cập nhật trong SePay Admin Panel:**
   - Vào **"Tích hợp"** > **"IPN/Webhooks"**
   - Cập nhật IPN URL mới

## 🐛 Troubleshooting

### Environment variables không được load

**Giải pháp:**
- Đảm bảo file `.env` nằm trong thư mục `server/course-service/`
- Restart service sau khi thay đổi `.env`
- Kiểm tra logs để xem variables có được load không

### Ngrok URL không hoạt động

**Giải pháp:**
- Kiểm tra ngrok đang chạy: `ngrok http 3000`
- Verify API Gateway đang chạy tại port 3000
- Test ngrok URL với curl

### SePay credentials không đúng

**Giải pháp:**
- Verify API Key và Secret Key trong SePay admin panel
- Đảm bảo đang dùng Sandbox credentials (không phải Production)
- Check logs để xem có lỗi authentication không

---

**Lưu ý:** Không commit file `.env` vào git. Thêm vào `.gitignore`:

```
.env
.env.local
.env.*.local
```


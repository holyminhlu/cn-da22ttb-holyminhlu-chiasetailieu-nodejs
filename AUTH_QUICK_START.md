# ⚡ Quick Start - Authentication API

## 🚀 Bước Nhanh

### **1. Cài đặt dependencies (nếu chưa có uuid):**
```bash
cd server/auth-service
npm install
```

### **2. Khởi động MongoDB:**
```bash
# Windows
net start MongoDB

# Hoặc kiểm tra MongoDB đã chạy
mongosh mongodb://127.0.0.1:27017
```

### **3. Khởi động server:**
```bash
cd server/auth-service
npm start
```

### **4. Test đăng ký:**
```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "passWord": "password123"
  }'
```

### **5. Test đăng nhập:**
```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "passWord": "password123"
  }'
```

---

## ✅ Hoàn Thành!

Bạn đã có hệ thống authentication hoàn chỉnh với:
- ✅ Đăng ký user
- ✅ Đăng nhập với JWT token
- ✅ MongoDB local storage
- ✅ Password hashing (bcrypt)
- ✅ Validation đầy đủ

**Xem chi tiết:**
- `AUTH_API_DOCUMENTATION.md` - API docs
- `AUTH_SETUP_GUIDE.md` - Setup guide





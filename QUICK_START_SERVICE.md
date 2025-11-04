# ⚡ Quick Start Service & Test

## 🚀 Tự Động Start Service và Test

Tôi đã tạo script **tự động start service và test**!

---

## 🎯 Cách Sử Dụng

### **Option 1: Tự Động (Khuyên dùng)**

```bash
cd server/auth-service
node start-and-test.js
```

**Script sẽ:**
1. ✅ Check service có đang chạy không
2. ✅ Nếu chưa → Tự động start service
3. ✅ Đợi service ready
4. ✅ Test register endpoint
5. ✅ Hiển thị kết quả

---

### **Option 2: Thủ Công**

```bash
# Terminal 1: Start service
cd server/auth-service
npm start

# Terminal 2: Test request (sau khi service start)
node debug-request.js
```

---

## 📋 Workflow Tự Động

```
1. Check service running?
   ↓
   ├─ Yes → Bước 2
   └─ No → Start service → Wait → Bước 2

2. Test register endpoint
   ↓
   ├─ Success → ✅ All OK!
   └─ Failed → ❌ Xem error message
```

---

## 🎯 Kết Quả Mong Đợi

### **Nếu Service Chưa Chạy:**

```
🚀 ========== AUTO START & TEST ==========

🔍 Checking if service is running...
❌ Service is not running

📦 Service không chạy. Đang khởi động...
🚀 Starting auth-service...
✅ Service started successfully!

⏳ Waiting for service to be ready...

🧪 Testing register endpoint...
✅ REGISTER TEST: SUCCESS!
   User created: test_auto_1234567890@example.com

✅ TẤT CẢ TEST PASS!
   Backend hoạt động bình thường!
```

---

### **Nếu Service Đã Chạy:**

```
🔍 Checking if service is running...
✅ Service is already running!

🧪 Testing register endpoint...
✅ REGISTER TEST: SUCCESS!
```

---

## ⚠️ Lưu Ý

1. **Script sẽ start service trong background**
   - Service sẽ tiếp tục chạy sau khi script kết thúc
   - Để stop: Tìm process và kill

2. **Nếu có lỗi khi start:**
   - Check port 3001 có bị chiếm không
   - Check MongoDB có chạy không
   - Start thủ công để xem error chi tiết

3. **Nếu test failed:**
   - Xem error message
   - Check console log của service
   - Run `debug-register.js` để kiểm tra hệ thống

---

## 🔧 Troubleshooting

### **Lỗi: Port 3001 đã bị chiếm**

```bash
# Check process
netstat -ano | findstr 3001

# Kill process (thay PID)
taskkill /PID <PID> /F

# Hoặc restart máy
```

### **Lỗi: MongoDB chưa chạy**

```bash
net start MongoDB
```

### **Lỗi: Service không start**

```bash
# Start thủ công để xem error
cd server/auth-service
npm start
```

---

## ✅ Quick Test

```bash
cd server/auth-service
node start-and-test.js
```

**Chỉ 1 lệnh - tự động làm tất cả! 🚀**






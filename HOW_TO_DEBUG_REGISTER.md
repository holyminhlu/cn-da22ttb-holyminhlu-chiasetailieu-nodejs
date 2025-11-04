# 🔍 Cách Xác Định Lỗi Đăng Ký

## 🎯 3 Công Cụ Debug

Tôi đã tạo **3 script tự động** để xác định lỗi:

---

## 📋 Công Cụ 1: `debug-register.js` - Kiểm Tra Hệ Thống

**Mục đích:** Kiểm tra tất cả thành phần backend (MongoDB, Model, Dependencies, etc.)

### **Chạy:**

```bash
cd server/auth-service
node debug-register.js
```

### **Sẽ kiểm tra:**

✅ MongoDB Connection  
✅ Model Import  
✅ Dependencies (bcrypt, jwt, mongoose, uuid)  
✅ Create User (thử tạo user thật)  
✅ Email Check  
✅ Existing Users  

### **Khi nào dùng:**

- Khi service không hoạt động
- Khi không biết lỗi ở đâu
- Trước khi test request

---

## 📋 Công Cụ 2: `debug-request.js` - Test Request

**Mục đích:** Test request đăng ký thật với logging chi tiết

### **Chạy:**

```bash
# Terminal 1: Chạy service
cd server/auth-service
npm start

# Terminal 2: Chạy debug
node debug-request.js
```

### **Sẽ test:**

✅ Service health check  
✅ Send POST /register  
✅ Log response chi tiết  
✅ Xác định lỗi cụ thể  

### **Khi nào dùng:**

- Service đang chạy
- Muốn test request thật
- Muốn xem response chi tiết

---

## 📋 Công Cụ 3: `run-all-debug.js` - Chạy Tất Cả

**Mục đích:** Chạy cả 2 script trên tự động

### **Chạy:**

```bash
cd server/auth-service

# Đảm bảo service đang chạy trước
npm start

# Terminal khác
node run-all-debug.js
```

---

## 🚀 Quick Start

### **Bước 1: Kiểm Tra Hệ Thống**

```bash
cd server/auth-service
node debug-register.js
```

**Xem kết quả:**
- ✅ All PASS → Hệ thống OK
- ❌ Có FAIL → Fix lỗi đó

### **Bước 2: Start Service**

```bash
npm start
```

**Kiểm tra:**
- Thấy "Auth-Service đang lắng nghe"
- Thấy "Kết nối MongoDB thành công"

### **Bước 3: Test Request**

```bash
# Terminal khác
node debug-request.js
```

**Xem kết quả:**
- ✅ Success → Mọi thứ OK
- ❌ Failed → Xem message

---

## 🔍 Phân Tích Kết Quả

### **Kết Quả 1: System Check FAIL**

**Ví dụ:**
```
❌ MongoDB Connection Failed
💡 Solutions:
1. Check MongoDB đã chạy: net start MongoDB
```

**Action:** Fix lỗi được chỉ ra → Chạy lại system check

---

### **Kết Quả 2: System Check PASS, Request FAIL**

**Ví dụ:**
```
✅ System check: All PASS
❌ REGISTER FAILED!
   Message: Email đã được sử dụng!
```

**Action:** 
- Check email đã tồn tại chưa
- Dùng email khác
- Hoặc xóa user cũ

---

### **Kết Quả 3: Request Timeout**

**Ví dụ:**
```
❌ REQUEST ERROR
Error: connect ECONNREFUSED
💡 Service chưa chạy
```

**Action:** 
- Start service: `npm start`
- Check port 3001 có bị chiếm không

---

## 📊 Bảng So Sánh

| Tình Huống | System Check | Request Test | Nguyên Nhân |
|------------|-------------|--------------|-------------|
| ✅ PASS | ✅ PASS | Backend OK, Request OK |
| ✅ PASS | ❌ FAIL | Request format sai hoặc service chưa chạy |
| ❌ FAIL | - | Backend có lỗi (MongoDB, Model, etc.) |
| ❌ FAIL | ❌ FAIL | Cả backend và request đều lỗi |

---

## 🎯 Workflow Debug

```
1. Chạy debug-register.js
   ↓
   ├─ PASS → Bước 2
   └─ FAIL → Fix lỗi → Chạy lại

2. Start service (npm start)
   ↓
   Kiểm tra: Service đang chạy?
   ↓
   ├─ Yes → Bước 3
   └─ No → Fix và start lại

3. Chạy debug-request.js
   ↓
   ├─ PASS → Hệ thống OK!
   └─ FAIL → Xem error message → Fix
```

---

## 💡 Tips

### **Nếu System Check FAIL:**

1. **MongoDB không kết nối:**
   ```bash
   net start MongoDB
   mongosh mongodb://127.0.0.1:27017
   ```

2. **Thiếu dependency:**
   ```bash
   npm install
   ```

3. **Model lỗi:**
   - Check syntax trong `models/authModel.js`
   - Check có import đúng không

### **Nếu Request Test FAIL:**

1. **Service chưa chạy:**
   ```bash
   npm start
   ```

2. **Port bị chiếm:**
   ```bash
   netstat -ano | findstr 3001
   # Kill process nếu cần
   ```

3. **Request format sai:**
   - Check headers: `Content-Type: application/json`
   - Check method: `POST` không phải `GET`
   - Check body: JSON hợp lệ

---

## 📞 Cần Giúp?

**Sau khi chạy debug scripts, cung cấp:**

1. **Output của `debug-register.js`** (toàn bộ)
2. **Output của `debug-request.js`** (toàn bộ)
3. **Console log của service** (khi chạy debug-request)
4. **Error message cụ thể** (nếu có)

---

## ✅ Kết Luận

**Chạy ngay:**

```bash
cd server/auth-service
node debug-register.js
```

Script sẽ **tự động xác định** lỗi và đưa ra hướng dẫn fix!

**Xem chi tiết:** `DEBUG_REGISTER_GUIDE.md`






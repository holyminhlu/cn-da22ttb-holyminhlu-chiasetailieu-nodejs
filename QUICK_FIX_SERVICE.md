# ⚡ Quick Fix: Service Không Hoạt Động

## 🚀 Các Bước Nhanh Nhất

### **Bước 1: Restart Service**

```bash
cd server/auth-service

# Stop service (Ctrl+C nếu đang chạy)

# Start lại
npm start
```

**Kiểm tra output:**
```
🚀 =======================================
✅ Auth-Service đang lắng nghe tại http://localhost:3001
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
✅ Test endpoint: http://localhost:3001/test
...
```

**Nếu KHÔNG thấy output này → Có lỗi khi start!**

---

### **Bước 2: Test Service Có Chạy**

```bash
# Mở browser hoặc terminal
curl http://localhost:3001/test
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "Service đang chạy bình thường!",
  ...
}
```

**Nếu không có response:**
- Service chưa chạy → Chạy lại `npm start`
- Port bị chiếm → Check port 3001

---

### **Bước 3: Test Đăng Ký**

```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test_new@example.com","passWord":"password123"}'
```

**Hoặc chạy test script:**
```bash
cd server/auth-service
node test-service.js
```

---

### **Bước 4: Xem Console Log**

Khi test, **mở terminal chạy `npm start`** và quan sát:

**Bạn PHẢI thấy:**
```
📥 ========== NEW REQUEST ==========
Time: ...
Method: POST
Path: /register
...
🎯 Route hit: POST /register
🔵 ========== CREATE ACCOUNT CALLED ==========
```

**Nếu KHÔNG thấy:**
- Request không đến service
- Check URL có đúng không
- Check service có đang chạy không

---

## 🔍 Nếu Vẫn Không Hoạt Động

### **Check 1: Service Có Đang Chạy?**

```bash
# Check process
netstat -ano | findstr 3001

# Hoặc test
curl http://localhost:3001/
```

---

### **Check 2: MongoDB Có Đang Chạy?**

```bash
mongosh mongodb://127.0.0.1:27017
```

Nếu không kết nối được:
```bash
net start MongoDB
```

---

### **Check 3: Có Lỗi Khi Start Service?**

Xem toàn bộ output của `npm start` - có lỗi đỏ không?

**Common errors:**
- `Cannot find module` → `npm install`
- `EADDRINUSE` → Port bị chiếm
- `MongoNetworkError` → MongoDB chưa chạy

---

### **Check 4: URL Có Đúng Không?**

- ✅ Đúng: `http://localhost:3001/register`
- ❌ Sai: `http://localhost:3000/register` (port sai)
- ❌ Sai: `http://localhost:3001/api/register` (path sai)

---

## 📋 Test Checklist

Chạy lần lượt và check:

```bash
# 1. Service start
cd server/auth-service
npm start
# → Check: Thấy "Auth-Service đang lắng nghe"

# 2. Test endpoint
curl http://localhost:3001/test
# → Check: Thấy JSON response

# 3. Test register
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com","passWord":"password123"}'
# → Check: Thấy response (success hoặc error)

# 4. Xem console log
# → Check: Thấy "NEW REQUEST", "Route hit", "CREATE ACCOUNT CALLED"
```

---

## 🎯 Next Steps

1. **Restart service** với logging mới
2. **Test endpoint** (`GET /test`)
3. **Test register** với cURL
4. **Xem console log** để thấy request flow
5. **Copy error log** (nếu có) và gửi lại

Với logging mới, bạn sẽ thấy **chính xác** request đi đến đâu và dừng ở đâu!





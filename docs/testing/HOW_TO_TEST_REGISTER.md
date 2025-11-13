# ✅ Cách Test Đăng Ký Đúng Cách

## ❌ Lỗi: "Cannot GET /register"

Lỗi này xảy ra khi bạn truy cập `/register` bằng **GET method** (ví dụ: mở trong browser hoặc dùng GET request), nhưng endpoint này chỉ nhận **POST method**.

---

## ✅ Cách Test Đúng

### **Phương Pháp 1: Sử dụng cURL (Command Line)**

```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn A",
    "email": "test@example.com",
    "passWord": "password123"
  }'
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

---

### **Phương Pháp 2: Sử dụng Postman**

1. **Mở Postman**
2. **Method:** Chọn `POST` (không phải GET!)
3. **URL:** `http://localhost:3001/register`
4. **Headers:**
   - Key: `Content-Type`
   - Value: `application/json`
5. **Body:**
   - Chọn tab `raw`
   - Chọn `JSON`
   - Nhập:
   ```json
   {
     "fullName": "Nguyễn Văn A",
     "email": "test@example.com",
     "passWord": "password123"
   }
   ```
6. **Click "Send"**

---

### **Phương Pháp 3: Sử dụng VS Code REST Client**

Tạo file `test.http`:

```http
### Đăng ký
POST http://localhost:3001/register
Content-Type: application/json

{
  "fullName": "Nguyễn Văn A",
  "email": "test@example.com",
  "passWord": "password123"
}
```

Click vào "Send Request" phía trên dòng `POST`.

---

### **Phương Pháp 4: Sử dụng JavaScript (Frontend)**

```javascript
fetch('http://localhost:3001/register', {
    method: 'POST',  // ← Phải là POST!
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        fullName: 'Nguyễn Văn A',
        email: 'test@example.com',
        passWord: 'password123'
    })
})
.then(response => response.json())
.then(data => {
    console.log('Success:', data);
})
.catch(error => {
    console.error('Error:', error);
});
```

---

### **Phương Pháp 5: Sử dụng Axios**

```javascript
import axios from 'axios';

axios.post('http://localhost:3001/register', {
    fullName: 'Nguyễn Văn A',
    email: 'test@example.com',
    passWord: 'password123'
})
.then(response => {
    console.log('Success:', response.data);
})
.catch(error => {
    console.error('Error:', error.response.data);
});
```

---

## 🔍 Kiểm Tra Service

### **Test Service Đang Chạy:**

```bash
# GET request đến root (sẽ work)
curl http://localhost:3001/

# Kết quả: "Server CheapTrip đang chạy"
```

### **Test Register Endpoint:**

```bash
# POST request (sẽ work)
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com","passWord":"password123"}'
```

### **GET request (sẽ trả về 405 với message hướng dẫn):**

```bash
# GET request (sẽ trả về 405)
curl http://localhost:3001/register
```

---

## 📋 Request Body Format

```json
{
  "fullName": "Họ và tên",      // Required
  "email": "email@example.com",  // Required, must be valid email
  "passWord": "password123",     // Required, min 6 characters
  "phone": "0123456789",         // Optional
  "role": "student"              // Optional, default: "student"
}
```

---

## ✅ Checklist

- [ ] Sử dụng **POST** method (không phải GET)
- [ ] URL: `http://localhost:3001/register`
- [ ] Header: `Content-Type: application/json`
- [ ] Body: JSON format với `fullName`, `email`, `passWord`
- [ ] Service đang chạy (`npm start`)

---

## 🐛 Troubleshooting

### **Nếu vẫn lỗi "Cannot GET /register":**

→ Bạn đang dùng GET method. **Đổi sang POST!**

### **Nếu lỗi CORS:**

→ Check CORS settings trong `index.js` đã enable chưa

### **Nếu lỗi "Network Error":**

→ Check service có đang chạy không: `http://localhost:3001/`

---

## 📞 Quick Test

**Copy và paste vào terminal:**

```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Test User\",\"email\":\"test_$(date +%s)@example.com\",\"passWord\":\"password123\"}"
```

Lệnh này sẽ tự động tạo email unique và test đăng ký!







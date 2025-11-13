# 📚 Tài Liệu API Authentication - EduShare

## 🎯 Base URL
```
http://localhost:3001
```

---

## 🔐 Authentication Endpoints

### **1. Đăng Ký Tài Khoản**

**Endpoint:** `POST /register` hoặc `POST /createaccount`

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "passWord": "password123",
  "phone": "0123456789",
  "role": "student"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "data": {
    "user": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "user_id": "user_12345678-1234-1234-1234-123456789012",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "role": "student",
      "avatar_url": "/img/default-avatar.png",
      "is_verified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Email đã được sử dụng. Vui lòng chọn email khác!"
}
```

---

### **2. Đăng Nhập**

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "email": "nguyenvana@example.com",
  "passWord": "password123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "data": {
    "user": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "user_id": "user_12345678-1234-1234-1234-123456789012",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "role": "student",
      "avatar_url": "/img/default-avatar.png",
      "phone": "0123456789",
      "is_verified": false,
      "contributions": 0,
      "reputation_score": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng"
}
```

---

### **3. Kiểm Tra Email Đã Tồn Tại**

**Endpoint:** `POST /checkemail`

**Request Body:**
```json
{
  "email": "nguyenvana@example.com"
}
```

**Response (200):**
```json
{
  "exists": true,
  "message": "Email đã tồn tại"
}
```

hoặc

```json
{
  "exists": false
}
```

---

### **4. Lấy Thông Tin User**

**Endpoint:** `GET /customer?email=nguyenvana@example.com`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "user_id": "user_12345678-1234-1234-1234-123456789012",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phone": "0123456789",
    "address": "",
    "gender": "",
    "avatar_url": "/img/default-avatar.png",
    "bio": "",
    "role": "student",
    "university": "",
    "major": ""
  }
}
```

---

### **5. Cập Nhật Thông Tin User**

**Endpoint:** `POST /customer/update`

**Request Body:**
```json
{
  "email": "nguyenvana@example.com",
  "phone": "0987654321",
  "address": "123 Đường ABC, Quận XYZ",
  "gender": "male"
}
```

**Response Success (200):**
```json
{
  "message": "Cập nhật thông tin thành công",
  "user": { ... }
}
```

---

## 🔑 JWT Token Usage

### **Sử dụng token trong request:**

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Token Payload:**
```json
{
  "userId": "65f8a1b2c3d4e5f6a7b8c9d0",
  "user_id": "user_12345678-1234-1234-1234-123456789012",
  "email": "nguyenvana@example.com",
  "role": "student",
  "iat": 1234567890,
  "exp": 1235173890
}
```

---

## 📝 Test với cURL

### **Đăng ký:**
```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn A",
    "email": "test@example.com",
    "passWord": "password123"
  }'
```

### **Đăng nhập:**
```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "passWord": "password123"
  }'
```

### **Lấy thông tin user:**
```bash
curl -X GET "http://localhost:3001/customer?email=test@example.com"
```

---

## 🧪 Test với Postman

1. **Tạo Collection:** "EduShare Auth API"
2. **Đăng ký:**
   - Method: POST
   - URL: `http://localhost:3001/register`
   - Body (raw JSON):
     ```json
     {
       "fullName": "Nguyễn Văn A",
       "email": "test@example.com",
       "passWord": "password123"
     }
     ```

3. **Đăng nhập:**
   - Method: POST
   - URL: `http://localhost:3001/login`
   - Body (raw JSON):
     ```json
     {
       "email": "test@example.com",
       "passWord": "password123"
     }
     ```
   - Save token từ response

4. **Test Protected Route (nếu có):**
   - Method: GET
   - URL: `http://localhost:3001/protected-route`
   - Headers:
     ```
     Authorization: Bearer {paste_token_here}
     ```

---

## ⚠️ Validation Rules

### **Đăng ký:**
- `fullName`: Bắt buộc, không được trống
- `email`: Bắt buộc, định dạng email hợp lệ, unique
- `passWord`: Bắt buộc, tối thiểu 6 ký tự
- `role`: Optional, mặc định "student" (student | instructor | admin)

### **Đăng nhập:**
- `email`: Bắt buộc
- `passWord`: Bắt buộc

---

## 🐛 Error Codes

| Status Code | Mô tả |
|------------|-------|
| 200 | Thành công |
| 201 | Tạo thành công |
| 400 | Bad Request - Dữ liệu không hợp lệ |
| 401 | Unauthorized - Chưa đăng nhập hoặc token sai |
| 403 | Forbidden - Không có quyền truy cập |
| 404 | Not Found - Không tìm thấy resource |
| 500 | Server Error - Lỗi server |

---

## 🔒 Security Notes

1. **Password:** Được hash bằng bcrypt (salt rounds: 10)
2. **JWT Secret:** Sử dụng biến môi trường `JWT_SECRET` hoặc default
3. **Token Expiry:** 7 ngày (có thể config qua `JWT_EXPIRES_IN`)
4. **Email:** Tự động lowercase và trim
5. **Validation:** Cả client và server side

---

## 📦 MongoDB Schema

**Collection:** `UserCollection`  
**Database:** `EduShareDB`

**Sample Document:**
```json
{
  "_id": ObjectId("..."),
  "user_id": "user_12345678-1234-1234-1234-123456789012",
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "passWord": "$2b$10$hashed...",
  "role": "student",
  "phone": "0123456789",
  "address": "",
  "gender": "",
  "avatar_url": "/img/default-avatar.png",
  "bio": "",
  "university": "",
  "major": "",
  "uploaded_documents": [],
  "enrolled_courses": [],
  "saved_documents": [],
  "contributions": 0,
  "reputation_score": 0,
  "is_verified": false,
  "is_active": true,
  "last_login": null,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

---

## ✅ Next Steps

1. ✅ Đăng ký
2. ✅ Đăng nhập
3. ✅ JWT Authentication
4. ⏳ Email Verification (có sẵn nhưng chưa tích hợp đầy đủ)
5. ⏳ Reset Password
6. ⏳ Refresh Token
7. ⏳ OAuth Integration

---

**Happy Coding! 🚀**




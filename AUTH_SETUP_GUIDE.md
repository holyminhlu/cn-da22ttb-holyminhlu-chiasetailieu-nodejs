# 🚀 Hướng Dẫn Setup và Test Authentication

## 📋 Yêu Cầu

- Node.js (v14+)
- MongoDB đã cài đặt và chạy trên local (port 27017)

---

## 🔧 Bước 1: Cài Đặt Dependencies

```bash
cd server/auth-service
npm install
```

**Lưu ý:** Package `uuid` đã được thêm vào `package.json`, chạy `npm install` để cài đặt.

---

## 🗄️ Bước 2: Khởi Động MongoDB

### **Windows:**
```bash
# Kiểm tra MongoDB đã chạy chưa
mongod --version

# Khởi động MongoDB (nếu chưa chạy)
net start MongoDB
```

### **macOS/Linux:**
```bash
# Kiểm tra MongoDB đã chạy chưa
mongod --version

# Khởi động MongoDB
sudo systemctl start mongod
# hoặc
brew services start mongodb-community
```

### **Kiểm tra MongoDB đang chạy:**
```bash
# Kết nối test
mongosh mongodb://127.0.0.1:27017

# Hoặc
mongo --eval "db.version()"
```

---

## ▶️ Bước 3: Khởi Động Auth Service

```bash
cd server/auth-service
npm start
```

**Kết quả mong đợi:**
```
Kết nối MongoDB thành công
Auth-Service đang lắng nghe tại http://localhost: 3001
```

---

## 🧪 Bước 4: Test API

### **Option 1: Sử dụng Postman**

1. Import collection từ `AUTH_API_DOCUMENTATION.md`
2. Test từng endpoint

### **Option 2: Sử dụng cURL**

#### **Test Đăng Ký:**

```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nguyễn Văn A",
    "email": "testuser@example.com",
    "passWord": "password123",
    "phone": "0123456789"
  }'
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "data": {
    "user": {
      "id": "...",
      "user_id": "user_...",
      "fullName": "Nguyễn Văn A",
      "email": "testuser@example.com",
      "role": "student",
      "avatar_url": "/img/default-avatar.png",
      "is_verified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **Test Đăng Nhập:**

```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "passWord": "password123"
  }'
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **Test Lấy Thông Tin User:**

```bash
curl -X GET "http://localhost:3001/customer?email=testuser@example.com"
```

---

### **Option 3: Sử dụng VS Code REST Client**

Tạo file `test.http`:

```http
### Đăng ký
POST http://localhost:3001/register
Content-Type: application/json

{
  "fullName": "Nguyễn Văn A",
  "email": "testuser@example.com",
  "passWord": "password123"
}

### Đăng nhập
POST http://localhost:3001/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "passWord": "password123"
}

### Lấy thông tin user
GET http://localhost:3001/customer?email=testuser@example.com
```

---

## 🔍 Bước 5: Kiểm Tra Database

### **Sử dụng MongoDB Shell:**

```bash
mongosh mongodb://127.0.0.1:27017/EduShareDB
```

**Commands:**

```javascript
// Chuyển database
use EduShareDB

// Liệt kê collections
show collections

// Xem users
db.UserCollection.find().pretty()

// Đếm users
db.UserCollection.countDocuments()

// Xem user cụ thể
db.UserCollection.findOne({ email: "testuser@example.com" })
```

### **Sử dụng MongoDB Compass:**

1. Mở MongoDB Compass
2. Connect: `mongodb://127.0.0.1:27017`
3. Chọn database: `EduShareDB`
4. Browse collection: `UserCollection`

---

## ✅ Checklist

- [ ] MongoDB đã chạy trên port 27017
- [ ] Đã cài đặt dependencies (`npm install`)
- [ ] Auth service đã start thành công
- [ ] Test đăng ký thành công
- [ ] Test đăng nhập thành công
- [ ] Token được trả về
- [ ] Dữ liệu được lưu vào MongoDB

---

## 🐛 Troubleshooting

### **Lỗi: "Kết nối MongoDB thất bại"**

**Nguyên nhân:** MongoDB chưa chạy hoặc port sai

**Giải pháp:**
```bash
# Kiểm tra MongoDB đang chạy
netstat -an | findstr 27017

# Khởi động MongoDB
net start MongoDB
```

### **Lỗi: "Cannot find module 'uuid'"**

**Giải pháp:**
```bash
cd server/auth-service
npm install uuid
```

### **Lỗi: "Email đã tồn tại"**

**Nguyên nhân:** Đã đăng ký user này rồi

**Giải pháp:**
- Dùng email khác
- Hoặc xóa user trong MongoDB:
```javascript
db.UserCollection.deleteOne({ email: "testuser@example.com" })
```

### **Lỗi: "ValidationError"**

**Nguyên nhân:** Dữ liệu không hợp lệ (email sai format, password quá ngắn, etc.)

**Giải pháp:**
- Check request body đúng format
- Email phải hợp lệ
- Password >= 6 ký tự

---

## 📊 Sample Data

Sau khi test, bạn sẽ có data trong MongoDB như sau:

```javascript
{
  "_id": ObjectId("..."),
  "user_id": "user_abc123...",
  "fullName": "Nguyễn Văn A",
  "email": "testuser@example.com",
  "passWord": "$2b$10$...", // hashed
  "role": "student",
  "phone": "0123456789",
  "address": "",
  "gender": "",
  "avatar_url": "/img/default-avatar.png",
  "bio": "",
  "is_verified": false,
  "is_active": true,
  "contributions": 0,
  "reputation_score": 0,
  "created_at": ISODate("2024-01-15T10:00:00Z"),
  "updated_at": ISODate("2024-01-15T10:00:00Z")
}
```

---

## 🎉 Hoàn Thành!

Bây giờ bạn đã có:
- ✅ Đăng ký user
- ✅ Đăng nhập với JWT token
- ✅ Kiểm tra email
- ✅ Lấy thông tin user
- ✅ Cập nhật thông tin user

**Next Steps:**
- Tích hợp với frontend (Vue.js)
- Thêm middleware authentication cho protected routes
- Implement refresh token
- Add email verification

---

**Happy Coding! 🚀**





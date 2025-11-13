# 💾 Thông Tin Lưu Trữ Tài Khoản

## 📍 Vị Trí Lưu Trữ

Thông tin tài khoản được lưu trữ trong **MongoDB** trên máy tính local của bạn.

---

## 🗄️ Chi Tiết Database

### **1. MongoDB Connection:**
```
Host: 127.0.0.1 (localhost)
Port: 27017
Database Name: EduShareDB
Collection Name: UserCollection
```

### **2. Connection String:**
```javascript
mongodb://127.0.0.1:27017/EduShareDB
```

**Được cấu hình trong:** `server/auth-service/index.js` (dòng 15)

---

## 📋 Cấu Trúc Collection

### **Collection:** `UserCollection`

**Được định nghĩa trong:** `server/auth-service/models/authModel.js`

### **Các Trường Được Lưu:**

| Trường | Kiểu | Mô Tả |
|--------|------|-------|
| `_id` | ObjectId | ID tự động của MongoDB |
| `user_id` | String | ID duy nhất (vd: "user_abc123...") |
| `fullName` | String | Họ và tên |
| `email` | String | Email (unique, index) |
| `passWord` | String | Mật khẩu đã hash (bcrypt) |
| `role` | String | Vai trò: "student", "instructor", "admin" |
| `phone` | String | Số điện thoại |
| `address` | String | Địa chỉ |
| `gender` | String | Giới tính: "male", "female", "other", "" |
| `avatar_url` | String | URL ảnh đại diện |
| `bio` | String | Tiểu sử (tối đa 500 ký tự) |
| `university` | String | Trường đại học |
| `major` | String | Chuyên ngành |
| `uploaded_documents` | Array | Mảng ID tài liệu đã upload |
| `enrolled_courses` | Array | Mảng ID khóa học đã đăng ký |
| `saved_documents` | Array | Mảng ID tài liệu đã lưu |
| `contributions` | Number | Số tài liệu đã chia sẻ |
| `reputation_score` | Number | Điểm uy tín |
| `is_verified` | Boolean | Đã xác thực email chưa |
| `is_active` | Boolean | Tài khoản có hoạt động không |
| `last_login` | Date | Lần đăng nhập cuối |
| `created_at` | Date | Ngày tạo (tự động) |
| `updated_at` | Date | Ngày cập nhật (tự động) |

---

## 🔍 Cách Xem Dữ Liệu

### **Phương Pháp 1: MongoDB Shell (mongosh)**

```bash
# Kết nối MongoDB
mongosh mongodb://127.0.0.1:27017

# Chuyển sang database EduShareDB
use EduShareDB

# Liệt kê collections
show collections

# Xem tất cả users
db.UserCollection.find().pretty()

# Xem user cụ thể theo email
db.UserCollection.findOne({ email: "test@example.com" })

# Đếm số lượng users
db.UserCollection.countDocuments()

# Xem users theo role
db.UserCollection.find({ role: "student" }).pretty()
```

---

### **Phương Pháp 2: MongoDB Compass (GUI)**

1. **Tải MongoDB Compass:** https://www.mongodb.com/try/download/compass
2. **Kết nối:** `mongodb://127.0.0.1:27017`
3. **Chọn database:** `EduShareDB`
4. **Browse collection:** `UserCollection`
5. **Xem documents** với giao diện trực quan

---

### **Phương Pháp 3: VS Code Extension**

1. **Install extension:** "MongoDB for VS Code"
2. **Add connection:** `mongodb://127.0.0.1:27017`
3. **Browse:** EduShareDB → UserCollection

---

## 📂 Đường Dẫn File Thực Tế

### **MongoDB Data Storage (Windows):**

```
C:\Program Files\MongoDB\Server\{version}\data\db\
```

Hoặc nếu cài đặt tùy chỉnh:
```
C:\data\db\
```

### **MongoDB Data Storage (macOS):**

```
/usr/local/var/mongodb/
```

### **MongoDB Data Storage (Linux):**

```
/var/lib/mongodb/
```

---

## 🔐 Bảo Mật Thông Tin

### **Password:**
- **KHÔNG** lưu password dạng plain text
- Password được **hash** bằng **bcrypt** với salt rounds = 10
- Format: `$2b$10$...` (bcrypt hash)

**Ví dụ:**
```
Password gốc: "password123"
Password đã hash: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

### **Email:**
- Được lưu ở dạng **lowercase** (chữ thường)
- Có **unique index** - không trùng lặp

---

## 📊 Sample Document

```json
{
  "_id": ObjectId("65f8a1b2c3d4e5f6a7b8c9d0"),
  "user_id": "user_12345678-1234-1234-1234-123456789012",
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "passWord": "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "role": "student",
  "phone": "0123456789",
  "address": "",
  "gender": "male",
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
  "last_login": ISODate("2024-01-15T10:30:00Z"),
  "created_at": ISODate("2024-01-15T09:00:00Z"),
  "updated_at": ISODate("2024-01-15T10:30:00Z")
}
```

---

## 🔄 Backup Data

### **Export Database:**

```bash
# Export toàn bộ database
mongodump --host 127.0.0.1:27017 --db EduShareDB --out backup/

# Export collection UserCollection
mongoexport --host 127.0.0.1:27017 --db EduShareDB --collection UserCollection --out users.json
```

### **Import Database:**

```bash
# Import toàn bộ database
mongorestore --host 127.0.0.1:27017 --db EduShareDB backup/EduShareDB/

# Import collection
mongoimport --host 127.0.0.1:27017 --db EduShareDB --collection UserCollection --file users.json
```

---

## 📁 File Cấu Hình Liên Quan

1. **Model Definition:**
   - `server/auth-service/models/authModel.js`

2. **Database Connection:**
   - `server/auth-service/index.js` (dòng 15)

3. **Schema Design:**
   - `MONGODB_SCHEMA_DESIGN.json` (UserCollection schema)

---

## ⚠️ Lưu Ý

1. **MongoDB phải chạy** trước khi auth-service start
2. **Database sẽ tự động tạo** khi insert document đầu tiên
3. **Collection sẽ tự động tạo** khi save user đầu tiên
4. **Password luôn được hash** - không bao giờ lưu plain text
5. **Email là unique** - không thể đăng ký trùng email

---

## 🛠️ Troubleshooting

### **Không thấy database EduShareDB:**

```bash
# Kiểm tra MongoDB đang chạy
mongosh mongodb://127.0.0.1:27017

# List databases
show dbs

# Nếu không có EduShareDB, tạo bằng cách insert user đầu tiên qua API
```

### **Không thấy collection UserCollection:**

- Collection sẽ tự động tạo khi save user đầu tiên
- Hoặc tạo thủ công:

```javascript
use EduShareDB
db.createCollection("UserCollection")
```

---

## ✅ Checklist

- [x] MongoDB đang chạy trên port 27017
- [x] Database: EduShareDB
- [x] Collection: UserCollection
- [x] Password được hash (bcrypt)
- [x] Email có unique index
- [x] Timestamps tự động (created_at, updated_at)

---

**Tóm lại:** Thông tin tài khoản được lưu trong **MongoDB local** tại:
- **Location:** `mongodb://127.0.0.1:27017/EduShareDB`
- **Collection:** `UserCollection`
- **File định nghĩa:** `server/auth-service/models/authModel.js`







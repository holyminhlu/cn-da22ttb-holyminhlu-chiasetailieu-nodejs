# ✅ Cập Nhật MongoDB Configuration

## 🎯 Connection String Mới

**Cluster:** OpenLearnFoundation  
**Connection String:** 
```
mongodb+srv://holyminhludauden_db_user:<db_password>@openlearnfoundation.fniy67o.mongodb.net/
```

---

## ⚠️ QUAN TRỌNG: Thay `<db_password>`

Connection string có placeholder `<db_password>` - bạn cần **thay bằng password thực** của database user!

### Cách lấy password:

1. Vào MongoDB Atlas: https://cloud.mongodb.com/
2. Database Access → Click vào user `holyminhludauden_db_user`
3. Click **"Edit"** → **"Reset Password"**
4. Copy password mới

Hoặc nếu đã biết password → dùng password đó

---

## 📝 Files Đã Cập Nhật

### ✅ server/auth-service/index.js
```javascript
mongoose.connect('mongodb+srv://holyminhludauden_db_user:<db_password>@openlearnfoundation.fniy67o.mongodb.net/EduShareDB')
```

### ✅ server/tours-service/index.js  
```javascript
mongoose.connect('mongodb+srv://holyminhludauden_db_user:<db_password>@openlearnfoundation.fniy67o.mongodb.net/EduShareDB')
```

### ⚠️ server/tours-service/updateDestination.js
File này vẫn dùng localhost - cần sửa hoặc bỏ qua (file legacy)

---

## 🚀 Các Bước Hoàn Tất Setup

### Bước 1: Thay thế Password

**Trong cả 2 files trên, thay:**
```
<db_password>
```
**Thành password thực của bạn**

### Bước 2: Whitelist IP (Nếu chưa làm)

1. Vào MongoDB Atlas
2. Network Access → Add IP Address
3. Chọn **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Hoặc thêm IP cụ thể của máy bạn

### Bước 3: Test Connection

```bash
# Terminal 1: Chạy auth-service
cd server/auth-service
npm start

# Kiểm tra log:
# ✅ "Kết nối MongoDB thành công"
```

```bash
# Terminal 2: Chạy tours-service
cd server/tours-service  
npm start

# Kiểm tra log:
# ✅ "Kết nối tới EduShareDB thành công!"
```

---

## 📊 Database Info

**Database Name:** `EduShareDB`  
**Collections:** Sẽ được tạo tự động khi insert data đầu tiên

**Theo MONGODB_SCHEMA_DESIGN.json, cần tạo:**
1. UserCollection
2. DocumentsCollection
3. CoursesCollection
4. ForumThreadsCollection
5. ForumRepliesCollection
6. DocumentRatingsCollection
7. CourseEnrollmentsCollection
8. CollectionsCollection
9. NotificationsCollection
10. BlogPostsCollection
11. ClassSessionsCollection
12. ClassesCollection

---

## 🔒 Security Best Practice

Sau khi test thành công, nên:

### 1. Tạo file `.env`

```bash
# server/auth-service/.env
MONGODB_USERNAME=holyminhludauden_db_user
MONGODB_PASSWORD=YOUR_REAL_PASSWORD_HERE
MONGODB_CLUSTER=openlearnfoundation.fniy67o.mongodb.net
MONGODB_DATABASE=EduShareDB
```

```bash
# server/tours-service/.env
MONGODB_USERNAME=holyminhludauden_db_user
MONGODB_PASSWORD=YOUR_REAL_PASSWORD_HERE
MONGODB_CLUSTER=openlearnfoundation.fniy67o.mongodb.net
MONGODB_DATABASE=EduShareDB
```

### 2. Cài đặt dotenv

```bash
cd server/auth-service
npm install dotenv

cd ../tours-service
npm install dotenv
```

### 3. Update code để dùng .env

**File:** server/auth-service/index.js
```javascript
require('dotenv').config()

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}`

mongoose.connect(connectionString)
```

**File:** server/tours-service/index.js
```javascript
require('dotenv').config()

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}`

mongoose.connect(connectionString)
```

### 4. Add .env vào .gitignore

```bash
# .gitignore
.env
*.env
.env.local
```

---

## 🐛 Troubleshooting

### Lỗi: "Authentication failed"

**Nguyên nhân:** Password sai hoặc user chưa có quyền

**Giải pháp:**
1. Check password trong connection string
2. Database Access → Check user privileges = "Atlas Admin" hoặc "Read and write"
3. Thử reset password mới

### Lỗi: "Connection timeout"

**Nguyên nhân:** IP chưa whitelist

**Giải pháp:**
1. Network Access → Add IP Address
2. Chọn "Allow Access from Anywhere"
3. Đợi 1-2 phút để apply

### Lỗi: "Database not found"

**Nguyên nhân:** Database chưa tồn tại

**Giải pháp:**
- MongoDB sẽ tự tạo database khi insert data đầu tiên
- Hoặc tạo thủ công trên Atlas UI

---

## ✅ Checklist

- [ ] Đã thay `<db_password>` bằng password thực
- [ ] Đã whitelist IP trong MongoDB Atlas
- [ ] Đã test auth-service connection
- [ ] Đã test tours-service connection
- [ ] Đã tạo file .env (optional nhưng khuyên dùng)
- [ ] Đã add .env vào .gitignore

---

## 🎉 Done!

Sau khi hoàn thành, bạn có:
- ✅ MongoDB Atlas cluster: OpenLearnFoundation
- ✅ Database: EduShareDB
- ✅ 2 services đã kết nối thành công
- ✅ Sẵn sàng tạo collections và insert data

**Next step:** Tạo Mongoose models dựa trên MONGODB_SCHEMA_DESIGN.json




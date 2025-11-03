# 🔐 Tạo Connection String MongoDB Atlas Mới

## ⚠️ Vấn Đề Hiện Tại

Connection string trong code hiện tại:
```
mongodb+srv://nguyenhuuluan19092004zz:DtZp6M56ZYgYqprV@clustercheaptrip.fct1xpg.mongodb.net/
```

Đây là credentials của **người khác** (có thể là người setup ban đầu)!

---

## ✅ Giải Pháp: Tạo Connection String Mới

### **Bước 1: Truy cập MongoDB Atlas**

1. Mở: https://cloud.mongodb.com/
2. **Đăng nhập** với tài khoản MongoDB Atlas của bạn
   - Nếu chưa có account → Click "Sign Up" để tạo mới
   - Sử dụng email cá nhân của bạn

---

### **Bước 2: Tạo Database User**

Sau khi login:

1. Click vào **"Database Access"** (trong sidebar)
2. Click **"Add New Database User"**
3. Chọn **"Password"** authentication
4. Nhập:
   - **Username:** (ví dụ: `edushare_user` hoặc username bạn muốn)
   - **Password:** (tạo password mạnh)
   - Đánh dấu "Autogenerate Secure Password" nếu muốn
5. **Database User Privileges:** Chọn **"Atlas Admin"** hoặc **"Read and write to any database"**
6. Click **"Add User"**

**Lưu ý:** Copy password ngay! Bạn sẽ không thấy lại được.

---

### **Bước 3: Whitelist IP Address**

1. Click vào **"Network Access"** (trong sidebar)
2. Click **"Add IP Address"**
3. Chọn:
   - **"Allow Access from Anywhere"** (0.0.0.0/0) - cho development
   - **Hoặc** thêm IP cụ thể của bạn
4. Click **"Confirm"**

---

### **Bước 4: Tạo Cluster (Nếu chưa có)**

1. Click **"Database"** → **"Build a Database"**
2. Chọn **FREE** tier (M0)
3. Chọn **Provider:** AWS/Google Cloud/Azure
4. Chọn **Region:** (gần Việt Nam nhất: Singapore, Thailand)
5. Đặt tên cluster: **`eduShareCluster`** (hoặc tên bạn muốn)
6. Click **"Create"**

**Note:** Cluster miễn phí mất **5-10 phút** để setup!

---

### **Bước 5: Lấy Connection String**

Sau khi cluster đã ready:

1. Click vào **"Database"** tab
2. Click **"Connect"** (button màu xanh)
3. Chọn **"Connect your application"**
4. Chọn **Driver:** Node.js
5. Chọn **Version:** 5.5 or later
6. Copy **Connection String**

Nó sẽ trông như này:
```
mongodb+srv://<username>:<password>@edusharecluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

### **Bước 6: Cập Nhật Connection String**

**Thay thế** username và password:

**Before:**
```
mongodb+srv://<username>:<password>@edusharecluster.xxxxx.mongodb.net/
```

**After (ví dụ):**
```
mongodb+srv://edushare_user:MySecurePassword123@edusharecluster.xxxxx.mongodb.net/EduShareDB
```

---

### **Bước 7: Cập Nhật Code**

#### **File: server/auth-service/index.js**

```javascript
// OLD (xóa đi)
mongoose.connect('mongodb+srv://nguyenhuuluan19092004zz:DtZp6M56ZYgYqprV@clustercheaptrip.fct1xpg.mongodb.net/CheapTripDB')

// NEW (thay bằng connection string của bạn)
mongoose.connect('mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/EduShareDB')
    .then(()=>console.log('Kết nối MongoDB thành công'))
    .catch(err => console.error('Lỗi kết nối MongoDB',err));
```

#### **File: server/tours-service/index.js**

```javascript
// OLD (xóa đi)
mongoose.connect('mongodb+srv://nguyenhuuluan19092004zz:DtZp6M56ZYgYqprV@clustercheaptrip.fct1xpg.mongodb.net/ToursCheapTripDB')

// NEW (thay bằng connection string của bạn)
mongoose.connect('mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/EduShareDB')
    .then(() => console.log('Kết nối tới EduShareDB thành công!'))
    .catch(err => console.error('Lỗi kết nối MongoDB:', err))
```

---

### **Bước 8: Test Connection**

```bash
# Chạy auth-service
cd server/auth-service
npm start

# Kiểm tra console log:
# "Kết nối MongoDB thành công" ✅
```

---

## 🔒 Security Best Practice

### **Option 1: Environment Variables (Khuyên dùng)**

**Tạo file `.env`:**

```
# .env
MONGODB_USERNAME=edushare_user
MONGODB_PASSWORD=MySecurePassword123
MONGODB_CLUSTER=edusharecluster.xxxxx.mongodb.net
MONGODB_DATABASE=EduShareDB
```

**Install dotenv:**
```bash
npm install dotenv
```

**Update code:**
```javascript
require('dotenv').config()

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}`

mongoose.connect(connectionString)
```

**Add to `.gitignore`:**
```
.env
*.env
```

---

### **Option 2: Config File**

**Tạo file `config/database.js`:**
```javascript
module.exports = {
  connectionString: 'mongodb+srv://...'
}
```

---

## 📋 Checklist

- [ ] Có tài khoản MongoDB Atlas
- [ ] Đã tạo Database User
- [ ] Đã whitelist IP
- [ ] Đã tạo Cluster
- [ ] Đã lấy Connection String
- [ ] Đã cập nhật code
- [ ] Đã test connection
- [ ] Đã tạo `.env` file
- [ ] Đã add `.env` vào `.gitignore`

---

## 🆘 Troubleshooting

### **"Authentication failed"**
- Check username/password đúng chưa
- Check database user có quyền chưa
- Check IP đã whitelist chưa

### **"Connection timeout"**
- Check internet connection
- Check firewall settings
- Check cluster đã ready chưa

### **"Database not found"**
- MongoDB tạo database tự động khi insert data lần đầu
- Hoặc tạo thủ công trên Atlas UI

---

## 📞 Need Help?

Nếu gặp vấn đề, share:
- Screenshot MongoDB Atlas
- Error message
- Connection string (ẩn password!)

**Good luck! 🚀**




# Hướng Dẫn Tạo Khóa Học Test

## 📋 Tổng Quan

Script này tạo 5 khóa học test với giá **5000 VND** để kiểm tra chức năng thanh toán.

## 🚀 Chạy Script

### Cách 1: Sử dụng npm script

```bash
cd server/course-service
npm run create-test-courses
```

### Cách 2: Chạy trực tiếp

```bash
cd server/course-service
node scripts/create-test-courses.js
```

## 📚 Danh Sách Khóa Học Test

Script sẽ tạo 5 khóa học với các thông tin sau:

### 1. Khóa Học Lập Trình JavaScript Cơ Bản
- **Giá:** 5000 VND
- **Category:** Programming
- **Level:** Beginner
- **Duration:** 8 hours
- **Lessons:** 15 lessons

### 2. Khóa Học React.js Cho Người Mới Bắt Đầu
- **Giá:** 5000 VND
- **Category:** Programming
- **Level:** Intermediate
- **Duration:** 12 hours
- **Lessons:** 20 lessons
- **Best Seller:** ✅

### 3. Khóa Học Thiết Kế UI/UX Cơ Bản
- **Giá:** 5000 VND
- **Category:** Design
- **Level:** Beginner
- **Duration:** 10 hours
- **Lessons:** 18 lessons

### 4. Khóa Học Python Cho Data Science
- **Giá:** 5000 VND
- **Category:** Science
- **Level:** Intermediate
- **Duration:** 15 hours
- **Lessons:** 25 lessons
- **Best Seller:** ✅

### 5. Khóa Học Marketing Digital Cơ Bản
- **Giá:** 5000 VND
- **Category:** Marketing
- **Level:** Beginner
- **Duration:** 14 hours
- **Lessons:** 22 lessons

## ✅ Đặc Điểm

Tất cả khóa học test có:
- ✅ **Giá:** 5000 VND (không phải miễn phí)
- ✅ **Status:** Published
- ✅ **Visibility:** Public
- ✅ **Có đầy đủ thông tin:** title, description, instructor, modules, lessons
- ✅ **Có preview lesson** trong module đầu tiên

## 🔄 Xóa Khóa Học Test Cũ

Script tự động xóa các khóa học test cũ (có "Test Payment" trong title) trước khi tạo mới.

## 🧪 Test Payment Flow

Sau khi tạo khóa học test:

1. **Truy cập frontend:** http://localhost:8080
2. **Tìm khóa học test:** Search "Test Payment"
3. **Click vào khóa học:** Xem chi tiết
4. **Click "Đăng ký":** Sẽ trigger payment flow
5. **Kiểm tra payment:** 
   - Payment được tạo trong database
   - Redirect đến SePay (hoặc mock payment URL)

## 📊 Kiểm Tra Database

### MongoDB Shell

```javascript
// Kết nối MongoDB
use EduShareDB

// Xem tất cả khóa học test
db.Courses.find({ title: /Test Payment/i }).pretty()

// Đếm số khóa học test
db.Courses.countDocuments({ title: /Test Payment/i })

// Xem thông tin pricing
db.Courses.find(
  { title: /Test Payment/i },
  { title: 1, "pricing.price": 1, "pricing.currency": 1, course_id: 1 }
).pretty()
```

### Node.js Script

```javascript
const Course = require('./models/courseModel');
const courses = await Course.find({ title: /Test Payment/i });
console.log('Test courses:', courses.map(c => ({
  id: c.course_id,
  title: c.title,
  price: c.pricing.price
})));
```

## 🗑️ Xóa Khóa Học Test

### Cách 1: Sử dụng MongoDB Shell

```javascript
use EduShareDB
db.Courses.deleteMany({ title: /Test Payment/i })
```

### Cách 2: Sử dụng Node.js

```javascript
const Course = require('./models/courseModel');
await Course.deleteMany({ title: /Test Payment/i });
console.log('✅ Deleted test courses');
```

## ⚠️ Lưu Ý

1. **Không chạy script trong production** - Chỉ dùng cho development/testing
2. **Backup database** trước khi chạy nếu cần
3. **Kiểm tra MongoDB connection** trước khi chạy script
4. **Course IDs** sẽ được generate tự động, không cố định

## 🔍 Troubleshooting

### Lỗi: MongoDB connection failed

**Nguyên nhân:** MongoDB không chạy hoặc URI sai

**Giải pháp:**
```bash
# Kiểm tra MongoDB đang chạy
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod

# Hoặc start MongoDB manually
mongod
```

### Lỗi: Validation error

**Nguyên nhân:** Thiếu required fields

**Giải pháp:**
- Kiểm tra script có đầy đủ fields không
- Check courseModel.js để xem required fields

### Lỗi: Duplicate course_id

**Nguyên nhân:** Course ID đã tồn tại

**Giải pháp:**
- Script tự động generate course_id mới
- Nếu vẫn lỗi, xóa courses cũ trước

---

**Sau khi tạo xong, bạn có thể test payment flow với các khóa học này!**


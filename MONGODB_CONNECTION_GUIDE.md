# 🔗 Hướng Dẫn Kết Nối và Xem Dữ Liệu MongoDB

## 📊 Connection Strings

Dự án hiện tại đang sử dụng **MongoDB Atlas** (Cloud):

### **Auth Service**
```
mongodb+srv://nguyenhuuluan19092004zz:DtZp6M56ZYgYqprV@clustercheaptrip.fct1xpg.mongodb.net/CheapTripDB
```

### **Tours Service**  
```
mongodb+srv://nguyenhuuluan19092004zz:DtZp6M56ZYgYqprV@clustercheaptrip.fct1xpg.mongodb.net/ToursCheapTripDB
```

---

## 🎯 Cách Xem Dữ Liệu MongoDB

### **Phương Pháp 1: MongoDB Atlas Web Interface (Khuyên dùng)**

1. Truy cập: https://cloud.mongodb.com/
2. Đăng nhập với tài khoản MongoDB Atlas
3. Chọn cluster: `clustercheaptrip`
4. Click **"Browse Collections"**
5. Chọn database: `CheapTripDB` hoặc `ToursCheapTripDB`
6. Xem các collections và documents

**Ưu điểm:** Dễ sử dụng, không cần cài đặt thêm

---

### **Phương Pháp 2: MongoDB Compass (Desktop App)**

**Tải về:** https://www.mongodb.com/try/download/compass

**Cách kết nối:**

1. Mở MongoDB Compass
2. Paste connection string:
   ```
   mongodb+srv://nguyenhuuluan19092004zz:DtZp6M56ZYgYqprV@clustercheaptrip.fct1xpg.mongodb.net/CheapTripDB
   ```
3. Click **"Connect"**
4. Browse databases và collections

**Ưu điểm:** GUI đẹp, dễ query và filter

---

### **Phương Pháp 3: MongoDB Shell (mongosh)**

**Install:**
```bash
# Windows (chocolatey)
choco install mongosh

# Hoặc download từ: https://www.mongodb.com/try/download/shell
```

**Kết nối:**
```bash
mongosh "mongodb+srv://nguyenhuuluan19092004zz:DtZp6M56ZYgYqprV@clustercheaptrip.fct1xpg.mongodb.net/CheapTripDB"
```

**Commands:**
```javascript
// Liệt kê databases
show dbs

// Chuyển database
use CheapTripDB

// Liệt kê collections
show collections

// Xem documents
db.UserCollection.find()

// Xem document đầu tiên
db.UserCollection.findOne()

// Đếm documents
db.UserCollection.countDocuments()

// Query với filter
db.UserCollection.find({ role: "instructor" })

// Pretty print
db.UserCollection.find().pretty()
```

---

### **Phương Pháp 4: Studio 3T (Advanced Tool)**

**Tải về:** https://studio3t.com/download/

**Features:**
- Visual query builder
- SQL Migration tool
- Aggregation pipeline builder
- Data import/export

**Kết nối giống MongoDB Compass**

---

### **Phương Pháp 5: VS Code Extension**

**Extension:** MongoDB for VS Code

1. Install extension trong VS Code
2. Click vào icon MongoDB ở sidebar
3. Add connection string
4. Browse databases

**Ưu điểm:** Tích hợp vào VS Code, không cần app riêng

---

## 📝 Các Collections Hiện Có

Dựa vào code hiện tại, bạn có:

### **Database: CheapTripDB**
- `UserCollection` - Người dùng

### **Database: ToursCheapTripDB**  
- `ToursCollection` - Tours

---

## 🚀 Cho EduShareDB (Mới)

Sau khi migrate sang EduShare, bạn cần:

### **1. Tạo Database Mới**

**Option A: MongoDB Atlas**
1. Vào MongoDB Atlas
2. Click "Database" → "Create Database"
3. Name: `EduShareDB`
4. Tạo collections từng cái

**Option B: Code**
```javascript
mongoose.connect('mongodb+srv://.../EduShareDB')
// Collections sẽ tự tạo khi insert documents
```

---

### **2. Tạo Sample Data**

**Ví dụ tạo User:**

```javascript
// File: scripts/createSampleData.js
const mongoose = require('mongoose')
const User = require('../models/UserModel')

mongoose.connect('mongodb+srv://nguyenhuuluan19092004zz:DtZp6M56ZYgYqprV@clustercheaptrip.fct1xpg.mongodb.net/EduShareDB')
  .then(async () => {
    console.log('Connected to EduShareDB')

    // Tạo sample user
    const user = new User({
      user_id: 'user_001',
      fullName: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      passWord: 'hashed_password',
      role: 'instructor',
      phone: '0123456789',
      avatar_url: '/img/perfil.jpg',
      bio: 'TS. Toán học tại Đại học Bách Khoa',
      contributions: 45,
      reputation_score: 4.9
    })

    await user.save()
    console.log('User created:', user)
    process.exit(0)
  })
  .catch(err => {
    console.error('Error:', err)
    process.exit(1)
  })
```

**Run script:**
```bash
node scripts/createSampleData.js
```

---

### **3. Query Data**

```javascript
// Get all documents
const documents = await Document.find()

// Get by field
const mathDocs = await Document.find({ subject: 'Toán học' })

// Get with limit
const topDocs = await Document.find({ is_featured: true })
  .sort({ downloads: -1 })
  .limit(10)

// Text search
const results = await Document.find({ 
  $text: { $search: 'đại số' } 
})

// Populate reference
const doc = await Document.findById(docId)
  .populate('author_id', 'fullName email')

// Aggregation
const stats = await Document.aggregate([
  { $group: { _id: '$subject', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

---

## 🔐 Authentication

**Lưu ý:** Connection string có chứa password!

**Best Practice:** Sử dụng environment variables:

```javascript
// .env file
MONGODB_USERNAME=nguyenhuuluan19092004zz
MONGODB_PASSWORD=DtZp6M56ZYgYqprV
MONGODB_CLUSTER=clustercheaptrip.fct1xpg.mongodb.net
MONGODB_DATABASE=EduShareDB

// index.js
require('dotenv').config()
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}`)
```

---

## 📊 Indexes

**Check indexes:**
```javascript
// In mongosh
db.DocumentsCollection.getIndexes()

// In code
const indexes = await Document.collection.getIndexes()
console.log(indexes)
```

**Create index:**
```javascript
// Single field
await Document.collection.createIndex({ downloads: -1 })

// Compound
await Document.collection.createIndex({ subject: 1, type: 1 })

// Text
await Document.collection.createIndex({ title: 'text', description: 'text' })
```

---

## 🔍 Useful Queries

### **Documents**

```javascript
// Phổ biến nhất
const popular = await Document.find({ is_approved: true })
  .sort({ downloads: -1 })
  .limit(10)

// Mới nhất
const newest = await Document.find()
  .sort({ created_at: -1 })
  .limit(10)

// Theo subject
const mathDocs = await Document.find({ 
  subject: 'Toán học',
  is_approved: true 
})

// Search
const searchResults = await Document.find({
  $text: { $search: 'linear algebra' },
  is_approved: true
}).sort({ score: { $meta: 'textScore' } })
```

### **Users**

```javascript
// Top contributors
const topContributors = await User.find({ role: 'instructor' })
  .sort({ contributions: -1 })
  .limit(10)

// By role
const instructors = await User.find({ role: 'instructor' })

// Verified users
const verified = await User.find({ is_verified: true })
```

### **Forum**

```javascript
// Recent threads
const recent = await ForumThread.find()
  .sort({ created_at: -1 })
  .limit(20)

// By category
const programming = await ForumThread.find({ 
  category: 'programming' 
}).sort({ last_reply_at: -1 })

// Most replies
const hot = await ForumThread.find()
  .sort({ reply_count: -1 })
  .limit(10)
```

---

## 📈 Performance

### **Check query performance:**
```javascript
// Enable explain
const result = await Document.find({ subject: 'Toán học' })
  .explain('executionStats')

console.log('Execution time:', result.executionStats.executionTimeMillis)
console.log('Documents examined:', result.executionStats.totalDocsExamined)
```

### **Update indexes for better performance:**
```javascript
// Before query: 2 seconds
const before = await Document.find({ subject: 'Toán học', type: 'PDF' })

// Create compound index
await Document.collection.createIndex({ subject: 1, type: 1 })

// After: < 10ms
const after = await Document.find({ subject: 'Toán học', type: 'PDF' })
```

---

## 🛠️ Troubleshooting

### **Connection refused**
- Check internet connection
- Verify connection string
- Check IP whitelist in MongoDB Atlas

### **Authentication failed**
- Verify username/password
- Check database user permissions

### **Slow queries**
- Create indexes
- Use `.limit()` và `.lean()`
- Check `.explain()` output

---

## 📚 Resources

- **MongoDB Atlas:** https://cloud.mongodb.com
- **MongoDB Compass:** https://www.mongodb.com/try/download/compass
- **MongoDB Shell:** https://www.mongodb.com/try/download/shell
- **Mongoose Docs:** https://mongoosejs.com/docs/
- **MongoDB Docs:** https://docs.mongodb.com/

---

## ✅ Quick Start

```bash
# 1. Mở MongoDB Atlas
https://cloud.mongodb.com/

# 2. Connect với Compass
mongodb+srv://nguyenhuuluan19092004zz:DtZp6M56ZYgYqprV@clustercheaptrip.fct1xpg.mongodb.net/CheapTripDB

# 3. Xem collections
Browse Collections → CheapTripDB → UserCollection

# 4. Query data
db.UserCollection.find().pretty()
```

**Happy Querying! 🎉**




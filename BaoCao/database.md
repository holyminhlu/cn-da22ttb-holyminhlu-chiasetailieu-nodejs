# 🗄️ Cơ Sở Dữ Liệu & Lưu Trữ Dữ Liệu - OpenLearnFoundation

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [MongoDB Database](#mongodb-database)
3. [Collections & Schemas](#collections--schemas)
4. [File Storage System](#file-storage-system)
5. [Indexes & Performance](#indexes--performance)
6. [Data Relationships](#data-relationships)
7. [Backup & Recovery](#backup--recovery)
8. [Best Practices](#best-practices)

---

## Tổng Quan

Hệ thống **OpenLearnFoundation** sử dụng:
- **MongoDB**: NoSQL database để lưu trữ dữ liệu structured
- **File System**: Local file storage để lưu trữ files (documents, images, videos)
- **MongoDB Atlas**: Cloud database cho production

### Kiến Trúc Lưu Trữ

```
┌─────────────────────────────────────────┐
│         MongoDB Database                 │
│  - Structured Data (JSON Documents)      │
│  - Metadata, User Info, Relationships   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         File System Storage             │
│  - Documents (PDF, PPTX, DOCX, ZIP)     │
│  - Images (Thumbnails, Avatars)         │
│  - Videos (Course Videos)               │
└─────────────────────────────────────────┘
```

---

## MongoDB Database

### Thông Tin Kết Nối

**Database Name**: `EduShareDB` hoặc `OpenLearnFoundation`

**Connection Strings**:
- **Local**: `mongodb://localhost:27017/EduShareDB`
- **Atlas**: `mongodb+srv://user:password@cluster.mongodb.net/OpenLearnFoundation`

**Port**: `27017` (default)

### Kết Nối MongoDB

**Code Example**:
```javascript
const mongoose = require('mongoose')

// Local MongoDB
mongoose.connect('mongodb://localhost:27017/EduShareDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
```

### Database Configuration

**MongoDB Version**: 7.0+

**Features Sử Dụng**:
- Document-based storage
- Indexes (Single, Compound, Text)
- Aggregation Pipeline
- Transactions (nếu cần)
- Replica Sets (production)

---

## Collections & Schemas

### Tổng Quan Collections

Hệ thống có **12 collections** chính:

#### Core Collections (5)
1. **UserCollection** - Người dùng
2. **TaiLieu** (DocumentsCollection) - Tài liệu
3. **Courses** - Khóa học
4. **posts** (ForumPosts) - Bài viết forum
5. **BlogPosts** - Bài viết blog

#### Supporting Collections (7)
6. **Enrollments** - Đăng ký khóa học
7. **Payments** - Thanh toán
8. **DocumentRatings** - Đánh giá tài liệu
9. **Collections** - Bộ sưu tập
10. **Notifications** - Thông báo
11. **ClassSessions** - Buổi học
12. **Classes** - Lớp học

---

### 1. UserCollection

**Collection Name**: `UserCollection`

**Mục đích**: Quản lý thông tin người dùng, giảng viên, học viên

**Schema**:
```javascript
{
    _id: ObjectId,                    // MongoDB auto-generated
    user_id: String,                  // Custom ID: user_${uuid}
    fullName: String,                 // Required
    email: String,                    // Required, unique
    passWord: String,                 // Required, hashed (bcrypt)
    role: String,                     // enum: student, instructor, admin
    phone: String,
    address: String,
    gender: String,                   // enum: male, female, other, ''
    avatar_url: String,               // Default: '/img/default-avatar.png'
    cover_url: String,
    bio: String,                      // Max 500 chars
    university: String,
    major: String,
    uploaded_documents: [String],     // Array of document_id
    enrolled_courses: [String],        // Array of course_id
    saved_documents: [String],        // Array of document_id
    contributions: Number,             // Default: 0
    reputation_score: Number,         // Default: 0
    is_verified: Boolean,             // Default: false
    is_active: Boolean,               // Default: true
    last_login: Date,
    createdAt: Date,                  // Auto-generated
    updatedAt: Date                   // Auto-generated
}
```

**Indexes**:
```javascript
{ email: 1 }                    // Unique
{ user_id: 1 }                  // Unique
{ role: 1 }
{ createdAt: -1 }
{ reputation_score: -1 }
```

**Sample Document**:
```json
{
    "_id": ObjectId("507f1f77bcf86cd799439011"),
    "user_id": "user_123e4567-e89b-12d3-a456-426614174000",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "passWord": "$2b$10$hashed_password",
    "role": "instructor",
    "phone": "0123456789",
    "avatar_url": "/img/perfil.jpg",
    "bio": "TS. Toán học tại Đại học Bách Khoa",
    "university": "Đại học Bách Khoa Hà Nội",
    "major": "Toán học",
    "contributions": 45,
    "reputation_score": 4.9,
    "is_verified": true,
    "is_active": true,
    "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
    "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

---

### 2. TaiLieu (DocumentsCollection)

**Collection Name**: `TaiLieu`

**Mục đích**: Lưu trữ thông tin tài liệu học tập

**Schema**:
```javascript
{
    _id: ObjectId,
    document_id: String,              // Custom ID: doc_${uuid}
    title: String,                    // Required, max 200 chars
    description: String,              // Required, 20-1000 chars
    file: {
        originalName: String,         // Required
        fileName: String,             // Required
        filePath: String,             // Required: /uploads/documents/{fileName}
        fileSize: Number,             // Required (bytes)
        mimeType: String,             // Required
        fileType: String              // enum: pdf, pptx, docx, zip
    },
    thumbnail: {
        originalName: String,
        fileName: String,
        filePath: String,             // /uploads/thumbnails/{fileName}
        fileSize: Number,
        mimeType: String
    },
    author: {
        id: String,                   // Required: user_id
        name: String,                 // Required
        avatar: String                // Default: ''
    },
    uploaderId: String,               // Required, indexed
    program: String,
    courseCode: String,
    year: String,
    tags: [String],                   // Array
    languages: [String],              // Default: ['vi']
    license: String,                  // enum: CC-BY, CC-BY-NC, CC-BY-SA, All rights reserved
    visibility: String,               // enum: public, private, class-only
    status: String,                   // enum: draft, published, archived, rejected
    downloads: Number,                // Default: 0
    views: Number,                    // Default: 0
    uploadDate: Date,                 // Default: Date.now
    createdAt: Date,
    updatedAt: Date
}
```

**Indexes**:
```javascript
{ document_id: 1 }                   // Unique
{ uploaderId: 1 }
{ program: 1 }
{ status: 1 }
{ visibility: 1 }
{ createdAt: -1 }
{ downloads: -1 }
{ 'author.name': 'text', title: 'text', description: 'text', tags: 'text' }  // Text index
```

**Sample Document**:
```json
{
    "_id": ObjectId("507f1f77bcf86cd799439012"),
    "document_id": "doc_987fcdeb-51a2-43f1-b567-123456789abc",
    "title": "Slide Đại số tuyến tính",
    "description": "Tài liệu slide bài giảng về Đại số tuyến tính...",
    "file": {
        "originalName": "slide-dstt.pdf",
        "fileName": "1704067200000_550e8400e29b41d4a716446655440000.pdf",
        "filePath": "/uploads/documents/1704067200000_550e8400e29b41d4a716446655440000.pdf",
        "fileSize": 5242880,
        "mimeType": "application/pdf",
        "fileType": "pdf"
    },
    "thumbnail": {
        "originalName": "thumbnail.jpg",
        "fileName": "1704067200001_660f9511f39c52e5b827557766001111.jpg",
        "filePath": "/uploads/thumbnails/1704067200001_660f9511f39c52e5b827557766001111.jpg",
        "fileSize": 245760,
        "mimeType": "image/jpeg"
    },
    "author": {
        "id": "user_123e4567-e89b-12d3-a456-426614174000",
        "name": "Nguyễn Văn A",
        "avatar": "/img/perfil.jpg"
    },
    "uploaderId": "user_123e4567-e89b-12d3-a456-426614174000",
    "program": "Toán học",
    "tags": ["Toán", "Đại số", "Ma trận"],
    "languages": ["vi"],
    "license": "CC-BY",
    "visibility": "public",
    "status": "published",
    "downloads": 1240,
    "views": 3560,
    "uploadDate": ISODate("2024-01-15T10:35:00.000Z"),
    "createdAt": ISODate("2024-01-15T10:35:00.000Z"),
    "updatedAt": ISODate("2024-01-15T10:35:00.000Z")
}
```

---

### 3. Courses Collection

**Collection Name**: `Courses`

**Mục đích**: Quản lý các khóa học trực tuyến

**Schema**:
```javascript
{
    _id: ObjectId,
    course_id: String,                // Custom ID: course_${uuid}
    title: String,                    // Required, max 200 chars
    subtitle: String,                 // Max 300 chars
    description: String,              // Required, min 50 chars
    thumbnail: {
        originalName: String,
        fileName: String,
        filePath: String,
        fileSize: Number,
        mimeType: String
    },
    instructor: {
        id: String,                   // Required: user_id
        name: String,                 // Required
        avatar: String,
        bio: String
    },
    category: String,                 // enum: programming, design, business, language, marketing, science, other
    level: String,                    // enum: beginner, intermediate, advanced, expert
    modules: [{
        module_id: String,            // module_${uuid}
        title: String,
        description: String,
        lessons: [{
            lesson_id: String,        // lesson_${uuid}
            title: String,
            description: String,
            duration: Number,         // Minutes
            videoUrl: String,
            content: String,          // HTML or markdown
            resources: [{
                title: String,
                url: String,
                type: String          // pdf, video, link
            }],
            isPreview: Boolean,
            order: Number
        }],
        order: Number
    }],
    pricing: {
        isFree: Boolean,
        price: Number,
        originalPrice: Number,
        currency: String              // Default: 'VND'
    },
    duration: Number,                 // Total hours
    lessonsCount: Number,
    enrolledCount: Number,
    rating: Number,                   // 0-5
    ratingCount: Number,
    reviewCount: Number,
    tags: [String],
    languages: [String],              // Default: ['vi']
    whatYouWillLearn: [String],
    requirements: [String],
    targetAudience: [String],
    isBestSeller: Boolean,
    status: String,                   // enum: draft, published, archived
    visibility: String,               // enum: public, private
    createdAt: Date,
    updatedAt: Date
}
```

**Indexes**:
```javascript
{ course_id: 1 }                     // Unique
{ 'instructor.id': 1 }
{ category: 1 }
{ level: 1 }
{ status: 1 }
{ visibility: 1 }
{ createdAt: -1 }
{ enrolledCount: -1 }
{ rating: -1 }
{ title: 'text', description: 'text', subtitle: 'text', tags: 'text' }  // Text index
```

---

### 4. Enrollments Collection

**Collection Name**: `Enrollments`

**Mục đích**: Đăng ký khóa học của học viên

**Schema**:
```javascript
{
    _id: ObjectId,
    enrollment_id: String,            // enrollment_${uuid}
    user_id: String,                  // Required
    course_id: String,                // Required
    enrolledAt: Date,                 // Default: Date.now
    progress: {
        completedLessons: [{
            lesson_id: String,
            completedAt: Date
        }],
        lastAccessedLesson: {
            lesson_id: String,
            module_id: String
        },
        completionPercentage: Number  // 0-100
    },
    status: String,                   // enum: active, completed, cancelled
    createdAt: Date,
    updatedAt: Date
}
```

**Indexes**:
```javascript
{ enrollment_id: 1 }                 // Unique
{ user_id: 1, course_id: 1 }         // Compound unique
{ course_id: 1 }
{ enrolledAt: -1 }
```

---

### 5. Payments Collection

**Collection Name**: `Payments`

**Mục đích**: Quản lý thanh toán khóa học

**Schema**:
```javascript
{
    _id: ObjectId,
    payment_id: String,               // payment_${uuid}
    user_id: String,                  // Required
    course_id: String,                // Required
    enrollment_id: String,
    amount: Number,                   // Required, min: 0
    currency: String,                 // Default: 'VND'
    payos_order_code: Number,        // PayOS order code
    payos_payment_link_id: String,
    payos_checkout_url: String,
    status: String,                   // enum: pending, processing, completed, failed, cancelled
    customer_info: {
        name: String,
        email: String,
        phone: String
    },
    provider_data: Mixed,             // Additional payment provider data
    paid_at: Date,
    expired_at: Date,
    metadata: Mixed,
    createdAt: Date,
    updatedAt: Date
}
```

**Indexes**:
```javascript
{ payment_id: 1 }                    // Unique
{ user_id: 1, course_id: 1 }
{ status: 1, createdAt: -1 }
{ payos_order_code: 1 }
```

---

### 6. BlogPosts Collection

**Collection Name**: `BlogPosts`

**Mục đích**: Bài viết blog về học tập

**Schema**:
```javascript
{
    _id: ObjectId,
    blog_post_id: String,             // blog_${uuid}
    title: String,                    // Required, max 200 chars
    slug: String,                     // Required, unique
    description: String,              // Required, max 500 chars
    content: String,                  // Required (HTML)
    category: String,                 // enum: Tài liệu học tập, Mẹo học tập, Công nghệ / Lập trình, Kinh nghiệm sinh viên, Hướng dẫn sử dụng OLF
    tags: [String],
    author: {
        id: String,                   // Required: user_id
        name: String,                 // Required
        avatar: String
    },
    coverImage: String,
    readingTime: Number,              // Required, min: 1 (minutes)
    featured: Boolean,                // Default: false
    status: String,                   // enum: draft, published, archived
    views: Number,                    // Default: 0
    likes: Number,                    // Default: 0
    publishedDate: Date,               // Default: Date.now
    createdAt: Date,
    updatedAt: Date
}
```

**Indexes**:
```javascript
{ blog_post_id: 1 }                  // Unique
{ slug: 1 }                          // Unique
{ category: 1 }
{ status: 1 }
{ featured: 1 }
{ publishedDate: -1 }
{ views: -1 }
{ likes: -1 }
{ title: 'text', description: 'text', content: 'text', tags: 'text' }  // Text index
```

---

### 7. Posts Collection (Forum)

**Collection Name**: `posts`

**Mục đích**: Bài viết trong diễn đàn

**Schema**:
```javascript
{
    _id: ObjectId,                    // MongoDB ObjectId (no custom ID)
    author: {
        userId: String,               // Required: user_id
        name: String,                 // Required
        avatar: String                // Default: ''
    },
    content: String,                  // Required, max 5000 chars
    images: [String],                 // Array of image URLs
    likes: [{
        userId: String,               // Required
        name: String,                 // Required
        likedAt: Date                 // Default: Date.now
    }],
    comments: [{
        author: {
            userId: String,
            name: String,
            avatar: String
        },
        content: String,              // Required, max 1000 chars
        createdAt: Date              // Default: Date.now
    }],
    createdAt: Date,
    updatedAt: Date
}
```

**Indexes**:
```javascript
{ createdAt: -1 }
{ 'author.userId': 1 }
```

**Lưu ý**: Forum posts sử dụng MongoDB ObjectId thay vì custom ID.

---

## File Storage System

### Cấu Trúc Thư Mục

```
server/
├── auth-service/
│   └── uploads/
│       └── avatars/              # Avatar images
│
├── document-service/
│   └── uploads/
│       ├── documents/            # PDF, PPTX, DOCX, ZIP files
│       └── thumbnails/           # Thumbnail images
│
├── course-service/
│   └── uploads/
│       ├── thumbnails/           # Course thumbnail images
│       └── videos/               # Course video files
│
└── forum-service/
    └── uploads/
        └── images/               # Forum post images
```

### File Naming Convention

**Format**: `{timestamp}_{uuid}{extension}`

**Ví dụ**:
```
1704067200000_550e8400e29b41d4a716446655440000.pdf
1704067200123_660f9511f39c52e5b827557766001111.jpg
course_1704067200456_770g0622f40d63f6c938668877112222.png
video_1704067200789_880h1733g51e74g7d049779988223333.mp4
```

**Quy Tắc**:
- **Timestamp**: Milliseconds since epoch (Date.now())
- **UUID**: UUID v4 without dashes (32 hex characters)
- **Extension**: Original file extension

### File Upload Configuration

#### Document Service

**Location**: `server/document-service/uploads/`

**Multer Configuration**:
```javascript
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const uploadFiles = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.fieldname === 'file') {
                cb(null, './uploads/documents')
            } else if (file.fieldname === 'thumbnail') {
                cb(null, './uploads/thumbnails')
            }
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now()
            const uuid = uuidv4().replace(/-/g, '')
            const ext = path.extname(file.originalname)
            const fileName = `${timestamp}_${uuid}${ext}`
            cb(null, fileName)
        }
    }),
    limits: {
        fileSize: 50 * 1024 * 1024  // 50MB
    }
})
```

**Allowed File Types**:
- **Documents**: `.pdf`, `.pptx`, `.docx`, `.zip`
- **Thumbnails**: Image files (`.jpg`, `.png`, `.gif`, etc.)

**File Size Limits**:
- **Document**: 50MB max
- **Thumbnail**: 5MB max

#### Course Service

**Location**: `server/course-service/uploads/`

**Multer Configuration**:
```javascript
const uploadCourseFiles = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.fieldname === 'thumbnail') {
                cb(null, './uploads/thumbnails')
            } else if (file.fieldname.startsWith('video_')) {
                cb(null, './uploads/videos')
            }
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now()
            const uuid = uuidv4().replace(/-/g, '')
            const ext = path.extname(file.originalname)
            
            if (file.fieldname === 'thumbnail') {
                const fileName = `course_${timestamp}_${uuid}${ext}`
                cb(null, fileName)
            } else if (file.fieldname.startsWith('video_')) {
                const fileName = `video_${timestamp}_${uuid}${ext}`
                cb(null, fileName)
            }
        }
    }),
    limits: {
        fileSize: 500 * 1024 * 1024  // 500MB
    }
})
```

**Allowed File Types**:
- **Thumbnails**: Image files
- **Videos**: Video files (`.mp4`, `.avi`, `.mov`, etc.)

**File Size Limits**:
- **Thumbnail**: 5MB max
- **Video**: 500MB max

### Static File Serving

**Express Static Middleware**:
```javascript
// Document Service
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Access files:
// http://localhost:3003/uploads/documents/{fileName}
// http://localhost:3003/uploads/thumbnails/{fileName}
```

**URL Examples**:
```
http://localhost:3003/uploads/documents/1704067200000_550e8400e29b41d4a716446655440000.pdf
http://localhost:3003/uploads/thumbnails/1704067200123_660f9511f39c52e5b827557766001111.jpg
http://localhost:3004/uploads/thumbnails/course_1704067200456_770g0622f40d63f6c938668877112222.png
http://localhost:3004/uploads/videos/video_1704067200789_880h1733g51e74g7d049779988223333.mp4
```

### Docker Volume Mounting

**docker-compose.yml**:
```yaml
services:
  document-service:
    volumes:
      - ./server/document-service/uploads:/app/uploads
  
  course-service:
    volumes:
      - ./server/course-service/uploads:/app/uploads
  
  auth-service:
    volumes:
      - ./server/auth-service/uploads:/app/uploads
```

**Lợi ích**:
- Files persist khi restart containers
- Files accessible từ host machine
- Backup dễ dàng

---

## Indexes & Performance

### Index Types

#### 1. Single Field Index

```javascript
// Unique index
{ email: 1 }                    // Unique constraint
{ user_id: 1 }                  // Unique constraint

// Regular index
{ role: 1 }                     // Ascending
{ createdAt: -1 }              // Descending
```

#### 2. Compound Index

```javascript
// Compound unique index
{ user_id: 1, course_id: 1 }   // Unique combination

// Compound index for queries
{ status: 1, createdAt: -1 }    // Query by status, sort by date
{ document_id: 1, user_id: 1 }  // Query by both fields
```

#### 3. Text Index

```javascript
// Full-text search
{ 
    title: 'text', 
    description: 'text', 
    tags: 'text' 
}

// Usage
db.collection.find({ $text: { $search: 'đại số tuyến tính' } })
```

### Index Strategy

**High Priority Indexes**:
- Unique fields (`email`, `user_id`, `document_id`)
- Foreign keys (`uploaderId`, `instructor.id`, `author.id`)
- Frequently queried fields (`status`, `visibility`, `category`)
- Sort fields (`createdAt`, `downloads`, `rating`)

**Performance Tips**:
1. **Create indexes** cho fields thường query
2. **Use compound indexes** cho queries phức tạp
3. **Text indexes** cho full-text search
4. **Monitor index usage** với `explain()`
5. **Remove unused indexes** để tối ưu write performance

---

## Data Relationships

### Relationship Diagram

```
UserCollection
    ├── → TaiLieu (uploaderId, author.id)
    ├── → Courses (instructor.id)
    ├── → Enrollments (user_id)
    ├── → Payments (user_id)
    ├── → BlogPosts (author.id)
    ├── → Posts (author.userId)
    └── → DocumentRatings (user_id)

TaiLieu
    ├── → UserCollection (uploaderId, author.id)
    └── → DocumentRatings (document_id)

Courses
    ├── → UserCollection (instructor.id)
    ├── → Enrollments (course_id)
    └── → Payments (course_id)

Enrollments
    ├── → UserCollection (user_id)
    └── → Courses (course_id)
```

### Reference Patterns

#### 1. Embedded Documents

**Courses → Modules → Lessons**:
```javascript
{
    course_id: "...",
    modules: [
        {
            module_id: "...",
            lessons: [
                {
                    lesson_id: "...",
                    title: "..."
                }
            ]
        }
    ]
}
```

**Posts → Comments**:
```javascript
{
    _id: ObjectId("..."),
    content: "...",
    comments: [
        {
            author: { ... },
            content: "..."
        }
    ]
}
```

#### 2. Reference by ID

**User → Documents**:
```javascript
// UserCollection
{
    user_id: "user_123",
    uploaded_documents: ["doc_456", "doc_789"]
}

// TaiLieu
{
    document_id: "doc_456",
    uploaderId: "user_123"
}
```

**Course → Enrollments**:
```javascript
// Courses
{
    course_id: "course_123"
}

// Enrollments
{
    enrollment_id: "enrollment_456",
    course_id: "course_123",
    user_id: "user_789"
}
```

---

## Backup & Recovery

### Backup Strategy

#### 1. MongoDB Backup

**mongodump Command**:
```bash
# Backup entire database
mongodump --uri="mongodb://localhost:27017/EduShareDB" --out=./backup

# Backup specific collection
mongodump --uri="mongodb://localhost:27017/EduShareDB" --collection=UserCollection --out=./backup

# Backup with compression
mongodump --uri="mongodb://localhost:27017/EduShareDB" --gzip --archive=./backup.gz
```

**MongoDB Atlas Backup**:
- Automatic daily backups
- Point-in-time recovery
- Manual snapshots

#### 2. File System Backup

**Backup Uploads Directory**:
```bash
# Backup document-service uploads
tar -czf document-uploads-backup.tar.gz server/document-service/uploads/

# Backup course-service uploads
tar -czf course-uploads-backup.tar.gz server/course-service/uploads/

# Backup all uploads
tar -czf all-uploads-backup.tar.gz server/*/uploads/
```

### Recovery Process

#### 1. Restore MongoDB

```bash
# Restore entire database
mongorestore --uri="mongodb://localhost:27017/EduShareDB" ./backup/EduShareDB

# Restore specific collection
mongorestore --uri="mongodb://localhost:27017/EduShareDB" --collection=UserCollection ./backup/EduShareDB/UserCollection.bson
```

#### 2. Restore Files

```bash
# Extract backup
tar -xzf document-uploads-backup.tar.gz

# Copy to service directory
cp -r uploads/ server/document-service/
```

---

## Best Practices

### 1. Database Design

**✅ Do**:
- Use meaningful collection names
- Create indexes for frequently queried fields
- Use compound indexes for complex queries
- Validate data at application level
- Use transactions for critical operations

**❌ Don't**:
- Store large files in MongoDB (use file system)
- Create too many indexes (affects write performance)
- Store sensitive data without encryption
- Use nested arrays too deeply

### 2. File Storage

**✅ Do**:
- Use unique file names (timestamp + UUID)
- Validate file types and sizes
- Store file metadata in database
- Use proper file extensions
- Organize files by type (documents, thumbnails, videos)

**❌ Don't**:
- Store files with original names (security risk)
- Allow unlimited file sizes
- Store files in database
- Expose file paths directly

### 3. Performance

**✅ Do**:
- Use indexes strategically
- Limit query results with pagination
- Use projection to select only needed fields
- Use lean() for read-only queries
- Cache frequently accessed data

**❌ Don't**:
- Query without indexes
- Load all documents at once
- Use populate() unnecessarily
- Ignore query performance

### 4. Security

**✅ Do**:
- Hash passwords with bcrypt
- Validate all inputs
- Use environment variables for sensitive data
- Implement access control
- Sanitize file uploads

**❌ Don't**:
- Store plain text passwords
- Trust client-side validation only
- Expose database credentials
- Allow arbitrary file uploads

---

## Data Migration

### From Local to Atlas

**Step 1: Export from Local**:
```bash
mongodump --uri="mongodb://localhost:27017/EduShareDB" --archive=eduShare-backup.archive
```

**Step 2: Import to Atlas**:
```bash
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/OpenLearnFoundation" --archive=eduShare-backup.archive
```

### Collection Renaming

**Example: ToursCollection → TaiLieu**:
```javascript
// Rename collection
db.ToursCollection.renameCollection("TaiLieu")

// Update field names
db.TaiLieu.updateMany(
    {},
    { $rename: { "tour_id": "document_id", "tour_name": "title" } }
)
```

---

## Monitoring & Maintenance

### Database Statistics

**Check Collection Sizes**:
```javascript
db.stats()
db.UserCollection.stats()
db.TaiLieu.stats()
```

**Check Index Usage**:
```javascript
db.TaiLieu.aggregate([{ $indexStats: {} }])
```

### Performance Monitoring

**Slow Query Log**:
```javascript
// Enable profiling
db.setProfilingLevel(1, { slowms: 100 })

// View slow queries
db.system.profile.find().sort({ ts: -1 }).limit(10)
```

**Query Explain**:
```javascript
db.TaiLieu.find({ title: "Đại số" }).explain("executionStats")
```

---

## Tổng Kết

### Database Summary

- **Total Collections**: 12
- **Database Name**: EduShareDB / OpenLearnFoundation
- **Storage Engine**: WiredTiger (MongoDB default)
- **Replication**: Replica Sets (production)
- **Sharding**: Not implemented (single node)

### File Storage Summary

- **Total Services with Uploads**: 4
  - Auth Service (avatars)
  - Document Service (documents, thumbnails)
  - Course Service (thumbnails, videos)
  - Forum Service (images)

- **Total Storage Locations**: 7 directories
- **File Naming**: Timestamp + UUID
- **Max File Sizes**: 50MB (documents), 500MB (videos)

---

**Tài liệu được cập nhật lần cuối: 2024-01-15**

**Ghi chú**: Database và file storage được thiết kế để scale và maintain dễ dàng. Luôn backup dữ liệu trước khi thực hiện migration hoặc thay đổi lớn.


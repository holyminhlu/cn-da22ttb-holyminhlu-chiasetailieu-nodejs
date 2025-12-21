# 🆔 Quá Trình Sinh ID - OpenLearnFoundation

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Các Loại ID Trong Hệ Thống](#các-loại-id-trong-hệ-thống)
3. [Cơ Chế Sinh ID](#cơ-chế-sinh-id)
4. [Chi Tiết Từng Loại ID](#chi-tiết-từng-loại-id)
5. [MongoDB ObjectId](#mongodb-objectid)
6. [Quy Trình Tạo ID Khi Tạo Dữ Liệu Mới](#quy-trình-tạo-id-khi-tạo-dữ-liệu-mới)
7. [Fallback Mechanism](#fallback-mechanism)
8. [Best Practices](#best-practices)
9. [Ví Dụ Thực Tế](#ví-dụ-thực-tế)

---

## Tổng Quan

Hệ thống **OpenLearnFoundation** sử dụng **UUID v4** (Universally Unique Identifier) làm cơ chế chính để sinh ID cho các entities. Mỗi loại entity có prefix riêng để dễ nhận biết và quản lý.

### Nguyên Tắc Thiết Kế

1. **Uniqueness**: Mỗi ID là duy nhất trên toàn hệ thống
2. **Readability**: ID có prefix để dễ nhận biết loại entity
3. **Scalability**: UUID đảm bảo không trùng lặp ngay cả khi scale
4. **Fallback**: Có cơ chế dự phòng nếu UUID không khả dụng

---

## Các Loại ID Trong Hệ Thống

### Bảng Tổng Hợp

| Loại Entity | Prefix | Format | Ví Dụ |
|------------|--------|--------|-------|
| User | `user_` | `user_${uuidv4()}` | `user_123e4567-e89b-12d3-a456-426614174000` |
| Document | `doc_` | `doc_${uuidv4()}` | `doc_987fcdeb-51a2-43f1-b567-123456789abc` |
| Course | `course_` | `course_${uuidv4()}` | `course_456e7890-12ab-34cd-ef56-789012345def` |
| Blog Post | `blog_` | `blog_${uuidv4()}` | `blog_789abc12-34de-56fg-hi78-90abcdef1234` |
| Enrollment | `enrollment_` | `enrollment_${uuidv4()}` | `enrollment_abc12345-6789-abcd-ef12-34567890cdef` |
| Payment | `payment_` | `payment_${uuidv4()}` | `payment_def45678-90ab-cdef-1234-567890abcdef` |
| Lesson | `lesson_` | `lesson_${uuidv4()}` | `lesson_12345678-90ab-cdef-1234-567890abcdef` |
| Module | `module_` | `module_${uuidv4()}` | `module_abcdef12-3456-7890-abcd-ef1234567890` |
| Forum Post | - | MongoDB ObjectId | `507f1f77bcf86cd799439011` |

---

## Cơ Chế Sinh ID

### UUID v4 (Primary Method)

**UUID (Universally Unique Identifier)** là chuẩn quốc tế để tạo ID duy nhất. UUID v4 sử dụng random numbers, đảm bảo tính duy nhất cao.

**Đặc điểm**:
- **Độ dài**: 36 ký tự (32 hex + 4 dấu gạch ngang)
- **Format**: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
- **Uniqueness**: Xác suất trùng lặp cực thấp (1/5.3×10³⁶)
- **Không cần server**: Có thể generate ở client hoặc server

**Ví dụ UUID v4**:
```
123e4567-e89b-12d3-a456-426614174000
```

### Fallback Method

Nếu UUID không khả dụng, hệ thống sử dụng fallback method:

```javascript
`${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
```

**Đặc điểm**:
- **Timestamp**: `Date.now()` - milliseconds từ 1970
- **Random**: `Math.random().toString(36).substr(2, 9)` - 9 ký tự random
- **Format**: `prefix_1234567890123_abc123xyz`

**Ví dụ Fallback ID**:
```
user_1704067200000_k3j9x2m8p
```

---

## Chi Tiết Từng Loại ID

### 1. User ID (`user_id`)

**File**: `server/auth-service/models/authModel.js`

**Function**:
```javascript
const generateUserId = () => {
    try {
        const { v4: uuidv4 } = require('uuid')
        const userId = `user_${uuidv4()}`
        console.log('🆔 Generated user_id:', userId)
        return userId
    } catch (error) {
        // Fallback
        const fallbackId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        console.log('🆔 Generated fallback user_id:', fallbackId)
        return fallbackId
    }
}
```

**Schema**:
```javascript
user_id: {
    type: String,
    required: true,
    unique: true,
    default: generateUserId
}
```

**Khi Nào Được Tạo**:
- Khi user đăng ký tài khoản mới
- Tự động generate khi tạo document mới trong MongoDB

**Ví Dụ**:
```
user_123e4567-e89b-12d3-a456-426614174000
```

**Index**:
```javascript
accountSchema.index({ user_id: 1 }, { unique: true })
```

---

### 2. Document ID (`document_id`)

**File**: `server/document-service/models/documentModel.js`

**Function**:
```javascript
const generateDocumentId = () => {
    try {
        const docId = `doc_${uuidv4()}`
        console.log('🆔 Generated document_id:', docId)
        return docId
    } catch (error) {
        // Fallback
        const fallbackId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        console.log('🆔 Generated fallback document_id:', fallbackId)
        return fallbackId
    }
}
```

**Schema**:
```javascript
document_id: {
    type: String,
    required: true,
    unique: true,
    default: generateDocumentId
}
```

**Khi Nào Được Tạo**:
- Khi user upload tài liệu mới
- Tự động generate khi tạo document mới trong MongoDB

**Ví Dụ**:
```
doc_987fcdeb-51a2-43f1-b567-123456789abc
```

**Index**:
```javascript
documentSchema.index({ document_id: 1 }, { unique: true })
```

---

### 3. Course ID (`course_id`)

**File**: `server/course-service/models/courseModel.js`

**Function**:
```javascript
const generateCourseId = () => {
    try {
        const courseId = `course_${uuidv4()}`
        console.log('🆔 Generated course_id:', courseId)
        return courseId
    } catch (error) {
        // Fallback
        const fallbackId = `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        console.log('🆔 Generated fallback course_id:', fallbackId)
        return fallbackId
    }
}
```

**Schema**:
```javascript
course_id: {
    type: String,
    required: true,
    unique: true,
    default: generateCourseId
}
```

**Khi Nào Được Tạo**:
- Khi instructor tạo khóa học mới
- Tự động generate khi tạo document mới trong MongoDB

**Ví Dụ**:
```
course_456e7890-12ab-34cd-ef56-789012345def
```

**Index**:
```javascript
courseSchema.index({ course_id: 1 }, { unique: true })
```

---

### 4. Blog Post ID (`blog_post_id`)

**File**: `server/blog-service/models/blogPostModel.js`

**Function**:
```javascript
const generateBlogPostId = () => {
    try {
        const postId = `blog_${uuidv4()}`
        return postId
    } catch (error) {
        // Fallback
        const fallbackId = `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        return fallbackId
    }
}
```

**Schema**:
```javascript
blog_post_id: {
    type: String,
    required: true,
    unique: true,
    default: generateBlogPostId
}
```

**Khi Nào Được Tạo**:
- Khi admin/author tạo bài viết blog mới
- Tự động generate khi tạo document mới trong MongoDB

**Ví Dụ**:
```
blog_789abc12-34de-56fg-hi78-90abcdef1234
```

**Index**:
```javascript
blogPostSchema.index({ blog_post_id: 1 }, { unique: true })
```

---

### 5. Enrollment ID (`enrollment_id`)

**File**: `server/course-service/models/enrollmentModel.js`

**Function**:
```javascript
enrollment_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `enrollment_${uuidv4()}`
}
```

**Khi Nào Được Tạo**:
- Khi user đăng ký khóa học
- Tự động generate khi tạo document mới trong MongoDB

**Ví Dụ**:
```
enrollment_abc12345-6789-abcd-ef12-34567890cdef
```

**Index**:
```javascript
enrollmentSchema.index({ user_id: 1, course_id: 1 }, { unique: true })
```

---

### 6. Payment ID (`payment_id`)

**File**: `server/course-service/models/paymentModel.js`

**Function**:
```javascript
payment_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `payment_${uuidv4()}`
}
```

**Khi Nào Được Tạo**:
- Khi user tạo payment cho khóa học
- Tự động generate khi tạo document mới trong MongoDB

**Ví Dụ**:
```
payment_def45678-90ab-cdef-1234-567890abcdef
```

**Index**:
```javascript
paymentSchema.index({ payment_id: 1 }, { unique: true })
```

---

### 7. Lesson ID (`lesson_id`)

**File**: `server/course-service/models/courseModel.js`

**Function**:
```javascript
lesson_id: {
    type: String,
    required: true,
    default: () => `lesson_${uuidv4()}`
}
```

**Khi Nào Được Tạo**:
- Khi instructor thêm bài học vào khóa học
- Tự động generate khi tạo lesson mới trong course

**Ví Dụ**:
```
lesson_12345678-90ab-cdef-1234-567890abcdef
```

**Lưu ý**: Lesson ID là nested trong Course document, không có collection riêng.

---

### 8. Module ID (`module_id`)

**File**: `server/course-service/models/courseModel.js`

**Function**:
```javascript
module_id: {
    type: String,
    required: true,
    default: () => `module_${uuidv4()}`
}
```

**Khi Nào Được Tạo**:
- Khi instructor thêm module/chương vào khóa học
- Tự động generate khi tạo module mới trong course

**Ví Dụ**:
```
module_abcdef12-3456-7890-abcd-ef1234567890
```

**Lưu ý**: Module ID là nested trong Course document, không có collection riêng.

---

### 9. Forum Post ID

**File**: `server/forum-service/models/postModel.js`

**Đặc biệt**: Forum posts **KHÔNG** sử dụng custom ID, mà sử dụng **MongoDB ObjectId** mặc định.

**Schema**:
```javascript
const postSchema = new mongoose.Schema({
    // Không có custom ID field
    author: { ... },
    content: { ... },
    // ...
}, {
    timestamps: true
})
```

**Khi Nào Được Tạo**:
- Tự động generate bởi MongoDB khi tạo document mới
- Format: `507f1f77bcf86cd799439011` (24 hex characters)

**Lý Do**:
- Forum posts có thể được tạo nhanh chóng
- ObjectId đủ để đảm bảo uniqueness
- Giảm overhead của UUID generation

---

## MongoDB ObjectId

### Tổng Quan

MongoDB tự động tạo `_id` (ObjectId) cho **MỌI** document trong collection, bất kể có custom ID hay không.

### Format ObjectId

**Cấu trúc**: 12 bytes (24 hex characters)

```
507f1f77bcf86cd799439011
```

**Phân tích**:
- **4 bytes**: Timestamp (seconds since Unix epoch)
- **5 bytes**: Random value (unique per machine/process)
- **3 bytes**: Incrementing counter

### Khi Nào Sử Dụng ObjectId

1. **Internal References**: Khi reference giữa documents trong MongoDB
2. **Default ID**: Khi không cần custom ID (như Forum posts)
3. **Backup/Restore**: ObjectId giữ nguyên khi migrate data

### Khi Nào Sử Dụng Custom ID

1. **External APIs**: Khi expose ID ra ngoài (REST API)
2. **Human Readable**: Khi cần ID dễ đọc (có prefix)
3. **Cross-System**: Khi cần ID consistent across systems

---

## Quy Trình Tạo ID Khi Tạo Dữ Liệu Mới

### 1. Tạo User Mới

**Flow**:
```
User đăng ký
    ↓
POST /api/auth/register
    ↓
authController.CreateAccount()
    ↓
Tạo new User document
    ↓
Mongoose Schema default function chạy
    ↓
generateUserId() được gọi
    ↓
UUID v4 được generate: user_123e4567-...
    ↓
Document được lưu vào MongoDB
    ↓
MongoDB tự động tạo _id (ObjectId)
```

**Code Example**:
```javascript
// server/auth-service/controllers/authController.js
const newUser = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    passWord: hashedPassword,
    // user_id sẽ tự động được generate bởi default function
})

await newUser.save()
// user_id: "user_123e4567-e89b-12d3-a456-426614174000"
// _id: ObjectId("507f1f77bcf86cd799439011")
```

---

### 2. Upload Document Mới

**Flow**:
```
User upload file
    ↓
POST /api/documents/upload
    ↓
documentController.uploadDocument()
    ↓
File được lưu vào filesystem
    ↓
Tạo new Document document
    ↓
generateDocumentId() được gọi
    ↓
UUID v4 được generate: doc_987fcdeb-...
    ↓
Document được lưu vào MongoDB
```

**Code Example**:
```javascript
// server/document-service/controllers/documentController.js
const newDocument = new Document({
    title: req.body.title,
    description: req.body.description,
    file: { ... },
    uploaderId: req.user.user_id,
    // document_id sẽ tự động được generate
})

await newDocument.save()
// document_id: "doc_987fcdeb-51a2-43f1-b567-123456789abc"
// _id: ObjectId("507f1f77bcf86cd799439012")
```

---

### 3. Tạo Course Mới

**Flow**:
```
Instructor tạo course
    ↓
POST /api/courses
    ↓
courseController.createCourse()
    ↓
Tạo new Course document
    ↓
generateCourseId() được gọi
    ↓
UUID v4 được generate: course_456e7890-...
    ↓
Modules và Lessons được tạo với ID riêng
    ↓
Course được lưu vào MongoDB
```

**Code Example**:
```javascript
// server/course-service/controllers/courseController.js
const newCourse = new Course({
    title: req.body.title,
    description: req.body.description,
    instructor: { id: req.user.user_id, ... },
    modules: [
        {
            // module_id sẽ tự động được generate
            title: "Module 1",
            lessons: [
                {
                    // lesson_id sẽ tự động được generate
                    title: "Lesson 1",
                    ...
                }
            ]
        }
    ],
    // course_id sẽ tự động được generate
})

await newCourse.save()
// course_id: "course_456e7890-12ab-34cd-ef56-789012345def"
// modules[0].module_id: "module_abcdef12-3456-7890-abcd-ef1234567890"
// modules[0].lessons[0].lesson_id: "lesson_12345678-90ab-cdef-1234-567890abcdef"
```

---

### 4. Đăng Ký Khóa Học

**Flow**:
```
User đăng ký course
    ↓
POST /api/courses/:id/enroll
    ↓
courseController.enrollCourse()
    ↓
Kiểm tra course có free không
    ↓
Nếu free: Tạo enrollment ngay
    ↓
Nếu paid: Tạo payment trước
    ↓
Tạo new Enrollment document
    ↓
enrollment_id được generate: enrollment_abc12345-...
    ↓
Enrollment được lưu vào MongoDB
```

**Code Example**:
```javascript
// server/course-service/controllers/courseController.js
const newEnrollment = new Enrollment({
    user_id: req.body.user_id,
    course_id: course.course_id,
    // enrollment_id sẽ tự động được generate
    progress: {
        completedLessons: [],
        completionPercentage: 0
    }
})

await newEnrollment.save()
// enrollment_id: "enrollment_abc12345-6789-abcd-ef12-34567890cdef"
```

---

### 5. Tạo Payment

**Flow**:
```
User thanh toán course
    ↓
POST /api/courses/:id/payment
    ↓
paymentController.createPayment()
    ↓
Tạo new Payment document
    ↓
payment_id được generate: payment_def45678-...
    ↓
Tích hợp PayOS để tạo payment link
    ↓
Payment được lưu vào MongoDB
```

**Code Example**:
```javascript
// server/course-service/controllers/paymentController.js
const newPayment = new Payment({
    user_id: req.user.user_id,
    course_id: course.course_id,
    amount: course.pricing.price,
    // payment_id sẽ tự động được generate
    status: 'pending'
})

await newPayment.save()
// payment_id: "payment_def45678-90ab-cdef-1234-567890abcdef"
```

---

## Fallback Mechanism

### Khi Nào Fallback Được Kích Hoạt

1. **UUID package không được cài đặt**
2. **UUID generation bị lỗi**
3. **Runtime error khi gọi uuidv4()**

### Cơ Chế Fallback

**Format**:
```javascript
`${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
```

**Ví Dụ**:
```
user_1704067200000_k3j9x2m8p
doc_1704067200123_a7b9c2d4e
course_1704067200456_f5g8h1i3j
```

**Đặc điểm**:
- **Timestamp**: Đảm bảo uniqueness theo thời gian
- **Random string**: 9 ký tự base36 để tránh collision
- **Prefix**: Vẫn giữ prefix để nhận biết loại entity

### So Sánh UUID vs Fallback

| Tiêu Chí | UUID v4 | Fallback |
|----------|---------|----------|
| **Độ dài** | 36 ký tự | ~25-30 ký tự |
| **Uniqueness** | Rất cao | Cao (với timestamp) |
| **Readability** | Khó đọc | Dễ đọc hơn (có timestamp) |
| **Performance** | Nhanh | Nhanh |
| **Standard** | RFC 4122 | Custom |

---

## Best Practices

### 1. Luôn Sử Dụng Custom ID Cho External APIs

**✅ Tốt**:
```javascript
// Expose custom ID
res.json({
    id: document.document_id,
    title: document.title,
    ...
})
```

**❌ Không nên**:
```javascript
// Expose MongoDB ObjectId
res.json({
    id: document._id.toString(),
    title: document.title,
    ...
})
```

### 2. Sử Dụng Index Cho Custom ID

**✅ Tốt**:
```javascript
documentSchema.index({ document_id: 1 }, { unique: true })
```

**Lợi ích**:
- Tìm kiếm nhanh hơn
- Đảm bảo uniqueness
- Tối ưu query performance

### 3. Validate ID Format

**✅ Tốt**:
```javascript
const isValidDocumentId = (id) => {
    return /^doc_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}
```

### 4. Log ID Generation

**✅ Tốt**:
```javascript
const generateDocumentId = () => {
    const docId = `doc_${uuidv4()}`
    console.log('🆔 Generated document_id:', docId)
    return docId
}
```

**Lợi ích**:
- Debug dễ dàng
- Track ID generation
- Troubleshooting

### 5. Không Thay Đổi ID Sau Khi Tạo

**✅ Tốt**:
```javascript
// ID không được update
documentSchema.pre('save', function(next) {
    if (this.isModified('document_id') && !this.isNew) {
        throw new Error('Cannot modify document_id')
    }
    next()
})
```

---

## Ví Dụ Thực Tế

### Ví Dụ 1: Tạo User Mới

**Request**:
```http
POST /api/auth/register
Content-Type: application/json

{
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "passWord": "password123"
}
```

**Response**:
```json
{
    "success": true,
    "user": {
        "user_id": "user_123e4567-e89b-12d3-a456-426614174000",
        "fullName": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "role": "student",
        "createdAt": "2024-01-15T10:30:00.000Z"
    }
}
```

**MongoDB Document**:
```json
{
    "_id": ObjectId("507f1f77bcf86cd799439011"),
    "user_id": "user_123e4567-e89b-12d3-a456-426614174000",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "passWord": "$2b$10$hashed...",
    "role": "student",
    "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
    "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

---

### Ví Dụ 2: Upload Document

**Request**:
```http
POST /api/documents/upload
Content-Type: multipart/form-data

title: "Slide Đại số tuyến tính"
description: "Tài liệu về ma trận và định thức"
file: [PDF file]
```

**Response**:
```json
{
    "success": true,
    "document": {
        "document_id": "doc_987fcdeb-51a2-43f1-b567-123456789abc",
        "title": "Slide Đại số tuyến tính",
        "description": "Tài liệu về ma trận và định thức",
        "uploaderId": "user_123e4567-e89b-12d3-a456-426614174000",
        "uploadDate": "2024-01-15T10:35:00.000Z"
    }
}
```

**MongoDB Document**:
```json
{
    "_id": ObjectId("507f1f77bcf86cd799439012"),
    "document_id": "doc_987fcdeb-51a2-43f1-b567-123456789abc",
    "title": "Slide Đại số tuyến tính",
    "description": "Tài liệu về ma trận và định thức",
    "file": {
        "fileName": "slide-dstt.pdf",
        "filePath": "/uploads/documents/slide-dstt.pdf",
        "fileSize": 5242880,
        "fileType": "pdf"
    },
    "uploaderId": "user_123e4567-e89b-12d3-a456-426614174000",
    "createdAt": ISODate("2024-01-15T10:35:00.000Z"),
    "updatedAt": ISODate("2024-01-15T10:35:00.000Z")
}
```

---

### Ví Dụ 3: Tạo Course Với Modules và Lessons

**Request**:
```http
POST /api/courses
Content-Type: application/json

{
    "title": "Lập trình Web với React",
    "description": "Khóa học từ cơ bản đến nâng cao",
    "modules": [
        {
            "title": "Module 1: Giới thiệu React",
            "lessons": [
                {
                    "title": "Bài 1: Setup môi trường",
                    "duration": 30
                }
            ]
        }
    ]
}
```

**Response**:
```json
{
    "success": true,
    "course": {
        "course_id": "course_456e7890-12ab-34cd-ef56-789012345def",
        "title": "Lập trình Web với React",
        "modules": [
            {
                "module_id": "module_abcdef12-3456-7890-abcd-ef1234567890",
                "title": "Module 1: Giới thiệu React",
                "lessons": [
                    {
                        "lesson_id": "lesson_12345678-90ab-cdef-1234-567890abcdef",
                        "title": "Bài 1: Setup môi trường",
                        "duration": 30
                    }
                ]
            }
        ]
    }
}
```

---

### Ví Dụ 4: Đăng Ký Khóa Học

**Request**:
```http
POST /api/courses/course_456e7890-12ab-34cd-ef56-789012345def/enroll
Content-Type: application/json

{
    "user_id": "user_123e4567-e89b-12d3-a456-426614174000"
}
```

**Response**:
```json
{
    "success": true,
    "enrollment": {
        "enrollment_id": "enrollment_abc12345-6789-abcd-ef12-34567890cdef",
        "user_id": "user_123e4567-e89b-12d3-a456-426614174000",
        "course_id": "course_456e7890-12ab-34cd-ef56-789012345def",
        "enrolledAt": "2024-01-15T11:00:00.000Z",
        "progress": {
            "completionPercentage": 0,
            "completedLessons": []
        }
    }
}
```

---

## Tổng Kết

### Điểm Mạnh

1. **Uniqueness**: UUID đảm bảo không trùng lặp
2. **Readability**: Prefix giúp nhận biết loại entity
3. **Scalability**: Có thể scale mà không lo collision
4. **Fallback**: Có cơ chế dự phòng an toàn
5. **Standard**: Tuân thủ chuẩn UUID v4

### Lưu Ý

1. **Không thay đổi ID** sau khi đã tạo
2. **Luôn index** custom ID để tối ưu query
3. **Validate format** khi nhận ID từ client
4. **Log generation** để dễ debug
5. **Sử dụng custom ID** cho external APIs

---

**Tài liệu được cập nhật lần cuối: 2024-01-15**

**Ghi chú**: Tất cả ID được generate tự động khi tạo document mới. Không cần manually tạo ID trong code.


# 🗄️ Cấu Trúc Database MongoDB cho EduShare

## 📋 Tổng Quan

Cấu trúc database **EduShareDB** được thiết kế cho nền tảng **chia sẻ tài liệu và học tập trực tuyến**, sử dụng MongoDB để lưu trữ dữ liệu.

## 🎯 Kiến Trúc Database

### **Database:** `EduShareDB`

**Tổng số Collections:** 12 collections

---

## 📊 Danh Sách Collections

### 🔵 **Core Collections (5 collections)**

#### 1. **UserCollection** 👤
**Mục đích:** Quản lý thông tin người dùng, giảng viên, học viên

**Trường quan trọng:**
- `user_id`: ID duy nhất
- `email`: Email đăng nhập (unique)
- `role`: student | instructor | admin
- `avatar_url`: Ảnh đại diện
- `bio`: Tiểu sử
- `contributions`: Số tài liệu đã chia sẻ
- `reputation_score`: Điểm uy tín
- `uploaded_documents`: Mảng ID tài liệu
- `enrolled_courses`: Mảng ID khóa học
- `following`, `followers`: Social

**Indexes:**
- `email` (unique)
- `user_id` (unique)
- `role`
- `created_at`
- `reputation_score`

---

#### 2. **DocumentsCollection** 📚
**Mục đích:** Lưu trữ thông tin tài liệu học tập (PDF, PPT, Video, etc.)

**Trường quan trọng:**
- `document_id`: ID duy nhất
- `title`: Tiêu đề (text search)
- `description`: Mô tả chi tiết (text search)
- `subject`: Môn học (Toán, Lý, CNTT, Tiếng Anh, ...)
- `category`: Danh mục cụ thể
- `type`: PDF | PPT | DOC | Video | Audio | Image | Other
- `level`: THPT | Đại học | Sau đại học | Mọi cấp độ
- `author_id`: ID người upload
- `file_url`: URL file trên cloud
- `thumbnail_url`: URL ảnh thumbnail
- `downloads`: Số lượt tải
- `views`: Số lượt xem
- `rating`: Đánh giá trung bình (0-5)
- `tags`: Tags để tìm kiếm
- `is_featured`: Tài liệu nổi bật
- `is_approved`: Đã duyệt chưa

**Indexes:**
- `document_id` (unique)
- `title`, `description` (text index)
- `subject`, `type`, `level`
- `downloads` (descending)
- `rating` (descending)
- `created_at` (descending)
- `is_featured`, `is_approved`

---

#### 3. **CoursesCollection** 🎓
**Mục đích:** Quản lý các khóa học trực tuyến

**Trường quan trọng:**
- `course_id`: ID duy nhất
- `title`: Tên khóa học (text search)
- `description`: Mô tả (text search)
- `instructor_id`: ID giảng viên
- `subject`: Môn học
- `level`: Cơ bản | Trung bình | Nâng cao | Chuyên sâu
- `duration`: Thời lượng (vd: "4 tuần", "10 giờ")
- `price`: Giá khóa học (0 = free)
- `thumbnail_url`: URL ảnh bìa
- `lessons`: Mảng bài học
  - `lesson_id`
  - `title`
  - `content_url`
  - `duration`
  - `order`
  - `is_free`
- `enrolled_count`: Số học viên
- `rating`: Đánh giá trung bình
- `is_published`: Đã publish chưa

**Indexes:**
- `course_id` (unique)
- `title`, `description` (text index)
- `instructor_id`
- `subject`, `price`, `level`
- `enrolled_count` (descending)
- `rating` (descending)

---

#### 4. **ForumThreadsCollection** 💬
**Mục đích:** Chủ đề thảo luận trong diễn đàn

**Trường quan trọng:**
- `thread_id`: ID chủ đề
- `title`: Tiêu đề (text search)
- `content`: Nội dung (text search)
- `author_id`: ID người tạo
- `category`: general | programming | mathematics | language | science | study
- `tags`: Tags
- `views`: Lượt xem
- `reply_count`: Số phản hồi
- `last_reply_at`: Thời gian phản hồi cuối
- `is_pinned`: Ghim chủ đề
- `is_locked`: Đã khóa

**Indexes:**
- `thread_id` (unique)
- `title`, `content` (text index)
- `category`
- `author_id`
- `created_at` (descending)
- `last_reply_at` (descending)

---

#### 5. **ForumRepliesCollection** 💬
**Mục đích:** Phản hồi cho các chủ đề diễn đàn

**Trường quan trọng:**
- `reply_id`: ID phản hồi
- `thread_id`: ID chủ đề
- `author_id`: ID người trả lời
- `content`: Nội dung (text search)
- `parent_reply_id`: ID phản hồi cha (nested replies)
- `upvotes`, `downvotes`: Vote
- `is_accepted_answer`: Được chấp nhận làm câu trả lời đúng

**Indexes:**
- `reply_id` (unique)
- `thread_id`, `author_id`
- `parent_reply_id`
- `created_at` (descending)

---

### 🟢 **Supporting Collections (7 collections)**

#### 6. **DocumentRatingsCollection** ⭐
**Mục đích:** Đánh giá và bình luận về tài liệu

**Trường quan trọng:**
- `rating_id`: ID đánh giá
- `document_id`: ID tài liệu
- `user_id`: ID người đánh giá
- `rating`: Điểm (1-5 sao)
- `comment`: Nhận xét
- `is_verified_purchase`: Đã tải về file chưa
- `is_helpful`: Số người báo hữu ích

**Indexes:**
- `rating_id` (unique)
- `document_id`, `user_id` (compound unique)
- `rating`
- `created_at` (descending)

---

#### 7. **CourseEnrollmentsCollection** ✅
**Mục đích:** Đăng ký khóa học của học viên

**Trường quan trọng:**
- `enrollment_id`: ID đăng ký
- `course_id`: ID khóa học
- `user_id`: ID học viên
- `enrolled_at`: Ngày đăng ký
- `completed_lessons`: Mảng ID bài đã hoàn thành
- `progress_percentage`: Tiến độ hoàn thành (%)
- `last_accessed_at`: Lần truy cập cuối
- `rating`, `review`: Đánh giá và review
- `certificate_issued`: Đã cấp chứng chỉ
- `certificate_url`: URL chứng chỉ

**Indexes:**
- `enrollment_id` (unique)
- `course_id`, `user_id` (compound unique)
- `enrolled_at` (descending)

---

#### 8. **CollectionsCollection** 📦
**Mục đích:** Bộ sưu tập tài liệu theo chủ đề

**Trường quan trọng:**
- `collection_id`: ID bộ sưu tập
- `title`: Tên bộ sưu tập
- `description`: Mô tả
- `cover_url`: URL ảnh bìa
- `curator_id`: ID người quản lý
- `document_ids`: Danh sách tài liệu
- `follower_count`: Số người theo dõi
- `is_featured`: Nổi bật

**Indexes:**
- `collection_id` (unique)
- `curator_id`
- `created_at` (descending)
- `is_featured`

---

#### 9. **NotificationsCollection** 🔔
**Mục đích:** Thông báo cho người dùng

**Trường quan trọng:**
- `notification_id`: ID thông báo
- `user_id`: ID người nhận
- `type`: Loại thông báo
  - `new_comment`
  - `new_follower`
  - `new_reply`
  - `document_approved`
  - `course_update`
  - `system`
- `title`: Tiêu đề
- `message`: Nội dung
- `related_id`: ID liên quan
- `is_read`: Đã đọc chưa
- `read_at`: Ngày đọc

**Indexes:**
- `notification_id` (unique)
- `user_id`, `is_read` (compound)
- `created_at` (descending)

---

#### 10. **BlogPostsCollection** 📝
**Mục đích:** Bài viết blog về học tập

**Trường quan trọng:**
- `post_id`: ID bài viết
- `title`: Tiêu đề (text search)
- `slug`: URL slug (unique)
- `content`: Nội dung (HTML)
- `excerpt`: Tóm tắt
- `author_id`: ID tác giả
- `featured_image_url`: URL ảnh đại diện
- `category`: tips | news | tutorial | review | case_study
- `tags`: Tags
- `views`: Lượt xem
- `likes`: Lượt like
- `comment_count`: Số bình luận
- `is_published`: Đã publish
- `published_at`: Ngày publish
- `is_featured`: Nổi bật

**Indexes:**
- `post_id` (unique)
- `slug` (unique)
- `title`, `content` (text index)
- `author_id`, `category`
- `published_at` (descending)
- `views` (descending)
- `is_featured`

---

#### 11. **ClassSessionsCollection** 🎥
**Mục đích:** Quản lý buổi học trực tuyến

**Trường quan trọng:**
- `session_id`: ID buổi học
- `class_id`: ID lớp học
- `title`: Tiêu đề buổi học
- `instructor_id`: ID giảng viên
- `scheduled_start`, `scheduled_end`: Thời gian dự kiến
- `actual_start`, `actual_end`: Thời gian thực tế
- `meeting_url`: URL phòng học
- `recording_url`: URL video recording
- `status`: scheduled | in_progress | completed | cancelled
- `attendance_count`: Số học viên tham gia

**Indexes:**
- `session_id` (unique)
- `class_id`, `instructor_id`
- `scheduled_start`
- `status`

---

#### 12. **ClassesCollection** 🏫
**Mục đích:** Quản lý lớp học (class groups)

**Trường quan trọng:**
- `class_id`: ID lớp
- `name`: Tên lớp
- `description`: Mô tả
- `instructor_id`: ID giảng viên
- `max_students`: Số học viên tối đa
- `current_students`: Số học viên hiện tại
- `start_date`, `end_date`: Ngày bắt đầu/kết thúc
- `schedule`: Lịch học (vd: "Thứ 2,4,6 19:00-21:00")
- `is_active`: Trạng thái

**Indexes:**
- `class_id` (unique)
- `instructor_id`
- `is_active`

---

## 🔗 Quan Hệ Giữa Collections

```
UserCollection
    ├── → DocumentsCollection (author_id)
    ├── → CoursesCollection (instructor_id)
    ├── → ForumThreadsCollection (author_id)
    ├── → ForumRepliesCollection (author_id)
    ├── → BlogPostsCollection (author_id)
    ├── → DocumentRatingsCollection (user_id)
    ├── → CourseEnrollmentsCollection (user_id)
    ├── → NotificationsCollection (user_id)
    └── → CollectionsCollection (curator_id)

DocumentsCollection
    ├── → CollectionsCollection (document_ids)
    ├── → DocumentRatingsCollection (document_id)
    └── → NotificationsCollection (related_id)

CoursesCollection
    ├── → CourseEnrollmentsCollection (course_id)
    ├── → NotificationsCollection (related_id)
    └── → UserCollection (enrolled_courses)

ForumThreadsCollection
    ├── → ForumRepliesCollection (thread_id)
    └── → UserCollection

ForumRepliesCollection
    ├── → ForumThreadsCollection (thread_id)
    └── → UserCollection
```

---

## 🚀 Cách Sử Dụng

### 1. **Kết Nối MongoDB**

```javascript
// Connection String
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/EduShareDB')
```

### 2. **Tạo Model (Mongoose)**

```javascript
// Ví dụ: DocumentsCollection
const documentSchema = new mongoose.Schema({
  document_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, enum: ['PDF', 'PPT', 'DOC', 'Video', 'Audio', 'Image', 'Other'] },
  level: { type: String, enum: ['THPT', 'Đại học', 'Sau đại học', 'Mọi cấp độ'] },
  author_id: { type: String, required: true, ref: 'User' },
  file_url: { type: String, required: true },
  thumbnail_url: { type: String, required: true },
  downloads: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  tags: [String],
  is_featured: { type: Boolean, default: false },
  is_approved: { type: Boolean, default: false },
}, { 
  timestamps: true,
  collection: 'DocumentsCollection'
})

// Tạo indexes
documentSchema.index({ document_id: 1 }, { unique: true })
documentSchema.index({ title: 'text', description: 'text' })
documentSchema.index({ downloads: -1 })
documentSchema.index({ created_at: -1 })

const Document = mongoose.model('Document', documentSchema)
```

### 3. **Truy Vấn Dữ Liệu**

```javascript
// Tìm tài liệu theo subject và type
const documents = await Document.find({ 
  subject: 'Toán học', 
  type: 'PDF' 
})

// Text search
const results = await Document.find({ 
  $text: { $search: 'đại số tuyến tính' } 
})

// Lấy tài liệu phổ biến
const popular = await Document.find({ 
  is_approved: true 
}).sort({ downloads: -1 }).limit(10)
```

---

## 📈 Best Practices

### 1. **Indexes**
- Tạo indexes cho các trường thường query
- Sử dụng compound indexes cho queries phức tạp
- Text indexes cho full-text search

### 2. **Validation**
- Validate dữ liệu ở application level
- Sử dụng mongoose validators
- Check required fields trước khi insert

### 3. **Performance**
- Sử dụng lean() cho queries không cần populate
- Limit kết quả trả về
- Sử dụng projection để chỉ lấy fields cần thiết

### 4. **Security**
- Hash passwords với bcrypt
- Validate input ở backend
- Sử dụng MongoDB access control

---

## 📝 File JSON Schema

File chi tiết: **`MONGODB_SCHEMA_DESIGN.json`**

Chứa đầy đủ:
- Schema definition
- Data types
- Validation rules
- Indexes
- Sample documents
- Relationships

---

## 🔄 Migration Strategy

Khi migrate từ tours-service sang documents-service:

1. **UserCollection**: Giữ nguyên, thêm fields mới
2. **ToursCollection** → **DocumentsCollection**: Rename và adjust fields
3. **BookingToursCollection** → **CourseEnrollmentsCollection**: Rename
4. Tạo mới các collections còn lại

---

## 📞 Contact

Nếu có thắc mắc về database design, vui lòng liên hệ team phát triển.


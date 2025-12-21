# 📊 Tính Năng Chính & Luồng Nghiệp Vụ - OpenLearnFoundation

## 📋 Mục Lục

1. [Tổng Quan Tính Năng](#tổng-quan-tính-năng)
2. [Luồng Xác Thực & Quản Lý Tài Khoản](#luồng-xác-thực--quản-lý-tài-khoản)
3. [Luồng Quản Lý Tài Liệu](#luồng-quản-lý-tài-liệu)
4. [Luồng Quản Lý Khóa Học](#luồng-quản-lý-khóa-học)
5. [Luồng Thanh Toán](#luồng-thanh-toán)
6. [Luồng Forum & Blog](#luồng-forum--blog)
7. [Luồng Quản Trị](#luồng-quản-trị)
8. [Tổng Kết Luồng Nghiệp Vụ](#tổng-kết-luồng-nghiệp-vụ)

---

## Tổng Quan Tính Năng

### Danh Sách Tính Năng Chính

#### 1. Xác Thực & Quản Lý Người Dùng
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập/Đăng xuất
- ✅ Quản lý thông tin cá nhân
- ✅ Upload avatar và cover image
- ✅ Xác thực email (tích hợp sẵn)
- ✅ Phân quyền (Student, Instructor, Admin)

#### 2. Quản Lý Tài Liệu
- ✅ Upload tài liệu (PDF, PPTX, DOCX, ZIP)
- ✅ Tìm kiếm tài liệu nâng cao
- ✅ Xem chi tiết tài liệu
- ✅ Tải xuống tài liệu
- ✅ Bookmark tài liệu
- ✅ Đánh giá và nhận xét tài liệu
- ✅ Quản lý tài liệu đã upload

#### 3. Quản Lý Khóa Học
- ✅ Xem danh sách khóa học
- ✅ Xem chi tiết khóa học
- ✅ Đăng ký khóa học
- ✅ Theo dõi tiến độ học tập
- ✅ Quản lý khóa học đã đăng ký
- ✅ Tạo khóa học (Instructor/Admin)

#### 4. Thanh Toán
- ✅ Tích hợp PayOS
- ✅ Tạo payment link
- ✅ Kiểm tra trạng thái thanh toán
- ✅ Webhook callback

#### 5. Forum & Blog
- ✅ Đăng bài trong forum
- ✅ Comment và like bài đăng
- ✅ Upload ảnh cho bài đăng
- ✅ Xem blog posts
- ✅ Tìm kiếm blog theo tags

#### 6. Quản Trị
- ✅ Quản lý users
- ✅ Khóa/Mở khóa tài khoản
- ✅ Xem thống kê
- ✅ Quản lý nội dung

---

## Luồng Xác Thực & Quản Lý Tài Khoản

### 1. Luồng Đăng Ký Tài Khoản

#### Sơ Đồ Luồng
```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Truy cập /signup
       ▼
┌─────────────────┐
│  SignUpView     │
│  - Form đăng ký │
└──────┬──────────┘
       │ 2. Điền thông tin
       │    - Họ tên
       │    - Email
       │    - Mật khẩu
       │    - Xác nhận mật khẩu
       │    - Role (student/instructor)
       │    - Chương trình học
       │    - Đồng ý điều khoản
       ▼
┌─────────────────┐
│  Validation     │
│  - Email format │
│  - Password >=6 │
│  - Required fields
└──────┬──────────┘
       │ 3. Validate
       ▼
┌─────────────────┐
│  Frontend        │
│  POST /api/auth/│
│  register        │
└──────┬──────────┘
       │ 4. HTTP Request
       ▼
┌─────────────────┐
│  API Gateway    │
│  (Port 3000)    │
└──────┬──────────┘
       │ 5. Proxy to Auth Service
       ▼
┌─────────────────┐
│  Auth Service   │
│  (Port 3001)    │
└──────┬──────────┘
       │ 6. Validate input
       │    - Check required fields
       │    - Validate email format
       │    - Check password length
       ▼
┌─────────────────┐
│  Check Email    │
│  Exists?        │
└──────┬──────────┘
       │
       ├─ Yes → Return error: "Email đã được sử dụng"
       │
       └─ No → Continue
              │
              ▼
┌─────────────────┐
│  Hash Password  │
│  (Bcrypt)       │
└──────┬──────────┘
       │ 7. Hash password với salt rounds: 10
       ▼
┌─────────────────┐
│  Create User    │
│  - Generate user_id (UUID)
│  - Set default values
│  - Save to MongoDB
└──────┬──────────┘
       │ 8. Save to UserCollection
       ▼
┌─────────────────┐
│  Generate JWT   │
│  Token          │
└──────┬──────────┘
       │ 9. Create JWT với user info
       │    - Expiration: 7 days
       ▼
┌─────────────────┐
│  Response       │
│  - User info    │
│  - JWT token    │
└──────┬──────────┘
       │ 10. Return to Frontend
       ▼
┌─────────────────┐
│  Frontend       │
│  - Store token  │
│  - Show success │
│  - Redirect to  │
│    signin       │
└─────────────────┘
```

#### Các Bước Chi Tiết

**Bước 1: User truy cập trang đăng ký**
- URL: `/signup` hoặc `/auth?tab=signup`
- Hiển thị form đăng ký với các trường:
  - Họ và tên (required)
  - Email (required, unique)
  - Mật khẩu (required, min 6 ký tự)
  - Xác nhận mật khẩu (required, phải khớp)
  - Vai trò: Student, Instructor, Guest
  - Chương trình học (optional)
  - Đồng ý điều khoản (required)

**Bước 2: User điền form và submit**
- Frontend validate:
  - Email format
  - Password length >= 6
  - Password confirmation match
  - Required fields
  - Terms acceptance

**Bước 3: Frontend gửi request**
```javascript
POST /api/auth/register
Body: {
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  passWord: "password123",
  role: "student",
  major: "Công nghệ thông tin"
}
```

**Bước 4: API Gateway nhận request**
- Route matching: `/api/auth` → `authProxy`
- Path rewrite: `/api/auth/register` → `/register`
- Proxy to: `http://localhost:3001/register`

**Bước 5: Auth Service xử lý**
- Validate input
- Check email exists trong MongoDB
- Hash password với bcrypt
- Generate user_id (UUID format)
- Create user document
- Generate JWT token

**Bước 6: Response**
```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "data": {
    "user": {
      "id": "...",
      "user_id": "user_...",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Bước 7: Frontend xử lý response**
- Store token vào localStorage
- Store user info
- Show success message
- Redirect to signin hoặc home

---

### 2. Luồng Đăng Nhập

#### Sơ Đồ Luồng
```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Truy cập /signin
       ▼
┌─────────────────┐
│  SignInView     │
│  - Form đăng nhập│
└──────┬──────────┘
       │ 2. Nhập email & password
       ▼
┌─────────────────┐
│  Validation     │
└──────┬──────────┘
       │ 3. Validate
       ▼
┌─────────────────┐
│  POST /api/auth/│
│  login           │
└──────┬──────────┘
       │ 4. HTTP Request
       ▼
┌─────────────────┐
│  API Gateway    │
└──────┬──────────┘
       │ 5. Proxy to Auth Service
       ▼
┌─────────────────┐
│  Auth Service   │
└──────┬──────────┘
       │ 6. Find user by email
       ▼
┌─────────────────┐
│  User Found?    │
└──────┬──────────┘
       │
       ├─ No → Return 401: "Email hoặc mật khẩu không đúng"
       │
       └─ Yes → Continue
              │
              ▼
┌─────────────────┐
│  Check is_active│
└──────┬──────────┘
       │
       ├─ false → Return 403: "Tài khoản bị khóa"
       │
       └─ true → Continue
              │
              ▼
┌─────────────────┐
│  Verify Password│
│  (Bcrypt)       │
└──────┬──────────┘
       │ 7. Compare password
       │
       ├─ No Match → Return 401
       │
       └─ Match → Continue
              │
              ▼
┌─────────────────┐
│  Update         │
│  last_login     │
└──────┬──────────┘
       │ 8. Update timestamp
       ▼
┌─────────────────┐
│  Generate JWT   │
│  Token          │
└──────┬──────────┘
       │ 9. Create JWT
       ▼
┌─────────────────┐
│  Response       │
│  - User info    │
│  - JWT token    │
└──────┬──────────┘
       │ 10. Return to Frontend
       ▼
┌─────────────────┐
│  Frontend       │
│  - Store token  │
│  - Store user   │
│  - Redirect to  │
│    home         │
└─────────────────┘
```

#### Các Bước Chi Tiết

**Bước 1: User truy cập trang đăng nhập**
- URL: `/signin` hoặc `/auth?tab=signin`
- Hiển thị form đăng nhập

**Bước 2: User nhập thông tin**
- Email
- Password

**Bước 3: Frontend gửi request**
```javascript
POST /api/auth/login
Body: {
  email: "nguyenvana@example.com",
  passWord: "password123"
}
```

**Bước 4-5: API Gateway → Auth Service**
- Tương tự như đăng ký

**Bước 6: Auth Service xử lý**
- Find user by email
- Check is_active
- Verify password với bcrypt.compare()
- Update last_login
- Generate JWT token

**Bước 7: Response và Frontend**
- Return user info + token
- Frontend store token và user info
- Redirect to home page

---

### 3. Luồng Cập Nhật Profile

#### Sơ Đồ Luồng
```
User → Profile Page → Edit Profile Modal
    ↓
Điền thông tin mới
    ↓
POST /api/auth/customer/update
    ↓
Auth Service
    ├─ Find user by email
    ├─ Update fields
    ├─ Save to MongoDB
    └─ Return updated user
    ↓
Frontend update UI
```

#### Các Trường Có Thể Cập Nhật
- Phone
- Address
- Gender
- Bio
- University
- Major
- Avatar (upload riêng)
- Cover image (upload riêng)

---

### 4. Luồng Upload Avatar/Cover

#### Sơ Đồ Luồng
```
User → Profile Page → Click Upload Avatar
    ↓
Select Image File
    ↓
POST /api/auth/profile/avatar
Content-Type: multipart/form-data
    ↓
Auth Service
    ├─ Multer middleware
    ├─ Validate file (image/*, max 5MB)
    ├─ Save to uploads/avatars/
    ├─ Update user.avatar_url
    └─ Return new avatar_url
    ↓
Frontend update avatar display
```

---

## Luồng Quản Lý Tài Liệu

### 1. Luồng Upload Tài Liệu

#### Sơ Đồ Luồng
```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Click "Tải lên tài liệu"
       ▼
┌─────────────────┐
│  UploadModal    │
│  (4 bước)       │
└──────┬──────────┘
       │
       ├─ Step 1: Basic Info
       │  - Title (required)
       │  - Program (required)
       │  - Description (required)
       │
       ├─ Step 2: Tags & License
       │  - Tags
       │  - Language
       │  - Visibility
       │  - License
       │
       ├─ Step 3: File Upload
       │  - Select document file
       │  - Optional thumbnail
       │  - Accept ToS
       │
       └─ Step 4: Review & Submit
          - Review all info
          - Submit
          │
          ▼
┌─────────────────┐
│  Create FormData │
│  - file          │
│  - thumbnail     │
│  - title         │
│  - description   │
│  - program       │
│  - tags          │
│  - author_id     │
└──────┬───────────┘
       │ 2. POST /api/documents/upload
       ▼
┌─────────────────┐
│  API Gateway    │
│  - Pass through │
│    multipart    │
└──────┬───────────┘
       │ 3. Proxy to Document Service
       ▼
┌─────────────────┐
│ Document Service│
│  (Port 3003)    │
└──────┬───────────┘
       │ 4. Multer middleware
       │    - Validate file type
       │    - Validate file size
       │    - Save to disk
       │
       ├─ File → uploads/documents/
       └─ Thumbnail → uploads/thumbnails/
       │
       ▼
┌─────────────────┐
│  Create Document│
│  - Generate     │
│    document_id  │
│  - Extract      │
│    metadata     │
│  - Save to      │
│    MongoDB      │
└──────┬───────────┘
       │ 5. Save to TaiLieu collection
       ▼
┌─────────────────┐
│  Update User    │
│  - Add to       │
│    uploaded_    │
│    documents    │
│  - Increment    │
│    contributions│
└──────┬───────────┘
       │ 6. Update UserCollection
       ▼
┌─────────────────┐
│  Response       │
│  - document_id  │
│  - document info│
└──────┬───────────┘
       │ 7. Return to Frontend
       ▼
┌─────────────────┐
│  Frontend       │
│  - Show success │
│  - Close modal  │
│  - Refresh list │
└─────────────────┘
```

#### Các Bước Chi Tiết

**Bước 1: User mở Upload Modal**
- Click button "Tải lên tài liệu"
- Modal hiển thị với 4 bước

**Bước 2: Điền thông tin (Step 1)**
- Title: Tên tài liệu (required, max 150 chars)
- Program: Chương trình học (required)
- Description: Mô tả (required, 20-1000 chars)

**Bước 3: Tags & License (Step 2)**
- Tags: Thêm tags (optional)
- Language: Ngôn ngữ (vi/en)
- Visibility: Public/Private/Class-only
- License: CC-BY, CC-BY-NC, etc.

**Bước 4: Upload Files (Step 3)**
- Select document file:
  - Types: PDF, PPTX, DOCX, ZIP
  - Max size: 50MB
- Optional thumbnail:
  - Types: JPG, PNG, WEBP
  - Max size: 5MB
- Accept Terms of Service

**Bước 5: Review & Submit (Step 4)**
- Review all information
- Click "Hoàn tất"

**Bước 6: Frontend tạo FormData**
```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('thumbnail', thumbnailObject);
formData.append('title', title);
formData.append('description', description);
formData.append('program', program);
formData.append('author_id', userId);
formData.append('tags', JSON.stringify(tags));
```

**Bước 7: Gửi request**
```javascript
POST /api/documents/upload
Content-Type: multipart/form-data
Body: FormData
```

**Bước 8: Document Service xử lý**
- Multer middleware:
  - Validate file type
  - Validate file size
  - Save file to `uploads/documents/`
  - Save thumbnail to `uploads/thumbnails/`
- Generate document_id (UUID)
- Create document record trong MongoDB
- Update user's uploaded_documents

**Bước 9: Response**
```json
{
  "success": true,
  "message": "Upload tài liệu thành công",
  "data": {
    "document_id": "doc_...",
    "title": "...",
    "file": {...},
    "thumbnail": "..."
  }
}
```

---

### 2. Luồng Tìm Kiếm Tài Liệu

#### Sơ Đồ Luồng
```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Nhập từ khóa hoặc chọn filters
       ▼
┌─────────────────┐
│  Search Bar     │
│  - Query text   │
│  - Program      │
│  - Tags         │
│  - Category     │
└──────┬──────────┘
       │ 2. Click "Tìm kiếm"
       ▼
┌─────────────────┐
│  GET /api/      │
│  documents/     │
│  search?q=...   │
└──────┬──────────┘
       │ 3. HTTP Request
       ▼
┌─────────────────┐
│  API Gateway    │
└──────┬──────────┘
       │ 4. Proxy to Document Service
       ▼
┌─────────────────┐
│ Document Service│
└──────┬──────────┘
       │ 5. Build MongoDB query
       │    - Text search on title, description
       │    - Filter by program
       │    - Filter by tags
       │    - Filter by category
       │    - Sort by relevance/date/downloads
       │    - Pagination
       ▼
┌─────────────────┐
│  MongoDB Query  │
└──────┬──────────┘
       │ 6. Execute query
       ▼
┌─────────────────┐
│  Results        │
│  - Documents    │
│  - Pagination   │
└──────┬──────────┘
       │ 7. Return to Frontend
       ▼
┌─────────────────┐
│  Frontend       │
│  - Display      │
│    results      │
│  - Show cards   │
└─────────────────┘
```

#### Các Bước Chi Tiết

**Bước 1: User nhập từ khóa**
- Search bar trên header hoặc trang documents
- Có thể kết hợp với filters:
  - Program (CNTT, Kinh tế, ...)
  - Tags
  - Category
  - File type
  - Year

**Bước 2: Frontend gửi request**
```javascript
GET /api/documents/search?q=toán học&program=CNTT&limit=20&page=1
```

**Bước 3-4: API Gateway → Document Service**

**Bước 5: Document Service xử lý**
- Build MongoDB query:
  ```javascript
  {
    $text: { $search: "toán học" },
    program: "CNTT",
    visibility: "public",
    status: "published"
  }
  ```
- Apply pagination
- Sort results
- Populate author info

**Bước 6: MongoDB execute query**
- Text search trên indexed fields
- Filter documents
- Return results

**Bước 7: Response**
```json
{
  "success": true,
  "data": {
    "documents": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalDocuments": 200,
      "limit": 20
    }
  }
}
```

**Bước 8: Frontend hiển thị**
- Render document cards
- Show pagination controls
- Update URL với query params

---

### 3. Luồng Xem Chi Tiết Tài Liệu

#### Sơ Đồ Luồng
```
User → Click on Document Card
    ↓
Navigate to /documents/:id
    ↓
GET /api/documents/:id
    ↓
Document Service
    ├─ Find document by ID
    ├─ Populate author info
    ├─ Get ratings
    ├─ Calculate average rating
    └─ Increment views
    ↓
Return document details
    ↓
Frontend display
    ├─ Document info
    ├─ Author info
    ├─ Download button
    ├─ Bookmark button
    ├─ Rating section
    └─ Related documents
```

#### Các Bước Chi Tiết

**Bước 1: User click vào document card**
- Navigate to `/documents/:id`

**Bước 2: Frontend fetch document**
```javascript
GET /api/documents/:id
```

**Bước 3: Document Service**
- Find document by ID
- Populate author information
- Get ratings từ DocumentRatings collection
- Calculate average rating
- Increment views count
- Get related documents (same tags)

**Bước 4: Response**
```json
{
  "success": true,
  "data": {
    "document_id": "...",
    "title": "...",
    "description": "...",
    "author": {...},
    "file": {...},
    "downloads": 100,
    "views": 501,
    "rating": 4.5,
    "ratingCount": 20,
    "tags": [...],
    "relatedDocuments": [...]
  }
}
```

**Bước 5: Frontend hiển thị**
- Document details
- Author profile
- Download button
- Bookmark button
- Rating và comments
- Related documents

---

### 4. Luồng Tải Xuống Tài Liệu

#### Sơ Đồ Luồng
```
User → Document Detail Page → Click "Tải xuống"
    ↓
POST /api/documents/:id/download
    ↓
Document Service
    ├─ Find document
    ├─ Increment downloads
    ├─ Log download
    └─ Return file URL
    ↓
Frontend
    ├─ Open file in new tab
    └─ Or trigger download
```

#### Các Bước Chi Tiết

**Bước 1: User click "Tải xuống"**
- Button trên document detail page

**Bước 2: Frontend gửi request**
```javascript
POST /api/documents/:id/download
```

**Bước 3: Document Service**
- Find document
- Increment downloads count
- Save to MongoDB
- Return file URL

**Bước 4: Frontend xử lý**
- Open file URL in new tab
- Hoặc trigger browser download

---

### 5. Luồng Bookmark Tài Liệu

#### Sơ Đồ Luồng
```
User → Document Detail → Click Bookmark Icon
    ↓
POST /api/documents/bookmarks
Body: { userId, documentId }
    ↓
Document Service
    ├─ Find user
    ├─ Check if already bookmarked
    ├─ Add to saved_documents
    └─ Save to MongoDB
    ↓
Response: Success
    ↓
Frontend update UI (filled icon)
```

#### Các Bước Chi Tiết

**Bước 1: User click bookmark icon**
- Icon trên document card hoặc detail page

**Bước 2: Frontend gửi request**
```javascript
POST /api/documents/bookmarks
Body: {
  userId: "user_123",
  documentId: "doc_456"
}
```

**Bước 3: Document Service**
- Find user trong UserCollection
- Check if documentId đã có trong saved_documents
- If not, add documentId to array
- Save to MongoDB

**Bước 4: Response**
```json
{
  "success": true,
  "message": "Đã thêm vào bookmark"
}
```

**Bước 5: Frontend update**
- Change icon to filled
- Show success message

---

### 6. Luồng Đánh Giá Tài Liệu

#### Sơ Đồ Luồng
```
User → Document Detail → Rating Section
    ↓
Chọn số sao (1-5) và nhập comment
    ↓
POST /api/rating
Body: {
  document_id,
  user_id,
  rating,
  comment
}
    ↓
Rating Service (via Forum Service)
    ├─ Validate rating (1-5)
    ├─ Check if already rated
    ├─ Create rating record
    ├─ Calculate new average
    └─ Update document rating
    ↓
Response: Success
    ↓
Frontend update rating display
```

#### Các Bước Chi Tiết

**Bước 1: User đánh giá**
- Chọn số sao (1-5)
- Nhập comment (optional)

**Bước 2: Frontend gửi request**
```javascript
POST /api/rating
Body: {
  document_id: "doc_123",
  user_id: "user_456",
  rating: 5,
  comment: "Tài liệu rất hay"
}
```

**Bước 3: Rating Service**
- Validate rating (1-5)
- Check if user đã đánh giá document này
- Create rating record trong DocumentRatings collection
- Calculate new average rating
- Update document's rating và ratingCount

**Bước 4: Response**
```json
{
  "success": true,
  "message": "Đánh giá thành công",
  "data": {
    "rating_id": "...",
    "rating": 5,
    "comment": "..."
  }
}
```

---

## Luồng Quản Lý Khóa Học

### 1. Luồng Xem Danh Sách Khóa Học

#### Sơ Đồ Luồng
```
User → Navigate to /courses
    ↓
GET /api/courses?limit=20&page=1
    ↓
Course Service
    ├─ Build query
    ├─ Apply filters
    ├─ Sort courses
    ├─ Paginate results
    └─ Populate instructor info
    ↓
Return courses list
    ↓
Frontend display course cards
```

#### Các Bước Chi Tiết

**Bước 1: User truy cập trang courses**
- URL: `/courses`

**Bước 2: Frontend fetch courses**
```javascript
GET /api/courses?limit=20&page=1&sortBy=newest&category=Lập trình
```

**Bước 3: Course Service**
- Build MongoDB query
- Apply filters (category, level, isFree, status)
- Sort by newest/popular/price
- Paginate results
- Populate instructor information

**Bước 4: Response**
```json
{
  "success": true,
  "data": {
    "courses": [...],
    "pagination": {...}
  }
}
```

**Bước 5: Frontend hiển thị**
- Course cards với thumbnail
- Instructor info
- Price/free badge
- Enrollment count
- Rating

---

### 2. Luồng Xem Chi Tiết Khóa Học

#### Sơ Đồ Luồng
```
User → Click Course Card
    ↓
Navigate to /course/:id
    ↓
GET /api/courses/:id
    ↓
Course Service
    ├─ Find course by ID
    ├─ Populate instructor
    ├─ Get lessons/modules
    ├─ Get enrollment count
    ├─ Calculate rating
    └─ Check if user enrolled
    ↓
Return course details
    ↓
Frontend display
    ├─ Course info
    ├─ Instructor profile
    ├─ Lessons list
    ├─ Enroll button
    └─ Reviews
```

---

### 3. Luồng Đăng Ký Khóa Học

#### Sơ Đồ Luồng
```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Click "Đăng ký khóa học"
       ▼
┌─────────────────┐
│  Check Login    │
└──────┬──────────┘
       │
       ├─ Not logged in → Redirect to /signin
       │
       └─ Logged in → Continue
              │
              ▼
┌─────────────────┐
│  Check Course   │
│  isFree?        │
└──────┬──────────┘
       │
       ├─ Free → Direct Enrollment
       │  │
       │  ▼
       │  POST /api/courses/:id/enroll
       │  │
       │  ▼
       │  Course Service
       │  ├─ Check if already enrolled
       │  ├─ Create enrollment record
       │  ├─ Update user.enrolled_courses
       │  └─ Update course.enrollmentCount
       │  │
       │  ▼
       │  Response: Success
       │  │
       │  ▼
       │  Frontend: Show success, redirect to course
       │
       └─ Paid → Payment Flow
          │
          ▼
┌─────────────────┐
│  Create Payment │
│  POST /api/     │
│  payments/create│
└──────┬──────────┘
       │ 2. Create payment link
       ▼
┌─────────────────┐
│  Course Service │
│  - Create       │
│    payment      │
│    record       │
│  - Call PayOS   │
│    API          │
│  - Generate     │
│    payment link │
└──────┬──────────┘
       │ 3. Return payment link
       ▼
┌─────────────────┐
│  Frontend        │
│  - Redirect to  │
│    payment page │
└──────┬──────────┘
       │ 4. User completes payment
       ▼
┌─────────────────┐
│  PayOS           │
│  - Process       │
│    payment       │
│  - Webhook       │
│    callback      │
└──────┬──────────┘
       │ 5. Webhook to Course Service
       ▼
┌─────────────────┐
│  Course Service │
│  - Verify       │
│    payment      │
│  - Update       │
│    payment      │
│    status       │
│  - Create       │
│    enrollment   │
└──────┬──────────┘
       │ 6. Enrollment created
       ▼
┌─────────────────┐
│  Frontend        │
│  - Poll payment │
│    status       │
│  - Show success │
│  - Redirect to  │
│    course       │
└─────────────────┘
```

#### Các Bước Chi Tiết

**Bước 1: User click "Đăng ký"**
- Check if user is logged in
- If not, redirect to signin

**Bước 2: Check course pricing**
- If free: Direct enrollment
- If paid: Create payment

**Bước 3: Free Course Enrollment**
```javascript
POST /api/courses/:id/enroll
Body: { user_id: "user_123" }
```

**Course Service xử lý**:
- Check if already enrolled
- Create enrollment record trong Enrollments collection
- Update user.enrolled_courses
- Update course.enrollmentCount
- Return enrollment confirmation

**Bước 4: Paid Course - Create Payment**
```javascript
POST /api/payments/create
Body: {
  course_id: "course_123",
  user_id: "user_456",
  amount: 500000,
  description: "Thanh toán khóa học..."
}
```

**Course Service xử lý**:
- Create payment record trong Payments collection
- Call PayOS API để tạo payment link
- Generate payment_id
- Return payment link

**Bước 5: User completes payment**
- Redirect to PayOS payment page
- User completes payment
- PayOS processes payment

**Bước 6: PayOS Webhook**
- PayOS sends webhook callback
- Course Service verifies payment
- Updates payment status
- Creates enrollment automatically

**Bước 7: Frontend polling**
- Frontend polls payment status
- When status = "paid", show success
- Redirect to course learning page

---

### 4. Luồng Học Tập Khóa Học

#### Sơ Đồ Luồng
```
User → My Courses → Select Course
    ↓
Navigate to /course/:id/learn
    ↓
GET /api/courses/:id/enrollment?userId=...
    ↓
Course Service
    ├─ Find enrollment
    ├─ Get course details
    ├─ Get lessons
    └─ Get progress
    ↓
Return enrollment data
    ↓
Frontend display
    ├─ Course content
    ├─ Lessons list
    ├─ Video player
    ├─ Progress bar
    └─ Next/Previous buttons
```

#### Cập Nhật Tiến Độ
```
User → Complete Lesson
    ↓
PUT /api/courses/:id/progress
Body: {
  userId,
  progress: 50,
  completedLessons: ["lesson_1", "lesson_2"]
}
    ↓
Course Service
    ├─ Find enrollment
    ├─ Update progress
    ├─ Update completed_lessons
    └─ Check if course completed
    ↓
Response: Updated progress
    ↓
Frontend update progress bar
```

---

## Luồng Thanh Toán

### 1. Luồng Tạo Payment Link

#### Sơ Đồ Luồng
```
User → Enroll Paid Course
    ↓
POST /api/payments/create
    ↓
Course Service
    ├─ Create payment record
    ├─ Call PayOS API
    │  ├─ Prepare payment data
    │  ├─ Generate signature
    │  └─ Create payment link
    ├─ Save payment_id
    └─ Return payment link
    ↓
Frontend
    ├─ Store payment info
    └─ Redirect to payment page
```

#### Các Bước Chi Tiết

**Bước 1: User initiates payment**
- Click "Đăng ký" trên paid course

**Bước 2: Frontend gửi request**
```javascript
POST /api/payments/create
Body: {
  course_id: "course_123",
  user_id: "user_456",
  amount: 500000,
  description: "Thanh toán khóa học lập trình"
}
```

**Bước 3: Course Service xử lý**
- Create payment record:
  ```javascript
  {
    payment_id: "payment_...",
    course_id: "...",
    user_id: "...",
    amount: 500000,
    status: "pending",
    created_at: Date
  }
  ```
- Call PayOS API:
  - Prepare payment data
  - Generate HMAC SHA256 signature
  - Create payment link
- Save payment_id và payment_link

**Bước 4: Response**
```json
{
  "success": true,
  "data": {
    "payment_id": "payment_...",
    "payment_link": "https://pay.payos.vn/web/...",
    "amount": 500000,
    "status": "pending"
  }
}
```

**Bước 5: Frontend xử lý**
- Store payment info in localStorage
- Redirect to payment page (`/payment/va`)
- Display payment link button

---

### 2. Luồng Thanh Toán PayOS

#### Sơ Đồ Luồng
```
User → Payment Page → Click "Thanh toán"
    ↓
Open PayOS Payment Link
    ↓
PayOS Payment Page
    ├─ User enters payment info
    ├─ Select payment method
    └─ Confirm payment
    ↓
PayOS Processes Payment
    ├─ Bank transfer
    ├─ E-wallet
    └─ Credit card
    ↓
Payment Success/Failure
    ↓
PayOS Webhook Callback
    POST /api/payments/callback
    ↓
Course Service
    ├─ Verify signature
    ├─ Update payment status
    ├─ If paid: Create enrollment
    └─ Update course enrollmentCount
    ↓
Frontend Polls Status
    GET /api/payments/:payment_id/status
    ↓
When status = "paid"
    ├─ Show success
    └─ Redirect to course
```

#### Các Bước Chi Tiết

**Bước 1: User clicks payment button**
- Open PayOS payment link in new tab

**Bước 2: PayOS payment page**
- User enters payment information
- Select payment method
- Confirm payment

**Bước 3: PayOS processes**
- Process payment through selected method
- Return success/failure

**Bước 4: PayOS webhook**
- PayOS sends callback to:
  ```
  POST /api/payments/callback
  ```
- Includes payment status và signature

**Bước 5: Course Service verifies**
- Verify HMAC signature
- Update payment status trong Payments collection
- If status = "paid":
  - Create enrollment record
  - Update user.enrolled_courses
  - Update course.enrollmentCount

**Bước 6: Frontend polling**
- Frontend polls payment status:
  ```javascript
  GET /api/payments/:payment_id/status
  ```
- When status = "paid":
  - Show success message
  - Redirect to course learning page

---

## Luồng Forum & Blog

### 1. Luồng Đăng Bài Forum

#### Sơ Đồ Luồng
```
User → Forum Page → Click "Đăng bài"
    ↓
Create Post Form
    ├─ Title
    ├─ Content
    ├─ Tags
    └─ Optional images
    ↓
POST /api/forum/posts
    ↓
Forum Service
    ├─ Validate input
    ├─ Save images (if any)
    ├─ Create post record
    └─ Save to MongoDB
    ↓
Response: Post created
    ↓
Frontend
    ├─ Show success
    └─ Refresh posts list
```

#### Các Bước Chi Tiết

**Bước 1: User tạo bài đăng**
- Fill form với title, content, tags
- Optional: Upload images

**Bước 2: Frontend gửi request**
```javascript
POST /api/forum/posts
Body: {
  title: "Câu hỏi về...",
  content: "Nội dung câu hỏi",
  author_id: "user_123",
  tags: ["lập trình", "javascript"]
}
```

**Bước 3: Forum Service xử lý**
- Validate input
- If images: Save to uploads/images/
- Create post record trong posts collection
- Generate post_id

**Bước 4: Response**
```json
{
  "success": true,
  "message": "Đăng bài thành công",
  "data": {
    "id": "...",
    "title": "...",
    "created_at": "..."
  }
}
```

---

### 2. Luồng Comment & Like

#### Sơ Đồ Luồng
```
User → Post Detail → Comment Section
    ↓
Enter Comment
    ↓
POST /api/forum/posts/:id/comments
    ↓
Forum Service
    ├─ Find post
    ├─ Add comment to comments array
    └─ Save to MongoDB
    ↓
Response: Comment added
    ↓
Frontend update comments list
```

#### Like/Unlike Flow
```
User → Click Like Button
    ↓
POST /api/forum/posts/:id/like
Body: { userId }
    ↓
Forum Service
    ├─ Find post
    ├─ Check if user already liked
    │  ├─ Yes → Remove from likes array
    │  └─ No → Add to likes array
    ├─ Update likes count
    └─ Save to MongoDB
    ↓
Response: { liked: true/false, likes: count }
    ↓
Frontend update like button
```

---

### 3. Luồng Xem Blog

#### Sơ Đồ Luồng
```
User → Blog Page
    ↓
GET /api/blogs?limit=20&page=1
    ↓
Blog Service
    ├─ Get blog posts
    ├─ Apply filters
    ├─ Sort by newest/popular
    └─ Paginate
    ↓
Return blog posts
    ↓
Frontend display
    ├─ Featured posts
    ├─ Popular posts
    └─ All posts
```

#### Xem Chi Tiết Blog
```
User → Click Blog Post
    ↓
GET /api/blogs/:id
    ↓
Blog Service
    ├─ Find post by ID
    ├─ Increment views
    ├─ Get related posts
    └─ Return post details
    ↓
Frontend display
    ├─ Post content
    ├─ Author info
    ├─ Tags
    └─ Related posts
```

---

## Luồng Quản Trị

### 1. Luồng Đăng Nhập Admin

#### Sơ Đồ Luồng
```
Admin → /administrator
    ↓
Enter credentials
    ↓
POST /api/auth/login
    ↓
Auth Service
    ├─ Verify credentials
    ├─ Check role = "admin"
    └─ Generate JWT token
    ↓
Response: Token + User (role: admin)
    ↓
Frontend
    ├─ Store token
    └─ Redirect to /administrator/manager-dashboard
```

---

### 2. Luồng Quản Lý Users

#### Sơ Đồ Luồng
```
Admin → Dashboard → Users Tab
    ↓
GET /api/admin/users
Headers: { Authorization: Bearer <token> }
    ↓
API Gateway
    ├─ Verify JWT token
    └─ Proxy to Auth Service
    ↓
Auth Service
    ├─ Verify token
    ├─ Check role = "admin"
    ├─ Get all users
    └─ Remove passwords from response
    ↓
Return users list
    ↓
Frontend display
    ├─ Users table
    ├─ Search & filter
    └─ Action buttons
```

#### Các Thao Tác Admin

**1. Xem User Chi Tiết**
```
GET /api/admin/users/:id
→ Return user details
```

**2. Cập Nhật User**
```
PUT /api/admin/users/:id
Body: {
  role: "instructor",
  is_active: true,
  is_verified: true
}
→ Update user fields
```

**3. Xóa/Khóa User**
```
DELETE /api/admin/users/:id
→ Set is_active = false
Hoặc xóa user khỏi database
```

---

### 3. Luồng Thống Kê

#### Sơ Đồ Luồng
```
Admin → Dashboard → Statistics
    ↓
GET /api/courses/stats
GET /api/documents (with aggregation)
    ↓
Services return statistics
    ├─ Total courses
    ├─ Total documents
    ├─ Total users
    ├─ Total enrollments
    └─ Revenue (if applicable)
    ↓
Frontend display charts
```

---

## Tổng Kết Luồng Nghiệp Vụ

### Luồng Nghiệp Vụ Chính

#### 1. User Journey - Người Dùng Mới
```
1. Truy cập trang chủ
   ↓
2. Xem tài liệu (không cần đăng nhập)
   ↓
3. Đăng ký tài khoản
   ↓
4. Đăng nhập
   ↓
5. Upload tài liệu đầu tiên
   ↓
6. Tìm kiếm và bookmark tài liệu
   ↓
7. Đăng ký khóa học miễn phí
   ↓
8. Thanh toán khóa học có phí
   ↓
9. Học tập và cập nhật tiến độ
   ↓
10. Đánh giá tài liệu và khóa học
```

#### 2. Content Creator Journey
```
1. Đăng ký với role = "instructor"
   ↓
2. Upload nhiều tài liệu
   ↓
3. Tạo khóa học
   ↓
4. Quản lý khóa học
   ↓
5. Xem thống kê đóng góp
   ↓
6. Tương tác với học viên
```

#### 3. Admin Journey
```
1. Đăng nhập với role = "admin"
   ↓
2. Xem dashboard thống kê
   ↓
3. Quản lý users
   │  ├─ Xem danh sách
   │  ├─ Khóa/Mở khóa tài khoản
   │  └─ Thay đổi role
   ↓
4. Quản lý nội dung
   │  ├─ Duyệt tài liệu
   │  ├─ Xóa nội dung không phù hợp
   │  └─ Quản lý khóa học
   ↓
5. Xem báo cáo và thống kê
```

### Luồng Xử Lý Lỗi

#### Error Handling Flow
```
Request → Service
    ↓
Error Occurs
    ↓
Error Handler
    ├─ Log error
    ├─ Format error response
    └─ Send to API Gateway
    ↓
API Gateway
    ├─ Log error
    ├─ Transform error (if needed)
    └─ Send to Frontend
    ↓
Frontend
    ├─ Display error message
    └─ Handle error state
```

### Luồng Bảo Mật

#### Authentication Flow
```
Protected Route
    ↓
Check JWT Token
    ├─ No token → Redirect to login
    ├─ Invalid token → Return 401
    └─ Valid token → Continue
    ↓
Check Role (if required)
    ├─ Wrong role → Return 403
    └─ Correct role → Allow access
    ↓
Process Request
```

### Tổng Kết Các Luồng

| Luồng | Endpoint | Service | Authentication |
|-------|----------|---------|----------------|
| Đăng ký | POST /api/auth/register | Auth | Không |
| Đăng nhập | POST /api/auth/login | Auth | Không |
| Upload tài liệu | POST /api/documents/upload | Document | Có (User) |
| Tìm kiếm | GET /api/documents/search | Document | Không |
| Xem tài liệu | GET /api/documents/:id | Document | Không |
| Bookmark | POST /api/documents/bookmarks | Document | Có (User) |
| Đánh giá | POST /api/rating | Rating | Có (User) |
| Đăng ký khóa học | POST /api/courses/:id/enroll | Course | Có (User) |
| Thanh toán | POST /api/payments/create | Course | Có (User) |
| Quản lý users | GET /api/admin/users | Auth | Có (Admin) |
| Đăng bài forum | POST /api/forum/posts | Forum | Có (User) |
| Xem blog | GET /api/blogs | Blog | Không |

---

**Tài liệu được cập nhật lần cuối: 2024-01-15**

**Ghi chú**: Tất cả các luồng nghiệp vụ đều được thiết kế để đảm bảo trải nghiệm người dùng tốt nhất và bảo mật cao. Các luồng có thể được mở rộng và tối ưu hóa trong tương lai.


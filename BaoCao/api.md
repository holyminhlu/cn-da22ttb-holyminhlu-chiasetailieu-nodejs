# 📚 Tài Liệu API - OpenLearnFoundation

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [API Gateway](#api-gateway)
3. [Authentication Service](#authentication-service)
4. [Document Service](#document-service)
5. [Course Service](#course-service)
6. [Blog Service](#blog-service)
7. [Forum Service](#forum-service)
8. [Payment Service](#payment-service)
9. [Admin Service](#admin-service)
10. [Rating Service](#rating-service)

---

## Tổng Quan

Dự án OpenLearnFoundation sử dụng kiến trúc microservices với API Gateway làm điểm vào duy nhất. Tất cả các request từ frontend đều đi qua API Gateway (port 3000) và được route đến các service tương ứng.

### Base URL
```
http://localhost:3000/api
```

### Các Service
- **API Gateway**: Port 3000
- **Auth Service**: Port 3001
- **Document Service**: Port 3003
- **Course Service**: Port 3004
- **Forum Service**: Port 3005
- **Blog Service**: Port 3006

---

## API Gateway

### GET `/`
**Công dụng**: Kiểm tra trạng thái API Gateway và xem danh sách endpoints

**Đầu vào**: Không có

**Quá trình xử lý**:
1. Trả về thông tin về API Gateway
2. Liệt kê các endpoints có sẵn
3. Hiển thị thông tin các service

**Kết quả**:
```json
{
  "success": true,
  "message": "API Gateway is running",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "endpoints": {
    "courses": "GET /api/courses",
    "documents": "GET /api/documents",
    "auth": "POST /api/auth/login",
    "test": "GET /test"
  },
  "services": {
    "courseService": "http://localhost:3004",
    "documentService": "http://localhost:3003",
    "authService": "http://localhost:3001",
    "blogService": "http://localhost:3006",
    "forumService": "http://localhost:3005"
  }
}
```

### GET `/test`
**Công dụng**: Endpoint test để kiểm tra API Gateway có hoạt động

**Đầu vào**: Không có

**Quá trình xử lý**: Trả về thông tin cơ bản về API Gateway

**Kết quả**:
```json
{
  "success": true,
  "message": "API Gateway is running",
  "routes": {
    "courses": "/api/courses",
    "documents": "/api/documents",
    "auth": "/api/auth"
  }
}
```

---

## Authentication Service

### POST `/api/auth/register`
**Công dụng**: Đăng ký tài khoản mới

**Đầu vào**:
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "passWord": "password123",
  "phone": "0123456789",
  "role": "student"
}
```

**Quá trình xử lý**:
1. Validate dữ liệu đầu vào (fullName, email, password)
2. Kiểm tra email đã tồn tại chưa
3. Hash password bằng bcrypt (salt rounds: 10)
4. Tạo user_id duy nhất (UUID format)
5. Lưu thông tin user vào MongoDB (collection: UserCollection)
6. Tạo JWT token với thông tin user
7. Trả về thông tin user và token

**Kết quả**:
```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "data": {
    "user": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "user_id": "user_12345678-1234-1234-1234-123456789012",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "role": "student",
      "avatar_url": "/img/default-avatar.png",
      "is_verified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Lỗi có thể xảy ra**:
- 400: Email đã được sử dụng
- 400: Dữ liệu không hợp lệ
- 500: Lỗi server

---

### POST `/api/auth/login`
**Công dụng**: Đăng nhập vào hệ thống

**Đầu vào**:
```json
{
  "email": "nguyenvana@example.com",
  "passWord": "password123"
}
```

**Quá trình xử lý**:
1. Validate email và password
2. Tìm user theo email trong MongoDB
3. So sánh password đã hash với password trong database
4. Kiểm tra user có bị khóa không (is_active)
5. Tạo JWT token với thông tin user
6. Cập nhật last_login
7. Trả về thông tin user và token

**Kết quả**:
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "data": {
    "user": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "user_id": "user_12345678-1234-1234-1234-123456789012",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "role": "student",
      "avatar_url": "/img/default-avatar.png",
      "phone": "0123456789",
      "is_verified": false,
      "contributions": 0,
      "reputation_score": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Lỗi có thể xảy ra**:
- 401: Email hoặc mật khẩu không đúng
- 403: Tài khoản bị khóa
- 500: Lỗi server

---

### POST `/api/auth/checkemail`
**Công dụng**: Kiểm tra email đã tồn tại trong hệ thống chưa

**Đầu vào**:
```json
{
  "email": "nguyenvana@example.com"
}
```

**Quá trình xử lý**:
1. Validate email format
2. Tìm user theo email trong MongoDB
3. Trả về kết quả exists: true/false

**Kết quả**:
```json
{
  "exists": true,
  "message": "Email đã tồn tại"
}
```
hoặc
```json
{
  "exists": false
}
```

---

### GET `/api/auth/verify`
**Công dụng**: Xác thực email (tích hợp email verification)

**Đầu vào**: Query parameters
- `token`: Verification token

**Quá trình xử lý**:
1. Verify token từ email
2. Cập nhật is_verified = true cho user
3. Trả về kết quả

**Kết quả**:
```json
{
  "success": true,
  "message": "Email đã được xác thực thành công"
}
```

---

### GET `/api/auth/customer`
**Công dụng**: Lấy thông tin user theo email

**Đầu vào**: Query parameters
- `email`: Email của user

**Quá trình xử lý**:
1. Tìm user theo email trong MongoDB
2. Loại bỏ password khỏi response
3. Trả về thông tin user

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "user_id": "user_12345678-1234-1234-1234-123456789012",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phone": "0123456789",
    "address": "",
    "gender": "",
    "avatar_url": "/img/default-avatar.png",
    "bio": "",
    "role": "student",
    "university": "",
    "major": ""
  }
}
```

---

### POST `/api/auth/customer/update`
**Công dụng**: Cập nhật thông tin user

**Đầu vào**:
```json
{
  "email": "nguyenvana@example.com",
  "phone": "0987654321",
  "address": "123 Đường ABC, Quận XYZ",
  "gender": "male",
  "bio": "Giới thiệu về bản thân",
  "university": "Đại học ABC",
  "major": "Công nghệ thông tin"
}
```

**Quá trình xử lý**:
1. Tìm user theo email
2. Cập nhật các trường được cung cấp
3. Lưu vào MongoDB
4. Trả về thông tin user đã cập nhật

**Kết quả**:
```json
{
  "message": "Cập nhật thông tin thành công",
  "user": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phone": "0987654321",
    "address": "123 Đường ABC, Quận XYZ",
    "gender": "male"
  }
}
```

---

### POST `/api/auth/profile/avatar`
**Công dụng**: Upload avatar cho user

**Đầu vào**: 
- Content-Type: `multipart/form-data`
- Form data:
  - `avatar`: File ảnh (tối đa 5MB)
  - `email`: Email của user

**Quá trình xử lý**:
1. Validate file ảnh (chỉ chấp nhận image/*)
2. Lưu file vào thư mục uploads/avatars với tên unique
3. Cập nhật avatar_url trong database
4. Trả về URL của avatar mới

**Kết quả**:
```json
{
  "success": true,
  "message": "Upload avatar thành công",
  "avatar_url": "/uploads/avatars/avatar_1234567890_abc123.jpg"
}
```

---

### POST `/api/auth/profile/cover`
**Công dụng**: Upload cover image cho user

**Đầu vào**: 
- Content-Type: `multipart/form-data`
- Form data:
  - `cover`: File ảnh (tối đa 10MB)
  - `email`: Email của user

**Quá trình xử lý**:
1. Validate file ảnh (chỉ chấp nhận image/*)
2. Lưu file vào thư mục uploads/covers với tên unique
3. Cập nhật cover_url trong database
4. Trả về URL của cover mới

**Kết quả**:
```json
{
  "success": true,
  "message": "Upload cover thành công",
  "cover_url": "/uploads/covers/cover_1234567890_abc123.jpg"
}
```

---

## Document Service

### POST `/api/documents/upload`
**Công dụng**: Upload tài liệu mới lên hệ thống

**Đầu vào**: 
- Content-Type: `multipart/form-data`
- Form data:
  - `file`: File tài liệu (PDF, PPTX, DOCX, ZIP) - tối đa 50MB
  - `thumbnail`: File ảnh thumbnail (optional) - tối đa 50MB
  - `title`: Tiêu đề tài liệu
  - `description`: Mô tả
  - `author_id`: ID của người upload
  - `program`: Chương trình học (CNTT, Kinh tế, ...)
  - `tags`: Tags (comma-separated)
  - `category`: Danh mục

**Quá trình xử lý**:
1. Validate file (chỉ chấp nhận PDF, PPTX, DOCX, ZIP)
2. Validate thumbnail (nếu có)
3. Lưu file vào thư mục uploads/documents
4. Lưu thumbnail vào thư mục uploads/thumbnails (nếu có)
5. Tạo document_id duy nhất
6. Lưu metadata vào MongoDB (collection: TaiLieu)
7. Cập nhật uploaded_documents của user
8. Trả về thông tin document đã upload

**Kết quả**:
```json
{
  "success": true,
  "message": "Upload tài liệu thành công",
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "document_id": "doc_12345678-1234-1234-1234-123456789012",
    "title": "Tài liệu học tập",
    "description": "Mô tả chi tiết",
    "file": {
      "originalName": "document.pdf",
      "fileType": "PDF",
      "fileSize": 1024000,
      "fileUrl": "/uploads/documents/1234567890_abc123.pdf"
    },
    "thumbnail": "/uploads/thumbnails/1234567890_abc123.jpg",
    "author": {
      "id": "user_123",
      "name": "Nguyễn Văn A"
    },
    "downloads": 0,
    "views": 0,
    "uploadDate": "2024-01-15T10:00:00.000Z"
  }
}
```

**Lỗi có thể xảy ra**:
- 400: File không hợp lệ hoặc quá lớn
- 400: Thiếu thông tin bắt buộc
- 500: Lỗi server

---

### GET `/api/documents`
**Công dụng**: Lấy danh sách tất cả tài liệu (có phân trang)

**Đầu vào**: Query parameters
- `limit`: Số kết quả mỗi trang (default: 20)
- `page`: Số trang (default: 1)
- `sortBy`: Sắp xếp theo `newest`, `downloads`, `rating` (default: `newest`)

**Quá trình xử lý**:
1. Lấy danh sách documents từ MongoDB
2. Áp dụng pagination
3. Sắp xếp theo sortBy
4. Populate thông tin author
5. Tính toán rating trung bình
6. Trả về danh sách với pagination info

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "65f8a1b2c3d4e5f6a7b8c9d0",
        "document_id": "doc_12345678-1234-1234-1234-123456789012",
        "title": "Tài liệu học tập",
        "description": "Mô tả",
        "thumbnail": "/uploads/thumbnails/thumbnail.jpg",
        "author": {
          "id": "user_123",
          "name": "Nguyễn Văn A"
        },
        "downloads": 100,
        "views": 501,
        "rating": 4.5,
        "ratingCount": 20,
        "uploadDate": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalDocuments": 200,
      "limit": 20
    }
  }
}
```

---

### GET `/api/documents/search`
**Công dụng**: Tìm kiếm tài liệu theo từ khóa và filters

**Đầu vào**: Query parameters
- `q`: Từ khóa tìm kiếm
- `program`: Lọc theo chương trình học
- `tags`: Tags (comma-separated)
- `category`: Danh mục
- `limit`: Số kết quả (default: 20)
- `page`: Số trang (default: 1)
- `sortBy`: Sắp xếp theo `newest`, `downloads`, `rating`

**Quá trình xử lý**:
1. Xây dựng query MongoDB dựa trên filters
2. Tìm kiếm trong title, description, tags
3. Áp dụng filters (program, tags, category)
4. Sắp xếp và phân trang
5. Populate thông tin author
6. Trả về kết quả

**Kết quả**: Tương tự GET `/api/documents`

---

### GET `/api/documents/:id`
**Công dụng**: Lấy thông tin chi tiết của một tài liệu

**Đầu vào**: 
- Path parameter: `id` - Document ID hoặc document_id

**Quá trình xử lý**:
1. Tìm document theo ID trong MongoDB
2. Populate thông tin author đầy đủ
3. Tính toán rating trung bình từ DocumentRatings
4. Trả về thông tin chi tiết

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "document_id": "doc_12345678-1234-1234-1234-123456789012",
    "title": "Tài liệu học tập",
    "description": "Mô tả chi tiết",
    "thumbnail": "/uploads/thumbnails/thumbnail.jpg",
    "file": {
      "originalName": "document.pdf",
      "fileType": "PDF",
      "fileSize": 1024000,
      "fileUrl": "/uploads/documents/document.pdf"
    },
    "author": {
      "id": "user_123",
      "name": "Nguyễn Văn A",
      "avatar": "avatar_url"
    },
    "downloads": 100,
    "views": 501,
    "rating": 4.5,
    "ratingCount": 20,
    "tags": ["toán học", "đại số"],
    "program": "CNTT",
    "category": "Tài liệu học tập",
    "uploadDate": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### POST `/api/documents/:id/view`
**Công dụng**: Tăng số lượt xem của tài liệu

**Đầu vào**: 
- Path parameter: `id` - Document ID

**Quá trình xử lý**:
1. Tìm document theo ID
2. Tăng views lên 1
3. Lưu vào MongoDB
4. Trả về số views mới

**Kết quả**:
```json
{
  "success": true,
  "views": 502
}
```

---

### POST `/api/documents/:id/download`
**Công dụng**: Tăng số lượt tải về của tài liệu

**Đầu vào**: 
- Path parameter: `id` - Document ID

**Quá trình xử lý**:
1. Tìm document theo ID
2. Tăng downloads lên 1
3. Lưu vào MongoDB
4. Trả về số downloads mới

**Kết quả**:
```json
{
  "success": true,
  "downloads": 101
}
```

---

### GET `/api/documents/bookmarks/:userId`
**Công dụng**: Lấy danh sách tài liệu đã bookmark của user

**Đầu vào**: 
- Path parameter: `userId` - User ID

**Quá trình xử lý**:
1. Tìm user theo userId
2. Lấy danh sách saved_documents
3. Populate thông tin documents
4. Trả về danh sách

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "bookmarks": [
      {
        "id": "65f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Tài liệu học tập",
        "thumbnail": "/uploads/thumbnails/thumbnail.jpg",
        "author": {
          "name": "Nguyễn Văn A"
        }
      }
    ]
  }
}
```

---

### POST `/api/documents/bookmarks`
**Công dụng**: Thêm tài liệu vào bookmark

**Đầu vào**:
```json
{
  "userId": "user_123",
  "documentId": "doc_123"
}
```

**Quá trình xử lý**:
1. Tìm user và document
2. Kiểm tra document đã được bookmark chưa
3. Thêm documentId vào saved_documents của user
4. Lưu vào MongoDB
5. Trả về kết quả

**Kết quả**:
```json
{
  "success": true,
  "message": "Đã thêm vào bookmark"
}
```

---

### DELETE `/api/documents/bookmarks`
**Công dụng**: Xóa tài liệu khỏi bookmark

**Đầu vào**:
```json
{
  "userId": "user_123",
  "documentId": "doc_123"
}
```

**Quá trình xử lý**:
1. Tìm user
2. Xóa documentId khỏi saved_documents
3. Lưu vào MongoDB
4. Trả về kết quả

**Kết quả**:
```json
{
  "success": true,
  "message": "Đã xóa khỏi bookmark"
}
```

---

## Course Service

### GET `/api/courses`
**Công dụng**: Lấy danh sách tất cả khóa học (có phân trang và filter)

**Đầu vào**: Query parameters
- `limit`: Số kết quả mỗi trang (default: 20)
- `page`: Số trang (default: 1)
- `sortBy`: Sắp xếp theo `newest`, `popular`, `price` (default: `newest`)
- `category`: Lọc theo danh mục
- `level`: Lọc theo level (beginner, intermediate, advanced)
- `isFree`: Lọc khóa học miễn phí (true/false)
- `status`: Lọc theo status (default: `published`)

**Quá trình xử lý**:
1. Xây dựng query MongoDB dựa trên filters
2. Áp dụng pagination
3. Sắp xếp theo sortBy
4. Populate thông tin instructor
5. Tính toán số học viên đã enroll
6. Trả về danh sách với pagination info

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "65f8a1b2c3d4e5f6a7b8c9d0",
        "course_id": "course_12345678-1234-1234-1234-123456789012",
        "title": "Khóa học lập trình",
        "description": "Mô tả khóa học",
        "thumbnail": "/uploads/thumbnails/course_thumbnail.jpg",
        "instructor": {
          "id": "user_123",
          "name": "Nguyễn Văn A"
        },
        "price": 500000,
        "isFree": false,
        "level": "beginner",
        "category": "Lập trình",
        "enrollmentCount": 150,
        "rating": 4.5,
        "created_at": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalCourses": 200,
      "limit": 20
    }
  }
}
```

---

### GET `/api/courses/search`
**Công dụng**: Tìm kiếm khóa học theo từ khóa

**Đầu vào**: Query parameters
- `q`: Từ khóa tìm kiếm
- `limit`: Số kết quả (default: 20)
- `page`: Số trang (default: 1)

**Quá trình xử lý**:
1. Tìm kiếm trong title, description
2. Áp dụng pagination
3. Populate thông tin instructor
4. Trả về kết quả

**Kết quả**: Tương tự GET `/api/courses`

---

### GET `/api/courses/stats`
**Công dụng**: Lấy thống kê về khóa học

**Đầu vào**: Không có

**Quá trình xử lý**:
1. Đếm tổng số khóa học
2. Đếm số khóa học theo category
3. Đếm số khóa học theo level
4. Tính tổng số enrollment
5. Trả về thống kê

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "totalCourses": 200,
    "totalEnrollments": 5000,
    "byCategory": {
      "Lập trình": 50,
      "Thiết kế": 30
    },
    "byLevel": {
      "beginner": 80,
      "intermediate": 70,
      "advanced": 50
    }
  }
}
```

---

### GET `/api/courses/:id`
**Công dụng**: Lấy thông tin chi tiết của một khóa học

**Đầu vào**: 
- Path parameter: `id` - Course ID

**Quá trình xử lý**:
1. Tìm course theo ID trong MongoDB
2. Populate thông tin instructor đầy đủ
3. Lấy danh sách lessons/modules
4. Tính toán số học viên đã enroll
5. Tính rating trung bình
6. Trả về thông tin chi tiết

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "course_id": "course_12345678-1234-1234-1234-123456789012",
    "title": "Khóa học lập trình",
    "description": "Mô tả chi tiết",
    "thumbnail": "/uploads/thumbnails/course_thumbnail.jpg",
    "instructor": {
      "id": "user_123",
      "name": "Nguyễn Văn A",
      "avatar": "avatar_url"
    },
    "price": 500000,
    "isFree": false,
    "level": "beginner",
    "category": "Lập trình",
    "lessons": [
      {
        "title": "Bài 1: Giới thiệu",
        "videoUrl": "/uploads/videos/video_1.mp4",
        "duration": 1200
      }
    ],
    "enrollmentCount": 150,
    "rating": 4.5,
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### POST `/api/courses`
**Công dụng**: Tạo khóa học mới

**Đầu vào**: 
- Content-Type: `multipart/form-data`
- Form data:
  - `thumbnail`: File ảnh thumbnail (optional)
  - `video_0`, `video_1`, ...: Files video cho lessons
  - `title`: Tiêu đề khóa học
  - `description`: Mô tả
  - `instructor_id`: ID của instructor
  - `price`: Giá khóa học
  - `isFree`: Có miễn phí không (true/false)
  - `level`: Level (beginner, intermediate, advanced)
  - `category`: Danh mục
  - `lessons`: JSON string chứa thông tin lessons

**Quá trình xử lý**:
1. Validate files (thumbnail, videos)
2. Lưu thumbnail vào uploads/thumbnails
3. Lưu videos vào uploads/videos
4. Tạo course_id duy nhất
5. Lưu metadata vào MongoDB (collection: Courses)
6. Trả về thông tin course đã tạo

**Kết quả**:
```json
{
  "success": true,
  "message": "Tạo khóa học thành công",
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "course_id": "course_12345678-1234-1234-1234-123456789012",
    "title": "Khóa học lập trình",
    "thumbnail": "/uploads/thumbnails/course_thumbnail.jpg",
    "instructor": {
      "id": "user_123",
      "name": "Nguyễn Văn A"
    },
    "price": 500000,
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### POST `/api/courses/:id/enroll`
**Công dụng**: Đăng ký khóa học

**Đầu vào**: 
- Path parameter: `id` - Course ID
- Body:
```json
{
  "userId": "user_123"
}
```

**Quá trình xử lý**:
1. Tìm course và user
2. Kiểm tra user đã enroll chưa
3. Kiểm tra khóa học có miễn phí không, nếu không thì tạo payment
4. Tạo enrollment record trong MongoDB (collection: Enrollments)
5. Cập nhật enrolled_courses của user
6. Tăng enrollmentCount của course
7. Trả về thông tin enrollment

**Kết quả**:
```json
{
  "success": true,
  "message": "Đăng ký khóa học thành công",
  "data": {
    "enrollment_id": "enroll_12345678-1234-1234-1234-123456789012",
    "course_id": "course_123",
    "user_id": "user_123",
    "enrolled_at": "2024-01-15T10:00:00.000Z",
    "progress": 0
  }
}
```

---

### GET `/api/courses/:id/enrollment`
**Công dụng**: Lấy thông tin enrollment của user cho một khóa học

**Đầu vào**: 
- Path parameter: `id` - Course ID
- Query parameter: `userId` - User ID

**Quá trình xử lý**:
1. Tìm enrollment theo course_id và user_id
2. Populate thông tin course và user
3. Trả về thông tin enrollment

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "enrollment_id": "enroll_12345678-1234-1234-1234-123456789012",
    "course": {
      "title": "Khóa học lập trình",
      "thumbnail": "/uploads/thumbnails/course_thumbnail.jpg"
    },
    "progress": 25,
    "completed_lessons": ["lesson_1", "lesson_2"],
    "enrolled_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### GET `/api/courses/my-enrollments/:userId`
**Công dụng**: Lấy danh sách khóa học đã đăng ký của user

**Đầu vào**: 
- Path parameter: `userId` - User ID

**Quá trình xử lý**:
1. Tìm tất cả enrollments của user
2. Populate thông tin course
3. Sắp xếp theo enrolled_at (mới nhất trước)
4. Trả về danh sách

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "enrollment_id": "enroll_123",
        "course": {
          "id": "course_123",
          "title": "Khóa học lập trình",
          "thumbnail": "/uploads/thumbnails/course_thumbnail.jpg",
          "instructor": {
            "name": "Nguyễn Văn A"
          }
        },
        "progress": 25,
        "enrolled_at": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

---

### PUT `/api/courses/:id/progress`
**Công dụng**: Cập nhật tiến độ học tập của user

**Đầu vào**: 
- Path parameter: `id` - Course ID
- Body:
```json
{
  "userId": "user_123",
  "progress": 50,
  "completedLessons": ["lesson_1", "lesson_2", "lesson_3"]
}
```

**Quá trình xử lý**:
1. Tìm enrollment theo course_id và user_id
2. Cập nhật progress và completed_lessons
3. Nếu progress = 100%, đánh dấu course đã hoàn thành
4. Lưu vào MongoDB
5. Trả về thông tin enrollment đã cập nhật

**Kết quả**:
```json
{
  "success": true,
  "message": "Cập nhật tiến độ thành công",
  "data": {
    "enrollment_id": "enroll_123",
    "progress": 50,
    "completed_lessons": ["lesson_1", "lesson_2", "lesson_3"],
    "is_completed": false
  }
}
```

---

## Blog Service

### GET `/api/blogs`
**Công dụng**: Lấy danh sách bài viết blog (có phân trang và filter)

**Đầu vào**: Query parameters
- `limit`: Số kết quả mỗi trang (default: 20)
- `page`: Số trang (default: 1)
- `tag`: Lọc theo tag
- `author`: Lọc theo author
- `sortBy`: Sắp xếp theo `newest`, `popular` (default: `newest`)

**Quá trình xử lý**:
1. Xây dựng query MongoDB dựa trên filters
2. Áp dụng pagination
3. Sắp xếp theo sortBy
4. Populate thông tin author
5. Trả về danh sách với pagination info

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "65f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Tiêu đề bài viết",
        "excerpt": "Tóm tắt bài viết",
        "thumbnail": "/uploads/blog/thumbnail.jpg",
        "author": {
          "id": "user_123",
          "name": "Nguyễn Văn A"
        },
        "tags": ["lập trình", "javascript"],
        "views": 1000,
        "likes": 50,
        "created_at": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalPosts": 200,
      "limit": 20
    }
  }
}
```

---

### GET `/api/blogs/:id`
**Công dụng**: Lấy thông tin chi tiết của một bài viết

**Đầu vào**: 
- Path parameter: `id` - Post ID hoặc slug

**Quá trình xử lý**:
1. Tìm post theo ID hoặc slug trong MongoDB
2. Populate thông tin author đầy đủ
3. Tăng views lên 1
4. Trả về thông tin chi tiết

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Tiêu đề bài viết",
    "content": "Nội dung bài viết đầy đủ",
    "thumbnail": "/uploads/blog/thumbnail.jpg",
    "author": {
      "id": "user_123",
      "name": "Nguyễn Văn A",
      "avatar": "avatar_url"
    },
    "tags": ["lập trình", "javascript"],
    "views": 1001,
    "likes": 50,
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### GET `/api/blogs/featured`
**Công dụng**: Lấy danh sách bài viết nổi bật

**Đầu vào**: Query parameters
- `limit`: Số kết quả (default: 5)

**Quá trình xử lý**:
1. Tìm các bài viết có featured = true
2. Sắp xếp theo views hoặc likes
3. Populate thông tin author
4. Trả về danh sách

**Kết quả**: Tương tự GET `/api/blogs`

---

### GET `/api/blogs/popular`
**Công dụng**: Lấy danh sách bài viết phổ biến

**Đầu vào**: Query parameters
- `limit`: Số kết quả (default: 10)

**Quá trình xử lý**:
1. Sắp xếp bài viết theo views + likes
2. Lấy top N bài viết
3. Populate thông tin author
4. Trả về danh sách

**Kết quả**: Tương tự GET `/api/blogs`

---

### GET `/api/blogs/:id/related`
**Công dụng**: Lấy danh sách bài viết liên quan

**Đầu vào**: 
- Path parameter: `id` - Post ID
- Query parameter: `limit` - Số kết quả (default: 5)

**Quá trình xử lý**:
1. Tìm post theo ID
2. Tìm các bài viết có cùng tags
3. Loại trừ bài viết hiện tại
4. Sắp xếp theo views
5. Trả về danh sách

**Kết quả**: Tương tự GET `/api/blogs`

---

### GET `/api/blogs/tags`
**Công dụng**: Lấy danh sách tất cả tags

**Đầu vào**: Không có

**Quá trình xử lý**:
1. Lấy tất cả tags từ các bài viết
2. Đếm số bài viết cho mỗi tag
3. Sắp xếp theo số lượng bài viết
4. Trả về danh sách

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "name": "lập trình",
        "count": 50
      },
      {
        "name": "javascript",
        "count": 30
      }
    ]
  }
}
```

---

### POST `/api/blogs`
**Công dụng**: Tạo bài viết mới (admin only)

**Đầu vào**:
```json
{
  "title": "Tiêu đề bài viết",
  "content": "Nội dung bài viết",
  "excerpt": "Tóm tắt",
  "author_id": "user_123",
  "tags": ["lập trình", "javascript"],
  "featured": false
}
```

**Quá trình xử lý**:
1. Validate dữ liệu đầu vào
2. Tạo post_id duy nhất
3. Lưu vào MongoDB (collection: BlogPosts)
4. Trả về thông tin post đã tạo

**Kết quả**:
```json
{
  "success": true,
  "message": "Tạo bài viết thành công",
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Tiêu đề bài viết",
    "author": {
      "id": "user_123",
      "name": "Nguyễn Văn A"
    },
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### PUT `/api/blogs/:id`
**Công dụng**: Cập nhật bài viết (admin only)

**Đầu vào**: 
- Path parameter: `id` - Post ID
- Body:
```json
{
  "title": "Tiêu đề mới",
  "content": "Nội dung mới",
  "tags": ["lập trình", "python"]
}
```

**Quá trình xử lý**:
1. Tìm post theo ID
2. Cập nhật các trường được cung cấp
3. Lưu vào MongoDB
4. Trả về thông tin post đã cập nhật

**Kết quả**:
```json
{
  "success": true,
  "message": "Cập nhật bài viết thành công",
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Tiêu đề mới",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### DELETE `/api/blogs/:id`
**Công dụng**: Xóa bài viết (admin only)

**Đầu vào**: 
- Path parameter: `id` - Post ID

**Quá trình xử lý**:
1. Tìm post theo ID
2. Xóa post khỏi MongoDB
3. Trả về kết quả

**Kết quả**:
```json
{
  "success": true,
  "message": "Xóa bài viết thành công"
}
```

---

## Forum Service

### GET `/api/forum/posts`
**Công dụng**: Lấy danh sách bài đăng trong forum

**Đầu vào**: Query parameters
- `limit`: Số kết quả mỗi trang (default: 20)
- `page`: Số trang (default: 1)
- `sortBy`: Sắp xếp theo `newest`, `popular` (default: `newest`)

**Quá trình xử lý**:
1. Lấy danh sách posts từ MongoDB (collection: posts)
2. Áp dụng pagination
3. Sắp xếp theo sortBy
4. Populate thông tin author
5. Đếm số comments và likes
6. Trả về danh sách với pagination info

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "65f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Câu hỏi về lập trình",
        "content": "Nội dung câu hỏi",
        "author": {
          "id": "user_123",
          "name": "Nguyễn Văn A",
          "avatar": "avatar_url"
        },
        "likes": 10,
        "commentsCount": 5,
        "created_at": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalPosts": 200,
      "limit": 20
    }
  }
}
```

---

### GET `/api/forum/posts/:id`
**Công dụng**: Lấy thông tin chi tiết của một bài đăng

**Đầu vào**: 
- Path parameter: `id` - Post ID

**Quá trình xử lý**:
1. Tìm post theo ID trong MongoDB
2. Populate thông tin author đầy đủ
3. Populate danh sách comments với thông tin author
4. Trả về thông tin chi tiết

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Câu hỏi về lập trình",
    "content": "Nội dung câu hỏi đầy đủ",
    "author": {
      "id": "user_123",
      "name": "Nguyễn Văn A",
      "avatar": "avatar_url"
    },
    "likes": 10,
    "likedBy": ["user_123", "user_456"],
    "comments": [
      {
        "id": "comment_123",
        "content": "Câu trả lời",
        "author": {
          "id": "user_456",
          "name": "Trần Văn B"
        },
        "created_at": "2024-01-15T11:00:00.000Z"
      }
    ],
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### POST `/api/forum/posts`
**Công dụng**: Tạo bài đăng mới trong forum

**Đầu vào**:
```json
{
  "title": "Câu hỏi về lập trình",
  "content": "Nội dung câu hỏi",
  "author_id": "user_123",
  "tags": ["lập trình", "javascript"]
}
```

**Quá trình xử lý**:
1. Validate dữ liệu đầu vào
2. Tạo post_id duy nhất
3. Lưu vào MongoDB (collection: posts)
4. Trả về thông tin post đã tạo

**Kết quả**:
```json
{
  "success": true,
  "message": "Tạo bài đăng thành công",
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Câu hỏi về lập trình",
    "author": {
      "id": "user_123",
      "name": "Nguyễn Văn A"
    },
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### POST `/api/forum/posts/upload-image`
**Công dụng**: Upload ảnh cho bài đăng forum

**Đầu vào**: 
- Content-Type: `multipart/form-data`
- Form data:
  - `image`: File ảnh (tối đa 5MB)

**Quá trình xử lý**:
1. Validate file ảnh (chỉ chấp nhận image/*)
2. Lưu file vào thư mục uploads/images với tên unique
3. Trả về URL của ảnh

**Kết quả**:
```json
{
  "success": true,
  "imageUrl": "/uploads/images/post_1234567890_abc123.jpg"
}
```

---

### PUT `/api/forum/posts/:id`
**Công dụng**: Cập nhật bài đăng

**Đầu vào**: 
- Path parameter: `id` - Post ID
- Body:
```json
{
  "title": "Tiêu đề mới",
  "content": "Nội dung mới"
}
```

**Quá trình xử lý**:
1. Tìm post theo ID
2. Kiểm tra quyền (chỉ author mới được sửa)
3. Cập nhật các trường được cung cấp
4. Lưu vào MongoDB
5. Trả về thông tin post đã cập nhật

**Kết quả**:
```json
{
  "success": true,
  "message": "Cập nhật bài đăng thành công",
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Tiêu đề mới",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### DELETE `/api/forum/posts/:id`
**Công dụng**: Xóa bài đăng

**Đầu vào**: 
- Path parameter: `id` - Post ID

**Quá trình xử lý**:
1. Tìm post theo ID
2. Kiểm tra quyền (chỉ author hoặc admin mới được xóa)
3. Xóa post và tất cả comments liên quan khỏi MongoDB
4. Trả về kết quả

**Kết quả**:
```json
{
  "success": true,
  "message": "Xóa bài đăng thành công"
}
```

---

### POST `/api/forum/posts/:id/like`
**Công dụng**: Like/Unlike bài đăng

**Đầu vào**: 
- Path parameter: `id` - Post ID
- Body:
```json
{
  "userId": "user_123"
}
```

**Quá trình xử lý**:
1. Tìm post theo ID
2. Kiểm tra user đã like chưa
3. Nếu đã like thì unlike, nếu chưa thì like
4. Cập nhật likedBy array
5. Cập nhật số likes
6. Lưu vào MongoDB
7. Trả về số likes mới

**Kết quả**:
```json
{
  "success": true,
  "liked": true,
  "likes": 11
}
```

---

### POST `/api/forum/posts/:id/comments`
**Công dụng**: Thêm comment vào bài đăng

**Đầu vào**: 
- Path parameter: `id` - Post ID
- Body:
```json
{
  "content": "Nội dung comment",
  "author_id": "user_123"
}
```

**Quá trình xử lý**:
1. Tìm post theo ID
2. Tạo comment_id duy nhất
3. Thêm comment vào comments array của post
4. Lưu vào MongoDB
5. Trả về thông tin comment đã tạo

**Kết quả**:
```json
{
  "success": true,
  "message": "Thêm comment thành công",
  "data": {
    "comment_id": "comment_12345678-1234-1234-1234-123456789012",
    "content": "Nội dung comment",
    "author": {
      "id": "user_123",
      "name": "Nguyễn Văn A"
    },
    "created_at": "2024-01-15T12:00:00.000Z"
  }
}
```

---

### DELETE `/api/forum/posts/:postId/comments/:commentId`
**Công dụng**: Xóa comment

**Đầu vào**: 
- Path parameters:
  - `postId`: Post ID
  - `commentId`: Comment ID

**Quá trình xử lý**:
1. Tìm post theo ID
2. Tìm comment trong comments array
3. Kiểm tra quyền (chỉ author của comment hoặc admin mới được xóa)
4. Xóa comment khỏi array
5. Lưu vào MongoDB
6. Trả về kết quả

**Kết quả**:
```json
{
  "success": true,
  "message": "Xóa comment thành công"
}
```

---

## Payment Service

### POST `/api/payments/create`
**Công dụng**: Tạo payment link cho khóa học (tích hợp PayOS)

**Đầu vào**:
```json
{
  "course_id": "course_123",
  "user_id": "user_123",
  "amount": 500000,
  "description": "Thanh toán khóa học lập trình"
}
```

**Quá trình xử lý**:
1. Validate dữ liệu đầu vào
2. Tạo payment_id duy nhất
3. Gọi PayOS API để tạo payment link
4. Lưu payment record vào MongoDB (collection: Payments)
5. Trả về payment link

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "payment_id": "payment_12345678-1234-1234-1234-123456789012",
    "payment_link": "https://pay.payos.vn/web/...",
    "amount": 500000,
    "status": "pending",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### GET `/api/payments/:payment_id/status`
**Công dụng**: Kiểm tra trạng thái thanh toán

**Đầu vào**: 
- Path parameter: `payment_id` - Payment ID

**Quá trình xử lý**:
1. Tìm payment theo payment_id trong MongoDB
2. Nếu payment chưa được xác nhận, gọi PayOS API để kiểm tra
3. Cập nhật status nếu có thay đổi
4. Trả về trạng thái

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "payment_id": "payment_12345678-1234-1234-1234-123456789012",
    "status": "paid",
    "paid_at": "2024-01-15T10:30:00.000Z",
    "amount": 500000
  }
}
```

**Các trạng thái có thể**:
- `pending`: Đang chờ thanh toán
- `paid`: Đã thanh toán
- `cancelled`: Đã hủy
- `failed`: Thanh toán thất bại

---

## Admin Service

Tất cả các API admin đều yêu cầu:
- **JWT Token** trong header: `Authorization: Bearer <token>`
- **Role = 'admin'** trong token

### GET `/api/admin/users`
**Công dụng**: Lấy danh sách tất cả users (admin only)

**Đầu vào**: 
- Headers:
  - `Authorization: Bearer <JWT_TOKEN>`
- Query parameters:
  - `limit`: Số kết quả (default: 50)
  - `page`: Số trang (default: 1)
  - `role`: Lọc theo role
  - `is_active`: Lọc theo trạng thái active

**Quá trình xử lý**:
1. Verify JWT token
2. Kiểm tra role = 'admin'
3. Xây dựng query MongoDB dựa trên filters
4. Áp dụng pagination
5. Loại bỏ password khỏi response
6. Trả về danh sách users

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "65f8a1b2c3d4e5f6a7b8c9d0",
        "user_id": "user_12345678-1234-1234-1234-123456789012",
        "fullName": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "role": "student",
        "is_active": true,
        "is_verified": false,
        "created_at": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalUsers": 500,
      "limit": 50
    }
  }
}
```

**Lỗi có thể xảy ra**:
- 401: Không có token hoặc token không hợp lệ
- 403: Không có quyền admin

---

### GET `/api/admin/users/:id`
**Công dụng**: Lấy thông tin chi tiết của một user (admin only)

**Đầu vào**: 
- Headers:
  - `Authorization: Bearer <JWT_TOKEN>`
- Path parameter: `id` - User ID

**Quá trình xử lý**:
1. Verify JWT token
2. Kiểm tra role = 'admin'
3. Tìm user theo ID trong MongoDB
4. Loại bỏ password khỏi response
5. Trả về thông tin user

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "user_id": "user_12345678-1234-1234-1234-123456789012",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phone": "0123456789",
    "role": "student",
    "is_active": true,
    "is_verified": false,
    "contributions": 10,
    "reputation_score": 50,
    "created_at": "2024-01-15T10:00:00.000Z",
    "last_login": "2024-01-20T10:00:00.000Z"
  }
}
```

---

### PUT `/api/admin/users/:id`
**Công dụng**: Cập nhật thông tin user (admin only)

**Đầu vào**: 
- Headers:
  - `Authorization: Bearer <JWT_TOKEN>`
- Path parameter: `id` - User ID
- Body:
```json
{
  "role": "instructor",
  "is_active": true,
  "is_verified": true
}
```

**Quá trình xử lý**:
1. Verify JWT token
2. Kiểm tra role = 'admin'
3. Tìm user theo ID
4. Cập nhật các trường được cung cấp
5. Lưu vào MongoDB
6. Trả về thông tin user đã cập nhật

**Kết quả**:
```json
{
  "success": true,
  "message": "Cập nhật user thành công",
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "role": "instructor",
    "is_active": true,
    "is_verified": true,
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### DELETE `/api/admin/users/:id`
**Công dụng**: Xóa user (admin only)

**Đầu vào**: 
- Headers:
  - `Authorization: Bearer <JWT_TOKEN>`
- Path parameter: `id` - User ID

**Quá trình xử lý**:
1. Verify JWT token
2. Kiểm tra role = 'admin'
3. Tìm user theo ID
4. Xóa user khỏi MongoDB (hoặc đánh dấu is_active = false)
5. Trả về kết quả

**Kết quả**:
```json
{
  "success": true,
  "message": "Xóa user thành công"
}
```

---

## Rating Service

### POST `/api/rating`
**Công dụng**: Tạo đánh giá cho tài liệu

**Đầu vào**:
```json
{
  "document_id": "doc_123",
  "user_id": "user_123",
  "rating": 5,
  "comment": "Tài liệu rất hay và hữu ích"
}
```

**Quá trình xử lý**:
1. Validate dữ liệu (rating từ 1-5)
2. Kiểm tra user đã đánh giá document này chưa
3. Tạo rating_id duy nhất
4. Lưu vào MongoDB (collection: DocumentRatings)
5. Tính lại rating trung bình của document
6. Cập nhật rating và ratingCount trong document
7. Trả về thông tin rating đã tạo

**Kết quả**:
```json
{
  "success": true,
  "message": "Đánh giá thành công",
  "data": {
    "rating_id": "rating_12345678-1234-1234-1234-123456789012",
    "document_id": "doc_123",
    "user_id": "user_123",
    "rating": 5,
    "comment": "Tài liệu rất hay và hữu ích",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### GET `/api/rating/:documentId`
**Công dụng**: Lấy danh sách đánh giá của một tài liệu

**Đầu vào**: 
- Path parameter: `documentId` - Document ID
- Query parameters:
  - `limit`: Số kết quả (default: 20)
  - `page`: Số trang (default: 1)

**Quá trình xử lý**:
1. Tìm tất cả ratings theo document_id trong MongoDB
2. Áp dụng pagination
3. Populate thông tin user
4. Sắp xếp theo created_at (mới nhất trước)
5. Trả về danh sách

**Kết quả**:
```json
{
  "success": true,
  "data": {
    "ratings": [
      {
        "rating_id": "rating_123",
        "user": {
          "id": "user_123",
          "name": "Nguyễn Văn A",
          "avatar": "avatar_url"
        },
        "rating": 5,
        "comment": "Tài liệu rất hay và hữu ích",
        "is_verified_purchase": true,
        "is_helpful": 10,
        "created_at": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRatings": 100,
      "limit": 20
    },
    "averageRating": 4.5,
    "totalRatings": 100
  }
}
```

---

## Lưu Ý Chung

### Authentication
- Hầu hết các API công khai không yêu cầu authentication
- Các API admin yêu cầu JWT token với role = 'admin'
- JWT token có thời hạn 7 ngày (có thể config)

### Error Handling
Tất cả API đều trả về format lỗi thống nhất:
```json
{
  "success": false,
  "message": "Mô tả lỗi",
  "error": "Chi tiết lỗi (chỉ trong development mode)"
}
```

### Status Codes
- `200`: Thành công
- `201`: Tạo thành công
- `400`: Bad Request - Dữ liệu không hợp lệ
- `401`: Unauthorized - Chưa đăng nhập hoặc token sai
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Không tìm thấy resource
- `500`: Server Error - Lỗi server
- `503`: Service Unavailable - Service không chạy
- `504`: Gateway Timeout - Service không phản hồi

### Pagination
Các API có phân trang đều trả về format:
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "limit": 20
  }
}
```

### File Upload
- Tài liệu: PDF, PPTX, DOCX, ZIP (tối đa 50MB)
- Ảnh: JPG, PNG, GIF, WEBP (tối đa 5-10MB tùy endpoint)
- Video: MP4, AVI, MOV (tối đa 500MB)

### Database Collections
- `UserCollection`: Thông tin users
- `TaiLieu`: Tài liệu
- `Courses`: Khóa học
- `Enrollments`: Đăng ký khóa học
- `Payments`: Thanh toán
- `BlogPosts`: Bài viết blog
- `posts`: Bài đăng forum
- `DocumentRatings`: Đánh giá tài liệu

---

**Tài liệu được cập nhật lần cuối: 2024-01-15**


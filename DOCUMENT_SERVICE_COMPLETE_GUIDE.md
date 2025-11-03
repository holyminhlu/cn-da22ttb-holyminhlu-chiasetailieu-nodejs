# Hướng Dẫn Document Service - Phiên Bản Hoàn Chỉnh

## 📋 Tổng Quan

Document Service là một microservice quản lý tài liệu học tập cho nền tảng EduShare. Service này cho phép người dùng:
- Upload tài liệu (PDF, PPTX, DOCX, ZIP) lên hệ thống
- Upload thumbnail cho tài liệu (tùy chọn)
- Tìm kiếm và lọc tài liệu
- Lưu trữ thông tin tài liệu vào MongoDB
- Lưu trữ file vào thư mục local

## 🏗️ Cấu Trúc Service

```
server/document-service/
├── index.js                 # Entry point của service
├── package.json            # Dependencies
├── models/
│   └── documentModel.js    # MongoDB schema cho collection TaiLieu
├── controllers/
│   └── documentController.js # Business logic (upload, search, CRUD)
├── routes/
│   └── documentRoute.js    # API routes
└── uploads/                # Thư mục lưu file (tự động tạo)
    ├── documents/          # File tài liệu (PDF, PPTX, DOCX, ZIP)
    └── thumbnails/         # Hình ảnh thumbnail
```

## 🚀 Cài Đặt và Khởi Động

### 1. Cài Đặt Dependencies

```bash
cd server/document-service
npm install
```

Dependencies cần thiết:
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `multer`: File upload middleware
- `cors`: Cross-origin resource sharing
- `uuid`: Generate unique document IDs

### 2. Đảm Bảo MongoDB Đang Chạy

Service kết nối với MongoDB tại `mongodb://127.0.0.1:27017/EduShareDB`

```bash
# Kiểm tra MongoDB đang chạy
mongosh mongodb://127.0.0.1:27017/EduShareDB
```

### 3. Khởi Động Service

```bash
cd server/document-service
npm start
```

Service sẽ chạy tại: **http://localhost:3003**

Bạn sẽ thấy log:
```
🚀 =======================================
✅ Document-Service đang lắng nghe tại http://localhost:3003
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
✅ Collection: TaiLieu
✅ Test endpoint: http://localhost:3003/test
✅ Upload: POST http://localhost:3003/documents/upload
✅ Search: GET http://localhost:3003/documents/search
✅ Static files: http://localhost:3003/uploads
======================================
```

## 🔌 API Endpoints

### 1. Upload Document

**POST** `/documents/upload`

Upload tài liệu mới lên hệ thống.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- URL: `http://localhost:3000/api/documents/upload` (qua API Gateway)

**Form Data Fields:**
- `file` (required): File tài liệu (PDF, PPTX, DOCX, ZIP) - tối đa 50MB
- `thumbnail` (optional): File hình ảnh thumbnail
- `title` (required): Tên tài liệu (max 200 chars)
- `description` (required): Mô tả (20-1000 chars)
- `uploaderId` (required): ID người upload
- `author` (optional): JSON string của object `{id, name, avatar}`
- `program` (optional): Chương trình đào tạo
- `courseCode` (optional): Mã học phần
- `tags` (optional): JSON array string `["tag1", "tag2"]`
- `languages` (optional): JSON array string `["vi", "en"]` (default: `["vi"]`)
- `year` (optional): Năm học
- `license` (required): License type (`CC-BY`, `CC-BY-NC`, `CC-BY-SA`, `All rights reserved`)
- `visibility` (optional): `public`, `private`, `class-only` (default: `public`)
- `status` (optional): `published`, `draft`, `archived` (default: `published`)

**Response:**
```json
{
  "success": true,
  "message": "Tải lên tài liệu thành công!",
  "data": {
    "id": "65f1234567890abcdef12345",
    "document_id": "doc_550e8400-e29b-41d4-a716-446655440000",
    "title": "Tài liệu học tập",
    "description": "Mô tả chi tiết về tài liệu...",
    "file": {
      "originalName": "document.pdf",
      "fileType": "PDF",
      "fileSize": 1024000,
      "fileUrl": "/uploads/documents/1704067200000_550e8400e29b41d4a716446655440000.pdf"
    },
    "thumbnail": {
      "fileName": "1704067200000_550e8400e29b41d4a716446655440000.jpg",
      "fileUrl": "/uploads/thumbnails/1704067200000_550e8400e29b41d4a716446655440000.jpg"
    },
    "author": {
      "id": "user_123",
      "name": "Nguyễn Văn A",
      "avatar": "/img/default-avatar.png"
    },
    "uploadDate": "2024-01-01T00:00:00.000Z"
  }
}
```

**Ví dụ sử dụng JavaScript:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('thumbnail', thumbnailInput.files[0]); // optional
formData.append('title', 'Tài liệu học tập');
formData.append('description', 'Mô tả chi tiết về tài liệu này...');
formData.append('uploaderId', 'user_123');
formData.append('author', JSON.stringify({
  id: 'user_123',
  name: 'Nguyễn Văn A',
  avatar: '/img/default-avatar.png'
}));
formData.append('program', 'CNTT');
formData.append('courseCode', 'CS101');
formData.append('tags', JSON.stringify(['toán học', 'đại số']));
formData.append('languages', JSON.stringify(['vi']));
formData.append('year', '2024');
formData.append('license', 'CC-BY');
formData.append('visibility', 'public');
formData.append('status', 'published');

fetch('http://localhost:3000/api/documents/upload', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => {
  console.log('Upload success:', data);
})
.catch(error => {
  console.error('Upload error:', error);
});
```

### 2. Search Documents

**GET** `/documents/search`

Tìm kiếm tài liệu với các bộ lọc và phân trang.

**Query Parameters:**
- `q` (optional): Từ khóa tìm kiếm
- `program` (optional): Lọc theo chương trình
- `tags` (optional): Lọc theo tags (comma-separated)
- `year` (optional): Lọc theo năm học
- `fileType` (optional): `pdf`, `pptx`, `docx`, `zip`
- `language` (optional): `vi`, `en`
- `visibility` (optional): `public`, `private`, `class-only`
- `status` (optional): `published`, `draft`, `archived`
- `limit` (optional): Số kết quả mỗi trang (default: 20)
- `page` (optional): Số trang (default: 1)
- `sortBy` (optional): `relevance`, `newest`, `downloads`, `rating` (default: `relevance`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "65f1234567890abcdef12345",
      "document_id": "doc_550e8400-e29b-41d4-a716-446655440000",
      "title": "Tài liệu học tập",
      "description": "Mô tả",
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
      "program": "CNTT",
      "courseCode": "CS101",
      "year": "2024",
      "tags": ["toán học", "đại số"],
      "languages": ["vi"],
      "license": "CC-BY",
      "downloads": 100,
      "views": 500,
      "rating": 4.5,
      "ratingCount": 20,
      "uploadDate": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

**Ví dụ:**
```javascript
// Tìm kiếm tài liệu
fetch('http://localhost:3000/api/documents/search?q=toán học&program=CNTT&limit=10')
  .then(res => res.json())
  .then(data => console.log(data));

// Lọc theo tags
fetch('http://localhost:3000/api/documents/search?tags=đại số,hình học')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 3. Get All Documents

**GET** `/documents`

Lấy danh sách tất cả tài liệu công khai (với phân trang).

**Query Parameters:**
- `limit` (optional): Số kết quả mỗi trang (default: 20)
- `page` (optional): Số trang (default: 1)
- `sortBy` (optional): `newest`, `downloads`, `rating` (default: `newest`)

**Response:** Tương tự như Search Documents

### 4. Get Document by ID

**GET** `/documents/:id`

Lấy thông tin chi tiết của một tài liệu.

**Parameters:**
- `id`: Document ID hoặc document_id

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65f1234567890abcdef12345",
    "document_id": "doc_550e8400-e29b-41d4-a716-446655440000",
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
    "uploadDate": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Test Endpoint

**GET** `/test`

Kiểm tra service có đang chạy không.

**Response:**
```json
{
  "success": true,
  "message": "Document Service đang chạy bình thường!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "endpoints": {
    "upload": "POST /documents/upload",
    "search": "GET /documents/search",
    "getAll": "GET /documents",
    "getById": "GET /documents/:id",
    "test": "GET /test"
  }
}
```

## 📊 MongoDB Schema

### Collection: `TaiLieu`

```javascript
{
  document_id: String (unique, auto-generated: "doc_<uuid>"),
  title: String (required, max 200 chars),
  description: String (required, 20-1000 chars),
  file: {
    originalName: String,
    fileName: String,
    filePath: String,
    fileSize: Number,
    mimeType: String,
    fileType: String (enum: "pdf", "pptx", "docx", "zip")
  },
  thumbnail: {
    originalName: String,
    fileName: String,
    filePath: String,
    fileSize: Number,
    mimeType: String
  },
  author: {
    id: String,
    name: String,
    avatar: String
  },
  uploaderId: String (indexed),
  program: String,
  courseCode: String,
  year: String,
  tags: [String],
  languages: [String] (default: ["vi"]),
  license: String (enum: "CC-BY", "CC-BY-NC", "CC-BY-SA", "All rights reserved"),
  visibility: String (enum: "public", "private", "class-only", default: "public"),
  status: String (enum: "draft", "published", "archived", "rejected", default: "published"),
  downloads: Number (default: 0),
  views: Number (default: 0),
  rating: Number (default: 0, min: 0, max: 5),
  ratingCount: Number (default: 0),
  uploadDate: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- Unique index trên `document_id`
- Index trên `uploaderId`, `program`, `status`, `visibility`
- Index trên `createdAt`, `downloads`, `rating` (descending)
- Text index trên `title`, `description`, `tags`, `author.name`

## 💾 File Storage

### Cấu Trúc Thư Mục

```
server/document-service/uploads/
├── documents/          # File tài liệu
│   ├── 1704067200000_550e8400e29b41d4a716446655440000.pdf
│   ├── 1704067201000_550e8400e29b41d4a716446655440001.pptx
│   └── ...
└── thumbnails/         # Hình ảnh thumbnail
    ├── 1704067200000_550e8400e29b41d4a716446655440000.jpg
    └── ...
```

### Quy Tắc Đặt Tên File

- Format: `{timestamp}_{uuid}{extension}`
- Ví dụ: `1704067200000_550e8400e29b41d4a716446655440000.pdf`
- Timestamp: Unix timestamp (milliseconds)
- UUID: Random UUID (hyphens removed)

### Truy Cập File

Files được serve qua static middleware tại:
- Documents: `http://localhost:3003/uploads/documents/{fileName}`
- Thumbnails: `http://localhost:3003/uploads/thumbnails/{fileName}`

## 🌐 Tích Hợp với API Gateway

Document Service được tích hợp vào API Gateway tại port 3000:

**API Gateway Routes:**
- `POST /api/documents/upload` → `http://localhost:3003/documents/upload`
- `GET /api/documents/search` → `http://localhost:3003/documents/search`
- `GET /api/documents` → `http://localhost:3003/documents`
- `GET /api/documents/:id` → `http://localhost:3003/documents/:id`

Proxy configuration: `server/api-gateway/src/routes/documentsProxy.js`

## 🎨 Frontend Integration

### Upload Modal

Component `UploadModal.vue` đã được cập nhật để:
1. **Hiển thị tất cả trên một cửa sổ**: Tất cả các trường form được hiển thị cùng lúc, không còn multi-step
2. **Validation**: Validate tất cả các trường bắt buộc
3. **Upload Progress**: Hiển thị progress bar với %
4. **Error Handling**: Hiển thị thông báo lỗi chi tiết

**Các trường form:**
- Tên tài liệu (required, max 150 chars)
- Chương trình đào tạo (required)
- Mô tả (required, 20-1000 chars)
- Tác giả (optional)
- Mã học phần (optional)
- Năm học (optional)
- Tags (optional)
- Ngôn ngữ (default: Tiếng Việt)
- Quyền truy cập (default: Public)
- License (required)
- File tài liệu (required, PDF/PPTX/DOCX/ZIP, max 50MB)
- Thumbnail (optional, image)
- Accept TOS (required checkbox)

### Documents View

Component `DocumentsView.vue` đã được cập nhật để:
1. **Fetch từ API**: Tự động fetch danh sách tài liệu từ API
2. **Search & Filter**: Tìm kiếm và lọc tài liệu
3. **Auto Refresh**: Tự động refresh sau khi upload thành công

## 🧪 Testing

### 1. Test Service

```bash
# Khởi động service
cd server/document-service
npm start

# Test endpoint
curl http://localhost:3003/test
```

### 2. Test Upload (sử dụng curl)

```bash
# Tạo file test
echo "Test content" > test.pdf

# Upload qua API Gateway
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@test.pdf" \
  -F "title=Test Document" \
  -F "description=This is a test document with at least 20 characters" \
  -F "uploaderId=test_user" \
  -F "license=CC-BY"
```

### 3. Test Search

```bash
# Search documents
curl "http://localhost:3000/api/documents/search?q=toán&limit=10"

# Get all documents
curl "http://localhost:3000/api/documents?limit=10&page=1"
```

## 🛠️ Troubleshooting

### Lỗi: Cannot connect to MongoDB

**Nguyên nhân:** MongoDB chưa được khởi động hoặc connection string sai.

**Giải pháp:**
```bash
# Kiểm tra MongoDB đang chạy
mongosh mongodb://127.0.0.1:27017

# Kiểm tra connection string trong index.js
mongoose.connect('mongodb://127.0.0.1:27017/EduShareDB')
```

### Lỗi: MulterError: File too large

**Nguyên nhân:** File upload vượt quá 50MB.

**Giải pháp:** Giảm kích thước file hoặc tăng limit trong `documentController.js`:
```javascript
limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
}
```

### Lỗi: ValidationError

**Nguyên nhân:** Thiếu field bắt buộc hoặc giá trị không hợp lệ.

**Giải pháp:** Kiểm tra lại request body có đủ các field required:
- `title`, `description`, `uploaderId`, `license`
- `file` phải là PDF, PPTX, DOCX, hoặc ZIP

### Files không được serve

**Nguyên nhân:** Thư mục uploads chưa được tạo hoặc path sai.

**Giải pháp:**
```bash
# Thư mục sẽ tự động tạo khi service khởi động
# Nếu không, tạo thủ công:
mkdir -p server/document-service/uploads/documents
mkdir -p server/document-service/uploads/thumbnails
```

## ✅ Checklist Triển Khai

- [ ] MongoDB đang chạy tại localhost:27017
- [ ] Database `EduShareDB` đã tồn tại
- [ ] Collection `TaiLieu` đã được tạo (hoặc sẽ tự tạo khi lưu document đầu tiên)
- [ ] Document Service đã được cài đặt dependencies (`npm install`)
- [ ] Document Service đang chạy tại port 3003
- [ ] API Gateway đang chạy tại port 3000
- [ ] Proxy route `/api/documents` đã được cấu hình
- [ ] Thư mục `uploads/documents` và `uploads/thumbnails` đã được tạo
- [ ] Frontend đã được cập nhật với UploadModal mới (single screen)
- [ ] Test upload thành công với một file mẫu

## 📝 Ghi Chú Quan Trọng

1. **File Upload**: File được lưu vào thư mục local `server/document-service/uploads/`. Trong production, nên sử dụng cloud storage (S3, Azure Blob, etc.)

2. **MongoDB Connection**: Service kết nối trực tiếp với MongoDB local. Trong production, sử dụng connection string từ environment variable.

3. **Authentication**: Hiện tại service chưa có authentication middleware. Có thể thêm JWT authentication từ `auth-service` nếu cần.

4. **File Validation**: Service validate file type và size ở backend. Frontend cũng nên validate trước khi upload để trải nghiệm tốt hơn.

5. **Error Handling**: Tất cả errors đều được log chi tiết trong console. Trong production, nên sử dụng logging service (Winston, Pino, etc.)

## 🆘 Hỗ Trợ

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Service logs trong console
2. MongoDB connection logs
3. File permissions cho thư mục uploads
4. Network connectivity giữa services
5. API Gateway proxy logs

---

**Chúc bạn sử dụng thành công! 🚀**


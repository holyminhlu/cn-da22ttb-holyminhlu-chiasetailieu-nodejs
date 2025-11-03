# Hướng dẫn Document Service

## Tổng quan

Document Service là một microservice quản lý tài liệu học tập, cho phép người dùng upload, tìm kiếm và quản lý tài liệu trên nền tảng EduShare.

## Cấu trúc Service

```
server/document-service/
├── index.js                 # Entry point của service
├── package.json            # Dependencies
├── models/
│   └── documentModel.js    # MongoDB schema cho collection TaiLieu
├── controllers/
│   └── documentController.js # Business logic
├── routes/
│   └── documentRoute.js    # API routes
└── uploads/                # Thư mục lưu file (tự động tạo)
    ├── documents/          # File tài liệu (PDF, PPTX, DOCX, ZIP)
    └── thumbnails/         # Hình ảnh thumbnail
```

## Cài đặt và Khởi động

### 1. Cài đặt Dependencies

```bash
cd server/document-service
npm install
```

### 2. Đảm bảo MongoDB đang chạy

Service kết nối với MongoDB tại `mongodb://127.0.0.1:27017/EduShareDB`

```bash
# Kiểm tra MongoDB đang chạy
mongosh mongodb://127.0.0.1:27017/EduShareDB
```

### 3. Khởi động Service

```bash
cd server/document-service
npm start
```

Service sẽ chạy tại: **http://localhost:3003**

## API Endpoints

### 1. Upload Document

**POST** `/documents/upload`

Upload tài liệu mới lên hệ thống.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file` (required): File tài liệu (PDF, PPTX, DOCX, ZIP) - tối đa 50MB
  - `thumbnail` (optional): File hình ảnh thumbnail
  - `title` (required): Tên tài liệu
  - `description` (required): Mô tả (tối thiểu 20 ký tự)
  - `uploaderId` (required): ID người upload
  - `author` (optional): JSON string của object `{id, name, avatar}`
  - `program` (optional): Chương trình đào tạo
  - `courseCode` (optional): Mã học phần
  - `tags` (optional): JSON array string `["tag1", "tag2"]`
  - `languages` (optional): JSON array string `["vi", "en"]`
  - `year` (optional): Năm học
  - `license` (required): License type (CC-BY, CC-BY-NC, CC-BY-SA, All rights reserved)
  - `visibility` (optional): `public`, `private`, `class-only` (default: `public`)
  - `status` (optional): `published`, `draft`, `archived` (default: `published`)

**Response:**
```json
{
  "success": true,
  "message": "Tải lên tài liệu thành công!",
  "data": {
    "id": "document_id",
    "document_id": "doc_uuid",
    "title": "Tên tài liệu",
    "description": "Mô tả",
    "file": {
      "originalName": "file.pdf",
      "fileType": "pdf",
      "fileSize": 1024000
    },
    "thumbnail": {
      "fileName": "thumbnail.jpg"
    },
    "author": {
      "id": "user_id",
      "name": "Tên tác giả",
      "avatar": "avatar_url"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Ví dụ sử dụng:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('title', 'Tài liệu học tập');
formData.append('description', 'Mô tả chi tiết về tài liệu...');
formData.append('uploaderId', 'user_123');
formData.append('license', 'CC-BY');

fetch('http://localhost:3000/api/documents/upload', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
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
      "id": "document_id",
      "document_id": "doc_uuid",
      "title": "Tên tài liệu",
      "description": "Mô tả",
      "thumbnail": "/uploads/thumbnails/thumbnail.jpg",
      "file": {
        "originalName": "file.pdf",
        "fileType": "PDF",
        "fileSize": 1024000,
        "fileUrl": "/uploads/documents/file.pdf"
      },
      "author": {
        "id": "user_id",
        "name": "Tên tác giả",
        "avatar": "avatar_url"
      },
      "program": "Chương trình",
      "tags": ["tag1", "tag2"],
      "downloads": 100,
      "rating": 4.5,
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
    "id": "document_id",
    "document_id": "doc_uuid",
    "title": "Tên tài liệu",
    "description": "Mô tả chi tiết",
    "thumbnail": "/uploads/thumbnails/thumbnail.jpg",
    "file": {
      "originalName": "file.pdf",
      "fileType": "PDF",
      "fileSize": 1024000,
      "fileUrl": "/uploads/documents/file.pdf"
    },
    "author": {
      "id": "user_id",
      "name": "Tên tác giả",
      "avatar": "avatar_url"
    },
    "downloads": 100,
    "views": 500,
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

## MongoDB Schema

### Collection: `TaiLieu`

```javascript
{
  document_id: String (unique, auto-generated),
  title: String (required, max 200 chars),
  description: String (required, 20-1000 chars),
  file: {
    originalName: String,
    fileName: String,
    filePath: String,
    fileSize: Number,
    mimeType: String,
    fileType: String (enum: pdf, pptx, docx, zip)
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
  uploaderId: String,
  program: String,
  courseCode: String,
  year: String,
  tags: [String],
  languages: [String],
  license: String (enum: CC-BY, CC-BY-NC, CC-BY-SA, All rights reserved),
  visibility: String (enum: public, private, class-only),
  status: String (enum: draft, published, archived, rejected),
  downloads: Number (default: 0),
  views: Number (default: 0),
  rating: Number (default: 0, min: 0, max: 5),
  ratingCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Text index trên `title`, `description`, `tags`, `author.name`
- Unique index trên `document_id`
- Index trên `uploaderId`, `program`, `status`, `visibility`, `createdAt`, `downloads`, `rating`

## File Storage

### Cấu trúc thư mục

```
server/document-service/uploads/
├── documents/          # File tài liệu
│   ├── 1234567890_uuid.pdf
│   ├── 1234567891_uuid.pptx
│   └── ...
└── thumbnails/         # Hình ảnh thumbnail
    ├── 1234567890_uuid.jpg
    └── ...
```

### Quy tắc đặt tên file

- Format: `{timestamp}_{uuid}{extension}`
- Ví dụ: `1704067200000_550e8400-e29b-41d4-a716-446655440000.pdf`

### Truy cập file

Files được serve qua static middleware tại:
- Documents: `http://localhost:3003/uploads/documents/{fileName}`
- Thumbnails: `http://localhost:3003/uploads/thumbnails/{fileName}`

## Tích hợp với API Gateway

Document Service được tích hợp vào API Gateway tại port 3000:

**API Gateway Routes:**
- `POST /api/documents/upload` → `http://localhost:3003/documents/upload`
- `GET /api/documents/search` → `http://localhost:3003/documents/search`
- `GET /api/documents` → `http://localhost:3003/documents`
- `GET /api/documents/:id` → `http://localhost:3003/documents/:id`

Proxy configuration: `server/api-gateway/src/routes/documentsProxy.js`

## Frontend Integration

### Upload Modal

Component `UploadModal.vue` đã được tích hợp với API:

1. **Form Steps:**
   - Bước 1: Thông tin cơ bản (title, description, program, author)
   - Bước 2: Tags & License
   - Bước 3: Upload file và thumbnail
   - Bước 4: Success confirmation

2. **Validation:**
   - Title: Required, max 150 chars
   - Description: Required, 20-1000 chars
   - Program: Required
   - License: Required
   - File: Required, max 50MB, chỉ PDF/PPTX/DOCX/ZIP

3. **Upload Progress:**
   - Hiển thị progress bar với %
   - Có thể hủy upload đang thực hiện
   - Error handling và validation messages

### Documents View

Component `DocumentsView.vue` đã được cập nhật để fetch từ API:

1. **Search & Filter:**
   - Tìm kiếm theo từ khóa
   - Lọc theo program, year, fileType, language, tags
   - Sắp xếp: relevance, newest, downloads, rating

2. **Pagination:**
   - Hỗ trợ infinite scroll hoặc pagination
   - Tự động load thêm khi scroll xuống

3. **Auto Refresh:**
   - Tự động refresh danh sách sau khi upload thành công
   - Sync với URL query parameters

## Testing

### 1. Test Service

```bash
# Khởi động service
cd server/document-service
npm start

# Test endpoint
curl http://localhost:3003/test
```

### 2. Test Upload

```bash
# Sử dụng curl để test upload
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@/path/to/document.pdf" \
  -F "title=Tài liệu test" \
  -F "description=Mô tả chi tiết về tài liệu test này" \
  -F "uploaderId=user_123" \
  -F "license=CC-BY"
```

### 3. Test Search

```bash
# Search documents
curl "http://localhost:3000/api/documents/search?q=toán&limit=10"

# Get all documents
curl "http://localhost:3000/api/documents?limit=10&page=1"
```

## Troubleshooting

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
# Kiểm tra thư mục tồn tại
ls server/document-service/uploads/

# Thư mục sẽ tự động tạo khi service khởi động
# Nếu không, tạo thủ công:
mkdir -p server/document-service/uploads/documents
mkdir -p server/document-service/uploads/thumbnails
```

## Best Practices

1. **File Upload:**
   - Luôn validate file type và size ở frontend trước khi upload
   - Hiển thị progress cho người dùng
   - Handle errors gracefully

2. **Search:**
   - Sử dụng pagination để tránh load quá nhiều data
   - Cache kết quả search phổ biến
   - Sử dụng debounce cho search input

3. **Security:**
   - Validate user authentication trước khi upload
   - Sanitize file names để tránh path traversal
   - Kiểm tra file size và type ở cả frontend và backend

4. **Performance:**
   - Sử dụng indexes đúng cách cho queries
   - Compress images trước khi lưu
   - CDN cho static files trong production

## Deployment

1. **Environment Variables:**
   ```env
   PORT=3003
   MONGODB_URI=mongodb://127.0.0.1:27017/EduShareDB
   NODE_ENV=production
   ```

2. **File Storage:**
   - Production: Sử dụng cloud storage (S3, Azure Blob, etc.)
   - Backup thường xuyên
   - CDN cho static files

3. **MongoDB:**
   - Production: Sử dụng MongoDB Atlas hoặc dedicated server
   - Backup và replication
   - Monitoring và alerting

## Support

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Service logs trong console
2. MongoDB connection
3. File permissions cho thư mục uploads
4. Network connectivity giữa services


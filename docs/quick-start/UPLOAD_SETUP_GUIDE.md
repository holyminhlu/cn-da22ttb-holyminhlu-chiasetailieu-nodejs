# Hướng dẫn Setup và Test Upload Tài liệu

## Tổng quan

Hệ thống upload tài liệu đã được triển khai hoàn chỉnh với các thành phần sau:
- **Document Service** (port 3003): Microservice xử lý upload và lưu trữ tài liệu
- **API Gateway** (port 3000): Proxy requests từ frontend đến Document Service
- **Upload Modal**: Vue component để người dùng upload tài liệu
- **MongoDB**: Lưu trữ metadata tài liệu trong collection TaiLieu
- **File Storage**: Lưu file trên filesystem local

## Kiến trúc

```
Frontend (Vue.js)
    ↓
API Gateway (localhost:3000)
    ↓
Document Service (localhost:3003)
    ↓
├── MongoDB (TaiLieu collection) - Lưu metadata
└── Filesystem (uploads/) - Lưu file thực
```

## Cài đặt

### 1. Install Dependencies

```bash
# Document Service
cd server/document-service
npm install

# API Gateway (đã có sẵn)
cd ../api-gateway
npm install
```

### 2. Khởi động Services

#### Terminal 1: Start MongoDB
```bash
mongod
```

#### Terminal 2: Start Document Service
```bash
cd server/document-service
npm start
```

Bạn sẽ thấy:
```
🚀 =======================================
✅ Document-Service đang lắng nghe tại http://localhost:3003
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
✅ Test endpoint: http://localhost:3003/test
✅ Upload: POST http://localhost:3003/documents/upload
✅ List: GET http://localhost:3003/documents
======================================
```

#### Terminal 3: Start API Gateway
```bash
cd server/api-gateway
npm start
```

Bạn sẽ thấy:
```
API Gateway chạy tại http://localhost:3000
```

### 3. Khởi động Frontend

```bash
cd client/olf
npm run serve
```

Frontend chạy tại: `http://localhost:8080`

## Testing

### Test 1: Health Check

```bash
# Test Document Service
curl http://localhost:3003/test

# Test API Gateway
curl http://localhost:3000/api/documents
```

### Test 2: Upload từ Frontend

1. Mở trình duyệt: `http://localhost:8080`
2. Đăng nhập vào hệ thống
3. Click nút "Tải lên tài liệu" (📤) trên header
4. Điền thông tin:
   - **Bước 1**: Tên tài liệu, chương trình, mô tả
   - **Bước 2**: Tags, ngôn ngữ, license, quyền truy cập
   - **Bước 3**: Chọn file tài liệu (.pdf, .pptx, .docx, .zip)
   - **Bước 3**: (Optional) Chọn thumbnail
5. Click "Hoàn tất" để upload

### Test 3: Upload với cURL

```bash
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@C:\path\to\your\document.pdf" \
  -F "title=Tài liệu test" \
  -F "description=Đây là tài liệu test để kiểm tra hệ thống upload" \
  -F "program=Công nghệ thông tin" \
  -F "uploaderId=user_123" \
  -F "license=CC-BY" \
  -F "author={\"id\":\"user_123\",\"name\":\"Nguyễn Văn A\",\"avatar\":\"\"}" \
  -F "tags=[\"test\",\"document\"]" \
  -F "languages=[\"vi\"]" \
  -F "visibility=public" \
  -F "status=published"
```

### Test 4: Lấy danh sách tài liệu

```bash
# Tất cả tài liệu
curl http://localhost:3000/api/documents

# Phân trang
curl http://localhost:3000/api/documents?page=1&limit=10

# Tìm kiếm
curl "http://localhost:3000/api/documents?search=algorithm"

# Lọc theo chương trình
curl "http://localhost:3000/api/documents?program=Công nghệ thông tin"
```

### Test 5: Lấy chi tiết tài liệu

```bash
# Lấy document_id từ response upload
curl http://localhost:3000/api/documents/doc_abc123
```

## Cấu trúc File Upload

### Thư mục Upload

```
server/
└── uploads/
    ├── documents/           # File tài liệu
    │   └── 1234567890-123456789.pdf
    └── thumbnails/          # Thumbnails
        └── thumb_1234567890-123456789.jpg
```

### MongoDB Collection

```
Database: EduShareDB
Collection: TaiLieu

Document mẫu:
{
  "_id": ObjectId("..."),
  "document_id": "doc_abc123",
  "title": "Tài liệu mẫu",
  "description": "...",
  "program": "Công nghệ thông tin",
  "file_path": "/uploads/documents/1234567890-123456789.pdf",
  "file_name": "document.pdf",
  "file_size": 1024000,
  "file_type": "PDF",
  "thumbnail_path": "/uploads/thumbnails/thumb_...",
  "uploader_id": "user_123",
  "author": {
    "id": "user_123",
    "name": "Nguyễn Văn A",
    "avatar": ""
  },
  "tags": ["test", "document"],
  "languages": ["vi"],
  "license": "CC-BY",
  "visibility": "public",
  "status": "published",
  "views": 0,
  "downloads": 0,
  "likes": 0,
  "created_at": "2025-01-XX...",
  "updated_at": "2025-01-XX..."
}
```

## Troubleshooting

### Lỗi 1: "Cannot connect to MongoDB"

**Nguyên nhân:** MongoDB chưa chạy

**Giải pháp:**
```bash
# Kiểm tra MongoDB running
mongod

# Hoặc start MongoDB service trên Windows
net start MongoDB
```

### Lỗi 2: "Port 3003 already in use"

**Nguyên nhân:** Document Service đã chạy

**Giải pháp:**
```bash
# Tìm process đang dùng port 3003
netstat -ano | findstr :3003

# Kill process
taskkill /PID <process_id> /F
```

### Lỗi 3: "File upload failed - network error"

**Nguyên nhân:** API Gateway chưa chạy hoặc chưa được cấu hình

**Giải pháp:**
1. Kiểm tra API Gateway đang chạy
2. Kiểm tra file `server/api-gateway/src/routes/documentsProxy.js` tồn tại
3. Kiểm tra proxy route trong `server/api-gateway/src/routes/proxyRoutes.js`

### Lỗi 4: "File too large"

**Nguyên nhân:** File vượt quá 50MB

**Giải pháp:**
- Giảm kích thước file
- Hoặc tăng limit trong `documentController.js`

### Lỗi 5: "Thumbnail không hiển thị"

**Nguyên nhân:** Thumbnail là optional

**Giải pháp:**
- Không bắt buộc phải có thumbnail
- Kiểm tra frontend có serve static files đúng không

## API Reference

### POST /api/documents/upload

Upload một tài liệu mới.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `file` (file, required): File tài liệu
- `thumbnail` (file, optional): Thumbnail image
- `title` (string, required)
- `description` (string, required)
- `program` (string, required)
- `uploaderId` (string, required)
- `license` (string, required)
- `author` (JSON string, optional)
- `courseCode` (string, optional)
- `tags` (JSON array, optional)
- `languages` (JSON array, optional)
- `year` (number, optional)
- `visibility` (string, optional): "public" | "private" | "class-only"
- `status` (string, optional): "draft" | "published" | "archived"

**Response:**
```json
{
  "success": true,
  "message": "Tải lên tài liệu thành công!",
  "data": {
    "_id": "...",
    "document_id": "doc_...",
    "title": "...",
    "file_path": "/uploads/documents/...",
    "thumbnail_path": "/uploads/thumbnails/..."
  }
}
```

### GET /api/documents

Lấy danh sách tài liệu với pagination và filtering.

**Query Parameters:**
- `page` (number, optional): Số trang
- `limit` (number, optional): Items per page
- `program` (string, optional): Filter by program
- `visibility` (string, optional): Filter by visibility
- `search` (string, optional): Search text

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

### GET /api/documents/:id

Lấy chi tiết một tài liệu.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "document_id": "doc_...",
    "title": "...",
    "description": "...",
    ...
  }
}
```

## Kết quả mong đợi

Sau khi hoàn thành setup:

✅ Document Service chạy tại port 3003  
✅ API Gateway chạy tại port 3000  
✅ File upload hoạt động từ frontend  
✅ Metadata lưu vào MongoDB  
✅ File lưu vào thư mục uploads/  
✅ Thumbnail được xử lý và lưu  
✅ Search và filter tài liệu hoạt động  
✅ Upload Modal hiển thị rõ ràng, dễ sử dụng  

## Tiếp theo

Sau khi test thành công, bạn có thể:

1. **Integrate với Frontend:** Kết nối với components khác để hiển thị tài liệu
2. **Add Download Tracking:** Theo dõi số lượt tải
3. **Add Search:** Full-text search advanced
4. **Add Categories:** Phân loại tài liệu
5. **Cloud Storage:** Migrate sang S3 hoặc cloud storage khác
6. **Preview:** Generate preview cho documents

## Support

Nếu gặp vấn đề, vui lòng kiểm tra:
- Service logs
- MongoDB connection
- File permissions
- Network connectivity
- API Gateway configuration

Xem thêm: `server/document-service/DOCUMENT_SERVICE_GUIDE.md`


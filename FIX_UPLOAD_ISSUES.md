# Hướng dẫn sửa lỗi Upload

## Vấn đề đã phát hiện

1. **Request đến sai path**: Request đang đến `/upload` thay vì `/documents/upload`
2. **Multer không parse được file**: Có thể do middleware order hoặc multipart parsing
3. **Files không được lưu**: Do multer không process được request

## Các bước kiểm tra và sửa

### 1. Kiểm tra Services đang chạy

```bash
# Terminal 1: API Gateway (port 3000)
cd server/api-gateway
npm start

# Terminal 2: Document Service (port 3003)
cd server/document-service
npm start

# Terminal 3: Frontend (port 8080)
cd client/olf
npm run serve
```

### 2. Kiểm tra MongoDB đang chạy

```bash
mongosh mongodb://127.0.0.1:27017/EduShareDB
```

### 3. Test trực tiếp Document Service

```bash
# Test health check
curl http://localhost:3003/health

# Test upload endpoint (sử dụng file test)
cd server/document-service
node test-upload.js
```

### 4. Kiểm tra Request URL trong Frontend

Đảm bảo trong `UploadModal.vue` line 878, URL đúng là:
```javascript
xhr.open('POST', 'http://localhost:3000/api/documents/upload')
```

**KHÔNG** phải:
- ❌ `http://localhost:3003/upload`
- ❌ `http://localhost:3003/documents/upload`
- ❌ `http://localhost:3000/upload`

### 5. Kiểm tra Proxy Configuration

Trong `server/api-gateway/src/routes/documentsProxy.js`:
- Path rewrite: `/api/documents` → `/documents`
- Target: `http://localhost:3003`

Request flow:
```
Frontend: POST http://localhost:3000/api/documents/upload
    ↓
API Gateway: Rewrite to http://localhost:3003/documents/upload
    ↓
Document Service: Route /documents/upload
```

### 6. Restart Services

Sau khi sửa code:

```bash
# Dừng tất cả services (Ctrl+C)
# Sau đó khởi động lại:

# Terminal 1
cd server/api-gateway
npm start

# Terminal 2
cd server/document-service
npm start
```

### 7. Kiểm tra Thư mục Uploads

```bash
# Kiểm tra thư mục tồn tại
ls server/document-service/uploads/
ls server/document-service/uploads/documents/
ls server/document-service/uploads/thumbnails/

# Nếu không tồn tại, service sẽ tự động tạo khi khởi động
```

## Debug Logs

Khi upload, kiểm tra logs:

### API Gateway logs:
```
📤 PROXY REQUEST (Documents)
Method: POST
Original Path: /api/documents/upload
Proxying to: http://localhost:3003/documents/upload
```

### Document Service logs:
```
🎯 Route hit: POST /documents/upload
📥 NEW REQUEST
Method: POST
Path: /upload
```

**Lưu ý**: Nếu thấy `Path: /upload` thay vì `Path: /documents/upload`, có nghĩa là request không đi qua proxy đúng cách.

## Sửa lỗi nếu vẫn không hoạt động

### Lỗi 1: 404 NOT FOUND

**Nguyên nhân**: Request không đến đúng route

**Giải pháp**:
1. Kiểm tra URL trong frontend phải là: `http://localhost:3000/api/documents/upload`
2. Kiểm tra document-service đang chạy tại port 3003
3. Kiểm tra API Gateway đang chạy tại port 3000

### Lỗi 2: MulterError hoặc "No file uploaded"

**Nguyên nhân**: Multer không parse được multipart/form-data

**Giải pháp**:
1. Đảm bảo middleware parse JSON được skip cho multipart/form-data
2. Kiểm tra Content-Type header có `multipart/form-data`
3. Thử restart cả API Gateway và Document Service

### Lỗi 3: Files không được lưu

**Nguyên nhân**: 
- Thư mục uploads không có quyền ghi
- Multer không process được file

**Giải pháp**:
1. Kiểm tra quyền thư mục:
   ```bash
   ls -la server/document-service/uploads/
   ```
2. Xóa thư mục và để service tự tạo lại:
   ```bash
   rm -rf server/document-service/uploads
   # Restart service
   ```

### Lỗi 4: Database không lưu

**Nguyên nhân**: 
- MongoDB không kết nối
- Validation error
- Controller không được gọi

**Giải pháp**:
1. Kiểm tra MongoDB connection trong logs
2. Kiểm tra validation errors trong response
3. Xem logs của uploadDocument controller

## Test Manual

### Sử dụng curl:

```bash
# Tạo file test
echo "Test content" > test.pdf

# Upload qua API Gateway
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@test.pdf" \
  -F "title=Test Document" \
  -F "description=This is a test document" \
  -F "uploaderId=test_user" \
  -F "license=CC-BY"
```

### Sử dụng Postman:

1. Method: POST
2. URL: `http://localhost:3000/api/documents/upload`
3. Body: form-data
4. Fields:
   - `file` (type: File)
   - `title` (type: Text)
   - `description` (type: Text)
   - `uploaderId` (type: Text)
   - `license` (type: Text)

## Checklist

- [ ] MongoDB đang chạy
- [ ] API Gateway chạy tại port 3000
- [ ] Document Service chạy tại port 3003
- [ ] Frontend chạy tại port 8080
- [ ] Thư mục uploads tồn tại và có quyền ghi
- [ ] URL trong frontend đúng: `http://localhost:3000/api/documents/upload`
- [ ] Proxy configuration đúng
- [ ] Multer middleware được config đúng
- [ ] Test upload thành công với curl/Postman

## Liên hệ

Nếu vẫn gặp vấn đề sau khi kiểm tra tất cả các bước trên, vui lòng cung cấp:
1. Full logs từ cả API Gateway và Document Service
2. Network tab từ browser (request/response)
3. Error messages cụ thể


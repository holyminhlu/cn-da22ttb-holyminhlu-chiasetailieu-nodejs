# Hướng Dẫn Debug Lỗi Upload "Lỗi kết nối khi upload"

## 🔍 Các Bước Kiểm Tra

### 1. Kiểm Tra Services Đang Chạy

```bash
# Terminal 1: API Gateway (port 3000)
cd server/api-gateway
npm start

# Terminal 2: Document Service (port 3003)  
cd server/document-service
npm start

# Terminal 3: MongoDB
# Đảm bảo MongoDB đang chạy tại localhost:27017
```

### 2. Test Document Service Trực Tiếp

```bash
# Test service có chạy không
curl http://localhost:3003/test

# Kết quả mong đợi:
# {
#   "success": true,
#   "message": "Document Service đang chạy bình thường!",
#   ...
# }
```

### 3. Test API Gateway Proxy

```bash
# Test proxy endpoint
curl http://localhost:3000/api/documents/search?limit=1

# Nếu có lỗi, kiểm tra logs của API Gateway
```

### 4. Kiểm Tra Network Request trong Browser

Mở **Browser DevTools (F12)** → **Network Tab**:
1. Thử upload một file
2. Xem request đến `/api/documents/upload`
3. Kiểm tra:
   - **Status Code**: 200, 400, 500, hoặc failed?
   - **Request URL**: Phải là `http://localhost:3000/api/documents/upload`
   - **Response**: Xem response body có gì

### 5. Kiểm Tra Logs

#### API Gateway Logs (Terminal 1):
```
📤 ========== PROXY REQUEST (Documents) ==========
Method: POST
Original Path: /api/documents/upload
Rewritten Path: /documents/upload
Proxying to: http://localhost:3003/documents/upload
```

#### Document Service Logs (Terminal 2):
```
🎯 Route hit: POST /documents/upload
📥 ========== NEW REQUEST ==========
Method: POST
Path: /documents/upload
```

## 🐛 Các Lỗi Thường Gặp

### Lỗi 1: "ECONNREFUSED" hoặc "Connection refused"

**Nguyên nhân**: Document Service chưa chạy tại port 3003

**Giải pháp**:
```bash
cd server/document-service
npm start
```

### Lỗi 2: "404 NOT FOUND" từ Document Service

**Nguyên nhân**: Path rewrite không đúng

**Kiểm tra**:
- API Gateway logs: Xem `Proxying to: http://localhost:3003/???`
- Phải là: `http://localhost:3003/documents/upload`
- Nếu là `http://localhost:3003/upload` → Path rewrite sai

**Giải pháp**: Đã sửa pathRewrite thành `'^/(.*)': '/documents/$1'`

### Lỗi 3: "CORS Error" trong Browser Console

**Nguyên nhân**: CORS chưa được cấu hình đúng

**Giải pháp**: Kiểm tra `server/api-gateway/src/index.js` có:
```javascript
app.use(cors({
  origin: ['http://localhost:8080', ...],
  ...
}));
```

### Lỗi 4: "MulterError" hoặc "No file uploaded"

**Nguyên nhân**: Multer không parse được multipart/form-data

**Kiểm tra**:
- Request headers có `Content-Type: multipart/form-data`?
- File có được gửi trong FormData?

### Lỗi 5: "MongoDB Connection Error"

**Nguyên nhân**: MongoDB chưa chạy hoặc connection string sai

**Giải pháp**:
```bash
# Kiểm tra MongoDB
mongosh mongodb://127.0.0.1:27017/EduShareDB

# Kiểm tra connection string trong index.js
mongoose.connect('mongodb://127.0.0.1:27017/EduShareDB')
```

## ✅ Checklist Debug

- [ ] MongoDB đang chạy tại localhost:27017
- [ ] Document Service đang chạy tại port 3003
- [ ] API Gateway đang chạy tại port 3000
- [ ] Test endpoint `/test` hoạt động: `curl http://localhost:3003/test`
- [ ] Browser Console không có CORS error
- [ ] Network tab trong DevTools hiển thị request đến `/api/documents/upload`
- [ ] API Gateway logs hiển thị proxy request
- [ ] Document Service logs hiển thị route hit

## 🔧 Test Manual Upload

### Sử dụng curl:

```bash
# Tạo file test
echo "Test document content" > test.pdf

# Upload qua API Gateway
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@test.pdf" \
  -F "title=Test Document" \
  -F "description=This is a test document with at least 20 characters" \
  -F "uploaderId=test_user_123" \
  -F "license=CC-BY"
```

### Kết quả mong đợi:
```json
{
  "success": true,
  "message": "Tải lên tài liệu thành công!",
  "data": {
    "id": "...",
    "document_id": "doc_...",
    ...
  }
}
```

## 📝 Debug Logs Cần Kiểm Tra

1. **Browser Console**:
   - Xem error message chi tiết
   - Xem network request status
   - Xem response body

2. **API Gateway Console**:
   - Proxy request logs
   - Proxy error logs (nếu có)

3. **Document Service Console**:
   - Route hit logs
   - Upload processing logs
   - Error logs (nếu có)

## 🚨 Nếu Vẫn Không Hoạt Động

1. Kiểm tra cả 3 services đang chạy
2. Kiểm tra MongoDB connection
3. Kiểm tra file permissions cho thư mục uploads
4. Xem full error logs từ cả 3 services
5. Thử test với curl để loại trừ frontend issue

---

**Lưu ý**: Sau khi sửa code, **luôn restart cả API Gateway và Document Service**!


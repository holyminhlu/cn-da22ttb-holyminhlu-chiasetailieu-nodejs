# ✅ Kiểm Tra Document Service

## 🚨 Lỗi: 504 Gateway Timeout

Lỗi này xảy ra khi API Gateway không thể kết nối đến Document Service.

## 🔍 Kiểm Tra Nhanh

### 1. Kiểm Tra Document Service Có Đang Chạy

Mở terminal và chạy:
```bash
# Kiểm tra process đang chạy trên port 3003
netstat -ano | findstr :3003
# Hoặc trên Linux/Mac:
lsof -i :3003
```

Nếu không có kết quả, service không chạy.

### 2. Kiểm Tra Service Có Phản Hồi

```bash
curl http://localhost:3003/test
```

Nếu không có phản hồi hoặc bị timeout, service không hoạt động.

### 3. Kiểm Tra Logs Từ Document Service

Mở console của Document Service và tìm:
- "✅ ========== MONGODB CONNECTED =========="
- "EduShare Document Service đang chạy"
- Port number: 3003

## 🔧 Khắc Phục

### Nếu Service Không Chạy:

1. **Vào thư mục document-service:**
   ```bash
   cd server/document-service
   ```

2. **Khởi động service:**
   ```bash
   npm start
   # hoặc
   node index.js
   ```

3. **Đợi cho đến khi thấy:**
   ```
   ✅ ========== MONGODB CONNECTED ==========
   Document Service đang chạy tại port 3003
   ```

### Nếu Service Đang Chạy Nhưng Vẫn Timeout:

1. **Kiểm tra MongoDB có kết nối không:**
   - Service cần kết nối MongoDB trước khi nhận request
   - Nếu MongoDB chưa kết nối, request sẽ bị timeout

2. **Kiểm tra logs có lỗi không:**
   - Tìm "❌" trong console
   - Kiểm tra có lỗi connection không

3. **Restart service:**
   ```bash
   # Stop service (Ctrl+C)
   # Sau đó start lại
   npm start
   ```

## 🧪 Test Sau Khi Khởi Động

1. **Test service trực tiếp:**
   ```bash
   curl http://localhost:3003/test
   ```
   Phải trả về JSON với thông tin service.

2. **Test qua API Gateway:**
   ```bash
   curl http://localhost:3000/api/documents
   ```
   Phải trả về danh sách documents.

3. **Test lưu bookmark:**
   ```bash
   curl -X POST http://localhost:3000/api/documents/bookmarks \
     -H "Content-Type: application/json" \
     -d '{"userId":"6908204708e0d1762ce43424","documentId":"doc_test123"}'
   ```
   Phải trả về `{"success": true, ...}`

## 📝 Checklist

- [ ] Document Service đang chạy (port 3003)
- [ ] MongoDB đã kết nối (log "MONGODB CONNECTED")
- [ ] Service phản hồi tại `/test`
- [ ] API Gateway có thể kết nối đến service
- [ ] POST request không còn timeout

## 💡 Lưu Ý

- Document Service PHẢI chạy trước khi test lưu bookmark
- Nếu restart service, cũng nên restart API Gateway để đảm bảo connection mới
- Kiểm tra firewall có chặn port 3003 không


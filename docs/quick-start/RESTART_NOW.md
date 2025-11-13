# ⚠️ CẦN RESTART SERVICE NGAY!

## Vấn đề
Document Service đang chạy code CŨ, chưa có thay đổi mount `/documents` → `/`

## Giải pháp: RESTART Document Service

### Cách 1: Restart từ Terminal

**Bước 1:** Tìm terminal đang chạy Document Service  
**Bước 2:** Nhấn `Ctrl+C` để dừng  
**Bước 3:** Chạy lại:
```bash
cd server/document-service
npm start
```

### Cách 2: Kill Process và Restart

**Terminal mới:**
```powershell
# Kill process hiện tại
taskkill /PID 17356 /F

# Start lại service
cd server/document-service
npm start
```

### Cách 3: Kiểm tra trước khi restart

```bash
# Test current state
curl http://localhost:3003/test

# Nếu vẫn thấy "/documents/upload" → chưa restart
# Nếu thấy "/upload" → đã restart OK
```

## Sau khi restart, kiểm tra:

### Expected Logs:
```
📋 Loading document routes...
✅ Controllers loaded successfully
✅ Document-Service đang lắng nghe tại http://localhost:3003
✅ Kết nối MongoDB thành công
```

### Test Upload:
1. Mở browser: http://localhost:8080
2. Đăng nhập
3. Click "Tải lên tài liệu"
4. Upload file
5. Kiểm tra logs có "Route hit: POST /upload"

## Nếu vẫn lỗi sau restart:

Kiểm tra:
- [ ] Service đã restart chưa?
- [ ] Logs có "Loading document routes..."?
- [ ] Test endpoint `/test` hoạt động?
- [ ] MongoDB connected?
- [ ] API Gateway đã restart?

## Quick Fix Script

```powershell
# Kill và restart
taskkill /PID 17356 /F
cd server/document-service
npm start
```


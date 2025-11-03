# 🚀 Quick Restart Instructions

## ⚠️ QUAN TRỌNG: Cần Restart Document Service!

Service hiện đang chạy code CŨ và không nhận được route `/upload`.

## 🔧 Cách 1: Restart từ Terminal hiện tại

**Trong terminal đang chạy Document Service:**
1. Nhấn `Ctrl+C`
2. Chạy lại: `npm start`

## 🔧 Cách 2: Kill và Restart (Tự động)

**Mở PowerShell trong `server/document-service`:**
```powershell
.\restart-service.ps1
```

Hoặc chạy thủ công:
```powershell
# Kill process
taskkill /PID 17356 /F

# Start lại
npm start
```

## 🔧 Cách 3: Sử dụng Script

**Chạy script helper:**
```powershell
cd server/document-service
.\restart-service.ps1
```

## ✅ Sau khi Restart

### Kiểm tra Service:
```bash
curl http://localhost:3003/test
```

**Kết quả mong đợi:**
- Service responds với message "Document Service đang chạy bình thường!"
- Logs có "Loading document routes..."

### Test Upload:
1. Mở browser: http://localhost:8080
2. Đăng nhập
3. Click "Tải lên tài liệu" (📤)
4. Điền form và upload
5. **Kiểm tra logs có:** `🎯 Route hit: POST /upload`

## 📝 Expected Logs After Restart:

```
📋 Loading document routes...
✅ Controllers loaded successfully

🚀 =======================================
✅ Document-Service đang lắng nghe tại http://localhost:3003
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
✅ Test endpoint: http://localhost:3003/test
✅ Upload: POST http://localhost:3003/documents/upload
✅ List: GET http://localhost:3003/documents
======================================

✅ Kết nối MongoDB thành công
```

## 🎯 Sau khi restart thành công:

1. ✅ Service logs hiển thị "Loading document routes..."
2. ✅ Test endpoint `/test` hoạt động
3. ✅ Upload từ frontend không còn 404
4. ✅ Logs có "Route hit: POST /upload"
5. ✅ File được lưu thành công

## ⚠️ Nếu vẫn lỗi:

Kiểm tra:
- [ ] Service đã restart thực sự chưa?
- [ ] Code mới đã được load chưa?
- [ ] MongoDB đang chạy?
- [ ] Port 3003 không bị conflict?
- [ ] API Gateway đã restart?

---

**Status:** ⏳ Waiting for service restart  
**Action Required:** Restart Document Service NOW!


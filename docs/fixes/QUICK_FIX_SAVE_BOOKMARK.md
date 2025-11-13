# 🚀 Quick Fix: Lưu Bookmark Không Hoạt Động

## 📊 Tình Trạng

✅ **Frontend hoạt động:**
- Click nút lưu được detect
- Request được gửi với đúng body
- userId và documentId đều có

❌ **Vấn đề:**
- Không thấy response từ server
- Request có thể bị timeout hoặc không đến được backend

## 🔧 Giải Pháp Ngay

### Bước 1: Kiểm Tra Document Service

**Mở terminal mới và chạy:**
```bash
cd server/document-service
node index.js
```

**Hoặc nếu đã chạy, kiểm tra:**
```bash
# Windows
netstat -ano | findstr :3003

# Linux/Mac
lsof -i :3003
```

**Đảm bảo thấy log:**
```
✅ ========== MONGODB CONNECTED ==========
EduShare Document Service đang chạy
Port: 3003
```

### Bước 2: Test Trực Tiếp

**Test Document Service:**
```bash
curl http://localhost:3003/test
```

**Test lưu bookmark qua API Gateway:**
```bash
curl -X POST http://localhost:3000/api/documents/bookmarks \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"6908204708e0d1762ce43424\",\"documentId\":\"doc_test123\"}"
```

**Test lưu bookmark trực tiếp:**
```bash
curl -X POST http://localhost:3003/documents/bookmarks \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"6908204708e0d1762ce43424\",\"documentId\":\"doc_test123\"}"
```

### Bước 3: Kiểm Tra Logs

**Khi click lưu trong web, kiểm tra:**

1. **API Gateway console** - tìm:
   ```
   📤 ========== PROXY REQUEST (Documents) ==========
   Method: POST
   Path: /api/documents/bookmarks
   ```

2. **Document Service console** - tìm:
   ```
   📥 ========== NEW REQUEST ==========
   Method: POST
   Path: /documents/bookmarks
   ➕ ADD BOOKMARK START
   ```

**Nếu KHÔNG thấy logs:**
- Document Service chưa chạy → Khởi động service
- Proxy không hoạt động → Kiểm tra api-gateway

## 🐛 Debug Steps

### Nếu Document Service không chạy:

1. **Kiểm tra MongoDB có chạy không:**
   ```bash
   # Windows
   netstat -ano | findstr :27017
   
   # Linux/Mac
   lsof -i :27017
   ```

2. **Nếu MongoDB chưa chạy:**
   - Khởi động MongoDB trước
   - Sau đó mới khởi động Document Service

3. **Nếu vẫn lỗi:**
   - Kiểm tra connection string trong `server/document-service/index.js`
   - Đảm bảo MongoDB connection string đúng

### Nếu Document Service chạy nhưng không nhận request:

1. **Kiểm tra port:**
   - Service phải chạy tại port **3003**
   - Không được conflict với service khác

2. **Kiểm tra route:**
   - Route `/documents/bookmarks` phải được mount đúng
   - Kiểm tra `server/document-service/index.js` line 87

3. **Test trực tiếp:**
   ```bash
   curl -v -X POST http://localhost:3003/documents/bookmarks \
     -H "Content-Type: application/json" \
     -d "{\"userId\":\"test\",\"documentId\":\"test\"}"
   ```

## ✅ Checklist

- [ ] MongoDB đang chạy (port 27017)
- [ ] Document Service đang chạy (port 3003)
- [ ] API Gateway đang chạy (port 3000)
- [ ] Document Service đã kết nối MongoDB (log "MONGODB CONNECTED")
- [ ] Test endpoint `/test` trả về thành công
- [ ] POST request đến được Document Service (có log)
- [ ] Response trả về thành công

## 📝 Sau Khi Fix

1. **Refresh trang web**
2. **Click nút lưu lại**
3. **Kiểm tra Browser Console:**
   - Phải thấy "💾 DocumentsView - Response received"
   - Status phải là 200
   - Response data phải có `success: true`

4. **Kiểm tra mục "Đã lưu":**
   - Vào profile → tab "Đã lưu"
   - Tài liệu phải hiển thị trong danh sách

## 🆘 Nếu Vẫn Không Hoạt Động

Gửi các thông tin sau:
1. ✅ **Document Service console** - toàn bộ logs khi khởi động
2. ✅ **API Gateway console** - logs khi click lưu
3. ✅ **Browser Console** - logs có icon 💾, 🔖
4. ✅ **Network tab** - screenshot POST request
5. ✅ **Kết quả test curl** - response từ các lệnh curl


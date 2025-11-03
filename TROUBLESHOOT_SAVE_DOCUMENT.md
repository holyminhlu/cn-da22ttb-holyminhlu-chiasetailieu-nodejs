# 🔧 Khắc Phục: Lưu Tài Liệu Không Hoạt Động

## 📊 Tình Trạng Hiện Tại

✅ **Đã xác nhận:**
- POST request được gửi từ frontend: `POST /api/documents/bookmarks`
- User được tìm thấy trong database
- `saved_documents` hiện tại là mảng rỗng `[]`

❌ **Vấn đề:**
- Không thấy log từ document-service khi POST request được gửi
- Không thấy log "📤 PROXY REQUEST" từ api-gateway
- Không thấy log "➕ ADD BOOKMARK START" từ controller

## 🔍 Kiểm Tra Từng Bước

### Bước 1: Kiểm Tra API Gateway Logs

Mở console của **API Gateway** (port 3000) và tìm:

```
[timestamp] POST /api/documents/bookmarks
[timestamp] Request body: {"userId":"...","documentId":"..."}
📤 ========== PROXY REQUEST (Documents) ==========
Method: POST
Original Path: /api/documents/bookmarks
Rewritten Path: /documents/bookmarks
```

**Nếu KHÔNG thấy logs này:**
- Request không đến được api-gateway
- Hoặc api-gateway không chạy
- Kiểm tra: `curl http://localhost:3000/test` (nếu có endpoint test)

### Bước 2: Kiểm Tra Document Service Logs

Mở console của **Document Service** (port 3003) và tìm:

```
📥 ========== NEW REQUEST ==========
Method: POST
Path: /documents/bookmarks
Body: { userId: "...", documentId: "..." }
🎯 Route hit: POST /documents/bookmarks
➕ ADD BOOKMARK START
```

**Nếu KHÔNG thấy logs này:**
- Request không đến được document-service
- Hoặc document-service không chạy tại port 3003
- Kiểm tra: `curl http://localhost:3003/test`

### Bước 3: Kiểm Tra Browser Console

Mở Browser DevTools (F12) → Console tab và tìm:

```
🔖 Toggle save clicked: { documentId: "...", currentState: false }
💾 handleSave called: { document: {...}, saved: true }
💾 UserId from localStorage: "6908204708e0d1762ce43424"
💾 Document ID to save: "doc_..."
💾 Sending request to: http://localhost:3000/api/documents/bookmarks
💾 Response status: 200 OK
💾 Response data: { success: true, ... }
```

**Nếu KHÔNG thấy logs này:**
- JavaScript error
- User chưa đăng nhập (không có userId)
- Kiểm tra Console có error màu đỏ không

### Bước 4: Kiểm Tra Network Tab

Mở Browser DevTools → Network tab:
1. Filter: `bookmarks`
2. Tìm request `POST /api/documents/bookmarks`
3. Kiểm tra:
   - **Status**: Phải là 200 (OK) hoặc 201 (Created)
   - **Request Payload**: Có `userId` và `documentId`
   - **Response**: Có `success: true`

**Nếu Status không phải 200:**
- 400: Bad Request - thiếu userId hoặc documentId
- 404: Not Found - route không tồn tại
- 500: Server Error - lỗi backend
- Click vào request để xem chi tiết Response

## 🐛 Các Vấn Đề Có Thể Gặp

### Vấn đề 1: Request Body Không Được Parse

**Triệu chứng:**
- POST request có status 200 nhưng body là `{}` hoặc `undefined`
- Backend log: "Thiếu userId hoặc documentId"

**Giải pháp:**
- Kiểm tra Content-Type header: phải là `application/json`
- Kiểm tra api-gateway có parse JSON body không

### Vấn đề 2: Proxy Không Hoạt Động

**Triệu chứng:**
- Không thấy log "📤 PROXY REQUEST" từ api-gateway
- Request bị timeout hoặc 502 Bad Gateway

**Giải pháp:**
1. Kiểm tra document-service có chạy không:
   ```bash
   curl http://localhost:3003/test
   ```
2. Kiểm tra api-gateway có proxy đúng không
3. Restart cả hai services

### Vấn đề 3: Route Không Match

**Triệu chứng:**
- Request đến document-service nhưng không match route
- Log: "404 Not Found" hoặc không có log từ controller

**Giải pháp:**
- Kiểm tra route trong `documentRoute.js`:
  ```javascript
  router.post('/bookmarks', ...)
  ```
- Đảm bảo route được mount đúng: `app.use('/documents', documentRoute)`

### Vấn đề 4: User Không Được Tìm Thấy

**Triệu chứng:**
- Backend log: "❌ User not found with userId"
- Response: `{ success: false, message: "Người dùng không tồn tại" }`

**Giải pháp:**
- Kiểm tra userId trong localStorage khớp với database
- User có thể được tìm bằng `_id` (ObjectId) hoặc `user_id` (string)
- Kiểm tra trong MongoDB:
  ```javascript
  db.UserCollection.findOne({
    $or: [
      { _id: ObjectId("6908204708e0d1762ce43424") },
      { user_id: "..." }
    ]
  })
  ```

## ✅ Checklist Debug

- [ ] API Gateway đang chạy (port 3000)
- [ ] Document Service đang chạy (port 3003)
- [ ] POST request được gửi (Network tab)
- [ ] Request có body đúng (userId + documentId)
- [ ] API Gateway nhận được request (logs)
- [ ] Proxy forward request đến document-service (logs)
- [ ] Document-service nhận được request (logs)
- [ ] Route match đúng (`POST /documents/bookmarks`)
- [ ] Controller được gọi (`➕ ADD BOOKMARK START`)
- [ ] User được tìm thấy (`👤 User found`)
- [ ] Document được tìm thấy (`📄 Document found`)
- [ ] Bookmark được lưu (`✅ Bookmark added successfully`)
- [ ] Response trả về `success: true`

## 📝 Lệnh Test Nhanh

### Test API Gateway:
```bash
curl -X POST http://localhost:3000/api/documents/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"userId":"6908204708e0d1762ce43424","documentId":"doc_test123"}'
```

### Test Document Service trực tiếp:
```bash
curl -X POST http://localhost:3003/documents/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"userId":"6908204708e0d1762ce43424","documentId":"doc_test123"}'
```

### Test GET Bookmarks:
```bash
curl http://localhost:3000/api/documents/bookmarks/6908204708e0d1762ce43424
```

## 🚀 Bước Tiếp Theo

Nếu vẫn không hoạt động sau khi kiểm tra tất cả:

1. **Gửi logs từ cả 2 services:**
   - API Gateway console (tìm POST request)
   - Document Service console (tìm POST request)

2. **Gửi screenshot:**
   - Browser Console (tất cả logs có icon 💾, 🔖)
   - Network tab (POST request details)
   - Response body từ POST request

3. **Kiểm tra database:**
   ```javascript
   // Trong mongo shell
   use EduShareDB
   db.UserCollection.findOne({ 
     $or: [
       { _id: ObjectId("6908204708e0d1762ce43424") },
       { user_id: "user_b36d2c8c-64ae-4b2f-a5f7-41ee6f592341" }
     ]
   })
   ```
   Xem field `saved_documents` có được cập nhật không.


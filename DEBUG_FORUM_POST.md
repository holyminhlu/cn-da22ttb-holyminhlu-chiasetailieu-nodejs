# 🔍 DEBUG - Không Đăng Được Bài Viết

## BƯỚC 1: Kiểm Tra Services Đang Chạy

### PowerShell Command:
```powershell
netstat -ano | findstr ":3000 :3005"
```

**Kết quả mong đợi:**
```
TCP    0.0.0.0:3000    ...    LISTENING    [PID]  # API Gateway
TCP    0.0.0.0:3005    ...    LISTENING    [PID]  # Forum Service
```

❌ **Nếu không thấy port 3005** → Forum service không chạy!

### Khởi động lại Forum Service:
```powershell
cd D:\DA_ChuyenNganhCNTT\OpenLearnFoundation\OpenLearnFoundation\OpenLearnFoundation
cd server\forum-service
node index.js
```

---

## BƯỚC 2: Kiểm Tra Console Logs

### Mở Browser Console (F12):

1. **Refresh trang** `/diendan` (F5)
2. **Vào Console tab**
3. **Thử đăng bài** và xem logs

### Logs Mong Đợi:

**✅ Khi Upload Ảnh:**
```
📤 Uploading 1 image(s)...
⬆️ Uploading: image.png (0.50MB)
✅ Upload response: {success: true, ...}
✅ Image added: http://localhost:3005/uploads/...
```

**✅ Khi Đăng Bài:**
```
📝 Creating post with data: {...}
📤 Sending POST request to: /api/forum/posts
📤 Post data: {...}
📥 Response status: 201
📥 Response data: {success: true, ...}
✅ Post created successfully: {...}
✅ Post _id: 67abc...
✅ Total posts after adding: X
```

### ❌ Các Lỗi Thường Gặp:

**Lỗi 1: Network Error / 503**
```
❌ Error: Network Error
hoặc
❌ Forum Service không khả dụng
```
→ **Giải pháp:** Forum service không chạy, start lại service

**Lỗi 2: 400 Bad Request**
```
❌ Error status: 400
❌ Error response: {message: "Thông tin tác giả không hợp lệ"}
```
→ **Giải pháp:** Kiểm tra đăng nhập, xem localStorage có userId không

**Lỗi 3: Validation Error**
```
❌ Validation failed: No content and no images
```
→ **Giải pháp:** Phải nhập nội dung HOẶC upload ảnh

---

## BƯỚC 3: Kiểm Tra Network Tab

### Trong Browser DevTools:

1. **F12** → **Network tab**
2. **Clear** (icon thùng rác)
3. **Thử đăng bài**
4. **Tìm request:** `/posts` hoặc `forum`

### Kiểm Tra Request:

**Click vào request → Headers tab:**
```
Request URL: http://localhost:3000/api/forum/posts
Request Method: POST
Status Code: 201 Created (✅) hoặc 400/500 (❌)
```

**Click vào request → Payload tab:**
```json
{
  "author": {
    "userId": "...",
    "name": "...",
    "avatar": "..."
  },
  "content": "...",
  "images": [...]
}
```

**Click vào request → Response tab:**
```json
{
  "success": true,
  "message": "Đăng bài thành công",
  "data": {
    "_id": "...",
    "author": {...},
    "content": "...",
    ...
  }
}
```

---

## BƯỚC 4: Kiểm Tra MongoDB

### Mở MongoDB Compass hoặc Shell:

```bash
mongosh
use EduShareDB
db.posts.find().pretty()
```

**Hoặc đếm số bài viết:**
```bash
db.posts.countDocuments()
```

**Xem bài viết mới nhất:**
```bash
db.posts.find().sort({createdAt: -1}).limit(1).pretty()
```

---

## BƯỚC 5: Kiểm Tra Forum Service Terminal

### Trong terminal đang chạy Forum Service, bạn sẽ thấy:

**✅ Khi đăng bài thành công:**
```
📝 ========== CREATE POST REQUEST ==========
Body: {
  "author": {...},
  "content": "...",
  "images": []
}
✅ Validation passed
Content: This is my post...
Images: 0
💾 Saving post to database...
✅ Post saved successfully: 67abc123...
```

**❌ Khi có lỗi:**
```
❌ Validation failed: Missing author
hoặc
❌ Error creating post: ...
```

---

## BƯỚC 6: Test Trực Tiếp API

### Dùng cURL hoặc Postman:

```bash
curl -X POST http://localhost:3005/posts \
  -H "Content-Type: application/json" \
  -d '{
    "author": {
      "userId": "test123",
      "name": "Test User",
      "avatar": ""
    },
    "content": "Test post from cURL",
    "images": []
  }'
```

**Hoặc GET posts:**
```bash
curl http://localhost:3005/posts
```

---

## CHECKLIST

Làm theo thứ tự:

- [ ] 1. Forum service đang chạy (port 3005)
- [ ] 2. API Gateway đang chạy (port 3000)
- [ ] 3. MongoDB đang chạy
- [ ] 4. Đã đăng nhập (có userId trong localStorage)
- [ ] 5. Console không có error khi load trang
- [ ] 6. Network tab thấy request POST /posts
- [ ] 7. Response status = 201
- [ ] 8. Response có field "_id"

---

## GỬI CHO TÔI

Sau khi làm theo các bước trên, gửi cho tôi:

1. **Console logs** (copy/paste hoặc screenshot)
2. **Network tab** - Request & Response của `/posts`
3. **Forum Service terminal output**
4. **Kết quả:** `db.posts.countDocuments()` trong MongoDB

Với thông tin đó tôi sẽ biết chính xác vấn đề ở đâu! 🔍










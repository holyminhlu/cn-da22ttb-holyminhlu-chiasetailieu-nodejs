# 🧪 Test API Lưu Bookmark

## Test Trực Tiếp Document Service

### Bước 1: Test POST Request

Chạy script test:
```bash
cd server/document-service
node test-save-bookmark.js
```

Hoặc dùng curl:
```bash
curl -X POST http://localhost:3003/documents/bookmarks \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"6908204708e0d1762ce43424\",\"documentId\":\"doc_2c2cdee6-3903-49ea-8605-44f156f25146\"}"
```

### Bước 2: Kiểm Tra Logs

Khi chạy test, kiểm tra console của Document Service - phải thấy:
```
📥 ========== NEW REQUEST ==========
Method: POST
Path: /documents/bookmarks
Body: { userId: "...", documentId: "..." }
🎯 Route hit: POST /documents/bookmarks
➕ ADD BOOKMARK START
➕ ADD BOOKMARK
📄 Document found: ...
👤 User found: ...
✅ Bookmark added successfully
```

### Bước 3: Test Qua API Gateway

```bash
curl -X POST http://localhost:3000/api/documents/bookmarks \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"6908204708e0d1762ce43424\",\"documentId\":\"doc_2c2cdee6-3903-49ea-8605-44f156f25146\"}"
```

Kiểm tra logs từ cả API Gateway và Document Service.

### Bước 4: Kiểm Tra Database

Mở MongoDB Compass hoặc mongo shell:
```javascript
use EduShareDB
db.UserCollection.findOne({
  $or: [
    { _id: ObjectId("6908204708e0d1762ce43424") },
    { user_id: "user_b36d2c8c-64ae-4b2f-a5f7-41ee6f592341" }
  ]
})
```

Kiểm tra field `saved_documents` có documentId không.

### Bước 5: Test GET Bookmarks

```bash
curl http://localhost:3000/api/documents/bookmarks/6908204708e0d1762ce43424
```

Phải trả về danh sách tài liệu đã lưu.


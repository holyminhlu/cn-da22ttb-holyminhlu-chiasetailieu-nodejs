# 🐛 Debug: Lưu Tài Liệu Không Hoạt Động

## 📋 Vấn Đề
Khi click biểu tượng lưu tài liệu, tài liệu không được lưu vào mục "Đã lưu" trong hồ sơ người dùng.

## ✅ Các Sửa Đổi Đã Thực Hiện

### 1. Backend - Logic Tìm User
- ✅ Sửa để tìm user bằng `_id` (ObjectId) hoặc `user_id` (string)
- ✅ Xử lý cả trường hợp userId là MongoDB ObjectId

### 2. Backend - Đảm Bảo Lưu saved_documents
- ✅ Thêm `user.markModified('saved_documents')` để Mongoose nhận diện thay đổi
- ✅ Verify sau khi save bằng cách fetch lại user

### 3. Frontend - Gửi Đúng documentId
- ✅ Sửa để gửi `document.document_id || document.id || document._id`

### 4. Logging
- ✅ Thêm logging chi tiết ở tất cả các bước

## 🔍 Cách Debug

### Bước 1: Kiểm tra POST Request Có Được Gửi

1. Mở browser console (F12)
2. Click vào biểu tượng lưu trên một tài liệu
3. Kiểm tra Network tab:
   - Tìm request `POST /api/documents/bookmarks`
   - Kiểm tra:
     - Status code (200 = thành công)
     - Request payload (có `userId` và `documentId`)
     - Response body (có `success: true`)

### Bước 2: Kiểm tra Logs Từ Backend

1. **API Gateway logs** (port 3000):
   - Tìm `📤 PROXY REQUEST (Documents)`
   - Kiểm tra body có được gửi đúng

2. **Document Service logs** (port 3003):
   - Tìm `📥 NEW REQUEST` với method POST
   - Tìm `➕ ADD BOOKMARK START`
   - Kiểm tra:
     - User có được tìm thấy không
     - Document có được tìm thấy không
     - saved_documents có được lưu không

### Bước 3: Kiểm tra Database

Nếu POST request thành công nhưng vẫn không thấy tài liệu:

1. Mở MongoDB Compass hoặc mongo shell
2. Kết nối đến: `mongodb://127.0.0.1:27017/EduShareDB`
3. Tìm collection `UserCollection`
4. Tìm user với `user_id` hoặc `_id` = userId từ localStorage
5. Kiểm tra field `saved_documents`:
   ```javascript
   db.UserCollection.findOne({
     $or: [
       { user_id: "userId_from_localStorage" },
       { _id: ObjectId("userId_from_localStorage") }
     ]
   })
   ```

## 🚨 Các Vấn Đề Có Thể Xảy Ra

### 1. POST Request Không Được Gửi
**Triệu chứng**: Không thấy request trong Network tab
**Nguyên nhân**: 
- JavaScript error trong frontend
- Event handler không được gọi
**Giải pháp**: Kiểm tra console có lỗi không

### 2. POST Request Bị Lỗi
**Triệu chứng**: Request có status code 400/404/500
**Nguyên nhân**:
- userId hoặc documentId không hợp lệ
- User không tồn tại trong database
- Document không tồn tại
**Giải pháp**: Kiểm tra logs từ backend

### 3. Request Thành Công Nhưng Không Lưu
**Triệu chứng**: Response `success: true` nhưng saved_documents vẫn rỗng
**Nguyên nhân**:
- Mongoose không detect thay đổi trong array
- User không được tìm thấy đúng (tìm bằng user_id nhưng userId là _id)
**Giải pháp**: Đã thêm `markModified()` và sửa logic tìm user

### 4. Lưu Thành Công Nhưng Không Hiển Thị
**Triệu chứng**: saved_documents có data nhưng không hiển thị trong UI
**Nguyên nhân**:
- fetchBookmarks không được gọi sau khi lưu
- Response từ getUserBookmarks không đúng format
**Giải pháp**: Đã sửa để tự động refresh bookmarks sau khi lưu

## 📝 Checklist Kiểm Tra

- [ ] POST request được gửi khi click nút lưu
- [ ] Request có status 200
- [ ] Response có `success: true`
- [ ] Backend log hiển thị "User found"
- [ ] Backend log hiển thị "Document found"
- [ ] Backend log hiển thị "Bookmark added successfully"
- [ ] Backend log hiển thị saved_documents count > 0 sau khi save
- [ ] Database có saved_documents với document_id đúng
- [ ] GET /bookmarks trả về đúng số lượng tài liệu
- [ ] UI hiển thị tài liệu trong mục "Đã lưu"

## 🔧 Lệnh Kiểm Tra Nhanh

### Kiểm tra user trong database:
```javascript
// Trong mongo shell
use EduShareDB
db.UserCollection.findOne({ user_id: "6908204708e0d1762ce43424" })
// hoặc
db.UserCollection.findById(ObjectId("6908204708e0d1762ce43424"))
```

### Test API trực tiếp:
```bash
# Test lưu bookmark
curl -X POST http://localhost:3000/api/documents/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"userId":"6908204708e0d1762ce43424","documentId":"doc_xxx"}'

# Test lấy bookmarks
curl http://localhost:3000/api/documents/bookmarks/6908204708e0d1762ce43424
```

## 📞 Nếu Vẫn Không Hoạt Động

Gửi các thông tin sau:
1. Browser console logs (F12)
2. Network tab screenshot (khi click lưu)
3. Backend logs từ:
   - API Gateway (port 3000)
   - Document Service (port 3003)
4. Response từ POST request
5. Kết quả query database (saved_documents)


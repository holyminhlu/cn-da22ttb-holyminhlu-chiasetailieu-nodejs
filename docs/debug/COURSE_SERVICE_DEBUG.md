# Hướng dẫn Debug Course Service

## Vấn đề: Khóa học không hiển thị trên web

### Bước 1: Kiểm tra Course Service có đang chạy không

1. Mở terminal và chạy:
```bash
cd server/course-service
npm start
```

Bạn sẽ thấy thông báo:
```
✅ Course-Service đang lắng nghe tại http://localhost:3004
```

2. Test service trực tiếp:
```bash
cd server/course-service
node test-api.js
```

Hoặc mở browser và truy cập: `http://localhost:3004/courses`

### Bước 2: Kiểm tra API Gateway có đang chạy không

1. Mở terminal và chạy:
```bash
cd server/api-gateway
npm start
```

Bạn sẽ thấy thông báo:
```
API Gateway chạy tại http://localhost:3000
```

2. Test qua API Gateway:
Mở browser và truy cập: `http://localhost:3000/api/courses`

### Bước 3: Kiểm tra MongoDB và Import dữ liệu

1. Đảm bảo MongoDB đang chạy:
```bash
# Kiểm tra MongoDB có đang chạy không
# Trên Windows, mở Services và kiểm tra MongoDB service
```

2. Import dữ liệu mẫu:
```bash
cd server/course-service
node import-sample-courses.js
```

Bạn sẽ thấy:
```
✅ Connected to MongoDB
✅ Imported: Lập trình Python từ Cơ bản đến Nâng cao
✅ Imported: Thiết kế UI/UX cho Web và Mobile
...
✅ Successfully imported 9 courses
```

### Bước 4: Kiểm tra Console trong Browser

1. Mở browser DevTools (F12)
2. Vào tab Console
3. Truy cập trang `/courses`
4. Xem có lỗi gì không:
   - `Error fetching courses:` - Lỗi kết nối API
   - `Courses API response:` - Xem response từ API

### Bước 5: Kiểm tra Network Requests

1. Mở browser DevTools (F12)
2. Vào tab Network
3. Truy cập trang `/courses`
4. Tìm request đến `http://localhost:3000/api/courses`
5. Kiểm tra:
   - Status code (200 = OK, 404 = Not Found, 500 = Server Error)
   - Response body - xem có dữ liệu không

## Các lỗi thường gặp và cách khắc phục

### Lỗi 1: ECONNREFUSED
**Nguyên nhân:** Course service không chạy hoặc chạy sai port
**Giải pháp:** 
- Khởi động course service: `cd server/course-service && npm start`
- Kiểm tra port 3004 có bị chiếm không

### Lỗi 2: 404 Not Found
**Nguyên nhân:** Route không tồn tại hoặc proxy không hoạt động
**Giải pháp:**
- Kiểm tra API Gateway có chạy không
- Kiểm tra file `server/api-gateway/src/routes/proxyRoutes.js` có import coursesProxy không

### Lỗi 3: 500 Internal Server Error
**Nguyên nhân:** Lỗi trong course service hoặc MongoDB
**Giải pháp:**
- Kiểm tra logs của course service
- Kiểm tra MongoDB có đang chạy không
- Kiểm tra collection "Courses" có tồn tại không

### Lỗi 4: Response rỗng (success: true nhưng data: [])
**Nguyên nhân:** Chưa import dữ liệu vào MongoDB
**Giải pháp:**
- Chạy script import: `cd server/course-service && node import-sample-courses.js`

## Kiểm tra nhanh

Chạy các lệnh sau để kiểm tra nhanh:

```bash
# 1. Test Course Service trực tiếp
curl http://localhost:3004/courses

# 2. Test qua API Gateway
curl http://localhost:3000/api/courses

# 3. Test với browser
# Mở: http://localhost:3000/api/courses
```

## Cấu trúc URL

- **Frontend:** `http://localhost:8080/courses` → Gọi API
- **API Gateway:** `http://localhost:3000/api/courses` → Proxy đến course service
- **Course Service:** `http://localhost:3004/courses` → Xử lý request

## Kiểm tra từng bước

1. ✅ Course Service chạy tại port 3004
2. ✅ API Gateway chạy tại port 3000
3. ✅ MongoDB chạy và có dữ liệu
4. ✅ Proxy route đã được cấu hình đúng
5. ✅ Frontend gọi đúng URL `http://localhost:3000/api/courses`

Nếu tất cả các bước trên đều OK nhưng vẫn không hiển thị, kiểm tra console log trong browser để xem chi tiết lỗi.



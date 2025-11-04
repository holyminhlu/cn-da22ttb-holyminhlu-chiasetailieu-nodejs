# Quick Fix: Khóa học không hiển thị

## Vấn đề đã được sửa

1. ✅ CORS configuration - Thêm `http://localhost:8080` vào allowed origins
2. ✅ Frontend API calls - Đổi từ absolute URL sang relative path để đi qua Vue proxy
3. ✅ Error handling - Cải thiện logging và error messages

## Các bước để khắc phục

### 1. Restart Course Service
```bash
cd server/course-service
npm start
```
Đảm bảo service chạy tại port 3004 và có CORS config mới.

### 2. Restart API Gateway (nếu chưa chạy)
```bash
cd server/api-gateway
npm start
```

### 3. Restart Vue Dev Server
```bash
cd client/olf
npm run serve
```
Hoặc nếu đang chạy, nhấn Ctrl+C và chạy lại.

### 4. Clear Browser Cache
- Nhấn Ctrl+Shift+R (hoặc Cmd+Shift+R trên Mac) để hard refresh
- Hoặc mở DevTools (F12) → Network tab → Check "Disable cache"

### 5. Kiểm tra Console
Mở DevTools (F12) → Console tab và xem:
- `CoursesView mounted, fetching courses...`
- `Fetching courses from: /api/courses?...`
- `Courses API response:` (nên thấy data với 9 courses)

### 6. Kiểm tra Network Tab
Mở DevTools (F12) → Network tab:
- Tìm request đến `/api/courses`
- Kiểm tra Status code (200 = OK)
- Xem Response preview có data không

## Nếu vẫn không hoạt động

### Test API trực tiếp:
1. Mở browser: `http://localhost:3004/courses` (service trực tiếp)
2. Mở browser: `http://localhost:3000/api/courses` (qua API Gateway)

Nếu cả 2 đều trả về data, vấn đề là ở frontend.
Nếu không, vấn đề là ở backend.

### Kiểm tra logs:
1. Course Service console - xem có request đến không
2. API Gateway console - xem có proxy request không
3. Browser Console - xem có lỗi JavaScript không

## Thay đổi đã thực hiện

### Backend:
- `server/course-service/index.js` - CORS config với `localhost:8080`
- `server/api-gateway/src/index.js` - Thêm `localhost:3004` vào CORS

### Frontend:
- `client/olf/src/views/CoursesView.vue` - Đổi sang relative path `/api/courses`
- `client/olf/src/utils/courseAPI.js` - Đổi sang relative path `/api/courses`

## Lưu ý

- Vue proxy sẽ tự động forward `/api/*` đến `http://localhost:3000`
- Relative path giúp tránh CORS issues
- Đảm bảo tất cả services đang chạy trước khi test


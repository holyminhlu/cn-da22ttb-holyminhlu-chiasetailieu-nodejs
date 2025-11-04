# Fix: API Gateway không route /api/courses

## Vấn đề
- `http://localhost:3004/courses` ✅ Hoạt động (service trực tiếp)
- `http://localhost:3000/api/courses` ❌ Trả về "Cannot GET /api/courses"

## Nguyên nhân
PathRewrite trong coursesProxy không đúng. Khi route được mount tại `/courses` trong proxyRoutes, Express tự động strip prefix `/courses`, nên request `/api/courses` trở thành `/` (empty) trong middleware.

## Giải pháp
Đã sửa pathRewrite trong `server/api-gateway/src/routes/coursesProxy.js`:
```javascript
pathRewrite: { 
  '^/$': '/courses',           // Empty path -> /courses
  '^/(.*)': '/courses/$1'     // Any path -> /courses/{path}
}
```

## Các bước để áp dụng

### 1. Restart API Gateway
```bash
cd server/api-gateway
# Nhấn Ctrl+C để dừng nếu đang chạy
npm start
```

### 2. Test lại
1. Mở browser: `http://localhost:3000/api/courses`
   - Nên thấy JSON với 9 courses
   
2. Kiểm tra console của API Gateway:
   - Nên thấy log: `📤 PROXY REQUEST (Courses)`
   - Nên thấy: `Proxying to: http://localhost:3004/courses`

### 3. Test từ frontend
1. Restart Vue dev server (nếu cần)
2. Mở `http://localhost:8080/courses`
3. Kiểm tra browser console - nên thấy courses được load

## Nếu vẫn không hoạt động

### Kiểm tra logs API Gateway
Xem console của API Gateway có log request không:
```
📤 ========== PROXY REQUEST (Courses) ==========
Method: GET
Original Path: /api/courses
...
```

### Kiểm tra Course Service
Xem console của Course Service có nhận request không:
```
📥 ========== NEW REQUEST ==========
Method: GET
Path: /courses
...
```

### Test trực tiếp
```bash
# Test từ command line
curl http://localhost:3000/api/courses
```

Nếu vẫn lỗi, kiểm tra:
1. API Gateway có đang chạy tại port 3000?
2. Course Service có đang chạy tại port 3004?
3. Route `/courses` có được mount trong proxyRoutes.js?


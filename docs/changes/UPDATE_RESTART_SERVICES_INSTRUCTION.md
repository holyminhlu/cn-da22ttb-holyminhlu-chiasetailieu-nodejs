# Cập Nhật Hướng Dẫn Khởi Động Services

## Ngày thực hiện
2024-12-13

## Mô tả
Cập nhật file `RESTART_SERVICES_INSTRUCTION.md` để thêm hướng dẫn chi tiết về việc khởi động API Gateway và các services cần thiết. File này được cập nhật để giải quyết vấn đề frontend không thể kết nối với backend do API Gateway không chạy.

## Vấn Đề
- Frontend (localhost:8080) hiển thị lỗi: "Không thể tải danh sách khóa học"
- Proxy error: `ECONNREFUSED` khi frontend cố gắng kết nối đến `http://localhost:3000`
- API Gateway (port 3000) không được khởi động
- Người dùng không biết cần khởi động API Gateway trước khi sử dụng frontend

## File Đã Chỉnh Sửa

### `docs/quick-start/RESTART_SERVICES_INSTRUCTION.md`

#### Thay đổi chính
- **Trước**: File chỉ hướng dẫn restart Document Service
- **Sau**: File mở rộng với hướng dẫn đầy đủ về 4 services cần thiết:
  1. API Gateway (Port 3000) - **CRITICAL**
  2. Auth Service (Port 3001)
  3. Document Service (Port 3003)
  4. Course Service (Port 3004)

#### Nội dung mới được thêm vào

##### 1. Section "IMPORTANT: All Required Services"
- Liệt kê tất cả 4 services cần thiết
- Giải thích vai trò của từng service
- Đánh dấu API Gateway là **REQUIRED** và **CRITICAL**

##### 2. Section "Starting All Services"
- Hướng dẫn khởi động từng service trong terminal riêng biệt
- Terminal 1: API Gateway (PORT 3000) - **CRITICAL**
- Terminal 2: Auth Service (PORT 3001)
- Terminal 3: Document Service (PORT 3003)
- Terminal 4: Course Service (PORT 3004)
- Mỗi service có expected output để người dùng kiểm tra

##### 3. Section "Quick Health Check"
- Các lệnh curl để test từng service
- Test API Gateway: `curl http://localhost:3000/test`
- Test Auth Service: `curl http://localhost:3001/test`
- Test Document Service: `curl http://localhost:3003/test`
- Test Course Service: `curl http://localhost:3004/test`
- Test Courses qua API Gateway: `curl http://localhost:3000/api/courses?limit=5`

##### 4. Section "Troubleshooting"
- **Frontend shows "Cannot load course list"**
  - Checklist: API Gateway running?, Course Service running?, MongoDB data imported?
  - Đánh dấu API Gateway là "Most common issue!"
- **Proxy Error: ECONNREFUSED**
  - Giải thích: API Gateway (port 3000) không chạy
  - Hướng dẫn: Start it in a separate terminal
- **Service won't start**
  - Kiểm tra port đã được sử dụng chưa
  - Hướng dẫn kill process nếu cần

##### 5. Section "Notes"
- Luôn khởi động API Gateway trước
- Giữ tất cả services chạy trong các terminal riêng biệt
- Hướng dẫn khi nào cần restart service
- Hướng dẫn khi nào cần restart API Gateway

## Cấu Trúc File Mới

```markdown
# 🔄 RESTART SERVICES - Instructions

## ⚠️ IMPORTANT: All Required Services
[Liệt kê 4 services]

## 🚀 Starting All Services
[4 terminals với hướng dẫn chi tiết]

## ✅ Quick Health Check
[Các lệnh test]

## 🔍 Troubleshooting
[3 vấn đề phổ biến và cách giải quyết]

## 📝 Notes
[Lưu ý quan trọng]
```

## So Sánh Trước và Sau

### Trước
- Chỉ hướng dẫn restart Document Service
- Không đề cập đến API Gateway
- Không có hướng dẫn về Course Service
- Không có health check commands
- Không có troubleshooting section

### Sau
- Hướng dẫn đầy đủ 4 services
- API Gateway được đánh dấu là CRITICAL
- Health check commands cho tất cả services
- Troubleshooting section chi tiết
- Notes section với best practices

## Lợi Ích

### Cho Người Dùng
- ✅ Biết chính xác services nào cần khởi động
- ✅ Biết thứ tự khởi động services
- ✅ Có thể test nhanh services có hoạt động không
- ✅ Có thể tự troubleshoot các vấn đề phổ biến

### Cho Developers
- ✅ Documentation rõ ràng hơn
- ✅ Dễ dàng onboard người mới
- ✅ Giảm thời gian debug
- ✅ Tránh các lỗi phổ biến

## Testing

### Checklist
- [x] Kiểm tra file có đọc được không
- [x] Kiểm tra các commands có hoạt động không
- [x] Kiểm tra format markdown đúng không
- [x] Kiểm tra thông tin chính xác không

### Các Lệnh Test
```bash
# Test API Gateway
curl http://localhost:3000/test

# Test Auth Service
curl http://localhost:3001/test

# Test Document Service
curl http://localhost:3003/test

# Test Course Service
curl http://localhost:3004/test

# Test Courses qua API Gateway
curl http://localhost:3000/api/courses?limit=5
```

## Ảnh Hưởng

### Tích Cực
- ✅ Giải quyết vấn đề frontend không kết nối được backend
- ✅ Người dùng biết cách khởi động đầy đủ services
- ✅ Giảm thời gian debug
- ✅ Cải thiện developer experience

### Không Có Ảnh Hưởng Tiêu Cực
- ⚠️ Không thay đổi code
- ⚠️ Không thay đổi logic
- ⚠️ Chỉ cập nhật documentation

## Cách Sử Dụng

1. Đọc section "IMPORTANT: All Required Services"
2. Khởi động từng service theo thứ tự trong section "Starting All Services"
3. Kiểm tra services bằng các lệnh trong section "Quick Health Check"
4. Nếu có lỗi, tham khảo section "Troubleshooting"

## Ghi Chú

- File này là documentation, không ảnh hưởng đến code
- Có thể cập nhật thêm services khác nếu cần
- Nên cập nhật khi có thay đổi về services

## Người Thực Hiện
Auto (AI Assistant)

## Trạng Thái
✅ Hoàn thành

---

**Lưu ý**: File này được tạo để ghi lại thay đổi về documentation. Nếu có thay đổi nào khác về services, vui lòng cập nhật file `RESTART_SERVICES_INSTRUCTION.md` và file này.


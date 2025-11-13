# Changes Documentation

## Mục Đích
Folder này chứa tất cả các file ghi lại các thay đổi đã thực hiện trong dự án. Mỗi file `.md` mô tả chi tiết một thay đổi cụ thể, bao gồm:
- Mô tả thay đổi
- Các file đã chỉnh sửa
- Lý do thay đổi
- Kết quả trước và sau
- Hướng dẫn rollback (nếu cần)

## Cấu Trúc

### Naming Convention
- Tên file sử dụng format: `ACTION_DESCRIPTION.md`
- Ví dụ: `REDUCE_HOMEPAGE_SPACING.md`, `UPDATE_RESTART_SERVICES_INSTRUCTION.md`
- Tên file nên mô tả rõ ràng thay đổi

### Format File
Mỗi file `.md` nên chứa các phần sau:
1. **Tiêu đề**: Mô tả ngắn gọn thay đổi
2. **Ngày thực hiện**: Ngày thực hiện thay đổi
3. **Mô tả**: Mô tả chi tiết thay đổi
4. **Yêu cầu**: Yêu cầu dẫn đến thay đổi
5. **Các File Đã Chỉnh Sửa**: Danh sách các file đã thay đổi
6. **Tóm Tắt Các Thay Đổi**: Bảng so sánh trước/sau
7. **Kết Quả**: Kết quả trước và sau thay đổi
8. **Testing**: Checklist và các test đã thực hiện
9. **Cách Rollback**: Hướng dẫn hoàn nguyên (nếu cần)
10. **Trạng Thái**: Trạng thái hoàn thành

## Danh Sách Các Thay Đổi

### 2024-12-13

#### 1. REDUCE_HOMEPAGE_SPACING.md
- **Mô tả**: Giảm khoảng cách giữa các section trên trang chủ
- **Files**: 
  - `client/olf/src/views/HomeView.vue`
  - `client/olf/src/components/CollectionCarousel.vue`
  - `client/olf/src/components/FeaturedInstructors.vue`
  - `client/olf/src/components/HeroSection.vue`
- **Loại**: UI/UX Improvement
- **Trạng thái**: ✅ Hoàn thành

#### 2. UPDATE_RESTART_SERVICES_INSTRUCTION.md
- **Mô tả**: Cập nhật hướng dẫn khởi động services
- **Files**: 
  - `docs/quick-start/RESTART_SERVICES_INSTRUCTION.md`
- **Loại**: Documentation Update
- **Trạng thái**: ✅ Hoàn thành

#### 3. FIX_COLLECTION_CAROUSEL_FULL_WIDTH.md
- **Mô tả**: Sửa lỗi hiển thị carousel - khi chuyển slide, ảnh mới hiển thị toàn bộ khung, không còn góc nhỏ của ảnh trước
- **Files**: 
  - `client/olf/src/components/CollectionCarousel.vue`
- **Loại**: Bug Fix / UI Improvement
- **Trạng thái**: ✅ Hoàn thành

## Cách Sử Dụng

### Khi Tạo Thay Đổi Mới
1. Tạo file `.md` mới trong folder `docs/changes/`
2. Đặt tên file theo format: `ACTION_DESCRIPTION.md`
3. Điền đầy đủ thông tin theo format mẫu
4. Cập nhật file `README.md` này với thay đổi mới

### Khi Xem Lại Thay Đổi
1. Đọc file `.md` tương ứng với thay đổi
2. Xem phần "Các File Đã Chỉnh Sửa" để biết file nào đã thay đổi
3. Xem phần "Tóm Tắt Các Thay Đổi" để biết chi tiết
4. Xem phần "Cách Rollback" nếu cần hoàn nguyên

### Khi Rollback
1. Đọc file `.md` tương ứng
2. Xem phần "Cách Rollback"
3. Thực hiện các bước rollback
4. Ghi lại rollback trong file hoặc tạo file mới

## Best Practices

### Khi Ghi Lại Thay Đổi
- ✅ Mô tả rõ ràng và chi tiết
- ✅ Liệt kê đầy đủ các file đã thay đổi
- ✅ Ghi lại giá trị trước và sau
- ✅ Giải thích lý do thay đổi
- ✅ Cung cấp hướng dẫn rollback

### Khi Đọc Thay Đổi
- ✅ Đọc kỹ phần mô tả
- ✅ Kiểm tra các file đã thay đổi
- ✅ Xem phần testing để biết đã test chưa
- ✅ Xem phần rollback nếu cần

### Khi Cập Nhật
- ✅ Cập nhật file `.md` khi có thay đổi mới
- ✅ Cập nhật `README.md` với thay đổi mới
- ✅ Giữ format nhất quán
- ✅ Ghi lại ngày thực hiện

## Template

```markdown
# [Tên Thay Đổi]

## Ngày thực hiện
YYYY-MM-DD

## Mô tả
[Mô tả chi tiết thay đổi]

## Yêu cầu
[Yêu cầu dẫn đến thay đổi]

## Các File Đã Chỉnh Sửa
[List các file đã thay đổi]

## Tóm Tắt Các Thay Đổi
[Bảng so sánh trước/sau]

## Kết Quả
[Kết quả trước và sau]

## Testing
[Checklist và test đã thực hiện]

## Cách Rollback
[Hướng dẫn hoàn nguyên]

## Trạng Thái
✅ Hoàn thành / ⏳ Đang thực hiện / ❌ Đã hủy
```

## Lưu Ý

- File này là documentation, không ảnh hưởng đến code
- Nên cập nhật thường xuyên khi có thay đổi
- Nên giữ format nhất quán
- Nên ghi lại đầy đủ thông tin để dễ dàng rollback

## Liên Kết

- [Project Tree](../project/PROJECT_TREE.md)
- [Quick Start Guide](../quick-start/QUICK_START.md)
- [Restart Services Instruction](../quick-start/RESTART_SERVICES_INSTRUCTION.md)

---

**Lưu ý**: Folder này được tạo để ghi lại tất cả các thay đổi trong dự án. Hãy cập nhật file này khi có thay đổi mới.


# 🌳 Cây Phân Cấp Chức Năng - OpenLearnFoundation

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Cây Phân Cấp Đầy Đủ](#cây-phân-cấp-đầy-đủ)
3. [Mô Tả Chi Tiết Theo Module](#mô-tả-chi-tiết-theo-module)
4. [Phân Quyền Theo Vai Trò](#phân-quyền-theo-vai-trò)

---

## Tổng Quan

Cây phân cấp chức năng của hệ thống OpenLearnFoundation được tổ chức theo cấu trúc phân cấp từ tổng thể đến chi tiết, bao gồm:

- **Cấp 0**: Hệ thống tổng thể
- **Cấp 1**: Các module chính (7 modules)
- **Cấp 2**: Các nhóm chức năng
- **Cấp 3**: Các chức năng chi tiết

---

## Cây Phân Cấp Đầy Đủ

```
HỆ THỐNG OPENLEARNFOUNDATION
│
├── 1. XÁC THỰC & QUẢN LÝ TÀI KHOẢN
│   ├── 1.1. Đăng ký & Đăng nhập
│   │   ├── 1.1.1. Đăng ký tài khoản mới
│   │   ├── 1.1.2. Đăng nhập vào hệ thống
│   │   ├── 1.1.3. Đăng xuất
│   │   ├── 1.1.4. Quên mật khẩu (Future)
│   │   └── 1.1.5. Xác thực email (Future)
│   │
│   ├── 1.2. Quản lý Profile
│   │   ├── 1.2.1. Xem thông tin cá nhân
│   │   ├── 1.2.2. Cập nhật thông tin cá nhân
│   │   │   ├── 1.2.2.1. Cập nhật họ tên
│   │   │   ├── 1.2.2.2. Cập nhật số điện thoại
│   │   │   ├── 1.2.2.3. Cập nhật địa chỉ
│   │   │   ├── 1.2.2.4. Cập nhật giới tính
│   │   │   ├── 1.2.2.5. Cập nhật tiểu sử (bio)
│   │   │   ├── 1.2.2.6. Cập nhật trường đại học
│   │   │   └── 1.2.2.7. Cập nhật chuyên ngành
│   │   │
│   │   ├── 1.2.3. Quản lý ảnh đại diện
│   │   │   ├── 1.2.3.1. Upload avatar
│   │   │   ├── 1.2.3.2. Xóa avatar
│   │   │   └── 1.2.3.3. Upload cover image
│   │   │
│   │   └── 1.2.4. Xem thống kê cá nhân
│   │       ├── 1.2.4.1. Số tài liệu đã lưu
│   │       ├── 1.2.4.2. Số khóa học đã đăng ký
│   │       ├── 1.2.4.3. Điểm uy tín (reputation score)
│   │       └── 1.2.4.4. Số đóng góp
│   │
│   └── 1.3. Bảo mật & Cài đặt
│       ├── 1.3.1. Thay đổi mật khẩu (Future)
│       ├── 1.3.2. Xem lịch sử đăng nhập (Future)
│       └── 1.3.3. Quản lý thiết bị đã đăng nhập (Future)
│
├── 2. QUẢN LÝ TÀI LIỆU
│   ├── 2.1. Xem & Tìm kiếm Tài liệu
│   │   ├── 2.1.1. Xem danh sách tài liệu
│   │   │   ├── 2.1.1.1. Xem tài liệu công khai
│   │   │   ├── 2.1.1.2. Xem tài liệu của mình (Instructor/Admin)
│   │   │   └── 2.1.1.3. Xem tất cả tài liệu (Admin)
│   │   │
│   │   ├── 2.1.2. Tìm kiếm tài liệu
│   │   │   ├── 2.1.2.1. Tìm kiếm theo từ khóa
│   │   │   ├── 2.1.2.2. Full-text search
│   │   │   └── 2.1.2.3. Autocomplete suggestions
│   │   │
│   │   ├── 2.1.3. Lọc tài liệu
│   │   │   ├── 2.1.3.1. Lọc theo môn học/chương trình
│   │   │   ├── 2.1.3.2. Lọc theo loại file (PDF, PPTX, DOCX, ZIP)
│   │   │   ├── 2.1.3.3. Lọc theo cấp độ (THPT, Đại học, Sau đại học)
│   │   │   ├── 2.1.3.4. Lọc theo năm học
│   │   │   ├── 2.1.3.5. Lọc theo ngôn ngữ
│   │   │   ├── 2.1.3.6. Lọc theo tags
│   │   │   └── 2.1.3.7. Lọc theo tác giả
│   │   │
│   │   ├── 2.1.4. Sắp xếp tài liệu
│   │   │   ├── 2.1.4.1. Sắp xếp theo mới nhất
│   │   │   ├── 2.1.4.2. Sắp xếp theo phổ biến
│   │   │   ├── 2.1.4.3. Sắp xếp theo đánh giá cao
│   │   │   └── 2.1.4.4. Sắp xếp theo lượt tải
│   │   │
│   │   └── 2.1.5. Xem chi tiết tài liệu
│   │       ├── 2.1.5.1. Xem thông tin đầy đủ
│   │       ├── 2.1.5.2. Xem đánh giá và nhận xét
│   │       ├── 2.1.5.3. Xem thống kê (downloads, views, rating)
│   │       └── 2.1.5.4. Xem thông tin license
│   │
│   ├── 2.2. Download & Preview
│   │   ├── 2.2.1. Tải xuống tài liệu
│   │   ├── 2.2.2. Xem trước tài liệu (PDF viewer)
│   │   └── 2.2.3. Theo dõi lượt tải (downloads counter)
│   │
│   ├── 2.3. Bookmark & Bộ Sưu Tập
│   │   ├── 2.3.1. Lưu tài liệu vào bookmark
│   │   ├── 2.3.2. Xem danh sách tài liệu đã lưu
│   │   ├── 2.3.3. Bỏ lưu tài liệu
│   │   └── 2.3.4. Quản lý bộ sưu tập cá nhân
│   │
│   ├── 2.4. Đánh Giá & Nhận Xét
│   │   ├── 2.4.1. Đánh giá tài liệu (1-5 sao)
│   │   ├── 2.4.2. Viết nhận xét về tài liệu
│   │   ├── 2.4.3. Xem đánh giá của người khác
│   │   └── 2.4.4. Bình chọn nhận xét hữu ích
│   │
│   └── 2.5. Upload & Quản Lý Tài Liệu (Instructor/Admin)
│       ├── 2.5.1. Upload tài liệu mới
│       │   ├── 2.5.1.1. Chọn file (PDF, PPTX, DOCX, ZIP)
│       │   ├── 2.5.1.2. Upload thumbnail
│       │   ├── 2.5.1.3. Nhập metadata (title, description, author)
│       │   ├── 2.5.1.4. Chọn môn học/chương trình
│       │   ├── 2.5.1.5. Nhập tags
│       │   ├── 2.5.1.6. Chọn license
│       │   └── 2.5.1.7. Thiết lập visibility
│       │
│       ├── 2.5.2. Quản lý tài liệu đã upload
│       │   ├── 2.5.2.1. Xem danh sách tài liệu của mình
│       │   ├── 2.5.2.2. Chỉnh sửa tài liệu
│       │   ├── 2.5.2.3. Xóa tài liệu
│       │   └── 2.5.2.4. Xem thống kê (views, downloads)
│       │
│       └── 2.5.3. Quản lý tất cả tài liệu (Admin)
│           ├── 2.5.3.1. Xem tất cả tài liệu (bao gồm private)
│           ├── 2.5.3.2. Duyệt tài liệu (approve/reject)
│           ├── 2.5.3.3. Đánh dấu tài liệu nổi bật (featured)
│           └── 2.5.3.4. Xóa tài liệu vi phạm
│
├── 3. QUẢN LÝ KHÓA HỌC
│   ├── 3.1. Xem & Tìm kiếm Khóa Học
│   │   ├── 3.1.1. Xem danh sách khóa học
│   │   │   ├── 3.1.1.1. Xem khóa học công khai
│   │   │   ├── 3.1.1.2. Xem khóa học của mình (Instructor)
│   │   │   └── 3.1.1.3. Xem tất cả khóa học (Admin)
│   │   │
│   │   ├── 3.1.2. Tìm kiếm khóa học
│   │   │   ├── 3.1.2.1. Tìm kiếm theo từ khóa
│   │   │   └── 3.1.2.2. Full-text search
│   │   │
│   │   ├── 3.1.3. Lọc khóa học
│   │   │   ├── 3.1.3.1. Lọc theo danh mục
│   │   │   ├── 3.1.3.2. Lọc theo cấp độ (Beginner, Intermediate, Advanced, Expert)
│   │   │   ├── 3.1.3.3. Lọc theo miễn phí/có phí
│   │   │   └── 3.1.3.4. Lọc theo giảng viên
│   │   │
│   │   ├── 3.1.4. Sắp xếp khóa học
│   │   │   ├── 3.1.4.1. Sắp xếp theo mới nhất
│   │   │   ├── 3.1.4.2. Sắp xếp theo phổ biến
│   │   │   ├── 3.1.4.3. Sắp xếp theo đánh giá cao
│   │   │   └── 3.1.4.4. Sắp xếp theo tiêu đề
│   │   │
│   │   └── 3.1.5. Xem chi tiết khóa học
│   │       ├── 3.1.5.1. Xem mô tả đầy đủ
│   │       ├── 3.1.5.2. Xem nội dung sẽ học
│   │       ├── 3.1.5.3. Xem yêu cầu tiên quyết
│   │       ├── 3.1.5.4. Xem thông tin giảng viên
│   │       ├── 3.1.5.5. Xem modules và lessons
│   │       └── 3.1.5.6. Xem đánh giá và reviews
│   │
│   ├── 3.2. Đăng Ký & Thanh Toán Khóa Học
│   │   ├── 3.2.1. Đăng ký khóa học
│   │   │   ├── 3.2.1.1. Đăng ký khóa học miễn phí
│   │   │   ├── 3.2.1.2. Đăng ký khóa học có phí (sau thanh toán)
│   │   │   └── 3.2.1.3. Xem trạng thái đăng ký
│   │   │
│   │   ├── 3.2.2. Thanh toán khóa học
│   │   │   ├── 3.2.2.1. Xem giá khóa học
│   │   │   ├── 3.2.2.2. Tạo payment link (PayOS)
│   │   │   ├── 3.2.2.3. Thanh toán qua PayOS
│   │   │   ├── 3.2.2.4. Thanh toán qua VietQR
│   │   │   ├── 3.2.2.5. Theo dõi trạng thái thanh toán
│   │   │   └── 3.2.2.6. Xem lịch sử thanh toán
│   │   │
│   │   └── 3.2.3. Quản lý khóa học đã đăng ký
│   │       ├── 3.2.3.1. Xem danh sách khóa học đã đăng ký
│   │       └── 3.2.3.2. Hủy đăng ký (Future)
│   │
│   ├── 3.3. Học Tập & Theo Dõi Tiến Độ
│   │   ├── 3.3.1. Xem nội dung khóa học
│   │   │   ├── 3.3.1.1. Xem danh sách modules
│   │   │   ├── 3.3.1.2. Xem danh sách lessons
│   │   │   └── 3.3.1.3. Xem video bài giảng
│   │   │
│   │   ├── 3.3.2. Quản lý tiến độ học tập
│   │   │   ├── 3.3.2.1. Đánh dấu bài học đã hoàn thành
│   │   │   ├── 3.3.2.2. Xem tiến độ học tập (% hoàn thành)
│   │   │   ├── 3.3.2.3. Xem bài học cuối cùng đã xem
│   │   │   └── 3.3.2.4. Tiếp tục học từ bài đã dừng
│   │   │
│   │   └── 3.3.3. Đánh Giá Khóa Học
│   │       ├── 3.3.3.1. Đánh giá khóa học (1-5 sao)
│   │       ├── 3.3.3.2. Viết review về khóa học
│   │       └── 3.3.3.3. Nhận chứng chỉ khi hoàn thành (Future)
│   │
│   └── 3.4. Tạo & Quản Lý Khóa Học (Instructor/Admin)
│       ├── 3.4.1. Tạo khóa học mới
│       │   ├── 3.4.1.1. Thiết lập thông tin cơ bản
│       │   │   ├── 3.4.1.1.1. Tiêu đề, phụ đề, mô tả
│       │   │   ├── 3.4.1.1.2. Danh mục, cấp độ
│       │   │   ├── 3.4.1.1.3. Upload thumbnail
│       │   │   ├── 3.4.1.1.4. Thiết lập pricing (miễn phí/có phí)
│       │   │   ├── 3.4.1.1.5. Nhập tags
│       │   │   ├── 3.4.1.1.6. Nội dung sẽ học
│       │   │   ├── 3.4.1.1.7. Yêu cầu tiên quyết
│       │   │   └── 3.4.1.1.8. Đối tượng mục tiêu
│       │   │
│       │   ├── 3.4.1.2. Tạo Modules và Lessons
│       │   │   ├── 3.4.1.2.1. Thêm module mới
│       │   │   ├── 3.4.1.2.2. Thêm lesson vào module
│       │   │   ├── 3.4.1.2.3. Upload video cho lesson
│       │   │   ├── 3.4.1.2.4. Thiết lập thời lượng lesson
│       │   │   └── 3.4.1.2.5. Đánh dấu lesson preview
│       │   │
│       │   └── 3.4.1.3. Lưu và Publish
│       │       ├── 3.4.1.3.1. Lưu bản nháp (draft)
│       │       └── 3.4.1.3.2. Publish khóa học
│       │
│       ├── 3.4.2. Quản lý khóa học đã tạo
│       │   ├── 3.4.2.1. Xem danh sách khóa học của mình
│       │   ├── 3.4.2.2. Chỉnh sửa khóa học
│       │   │   ├── 3.4.2.2.1. Cập nhật thông tin
│       │   │   ├── 3.4.2.2.2. Thêm/sửa/xóa modules
│       │   │   ├── 3.4.2.2.3. Thêm/sửa/xóa lessons
│       │   │   └── 3.4.2.2.4. Cập nhật pricing
│       │   │
│       │   ├── 3.4.2.3. Xóa khóa học
│       │   │
│       │   └── 3.4.2.4. Xem thống kê khóa học
│       │       ├── 3.4.2.4.1. Số học viên đã đăng ký
│       │       ├── 3.4.2.4.2. Đánh giá trung bình
│       │       ├── 3.4.2.4.3. Số reviews
│       │       └── 3.4.2.4.4. Doanh thu (nếu có phí)
│       │
│       └── 3.4.3. Quản lý tất cả khóa học (Admin)
│           ├── 3.4.3.1. Xem tất cả khóa học (bao gồm draft)
│           ├── 3.4.3.2. Duyệt khóa học (approve/reject)
│           ├── 3.4.3.3. Đánh dấu khóa học nổi bật
│           └── 3.4.3.4. Xóa khóa học vi phạm
│
├── 4. FORUM & BLOG
│   ├── 4.1. Forum (Diễn Đàn)
│   │   ├── 4.1.1. Xem Forum
│   │   │   ├── 4.1.1.1. Xem danh sách bài đăng
│   │   │   ├── 4.1.1.2. Xem chi tiết bài đăng
│   │   │   ├── 4.1.1.3. Xem comments
│   │   │   └── 4.1.1.4. Tìm kiếm trong forum
│   │   │
│   │   ├── 4.1.2. Đăng Bài
│   │   │   ├── 4.1.2.1. Tạo bài đăng mới
│   │   │   ├── 4.1.2.2. Upload ảnh cho bài đăng
│   │   │   ├── 4.1.2.3. Chọn danh mục
│   │   │   └── 4.1.2.4. Đăng bài
│   │   │
│   │   ├── 4.1.3. Tương Tác
│   │   │   ├── 4.1.3.1. Comment trên bài đăng
│   │   │   ├── 4.1.3.2. Like/Unlike bài đăng
│   │   │   ├── 4.1.3.3. Upvote/Downvote câu trả lời
│   │   │   └── 4.1.3.4. Đánh dấu câu trả lời đúng (Future)
│   │   │
│   │   └── 4.1.4. Quản Lý (Instructor/Admin)
│   │       ├── 4.1.4.1. Chỉnh sửa bài đăng của mình
│   │       ├── 4.1.4.2. Xóa bài đăng của mình
│   │       └── 4.1.4.3. Quản lý tất cả bài đăng (Admin)
│   │
│   └── 4.2. Blog
│       ├── 4.2.1. Xem Blog
│       │   ├── 4.2.1.1. Xem danh sách bài viết blog
│       │   ├── 4.2.1.2. Xem chi tiết bài viết
│       │   ├── 4.2.1.3. Xem bài viết nổi bật
│       │   └── 4.2.1.4. Tìm kiếm blog theo tags
│       │
│       ├── 4.2.2. Tương Tác
│       │   ├── 4.2.2.1. Like bài viết
│       │   └── 4.2.2.2. Chia sẻ bài viết (Future)
│       │
│       └── 4.2.3. Quản Lý (Admin)
│           ├── 4.2.3.1. Tạo bài viết blog (Future)
│           ├── 4.2.3.2. Chỉnh sửa bài viết
│           ├── 4.2.3.3. Xóa bài viết
│           └── 4.2.3.4. Đánh dấu bài viết nổi bật
│
├── 5. THANH TOÁN
│   ├── 5.1. Tạo Payment
│   │   ├── 5.1.1. Tạo payment link (PayOS)
│   │   ├── 5.1.2. Tạo QR code (VietQR)
│   │   └── 5.1.3. Lưu thông tin payment
│   │
│   ├── 5.2. Xử Lý Thanh Toán
│   │   ├── 5.2.1. Thanh toán qua PayOS
│   │   ├── 5.2.2. Thanh toán qua VietQR
│   │   ├── 5.2.3. Xử lý callback từ payment gateway
│   │   └── 5.2.4. Cập nhật trạng thái thanh toán
│   │
│   ├── 5.3. Quản Lý Payment
│   │   ├── 5.3.1. Kiểm tra trạng thái thanh toán
│   │   ├── 5.3.2. Xem lịch sử thanh toán
│   │   └── 5.3.3. Quản lý tất cả payments (Admin)
│   │
│   └── 5.4. Hoàn Tiền (Future)
│       ├── 5.4.1. Yêu cầu hoàn tiền
│       └── 5.4.2. Xử lý hoàn tiền
│
├── 6. QUẢN TRỊ HỆ THỐNG (Admin Only)
│   ├── 6.1. Quản Lý Người Dùng
│   │   ├── 6.1.1. Xem danh sách users
│   │   │   ├── 6.1.1.1. Xem tất cả users
│   │   │   ├── 6.1.1.2. Tìm kiếm users
│   │   │   ├── 6.1.1.3. Lọc theo role
│   │   │   └── 6.1.1.4. Phân trang
│   │   │
│   │   ├── 6.1.2. Quản lý thông tin user
│   │   │   ├── 6.1.2.1. Xem chi tiết user
│   │   │   ├── 6.1.2.2. Cập nhật thông tin user
│   │   │   │   ├── 6.1.2.2.1. Thay đổi role
│   │   │   │   ├── 6.1.2.2.2. Cập nhật trạng thái (is_active)
│   │   │   │   └── 6.1.2.2.3. Xác minh tài khoản (is_verified)
│   │   │   │
│   │   │   ├── 6.1.2.3. Khóa/Mở khóa tài khoản
│   │   │   └── 6.1.2.4. Xóa user
│   │   │
│   │   └── 6.1.3. Thống kê users
│   │       ├── 6.1.3.1. Tổng số users
│   │       ├── 6.1.3.2. Số users theo role
│   │       ├── 6.1.3.3. Số users mới trong tháng
│   │       └── 6.1.3.4. Số users đang hoạt động
│   │
│   ├── 6.2. Quản Lý Nội Dung
│   │   ├── 6.2.1. Quản lý tài liệu
│   │   │   ├── 6.2.1.1. Xem tất cả tài liệu
│   │   │   ├── 6.2.1.2. Duyệt tài liệu (approve/reject)
│   │   │   ├── 6.2.1.3. Đánh dấu tài liệu nổi bật
│   │   │   └── 6.2.1.4. Xóa tài liệu vi phạm
│   │   │
│   │   ├── 6.2.2. Quản lý khóa học
│   │   │   ├── 6.2.2.1. Xem tất cả khóa học
│   │   │   ├── 6.2.2.2. Duyệt khóa học
│   │   │   ├── 6.2.2.3. Đánh dấu khóa học nổi bật
│   │   │   └── 6.2.2.4. Xóa khóa học vi phạm
│   │   │
│   │   └── 6.2.3. Quản lý Forum & Blog
│   │       ├── 6.2.3.1. Xem tất cả bài đăng
│   │       ├── 6.2.3.2. Xóa bài đăng vi phạm
│   │       ├── 6.2.3.3. Ẩn/Hiện bài đăng
│   │       └── 6.2.3.4. Quản lý categories
│   │
│   ├── 6.3. Thống Kê & Báo Cáo
│   │   ├── 6.3.1. Thống kê tổng quan
│   │   │   ├── 6.3.1.1. Tổng số users
│   │   │   ├── 6.3.1.2. Tổng số tài liệu
│   │   │   ├── 6.3.1.3. Tổng số khóa học
│   │   │   ├── 6.3.1.4. Tổng số bài đăng forum
│   │   │   └── 6.3.1.5. Tổng số bài viết blog
│   │   │
│   │   ├── 6.3.2. Thống kê theo thời gian
│   │   │   ├── 6.3.2.1. Thống kê theo ngày
│   │   │   ├── 6.3.2.2. Thống kê theo tháng
│   │   │   └── 6.3.2.3. Thống kê theo năm
│   │   │
│   │   ├── 6.3.3. Thống kê doanh thu (Future)
│   │   │   ├── 6.3.3.1. Doanh thu theo ngày
│   │   │   ├── 6.3.3.2. Doanh thu theo tháng
│   │   │   └── 6.3.3.3. Top khóa học bán chạy
│   │   │
│   │   └── 6.3.4. Export báo cáo (Future)
│   │       ├── 6.3.4.1. Export Excel
│   │       └── 6.3.4.2. Export PDF
│   │
│   └── 6.4. Cấu Hình Hệ Thống (Future)
│       ├── 6.4.1. Cấu hình settings
│       ├── 6.4.2. Quản lý categories
│       ├── 6.4.3. Quản lý tags
│       └── 6.4.4. Quản lý payment gateways
│
└── 7. TÌM KIẾM & LỌC NÂNG CAO
    ├── 7.1. Tìm Kiếm Tổng Hợp
    │   ├── 7.1.1. Tìm kiếm tài liệu
    │   ├── 7.1.2. Tìm kiếm khóa học
    │   ├── 7.1.3. Tìm kiếm trong forum
    │   └── 7.1.4. Tìm kiếm blog (Future)
    │
    ├── 7.2. Bộ Lọc Nâng Cao
    │   ├── 7.2.1. Lọc đa điều kiện
    │   ├── 7.2.2. Lọc theo khoảng thời gian
    │   └── 7.2.3. Lọc kết hợp nhiều tiêu chí
    │
    └── 7.3. Sắp Xếp & Hiển Thị
        ├── 7.3.1. Sắp xếp đa tiêu chí
        ├── 7.3.2. Pagination
        └── 7.3.3. View mode (Grid/List)
```

---

## Mô Tả Chi Tiết Theo Module

### 1. XÁC THỰC & QUẢN LÝ TÀI KHOẢN

**Module này bao gồm:**
- Đăng ký và đăng nhập người dùng
- Quản lý thông tin cá nhân
- Upload và quản lý avatar/cover
- Các chức năng bảo mật

**Số lượng chức năng:** 20+ chức năng chi tiết

### 2. QUẢN LÝ TÀI LIỆU

**Module này bao gồm:**
- Xem, tìm kiếm, lọc tài liệu
- Download và preview
- Bookmark và bộ sưu tập
- Đánh giá và nhận xét
- Upload và quản lý (Instructor/Admin)

**Số lượng chức năng:** 40+ chức năng chi tiết

### 3. QUẢN LÝ KHÓA HỌC

**Module này bao gồm:**
- Xem, tìm kiếm khóa học
- Đăng ký và thanh toán
- Học tập và theo dõi tiến độ
- Tạo và quản lý khóa học (Instructor/Admin)

**Số lượng chức năng:** 50+ chức năng chi tiết

### 4. FORUM & BLOG

**Module này bao gồm:**
- Đăng bài, comment, like
- Quản lý bài đăng
- Tìm kiếm và lọc

**Số lượng chức năng:** 20+ chức năng chi tiết

### 5. THANH TOÁN

**Module này bao gồm:**
- Tạo payment link
- Xử lý thanh toán
- Quản lý payment

**Số lượng chức năng:** 10+ chức năng chi tiết

### 6. QUẢN TRỊ HỆ THỐNG

**Module này bao gồm:**
- Quản lý users
- Quản lý nội dung
- Thống kê và báo cáo
- Cấu hình hệ thống

**Số lượng chức năng:** 30+ chức năng chi tiết (Admin only)

### 7. TÌM KIẾM & LỌC NÂNG CAO

**Module này bao gồm:**
- Tìm kiếm tổng hợp
- Bộ lọc nâng cao
- Sắp xếp và hiển thị

**Số lượng chức năng:** 10+ chức năng chi tiết

---

## Phân Quyền Theo Vai Trò

### Student (Học Viên)

**Có thể sử dụng:**
- ✅ 1.1, 1.2, 1.3 (Xác thực & Profile)
- ✅ 2.1, 2.2, 2.3, 2.4 (Xem, Download, Bookmark, Đánh giá Tài liệu)
- ✅ 3.1, 3.2, 3.3 (Xem, Đăng ký, Học tập Khóa học)
- ✅ 4.1, 4.2 (Xem và tương tác Forum & Blog)
- ✅ 5.1, 5.2, 5.3 (Thanh toán)
- ✅ 7.1, 7.2, 7.3 (Tìm kiếm & Lọc)

**Tổng số chức năng:** ~140 chức năng chi tiết

### Instructor (Giảng Viên)

**Có thể sử dụng:**
- ✅ Tất cả chức năng của Student
- ✅ 2.5 (Upload & Quản lý Tài liệu)
- ✅ 3.4 (Tạo & Quản lý Khóa học)
- ✅ 4.1.4 (Quản lý bài đăng của mình)

**Tổng số chức năng:** ~180 chức năng chi tiết

### Admin (Quản Trị Viên)

**Có thể sử dụng:**
- ✅ Tất cả chức năng của Student và Instructor
- ✅ 6.1, 6.2, 6.3, 6.4 (Quản trị hệ thống)
- ✅ 2.5.3 (Quản lý tất cả tài liệu)
- ✅ 3.4.3 (Quản lý tất cả khóa học)
- ✅ 4.1.4.3, 4.2.3 (Quản lý Forum & Blog)
- ✅ 5.3.3 (Quản lý tất cả payments)

**Tổng số chức năng:** ~210 chức năng chi tiết

### Guest (Khách)

**Có thể sử dụng:**
- ✅ 2.1.1.1, 2.1.5 (Xem tài liệu - Read-only)
- ✅ 3.1.1.1, 3.1.5 (Xem khóa học - Read-only)
- ✅ 4.1.1 (Xem Forum - Read-only)
- ✅ 4.2.1 (Xem Blog - Read-only)
- ✅ 7.1 (Tìm kiếm)

**Tổng số chức năng:** ~30 chức năng (Read-only)

---

## Thống Kê Tổng Quan

### Tổng Số Chức Năng

| Cấp | Số Lượng | Mô Tả |
|-----|----------|-------|
| **Cấp 0** | 1 | Hệ thống tổng thể |
| **Cấp 1** | 7 | Modules chính |
| **Cấp 2** | 35+ | Nhóm chức năng |
| **Cấp 3** | 210+ | Chức năng chi tiết |

### Phân Bố Theo Module

| Module | Số Chức Năng Chi Tiết | Tỷ Lệ |
|--------|----------------------|-------|
| **Quản Lý Khóa Học** | 50+ | ~24% |
| **Quản Lý Tài Liệu** | 40+ | ~19% |
| **Quản Trị Hệ Thống** | 30+ | ~14% |
| **Xác Thực & Tài Khoản** | 20+ | ~10% |
| **Forum & Blog** | 20+ | ~10% |
| **Thanh Toán** | 10+ | ~5% |
| **Tìm Kiếm & Lọc** | 10+ | ~5% |
| **Các chức năng khác** | 30+ | ~14% |

### Phân Bố Theo Vai Trò

| Vai Trò | Số Chức Năng Có Thể Sử Dụng | Tỷ Lệ |
|---------|---------------------------|-------|
| **Admin** | 210+ | 100% |
| **Instructor** | 180+ | ~86% |
| **Student** | 140+ | ~67% |
| **Guest** | 30+ | ~14% |

---

## Ký Hiệu Sử Dụng

- **├──**: Nhánh có nhánh con tiếp theo
- **│**: Đường thẳng để nối các cấp
- **└──**: Nhánh cuối cùng
- **(Future)**: Chức năng sẽ được phát triển trong tương lai
- **(Instructor/Admin)**: Chỉ dành cho Instructor và Admin
- **(Admin Only)**: Chỉ dành cho Admin

---

## Lưu Ý

1. **Cấu trúc phân cấp** có thể mở rộng khi thêm tính năng mới
2. **Phân quyền** được kiểm soát ở cả frontend và backend
3. **Các chức năng Future** sẽ được implement trong các phiên bản tiếp theo
4. **Số lượng chức năng** là ước tính và có thể thay đổi theo thực tế

---

**Tài liệu được cập nhật lần cuối: 2024-01-15**

**Tác giả**: OpenLearnFoundation Team


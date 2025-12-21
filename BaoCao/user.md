# 👥 Chức Năng Người Dùng - OpenLearnFoundation

## 📋 Mục Lục

1. [Tổng Quan Vai Trò Người Dùng](#tổng-quan-vai-trò-người-dùng)
2. [Student (Học Viên)](#student-học-viên)
3. [Instructor (Giảng Viên)](#instructor-giảng-viên)
4. [Admin (Quản Trị Viên)](#admin-quản-trị-viên)
5. [Guest (Khách)](#guest-khách)
6. [So Sánh Quyền Truy Cập](#so-sánh-quyền-truy-cập)
7. [Tổng Kết](#tổng-kết)

---

## Tổng Quan Vai Trò Người Dùng

OpenLearnFoundation hỗ trợ **3 vai trò chính** với các quyền và chức năng khác nhau:

| Vai Trò | Mô Tả | Quyền Hạn |
|---------|-------|-----------|
| **Student** | Học viên | Xem, tải tài liệu, đăng ký khóa học, đánh giá |
| **Instructor** | Giảng viên | Tất cả quyền của Student + Tạo khóa học, upload tài liệu |
| **Admin** | Quản trị viên | Tất cả quyền + Quản lý hệ thống, users, nội dung |

---

## Student (Học Viên)

### 📚 Chức Năng Quản Lý Tài Liệu

#### 1. Xem & Tìm Kiếm Tài Liệu

**Chức năng:**
- ✅ Xem danh sách tài liệu công khai
- ✅ Tìm kiếm tài liệu theo từ khóa
- ✅ Lọc tài liệu theo:
  - Môn học/Chương trình
  - Loại file (PDF, PPTX, DOCX, ZIP)
  - Cấp độ (THPT, Đại học, Sau đại học)
  - Năm học
  - Ngôn ngữ
  - Tags
  - Tác giả
- ✅ Sắp xếp theo: Mới nhất, Phổ biến, Đánh giá cao, Lượt tải
- ✅ Xem chi tiết tài liệu:
  - Thông tin đầy đủ (title, description, author, tags)
  - Đánh giá và nhận xét
  - Thống kê (downloads, views, rating)
  - License information

**API Endpoints:**
- `GET /api/documents` - Danh sách tài liệu
- `GET /api/documents/search` - Tìm kiếm tài liệu
- `GET /api/documents/:id` - Chi tiết tài liệu

#### 2. Download & Preview Tài Liệu

**Chức năng:**
- ✅ Tải xuống tài liệu
- ✅ Xem trước tài liệu (PDF viewer)
- ✅ Theo dõi lượt tải (downloads counter)

**API Endpoints:**
- `GET /api/documents/:id/download` - Download tài liệu

#### 3. Bookmark & Quản Lý Bộ Sưu Tập

**Chức năng:**
- ✅ Lưu tài liệu vào bookmark
- ✅ Xem danh sách tài liệu đã lưu
- ✅ Bỏ lưu tài liệu
- ✅ Quản lý bộ sưu tập cá nhân

**API Endpoints:**
- `POST /api/documents/:id/bookmark` - Lưu tài liệu
- `GET /api/documents/bookmarked` - Danh sách đã lưu
- `DELETE /api/documents/:id/bookmark` - Bỏ lưu

#### 4. Đánh Giá & Nhận Xét

**Chức năng:**
- ✅ Đánh giá tài liệu (1-5 sao)
- ✅ Viết nhận xét về tài liệu
- ✅ Xem đánh giá của người dùng khác
- ✅ Bình chọn nhận xét hữu ích

**API Endpoints:**
- `POST /api/rating` - Tạo đánh giá
- `GET /api/rating/:documentId` - Xem đánh giá

### 🎓 Chức Năng Quản Lý Khóa Học

#### 1. Xem & Tìm Kiếm Khóa Học

**Chức năng:**
- ✅ Xem danh sách khóa học công khai
- ✅ Tìm kiếm khóa học theo từ khóa
- ✅ Lọc khóa học theo:
  - Danh mục
  - Cấp độ (Beginner, Intermediate, Advanced, Expert)
  - Miễn phí/Có phí
  - Giảng viên
- ✅ Sắp xếp theo: Mới nhất, Phổ biến, Đánh giá cao
- ✅ Xem chi tiết khóa học:
  - Mô tả đầy đủ
  - Nội dung sẽ học
  - Yêu cầu tiên quyết
  - Thông tin giảng viên
  - Modules và Lessons
  - Đánh giá và reviews

**API Endpoints:**
- `GET /api/courses` - Danh sách khóa học
- `GET /api/courses/search` - Tìm kiếm khóa học
- `GET /api/courses/:id` - Chi tiết khóa học

#### 2. Đăng Ký Khóa Học

**Chức năng:**
- ✅ Đăng ký khóa học miễn phí
- ✅ Đăng ký khóa học có phí (sau khi thanh toán)
- ✅ Xem trạng thái đăng ký
- ✅ Xem danh sách khóa học đã đăng ký

**API Endpoints:**
- `POST /api/courses/:id/enroll` - Đăng ký khóa học
- `GET /api/courses/:id/enrollment` - Trạng thái đăng ký
- `GET /api/courses/my-courses` - Khóa học của tôi

#### 3. Học Tập & Theo Dõi Tiến Độ

**Chức năng:**
- ✅ Xem nội dung khóa học (sau khi đăng ký)
- ✅ Xem video bài giảng
- ✅ Đánh dấu bài học đã hoàn thành
- ✅ Xem tiến độ học tập (% hoàn thành)
- ✅ Theo dõi bài học cuối cùng đã xem
- ✅ Nhận chứng chỉ khi hoàn thành (future)

**API Endpoints:**
- `GET /api/courses/:id/content` - Nội dung khóa học
- `POST /api/courses/:id/lessons/:lessonId/complete` - Hoàn thành bài học
- `GET /api/courses/:id/progress` - Tiến độ học tập

#### 4. Thanh Toán Khóa Học

**Chức năng:**
- ✅ Xem giá khóa học
- ✅ Thanh toán qua PayOS
- ✅ Thanh toán qua VietQR
- ✅ Theo dõi trạng thái thanh toán
- ✅ Xem lịch sử thanh toán

**API Endpoints:**
- `POST /api/payments/create` - Tạo payment link
- `GET /api/payments/:payment_id/status` - Trạng thái thanh toán

### 💬 Chức Năng Forum & Blog

#### 1. Forum (Diễn Đàn)

**Chức năng:**
- ✅ Xem danh sách bài đăng
- ✅ Đăng bài trong forum
- ✅ Comment trên bài đăng
- ✅ Like/Unlike bài đăng
- ✅ Upvote/Downvote câu trả lời
- ✅ Tìm kiếm trong forum
- ✅ Lọc theo danh mục

**API Endpoints:**
- `GET /api/forum/posts` - Danh sách bài đăng
- `POST /api/forum/posts` - Tạo bài đăng
- `GET /api/forum/posts/:id` - Chi tiết bài đăng
- `POST /api/forum/posts/:id/comments` - Comment
- `POST /api/forum/posts/:id/like` - Like bài đăng

#### 2. Blog

**Chức năng:**
- ✅ Xem danh sách bài viết blog
- ✅ Xem chi tiết bài viết
- ✅ Tìm kiếm blog theo tags
- ✅ Xem bài viết nổi bật
- ✅ Like bài viết

**API Endpoints:**
- `GET /api/blog/posts` - Danh sách blog
- `GET /api/blog/posts/:id` - Chi tiết blog
- `GET /api/blog/featured` - Bài viết nổi bật

### 👤 Chức Năng Quản Lý Tài Khoản

#### 1. Đăng Ký & Đăng Nhập

**Chức năng:**
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập vào hệ thống
- ✅ Đăng xuất
- ✅ Quên mật khẩu (future)
- ✅ Xác thực email (future)

**API Endpoints:**
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

#### 2. Quản Lý Profile

**Chức năng:**
- ✅ Xem thông tin cá nhân
- ✅ Cập nhật thông tin:
  - Họ tên
  - Số điện thoại
  - Địa chỉ
  - Giới tính
  - Tiểu sử (bio)
  - Trường đại học
  - Chuyên ngành
- ✅ Upload avatar
- ✅ Upload cover image
- ✅ Xem thống kê cá nhân:
  - Số tài liệu đã lưu
  - Số khóa học đã đăng ký
  - Điểm uy tín (reputation score)
  - Số đóng góp

**API Endpoints:**
- `GET /api/auth/profile` - Thông tin profile
- `PUT /api/auth/profile` - Cập nhật profile
- `POST /api/auth/profile/avatar` - Upload avatar
- `POST /api/auth/profile/cover` - Upload cover

#### 3. Cài Đặt Bảo Mật

**Chức năng:**
- ✅ Thay đổi mật khẩu (future)
- ✅ Xem lịch sử đăng nhập (future)
- ✅ Quản lý thiết bị đã đăng nhập (future)

### 📊 Thống Kê Cá Nhân

**Chức năng:**
- ✅ Xem số tài liệu đã tải
- ✅ Xem số khóa học đã đăng ký
- ✅ Xem số bài đăng trong forum
- ✅ Xem điểm uy tín
- ✅ Xem lịch sử hoạt động (future)

---

## Instructor (Giảng Viên)

**Instructor có tất cả quyền của Student + các quyền bổ sung sau:**

### 📚 Chức Năng Upload & Quản Lý Tài Liệu

#### 1. Upload Tài Liệu

**Chức năng:**
- ✅ Upload tài liệu mới (PDF, PPTX, DOCX, ZIP)
- ✅ Upload thumbnail cho tài liệu
- ✅ Nhập metadata đầy đủ:
  - Tiêu đề
  - Mô tả
  - Tác giả
  - Môn học/Chương trình
  - Mã học phần
  - Tags
  - Ngôn ngữ
  - Năm học
  - License
  - Visibility (Public/Private)
- ✅ Quản lý tài liệu đã upload:
  - Xem danh sách
  - Chỉnh sửa
  - Xóa
  - Xem thống kê (views, downloads)

**API Endpoints:**
- `POST /api/documents/upload` - Upload tài liệu
- `GET /api/documents/my-documents` - Tài liệu của tôi
- `PUT /api/documents/:id` - Cập nhật tài liệu
- `DELETE /api/documents/:id` - Xóa tài liệu

**Yêu cầu:**
- Role: `instructor` hoặc `admin`
- Phải đăng nhập

### 🎓 Chức Năng Tạo & Quản Lý Khóa Học

#### 1. Tạo Khóa Học

**Chức năng:**
- ✅ Tạo khóa học mới
- ✅ Thiết lập thông tin khóa học:
  - Tiêu đề, phụ đề, mô tả
  - Danh mục, cấp độ
  - Thumbnail
  - Pricing (Miễn phí/Có phí, giá)
  - Tags
  - Nội dung sẽ học (What you'll learn)
  - Yêu cầu tiên quyết
  - Đối tượng mục tiêu
- ✅ Tạo Modules và Lessons:
  - Thêm nhiều modules
  - Thêm nhiều lessons vào mỗi module
  - Upload video cho mỗi lesson
  - Thiết lập thời lượng
  - Đánh dấu lesson preview
- ✅ Lưu bản nháp hoặc publish ngay

**API Endpoints:**
- `POST /api/courses` - Tạo khóa học
- `PUT /api/courses/:id` - Cập nhật khóa học

**Yêu cầu:**
- Role: `instructor` hoặc `admin`
- Phải đăng nhập

#### 2. Quản Lý Khóa Học Của Tôi

**Chức năng:**
- ✅ Xem danh sách khóa học đã tạo
- ✅ Chỉnh sửa khóa học:
  - Cập nhật thông tin
  - Thêm/sửa/xóa modules và lessons
  - Cập nhật pricing
- ✅ Xóa khóa học
- ✅ Xem thống kê khóa học:
  - Số học viên đã đăng ký
  - Đánh giá trung bình
  - Số reviews
  - Doanh thu (nếu có phí)
- ✅ Quản lý học viên:
  - Xem danh sách học viên
  - Xem tiến độ học tập của học viên (future)

**API Endpoints:**
- `GET /api/courses/my-courses` - Khóa học của tôi
- `GET /api/courses/my-courses/:id` - Chi tiết khóa học của tôi
- `PUT /api/courses/:id` - Cập nhật khóa học
- `DELETE /api/courses/:id` - Xóa khóa học
- `GET /api/courses/:id/enrollments` - Danh sách học viên (future)

### 👤 Chức Năng Quản Lý Profile Nâng Cao

**Chức năng:**
- ✅ Tất cả chức năng của Student
- ✅ Hiển thị thông tin giảng viên:
  - Verified badge (nếu được xác minh)
  - Số khóa học đã tạo
  - Số học viên
  - Đánh giá trung bình
  - Tổng doanh thu (future)
- ✅ Quản lý portfolio giảng viên (future)

### 📊 Thống Kê Giảng Viên

**Chức năng:**
- ✅ Xem số khóa học đã tạo
- ✅ Xem số học viên
- ✅ Xem số tài liệu đã upload
- ✅ Xem đánh giá và reviews
- ✅ Xem doanh thu (future)

---

## Admin (Quản Trị Viên)

**Admin có tất cả quyền của Student và Instructor + các quyền quản trị sau:**

### 👥 Chức Năng Quản Lý Người Dùng

#### 1. Xem Danh Sách Người Dùng

**Chức năng:**
- ✅ Xem danh sách tất cả users
- ✅ Tìm kiếm users
- ✅ Lọc theo role (student, instructor, admin)
- ✅ Phân trang
- ✅ Sắp xếp theo nhiều tiêu chí

**API Endpoints:**
- `GET /api/admin/users` - Danh sách users
- `GET /api/admin/users?search=keyword` - Tìm kiếm
- `GET /api/admin/users?role=student` - Lọc theo role

#### 2. Quản Lý Thông Tin Người Dùng

**Chức năng:**
- ✅ Xem chi tiết user
- ✅ Cập nhật thông tin user:
  - Role (student/instructor/admin)
  - Trạng thái (is_active)
  - Xác minh (is_verified)
  - Các thông tin khác
- ✅ Khóa/Mở khóa tài khoản
- ✅ Xóa user (soft delete hoặc hard delete)

**API Endpoints:**
- `GET /api/admin/users/:id` - Chi tiết user
- `PUT /api/admin/users/:id` - Cập nhật user
- `DELETE /api/admin/users/:id` - Xóa user

**Yêu cầu:**
- Role: `admin`
- JWT token hợp lệ

#### 3. Thống Kê Người Dùng

**Chức năng:**
- ✅ Xem tổng số users
- ✅ Xem số users theo role
- ✅ Xem số users mới trong tháng
- ✅ Xem số users đang hoạt động

### 📄 Chức Năng Quản Lý Nội Dung

#### 1. Quản Lý Tài Liệu

**Chức năng:**
- ✅ Xem tất cả tài liệu (bao gồm private)
- ✅ Duyệt tài liệu (approve/reject)
- ✅ Xóa tài liệu vi phạm
- ✅ Đánh dấu tài liệu nổi bật (featured)
- ✅ Quản lý categories và tags

**API Endpoints (Future):**
- `GET /api/admin/documents` - Tất cả tài liệu
- `PUT /api/admin/documents/:id/approve` - Duyệt tài liệu
- `PUT /api/admin/documents/:id/feature` - Đánh dấu nổi bật
- `DELETE /api/admin/documents/:id` - Xóa tài liệu

#### 2. Quản Lý Khóa Học

**Chức năng:**
- ✅ Xem tất cả khóa học (bao gồm draft)
- ✅ Duyệt khóa học
- ✅ Xóa khóa học vi phạm
- ✅ Đánh dấu khóa học nổi bật
- ✅ Quản lý categories

**API Endpoints (Future):**
- `GET /api/admin/courses` - Tất cả khóa học
- `PUT /api/admin/courses/:id/approve` - Duyệt khóa học
- `DELETE /api/admin/courses/:id` - Xóa khóa học

#### 3. Quản Lý Forum & Blog

**Chức năng:**
- ✅ Xem tất cả bài đăng
- ✅ Xóa bài đăng vi phạm
- ✅ Ẩn/Hiện bài đăng
- ✅ Quản lý categories

**API Endpoints (Future):**
- `GET /api/admin/posts` - Tất cả bài đăng
- `DELETE /api/admin/posts/:id` - Xóa bài đăng
- `PUT /api/admin/posts/:id/hide` - Ẩn bài đăng

### 📊 Chức Năng Thống Kê & Báo Cáo

#### 1. Thống Kê Tổng Quan

**Chức năng:**
- ✅ Thống kê tổng quan hệ thống:
  - Tổng số users
  - Tổng số tài liệu
  - Tổng số khóa học
  - Tổng số bài đăng forum
  - Tổng số bài viết blog
- ✅ Thống kê theo thời gian (daily, monthly, yearly)
- ✅ Thống kê doanh thu (future)

**API Endpoints:**
- `GET /api/admin/stats` - Thống kê tổng quan
- `GET /api/admin/stats/users` - Thống kê users
- `GET /api/admin/stats/documents` - Thống kê tài liệu
- `GET /api/admin/stats/courses` - Thống kê khóa học

#### 2. Báo Cáo & Analytics

**Chức năng:**
- ✅ Xem báo cáo chi tiết
- ✅ Export báo cáo (future)
- ✅ Analytics dashboard (future)

### ⚙️ Chức Năng Quản Lý Hệ Thống

#### 1. Cấu Hình Hệ Thống

**Chức năng:**
- ✅ Cấu hình settings (future)
- ✅ Quản lý categories (future)
- ✅ Quản lý tags (future)

#### 2. Quản Lý Thanh Toán

**Chức năng:**
- ✅ Xem tất cả giao dịch thanh toán
- ✅ Xem chi tiết payment
- ✅ Hoàn tiền (future)
- ✅ Export báo cáo thanh toán (future)

**API Endpoints (Future):**
- `GET /api/admin/payments` - Tất cả payments
- `GET /api/admin/payments/:id` - Chi tiết payment

---

## Guest (Khách)

**Người dùng chưa đăng nhập có thể:**

### 👀 Chức Năng Xem (Read-Only)

#### 1. Xem Tài Liệu

**Chức năng:**
- ✅ Xem danh sách tài liệu công khai
- ✅ Tìm kiếm tài liệu
- ✅ Xem chi tiết tài liệu
- ✅ Xem đánh giá và nhận xét
- ❌ **KHÔNG thể** download (yêu cầu đăng nhập)
- ❌ **KHÔNG thể** đánh giá

#### 2. Xem Khóa Học

**Chức năng:**
- ✅ Xem danh sách khóa học công khai
- ✅ Xem chi tiết khóa học
- ✅ Xem preview lessons (nếu có)
- ❌ **KHÔNG thể** đăng ký
- ❌ **KHÔNG thể** xem nội dung đầy đủ

#### 3. Xem Forum & Blog

**Chức năng:**
- ✅ Xem bài đăng trong forum
- ✅ Xem bài viết blog
- ❌ **KHÔNG thể** đăng bài
- ❌ **KHÔNG thể** comment

### 🔐 Yêu Cầu Đăng Nhập

**Các chức năng yêu cầu đăng nhập:**
- Download tài liệu
- Đăng ký khóa học
- Đánh giá và nhận xét
- Upload tài liệu
- Tạo khóa học
- Đăng bài trong forum
- Quản lý profile

---

## So Sánh Quyền Truy Cập

### Bảng So Sánh Chi Tiết

| Chức Năng | Guest | Student | Instructor | Admin |
|-----------|-------|---------|------------|-------|
| **Xem tài liệu** | ✅ | ✅ | ✅ | ✅ |
| **Tìm kiếm tài liệu** | ✅ | ✅ | ✅ | ✅ |
| **Download tài liệu** | ❌ | ✅ | ✅ | ✅ |
| **Upload tài liệu** | ❌ | ❌ | ✅ | ✅ |
| **Bookmark tài liệu** | ❌ | ✅ | ✅ | ✅ |
| **Đánh giá tài liệu** | ❌ | ✅ | ✅ | ✅ |
| **Xem khóa học** | ✅ | ✅ | ✅ | ✅ |
| **Đăng ký khóa học** | ❌ | ✅ | ✅ | ✅ |
| **Xem nội dung khóa học** | ❌ (chỉ preview) | ✅ | ✅ | ✅ |
| **Tạo khóa học** | ❌ | ❌ | ✅ | ✅ |
| **Quản lý khóa học** | ❌ | ❌ | ✅ (của mình) | ✅ (tất cả) |
| **Xem forum/blog** | ✅ | ✅ | ✅ | ✅ |
| **Đăng bài forum** | ❌ | ✅ | ✅ | ✅ |
| **Comment/Like** | ❌ | ✅ | ✅ | ✅ |
| **Quản lý profile** | ❌ | ✅ | ✅ | ✅ |
| **Quản lý users** | ❌ | ❌ | ❌ | ✅ |
| **Quản lý nội dung** | ❌ | ❌ | ❌ | ✅ |
| **Xem thống kê** | ❌ | ✅ (cá nhân) | ✅ (của mình) | ✅ (tất cả) |
| **Duyệt nội dung** | ❌ | ❌ | ❌ | ✅ |
| **Khóa/Mở khóa tài khoản** | ❌ | ❌ | ❌ | ✅ |

### Luồng Nâng Cấp Quyền

```
Guest → Đăng ký → Student → Yêu cầu → Instructor → Admin (chỉ admin có thể cấp)
```

**Lưu ý:**
- Guest có thể đăng ký thành Student
- Student có thể yêu cầu nâng cấp lên Instructor (cần admin phê duyệt)
- Admin được tạo trực tiếp hoặc nâng cấp từ Instructor (bởi admin khác)

---

## Tổng Kết

### Student (Học Viên)

**Chức năng chính:**
- ✅ Tìm kiếm, xem, tải tài liệu
- ✅ Đánh giá và bookmark tài liệu
- ✅ Đăng ký và học khóa học
- ✅ Tham gia forum và blog
- ✅ Quản lý profile cá nhân

**Số lượng chức năng:** ~25 chức năng chính

### Instructor (Giảng Viên)

**Chức năng chính:**
- ✅ Tất cả chức năng của Student
- ✅ Upload và quản lý tài liệu
- ✅ Tạo và quản lý khóa học
- ✅ Xem thống kê giảng viên

**Số lượng chức năng:** ~35 chức năng chính

### Admin (Quản Trị Viên)

**Chức năng chính:**
- ✅ Tất cả chức năng của Student và Instructor
- ✅ Quản lý users (xem, sửa, xóa, khóa/mở khóa)
- ✅ Quản lý nội dung (duyệt, xóa, featured)
- ✅ Xem thống kê tổng quan hệ thống
- ✅ Quản lý thanh toán

**Số lượng chức năng:** ~50+ chức năng chính

### Guest (Khách)

**Chức năng chính:**
- ✅ Xem tài liệu và khóa học (read-only)
- ✅ Tìm kiếm
- ❌ Tất cả chức năng khác yêu cầu đăng nhập

**Số lượng chức năng:** ~5 chức năng (read-only)

---

## API Endpoints Theo Role

### Public Endpoints (Không cần đăng nhập)

```
GET /api/documents
GET /api/documents/search
GET /api/documents/:id
GET /api/courses
GET /api/courses/search
GET /api/courses/:id
GET /api/blog/posts
GET /api/blog/posts/:id
GET /api/forum/posts
GET /api/forum/posts/:id
POST /api/auth/register
POST /api/auth/login
```

### Student Endpoints (Cần đăng nhập)

```
GET /api/documents/:id/download
POST /api/documents/:id/bookmark
GET /api/documents/bookmarked
POST /api/rating
GET /api/courses/:id/enroll
GET /api/courses/my-courses
POST /api/courses/:id/lessons/:lessonId/complete
POST /api/payments/create
GET /api/auth/profile
PUT /api/auth/profile
POST /api/auth/profile/avatar
POST /api/forum/posts
POST /api/forum/posts/:id/comments
```

### Instructor Endpoints (Cần role: instructor)

```
POST /api/documents/upload
GET /api/documents/my-documents
PUT /api/documents/:id
DELETE /api/documents/:id
POST /api/courses
PUT /api/courses/:id
GET /api/courses/my-courses
```

### Admin Endpoints (Cần role: admin)

```
GET /api/admin/users
GET /api/admin/users/:id
PUT /api/admin/users/:id
DELETE /api/admin/users/:id
GET /api/admin/stats
GET /api/admin/documents (future)
GET /api/admin/courses (future)
GET /api/admin/payments (future)
```

---

**Tài liệu được cập nhật lần cuối: 2024-01-15**

**Tác giả**: OpenLearnFoundation Team


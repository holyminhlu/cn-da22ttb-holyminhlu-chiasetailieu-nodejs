# 🎓 EduShare - Nền Tảng Chia Sẻ Tri Thức

<div align="center">

![EduShare Logo](client/olf/public/img/logo.png)

**Learn & Share Together**

[![Vue.js](https://img.shields.io/badge/Vue.js-3.2-4FC08D?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Giới Thiệu

**EduShare** là nền tảng chia sẻ tài liệu và học tập trực tuyến, nơi kết nối học sinh, sinh viên và giảng viên trong việc chia sẻ tri thức. Dự án được phát triển bởi nhóm sinh viên DA22TTB - Trường Kỹ thuật và Công nghệ, Đại học Trà Vinh.

### ✨ Tính Năng Chính

- 📚 **Kho Tài Liệu Phong Phú**: Hàng ngàn tài liệu PDF, PPT, Video từ nhiều môn học
- 🔍 **Tìm Kiếm Thông Minh**: Lọc theo môn học, loại tài liệu, cấp độ
- 📈 **Tài Liệu Xu Hướng**: Theo dõi tài liệu hot nhất
- 🎓 **Khóa Học Trực Tuyến**: Học tập có hệ thống với các khóa học được thiết kế bài bản
- 💬 **Cộng Đồng Năng Động**: Diễn đàn thảo luận, hỏi đáp
- 🏆 **Top Contributors**: Ghi nhận những người đóng góp xuất sắc
- 📊 **Thống Kê Chi Tiết**: Theo dõi lượt xem, tải xuống, đánh giá
- 👤 **Quản Lý Cá Nhân**: Profile, lịch sử học tập, tài liệu đã tải

---

## 🏗️ Kiến Trúc

### Frontend (Vue.js 3)
```
client/olf/
├── src/
│   ├── views/
│   │   ├── HomeView.vue          # Trang chủ
│   │   ├── SignInView.vue        # Đăng nhập
│   │   ├── SignUpView.vue        # Đăng ký
│   │   ├── TourThuong.vue        # Tài liệu
│   │   ├── TourTheoDoan.vue      # Khóa học
│   │   ├── UserInfoView.vue      # Thông tin cá nhân
│   │   └── ...
│   ├── components/
│   │   ├── HeaderComponent.vue   # Header
│   │   ├── FooterComponent.vue   # Footer
│   │   └── DocumentCard.vue      # Card tài liệu
│   └── routes/
│       └── index.js              # Routing
```

### Backend (Microservices Architecture)
```
server/
├── api-gateway/         # Port 3000 - API Gateway
├── auth-service/        # Port 3001 - Xác thực
├── tours-service/       # Port 3002 - Tài liệu (cần đổi tên)
├── booking-service/     # Port 3004 - Đăng ký khóa học
├── discounts-service/   # Port 3005 - Ưu đãi
└── rating-service/      # Port 3006 - Đánh giá
```

---

## 🚀 Cài Đặt & Chạy

### Yêu Cầu Hệ Thống
- Node.js >= 14.x
- npm >= 6.x
- MongoDB Atlas account (hoặc local MongoDB)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/edushare.git
cd edushare
```

### 2. Cài Đặt Frontend
```bash
cd client/olf
npm install
```

### 3. Cài Đặt Backend
```bash
cd server

# Cài đặt cho API Gateway
cd api-gateway && npm install && cd ..

# Cài đặt cho từng service
cd auth-service && npm install && cd ..
cd tours-service && npm install && cd ..
cd booking-service && npm install && cd ..
cd discounts-service && npm install && cd ..
cd rating-service && npm install && cd ..
```

### 4. Chạy Ứng Dụng

#### Frontend
```bash
cd client/olf
npm run serve
```
➡️ Truy cập: http://localhost:8080

#### Backend
```bash
cd server/booking-service
node start-all-services.js
```
➡️ API Gateway: http://localhost:3000

---

## 📱 Giao Diện

### Trang Chủ
- Hero section với search bar
- Danh mục học tập (8 categories)
- Tài liệu xu hướng
- Top contributors
- Cộng đồng thảo luận
- Thống kê tổng quan

### Header
- Logo EduShare
- Navigation: Trang chủ | Tài liệu | Khóa học | Diễn đàn | Blog
- Search button
- User authentication (Đăng nhập/Đăng ký hoặc Avatar)

### Footer
- Thông tin liên hệ
- Quick links
- Support links
- Social media
- Newsletter signup

---

## 🎨 Thiết Kế

### Color Palette
- **Primary**: `#4f46e5` (Indigo)
- **Secondary**: `#10b981` (Green)
- **Background**: `#f8fafc` (Light Gray)
- **Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

### Typography
- **Font Family**: System fonts (San Francisco, Segoe UI, Roboto)
- **Font Sizes**: 0.75rem - 3.5rem
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)

---

## 📊 Database Schema

### Documents Collection
```javascript
{
  document_id: String,      // Unique ID
  title: String,            // Tiêu đề
  subject: String,          // Môn học
  type: String,             // PDF, Video, PPT...
  level: String,            // THPT, Đại học...
  author: String,           // Tác giả
  upload_date: Date,        // Ngày tải lên
  file_url: String,         // Link file
  thumbnail_url: String,    // Link thumbnail
  downloads: Number,        // Lượt tải
  rating: Number,           // Đánh giá
  description: String,      // Mô tả
  tags: [String],          // Tags
  file_size: Number        // Kích thước file
}
```

### Users Collection
```javascript
{
  user_id: String,
  fullName: String,
  email: String,
  password: String,         // Hashed
  avatar_url: String,
  bio: String,
  uploaded_documents: [String],
  enrolled_courses: [String],
  contributions: Number,
  reputation_score: Number,
  created_at: Date
}
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin profile
- `PUT /api/auth/profile` - Cập nhật profile

### Documents
- `GET /api/documents` - Lấy danh sách tài liệu
- `GET /api/documents/:id` - Lấy chi tiết tài liệu
- `POST /api/documents` - Upload tài liệu mới
- `PUT /api/documents/:id` - Cập nhật tài liệu
- `DELETE /api/documents/:id` - Xóa tài liệu
- `GET /api/documents/search` - Tìm kiếm tài liệu

### Courses
- `GET /api/courses` - Lấy danh sách khóa học
- `GET /api/courses/:id` - Lấy chi tiết khóa học
- `POST /api/courses/enroll` - Đăng ký khóa học

### Ratings
- `POST /api/ratings` - Đánh giá tài liệu
- `GET /api/ratings/:documentId` - Lấy đánh giá

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router 4** - Official router
- **Bootstrap 5** - CSS framework
- **AOS** - Animate on scroll
- **GSAP** - Animation library
- **Swiper** - Touch slider
- **SweetAlert2** - Beautiful alerts
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **CORS** - Cross-origin resource sharing

---

## 📈 Roadmap

### Phase 1: Core Features (Hiện tại)
- [x] Giao diện trang chủ
- [x] Header & Footer
- [x] Routing cơ bản
- [ ] Upload tài liệu
- [ ] Download tài liệu
- [ ] Search & filter

### Phase 2: User Features
- [ ] User registration & login
- [ ] Profile management
- [ ] Upload history
- [ ] Bookmarks/Favorites

### Phase 3: Community
- [ ] Forum/Discussion board
- [ ] Comments on documents
- [ ] Follow users
- [ ] Notifications

### Phase 4: Learning
- [ ] Online courses
- [ ] Progress tracking
- [ ] Quizzes
- [ ] Certificates

### Phase 5: Advanced
- [ ] AI recommendations
- [ ] Live streaming
- [ ] Video conferencing
- [ ] Mobile app

---

## 🤝 Đóng Góp

Chúng tôi rất hoan nghênh mọi đóng góp! Nếu bạn muốn đóng góp:

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

---

## 📝 License

Dự án này được phát hành dưới giấy phép MIT. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <img src="https://via.placeholder.com/100" width="100px;" alt=""/>
      <br />
      <sub><b>Nguyễn Hữu Luân</b></sub>
      <br />
      <a href="mailto:nguyenhuuluan19092004@gmail.com">📧 Email</a>
    </td>
    <td align="center">
      <img src="https://via.placeholder.com/100" width="100px;" alt=""/>
      <br />
      <sub><b>Hồ Lý Minh Lữ</b></sub>
      <br />
      <a href="mailto:holyminhlu1@gmail.com">📧 Email</a>
      <br />
      <a href="tel:0983149203">📞 0983 149 203</a>
    </td>
    <td align="center">
      <img src="https://via.placeholder.com/100" width="100px;" alt=""/>
      <br />
      <sub><b>Huỳnh Khải</b></sub>
      <br />
      <a href="mailto:huynhkhai2062@gmail.com">📧 Email</a>
    </td>
  </tr>
</table>

---

## 🏫 Trường

**Trường Kỹ thuật và Công nghệ**  
**Đại học Trà Vinh**

Đồ án Chuyên ngành Công nghệ Thông tin  
Nhóm sinh viên: DA22TTB

---

## 📞 Liên Hệ

- 📧 Email: contact@edushare.edu.vn
- 📞 Phone: 0983 149 203
- 🌐 Website: https://edushare.edu.vn (coming soon)
- 🏫 Address: Trường Đại học Trà Vinh

---

## 🌟 Cảm Ơn

Cảm ơn bạn đã quan tâm đến dự án **EduShare**! Nếu thấy hữu ích, hãy cho chúng tôi một ⭐️ trên GitHub!

---

<div align="center">

**© 2024 EduShare - Learn & Share Together** 🎓

Made with ❤️ by DA22TTB Team

</div>


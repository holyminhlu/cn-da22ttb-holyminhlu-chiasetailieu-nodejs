# ⚡ Quick Start Guide - EduShare

## 🎯 Mục Tiêu
Hướng dẫn khởi chạy dự án EduShare trong vòng 5 phút!

---

## 📋 Checklist Trước Khi Bắt Đầu

- [ ] Node.js đã cài đặt (kiểm tra: `node --version`)
- [ ] npm đã cài đặt (kiểm tra: `npm --version`)
- [ ] Git đã cài đặt (kiểm tra: `git --version`)

---

## 🚀 3 Bước Đơn Giản

### Bước 1: Khởi chạy Frontend

```bash
# Di chuyển vào thư mục frontend
cd client/olf

# Chạy development server
npm run serve
```

**Kết quả:** 
```
  App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.x.x:8080/
```

➡️ **Mở trình duyệt và truy cập:** http://localhost:8080

---

### Bước 2: Khởi chạy Backend (Tùy chọn)

```bash
# Mở terminal mới
cd server/booking-service

# Chạy tất cả services
node start-all-services.js
```

**Services sẽ chạy:**
- ✅ API Gateway: http://localhost:3000
- ✅ Auth Service: http://localhost:3001
- ✅ Tours Service: http://localhost:3002
- ✅ Booking Service: http://localhost:3004
- ✅ Discounts Service: http://localhost:3005
- ✅ Rating Service: http://localhost:3006

---

### Bước 3: Test Giao Diện

Mở http://localhost:8080 và kiểm tra:

1. ✅ **Hero Section** - Có gradient background tím
2. ✅ **Search Bar** - Có thanh tìm kiếm và filters
3. ✅ **Categories** - Có 8 danh mục học tập với icons
4. ✅ **Header** - Logo "EduShare" và navigation
5. ✅ **Footer** - Thông tin contact và links

---

## 🎨 Xem Giao Diện

### Trang Chủ
- Gradient purple background
- Search bar với 3 filters
- 2 CTA buttons (Bắt đầu học tập, Chia sẻ tài liệu)
- Categories grid (8 items)
- Trending documents
- Top contributors
- Discussion section
- Stats section

### Header
- Logo: **Edu**Share
- Nav: Trang chủ | Tài liệu | Khóa học | Diễn đàn | Blog
- Actions: 🔍 Search | Đăng nhập | Đăng ký

### Footer
- 4 columns layout
- Social links
- Newsletter form
- Copyright info

---

## 🔧 Commands Hữu Ích

### Frontend Commands
```bash
# Development server
npm run serve

# Build for production
npm run build

# Lint & fix files
npm run lint

# Install dependencies
npm install
```

### Backend Commands
```bash
# Chạy tất cả services
node start-all-services.js

# Chạy từng service riêng
cd auth-service && node index.js
cd tours-service && node index.js
cd booking-service && node index.js
```

---

## 🐛 Troubleshooting

### Lỗi: "npm: command not found"
**Giải pháp:** Cài đặt Node.js từ https://nodejs.org/

### Lỗi: "Port 8080 already in use"
**Giải pháp:** 
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8080 | xargs kill -9
```

### Lỗi: "Cannot find module"
**Giải pháp:** 
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "Failed to compile"
**Giải pháp:** 
```bash
# Clear cache
npm cache clean --force
npm install
npm run serve
```

---

## 📸 Screenshots

### Desktop View
```
┌─────────────────────────────────────┐
│  EduShare     Trang chủ | Tài liệu  │ ← Header
├─────────────────────────────────────┤
│                                     │
│    Kho tàng tri thức của bạn       │ ← Hero
│    [    Tìm kiếm...        ]🔍     │
│                                     │
├─────────────────────────────────────┤
│  📐 Toán   💻 Lập trình  🌍 Ngoại ngữ│ ← Categories
├─────────────────────────────────────┤
│  [Document 1]  [Document 2]  [Doc 3]│ ← Content
├─────────────────────────────────────┤
│  EduShare | Links | Social | Newsletter│ ← Footer
└─────────────────────────────────────┘
```

### Mobile View
```
┌───────────────┐
│ EduShare  ☰  │ ← Header
├───────────────┤
│  Kho tài liệu │ ← Hero
│  [Tìm kiếm]   │
├───────────────┤
│ 📐 Toán học   │
│ 💻 Lập trình  │ ← Categories
│ 🌍 Ngoại ngữ  │
├───────────────┤
│ [Document 1]  │
│ [Document 2]  │ ← Content
│ [Document 3]  │
├───────────────┤
│ Footer Info   │
└───────────────┘
```

---

## 🎯 Điều Hướng Nhanh

### Routes Chính
| URL | Trang | Mô tả |
|-----|-------|-------|
| `/` | Home | Trang chủ |
| `/signin` | Sign In | Đăng nhập |
| `/signup` | Sign Up | Đăng ký |
| `/tour-thuong` | Documents | Tài liệu |
| `/tour-theo-doan` | Courses | Khóa học |
| `/gioithieu` | About | Giới thiệu |
| `/hotnews` | News | Tin tức |
| `/userinfo` | Profile | Thông tin cá nhân |

---

## 🌟 Tính Năng Đã Hoàn Thành

- ✅ Giao diện trang chủ responsive
- ✅ Header với navigation và search
- ✅ Footer với 4 columns
- ✅ Hero section với gradient
- ✅ Search bar và filters
- ✅ Categories grid (8 items)
- ✅ Document cards
- ✅ Contributors section
- ✅ Discussion section
- ✅ Stats section
- ✅ Mobile menu
- ✅ Search overlay

---

## 📝 Ghi Chú

### Mock Data
Hiện tại trang chủ sử dụng **mock data** (dữ liệu giả). Để hiển thị dữ liệu thực, cần:
1. Tích hợp API backend
2. Update `HomeView.vue` để call API
3. Handle loading states
4. Handle error states

### Authentication
- Login/Signup views đã có sẵn
- Cần tích hợp JWT authentication
- LocalStorage để lưu token

### File Upload
- Cần implement file upload feature
- Support PDF, PPT, Video
- Thumbnail generation

---

## 🔗 Links Hữu Ích

- 📚 [Vue.js Documentation](https://vuejs.org/)
- 🎨 [Bootstrap 5 Docs](https://getbootstrap.com/)
- 📦 [Node.js Documentation](https://nodejs.org/docs/)
- 🍃 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 💡 Tips

1. **Hot Reload**: Khi bạn edit code, trang sẽ tự động reload
2. **Console**: Mở DevTools (F12) để xem logs
3. **Mobile Testing**: Click icon 📱 trong DevTools để test mobile view
4. **Vue DevTools**: Cài extension để debug Vue components

---

## 🎓 Học Thêm

### Vue.js Basics
- Components
- Props & Events
- Vue Router
- Composition API

### CSS
- Flexbox
- Grid
- Responsive design
- Animations

### JavaScript
- ES6+ features
- Async/Await
- Promises
- Fetch API

---

## 🆘 Cần Trợ Giúp?

📧 **Email:** 
- nguyenhuuluan19092004@gmail.com
- holyminhlu1@gmail.com
- huynhkhai2062@gmail.com

📞 **Phone:** 0983 149 203

---

<div align="center">

**Happy Coding! 🚀**

Made with ❤️ by DA22TTB Team

</div>


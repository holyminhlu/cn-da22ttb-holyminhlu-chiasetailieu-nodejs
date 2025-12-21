# Open Learning Foundation

## 📚 Giới thiệu

Open Learning Foundation (OLF) là nền tảng website chia sẻ tài liệu và học tập trực tuyến, giúp người dùng dễ dàng tìm kiếm, chia sẻ tài liệu học tập, xem thông tin chi tiết, đánh giá tài liệu và quản lý bộ sưu tập cá nhân. Ứng dụng hướng tới việc tạo ra một cộng đồng học tập mở, nơi mọi người có thể chia sẻ và tiếp cận kiến thức một cách dễ dàng.

## ✨ Tính năng chính

- 🔍 **Tìm kiếm tài liệu** theo môn học, mã học phần, tên tác giả, từ khóa
- 📤 **Upload và chia sẻ** tài liệu học tập (PDF, PPTX, DOCX, ZIP)
- 📥 **Xem và tải xuống** tài liệu
- ⭐ **Đánh giá và nhận xét** tài liệu
- 🔖 **Bookmark** và quản lý bộ sưu tập cá nhân
- 🔎 **Tìm kiếm nâng cao** với nhiều bộ lọc
- 👤 **Đăng ký, đăng nhập**, quản lý thông tin cá nhân
- 👨‍💼 **Quản trị viên** quản lý tài liệu, người dùng
- 📚 **Khóa học trực tuyến** với video và tài liệu
- 💬 **Diễn đàn** thảo luận và chia sẻ kiến thức
- 📝 **Blog** chia sẻ bài viết và hướng dẫn

---

## 🏗️ Kiến trúc tổng quan

Dự án sử dụng **kiến trúc microservices** để đảm bảo tính mở rộng và bảo trì dễ dàng:

```
┌─────────────────┐
│  Frontend       │
│  (Vue.js 3)     │
│  Port: 8080     │
└────────┬────────┘
         │
         │ HTTP Requests
         │
┌────────▼────────┐
│  API Gateway    │
│  Port: 3000     │ ◄─── Trung gian xử lý requests
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┬──────────┐
    │         │          │          │          │
┌───▼───┐ ┌──▼──┐  ┌────▼────┐ ┌───▼───┐ ┌───▼───┐
│ Auth  │ │ Doc │  │ Course  │ │Forum  │ │ Blog  │
│:3001  │ │:3003│  │  :3004  │ │ :3005 │ │ :3006 │
└───┬───┘ └──┬──┘  └────┬────┘ └───┬───┘ └───┬───┘
    │        │          │          │          │
    └────────┴──────────┴──────────┴──────────┘
                    │
            ┌───────▼────────┐
            │   MongoDB      │
            │  (EduShareDB)  │
            │  local:27017   │
            │  hoặc Atlas    │
            └────────────────┘
```

### Các thành phần chính:

- **Frontend:** Vue.js 3 (thư mục `client/olf`)
- **API Gateway:** Trung gian giữa frontend và các service backend, xử lý xác thực, định tuyến, logging (Port 3000)
- **Backend Services:** Chia thành các service nhỏ độc lập (thư mục `server/`)
  - **Auth Service** (Port 3001): Xác thực người dùng
  - **Document Service** (Port 3003): Quản lý tài liệu
  - **Course Service** (Port 3004): Quản lý khóa học
  - **Forum Service** (Port 3005): Diễn đàn thảo luận
  - **Blog Service** (Port 3006): Quản lý blog
- **Database:** MongoDB (EduShareDB) - có thể dùng local hoặc MongoDB Atlas

---

## 📋 Yêu cầu hệ thống

### Phần mềm cần thiết:

- **Node.js** >= 14.x (khuyến nghị >= 16.x)
  - Kiểm tra: `node --version`
  - Tải về: https://nodejs.org/
- **npm** >= 6.x (thường đi kèm với Node.js)
  - Kiểm tra: `npm --version`
- **MongoDB** >= 4.4 (hoặc MongoDB Atlas account)
  - Local MongoDB: https://www.mongodb.com/try/download/community
  - MongoDB Atlas: https://www.mongodb.com/cloud/atlas
  - Kiểm tra: `mongod --version` hoặc `mongosh --version`
- **Git** (để clone repository)
  - Kiểm tra: `git --version`
  - Tải về: https://git-scm.com/

### Phần cứng khuyến nghị:

- RAM: >= 4GB (khuyến nghị 8GB)
- Ổ cứng: >= 2GB trống
- Hệ điều hành: Windows 10+, macOS 10.14+, hoặc Linux

---

## 🚀 Hướng dẫn cài đặt và setup

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd OpenLearnFoundation
```

### Bước 2: Cài đặt MongoDB

#### Option A: MongoDB Local (Khuyến nghị cho development)

**Windows:**
1. Tải MongoDB Community Server từ https://www.mongodb.com/try/download/community
2. Cài đặt với cấu hình mặc định
3. Khởi động MongoDB Service:
   ```powershell
   # Kiểm tra service
   Get-Service MongoDB
   
   # Khởi động nếu chưa chạy
   net start MongoDB
   ```
4. MongoDB sẽ chạy tại `mongodb://127.0.0.1:27017`

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y mongodb

# Khởi động service
sudo systemctl start mongod
sudo systemctl enable mongod

# Kiểm tra status
sudo systemctl status mongod
```

**macOS:**
```bash
# Sử dụng Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Kiểm tra kết nối:**
```bash
# Windows/Linux/macOS
mongosh mongodb://127.0.0.1:27017

# Hoặc đơn giản
mongosh
```

#### Option B: MongoDB Atlas (Cloud - Khuyến nghị cho production)

1. Đăng ký tài khoản tại https://www.mongodb.com/cloud/atlas
2. Tạo cluster mới (Free tier M0)
3. Tạo database user:
   - Database Access → Add New Database User
   - Chọn username và password
4. Whitelist IP:
   - Network Access → Add IP Address
   - Hoặc `0.0.0.0/0` để cho phép từ mọi nơi (không an toàn cho production)
5. Lấy Connection String:
   - Clusters → Connect → Connect your application
   - Copy connection string, format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/EduShareDB`

### Bước 3: Cài đặt Backend Services

Cài đặt dependencies cho tất cả backend services:

```bash
cd server

# API Gateway
cd api-gateway
npm install
cd ..

# Auth Service
cd auth-service
npm install
cd ..

# Document Service
cd document-service
npm install
cd ..

# Course Service
cd course-service
npm install
cd ..

# Forum Service (nếu có)
cd forum-service
npm install
cd ..

# Blog Service (nếu có)
cd blog-service
npm install
cd ..
```

**Hoặc chạy script tự động (nếu có):**
```bash
cd server
# Tạo script install-all.sh hoặc install-all.ps1
```

### Bước 4: Cấu hình MongoDB Connection (Tùy chọn)

Nếu sử dụng MongoDB Atlas hoặc MongoDB ở địa chỉ khác, tạo file `.env` trong mỗi service:

**`server/auth-service/.env`:**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/EduShareDB
# Hoặc MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/EduShareDB
PORT=3001
JWT_SECRET=your-secret-key-here
```

**`server/document-service/.env`:**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/EduShareDB
PORT=3003
```

**`server/course-service/.env`:**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/EduShareDB
PORT=3004
```

**Lưu ý:** Đảm bảo `.env` đã được thêm vào `.gitignore` để không commit thông tin nhạy cảm.

### Bước 5: Cài đặt Frontend

```bash
cd client/olf
npm install
```

Quá trình cài đặt có thể mất vài phút. Sau khi hoàn tất, bạn sẽ thấy thư mục `node_modules` được tạo.

---

## 🏃 Hướng dẫn chạy dự án

### ⚠️ LƯU Ý QUAN TRỌNG

Để ứng dụng hoạt động đầy đủ, bạn cần chạy **tất cả các services** sau trong **các terminal riêng biệt**:

1. **API Gateway** (Port 3000) - **BẮT BUỘC**
2. **Auth Service** (Port 3001)
3. **Document Service** (Port 3003)
4. **Course Service** (Port 3004)
5. **Forum Service** (Port 3005) - Tùy chọn
6. **Blog Service** (Port 3006) - Tùy chọn

### Khởi chạy Backend Services

Mở **4-6 terminals riêng biệt** (tùy thuộc vào số lượng service bạn muốn chạy):

#### Terminal 1: API Gateway (BẮT BUỘC - PHẢI CHẠY ĐẦU TIÊN)

```bash
cd server/api-gateway
npm start
```

**Expected Output:**
```
API Gateway chạy tại http://localhost:3000
Test endpoint: http://localhost:3000/test
Courses endpoint: http://localhost:3000/api/courses
```

#### Terminal 2: Auth Service

```bash
cd server/auth-service
npm start
```

**Expected Output:**
```
✅ Auth-Service đang lắng nghe tại http://localhost:3001
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
✅ Kết nối MongoDB thành công
✅ Test endpoint: http://localhost:3001/test
```

#### Terminal 3: Document Service

```bash
cd server/document-service
npm start
```

**Expected Output:**
```
✅ Document-Service đang lắng nghe tại http://localhost:3003
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
✅ Kết nối MongoDB thành công
✅ Test endpoint: http://localhost:3003/test
```

#### Terminal 4: Course Service

```bash
cd server/course-service
npm start
```

**Expected Output:**
```
✅ Course-Service đang lắng nghe tại http://localhost:3004
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
✅ Kết nối MongoDB thành công
✅ Test endpoint: http://localhost:3004/test
```

#### Terminal 5: Forum Service (Tùy chọn)

```bash
cd server/forum-service
npm start
```

#### Terminal 6: Blog Service (Tùy chọn)

```bash
cd server/blog-service
npm start
```

### Khởi chạy Frontend

Mở terminal mới:

```bash
cd client/olf
npm run serve
```

**Expected Output:**
```
  App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.x.x:8080/

  Note that the development build is not optimized.
  To create a production build, run npm run build.
```

### Truy cập ứng dụng

Sau khi tất cả services đã khởi động thành công:

- 🌐 **Frontend:** http://localhost:8080
- 🔌 **API Gateway:** http://localhost:3000
- 🔐 **Auth Service:** http://localhost:3001
- 📄 **Document Service:** http://localhost:3003
- 📚 **Course Service:** http://localhost:3004
- 💬 **Forum Service:** http://localhost:3005
- 📝 **Blog Service:** http://localhost:3006

---

## ✅ Kiểm tra Services đang chạy

### Kiểm tra bằng Browser

Mở trình duyệt và truy cập các URL sau để kiểm tra:

- API Gateway: http://localhost:3000/test
- Auth Service: http://localhost:3001/test
- Document Service: http://localhost:3003/test
- Course Service: http://localhost:3004/test

### Kiểm tra bằng Terminal (curl)

**Windows PowerShell:**
```powershell
# Test API Gateway
curl http://localhost:3000/test

# Test Auth Service
curl http://localhost:3001/test

# Test Document Service
curl http://localhost:3003/test

# Test Course Service
curl http://localhost:3004/test
```

**Linux/macOS:**
```bash
# Test API Gateway
curl http://localhost:3000/test

# Test Auth Service
curl http://localhost:3001/test

# Test Document Service
curl http://localhost:3003/test

# Test Course Service
curl http://localhost:3004/test
```

### Kiểm tra MongoDB Connection

**Windows:**
```powershell
mongosh mongodb://127.0.0.1:27017/EduShareDB
```

**Linux/macOS:**
```bash
mongosh mongodb://127.0.0.1:27017/EduShareDB
```

Hoặc đơn giản:
```bash
mongosh
use EduShareDB
show collections
```

---

## 🐛 Troubleshooting (Xử lý sự cố)

### Lỗi: "Port already in use"

**Nguyên nhân:** Port đã được sử dụng bởi process khác.

**Giải pháp:**

**Windows:**
```powershell
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Kill process (thay <PID> bằng Process ID từ lệnh trên)
taskkill /PID <PID> /F

# Hoặc kill tất cả Node processes
taskkill /IM node.exe /F
```

**Linux/macOS:**
```bash
# Tìm process đang dùng port 3000
lsof -ti:3000

# Kill process
lsof -ti:3000 | xargs kill -9

# Hoặc kill tất cả Node processes
pkill -f node
```

### Lỗi: "Cannot connect to MongoDB"

**Nguyên nhân:** MongoDB chưa khởi động hoặc connection string sai.

**Giải pháp:**

1. **Kiểm tra MongoDB đã chạy chưa:**

   **Windows:**
   ```powershell
   Get-Service MongoDB
   # Nếu chưa chạy:
   net start MongoDB
   ```

   **Linux:**
   ```bash
   sudo systemctl status mongod
   # Nếu chưa chạy:
   sudo systemctl start mongod
   ```

   **macOS:**
   ```bash
   brew services list
   # Nếu chưa chạy:
   brew services start mongodb-community
   ```

2. **Kiểm tra connection string trong code:**
   - Mặc định: `mongodb://127.0.0.1:27017/EduShareDB`
   - Kiểm tra file `.env` nếu có

3. **Test connection thủ công:**
   ```bash
   mongosh mongodb://127.0.0.1:27017/EduShareDB
   ```

4. **Nếu dùng MongoDB Atlas:**
   - Kiểm tra username/password đúng chưa
   - Kiểm tra IP đã được whitelist chưa
   - Kiểm tra connection string đúng format chưa

### Lỗi: "Module not found" hoặc "Cannot find module"

**Nguyên nhân:** Dependencies chưa được cài đặt.

**Giải pháp:**
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài đặt lại
npm install
```

**Windows PowerShell:**
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Lỗi: "npm ERR! code EACCES" hoặc Permission denied

**Nguyên nhân:** Không có quyền ghi vào thư mục.

**Giải pháp:**

**Linux/macOS:**
```bash
# Chạy với sudo (không khuyến nghị)
sudo npm install

# Hoặc thay đổi owner (khuyến nghị)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**Windows:**
- Chạy PowerShell/Command Prompt với quyền Administrator

### Lỗi: Frontend không kết nối được với Backend

**Nguyên nhân:** API Gateway chưa chạy hoặc frontend đang gọi sai URL.

**Giải pháp:**

1. **Đảm bảo API Gateway đang chạy:**
   ```bash
   cd server/api-gateway
   npm start
   ```

2. **Kiểm tra cấu hình API base URL trong frontend:**
   - File: `client/olf/src/utils/authAPI.js` hoặc tương tự
   - Đảm bảo base URL là `http://localhost:3000`

3. **Kiểm tra CORS settings:**
   - API Gateway phải cho phép CORS từ `http://localhost:8080`

### Lỗi: "ECONNREFUSED" khi frontend gọi API

**Nguyên nhân:** Backend service chưa chạy hoặc port sai.

**Giải pháp:**

1. Đảm bảo tất cả services đã được khởi động
2. Kiểm tra port của từng service:
   - API Gateway: 3000
   - Auth Service: 3001
   - Document Service: 3003
   - Course Service: 3004

3. Kiểm tra firewall không chặn các port này

### Lỗi: MongoDB Authentication failed

**Nguyên nhân:** Username/password sai hoặc user chưa có quyền.

**Giải pháp:**

1. **Nếu dùng MongoDB Atlas:**
   - Kiểm tra Database Access trong Atlas Dashboard
   - Tạo lại user nếu cần
   - Đảm bảo user có quyền Read/Write

2. **Nếu dùng MongoDB Local:**
   - Thử connection string không có authentication: `mongodb://127.0.0.1:27017/EduShareDB`
   - Hoặc tạo user mới trong MongoDB

---

## 📁 Cấu trúc thư mục chi tiết

```
OpenLearnFoundation/
│
├── client/                          # Frontend
│   └── olf/                         # Vue.js Application
│       ├── public/                  # Static files
│       │   ├── index.html
│       │   └── img/                 # Images
│       ├── src/
│       │   ├── components/          # Vue components
│       │   │   ├── HeaderComponent.vue
│       │   │   ├── FooterComponent.vue
│       │   │   ├── DocumentCard.vue
│       │   │   └── ...
│       │   ├── views/               # Page views
│       │   │   ├── HomeView.vue
│       │   │   ├── SignInView.vue
│       │   │   ├── SignUpView.vue
│       │   │   ├── DocumentsView.vue
│       │   │   └── ...
│       │   ├── routes/              # Vue Router
│       │   │   └── index.js
│       │   ├── utils/               # Utilities
│       │   │   ├── authAPI.js
│       │   │   └── ...
│       │   └── App.vue
│       ├── package.json
│       └── vue.config.js
│
├── server/                          # Backend Services
│   ├── api-gateway/                 # API Gateway (Port 3000)
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── routes/              # Proxy routes
│   │   │   │   ├── proxyRoutes.js
│   │   │   │   ├── authProxy.js
│   │   │   │   ├── documentsProxy.js
│   │   │   │   └── ...
│   │   │   └── middleware/
│   │   │       └── loggerMid.js
│   │   └── package.json
│   │
│   ├── auth-service/                # Auth Service (Port 3001)
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── adminController.js
│   │   ├── models/
│   │   │   └── authModel.js
│   │   ├── routes/
│   │   │   ├── authRoute.js
│   │   │   └── adminRoute.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── index.js
│   │   └── package.json
│   │
│   ├── document-service/            # Document Service (Port 3003)
│   │   ├── controllers/
│   │   │   └── documentController.js
│   │   ├── models/
│   │   │   ├── documentModel.js
│   │   │   └── userModel.js
│   │   ├── routes/
│   │   │   └── documentRoute.js
│   │   ├── uploads/                 # Uploaded files
│   │   │   ├── documents/
│   │   │   └── thumbnails/
│   │   ├── index.js
│   │   └── package.json
│   │
│   ├── course-service/              # Course Service (Port 3004)
│   │   ├── controllers/
│   │   │   ├── courseController.js
│   │   │   └── paymentController.js
│   │   ├── models/
│   │   │   ├── courseModel.js
│   │   │   ├── enrollmentModel.js
│   │   │   └── paymentModel.js
│   │   ├── routes/
│   │   │   ├── courseRoute.js
│   │   │   └── paymentRoute.js
│   │   ├── uploads/
│   │   │   ├── thumbnails/
│   │   │   └── videos/
│   │   ├── index.js
│   │   └── package.json
│   │
│   ├── forum-service/               # Forum Service (Port 3005)
│   │   ├── controllers/
│   │   │   └── postController.js
│   │   ├── models/
│   │   │   └── postModel.js
│   │   ├── routes/
│   │   │   └── postRoute.js
│   │   ├── uploads/
│   │   │   └── images/
│   │   ├── index.js
│   │   └── package.json
│   │
│   ├── blog-service/                # Blog Service (Port 3006)
│   │   ├── controllers/
│   │   │   └── blogController.js
│   │   ├── models/
│   │   │   └── blogPostModel.js
│   │   ├── routes/
│   │   │   └── blogRoute.js
│   │   ├── index.js
│   │   └── package.json
│   │
│   └── START_SERVICES.md            # Hướng dẫn chạy services
│
├── docs/                            # Documentation
│   ├── auth/
│   ├── services/
│   ├── mongodb/
│   └── ...
│
├── mongodb-backup/                  # MongoDB backups
│   └── EduShareDB/
│
├── README.md                        # File này
└── package.json                     # Root package.json (nếu có)
```

---

## 🔧 Mô tả chi tiết các dịch vụ Backend

### **api-gateway** (Port 3000) - BẮT BUỘC

**Vai trò:** Trung gian giữa frontend và các service backend.

**Chức năng:**
- Định tuyến request từ frontend đến các service backend tương ứng
- Xử lý xác thực và kiểm tra JWT token
- Logging và monitoring requests
- Xử lý CORS
- Rate limiting và security

**Proxy Routes:**
- `/api/auth/*` → Auth Service (3001)
- `/api/documents/*` → Document Service (3003)
- `/api/courses/*` → Course Service (3004)
- `/api/forum/*` → Forum Service (3005)
- `/api/blogs/*` → Blog Service (3006)
- `/api/admin/*` → Admin routes

**Dependencies:**
- express
- http-proxy-middleware
- cors
- axios
- dotenv

### **auth-service** (Port 3001)

**Vai trò:** Xác thực và quản lý người dùng.

**Chức năng:**
- Đăng ký tài khoản mới
- Đăng nhập và tạo JWT token
- Xác thực token
- Quản lý thông tin tài khoản
- Đổi mật khẩu
- Phân quyền người dùng (user, admin)
- Upload avatar và cover image

**Collections sử dụng:**
- `NguoiDung` (Users)

**Dependencies:**
- express
- mongoose
- bcrypt (hash password)
- jsonwebtoken (JWT)
- multer (file upload)
- cors

### **document-service** (Port 3003)

**Vai trò:** Quản lý tài liệu học tập.

**Chức năng:**
- Upload tài liệu (PDF, PPTX, DOCX, ZIP)
- Tìm kiếm và lọc tài liệu theo nhiều tiêu chí
- Quản lý metadata (tên, mô tả, môn học, tác giả, thumbnail)
- Tải xuống và xem tài liệu
- Bookmark và quản lý bộ sưu tập cá nhân
- Đếm lượt tải xuống
- Quản lý thumbnail

**Collections sử dụng:**
- `TaiLieu` (Documents)

**Dependencies:**
- express
- mongoose
- multer (file upload)
- cors
- uuid

### **course-service** (Port 3004)

**Vai trò:** Quản lý khóa học trực tuyến.

**Chức năng:**
- Tạo và quản lý khóa học
- Upload video và tài liệu khóa học
- Đăng ký khóa học (enrollment)
- Quản lý tiến độ học tập
- Thanh toán khóa học (tích hợp PayOS)
- Quản lý video lessons

**Collections sử dụng:**
- Courses
- Enrollments
- Payments

**Dependencies:**
- express
- mongoose
- multer
- @payos/node
- cors
- dotenv

### **forum-service** (Port 3005)

**Vai trò:** Quản lý diễn đàn thảo luận.

**Chức năng:**
- Tạo và quản lý bài viết (posts)
- Trả lời và comment
- Upload hình ảnh

**Collections sử dụng:**
- ForumPosts
- ForumReplies

### **blog-service** (Port 3006)

**Vai trò:** Quản lý blog và bài viết.

**Chức năng:**
- Tạo và quản lý blog posts
- Upload hình ảnh
- Categories và tags

**Collections sử dụng:**
- BlogPosts

---

## 🎨 Frontend

### **Công nghệ**

- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router 4** - Client-side routing
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icon library
- **AOS (Animate On Scroll)** - Scroll animations
- **GSAP** - Animation library
- **SweetAlert2** - Beautiful alerts
- **Axios** - HTTP client
- **Swiper** - Touch slider

### **Cấu trúc**

- **`components/`**: Các component Vue tái sử dụng
  - HeaderComponent.vue
  - FooterComponent.vue
  - DocumentCard.vue
  - SearchBar.vue
  - ...

- **`views/`**: Các trang view
  - HomeView.vue - Trang chủ
  - SignInView.vue - Đăng nhập
  - SignUpView.vue - Đăng ký
  - DocumentsView.vue - Danh sách tài liệu
  - DocumentDetailsView.vue - Chi tiết tài liệu
  - UserProfileView.vue - Thông tin cá nhân
  - ...

- **`routes/`**: Định nghĩa routes
  - index.js - Route configuration

- **`utils/`**: Các hàm tiện ích
  - authAPI.js - API calls cho authentication
  - eventBus.js - Event bus cho communication
  - validate.js - Validation functions
  - ...

- **`data/`**: Dữ liệu mẫu (mock data)
  - documentsData.json
  - homepageData.json

### **Tính năng Frontend**

- ✅ Trang chủ với hero section và search bar
- ✅ Tìm kiếm tài liệu nâng cao với filters
- ✅ Hiển thị danh sách tài liệu với cards
- ✅ Chi tiết tài liệu với preview
- ✅ Upload tài liệu với preview
- ✅ Quản lý profile người dùng
- ✅ Đăng nhập/Đăng ký với validation
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states và error handling
- ✅ Toast notifications

---

## 📄 Các định dạng tài liệu được hỗ trợ

### Tài liệu:
- **PDF** (.pdf) - Adobe Portable Document Format
- **PowerPoint** (.pptx) - Microsoft PowerPoint
- **Word** (.docx) - Microsoft Word
- **ZIP Archive** (.zip) - Compressed archive

### Hình ảnh (Thumbnail):
- **PNG** (.png)
- **JPEG/JPG** (.jpg, .jpeg)
- **WebP** (.webp)

### Giới hạn file size:
- Tài liệu: Tối đa 50MB (có thể cấu hình)
- Thumbnail: Tối đa 5MB

---

## 📊 MongoDB Schema

### Collection: TaiLieu (Documents)

```javascript
{
  tenTaiLieu: String,           // Tên tài liệu
  moTa: String,                 // Mô tả
  monHoc: String,               // Tên môn học
  maHocPhan: String,            // Mã học phần
  tacGia: String,               // Tác giả
  filePath: String,             // Đường dẫn file
  thumbnailPath: String,        // Đường dẫn thumbnail
  nguoiTaiLen: String,          // User ID người upload
  luotTai: Number,              // Số lượt tải
  danhGia: Number,              // Đánh giá (1-5)
  ngayTai: Date,                // Ngày upload
  theLoai: String,              // Thể loại
  kichThuoc: Number,            // Kích thước file (bytes)
  // ... các trường khác
}
```

### Collection: NguoiDung (Users)

```javascript
{
  hoTen: String,                // Họ tên
  email: String,                // Email (unique)
  matKhau: String,              // Password (hashed)
  vaiTro: String,               // 'user' | 'admin'
  avatar: String,               // Đường dẫn avatar
  cover: String,                // Đường dẫn cover image
  ngayTao: Date,                // Ngày tạo tài khoản
  trangThai: String,            // 'active' | 'locked'
  // ... các trường khác
}
```

### Collection: Courses

```javascript
{
  tenKhoaHoc: String,           // Tên khóa học
  moTa: String,                 // Mô tả
  gia: Number,                  // Giá khóa học
  thumbnail: String,            // Thumbnail
  videoLessons: [               // Danh sách video
    {
      tenBai: String,
      videoPath: String,
      thuTu: Number
    }
  ],
  // ... các trường khác
}
```

---

## 🌐 API Endpoints chính

### Auth Service (qua API Gateway: `/api/auth`)

- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin người dùng (cần token)
- `PUT /api/auth/profile` - Cập nhật thông tin cá nhân (cần token)
- `PUT /api/auth/change-password` - Đổi mật khẩu (cần token)
- `POST /api/auth/upload-avatar` - Upload avatar (cần token)

### Document Service (qua API Gateway: `/api/documents`)

- `POST /api/documents/upload` - Upload tài liệu (cần token)
- `GET /api/documents` - Lấy danh sách tài liệu
  - Query params: `page`, `limit`, `monHoc`, `tacGia`, `sort`
- `GET /api/documents/search` - Tìm kiếm tài liệu
  - Query params: `q` (search query), `monHoc`, `maHocPhan`
- `GET /api/documents/:id` - Lấy chi tiết tài liệu
- `PUT /api/documents/:id` - Cập nhật tài liệu (cần token, chỉ owner hoặc admin)
- `DELETE /api/documents/:id` - Xóa tài liệu (cần token, chỉ owner hoặc admin)
- `POST /api/documents/:id/bookmark` - Bookmark tài liệu (cần token)
- `GET /api/documents/bookmarked/:userId` - Lấy danh sách bookmark của user (cần token)
- `GET /api/documents/my-documents/:userId` - Lấy tài liệu của user (cần token)
- `GET /api/documents/download/:id` - Tải xuống tài liệu (tăng lượt tải)

### Course Service (qua API Gateway: `/api/courses`)

- `GET /api/courses` - Lấy danh sách khóa học
- `GET /api/courses/:id` - Lấy chi tiết khóa học
- `POST /api/courses` - Tạo khóa học mới (cần token, admin only)
- `PUT /api/courses/:id` - Cập nhật khóa học (cần token, admin only)
- `DELETE /api/courses/:id` - Xóa khóa học (cần token, admin only)
- `POST /api/courses/:id/enroll` - Đăng ký khóa học (cần token)
- `GET /api/courses/my-enrollments/:userId` - Lấy khóa học đã đăng ký (cần token)
- `PUT /api/courses/:id/progress` - Cập nhật tiến độ học tập (cần token)

### Forum Service (qua API Gateway: `/api/forum`)

- `GET /api/forum/posts` - Lấy danh sách bài viết
- `POST /api/forum/posts` - Tạo bài viết mới (cần token)
- `GET /api/forum/posts/:id` - Lấy chi tiết bài viết
- `PUT /api/forum/posts/:id` - Cập nhật bài viết (cần token)
- `DELETE /api/forum/posts/:id` - Xóa bài viết (cần token)

### Blog Service (qua API Gateway: `/api/blogs`)

- `GET /api/blogs` - Lấy danh sách blog posts
- `GET /api/blogs/:id` - Lấy chi tiết blog post
- `POST /api/blogs` - Tạo blog post mới (cần token)
- `PUT /api/blogs/:id` - Cập nhật blog post (cần token)
- `DELETE /api/blogs/:id` - Xóa blog post (cần token)

---

## 🛠️ Hướng dẫn phát triển

### Thêm mới dịch vụ Backend

1. Tạo thư mục mới trong `server/`:
   ```bash
   cd server
   mkdir my-new-service
   cd my-new-service
   ```

2. Tạo cấu trúc cơ bản:
   ```
   my-new-service/
   ├── controllers/
   │   └── myController.js
   ├── models/
   │   └── myModel.js
   ├── routes/
   │   └── myRoute.js
   ├── index.js
   └── package.json
   ```

3. Khởi tạo package.json:
   ```bash
   npm init -y
   npm install express mongoose cors dotenv
   ```

4. Tạo `index.js` với Express server cơ bản

5. Đăng ký route tại API Gateway:
   - Thêm proxy route trong `server/api-gateway/src/routes/proxyRoutes.js`
   - Thêm vào `server/api-gateway/src/index.js`

6. Đảm bảo service có thể chạy độc lập và kết nối MongoDB

### Thêm mới component Frontend

1. Tạo component mới:
   ```bash
   cd client/olf/src/components
   # Tạo file MyComponent.vue
   ```

2. Hoặc tạo view mới:
   ```bash
   cd client/olf/src/views
   # Tạo file MyView.vue
   ```

3. Đăng ký route mới (nếu là view):
   - Chỉnh sửa `client/olf/src/routes/index.js`
   - Thêm route mới:
   ```javascript
   {
     path: '/my-route',
     name: 'MyView',
     component: () => import('../views/MyView.vue')
   }
   ```

4. Sử dụng component/view trong các component khác

### Chạy từng service riêng biệt để debug

Mỗi service có thể chạy độc lập để dễ debug:

```bash
# Terminal riêng cho mỗi service
cd server/auth-service
node index.js

# Hoặc với nodemon (tự động restart khi code thay đổi)
npm run dev
```

### Quản lý môi trường (Environment Variables)

**Tạo file `.env` trong mỗi service:**

```env
# .env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/EduShareDB
JWT_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development
```

**Sử dụng trong code:**
```javascript
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/EduShareDB';
```

**⚠️ LƯU Ý QUAN TRỌNG:**
- **KHÔNG** commit file `.env` lên Git
- Thêm `.env` vào `.gitignore`
- Sử dụng `.env.example` để document các biến môi trường cần thiết

### Development với Hot Reload

Sử dụng `nodemon` để tự động restart khi code thay đổi:

```bash
# Cài đặt nodemon (development dependency)
npm install --save-dev nodemon

# Thêm script vào package.json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}

# Chạy với hot reload
npm run dev
```

---

## 📚 Tài liệu tham khảo

- [Hướng dẫn nhanh](docs/quick-start/QUICK_START.md)
- [Hướng dẫn Auth Service](docs/auth/AUTH_SETUP_GUIDE.md)
- [Hướng dẫn Document Service](docs/services/document/DOCUMENT_SERVICE_GUIDE.md)
- [Hướng dẫn MongoDB](docs/mongodb/MONGODB_CONNECTION_GUIDE.md)
- [Cấu trúc dự án](docs/project/PROJECT_TREE.md)
- [Hướng dẫn Docker](DOCKER_SETUP.md) (nếu có)

---

## 🔄 Development Workflow

### Quy trình phát triển đề xuất:

1. **Tạo branch mới:**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Phát triển và test locally:**
   - Chạy tất cả services
   - Test tính năng mới
   - Fix bugs

3. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: Add new feature"
   ```

4. **Push và tạo Pull Request:**
   ```bash
   git push origin feature/my-new-feature
   ```

5. **Code review và merge**

### Code Style:

- Sử dụng ESLint cho JavaScript/Vue
- Format code với Prettier (nếu có)
- Comment code phức tạp
- Viết commit message rõ ràng

---

## 🧪 Testing

### Test Manual:

1. Test từng service riêng biệt qua test endpoints
2. Test integration qua API Gateway
3. Test frontend với backend đầy đủ

### Test Endpoints:

Mỗi service có endpoint `/test` để kiểm tra:

- `GET http://localhost:3000/test` - API Gateway
- `GET http://localhost:3001/test` - Auth Service
- `GET http://localhost:3003/test` - Document Service
- `GET http://localhost:3004/test` - Course Service

---

## 🚀 Production Deployment

### Checklist trước khi deploy:

- [ ] Tất cả environment variables đã được cấu hình
- [ ] MongoDB connection string đúng (production)
- [ ] JWT_SECRET đã được thay đổi
- [ ] File uploads được lưu ở cloud storage (S3, Azure Blob, etc.)
- [ ] CORS đã được cấu hình đúng
- [ ] Error handling đã được xử lý đầy đủ
- [ ] Logging đã được setup
- [ ] Security headers đã được thêm
- [ ] Rate limiting đã được cấu hình
- [ ] SSL/HTTPS đã được setup

### Build Frontend:

```bash
cd client/olf
npm run build
```

Output sẽ ở thư mục `dist/`, có thể deploy lên:
- Netlify
- Vercel
- GitHub Pages
- Nginx server
- Cloud services (AWS S3 + CloudFront, Azure Static Web Apps, etc.)

### Deploy Backend:

Có thể deploy lên:
- Heroku
- AWS EC2/ECS
- Azure App Service
- Google Cloud Run
- DigitalOcean
- VPS server với PM2

---

## 👥 Đóng góp & Liên hệ

### Đóng góp:

Chúng tôi hoan nghênh mọi đóng góp! Để đóng góp:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

### Báo lỗi:

Nếu phát hiện bug, vui lòng:
- Tạo Issue trên GitHub repository
- Mô tả chi tiết bug và cách reproduce
- Thêm screenshot nếu có

### Đề xuất tính năng:

- Tạo Issue với label "enhancement"
- Mô tả chi tiết tính năng mong muốn
- Giải thích lý do và use case

### Liên hệ:

- 📧 **Email:** holyminhlu1@gmail.com (Minh Lữ)
- 📞 **Số điện thoại:** 0983149203
- 🌐 **GitHub:** [Repository URL]

Mọi ý kiến đóng góp đều được trân trọng để hoàn thiện sản phẩm!

---

## 📄 License

**Bản quyền thuộc về Hồ Lý Minh Lữ**  
Sinh viên Công nghệ Thông Tin  
Trường Kỹ thuật và Công nghệ  
Trường Đại học Trà Vinh

---

## 🙏 Lời cảm ơn

Cảm ơn tất cả những người đã đóng góp và sử dụng Open Learning Foundation. Chúng tôi hy vọng nền tảng này sẽ giúp ích cho cộng đồng học tập!

---

<div align="center">

**Made with ❤️ by Open Learning Foundation Team**

🌟 **Happy Learning!** 🌟

</div>

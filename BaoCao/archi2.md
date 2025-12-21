# 🏗️ Kiến Trúc & Công Nghệ - OpenLearnFoundation

## 📋 Mục Lục

1. [Kiến Trúc Tổng Thể](#kiến-trúc-tổng-thể)
2. [Kiến Trúc Frontend](#kiến-trúc-frontend)
3. [Kiến Trúc Backend](#kiến-trúc-backend)
4. [Cơ Sở Dữ Liệu](#cơ-sở-dữ-liệu)
5. [Tổng Kết Công Nghệ](#tổng-kết-công-nghệ)

---

## Kiến Trúc Tổng Thể

### Tổng Quan Hệ Thống

**OpenLearnFoundation** là một nền tảng học tập trực tuyến được xây dựng theo kiến trúc **Microservices**, cho phép hệ thống có khả năng mở rộng cao, dễ bảo trì và phát triển độc lập.

### Sơ Đồ Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Frontend Application                        │   │
│  │              (Vue.js 3 + Bootstrap 5)                    │   │
│  │              Port: 8080 (Development)                     │   │
│  │              Port: 80 (Production - Nginx)               │   │
│  │                                                           │   │
│  │  - Single Page Application (SPA)                        │   │
│  │  - Component-Based Architecture                          │   │
│  │  - Client-Side Routing                                   │   │
│  │  - RESTful API Communication                            │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP/HTTPS
                                │ REST API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              API Gateway Service                        │   │
│  │              (Express.js + Proxy Middleware)            │   │
│  │              Port: 3000                                  │   │
│  │                                                           │   │
│  │  Chức năng:                                              │   │
│  │  ✓ Request Routing & Load Balancing                     │   │
│  │  ✓ CORS Handling                                         │   │
│  │  ✓ Request/Response Logging                              │   │
│  │  ✓ Error Handling & Transformation                      │   │
│  │  ✓ Protocol Translation                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└───┬───────────┬───────────┬───────────┬───────────┬─────────────┘
    │           │           │           │           │
    ▼           ▼           ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│  Auth   │ │Document │ │ Course  │ │ Forum   │ │  Blog   │
│ Service │ │ Service │ │ Service │ │ Service │ │ Service │
│  :3001  │ │  :3003  │ │  :3004  │ │  :3005  │ │  :3006  │
└────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
     │           │           │           │           │
     └───────────┴───────────┴───────────┴───────────┘
                         │
                         ▼
        ┌──────────────────────────────────┐
        │      DATABASE LAYER              │
        │                                  │
        │  ┌──────────────────────────┐  │
        │  │    MongoDB Database       │  │
        │  │    (EduShareDB)           │  │
        │  │    Port: 27017            │  │
        │  │                           │  │
        │  │  - Document Store         │  │
        │  │  - NoSQL Database          │  │
        │  │  - Schema-less Design     │  │
        │  │  - High Performance       │  │
        │  └──────────────────────────┘  │
        │                                  │
        │  Deployment Options:            │
        │  • Local MongoDB (Development)   │
        │  • MongoDB Atlas (Production)   │
        └──────────────────────────────────┘
```

### Đặc Điểm Kiến Trúc

#### 1. Microservices Architecture
- **Tách biệt theo Domain**: Mỗi service quản lý một domain cụ thể
- **Độc lập về Deployment**: Mỗi service có thể deploy riêng biệt
- **Độc lập về Technology**: Có thể sử dụng công nghệ khác nhau
- **Scalability**: Scale từng service theo nhu cầu

#### 2. API Gateway Pattern
- **Single Entry Point**: Tất cả requests đi qua một điểm
- **Request Routing**: Route requests đến đúng service
- **Cross-Cutting Concerns**: Xử lý CORS, logging, authentication
- **Protocol Translation**: Chuyển đổi protocols nếu cần

#### 3. Layered Architecture
- **Presentation Layer**: Frontend (Vue.js)
- **API Layer**: API Gateway
- **Business Logic Layer**: Backend Services
- **Data Access Layer**: MongoDB với Mongoose ODM

### Luồng Xử Lý Request

```
1. User Action (Frontend)
   ↓
2. HTTP Request → API Gateway
   ↓
3. API Gateway:
   - CORS Check
   - Route Matching
   - Request Logging
   ↓
4. Proxy to Backend Service
   ↓
5. Backend Service:
   - Parse Request
   - Validate Input
   - Business Logic
   ↓
6. Database Query (MongoDB)
   ↓
7. Response Processing
   ↓
8. API Gateway → Frontend
   ↓
9. UI Update
```

---

## Kiến Trúc Frontend

### Tổng Quan Frontend

Frontend được xây dựng bằng **Vue.js 3** với kiến trúc **Component-Based**, sử dụng **Single Page Application (SPA)** pattern.

### Cấu Trúc Frontend

```
client/olf/
├── public/                    # Static assets
│   ├── img/                  # Images
│   ├── favicon.ico
│   └── index.html            # Entry HTML
│
├── src/
│   ├── main.js              # Application entry point
│   ├── App.vue              # Root component
│   │
│   ├── views/               # Page components
│   │   ├── HomeView.vue
│   │   ├── DocumentsView.vue
│   │   ├── CoursesView.vue
│   │   ├── SignInView.vue
│   │   ├── SignUpView.vue
│   │   ├── UserProfileView.vue
│   │   ├── AdminDashboardView.vue
│   │   └── ...
│   │
│   ├── components/          # Reusable components
│   │   ├── HeaderComponent.vue
│   │   ├── FooterComponent.vue
│   │   ├── DocumentCard.vue
│   │   ├── SearchBar.vue
│   │   ├── UploadModal.vue
│   │   └── ...
│   │
│   ├── routes/              # Routing configuration
│   │   └── index.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── authAPI.js      # Authentication API calls
│   │   ├── documentAPI.js  # Document API calls
│   │   ├── courseAPI.js    # Course API calls
│   │   └── eventBus.js    # Event bus for communication
│   │
│   └── assets/              # Assets (CSS, images)
│       └── styles/
│
├── package.json            # Dependencies
├── vue.config.js          # Vue CLI configuration
└── nginx.conf             # Nginx config (production)
```

### Công Nghệ Frontend

#### Core Framework
- **Vue.js 3.2.13**: Progressive JavaScript framework
  - Composition API
  - Reactive data binding
  - Component lifecycle hooks
  - Virtual DOM

#### Routing
- **Vue Router 4.5.1**: Client-side routing
  - History mode
  - Route guards
  - Lazy loading
  - Nested routes

#### UI Framework
- **Bootstrap 5.3.6**: CSS framework
  - Responsive grid system
  - Pre-built components
  - Utility classes
  - Customizable themes

#### HTTP Client
- **Axios 1.13.2**: Promise-based HTTP client
  - Request/response interceptors
  - Automatic JSON transformation
  - Error handling
  - Request cancellation

#### Animation Libraries
- **AOS 2.3.4**: Animate On Scroll
- **GSAP 3.13.0**: Professional animations
- **WOW.js 1.1.3**: Scroll animations

#### UI Components
- **Swiper 11.2.8**: Touch slider
- **SweetAlert2 11.22.0**: Beautiful alerts
- **Font Awesome 4.7.0**: Icon library
- **Vue Datepicker**: Date selection

### Kiến Trúc Component

#### Component Hierarchy

```
App.vue (Root)
├── HeaderComponent
│   ├── Navigation
│   └── User Menu
│
├── Router View
│   ├── HomeView
│   │   ├── HeroSection
│   │   ├── SearchBar
│   │   └── DocumentCards
│   │
│   ├── DocumentsView
│   │   ├── SearchBar
│   │   ├── FilterPanel
│   │   └── DocumentCard (multiple)
│   │
│   ├── CoursesView
│   │   └── CourseCard (multiple)
│   │
│   └── ...
│
└── FooterComponent
```

#### Component Communication

**1. Props Down, Events Up**
```javascript
// Parent → Child: Props
<DocumentCard :document="doc" />

// Child → Parent: Events
<SearchBar @search="handleSearch" />
```

**2. Event Bus (Global)**
```javascript
// Emit event
eventBus.emit('document-uploaded', document);

// Listen event
eventBus.on('document-uploaded', handleUpload);
```

**3. Vuex/Pinia (Future)**
- Centralized state management
- Shared state across components

### Routing Architecture

**Route Structure**:
```javascript
/                          → HomeView
/documents                 → DocumentsView
/documents/:id             → DocumentDetailView
/courses                   → CoursesView
/courses/:id               → CourseDetailView
/signin                    → SignInView
/signup                    → SignUpView
/profile                   → UserProfileView (Protected)
/admin                     → AdminDashboardView (Admin only)
```

**Route Guards**:
- Authentication guard: Check JWT token
- Role guard: Check user role (admin)
- Redirect to login if not authenticated

### State Management

**Current Approach**: Event Bus
- Simple event-based communication
- Suitable for small to medium apps

**Future Consideration**: Vuex/Pinia
- Centralized state
- Better for complex state management
- Time-travel debugging

### API Communication Pattern

**Axios Configuration**:
```javascript
// Base URL
axios.defaults.baseURL = 'http://localhost:3000/api';

// Request Interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
axios.interceptors.response.use(
  response => response.data,
  error => {
    // Handle errors
    return Promise.reject(error);
  }
);
```

### Build & Deployment

**Development**:
- Vue CLI dev server
- Hot module replacement
- Source maps

**Production**:
- Webpack build
- Code splitting
- Minification
- Nginx serving static files

---

## Kiến Trúc Backend

### Tổng Quan Backend

Backend được xây dựng theo kiến trúc **Microservices** với **Node.js** và **Express.js**, mỗi service có trách nhiệm riêng biệt.

### Cấu Trúc Backend Services

```
server/
├── api-gateway/              # API Gateway (Port 3000)
│   ├── src/
│   │   ├── index.js         # Entry point
│   │   ├── routes/          # Proxy routes
│   │   │   ├── proxyRoutes.js
│   │   │   ├── authProxy.js
│   │   │   ├── documentsProxy.js
│   │   │   └── ...
│   │   └── middleware/      # Custom middleware
│   │       └── loggerMid.js
│   └── package.json
│
├── auth-service/            # Authentication Service (Port 3001)
│   ├── index.js
│   ├── routes/
│   │   ├── authRoute.js    # Public routes
│   │   └── adminRoute.js   # Admin routes
│   ├── controllers/
│   │   ├── authController.js
│   │   └── adminController.js
│   ├── models/
│   │   └── authModel.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── uploads/            # Avatar, cover images
│
├── document-service/        # Document Service (Port 3003)
│   ├── index.js
│   ├── routes/
│   │   └── documentRoute.js
│   ├── controllers/
│   │   └── documentController.js
│   ├── models/
│   │   └── documentModel.js
│   └── uploads/            # Documents, thumbnails
│
├── course-service/          # Course Service (Port 3004)
│   ├── index.js
│   ├── routes/
│   │   ├── courseRoute.js
│   │   └── paymentRoute.js
│   ├── controllers/
│   │   ├── courseController.js
│   │   └── paymentController.js
│   ├── models/
│   │   ├── courseModel.js
│   │   ├── enrollmentModel.js
│   │   └── paymentModel.js
│   └── uploads/            # Course thumbnails, videos
│
├── forum-service/           # Forum Service (Port 3005)
│   ├── index.js
│   ├── routes/
│   │   └── postRoute.js
│   ├── controllers/
│   │   └── postController.js
│   ├── models/
│   │   └── postModel.js
│   └── uploads/            # Post images
│
└── blog-service/            # Blog Service (Port 3006)
    ├── index.js
    ├── routes/
    │   └── blogRoute.js
    ├── controllers/
    │   └── blogController.js
    ├── models/
    │   └── blogModel.js
    └── package.json
```

### Công Nghệ Backend

#### Runtime & Framework
- **Node.js 18.x**: JavaScript runtime
  - Event-driven, non-blocking I/O
  - V8 JavaScript engine
  - NPM ecosystem

- **Express.js 5.1.0 / 4.x**: Web framework
  - Minimal và flexible
  - Middleware support
  - RESTful API
  - Routing system

#### Database & ODM
- **MongoDB**: NoSQL database
  - Document-based storage
  - Schema-less design
  - High performance
  - Horizontal scaling

- **Mongoose 8.15.1**: MongoDB ODM
  - Schema definition
  - Data validation
  - Query building
  - Middleware hooks

#### Authentication & Security
- **JWT (jsonwebtoken 9.0.2)**: Token-based authentication
  - Stateless authentication
  - Token expiration
  - Secure data transmission

- **Bcrypt 6.0.0**: Password hashing
  - One-way hashing
  - Salt rounds: 10
  - Secure password storage

- **UUID 9.0.1**: Unique identifier generation
  - Version 4 UUIDs
  - Unique entity IDs

#### File Handling
- **Multer 2.0.2 / 1.4.5**: File upload middleware
  - Multipart/form-data handling
  - Disk storage
  - File validation
  - Size limits

#### Cross-Cutting Concerns
- **CORS 2.8.5**: Cross-Origin Resource Sharing
  - Allowed origins configuration
  - Credentials support

- **Morgan 1.10.0**: HTTP request logger
  - Request logging
  - Response logging

- **Dotenv**: Environment variable management
  - Configuration management
  - Security

#### Payment Integration
- **PayOS Node SDK 1.0.0**: Payment gateway
  - Payment link generation
  - Webhook callbacks
  - Payment status tracking

### Kiến Trúc Service Pattern

Mỗi service tuân theo **Layered Architecture**:

```
┌─────────────────────────────────┐
│      Route Layer                │
│  - HTTP Request/Response        │
│  - Route definitions            │
│  - Route handlers               │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│    Controller Layer              │
│  - Business logic               │
│  - Request validation           │
│  - Response formatting          │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│      Model Layer                │
│  - Data access                  │
│  - Schema definition            │
│  - Query building               │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│    Database Layer               │
│  - MongoDB operations           │
│  - Data persistence             │
└─────────────────────────────────┘
```

### API Gateway Architecture

**Chức năng chính**:
1. **Request Routing**: Route requests đến đúng service
2. **CORS Handling**: Xử lý cross-origin requests
3. **Request Logging**: Log tất cả requests
4. **Error Handling**: Centralized error handling
5. **Protocol Translation**: Chuyển đổi protocols

**Proxy Configuration**:
```javascript
// Example: Documents Proxy
createProxyMiddleware({
  target: 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: { '^/(.*)': '/documents/$1' },
  timeout: 60000,
  onProxyReq: (proxyReq, req) => {
    // Log request
  },
  onProxyRes: (proxyRes, req) => {
    // Log response
  },
  onError: (err, req, res) => {
    // Handle errors
  }
});
```

### Service Communication

**Synchronous Communication**:
- HTTP/REST APIs
- Request-response pattern
- JSON data format

**Service-to-Service**:
```
API Gateway → Auth Service (HTTP)
API Gateway → Document Service (HTTP)
API Gateway → Course Service (HTTP)
```

**Future Consideration**:
- Message Queue (RabbitMQ/Kafka)
- gRPC for inter-service calls
- Event-driven architecture

### Error Handling Architecture

**Error Handling Chain**:
```
Service Error
    ↓
Service Error Handler
    ├── Log error
    ├── Format error response
    └── Send to API Gateway
    ↓
API Gateway Error Handler
    ├── Log error
    ├── Transform error
    └── Send to Client
    ↓
Client Error Handler
    ├── Display error message
    └── Handle error state
```

---

## Cơ Sở Dữ Liệu

### Tổng Quan Database

Hệ thống sử dụng **MongoDB** làm cơ sở dữ liệu chính, với database tên **EduShareDB** hoặc **OpenLearnFoundation**.

### Kiến Trúc Database

#### Database Strategy
- **Shared Database Pattern**: Tất cả services chia sẻ một database
- **Collection-based Separation**: Mỗi service sử dụng collections riêng
- **Document-based Storage**: Lưu trữ dữ liệu dưới dạng documents (JSON-like)

#### Connection Architecture
```
┌─────────────────────────────────┐
│      Backend Services           │
│                                  │
│  ┌──────────┐  ┌──────────┐    │
│  │   Auth   │  │ Document │    │
│  │ Service  │  │ Service  │    │
│  └────┬─────┘  └────┬─────┘    │
│       │             │           │
│       └──────┬──────┘           │
│              │                  │
└──────────────┼──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│    MongoDB Connection Pool       │
│    (Mongoose Connection)         │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│    MongoDB Database              │
│    (EduShareDB)                  │
│                                  │
│  Collections:                    │
│  • UserCollection                │
│  • TaiLieu                       │
│  • Courses                       │
│  • Enrollments                   │
│  • Payments                      │
│  • BlogPosts                     │
│  • posts                         │
│  • DocumentRatings               │
└─────────────────────────────────┘
```

### Collections Chi Tiết

#### 1. UserCollection
**Mục đích**: Quản lý thông tin người dùng

**Schema chính**:
```javascript
{
  _id: ObjectId,
  user_id: String (unique),        // "user_12345678-..."
  fullName: String,
  email: String (unique, indexed),
  passWord: String (hashed),       // Bcrypt hash
  role: String,                    // "student" | "instructor" | "admin"
  phone: String,
  address: String,
  gender: String,                  // "male" | "female" | "other"
  avatar_url: String,
  cover_url: String,
  bio: String,
  university: String,
  major: String,
  uploaded_documents: [String],    // Array of document IDs
  enrolled_courses: [String],      // Array of course IDs
  saved_documents: [String],      // Array of document IDs
  contributions: Number,
  reputation_score: Number,
  is_verified: Boolean,
  is_active: Boolean,
  last_login: Date,
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `email` (unique)
- `user_id` (unique)
- `role`
- `created_at`

#### 2. TaiLieu (DocumentsCollection)
**Mục đích**: Lưu trữ thông tin tài liệu

**Schema chính**:
```javascript
{
  _id: ObjectId,
  document_id: String (unique),    // "doc_12345678-..."
  title: String (text indexed),
  description: String (text indexed),
  author_id: String,               // Reference to UserCollection
  file: {
    originalName: String,
    fileType: String,              // "PDF" | "PPTX" | "DOCX" | "ZIP"
    fileSize: Number,
    fileUrl: String
  },
  thumbnail: String,
  program: String,                 // "CNTT" | "Kinh tế" | ...
  category: String,
  tags: [String],
  downloads: Number,
  views: Number,
  rating: Number,                  // Average rating (0-5)
  ratingCount: Number,
  is_featured: Boolean,
  is_approved: Boolean,
  uploadDate: Date,
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `document_id` (unique)
- `title` (text index)
- `description` (text index)
- `author_id`
- `program`
- `tags`
- `created_at` (descending)

#### 3. Courses
**Mục đích**: Quản lý khóa học

**Schema chính**:
```javascript
{
  _id: ObjectId,
  course_id: String (unique),      // "course_12345678-..."
  title: String,
  description: String,
  instructor_id: String,          // Reference to UserCollection
  thumbnail: String,
  price: Number,
  isFree: Boolean,
  level: String,                   // "beginner" | "intermediate" | "advanced"
  category: String,
  lessons: [{
    title: String,
    videoUrl: String,
    duration: Number
  }],
  enrollmentCount: Number,
  rating: Number,
  status: String,                  // "draft" | "published"
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `course_id` (unique)
- `instructor_id`
- `category`
- `level`
- `isFree`
- `created_at` (descending)

#### 4. Enrollments
**Mục đích**: Quản lý đăng ký khóa học

**Schema chính**:
```javascript
{
  _id: ObjectId,
  enrollment_id: String (unique),  // "enroll_12345678-..."
  course_id: String,               // Reference to Courses
  user_id: String,                // Reference to UserCollection
  progress: Number,                // 0-100
  completed_lessons: [String],
  is_completed: Boolean,
  enrolled_at: Date,
  last_accessed_at: Date,
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `enrollment_id` (unique)
- `course_id`, `user_id` (compound unique)
- `enrolled_at` (descending)

#### 5. Payments
**Mục đích**: Quản lý thanh toán

**Schema chính**:
```javascript
{
  _id: ObjectId,
  payment_id: String (unique),    // "payment_12345678-..."
  course_id: String,
  user_id: String,
  amount: Number,
  status: String,                 // "pending" | "paid" | "cancelled" | "failed"
  payment_link: String,
  payos_transaction_id: String,
  paid_at: Date,
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `payment_id` (unique)
- `user_id`
- `course_id`
- `status`
- `created_at` (descending)

#### 6. BlogPosts
**Mục đích**: Quản lý bài viết blog

**Schema chính**:
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  excerpt: String,
  author_id: String,              // Reference to UserCollection
  thumbnail: String,
  tags: [String],
  featured: Boolean,
  views: Number,
  likes: Number,
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `author_id`
- `tags`
- `featured`
- `created_at` (descending)

#### 7. posts (Forum Posts)
**Mục đích**: Quản lý bài đăng forum

**Schema chính**:
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  author_id: String,              // Reference to UserCollection
  images: [String],
  likes: [String],                // Array of user IDs
  comments: [{
    comment_id: String,
    author_id: String,
    content: String,
    created_at: Date
  }],
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `author_id`
- `created_at` (descending)

#### 8. DocumentRatings
**Mục đích**: Đánh giá tài liệu

**Schema chính**:
```javascript
{
  _id: ObjectId,
  rating_id: String (unique),     // "rating_12345678-..."
  document_id: String,            // Reference to TaiLieu
  user_id: String,                // Reference to UserCollection
  rating: Number,                  // 1-5
  comment: String,
  is_verified_purchase: Boolean,
  is_helpful: Number,
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `rating_id` (unique)
- `document_id`, `user_id` (compound unique)
- `document_id`
- `rating`
- `created_at` (descending)

### Data Relationships

#### Reference Pattern
- **User References**: Sử dụng `user_id` (String) thay vì ObjectId
- **Document References**: Sử dụng `document_id` (String)
- **Course References**: Sử dụng `course_id` (String)

#### Population Pattern
```javascript
// Populate user info when needed
Document.findById(id)
  .populate('author_id', 'fullName email avatar_url')
  .exec();
```

### Indexing Strategy

#### Primary Indexes
- Unique indexes cho tất cả entity IDs
- Email unique index cho UserCollection

#### Search Indexes
- Text indexes cho title, description (full-text search)
- Tag indexes cho filtering

#### Performance Indexes
- Compound indexes cho queries thường dùng
- Descending indexes cho sorting (created_at)

**Ví dụ Compound Index**:
```javascript
// Enrollments: Find user's enrollments for a course
{ course_id: 1, user_id: 1 } // Compound unique

// Documents: Search by program and sort by date
{ program: 1, created_at: -1 }
```

### Database Connection

#### Connection String
**Local Development**:
```
mongodb://127.0.0.1:27017/EduShareDB
```

**MongoDB Atlas (Production)**:
```
mongodb+srv://username:password@cluster.mongodb.net/OpenLearnFoundation
```

#### Connection Configuration
```javascript
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2
});
```

### Data Validation

#### Schema Validation
- Mongoose schema validation
- Required fields
- Type validation
- Enum validation
- Custom validators

#### Application-Level Validation
- Input validation trong controllers
- Business rule validation
- Data sanitization

---

## Tổng Kết Công Nghệ

### Technology Stack Summary

#### Frontend Stack
```
Vue.js 3.2.13
├── Vue Router 4.5.1
├── Bootstrap 5.3.6
├── Axios 1.13.2
├── AOS 2.3.4
├── GSAP 3.13.0
├── Swiper 11.2.8
├── SweetAlert2 11.22.0
└── Font Awesome 4.7.0
```

#### Backend Stack
```
Node.js 18.x
├── Express.js 5.1.0 / 4.x
├── Mongoose 8.15.1
├── JWT 9.0.2
├── Bcrypt 6.0.0
├── Multer 2.0.2 / 1.4.5
├── CORS 2.8.5
├── UUID 9.0.1
└── PayOS SDK 1.0.0
```

#### Database Stack
```
MongoDB 7.0
├── Mongoose ODM 8.15.1
├── Local MongoDB (Development)
└── MongoDB Atlas (Production)
```

#### Infrastructure Stack
```
Docker & Docker Compose 3.8
├── Nginx Alpine (Frontend)
├── Node.js 18 Alpine (Backend)
└── MongoDB 7.0 (Database)
```

### Architecture Principles

1. **Separation of Concerns**: Mỗi layer có trách nhiệm riêng
2. **Single Responsibility**: Mỗi service chỉ làm một việc
3. **Loose Coupling**: Services độc lập với nhau
4. **High Cohesion**: Related functionality grouped together
5. **Scalability**: Dễ dàng scale từng component
6. **Maintainability**: Code dễ đọc, dễ bảo trì
7. **Security**: Authentication, authorization, data protection
8. **Performance**: Optimization ở mọi layer

### Deployment Architecture

#### Development
- Local services trên localhost
- Local MongoDB
- Hot reload cho development

#### Production
- Docker containers cho tất cả services
- MongoDB Atlas (cloud database)
- Nginx reverse proxy
- Health checks và monitoring

---

**Tài liệu được cập nhật lần cuối: 2024-01-15**

**Ghi chú**: Kiến trúc này được thiết kế để đảm bảo tính mở rộng, bảo trì và hiệu suất cao. Các công nghệ được lựa chọn dựa trên yêu cầu của dự án và best practices của ngành.


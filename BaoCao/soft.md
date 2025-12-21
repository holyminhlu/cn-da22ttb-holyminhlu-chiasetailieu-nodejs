# 🛠️ Tài Liệu Công Nghệ - OpenLearnFoundation

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Frontend Technologies](#frontend-technologies)
3. [Backend Technologies](#backend-technologies)
4. [Database](#database)
5. [Authentication & Security](#authentication--security)
6. [File Upload & Storage](#file-upload--storage)
7. [Payment Integration](#payment-integration)
8. [API Gateway & Proxy](#api-gateway--proxy)
9. [Containerization & Deployment](#containerization--deployment)
10. [Web Server](#web-server)
11. [Development Tools](#development-tools)
12. [UI/UX Libraries](#uiux-libraries)
13. [Email Service](#email-service)
14. [Version Control & Package Management](#version-control--package-management)

---

## Tổng Quan

Dự án **OpenLearnFoundation** sử dụng kiến trúc **Microservices** với các công nghệ hiện đại:

- **Frontend**: Vue.js 3 với các thư viện UI/UX hiện đại
- **Backend**: Node.js với Express.js, chia thành nhiều microservices
- **Database**: MongoDB (Atlas Cloud & Local)
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx cho production
- **API Gateway**: Express.js với http-proxy-middleware

---

## Frontend Technologies

### Vue.js 3.2.13
**Công dụng**: Framework JavaScript chính cho frontend

**Mô tả**: 
- Progressive JavaScript framework
- Sử dụng Composition API
- Reactive data binding
- Component-based architecture

**File cấu hình**: `client/olf/package.json`

**Tính năng sử dụng**:
- Single File Components (.vue)
- Vue Router cho routing
- Reactive state management
- Component lifecycle hooks

---

### Vue Router 4.5.1
**Công dụng**: Quản lý routing và navigation trong ứng dụng Vue

**Mô tả**:
- Official router cho Vue.js
- Hỗ trợ nested routes
- Route guards và navigation guards
- History mode và hash mode

**Sử dụng trong**: `client/olf/src/routes/index.js`

---

### Bootstrap 5.3.6
**Công dụng**: CSS framework cho responsive design và UI components

**Mô tả**:
- Grid system responsive
- Pre-built components (buttons, cards, modals, etc.)
- Utility classes
- Customizable với Sass variables

**Tính năng sử dụng**:
- Responsive grid layout
- Navigation components
- Form styling
- Modal dialogs
- Cards và badges

---

### Axios 1.13.2
**Công dụng**: HTTP client để gọi API từ frontend

**Mô tả**:
- Promise-based HTTP client
- Interceptors cho request/response
- Automatic JSON data transformation
- Request/response interceptors
- Error handling

**Sử dụng trong**: 
- API calls từ Vue components
- Authentication requests
- File upload requests

---

### Core-js 3.8.3
**Công dụng**: Polyfills cho JavaScript ES6+ features

**Mô tả**:
- Đảm bảo tương thích với các trình duyệt cũ
- Polyfills cho Promise, Array methods, Object methods
- Modular imports

---

## Backend Technologies

### Node.js
**Version**: 18.x (Alpine cho Docker)

**Công dụng**: JavaScript runtime environment cho backend services

**Mô tả**:
- Event-driven, non-blocking I/O
- Single-threaded với event loop
- NPM package ecosystem
- Cross-platform

**Sử dụng trong**: Tất cả backend services

---

### Express.js
**Versions**: 
- Express 5.1.0 (API Gateway, Auth Service, Document Service, Blog Service)
- Express 4.21.2 (Course Service)
- Express 4.18.2 (Forum Service)

**Công dụng**: Web framework cho Node.js

**Mô tả**:
- Minimal và flexible
- Middleware support
- Routing system
- Template engines (không sử dụng trong dự án này)
- RESTful API support

**Tính năng sử dụng**:
- REST API endpoints
- Middleware cho CORS, logging, error handling
- Route handlers
- Request/response handling

**Sử dụng trong**: Tất cả backend services

---

### CORS 2.8.5
**Công dụng**: Middleware để xử lý Cross-Origin Resource Sharing

**Mô tả**:
- Cho phép frontend gọi API từ domain khác
- Cấu hình allowed origins
- Cấu hình allowed methods và headers
- Credentials support

**Cấu hình**:
```javascript
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

---

### Dotenv
**Version**: 16.4.5 (Course Service), 17.2.0 (API Gateway)

**Công dụng**: Quản lý biến môi trường từ file .env

**Mô tả**:
- Load environment variables từ .env file
- Bảo mật sensitive data (API keys, database URLs)
- Không commit .env vào git

**Sử dụng cho**:
- MongoDB connection strings
- JWT secrets
- Service URLs
- Payment API keys

---

### Morgan 1.10.0
**Công dụng**: HTTP request logger middleware

**Mô tả**:
- Log HTTP requests
- Format logs (combined, common, dev, short, tiny)
- Request/response logging

**Sử dụng trong**: Course Service

---

## Database

### MongoDB
**Version**: 7.0 (Docker), 8.x (Mongoose)

**Công dụng**: NoSQL database chính của dự án

**Mô tả**:
- Document-based database
- Schema-less design
- High performance
- Horizontal scaling support
- Rich query language

**Deployment**:
- **Local**: MongoDB 7.0 trong Docker container
- **Cloud**: MongoDB Atlas (MongoDB Cloud)

**Connection String Format**:
```
mongodb://127.0.0.1:27017/EduShareDB (Local)
mongodb+srv://user:password@cluster.mongodb.net/OpenLearnFoundation (Atlas)
```

**Collections sử dụng**:
- `UserCollection`: Thông tin users
- `TaiLieu`: Tài liệu
- `Courses`: Khóa học
- `Enrollments`: Đăng ký khóa học
- `Payments`: Thanh toán
- `BlogPosts`: Bài viết blog
- `posts`: Bài đăng forum
- `DocumentRatings`: Đánh giá tài liệu

---

### Mongoose 8.15.1 / 8.8.1 / 7.0.0
**Công dụng**: MongoDB Object Data Modeling (ODM) library

**Mô tả**:
- Schema definition
- Data validation
- Middleware (pre/post hooks)
- Query building
- Population (joins)
- Indexes management

**Tính năng sử dụng**:
- Schema models cho các collections
- Validation rules
- Virtual fields
- Instance methods và static methods
- Middleware hooks

**Ví dụ Schema**:
```javascript
const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passWord: { type: String, required: true }
});
```

---

## Authentication & Security

### JSON Web Token (JWT) 9.0.2
**Công dụng**: Xác thực và authorization cho users

**Mô tả**:
- Stateless authentication
- Token-based authentication
- Secure data transmission
- Token expiration

**Sử dụng trong**: Auth Service

**Token Structure**:
- Header: Algorithm và token type
- Payload: User data (userId, email, role)
- Signature: Encrypted với secret key

**Cấu hình**:
- Secret key: `JWT_SECRET` (environment variable)
- Expiration: 7 days (có thể config)
- Algorithm: HS256

---

### Bcrypt 6.0.0
**Công dụng**: Hash passwords trước khi lưu vào database

**Mô tả**:
- One-way hashing algorithm
- Salt rounds: 10
- Bảo mật passwords
- Không thể reverse hash

**Sử dụng trong**: Auth Service

**Ví dụ**:
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
const isMatch = await bcrypt.compare(password, hashedPassword);
```

---

### UUID 9.0.1
**Công dụng**: Tạo unique identifiers cho các entities

**Mô tả**:
- Generate unique IDs
- Version 4 (random UUIDs)
- Format: `user_12345678-1234-1234-1234-123456789012`

**Sử dụng cho**:
- User IDs
- Document IDs
- Course IDs
- Payment IDs
- Rating IDs

**Ví dụ**:
```javascript
const { v4: uuidv4 } = require('uuid');
const userId = `user_${uuidv4()}`;
```

---

## File Upload & Storage

### Multer
**Versions**: 
- 2.0.2 (Auth Service)
- 1.4.5-lts.1 (Course Service, Document Service, Forum Service)

**Công dụng**: Middleware để xử lý multipart/form-data (file uploads)

**Mô tả**:
- Handle file uploads
- Memory storage hoặc disk storage
- File filtering
- File size limits
- Multiple file uploads

**Cấu hình**:
- **Disk Storage**: Lưu files vào filesystem
- **File Filtering**: Chỉ chấp nhận các loại file cụ thể
- **Size Limits**: 
  - Documents: 50MB
  - Images: 5-10MB
  - Videos: 500MB

**Sử dụng trong**:
- Document uploads (PDF, PPTX, DOCX, ZIP)
- Image uploads (avatars, thumbnails, covers)
- Video uploads (course videos)

**Ví dụ**:
```javascript
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, uniqueFileName)
  }),
  limits: { fileSize: 50 * 1024 * 1024 }
});
```

---

### File System (fs)
**Công dụng**: Quản lý files trên filesystem

**Mô tả**:
- Đọc/ghi files
- Tạo thư mục
- Xóa files
- Check file existence

**Sử dụng cho**:
- Tạo upload directories
- Lưu uploaded files
- Cleanup files khi có lỗi
- Serve static files

---

## Payment Integration

### PayOS Node SDK 1.0.0
**Công dụng**: Tích hợp thanh toán qua PayOS

**Mô tả**:
- Payment gateway cho Việt Nam
- Tạo payment links
- Xử lý callbacks
- Kiểm tra trạng thái thanh toán

**Sử dụng trong**: Course Service

**Tính năng**:
- Tạo payment link
- Webhook callbacks
- Payment status checking
- Secure payment processing

**Cấu hình**:
- Client ID
- API Key
- Checksum Key
- Return URL
- Cancel URL

---

## API Gateway & Proxy

### HTTP Proxy Middleware 3.0.5
**Công dụng**: Proxy requests từ API Gateway đến các microservices

**Mô tả**:
- Route requests đến đúng service
- Path rewriting
- Request/response transformation
- Error handling
- Timeout handling

**Sử dụng trong**: API Gateway

**Tính năng**:
- Path rewriting: `/api/courses` → `/courses`
- Request forwarding
- Response streaming
- Error handling và retry logic
- Logging

**Cấu hình**:
```javascript
createProxyMiddleware({
  target: 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: { '^/api/courses': '/courses' }
});
```

---

## Containerization & Deployment

### Docker
**Công dụng**: Containerization platform

**Mô tả**:
- Package applications vào containers
- Isolated environments
- Consistent deployment
- Easy scaling

**Sử dụng cho**: Tất cả services (frontend, backend, database)

---

### Docker Compose 3.8
**Công dụng**: Orchestration tool để quản lý multiple containers

**Mô tả**:
- Define multi-container applications
- Service dependencies
- Network configuration
- Volume management
- Health checks

**File cấu hình**: `docker-compose.yml`

**Services được containerize**:
- MongoDB
- API Gateway
- Auth Service
- Course Service
- Document Service
- Blog Service
- Forum Service
- Frontend (Nginx)

**Tính năng**:
- Service dependencies
- Health checks
- Volume mounts
- Network isolation
- Environment variables

---

### Dockerfile
**Công dụng**: Instructions để build Docker images

**Cấu trúc**:
- **Multi-stage builds**: Build stage và production stage
- **Base images**: 
  - `node:18-alpine` cho backend services
  - `nginx:alpine` cho frontend
  - `mongo:7.0` cho database

**Ví dụ Frontend Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Web Server

### Nginx Alpine
**Công dụng**: Web server cho frontend trong production

**Mô tả**:
- High-performance web server
- Reverse proxy
- Static file serving
- Gzip compression
- Security headers

**Cấu hình**: `client/olf/nginx.conf`

**Tính năng sử dụng**:
- Serve static files (Vue.js build)
- API proxy đến API Gateway
- Gzip compression
- Security headers (X-Frame-Options, X-Content-Type-Options)
- Cache static assets
- SPA routing support (try_files)

**Cấu hình chính**:
- Listen port: 80
- Root: `/usr/share/nginx/html`
- API proxy: `/api` → `http://api-gateway:3000`
- Static file caching: 1 year
- Gzip: enabled

---

## Development Tools

### Nodemon 3.1.11 / 2.0.22
**Công dụng**: Auto-restart Node.js applications khi code thay đổi

**Mô tả**:
- Watch file changes
- Automatic restart
- Development productivity
- Configurable watch patterns

**Sử dụng trong**: Development mode

---

### ESLint 7.32.0
**Công dụng**: JavaScript linter và code quality tool

**Mô tả**:
- Code quality checking
- Style enforcement
- Error detection
- Best practices

**Plugins**:
- `eslint-plugin-vue`: Vue.js specific rules
- `@babel/eslint-parser`: Babel parser

**Cấu hình**: `.eslintrc.js` hoặc trong `package.json`

---

### Babel
**Versions**:
- `@babel/core`: 7.12.16
- `@babel/eslint-parser`: 7.12.16

**Công dụng**: JavaScript compiler/transpiler

**Mô tả**:
- Transpile ES6+ code thành ES5
- JSX transformation
- Plugin system
- Source maps

**Sử dụng trong**: Vue CLI build process

---

### Vue CLI 5.0.0
**Công dụng**: Command-line interface cho Vue.js development

**Mô tả**:
- Project scaffolding
- Development server
- Build tool
- Plugin system

**Plugins sử dụng**:
- `@vue/cli-plugin-babel`: Babel integration
- `@vue/cli-plugin-eslint`: ESLint integration
- `@vue/cli-service`: Build và dev server

---

## UI/UX Libraries

### AOS (Animate On Scroll) 2.3.4
**Công dụng**: Animation library khi scroll

**Mô tả**:
- Scroll-triggered animations
- Fade, slide, zoom effects
- Performance optimized
- Easy configuration

**Sử dụng cho**: Homepage animations, scroll effects

---

### GSAP (GreenSock Animation Platform) 3.13.0
**Công dụng**: Professional animation library

**Mô tả**:
- High-performance animations
- Timeline control
- Tween animations
- ScrollTrigger plugin

**Sử dụng cho**: Complex animations, interactive effects

---

### Swiper 11.2.8
**Công dụng**: Touch slider/carousel library

**Mô tả**:
- Touch-enabled sliders
- Responsive design
- Multiple slides per view
- Navigation và pagination

**Sử dụng cho**: Image carousels, document galleries

---

### SweetAlert2 11.22.0
**Công dụng**: Beautiful, customizable alert dialogs

**Mô tả**:
- Replace default browser alerts
- Customizable styling
- Promise-based API
- Icons và animations

**Sử dụng cho**: 
- Success/error notifications
- Confirmation dialogs
- Form validation messages

---

### WOW.js 1.1.3
**Công dụng**: Reveal animations khi scroll

**Mô tả**:
- Scroll-triggered animations
- Animate.css integration
- Lightweight
- Easy to use

**Sử dụng cho**: Element reveal animations

---

### Font Awesome 4.7.0
**Công dụng**: Icon library

**Mô tả**:
- Vector icons
- Scalable
- Easy to use
- Large icon set

**Sử dụng cho**: UI icons, buttons, navigation

---

### Vue Datepicker
**Versions**:
- `@vuepic/vue-datepicker`: 11.0.2
- `vue-datepicker`: 1.3.0

**Công dụng**: Date picker component cho Vue.js

**Mô tả**:
- Calendar component
- Date range selection
- Customizable styling
- Localization support

**Sử dụng cho**: Date selection trong forms

---

### Docx Preview 0.3.7
**Công dụng**: Preview DOCX files trong browser

**Mô tả**:
- Render DOCX files
- No server-side processing
- Client-side rendering
- Styled output

**Sử dụng cho**: Document preview feature

---

## Email Service

### Nodemailer 7.0.5
**Công dụng**: Email sending library

**Mô tả**:
- Send emails từ Node.js
- Support multiple transports (SMTP, SendGrid, etc.)
- HTML và text emails
- Attachments support

**Sử dụng trong**: Auth Service

**Tính năng sử dụng**:
- Email verification
- Password reset emails
- Notification emails

**Cấu hình**:
- SMTP server configuration
- Authentication credentials
- Email templates

---

## Version Control & Package Management

### Git
**Công dụng**: Version control system

**Mô tả**:
- Track code changes
- Branch management
- Collaboration
- Version history

---

### NPM (Node Package Manager)
**Công dụng**: Package manager cho Node.js

**Mô tả**:
- Install dependencies
- Manage package versions
- Script execution
- Package publishing

**Files**:
- `package.json`: Dependencies và scripts
- `package-lock.json`: Locked versions

**Commands sử dụng**:
- `npm install`: Install dependencies
- `npm start`: Start application
- `npm run build`: Build for production
- `npm run serve`: Development server

---

## Technology Stack Summary

### Frontend Stack
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

### Backend Stack
```
Node.js 18.x
├── Express.js 5.1.0 / 4.x
├── Mongoose 8.15.1
├── JWT 9.0.2
├── Bcrypt 6.0.0
├── Multer 2.0.2 / 1.4.5
├── CORS 2.8.5
├── UUID 9.0.1
└── Nodemailer 7.0.5
```

### Infrastructure Stack
```
Docker & Docker Compose 3.8
├── MongoDB 7.0
├── Nginx Alpine
├── Node.js 18 Alpine
└── Multi-stage builds
```

### Payment Stack
```
PayOS Node SDK 1.0.0
└── Payment Gateway Integration
```

### Development Stack
```
Vue CLI 5.0.0
├── Babel 7.12.16
├── ESLint 7.32.0
├── Nodemon 3.1.11
└── Git
```

---

## Architecture Patterns

### Microservices Architecture
- **API Gateway Pattern**: Single entry point cho tất cả requests
- **Service Decomposition**: Mỗi service có responsibility riêng
- **Database per Service**: Mỗi service có thể có database riêng (nhưng dự án này dùng shared MongoDB)
- **Service Communication**: HTTP/REST APIs

### Design Patterns Sử Dụng
- **Proxy Pattern**: API Gateway proxy requests
- **Middleware Pattern**: Express.js middleware chain
- **Repository Pattern**: Mongoose models
- **Factory Pattern**: UUID generation
- **Singleton Pattern**: Database connections

---

## Performance Optimizations

### Frontend
- **Code Splitting**: Vue Router lazy loading
- **Tree Shaking**: Remove unused code
- **Minification**: Production builds
- **Gzip Compression**: Nginx gzip
- **Static Asset Caching**: 1 year cache headers

### Backend
- **Connection Pooling**: Mongoose connection pooling
- **Indexing**: MongoDB indexes cho queries
- **Streaming**: File upload/download streaming
- **Caching**: Static file caching
- **Error Handling**: Centralized error handling

### Database
- **Indexes**: Optimized queries với indexes
- **Aggregation**: MongoDB aggregation pipeline
- **Connection Pooling**: Mongoose connection management
- **Atlas Cloud**: Managed MongoDB với auto-scaling

---

## Security Measures

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication
- **Password Hashing**: Bcrypt với salt rounds
- **Role-based Access**: Admin/user roles
- **Token Expiration**: 7 days expiration

### API Security
- **CORS**: Configured allowed origins
- **Input Validation**: Request validation
- **SQL Injection Prevention**: Mongoose parameterized queries
- **XSS Protection**: Nginx security headers

### File Upload Security
- **File Type Validation**: Chỉ chấp nhận allowed types
- **File Size Limits**: Prevent large file uploads
- **Filename Sanitization**: Unique filenames
- **Path Traversal Prevention**: Secure file paths

---

## Deployment Environments

### Development
- **Local MongoDB**: `mongodb://127.0.0.1:27017/EduShareDB`
- **Local Services**: Ports 3000-3006
- **Hot Reload**: Nodemon cho auto-restart
- **Source Maps**: Debug support

### Production
- **MongoDB Atlas**: Cloud database
- **Docker Containers**: Containerized services
- **Nginx**: Reverse proxy và static file serving
- **Environment Variables**: Secure configuration
- **Health Checks**: Container health monitoring

---

## Monitoring & Logging

### Logging
- **Console Logging**: Development logging
- **Morgan**: HTTP request logging
- **Error Logging**: Centralized error handling
- **File Upload Logging**: Upload progress tracking

### Health Checks
- **Docker Health Checks**: Container health monitoring
- **Service Endpoints**: `/test` endpoints cho health checks
- **Database Connection**: MongoDB connection status

---

## Future Technology Considerations

### Potential Additions
- **Redis**: Caching layer
- **Elasticsearch**: Advanced search capabilities
- **WebSocket**: Real-time features
- **GraphQL**: Alternative API architecture
- **TypeScript**: Type safety
- **Jest/Mocha**: Unit testing
- **CI/CD**: GitHub Actions, GitLab CI
- **Kubernetes**: Container orchestration
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

---

## Version Compatibility

### Node.js
- **Minimum**: Node.js 14.x
- **Recommended**: Node.js 18.x
- **Production**: Node.js 18 Alpine (Docker)

### MongoDB
- **Local**: MongoDB 7.0
- **Atlas**: Latest MongoDB version
- **Mongoose**: 8.x (compatible với MongoDB 4.4+)

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Not Supported**: IE 11
- **Mobile**: iOS Safari, Chrome Mobile

---

## Dependencies Summary

### Total Dependencies
- **Frontend**: ~25 dependencies
- **Backend Services**: ~5-10 dependencies mỗi service
- **Total**: ~50+ unique packages

### Key Dependencies
1. **Vue.js Ecosystem**: Vue, Vue Router, Vue CLI
2. **Backend Core**: Express, Mongoose, CORS
3. **Security**: JWT, Bcrypt, UUID
4. **File Handling**: Multer, fs
5. **UI Libraries**: Bootstrap, AOS, GSAP, Swiper
6. **Utilities**: Axios, SweetAlert2, Font Awesome
7. **Infrastructure**: Docker, Nginx, MongoDB

---

**Tài liệu được cập nhật lần cuối: 2024-01-15**

**Ghi chú**: Các version numbers có thể thay đổi theo thời gian. Kiểm tra `package.json` files để biết version chính xác nhất.


# 🏗️ Tài Liệu Kiến Trúc - OpenLearnFoundation

## 📋 Mục Lục

1. [Tổng Quan Kiến Trúc](#tổng-quan-kiến-trúc)
2. [Kiến Trúc Microservices](#kiến-trúc-microservices)
3. [Kiến Trúc API Gateway](#kiến-trúc-api-gateway)
4. [Kiến Trúc Frontend](#kiến-trúc-frontend)
5. [Kiến Trúc Backend Services](#kiến-trúc-backend-services)
6. [Kiến Trúc Database](#kiến-trúc-database)
7. [Kiến Trúc Deployment](#kiến-trúc-deployment)
8. [Design Patterns](#design-patterns)
9. [Communication Patterns](#communication-patterns)
10. [Data Flow Architecture](#data-flow-architecture)
11. [Security Architecture](#security-architecture)
12. [Scalability Architecture](#scalability-architecture)

---

## Tổng Quan Kiến Trúc

Dự án **OpenLearnFoundation** sử dụng kiến trúc **Microservices** với các đặc điểm:

- **Separation of Concerns**: Mỗi service có trách nhiệm riêng biệt
- **Independent Deployment**: Các service có thể deploy độc lập
- **Technology Diversity**: Có thể sử dụng công nghệ khác nhau cho từng service
- **Scalability**: Scale từng service độc lập theo nhu cầu
- **Fault Isolation**: Lỗi ở một service không ảnh hưởng toàn hệ thống

### Sơ Đồ Kiến Trúc Tổng Quan

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│                    (Vue.js Frontend)                         │
│                      Port: 8080                              │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/HTTPS
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                         │
│              (Express.js + Proxy Middleware)                 │
│                      Port: 3000                              │
│  - Request Routing                                          │
│  - CORS Handling                                            │
│  - Request Logging                                          │
│  - Error Handling                                           │
└───────┬───────────┬───────────┬───────────┬─────────────────┘
        │           │           │           │
        ▼           ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Auth    │ │ Document │ │ Course   │ │  Blog    │
│ Service  │ │ Service  │ │ Service  │ │ Service  │
│  :3001   │ │  :3003   │ │  :3004   │ │  :3006   │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │             │             │
     └────────────┴─────────────┴─────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │    MongoDB Database   │
        │  (Local/Atlas Cloud)  │
        │      Port: 27017       │
        └───────────────────────┘
```

---

## Kiến Trúc Microservices

### Nguyên Tắc Thiết Kế

1. **Single Responsibility**: Mỗi service chỉ xử lý một domain cụ thể
2. **Autonomous Services**: Mỗi service có thể chạy độc lập
3. **Decentralized Data Management**: Mỗi service quản lý data của riêng mình
4. **API-First Design**: Services giao tiếp qua REST APIs
5. **Stateless Services**: Services không lưu trữ state giữa các requests

### Danh Sách Services

| Service | Port | Responsibility | Database Collections |
|---------|------|---------------|---------------------|
| **API Gateway** | 3000 | Routing, Proxy, CORS | None |
| **Auth Service** | 3001 | Authentication, Authorization, User Management | UserCollection |
| **Document Service** | 3003 | Document Upload, Search, Management | TaiLieu, DocumentRatings |
| **Course Service** | 3004 | Course Management, Enrollment, Payments | Courses, Enrollments, Payments |
| **Forum Service** | 3005 | Forum Posts, Comments, Likes | posts |
| **Blog Service** | 3006 | Blog Posts, Tags, Featured Posts | BlogPosts |

### Service Independence

Mỗi service có:
- **Own Codebase**: Code riêng biệt trong thư mục riêng
- **Own Dependencies**: `package.json` riêng
- **Own Configuration**: Environment variables riêng
- **Own Deployment**: Có thể deploy độc lập
- **Own Scaling**: Scale độc lập theo nhu cầu

---

## Kiến Trúc API Gateway

### Vai Trò

API Gateway đóng vai trò là **single entry point** cho tất cả client requests:

1. **Request Routing**: Route requests đến đúng service
2. **Protocol Translation**: Chuyển đổi protocols nếu cần
3. **Request Aggregation**: Tổng hợp requests từ nhiều services
4. **Cross-Cutting Concerns**: Xử lý CORS, logging, error handling

### Cấu Trúc API Gateway

```
API Gateway (Port 3000)
├── Entry Point (index.js)
│   ├── CORS Configuration
│   ├── Body Parser (selective)
│   ├── Logger Middleware
│   └── Route Registration
│
├── Routes (routes/)
│   ├── proxyRoutes.js (Main Router)
│   ├── authProxy.js → Auth Service
│   ├── documentsProxy.js → Document Service
│   ├── coursesProxy.js → Course Service
│   ├── forumProxy.js → Forum Service
│   ├── blogsProxy.js → Blog Service
│   ├── adminProxy.js → Auth Service (/admin)
│   ├── paymentsProxy.js → Course Service
│   └── ratingProxy.js → Forum Service
│
└── Middleware (middleware/)
    └── loggerMid.js (Request Logging)
```

### Proxy Pattern Implementation

**Path Rewriting**:
- `/api/auth/*` → `http://auth-service:3001/*`
- `/api/documents/*` → `http://document-service:3003/documents/*`
- `/api/courses/*` → `http://course-service:3004/courses/*`
- `/api/admin/*` → `http://auth-service:3001/admin/*`

**Request Flow**:
```
Client Request: POST /api/auth/login
    ↓
API Gateway receives request
    ↓
CORS check passes
    ↓
Body parsing skipped (for proxy routes)
    ↓
Route matching: /api/auth → authProxy
    ↓
Path rewrite: /api/auth/login → /login
    ↓
Proxy to: http://localhost:3001/login
    ↓
Response from Auth Service
    ↓
Return to Client
```

### Features

1. **Selective Body Parsing**: 
   - Skip body parsing cho proxy routes
   - Parse body cho non-proxy routes (/, /test)

2. **CORS Configuration**:
   - Allowed origins: localhost:8080, localhost:3000
   - Allowed methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
   - Credentials: true

3. **Error Handling**:
   - Service unavailable (503)
   - Timeout errors (504)
   - Connection refused (503)

4. **Logging**:
   - Request logging với timestamp
   - Response logging
   - Error logging

---

## Kiến Trúc Frontend

### Component-Based Architecture

Frontend sử dụng **Vue.js 3** với kiến trúc component-based:

```
Frontend (Vue.js 3)
├── Entry Point (main.js)
│   ├── Vue App Creation
│   ├── Router Registration
│   └── Global Components
│
├── Views (views/)
│   ├── HomeView.vue
│   ├── DocumentsView.vue
│   ├── CoursesView.vue
│   ├── SignInView.vue
│   ├── SignUpView.vue
│   ├── UserProfileView.vue
│   ├── AdminDashboardView.vue
│   └── ...
│
├── Components (components/)
│   ├── HeaderComponent.vue
│   ├── FooterComponent.vue
│   ├── DocumentCard.vue
│   ├── SearchBar.vue
│   ├── UploadModal.vue
│   └── ...
│
├── Router (routes/index.js)
│   ├── Route Definitions
│   ├── Route Guards
│   └── Lazy Loading
│
└── Utils (utils/)
    ├── authAPI.js (API calls)
    ├── documentAPI.js
    ├── courseAPI.js
    └── eventBus.js (Event communication)
```

### Routing Architecture

**Vue Router 4** với các tính năng:

1. **Lazy Loading**: Load components khi cần
2. **Route Guards**: Authentication checks
3. **Nested Routes**: Hierarchical routing
4. **Query Parameters**: Search và filter

**Route Structure**:
```javascript
/                    → HomeView
/documents           → DocumentsView
/documents/:id       → DocumentDetailView
/courses             → CoursesView
/courses/:id         → CourseDetailView
/signin              → SignInView
/signup              → SignUpView
/profile             → UserProfileView (protected)
/admin               → AdminDashboardView (admin only)
```

### State Management

**Current**: Event Bus pattern
- Global event bus cho component communication
- Simple state sharing

**Future Consideration**: Vuex/Pinia
- Centralized state management
- Better for complex state

### API Communication

**Axios** được sử dụng cho tất cả API calls:

```javascript
// Centralized API configuration
axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
```

**Error Handling**:
- Global error interceptor
- Response transformation
- Error messages to user

---

## Kiến Trúc Backend Services

### Common Service Structure

Mỗi backend service tuân theo cấu trúc chuẩn:

```
service-name/
├── index.js              # Entry point, Express app setup
├── package.json          # Dependencies
├── routes/               # Route definitions
│   └── [service]Route.js
├── controllers/          # Business logic
│   └── [service]Controller.js
├── models/               # Database models (Mongoose)
│   └── [service]Model.js
├── middleware/           # Custom middleware (optional)
│   └── authMiddleware.js
├── uploads/             # File storage (if applicable)
│   ├── documents/
│   ├── thumbnails/
│   └── videos/
└── .env                  # Environment variables
```

### Service Architecture Pattern

**Layered Architecture**:

```
┌─────────────────────────────────┐
│      Route Layer                 │
│  (HTTP Request/Response)        │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│    Controller Layer              │
│  (Business Logic)                │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│      Model Layer                │
│  (Data Access)                   │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│    Database Layer               │
│  (MongoDB)                       │
└─────────────────────────────────┘
```

### Auth Service Architecture

**Responsibilities**:
- User registration và authentication
- JWT token generation và validation
- Password hashing (bcrypt)
- User profile management
- Admin operations

**Routes**:
```
POST   /register          → CreateAccount
POST   /login             → LoginAccount
POST   /checkemail        → checkEmailExists
GET    /verify            → verifyEmail
GET    /customer          → getCustomerByEmail
POST   /customer/update   → updateCustomerInfo
POST   /profile/avatar     → uploadAvatarImage
POST   /profile/cover      → uploadCoverImage
```

**Admin Routes** (Protected):
```
GET    /admin/users       → getAllUsers
GET    /admin/users/:id   → getUserById
PUT    /admin/users/:id   → updateUser
DELETE /admin/users/:id   → deleteUser
```

**Security Middleware**:
- `authenticateToken`: Verify JWT token
- `checkRole(['admin'])`: Check user role

### Document Service Architecture

**Responsibilities**:
- Document upload và storage
- Document search và filtering
- Document metadata management
- Bookmark management
- View và download tracking

**File Upload Flow**:
```
Client (multipart/form-data)
    ↓
API Gateway (pass through)
    ↓
Document Service
    ↓
Multer Middleware
    ├── File Validation
    ├── File Storage (disk)
    └── Metadata Extraction
    ↓
Mongoose Model
    ├── Save to MongoDB
    └── Update User Collection
    ↓
Response to Client
```

**Search Architecture**:
- MongoDB text search
- Indexed fields: title, description, tags
- Filter by: program, category, tags
- Sort by: newest, downloads, rating

### Course Service Architecture

**Responsibilities**:
- Course creation và management
- Course enrollment
- Progress tracking
- Payment integration (PayOS)
- Course statistics

**Enrollment Flow**:
```
User requests enrollment
    ↓
Check if already enrolled
    ↓
Check if course is free
    ├── Free: Direct enrollment
    └── Paid: Create payment
    ↓
Create enrollment record
    ↓
Update user's enrolled_courses
    ↓
Update course enrollmentCount
    ↓
Return enrollment confirmation
```

**Payment Integration**:
- PayOS SDK integration
- Payment link generation
- Webhook callbacks
- Payment status tracking

### Forum Service Architecture

**Responsibilities**:
- Post creation và management
- Comments system
- Like/Unlike functionality
- Image uploads

**Post Structure**:
```
Post
├── Author (User reference)
├── Content
├── Images
├── Likes (Array of user IDs)
└── Comments (Nested array)
    └── Comment
        ├── Author
        ├── Content
        └── Timestamp
```

### Blog Service Architecture

**Responsibilities**:
- Blog post management
- Featured posts
- Popular posts
- Related posts
- Tags management

**Post Features**:
- Featured flag
- View tracking
- Like tracking
- Tag-based categorization
- Related posts algorithm

---

## Kiến Trúc Database

### Database Strategy

**Shared Database Pattern**:
- Tất cả services chia sẻ một MongoDB database
- Database: `EduShareDB` hoặc `OpenLearnFoundation`
- Mỗi service sử dụng collections riêng

**Collections Mapping**:

| Service | Collections |
|---------|-------------|
| Auth Service | `UserCollection` |
| Document Service | `TaiLieu`, `DocumentRatings` |
| Course Service | `Courses`, `Enrollments`, `Payments` |
| Forum Service | `posts` |
| Blog Service | `BlogPosts` |

### Database Connection Architecture

**Connection Pattern**:
```javascript
// Each service has its own connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
```

**Connection Pooling**:
- Mongoose tự động quản lý connection pool
- Max pool size: 10 (default)
- Min pool size: 2 (Course Service)

### Data Model Architecture

**Mongoose Schema Pattern**:
```javascript
const schema = new mongoose.Schema({
  // Unique identifier
  entity_id: { type: String, required: true, unique: true },
  
  // Timestamps
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  
  // Soft delete
  is_active: { type: Boolean, default: true }
})
```

**Indexing Strategy**:
- Unique indexes cho IDs
- Text indexes cho search
- Compound indexes cho queries thường dùng
- TTL indexes cho data expiration (nếu cần)

### Data Relationships

**Reference Pattern**:
- User references: `user_id` (String)
- Document references: `document_id` (String)
- Course references: `course_id` (String)

**Population Pattern**:
```javascript
// Populate user info when needed
Document.findById(id).populate('author', 'fullName email avatar_url')
```

---

## Kiến Trúc Deployment

### Docker Architecture

**Container Strategy**:
- Mỗi service chạy trong container riêng
- Multi-stage builds cho optimization
- Shared network cho inter-service communication

**Docker Compose Architecture**:

```
docker-compose.yml
├── Services
│   ├── mongodb (Database)
│   ├── api-gateway (API Gateway)
│   ├── auth-service (Auth Service)
│   ├── document-service (Document Service)
│   ├── course-service (Course Service)
│   ├── forum-service (Forum Service)
│   ├── blog-service (Blog Service)
│   └── frontend (Nginx + Vue.js)
│
├── Networks
│   └── openlearn-network (Bridge network)
│
└── Volumes
    ├── mongodb_data (Persistent storage)
    └── service/uploads (File storage)
```

### Multi-Stage Build Architecture

**Frontend Build**:
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**Backend Build**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE [PORT]
CMD ["node", "index.js"]
```

### Nginx Architecture (Frontend)

**Reverse Proxy Pattern**:
```
Client Request
    ↓
Nginx (Port 80)
    ├── /api/* → Proxy to API Gateway (Port 3000)
    └── /* → Serve static files (Vue.js build)
```

**Nginx Configuration**:
- API proxy với timeout settings
- Static file serving với caching
- Gzip compression
- Security headers
- SPA routing support

### Health Check Architecture

**Docker Health Checks**:
```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:PORT/test', ...)"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

**Service Health Endpoints**:
- `GET /test`: Health check endpoint
- Returns service status và available endpoints

---

## Design Patterns

### 1. API Gateway Pattern

**Mục đích**: Single entry point cho tất cả client requests

**Implementation**:
- Express.js application
- HTTP Proxy Middleware
- Route-based proxying

**Benefits**:
- Centralized CORS handling
- Request routing
- Service discovery
- Load balancing (future)

### 2. Proxy Pattern

**Mục đích**: Forward requests từ gateway đến services

**Implementation**:
- `http-proxy-middleware` library
- Path rewriting
- Request/response transformation

**Benefits**:
- Service abstraction
- Protocol translation
- Request aggregation

### 3. Repository Pattern

**Mục đích**: Abstraction layer cho data access

**Implementation**:
- Mongoose models
- Schema definitions
- Query methods

**Benefits**:
- Data access abstraction
- Easy testing
- Consistent data access

### 4. Middleware Pattern

**Mục đích**: Cross-cutting concerns

**Implementation**:
- Express middleware chain
- Request/response interceptors
- Error handling middleware

**Middleware Types**:
- Authentication middleware
- Logging middleware
- Error handling middleware
- Validation middleware

### 5. Factory Pattern

**Mục đích**: Create objects với common interface

**Implementation**:
- UUID generation
- File naming
- Model instantiation

### 6. Singleton Pattern

**Mục đích**: Single instance của resources

**Implementation**:
- MongoDB connection (Mongoose)
- Express app instance
- Configuration objects

### 7. Strategy Pattern

**Mục đích**: Interchangeable algorithms

**Implementation**:
- File upload strategies (disk storage)
- Search strategies (text search, filter)
- Payment strategies (PayOS)

### 8. Observer Pattern

**Mục đích**: Event-driven communication

**Implementation**:
- Event Bus (Frontend)
- Request/response events
- File upload progress events

---

## Communication Patterns

### Synchronous Communication

**HTTP/REST APIs**:
- Request-response pattern
- Stateless communication
- JSON data format

**Service-to-Service**:
```
API Gateway → Auth Service (HTTP)
API Gateway → Document Service (HTTP)
API Gateway → Course Service (HTTP)
```

### Request Flow Pattern

**Standard Request Flow**:
```
1. Client → API Gateway
2. API Gateway → Service
3. Service → Database
4. Database → Service
5. Service → API Gateway
6. API Gateway → Client
```

### Error Propagation Pattern

**Error Handling Chain**:
```
Service Error
    ↓
Service Error Handler
    ↓
API Gateway Error Handler
    ↓
Client Error Response
```

### Authentication Flow Pattern

**JWT Authentication Flow**:
```
1. Client → POST /api/auth/login
2. API Gateway → Auth Service
3. Auth Service → Verify credentials
4. Auth Service → Generate JWT
5. Auth Service → Return token
6. Client → Store token
7. Client → Include token in subsequent requests
8. API Gateway → Verify token (if needed)
9. Service → Process request
```

---

## Data Flow Architecture

### Document Upload Flow

```
1. User selects file (Frontend)
    ↓
2. FormData created with file + metadata
    ↓
3. POST /api/documents/upload (Axios)
    ↓
4. API Gateway receives request
    ↓
5. Gateway proxies to Document Service
    ↓
6. Document Service:
    ├── Multer receives file
    ├── File validation
    ├── Save to disk (uploads/documents/)
    ├── Generate document_id
    ├── Save metadata to MongoDB
    └── Update user's uploaded_documents
    ↓
7. Response with document info
    ↓
8. Frontend displays success message
```

### Document Search Flow

```
1. User enters search query (Frontend)
    ↓
2. GET /api/documents/search?q=... (Axios)
    ↓
3. API Gateway → Document Service
    ↓
4. Document Service:
    ├── Build MongoDB query
    ├── Text search on indexed fields
    ├── Apply filters (program, tags, etc.)
    ├── Sort results
    ├── Paginate results
    └── Populate author info
    ↓
5. Return results array
    ↓
6. Frontend displays results
```

### Course Enrollment Flow

```
1. User clicks "Enroll" (Frontend)
    ↓
2. POST /api/courses/:id/enroll (Axios)
    ↓
3. API Gateway → Course Service
    ↓
4. Course Service:
    ├── Check if already enrolled
    ├── Check if course is free
    │   ├── Free: Create enrollment
    │   └── Paid: Create payment link
    ├── Create enrollment record
    ├── Update user's enrolled_courses
    └── Update course enrollmentCount
    ↓
5. Return enrollment confirmation
    ↓
6. Frontend updates UI
```

### Payment Flow

```
1. User initiates payment (Frontend)
    ↓
2. POST /api/payments/create (Axios)
    ↓
3. API Gateway → Course Service
    ↓
4. Course Service:
    ├── Create payment record
    ├── Call PayOS API
    ├── Generate payment link
    └── Save payment_id
    ↓
5. Return payment link
    ↓
6. Frontend redirects to PayOS
    ↓
7. User completes payment
    ↓
8. PayOS → Webhook callback
    ↓
9. Course Service:
    ├── Verify payment
    ├── Update payment status
    └── Create enrollment
    ↓
10. Frontend polls payment status
```

---

## Security Architecture

### Authentication Architecture

**JWT-Based Authentication**:
```
User Login
    ↓
Credentials Verification
    ↓
JWT Token Generation
    ├── Payload: { userId, email, role }
    ├── Secret: JWT_SECRET
    └── Expiration: 7 days
    ↓
Token Returned to Client
    ↓
Token Stored (localStorage/sessionStorage)
    ↓
Token Included in Requests
    ↓
Token Verification (if needed)
```

**Token Structure**:
- Header: Algorithm (HS256)
- Payload: User data
- Signature: HMAC SHA256

### Authorization Architecture

**Role-Based Access Control (RBAC)**:
```
Request with JWT Token
    ↓
Token Verification
    ↓
Extract User Role
    ↓
Check Required Role
    ├── Public: No check
    ├── User: role = 'user' or 'admin'
    └── Admin: role = 'admin'
    ↓
Allow or Deny Request
```

**Protected Routes**:
- Admin routes: `/api/admin/*`
- User routes: Profile, uploads (future)

### Password Security Architecture

**Password Hashing Flow**:
```
User Registration
    ↓
Password Input
    ↓
Bcrypt Hash
    ├── Salt Rounds: 10
    ├── One-way hashing
    └── Secure storage
    ↓
Save to Database
    ↓
Password never stored in plain text
```

**Password Verification Flow**:
```
User Login
    ↓
Password Input
    ↓
Retrieve Hashed Password from DB
    ↓
Bcrypt Compare
    ├── Hash input password
    └── Compare with stored hash
    ↓
Match or No Match
```

### API Security Architecture

**CORS Configuration**:
- Allowed origins: Whitelist
- Allowed methods: Specific HTTP methods
- Credentials: Controlled access

**Input Validation**:
- Request body validation
- File type validation
- File size limits
- SQL injection prevention (Mongoose)

**Error Handling**:
- Don't expose sensitive errors
- Generic error messages in production
- Detailed errors in development

---

## Scalability Architecture

### Horizontal Scaling Strategy

**Service Scaling**:
- Mỗi service có thể scale độc lập
- Stateless services → Easy scaling
- Load balancer (future) → Distribute requests

**Database Scaling**:
- MongoDB Atlas → Auto-scaling
- Read replicas (future)
- Sharding (future, if needed)

### Vertical Scaling Strategy

**Resource Allocation**:
- Docker resource limits
- CPU và memory limits per container
- Database connection pooling

### Caching Strategy

**Current**: No caching layer

**Future Considerations**:
- Redis cho session storage
- Redis cho API response caching
- CDN cho static assets
- Browser caching (đã có)

### Performance Optimization

**Frontend**:
- Code splitting
- Lazy loading
- Image optimization
- Gzip compression (Nginx)

**Backend**:
- Database indexing
- Query optimization
- Connection pooling
- File streaming

**Database**:
- Indexes trên frequently queried fields
- Compound indexes cho complex queries
- Text indexes cho search

---

## Architecture Diagrams

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                         Internet                              │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    Load Balancer (Future)                    │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                      Nginx (Frontend)                        │
│                    Port: 80 (8080)                           │
│  - Serve Vue.js static files                                 │
│  - Proxy /api/* to API Gateway                               │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    API Gateway                                │
│                    Port: 3000                                │
│  - Request Routing                                           │
│  - CORS Handling                                             │
│  - Request Logging                                           │
└───┬──────┬──────┬──────┬──────┬──────┬───────────────────────┘
    │      │      │      │      │      │
    ▼      ▼      ▼      ▼      ▼      ▼
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│Auth │ │Doc │ │Course│ │Forum│ │Blog │ │... │
│:3001│ │:3003│ │:3004│ │:3005│ │:3006│ │     │
└──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘
   │       │       │       │       │       │
   └───────┴───────┴───────┴───────┴───────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   MongoDB Database    │
        │  (Atlas Cloud/Local)  │
        │      Port: 27017       │
        └───────────────────────┘
```

### Request Flow Diagram

```
┌─────────┐
│ Client  │
└────┬────┘
     │ 1. HTTP Request
     ▼
┌─────────────────┐
│   API Gateway   │
│  - CORS Check   │
│  - Route Match  │
│  - Proxy Setup  │
└────┬────────────┘
     │ 2. Proxy Request
     ▼
┌─────────────────┐
│  Backend Service│
│  - Parse Body   │
│  - Validate     │
│  - Process      │
└────┬────────────┘
     │ 3. Query
     ▼
┌─────────────────┐
│    MongoDB      │
│  - Execute Query│
│  - Return Data  │
└────┬────────────┘
     │ 4. Response
     ▼
┌─────────────────┐
│  Backend Service│
│  - Format Data  │
│  - Send Response│
└────┬────────────┘
     │ 5. Proxy Response
     ▼
┌─────────────────┐
│   API Gateway   │
│  - Log Response │
│  - Return to Client│
└────┬────────────┘
     │ 6. HTTP Response
     ▼
┌─────────┐
│ Client  │
└─────────┘
```

### Deployment Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Host                               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Docker Network (Bridge)                    │   │
│  │                                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │   │
│  │  │ Frontend │  │   API    │  │  Auth    │         │   │
│  │  │ (Nginx)  │  │ Gateway  │  │ Service  │         │   │
│  │  └──────────┘  └──────────┘  └──────────┘         │   │
│  │                                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │   │
│  │  │Document  │  │ Course   │  │  Forum   │         │   │
│  │  │ Service  │  │ Service  │  │ Service  │         │   │
│  │  └──────────┘  └──────────┘  └──────────┘         │   │
│  │                                                      │   │
│  │  ┌──────────┐                                      │   │
│  │  │ MongoDB  │                                      │   │
│  │  │ Container│                                      │   │
│  │  └──────────┘                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Docker Volumes                          │   │
│  │  - mongodb_data (Persistent)                         │   │
│  │  - service/uploads (File storage)                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ MongoDB Atlas │
                    │  (Cloud DB)   │
                    └───────────────┘
```

---

## Best Practices

### Service Design

1. **Single Responsibility**: Mỗi service chỉ làm một việc
2. **Stateless Services**: Không lưu state giữa requests
3. **API-First**: Design APIs trước khi implement
4. **Versioning**: API versioning cho backward compatibility
5. **Documentation**: API documentation đầy đủ

### Code Organization

1. **Layered Architecture**: Routes → Controllers → Models
2. **Separation of Concerns**: Business logic tách khỏi data access
3. **Error Handling**: Centralized error handling
4. **Logging**: Structured logging
5. **Configuration**: Environment-based configuration

### Security

1. **Authentication**: JWT tokens
2. **Authorization**: Role-based access control
3. **Input Validation**: Validate all inputs
4. **Password Security**: Bcrypt hashing
5. **CORS**: Configured properly

### Performance

1. **Database Indexing**: Indexes trên queried fields
2. **Connection Pooling**: Reuse database connections
3. **File Streaming**: Stream large files
4. **Caching**: Cache frequently accessed data (future)
5. **Code Splitting**: Lazy load components

---

## Future Architecture Considerations

### Potential Improvements

1. **Message Queue**: RabbitMQ/Kafka cho async communication
2. **Service Mesh**: Istio cho service-to-service communication
3. **API Gateway Enhancement**: Rate limiting, circuit breaker
4. **Caching Layer**: Redis cho caching
5. **Search Engine**: Elasticsearch cho advanced search
6. **Monitoring**: Prometheus + Grafana
7. **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
8. **CI/CD**: GitHub Actions hoặc GitLab CI
9. **Kubernetes**: Container orchestration
10. **GraphQL**: Alternative API architecture

### Scalability Enhancements

1. **Load Balancing**: Distribute requests across service instances
2. **Database Sharding**: Partition data across multiple databases
3. **CDN**: Content delivery network cho static assets
4. **Microservices Communication**: gRPC cho inter-service calls
5. **Event-Driven Architecture**: Event sourcing và CQRS

---

**Tài liệu được cập nhật lần cuối: 2024-01-15**

**Ghi chú**: Kiến trúc này được thiết kế để dễ dàng mở rộng và bảo trì. Các service có thể được thêm, sửa, hoặc xóa mà không ảnh hưởng đến các service khác.


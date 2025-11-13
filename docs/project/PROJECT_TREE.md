# Cấu trúc cây thư mục dự án OpenLearnFoundation

```
OpenLearnFoundation/
│
├── 📄 README.md                          # Tài liệu chính của dự án
├── 📄 package.json                       # Cấu hình npm root
├── 📄 package-lock.json                  # Lock file npm
│
├── 📁 client/                            # Frontend Application
│   └── olf/                              # OpenLearnFoundation Client
│       ├── 📄 package.json
│       ├── 📄 package-lock.json
│       ├── 📄 babel.config.js            # Cấu hình Babel
│       ├── 📄 vue.config.js              # Cấu hình Vue CLI
│       ├── 📄 jsconfig.json              # Cấu hình JavaScript
│       ├── 📄 Dockerfile                 # Docker configuration
│       ├── 📄 README.md                  # Tài liệu client
│       │
│       ├── 📁 public/                    # Static files
│       │   ├── index.html
│       │   ├── favicon.ico
│       │   └── img/                      # Hình ảnh tĩnh
│       │       ├── articles/             # Hình ảnh bài viết (65+ files)
│       │       ├── images/               # Hình ảnh khác
│       │       └── [96+ image files: .png, .jpg, .webp, .svg]
│       │
│       ├── 📁 src/                       # Source code
│       │   ├── main.js                   # Entry point
│       │   ├── App.vue                   # Root component
│       │   │
│       │   ├── 📁 assets/                # Assets
│       │   │   ├── logo.png
│       │   │   └── styles/
│       │   │       └── design-tokens.css
│       │   │
│       │   ├── 📁 components/            # Vue Components
│       │   │   ├── AccountDropdown.vue
│       │   │   ├── CollectionCarousel.vue
│       │   │   ├── DocumentCard.vue
│       │   │   ├── FeaturedInstructors.vue
│       │   │   ├── FilterPanel.vue
│       │   │   ├── FooterComponent.vue
│       │   │   ├── HeaderComponent.vue
│       │   │   ├── HelloWorld.vue
│       │   │   ├── HeroSection.vue
│       │   │   ├── PreviewModal.vue
│       │   │   ├── SearchBar.vue
│       │   │   ├── ToastNotification.vue
│       │   │   ├── UploadModal.vue
│       │   │   │
│       │   │   ├── 📁 auth/              # Auth components
│       │   │   │   ├── InputField.vue
│       │   │   │   └── PasswordField.vue
│       │   │   │
│       │   │   └── 📁 profile/           # Profile components
│       │   │       ├── ActivityTimeline.vue
│       │   │       ├── AvatarUploader.vue
│       │   │       ├── ConfirmModal.vue
│       │   │       ├── CoverUploader.vue
│       │   │       ├── EditProfileModal.vue
│       │   │       ├── ProfileHero.vue
│       │   │       ├── ProfileStats.vue
│       │   │       ├── ProfileTabs.vue
│       │   │       ├── SecurityForm.vue
│       │   │       ├── SettingsForm.vue
│       │   │       └── Toast.vue
│       │   │
│       │   ├── 📁 views/                 # Page Views
│       │   │   ├── AuthView.vue
│       │   │   ├── ClassRegisterView.vue
│       │   │   ├── ComingSoonView.vue
│       │   │   ├── CourseIntroductionView.vue
│       │   │   ├── CourseLearningView.vue
│       │   │   ├── CoursesView.vue
│       │   │   ├── DocumentsView.vue
│       │   │   ├── HelpView.vue
│       │   │   ├── HomeView.vue
│       │   │   ├── HomeViewClean.vue
│       │   │   ├── MyClassesView.vue
│       │   │   ├── MyCoursesView.vue
│       │   │   ├── SignInView.vue
│       │   │   ├── SignUpView.vue
│       │   │   ├── UploadCourseView.vue
│       │   │   ├── UserInfoView.vue
│       │   │   ├── UserProfileView.vue
│       │   │   │
│       │   │   └── 📁 Articles/          # Article views
│       │   │       ├── Blog.vue
│       │   │       ├── ChinhSach.vue
│       │   │       ├── DienDan.vue
│       │   │       ├── GioiThieu.vue
│       │   │       ├── HomePage.vue
│       │   │       ├── HotNews.vue
│       │   │       └── 📁 data/
│       │   │           └── news.js
│       │   │
│       │   ├── 📁 routes/                # Routing
│       │   │   └── index.js
│       │   │
│       │   ├── 📁 utils/                 # Utilities
│       │   │   ├── authAPI.js
│       │   │   ├── courseAPI.js
│       │   │   ├── eventBus.js
│       │   │   └── validate.js
│       │   │
│       │   └── 📁 data/                  # Static data
│       │       ├── documentsData.json
│       │       └── homepageData.json
│       │
│       └── 📁 tests/                     # Tests
│           ├── accessibility.test.js
│           └── DocumentCard.test.js
│
├── 📁 server/                            # Backend Services
│   │
│   ├── 📁 api-gateway/                   # API Gateway Service
│   │   ├── 📄 package.json
│   │   ├── 📄 package-lock.json
│   │   ├── 📄 test-courses-route.js
│   │   │
│   │   └── 📁 src/
│   │       ├── index.js                  # Entry point
│   │       │
│   │       ├── 📁 middleware/
│   │       │   └── loggerMid.js          # Logging middleware
│   │       │
│   │       └── 📁 routes/                # Proxy routes
│   │           ├── proxyRoutes.js
│   │           ├── authProxy.js
│   │           ├── bookingProxy.js
│   │           ├── coursesProxy.js
│   │           ├── discountsProxy.js
│   │           ├── documentsProxy.js
│   │           ├── ratingProxy.js
│   │           └── toursProxy.js
│   │
│   ├── 📁 auth-service/                  # Authentication Service
│   │   ├── 📄 package.json
│   │   ├── 📄 package-lock.json
│   │   ├── 📄 index.js                   # Entry point
│   │   │
│   │   ├── 📁 controllers/
│   │   │   └── authController.js
│   │   │
│   │   ├── 📁 models/
│   │   │   └── authModel.js
│   │   │
│   │   ├── 📁 routes/
│   │   │   └── authRoute.js
│   │   │
│   │   ├── 📁 middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── 📁 uploads/                   # Uploaded files
│   │   │   ├── avatars/                  # User avatars
│   │   │   └── covers/                   # Cover images
│   │   │
│   │   └── 📄 [debug/test files]
│   │       ├── DEBUG_SERVICE_NO_ERROR.md
│   │       ├── TROUBLESHOOTING.md
│   │       ├── debug-register.js
│   │       ├── debug-request.js
│   │       ├── run-all-debug.js
│   │       ├── start-and-test.js
│   │       ├── test-connection.js
│   │       ├── test-register.js
│   │       └── test-service.js
│   │
│   ├── 📁 course-service/                # Course Service
│   │   ├── 📄 package.json
│   │   ├── 📄 package-lock.json
│   │   ├── 📄 index.js                   # Entry point
│   │   ├── 📄 import-sample-courses.js
│   │   ├── 📄 test-api.js
│   │   │
│   │   ├── 📁 controllers/
│   │   │   └── courseController.js
│   │   │
│   │   ├── 📁 models/
│   │   │   ├── courseModel.js
│   │   │   └── enrollmentModel.js
│   │   │
│   │   ├── 📁 routes/
│   │   │   └── courseRoute.js
│   │   │
│   │   └── 📁 uploads/
│   │       ├── thumbnails/               # Course thumbnails
│   │       └── videos/                   # Course videos
│   │
│   ├── 📁 document-service/              # Document Service
│   │   ├── 📄 package.json
│   │   ├── 📄 package-lock.json
│   │   ├── 📄 index.js                   # Entry point
│   │   ├── 📄 test-save-bookmark.js
│   │   │
│   │   ├── 📁 controllers/
│   │   │   └── documentController.js
│   │   │
│   │   ├── 📁 models/
│   │   │   ├── documentModel.js
│   │   │   └── userModel.js
│   │   │
│   │   ├── 📁 routes/
│   │   │   └── documentRoute.js
│   │   │
│   │   └── 📁 uploads/
│   │       ├── documents/                # Uploaded documents
│   │       └── thumbnails/               # Document thumbnails
│   │
│   ├── 📁 tours-service/                 # Tours Service
│   │   ├── 📄 package.json
│   │   ├── 📄 package-lock.json
│   │   ├── 📄 index.js                   # Entry point
│   │   ├── 📄 updateDestination.js
│   │   │
│   │   ├── 📁 controllers/
│   │   │   └── tourController.js
│   │   │
│   │   ├── 📁 models/
│   │   │   └── tourModel.js
│   │   │
│   │   └── 📁 routes/
│   │       └── tourRoute.js
│   │
│   ├── 📁 uploads/                       # Shared uploads
│   │   ├── documents/
│   │   └── thumbnails/
│   │
│   └── 📄 START_SERVICES.md              # Hướng dẫn khởi động services
│
└── 📁 docs/                              # 📚 Tài liệu dự án (đã được tổ chức)
    ├── 📄 README.md                      # Hướng dẫn sử dụng docs
    │
    ├── 📁 auth/                          # Tài liệu xác thực (4 files)
    │   ├── ACCOUNT_STORAGE_INFO.md
    │   ├── AUTH_API_DOCUMENTATION.md
    │   ├── AUTH_QUICK_START.md
    │   └── AUTH_SETUP_GUIDE.md
    │
    ├── 📁 debug/                         # Tài liệu debug (9 files)
    │   ├── COURSE_SERVICE_DEBUG.md
    │   ├── DEBUG_PROXY_ISSUE.md
    │   ├── DEBUG_REGISTER_ERROR.md
    │   ├── DEBUG_REGISTER_GUIDE.md
    │   ├── DEBUG_RESULT_SUMMARY.md
    │   ├── DEBUG_SAVE_DOCUMENT.md
    │   ├── DEBUG_UPLOAD_CONNECTION.md
    │   ├── HOW_TO_DEBUG_REGISTER.md
    │   └── SERVICE_NOT_WORKING_DEBUG.md
    │
    ├── 📁 fixes/                         # Tài liệu sửa lỗi (8 files)
    │   ├── FIX_API_GATEWAY_COURSES.md
    │   ├── FIX_REGISTER_ERROR.md
    │   ├── FIX_UPLOAD_ISSUES.md
    │   ├── QUICK_FIX_COURSES.md
    │   ├── QUICK_FIX_PROXY.md
    │   ├── QUICK_FIX_SAVE_BOOKMARK.md
    │   ├── QUICK_FIX_SERVICE.md
    │   └── TROUBLESHOOT_SAVE_DOCUMENT.md
    │
    ├── 📁 services/                      # Tài liệu services
    │   └── 📁 document/                  # Document Service (5 files)
    │       ├── CHECK_DOCUMENT_SERVICE.md
    │       ├── DOCUMENT_SERVICE_COMPLETE_GUIDE.md
    │       ├── DOCUMENT_SERVICE_GUIDE.md
    │       ├── DOCUMENT_SERVICE_SUMMARY.md
    │       └── test-bookmark-api.md
    │
    ├── 📁 mongodb/                       # Tài liệu MongoDB (6 files)
    │   ├── HOW_TO_CREATE_NEW_MONGODB_CONNECTION.md
    │   ├── MONGODB_CONFIG_UPDATE.md
    │   ├── MONGODB_CONNECTION_GUIDE.md
    │   ├── MONGODB_SCHEMA_DESIGN.json
    │   ├── MONGODB_SCHEMA_README.md
    │   └── VIEW_MONGODB_DATA.md
    │
    ├── 📁 quick-start/                   # Hướng dẫn nhanh (6 files)
    │   ├── QUICK_RESTART.md
    │   ├── QUICK_START_SERVICE.md
    │   ├── QUICK_START.md
    │   ├── RESTART_NOW.md
    │   ├── RESTART_SERVICES_INSTRUCTION.md
    │   └── UPLOAD_SETUP_GUIDE.md
    │
    ├── 📁 testing/                       # Tài liệu testing (2 files)
    │   ├── FINAL_TEST_CHECKLIST.md
    │   └── HOW_TO_TEST_REGISTER.md
    │
    ├── 📁 deployment/                    # Tài liệu triển khai (2 files)
    │   ├── DEPLOYMENT_CHECKLIST.md
    │   └── DEPLOYMENT_STATUS.md
    │
    ├── 📁 project/                       # Tài liệu dự án (5 files)
    │   ├── ACTION_REQUIRED.md
    │   ├── FINISHED_SUMMARY.md
    │   ├── INTEGRATION_SUMMARY.md
    │   ├── NEXT_STEPS_AFTER_DEBUG.md
    │   └── PROJECT_TREE.md               # ← File này
    │
    ├── 📁 edushare/                      # Tài liệu EduShare (2 files)
    │   ├── EDUSHARE_README.md
    │   └── EDUSHARE_TRANSFORMATION.md
    │
    └── 📁 specifications/                # Đặc tả kỹ thuật (1 file)
        └── IMAGE_SIZES_SPECIFICATION.md
```

## Mô tả cấu trúc

### 🎨 Frontend (`client/olf/`)
- **Framework**: Vue.js
- **Cấu trúc**: Component-based architecture
- **Chức năng chính**: 
  - Quản lý khóa học
  - Quản lý tài liệu
  - Xác thực người dùng
  - Trang cá nhân
  - Tìm kiếm và lọc

### 🔧 Backend (`server/`)
- **Kiến trúc**: Microservices
- **Services**:
  - `api-gateway`: Điểm vào chính, routing và proxy
  - `auth-service`: Xác thực và quản lý người dùng
  - `course-service`: Quản lý khóa học
  - `document-service`: Quản lý tài liệu
  - `tours-service`: Quản lý tours (legacy)

### 📚 Tài liệu (`docs/`)
- Đã được tổ chức theo chủ đề
- Dễ dàng tra cứu và bảo trì
- Xem `docs/README.md` để biết chi tiết

## Lưu ý
- `node_modules/` được bỏ qua trong cây thư mục này
- Các file upload được lưu trong thư mục `uploads/` của từng service
- Mỗi service có cấu trúc tương tự: `controllers/`, `models/`, `routes/`

---
*Cập nhật lần cuối: 2025-11-13*

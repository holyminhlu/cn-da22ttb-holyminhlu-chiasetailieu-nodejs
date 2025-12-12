# Trang Hồ Sơ Người Dùng - User Profile Page

## 📋 Tổng Quan

Trang profile người dùng đầy đủ tính năng với tabs, chỉnh sửa profile, upload avatar, quản lý tài liệu, và cài đặt bảo mật.

## 🎯 Tính Năng Chính

### ✅ Đã Hoàn Thành

- ✅ **Profile Hero**: Cover image + Avatar (editable) + Display name + Role + Verified badge + Action buttons
- ✅ **Profile Stats**: Thống kê uploads, downloads, bookmarks, points
- ✅ **Tabs System**: Overview | Documents | Bookmarks | Activity | Settings | Security
- ✅ **Documents Tab**: Filter, sort, grid/list view, DocumentCard components
- ✅ **Bookmarks Tab**: Danh sách tài liệu đã lưu
- ✅ **Activity Timeline**: Timeline hoạt động gần đây
- ✅ **Edit Profile Modal**: Form chỉnh sửa với validation
- ✅ **Avatar Uploader**: Upload + preview avatar với drag & drop
- ✅ **Settings Form**: Cài đặt thông tin cá nhân và tùy chọn
- ✅ **Security Form**: Thay đổi mật khẩu, 2FA, Connected accounts
- ✅ **Responsive Design**: Mobile-first, desktop layout
- ✅ **Accessibility**: ARIA labels, keyboard navigation, focus management

## 📁 Cấu Trúc Files

```
client/olf/src/
├── views/
│   ├── UserProfileView.vue       # Trang profile chính
│   └── PROFILE_PAGE_README.md    # File này
├── components/
│   ├── profile/
│   │   ├── ProfileHero.vue       # Hero section với cover + avatar
│   │   ├── ProfileStats.vue      # Component thống kê
│   │   ├── ProfileTabs.vue       # Tabs component accessible
│   │   ├── EditProfileModal.vue  # Modal chỉnh sửa profile
│   │   ├── AvatarUploader.vue    # Upload avatar với preview
│   │   ├── ActivityTimeline.vue   # Timeline hoạt động
│   │   ├── SettingsForm.vue      # Form cài đặt
│   │   ├── SecurityForm.vue      # Form bảo mật
│   │   ├── ConfirmModal.vue       # Modal xác nhận
│   │   └── Toast.vue              # Toast notifications
│   └── DocumentCard.vue          # Component hiển thị tài liệu (đã có)
```

## 🚀 Sử Dụng

### Routes

- `/profile` - Trang profile của người dùng hiện tại
- `/profile/:id` - Trang profile của người dùng khác
- `/profile?tab=documents` - Mở tab Documents
- `/profile?tab=settings` - Mở tab Settings

### Components Usage

#### ProfileHero
```vue
<ProfileHero
  :cover-url="userProfile.cover"
  :avatar-url="userProfile.avatar"
  :display-name="userProfile.displayName"
  :username="userProfile.username"
  :role="userRole"
  :verified="userProfile.verified"
  :is-owner="isOwner"
  @edit-profile="openEditModal"
  @upload-avatar="openAvatarUploader"
/>
```

#### ProfileTabs
```vue
<ProfileTabs
  :tabs="tabs"
  :active-tab="activeTab"
  @tab-change="handleTabChange"
>
  <template #overview>...</template>
  <template #documents>...</template>
</ProfileTabs>
```

## 🎨 Design System

### Colors
- **Primary**: `#0B6EFD` (Blue)
- **Accent**: `#00C2A8` (Teal)
- **Text**: `#0F172A` (Dark)
- **Text Light**: `#64748B` (Gray)
- **Background**: `#F8FAFF` (Light Blue)
- **Error**: `#EF4444` (Red)
- **Success**: `#10B981` (Green)

### Typography
- **Font**: Inter / Roboto
- **Heading**: 700 (Bold)
- **Body**: 400 (Regular), 16px
- **Small**: 0.875rem (14px)

### Spacing
- **Base Grid**: 8px
- **Container Max Width**: 1200px
- **Gutter**: 24px

### Border Radius
- **Small**: 6px
- **Medium**: 10px
- **Large**: 12px

## 🔧 API Integration

### Endpoints Cần Implement

```javascript
// GET /api/users/:id
// Trả về thông tin user profile

// PUT /api/users/:id
// Cập nhật profile

// POST /api/users/:id/avatar
// Upload avatar

// GET /api/users/:id/documents
// Lấy danh sách documents

// GET /api/users/:id/activity
// Lấy activity timeline

// POST /api/users/change-password
// Thay đổi mật khẩu
```

### Example API Calls

```javascript
// Fetch user profile
const fetchUserProfile = async (userId) => {
  const response = await fetch(`/api/users/${userId}`)
  return await response.json()
}

// Update profile
const updateProfile = async (userId, data) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

// Upload avatar
const uploadAvatar = async (userId, file) => {
  const formData = new FormData()
  formData.append('avatar', file)
  const response = await fetch(`/api/users/${userId}/avatar`, {
    method: 'POST',
    body: formData
  })
  return await response.json()
}
```

## 📱 Responsive Breakpoints

- **Mobile**: `< 600px`
  - Single column layout
  - Sticky hero
  - Tabs scrollable horizontal
  - Documents: 1 column grid

- **Tablet**: `600px - 959px`
  - Single column với sidebar stacked
  - Documents: 2 columns grid

- **Desktop**: `≥ 960px`
  - Two-column layout (sidebar + main)
  - Documents: 3 columns grid

## ♿ Accessibility Features

1. **ARIA Labels**: Tất cả interactive elements có labels
2. **Keyboard Navigation**: 
   - Tab để navigate
   - Enter/Space để activate
   - ESC để đóng modals
3. **Focus Management**: Focus trap trong modals
4. **Screen Reader**: 
   - Role attributes (tab, tabpanel, dialog)
   - Aria-live regions cho toasts
   - Aria-describedby cho error messages
5. **Skip Link**: Link bỏ qua đến main content

## 🐛 Troubleshooting

### Lỗi: Component not found

**Nguyên nhân**: Import path sai hoặc component chưa được tạo

**Giải pháp**:
1. Kiểm tra import paths trong `UserProfileView.vue`
2. Đảm bảo tất cả component files đã được tạo

### Lỗi: Route not found

**Nguyên nhân**: Route chưa được định nghĩa

**Giải pháp**:
1. Kiểm tra `routes/index.js`
2. Đảm bảo route `/profile` đã được thêm

### Lỗi: Modal không hiển thị

**Nguyên nhân**: Teleport target hoặc z-index sai

**Giải pháp**:
1. Kiểm tra `<Teleport to="body">` trong modal components
2. Kiểm tra z-index của modal overlay (2000)

## 🚧 TODO (Future Enhancements)

- [ ] Implement real API calls thay vì mock data
- [ ] Add cover image uploader
- [ ] Add document upload functionality
- [ ] Add 2FA setup flow đầy đủ
- [ ] Add OAuth account connection
- [ ] Add profile completeness meter
- [ ] Add achievements/badges system
- [ ] Add dark mode support
- [ ] Add infinite scroll cho documents
- [ ] Add image crop functionality cho avatar

## 📚 Tài Liệu Tham Khảo

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Router](https://router.vuejs.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

## 👥 Contributors

- Created by: AI Assistant
- Date: 2024

## 📄 License

MIT License













# Trang Đăng Ký / Đăng Nhập - AuthView

## 📋 Tổng Quan

Trang đăng ký/đăng nhập hiện đại với tab toggle, validation realtime, responsive design và accessibility.

## 🎯 Tính Năng

### ✅ Đã Hoàn Thành

- ✅ **Tab Toggle**: Chuyển đổi mượt mà giữa Đăng nhập và Đăng ký
- ✅ **Validation Realtime**: Kiểm tra lỗi ngay khi người dùng nhập
- ✅ **Password Toggle**: Hiển thị/ẩn mật khẩu
- ✅ **Responsive Design**: Hoạt động tốt trên mobile, tablet, desktop
- ✅ **Accessibility (A11y)**: 
  - ARIA labels và roles
  - Keyboard navigation
  - Focus states rõ ràng
  - Screen reader support
- ✅ **Loading States**: Hiển thị spinner khi đang xử lý
- ✅ **Toast Notifications**: Thông báo lỗi/thành công
- ✅ **OAuth Buttons**: Google và Microsoft (UI ready)
- ✅ **Forgot Password Modal**: Modal quên mật khẩu
- ✅ **Form Fields**:
  - Họ tên
  - Email (với validation)
  - Mật khẩu (với strength check)
  - Xác nhận mật khẩu
  - Chương trình đào tạo (dropdown)
  - Vai trò (radio buttons)
  - Đồng ý điều khoản (checkbox)

## 📁 Cấu Trúc Files

```
client/olf/src/
├── views/
│   ├── AuthView.vue          # Trang chính với tab toggle
│   └── AUTH_PAGE_README.md   # File này
├── components/
│   └── auth/
│       ├── InputField.vue    # Component input reusable
│       └── PasswordField.vue # Component password với toggle
└── utils/
    ├── authAPI.js            # API functions cho auth
    └── validate.js           # Validation functions (updated)
```

## 🚀 Sử Dụng

### Routes

- `/auth` - Trang auth mặc định (mở tab đăng nhập)
- `/signin` - Redirect đến `/auth?tab=signin`
- `/signup` - Redirect đến `/auth?tab=signup`
- `/signin-old` - Trang đăng nhập cũ (backward compatibility)
- `/signup-old` - Trang đăng ký cũ (backward compatibility)

### API Integration

Trang sử dụng `authAPI.js` kết nối với:
- Backend: `http://localhost:3001`
- Endpoints:
  - `POST /register` - Đăng ký
  - `POST /login` - Đăng nhập
  - `POST /checkemail` - Kiểm tra email tồn tại

### Example Usage

```vue
<template>
  <router-link to="/auth">Đăng nhập</router-link>
  <router-link to="/signup">Đăng ký</router-link>
</template>
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

- **Border Radius**: 
  - Small: 8px
  - Medium: 12px
  - Large: 16px

### Shadows

- **Small**: `0 1px 2px rgba(0, 0, 0, 0.05)`
- **Medium**: `0 4px 6px rgba(0, 0, 0, 0.1)`
- **Large**: `0 10px 15px rgba(0, 0, 0, 0.1)`

## 🔧 Components

### InputField.vue

Component input field với:
- Label và required indicator
- Icon support
- Error message
- Accessibility attributes

**Props:**
- `modelValue` (String)
- `type` (String, default: 'text')
- `label` (String)
- `placeholder` (String)
- `error` (String)
- `required` (Boolean)
- `disabled` (Boolean)
- `icon` (String)
- `id` (String, required)

**Events:**
- `update:modelValue`
- `blur`
- `focus`

### PasswordField.vue

Component password field với:
- Toggle show/hide
- Password strength indicator (future)
- Accessibility attributes

**Props:** (tương tự InputField, không có `icon`)

**Events:** (tương tự InputField)

## 📱 Responsive Breakpoints

- **Mobile**: `< 768px`
  - Single column layout
  - Form full-width
  - No illustration
  - Smaller padding

- **Tablet**: `768px - 960px`
  - Form centered
  - Max width 480px

- **Desktop**: `> 960px`
  - Split layout
  - Illustration bên trái
  - Form bên phải

## ♿ Accessibility Features

1. **ARIA Labels**: Tất cả inputs có label rõ ràng
2. **Focus States**: Outline rõ ràng khi focus
3. **Keyboard Navigation**: Có thể navigate bằng Tab
4. **Error Announcements**: Screen reader thông báo lỗi
5. **Role Attributes**: `role="tab"`, `role="tabpanel"`, `role="alert"`
6. **Aria Attributes**: `aria-invalid`, `aria-describedby`, `aria-pressed`

## 🔄 State Management

- Form state được quản lý bằng Vue 3 Composition API
- Errors được validate realtime
- Loading states cho async operations
- Toast notifications cho feedback

## 🐛 Troubleshooting

### Lỗi: "Cannot GET /register"

**Nguyên nhân**: Backend service chưa chạy hoặc endpoint sai

**Giải pháp**:
1. Kiểm tra backend service đang chạy tại `http://localhost:3001`
2. Kiểm tra endpoint trong `authAPI.js`
3. Xem console log để biết chi tiết lỗi

### Lỗi: Validation không hoạt động

**Nguyên nhân**: Event handlers chưa được bind đúng

**Giải pháp**:
1. Kiểm tra `@blur` và `@focus` events
2. Kiểm tra validation functions trong `validate.js`

### Lỗi: Responsive không đúng

**Nguyên nhân**: CSS media queries chưa được apply

**Giải pháp**:
1. Kiểm tra CSS trong `AuthView.vue`
2. Test trên các breakpoints: 768px, 960px

## 🚧 TODO (Future Enhancements)

- [ ] Implement OAuth login (Google, Microsoft)
- [ ] Implement forgot password functionality
- [ ] Add password strength indicator
- [ ] Add reCAPTCHA
- [ ] Add email verification flow
- [ ] Add social login (Facebook)
- [ ] Add biometric login (Face ID, Touch ID)
- [ ] Add remember me functionality with JWT refresh
- [ ] Add 2FA (Two-Factor Authentication)

## 📚 Tài Liệu Tham Khảo

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

## 👥 Contributors

- Created by: AI Assistant
- Date: 2024

## 📄 License

MIT License













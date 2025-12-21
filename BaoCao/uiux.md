# 🎨 Giao Diện Người Dùng (UI/UX) - OpenLearnFoundation

## 📋 Mục Lục

1. [Tổng Quan UI/UX](#tổng-quan-uiux)
2. [Design System](#design-system)
3. [Component Library](#component-library)
4. [Layout & Grid System](#layout--grid-system)
5. [Responsive Design](#responsive-design)
6. [Accessibility (A11y)](#accessibility-a11y)
7. [Animations & Interactions](#animations--interactions)
8. [User Experience Patterns](#user-experience-patterns)
9. [Color Psychology & Usage](#color-psychology--usage)
10. [Typography System](#typography-system)
11. [Spacing & Layout](#spacing--layout)
12. [Best Practices](#best-practices)

---

## Tổng Quan UI/UX

### Triết Lý Thiết Kế

**OpenLearnFoundation** được thiết kế với triết lý **User-Centered Design**, tập trung vào:

- **Simplicity**: Giao diện đơn giản, dễ sử dụng
- **Clarity**: Thông tin rõ ràng, dễ hiểu
- **Consistency**: Nhất quán trong toàn bộ ứng dụng
- **Accessibility**: Truy cập được cho mọi người
- **Performance**: Tải nhanh, mượt mà

### Nguyên Tắc Thiết Kế

1. **Mobile-First**: Thiết kế cho mobile trước, mở rộng lên desktop
2. **Progressive Enhancement**: Chức năng cơ bản hoạt động không cần JS
3. **Accessibility First**: Tuân thủ WCAG 2.1 AA
4. **Performance**: Tối ưu tốc độ tải và tương tác
5. **Consistency**: Sử dụng design system thống nhất

---

## Design System

### Color Palette

#### Primary Colors
```css
--color-primary: #1d4ed8;        /* Blue - Main brand color */
--color-primary-hover: #1e40af;   /* Darker blue on hover */
--color-primary-light: rgba(29, 78, 216, 0.1); /* Light blue background */
```

**Sử dụng cho**:
- Primary buttons
- Links
- Focus states
- Highlights
- Active states

#### Accent Colors
```css
--color-accent: #00C2A8;          /* Teal - Secondary brand color */
--color-accent-hover: #00A88F;    /* Darker teal on hover */
```

**Sử dụng cho**:
- Secondary buttons
- Ratings
- Icons
- Badges
- Success states

#### Neutral Colors
```css
--color-dark: #0F172A;            /* Dark text */
--color-light-bg: #F8FAFF;        /* Light background */

--color-neutral-50: #f9fafb;      /* Lightest gray */
--color-neutral-100: #f3f4f6;
--color-neutral-200: #e5e7eb;
--color-neutral-300: #d1d5db;
--color-neutral-400: #9ca3af;
--color-neutral-500: #6b7280;     /* Medium gray */
--color-neutral-600: #4b5563;
--color-neutral-700: #374151;
--color-neutral-800: #1f2937;
--color-neutral-900: #111827;    /* Darkest gray */
```

**Sử dụng cho**:
- Text colors
- Backgrounds
- Borders
- Dividers
- Placeholders

#### Semantic Colors
```css
--color-success: #10b981;         /* Green - Success states */
--color-error: #ef4444;           /* Red - Error states */
--color-warning: #f59e0b;         /* Orange - Warning states */
--color-info: #1d4ed8;            /* Blue - Info states */
```

**Sử dụng cho**:
- Success messages
- Error messages
- Warning alerts
- Info notifications

### Color Usage Guidelines

#### Text Colors
- **Primary Text**: `--color-dark` (#0F172A)
- **Secondary Text**: `--color-neutral-600` (#4b5563)
- **Muted Text**: `--color-neutral-500` (#6b7280)
- **Placeholder**: `--color-neutral-400` (#9ca3af)

#### Background Colors
- **Primary Background**: White (#ffffff)
- **Secondary Background**: `--color-light-bg` (#F8FAFF)
- **Tertiary Background**: `--color-neutral-50` (#f9fafb)
- **Hover Background**: `--color-primary-light` (rgba với opacity 0.1)

#### Border Colors
- **Default Border**: `--color-neutral-200` (#e5e7eb)
- **Focus Border**: `--color-primary` (#1d4ed8)
- **Error Border**: `--color-error` (#ef4444)

---

## Typography System

### Font Families

```css
--font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 
                     'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 
                     'Cantarell', sans-serif;

--font-family-heading: 'Inter', var(--font-family-base);
```

**Font Stack**:
- Primary: Inter (web font)
- Fallback: System fonts (San Francisco, Segoe UI, Roboto)

### Font Sizes

```css
--font-size-xs: 0.75rem;      /* 12px - Captions, labels */
--font-size-sm: 0.875rem;     /* 14px - Small text */
--font-size-base: 1rem;       /* 16px - Body text */
--font-size-lg: 1.125rem;     /* 18px - Large body */
--font-size-xl: 1.25rem;      /* 20px - Small headings */
--font-size-2xl: 1.5rem;     /* 24px - H3 headings */
--font-size-3xl: 1.875rem;    /* 30px - H2 headings */
--font-size-4xl: 2.25rem;    /* 36px - H1 headings (mobile) */
--font-size-5xl: 3rem;        /* 48px - H1 headings (desktop) */
```

### Font Weights

```css
--font-weight-normal: 400;    /* Regular text */
--font-weight-medium: 500;    /* Medium emphasis */
--font-weight-semibold: 600;  /* Semibold headings */
--font-weight-bold: 700;      /* Bold headings */
```

### Line Heights

```css
--line-height-tight: 1.25;    /* Headings */
--line-height-normal: 1.5;    /* Body text */
--line-height-relaxed: 1.75; /* Long paragraphs */
```

### Typography Scale

#### Headings
- **H1**: 36-48px (responsive), Bold (700), Line-height: 1.25
- **H2**: 24-32px (responsive), Semibold (600), Line-height: 1.25
- **H3**: 20-24px (responsive), Semibold (600), Line-height: 1.3
- **H4**: 18px, Semibold (600), Line-height: 1.4
- **H5**: 16px, Medium (500), Line-height: 1.5
- **H6**: 14px, Medium (500), Line-height: 1.5

#### Body Text
- **Large**: 18px, Regular (400), Line-height: 1.75
- **Base**: 16px, Regular (400), Line-height: 1.5
- **Small**: 14px, Regular (400), Line-height: 1.5
- **XSmall**: 12px, Regular (400), Line-height: 1.5

---

## Spacing & Layout

### Spacing Scale (8px Base Grid)

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px - Base unit */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
```

### Border Radius

```css
--radius-sm: 6px;       /* Small elements (badges, tags) */
--radius-md: 10px;      /* Cards, buttons */
--radius-lg: 12px;      /* Large cards */
--radius-xl: 16px;      /* Modals, containers */
--radius-full: 9999px;  /* Pills, avatars */
```

### Shadows (Elevation System)

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);        /* Level 1 */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);          /* Level 2 */
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);        /* Level 3 */
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);        /* Level 4 */
```

**Sử dụng**:
- **Level 1**: Input fields, small cards
- **Level 2**: Cards, dropdowns
- **Level 3**: Modals, popovers
- **Level 4**: Large modals, overlays

### Container

```css
--container-max-width: 1200px;
--container-padding: 24px;
--container-gutter: 24px;
```

---

## Component Library

### 1. Buttons

#### Primary Button
```html
<button class="btn btn-primary">Tìm tài liệu</button>
```

**Styles**:
- Background: `--color-primary`
- Text: White
- Padding: 12px 24px
- Border radius: `--radius-md` (10px)
- Font weight: Medium (500)
- Hover: Darker background, slight translateY

#### Secondary Button
```html
<button class="btn btn-secondary">Tải lên</button>
```

**Styles**:
- Background: Transparent
- Border: 2px solid `--color-primary`
- Text: `--color-primary`
- Hover: Background `--color-primary-light`

#### Icon Button
```html
<button class="btn-icon" aria-label="Upload">
  <svg>...</svg>
</button>
```

**Styles**:
- Square shape
- Minimum 44x44px (touch target)
- Circular on mobile

### 2. Cards

#### Document Card
```html
<article class="document-card">
  <div class="card-image-wrapper">
    <img src="..." alt="..." />
    <div class="card-overlay">
      <div class="quick-actions">
        <!-- Preview, Download, Save buttons -->
      </div>
    </div>
  </div>
  <div class="card-content">
    <h3 class="title">...</h3>
    <div class="metadata">...</div>
  </div>
</article>
```

**Features**:
- Hover overlay với quick actions
- Thumbnail với lazy loading
- Metadata (author, tags, rating, downloads)
- File type badge
- License badge

**Hover Effect**:
- TranslateY: -4px
- Shadow increase: `--shadow-md` → `--shadow-lg`
- Overlay fade in

#### Course Card
```html
<div class="course-card">
  <div class="course-thumbnail">...</div>
  <div class="course-info">
    <h3>...</h3>
    <div class="instructor">...</div>
    <div class="course-meta">
      <span class="price">...</span>
      <span class="rating">...</span>
    </div>
  </div>
</div>
```

### 3. Forms

#### Input Field
```html
<div class="form-group">
  <label for="email">Email</label>
  <input 
    type="email" 
    id="email" 
    class="form-control"
    placeholder="Nhập email"
  />
  <span class="error-message">...</span>
</div>
```

**States**:
- **Default**: Border `--color-neutral-200`
- **Focus**: Border `--color-primary`, outline 3px
- **Error**: Border `--color-error`, error message
- **Disabled**: Background `--color-neutral-100`, cursor not-allowed

#### Search Bar
```html
<div class="search-bar">
  <input 
    type="search" 
    class="search-input"
    placeholder="Tìm kiếm..."
  />
  <button class="search-btn">🔍</button>
  <div class="search-suggestions">
    <!-- Autocomplete suggestions -->
  </div>
</div>
```

**Features**:
- Autocomplete dropdown
- Recent searches
- Filter pills
- Keyboard navigation (Arrow keys, Enter, Escape)

### 4. Modals

#### Preview Modal
```html
<div class="modal-backdrop" @click="close">
  <div class="modal" role="dialog" aria-modal="true">
    <button class="modal-close" @click="close">×</button>
    <div class="modal-content">
      <!-- Content -->
    </div>
  </div>
</div>
```

**Features**:
- Backdrop click to close
- ESC key to close
- Focus trap
- Fade in + scale animation
- Responsive sizing

### 5. Navigation

#### Header Navigation
```html
<header class="header">
  <div class="container">
    <router-link to="/" class="logo">...</router-link>
    <nav class="nav desktop-nav">...</nav>
    <div class="header-actions">...</div>
  </div>
</nav>
```

**Features**:
- Sticky header (scroll behavior)
- Dropdown menus
- Mobile hamburger menu
- User profile dropdown
- Search integration

#### Mobile Navigation
```html
<nav class="mobile-nav" :class="{ active: mobileMenuOpen }">
  <!-- Navigation links -->
</nav>
```

**Features**:
- Slide-in animation
- Full-screen overlay
- Touch-friendly targets (min 44x44px)
- Close on link click

### 6. Toast Notifications

```html
<div class="toast-container">
  <div class="toast toast-success">
    <span class="toast-icon">✓</span>
    <span class="toast-message">Đăng ký thành công!</span>
    <button class="toast-close">×</button>
  </div>
</div>
```

**Types**:
- Success (green)
- Error (red)
- Warning (orange)
- Info (blue)

**Behavior**:
- Auto-dismiss after 3-5 seconds
- Slide in from right
- Stack vertically
- Click to dismiss

### 7. Loading States

#### Skeleton Loader
```html
<div class="skeleton">
  <div class="skeleton-image"></div>
  <div class="skeleton-text"></div>
  <div class="skeleton-text short"></div>
</div>
```

#### Spinner
```html
<div class="spinner" aria-label="Loading">
  <div class="spinner-circle"></div>
</div>
```

---

## Layout & Grid System

### Container System

```css
.container {
  max-width: var(--container-max-width); /* 1200px */
  margin: 0 auto;
  padding: 0 var(--container-padding); /* 24px */
}
```

### Grid System (Bootstrap 5)

#### Responsive Grid
```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">
      <!-- Content -->
    </div>
  </div>
</div>
```

**Breakpoints**:
- **xs**: < 576px (default, 1 column)
- **sm**: ≥ 576px
- **md**: ≥ 768px (2 columns)
- **lg**: ≥ 992px (3 columns)
- **xl**: ≥ 1200px (4 columns)
- **xxl**: ≥ 1400px

### Layout Patterns

#### Two-Column Layout
```html
<div class="layout-two-column">
  <aside class="sidebar">...</aside>
  <main class="main-content">...</main>
</div>
```

**Responsive**:
- Desktop: Sidebar (25%) + Main (75%)
- Tablet: Stacked
- Mobile: Single column

#### Full-Width Hero
```html
<section class="hero-section">
  <div class="hero-content">
    <!-- Centered content -->
  </div>
</section>
```

**Features**:
- Full viewport width
- Gradient background
- Centered content
- Flexible height

---

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
/* Base: Mobile (< 600px) */

/* Tablet */
@media (min-width: 600px) { ... }

/* Desktop */
@media (min-width: 960px) { ... }

/* Wide Desktop */
@media (min-width: 1280px) { ... }
```

### Responsive Typography

```css
h1 {
  font-size: clamp(2rem, 5vw, 3rem); /* 32px - 48px */
}

h2 {
  font-size: clamp(1.5rem, 4vw, 2rem); /* 24px - 32px */
}
```

### Mobile-First Strategy

**Approach**:
1. Design cho mobile trước (320px - 599px)
2. Enhance cho tablet (600px - 959px)
3. Enhance cho desktop (960px+)

**Benefits**:
- Faster mobile performance
- Progressive enhancement
- Better user experience on mobile

### Touch Targets

**Minimum Size**: 44x44px (Apple HIG, Material Design)

**Spacing**: Minimum 8px giữa các touch targets

**Examples**:
- Buttons: min-height 44px
- Icon buttons: 44x44px
- Links: min-height 44px với padding

---

## Accessibility (A11y)

### WCAG 2.1 AA Compliance

#### Color Contrast

**Requirements**:
- **Normal Text**: ≥ 4.5:1 contrast ratio
- **Large Text** (18px+): ≥ 3:1 contrast ratio
- **UI Components**: ≥ 3:1 contrast ratio

**Examples**:
- Primary text (#0F172A) on white: 16.7:1 ✓
- Primary button (#1d4ed8) on white: 7.1:1 ✓
- Secondary text (#4b5563) on white: 7.1:1 ✓

### ARIA Labels & Roles

#### Semantic HTML
```html
<header role="banner">...</header>
<nav role="navigation" aria-label="Main navigation">...</nav>
<main role="main">...</main>
<article role="article" aria-label="Document title">...</article>
<footer role="contentinfo">...</footer>
```

#### Interactive Elements
```html
<button 
  aria-label="Tải xuống tài liệu"
  aria-expanded="false"
  aria-controls="dropdown-menu"
>
  Download
</button>
```

#### Form Labels
```html
<label for="email">Email</label>
<input 
  id="email" 
  type="email"
  aria-describedby="email-error"
  aria-invalid="false"
/>
<span id="email-error" class="error-message" role="alert">
  Email không hợp lệ
</span>
```

### Keyboard Navigation

#### Tab Order
- Logical tab order
- Skip links cho main content
- Focus indicators visible

#### Keyboard Shortcuts
- **Tab**: Navigate forward
- **Shift + Tab**: Navigate backward
- **Enter/Space**: Activate button/link
- **Arrow Keys**: Navigate dropdowns, carousels
- **Escape**: Close modals, dropdowns

#### Focus Management
```css
/* Focus styles */
*:focus {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Screen Reader Support

#### Alt Text
```html
<img 
  src="..." 
  alt="Mô tả chi tiết về hình ảnh"
/>
```

#### Aria-Live Regions
```html
<div aria-live="polite" aria-atomic="true" class="sr-only">
  <!-- Dynamic content updates -->
</div>
```

#### Hidden Content
```html
<span class="sr-only">Thông tin chỉ dành cho screen reader</span>
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Animations & Interactions

### Animation Libraries

#### AOS (Animate On Scroll)
```javascript
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
});
```

**Usage**:
```html
<div data-aos="fade-up" data-aos-delay="100">
  Content
</div>
```

**Animations**:
- `fade-up`, `fade-down`, `fade-left`, `fade-right`
- `zoom-in`, `zoom-out`
- `slide-up`, `slide-down`

#### GSAP (GreenSock)
```javascript
gsap.to(".element", {
  y: -10,
  duration: 0.3,
  ease: "power2.out"
});
```

**Usage**:
- Complex animations
- Timeline control
- Scroll-triggered animations

### Micro-Interactions

#### Button Hover
```css
.btn {
  transition: all var(--transition-base);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

#### Card Hover
```css
.document-card {
  transition: transform var(--transition-base), 
              box-shadow var(--transition-base);
}

.document-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

#### Modal Animation
```css
.modal {
  animation: modalFadeIn var(--transition-base);
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

#### Toast Animation
```css
.toast {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Transitions

```css
--transition-fast: 150ms ease;    /* Quick interactions */
--transition-base: 300ms ease;   /* Standard transitions */
--transition-slow: 500ms ease;    /* Slow animations */
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## User Experience Patterns

### 1. Search Experience

#### Search Flow
```
User types in search bar
    ↓
Autocomplete suggestions appear
    ↓
User selects suggestion or presses Enter
    ↓
Search results displayed
    ↓
User can refine with filters
    ↓
User clicks on result
    ↓
Navigate to document detail
```

#### Search Features
- **Autocomplete**: Real-time suggestions
- **Recent Searches**: Stored in localStorage
- **Filter Pills**: Quick filters (Program, Tags, etc.)
- **Search History**: Track search queries
- **Empty State**: Helpful message when no results

### 2. Upload Experience

#### Multi-Step Form
```
Step 1: Basic Info
  - Title
  - Program
  - Description
    ↓
Step 2: Tags & License
  - Tags
  - Language
  - Visibility
  - License
    ↓
Step 3: File Upload
  - Select document
  - Optional thumbnail
  - Accept ToS
    ↓
Step 4: Review & Submit
  - Review all info
  - Submit
```

#### Upload Features
- **Progress Indicator**: Show upload progress
- **Drag & Drop**: Drag files vào upload area
- **File Preview**: Preview thumbnail before upload
- **Validation**: Real-time validation
- **Error Handling**: Clear error messages

### 3. Navigation Experience

#### Breadcrumbs
```
Trang chủ > Tài liệu > Lập trình > JavaScript
```

#### Navigation Patterns
- **Sticky Header**: Header stays visible khi scroll
- **Active States**: Highlight current page
- **Dropdown Menus**: Hover/click to open
- **Mobile Menu**: Hamburger menu với slide animation

### 4. Feedback Patterns

#### Success Feedback
- Toast notification
- Success message
- Visual confirmation (checkmark)

#### Error Feedback
- Error message near field
- Toast notification
- Inline validation

#### Loading Feedback
- Spinner
- Skeleton loaders
- Progress bars

### 5. Empty States

#### No Results
```html
<div class="empty-state">
  <svg>...</svg>
  <h3>Không tìm thấy kết quả</h3>
  <p>Thử bỏ bớt bộ lọc hoặc kiểm tra chính tả.</p>
  <button class="btn btn-primary">Xem tất cả tài liệu</button>
</div>
```

#### No Bookmarks
```html
<div class="empty-state">
  <svg>...</svg>
  <h3>Chưa có tài liệu đã lưu</h3>
  <p>Bắt đầu lưu tài liệu yêu thích của bạn.</p>
  <router-link to="/documents" class="btn btn-primary">
    Khám phá tài liệu
  </router-link>
</div>
```

---

## Color Psychology & Usage

### Primary Blue (#1d4ed8)

**Psychology**: Trust, reliability, professionalism

**Usage**:
- Primary actions
- Links
- Brand identity
- Focus states

### Accent Teal (#00C2A8)

**Psychology**: Growth, freshness, innovation

**Usage**:
- Secondary actions
- Ratings
- Success indicators
- Highlights

### Semantic Colors

#### Success Green (#10b981)
- Success messages
- Completed states
- Positive feedback

#### Error Red (#ef4444)
- Error messages
- Delete actions
- Warning alerts

#### Warning Orange (#f59e0b)
- Warning messages
- Caution states
- Pending states

---

## Typography System

### Font Loading Strategy

```css
/* System fonts fallback để tránh FOIT */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

### Responsive Typography

```css
/* Fluid typography với clamp() */
h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.25;
}

p {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.75;
}
```

### Text Hierarchy

```
H1 (48px) - Page titles
  ↓
H2 (32px) - Section titles
  ↓
H3 (24px) - Subsection titles
  ↓
Body (16px) - Main content
  ↓
Small (14px) - Secondary text
  ↓
Caption (12px) - Labels, metadata
```

---

## Spacing & Layout

### 8px Grid System

Tất cả spacing đều dựa trên bội số của 8px:

```
4px   (0.5x)
8px   (1x)  - Base unit
16px  (2x)  - Common spacing
24px  (3x)  - Section padding
32px  (4x)  - Large spacing
48px  (6x)  - Section gaps
64px  (8x)  - Major spacing
```

### Vertical Rhythm

**Section Spacing**:
- Small sections: 3rem (48px)
- Medium sections: 4rem (64px)
- Large sections: 5rem (80px)

**Component Spacing**:
- Cards: 1.5rem (24px) gap
- List items: 1rem (16px) gap
- Form fields: 1.5rem (24px) gap

---

## Best Practices

### 1. Performance

#### Image Optimization
- Lazy loading cho images
- WebP format với fallback
- Responsive images (srcset)
- Proper alt text

#### Code Splitting
- Lazy load components
- Route-based code splitting
- Dynamic imports

#### CSS Optimization
- Scoped styles
- Critical CSS inline
- Unused CSS removal

### 2. Accessibility

#### Checklist
- [ ] All images have alt text
- [ ] All buttons have aria-labels
- [ ] Color contrast ≥ 4.5:1
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader tested
- [ ] Skip links present

### 3. Responsive Design

#### Testing Breakpoints
- 320px (iPhone SE)
- 375px (iPhone)
- 414px (iPhone Plus)
- 768px (iPad)
- 1024px (iPad Pro)
- 1280px (Desktop)
- 1920px (Large Desktop)

### 4. User Experience

#### Loading States
- Show skeleton loaders
- Progress indicators
- Optimistic UI updates

#### Error Handling
- Clear error messages
- Recovery suggestions
- Retry mechanisms

#### Success Feedback
- Immediate visual feedback
- Confirmation messages
- Next steps guidance

### 5. Consistency

#### Design Tokens
- Use CSS variables
- Consistent spacing
- Unified color palette
- Standardized components

---

## Component Specifications

### Document Card

**Dimensions**:
- Width: 100% (responsive)
- Aspect ratio: 16:9 (thumbnail)
- Padding: 16px

**States**:
- Default: Shadow `--shadow-md`
- Hover: Shadow `--shadow-lg`, translateY -4px
- Active: Slight scale (0.98)

**Content**:
- Thumbnail (top)
- Title (bold, 18px)
- Author info
- Program badge
- Tags
- Rating stars
- Download count
- License badge

### Button Specifications

**Primary Button**:
- Height: 44px (mobile), 48px (desktop)
- Padding: 12px 24px
- Border radius: 10px
- Font weight: 500
- Font size: 16px

**Secondary Button**:
- Height: 44px
- Padding: 12px 24px
- Border: 2px solid
- Border radius: 10px

**Icon Button**:
- Size: 44x44px (minimum)
- Border radius: 50% (circular)
- Padding: 12px

### Form Input Specifications

**Input Field**:
- Height: 48px
- Padding: 12px 16px
- Border: 1px solid `--color-neutral-200`
- Border radius: 8px
- Font size: 16px

**Focus State**:
- Border: 2px solid `--color-primary`
- Outline: 3px solid `--color-primary-light`
- Outline offset: 2px

---

## Design Patterns

### 1. Card Pattern

**Structure**:
```
┌─────────────────────┐
│   Image/Thumbnail   │
├─────────────────────┤
│   Title             │
│   Metadata          │
│   Actions           │
└─────────────────────┘
```

**Usage**: Documents, Courses, Blog posts

### 2. List Pattern

**Structure**:
```
┌─────────────────────────────────┐
│ Icon │ Title │ Metadata │ Action│
├─────────────────────────────────┤
│ Icon │ Title │ Metadata │ Action│
└─────────────────────────────────┘
```

**Usage**: Search results, Bookmarks, Enrollments

### 3. Modal Pattern

**Structure**:
```
┌─────────────────────────────┐
│ [X]                         │
│                             │
│      Modal Content          │
│                             │
│  [Cancel]  [Confirm]        │
└─────────────────────────────┘
```

**Usage**: Confirmations, Forms, Previews

### 4. Tab Pattern

**Structure**:
```
┌──────┬──────┬──────┬──────┐
│ Tab1 │ Tab2 │ Tab3 │ Tab4 │
├──────┴──────┴──────┴──────┤
│                           │
│      Tab Content          │
│                           │
└───────────────────────────┘
```

**Usage**: Profile pages, Settings, Admin dashboard

---

## User Interface Screens

### 1. Homepage

**Layout**:
```
┌─────────────────────────────────┐
│         Header (Sticky)         │
├─────────────────────────────────┤
│      Hero Section               │
│  - Title & Subtitle             │
│  - Search Bar                   │
│  - CTA Buttons                  │
├─────────────────────────────────┤
│  Featured Collections Carousel  │
├─────────────────────────────────┤
│  Recommended Courses            │
│  [Card] [Card] [Card]           │
├─────────────────────────────────┤
│  Latest Documents               │
│  [Card] [Card] [Card] [Card]    │
├─────────────────────────────────┤
│  Popular by Category            │
│  [Card] [Card] [Card]           │
├─────────────────────────────────┤
│  Community Teaser               │
├─────────────────────────────────┤
│  Featured Instructors           │
│  [Card] [Card] [Card]           │
├─────────────────────────────────┤
│         Footer                  │
└─────────────────────────────────┘
```

### 2. Documents Page

**Layout**:
```
┌─────────────────────────────────┐
│         Header                   │
├─────────────────────────────────┤
│  Search Bar + Filters            │
├─────────────────────────────────┤
│  Results: 200 tài liệu           │
├─────────────────────────────────┤
│  [Card] [Card] [Card] [Card]    │
│  [Card] [Card] [Card] [Card]    │
│  [Card] [Card] [Card] [Card]    │
├─────────────────────────────────┤
│  Pagination: [1] 2 3 ... 10     │
├─────────────────────────────────┤
│         Footer                   │
└─────────────────────────────────┘
```

### 3. Document Detail Page

**Layout**:
```
┌─────────────────────────────────┐
│         Header                   │
├─────────────────────────────────┤
│  Breadcrumbs                     │
├─────────────────────────────────┤
│  ┌───────────┬─────────────────┐│
│  │           │  Title          ││
│  │ Thumbnail │  Author         ││
│  │           │  Metadata       ││
│  │           │  [Download]     ││
│  │           │  [Bookmark]     ││
│  └───────────┴─────────────────┘│
├─────────────────────────────────┤
│  Description                     │
├─────────────────────────────────┤
│  Rating & Reviews                │
├─────────────────────────────────┤
│  Related Documents               │
│  [Card] [Card] [Card]           │
├─────────────────────────────────┤
│         Footer                   │
└─────────────────────────────────┘
```

### 4. Profile Page

**Layout**:
```
┌─────────────────────────────────┐
│         Header                   │
├─────────────────────────────────┤
│  Profile Hero                    │
│  - Cover Image                   │
│  - Avatar                        │
│  - Name & Role                   │
│  - Stats                         │
├─────────────────────────────────┤
│  Tabs: [Overview] [Documents]   │
│        [Bookmarks] [Settings]    │
├─────────────────────────────────┤
│  Tab Content                     │
│  [Content based on active tab]   │
├─────────────────────────────────┤
│         Footer                   │
└─────────────────────────────────┘
```

---

## Interaction Design

### 1. Hover States

**Cards**:
- Elevation increase
- Overlay appears
- Quick actions visible

**Buttons**:
- Background color change
- Slight translateY
- Shadow increase

**Links**:
- Color change
- Underline appears
- Icon animation

### 2. Focus States

**Visible Focus**:
```css
*:focus {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
```

**Focus Within**:
```css
.form-group:focus-within {
  border-color: var(--color-primary);
}
```

### 3. Active States

**Buttons**:
```css
.btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
```

### 4. Disabled States

**Visual**:
- Reduced opacity (0.5)
- Gray color
- Cursor: not-allowed

**Accessibility**:
- `aria-disabled="true"`
- Prevent click events

---

## Responsive Breakpoints

### Mobile (< 600px)

**Layout**:
- Single column
- Hamburger menu
- Compact search
- Stacked cards
- Full-width buttons

**Typography**:
- H1: 32px
- H2: 24px
- Body: 16px

**Spacing**:
- Section padding: 3rem (48px)
- Card gap: 1rem (16px)

### Tablet (600px - 959px)

**Layout**:
- 2 columns for cards
- Expanded navigation
- Sidebar stacked
- Larger touch targets

**Typography**:
- H1: 36px
- H2: 28px
- Body: 16px

**Spacing**:
- Section padding: 4rem (64px)
- Card gap: 1.5rem (24px)

### Desktop (960px+)

**Layout**:
- 3-4 columns for cards
- Full navigation
- Sidebar layout
- Hover interactions

**Typography**:
- H1: 48px
- H2: 32px
- Body: 16px

**Spacing**:
- Section padding: 5rem (80px)
- Card gap: 2rem (32px)

---

## Accessibility Features

### 1. Keyboard Navigation

**Tab Order**:
1. Skip link
2. Logo
3. Navigation links
4. Search bar
5. User menu
6. Main content
7. Footer links

**Keyboard Shortcuts**:
- `/` - Focus search bar
- `Esc` - Close modals/dropdowns
- `Enter` - Submit forms
- `Arrow keys` - Navigate dropdowns

### 2. Screen Reader Support

**ARIA Attributes**:
```html
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="menuitem">...</li>
  </ul>
</nav>
```

**Live Regions**:
```html
<div aria-live="polite" aria-atomic="true">
  <!-- Dynamic updates announced -->
</div>
```

### 3. Focus Management

**Modal Focus Trap**:
- Focus moves to modal when opened
- Tab cycles within modal
- Focus returns to trigger when closed

**Skip Links**:
```html
<a href="#main-content" class="skip-link">
  Chuyển đến nội dung chính
</a>
```

---

## Performance Optimizations

### 1. Image Optimization

**Lazy Loading**:
```html
<img src="..." loading="lazy" alt="..." />
```

**Responsive Images**:
```html
<img 
  srcset="image-320w.jpg 320w,
          image-640w.jpg 640w,
          image-1280w.jpg 1280w"
  sizes="(max-width: 600px) 100vw, 50vw"
  src="image-640w.jpg"
  alt="..."
/>
```

### 2. Code Splitting

**Route-Based**:
```javascript
const DocumentsView = () => import('../views/DocumentsView.vue');
```

**Component-Based**:
```javascript
const UploadModal = () => import('../components/UploadModal.vue');
```

### 3. CSS Optimization

**Scoped Styles**:
```vue
<style scoped>
/* Styles chỉ áp dụng cho component này */
</style>
```

**Critical CSS**:
- Inline critical CSS
- Defer non-critical CSS

---

## Design Tools & Resources

### Design Tokens File
- Location: `client/olf/src/assets/styles/design-tokens.css`
- Contains: Colors, Typography, Spacing, Shadows, etc.

### Component Library
- Location: `client/olf/src/components/`
- Reusable components với consistent styling

### Style Guide
- Design decisions documented
- Component specifications
- Usage guidelines

---

## Future Enhancements

### Planned Features
- [ ] Dark mode toggle
- [ ] Advanced filter sidebar
- [ ] Infinite scroll pagination
- [ ] Social sharing buttons
- [ ] User onboarding tour
- [ ] Advanced search UI
- [ ] Customizable themes
- [ ] Print stylesheets

### UI Improvements
- [ ] Skeleton loaders for all loading states
- [ ] Smooth page transitions
- [ ] Advanced animations
- [ ] Micro-interactions
- [ ] Gesture support (swipe, pinch)

---

## Testing & Quality Assurance

### Visual Testing
- [ ] Cross-browser testing
- [ ] Responsive testing trên các devices
- [ ] Color contrast testing
- [ ] Visual regression testing

### Accessibility Testing
- [ ] Screen reader testing (NVDA, JAWS)
- [ ] Keyboard navigation testing
- [ ] Color blindness simulation
- [ ] WCAG compliance audit

### Performance Testing
- [ ] Lighthouse audit
- [ ] Page load time
- [ ] Time to Interactive (TTI)
- [ ] First Contentful Paint (FCP)

---

## Design System Summary

### Core Principles
1. **Consistency**: Unified design language
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Responsiveness**: Mobile-first approach
4. **Performance**: Optimized for speed
5. **Usability**: Intuitive và user-friendly

### Key Metrics
- **Color Contrast**: ≥ 4.5:1 (normal text)
- **Touch Targets**: ≥ 44x44px
- **Font Size**: ≥ 16px (body text)
- **Line Height**: 1.5 (body text)
- **Spacing**: 8px base grid

---

**Tài liệu được cập nhật lần cuối: 2024-01-15**

**Ghi chú**: Design system này được thiết kế để đảm bảo tính nhất quán, khả năng truy cập và trải nghiệm người dùng tốt nhất trên tất cả các thiết bị và trình duyệt.


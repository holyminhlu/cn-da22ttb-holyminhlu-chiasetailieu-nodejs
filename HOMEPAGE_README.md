# Trang chủ EduShare - Homepage Documentation

## Tổng quan

Trang chủ được thiết kế theo yêu cầu cho một website chia sẻ tài liệu & học tập trực tuyến, với focus vào UX/UI hiện đại, accessibility, và performance.

## Cấu trúc Components

### Components chính

1. **HeroSection** (`components/HeroSection.vue`)
   - Hero banner với title, subtitle
   - Hỗ trợ slot cho SearchBar
   - CTA buttons (primary & secondary)

2. **SearchBar** (`components/SearchBar.vue`)
   - Input search với autocomplete
   - Filter pills
   - Suggestions dropdown
   - Keyboard navigation (arrow keys, enter, escape)
   - Recent searches

3. **CollectionCarousel** (`components/CollectionCarousel.vue`)
   - Horizontal carousel cho featured collections
   - Touch/swipe support
   - Navigation buttons & indicators
   - Keyboard navigation

4. **DocumentCard** (`components/DocumentCard.vue`)
   - Thumbnail với overlay actions (preview, download, save)
   - Author info, tags, rating, downloads
   - License badge
   - Responsive & accessible

5. **FeaturedInstructors** (`components/FeaturedInstructors.vue`)
   - Grid layout cho instructors
   - Avatar, name, topics, stats

6. **PreviewModal** (`components/PreviewModal.vue`)
   - Modal preview cho documents
   - PDF iframe hoặc image preview
   - Download & report actions
   - Keyboard accessible (ESC to close)

7. **ToastNotification** (`components/ToastNotification.vue`)
   - Toast notifications (success, error, info)
   - Auto-dismiss
   - Global access via `window.$toast`

## Design Tokens

File `assets/styles/design-tokens.css` chứa:
- Colors: Primary (#0B6EFD), Accent (#00C2A8), Dark (#0F172A), Light (#F8FAFF)
- Typography: Inter font family, size scale
- Spacing: 8px base grid system
- Border radius: 10px cho cards
- Shadows: Elevation system
- Breakpoints: Mobile (0-599px), Tablet (600-959px), Desktop (960-1279px), Wide (≥1280px)

## Data Structure

File `data/homepageData.json` chứa sample data:
- Hero section data
- Featured collections
- Documents list
- Featured instructors
- Community questions

## Features Implemented

### ✅ Chức năng cơ bản
- [x] Header với logo, nav, search, auth
- [x] Hero section với search bar
- [x] Featured collections carousel
- [x] Document cards với actions
- [x] Search với autocomplete
- [x] Filter system
- [x] Community teaser section
- [x] Featured instructors
- [x] Footer (từ FooterComponent hiện có)

### ✅ Accessibility (A11y)
- [x] ARIA labels và roles
- [x] Keyboard navigation
- [x] Focus styles visible
- [x] Skip to main content link
- [x] Semantic HTML
- [x] Alt text cho images
- [x] Color contrast ≥ 4.5:1
- [x] Screen reader support

### ✅ Responsive Design
- [x] Mobile-first approach
- [x] Breakpoints: 599px, 959px, 1279px
- [x] Flexible grids (1 col mobile → 2-3 col desktop)
- [x] Touch-friendly interactions
- [x] Hamburger menu cho mobile

### ✅ Performance
- [x] Lazy loading cho images
- [x] Code splitting (components)
- [x] Optimized CSS
- [x] Semantic markup cho SEO

### ✅ Interactions
- [x] Search autocomplete
- [x] Card hover effects
- [x] Preview modal
- [x] Toast notifications
- [x] Save/bookmark optimistic UI
- [x] Keyboard shortcuts

## Cách sử dụng

### Development

```bash
cd client/olf
npm install
npm run serve
```

### Build

```bash
npm run build
```

### Tích hợp với Backend

Các endpoints cần thiết:
1. `GET /api/search?q={query}&filters={filters}` - Search documents
2. `GET /api/documents/latest` - Latest documents
3. `GET /api/documents/popular` - Popular by category
4. `GET /api/collections/featured` - Featured collections
5. `GET /api/instructors/featured` - Featured instructors
6. `POST /api/documents/{id}/download` - Download document
7. `POST /api/documents/{id}/save` - Save/bookmark
8. `POST /api/upload` - Upload document

### Analytics Events

Các events cần track:
- `doc_preview` - Khi xem preview
- `doc_download` - Khi tải xuống
- `doc_save` - Khi lưu/bookmark
- `search_submit` - Khi submit search
- `collection_view` - Khi xem collection

## Testing Checklist

### Manual Testing
- [ ] Test keyboard navigation (Tab, Enter, Arrow keys, Esc)
- [ ] Test trên các breakpoints: 320px, 375px, 414px, 768px, 1024px
- [ ] Test color contrast với a11y tool
- [ ] Test với screen reader (NVDA/JAWS)
- [ ] Test file preview PDF
- [ ] Test download flow
- [ ] Test upload modal (khi implement)

### Automated Testing (Suggested)
- Unit tests cho DocumentCard, SearchBar
- Accessibility tests với axe-core
- Visual regression tests
- E2E tests với Cypress/Playwright

## SEO & Meta Tags

Thêm vào `public/index.html`:
```html
<meta name="description" content="Chia sẻ tài liệu học tập miễn phí - Slides, đề cương, bài tập và khoá học từ cộng đồng.">
<meta property="og:title" content="EduShare - Chia sẻ tài liệu học tập">
<meta property="og:description" content="Chia sẻ tài liệu học tập miễn phí">
<meta property="og:image" content="/og-image.jpg">
```

## Internationalization (i18n)

Hiện tại hỗ trợ Vietnamese. Để thêm English:
1. Tạo file `i18n/index.js`
2. Export translation keys
3. Sử dụng `$t()` trong components
4. Tạo language switcher trong Header

## Dark Mode (Optional)

Design tokens đã chuẩn bị cho dark mode. Để enable:
1. Thêm toggle button
2. Switch `prefers-color-scheme` trong CSS
3. Hoặc dùng class `.dark` và update tokens

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Targets

- First Contentful Paint (FCP): ≤ 1.5s (mobile, good network)
- Time to Interactive (TTI): ≤ 3.5s
- Lighthouse Score: ≥ 90 (Performance, Accessibility, Best Practices, SEO)

## Troubleshooting

### Search không hoạt động
- Kiểm tra `handleSearch` method trong HomeView
- Kiểm tra data structure trong `homepageData.json`

### Modal không đóng
- Kiểm tra `previewModalOpen` state
- Kiểm tra `@close` event handler

### Images không load
- Kiểm tra paths trong `homepageData.json`
- Đảm bảo images tồn tại trong `public/img/`

## Tài liệu tham khảo

- [Vue 3 Documentation](https://vuejs.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## License

Đồ án Chuyên ngành CNTT - Nhóm sinh viên DA22TTB

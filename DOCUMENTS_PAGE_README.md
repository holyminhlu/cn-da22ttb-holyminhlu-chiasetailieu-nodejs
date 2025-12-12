# Documents Page - Design Specification & Implementation

## Tổng quan

Trang "Tài liệu" (Documents Page) là một trang web Vue.js cho phép người dùng tìm kiếm, lọc, xem trước, tải xuống và tải lên tài liệu học tập với đầy đủ metadata.

## Cấu trúc Layout

### Desktop Layout (≥960px)
```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumbs                                              │
├─────────────────────────────────────────────────────────┤
│ Header Region (Search + Upload CTA + Auth)               │
├─────────────┬───────────────────────────────────────────┤
│             │ Filter Panel                              │
│ Sidebar     ├───────────────────────────────────────────┤
│             │ Active Filter Chips                       │
│ - Featured  │                                           │
│   Collections│ Document Grid (3-4 columns)              │
│ - Top       │                                           │
│   Authors   │                                           │
│ - Quick Tags│                                           │
│             │ Pagination / Load More                    │
└─────────────┴───────────────────────────────────────────┘
```

### Tablet Layout (600-959px)
- Sidebar chuyển xuống dưới filter panel
- Document grid: 2 columns
- Filter panel có thể collapse

### Mobile Layout (<600px)
- Sidebar collapse thành accordion
- Document grid: 1 column
- Upload CTA sticky bottom hoặc trong header
- Filter panel accordion với toggle button

## Component Structure

### DocumentsView.vue (Main Page)
- Quản lý state và logic chính
- Breadcrumbs navigation
- Header region với search bar
- Sidebar với collections, authors, tags
- Document grid với infinite scroll/pagination
- Preview modal và upload modal integration

### FilterPanel.vue
- Category, Program, Year filters
- File type, Level, Language filters
- Tags typeahead input
- Rating slider (min rating)
- Sort options (relevance/newest/downloads/rating)
- Clear all filters button
- Mobile: Collapsible accordion

### UploadModal.vue (Multi-step Form)
**Step 1: Basic Metadata**
- Title (required, max 150 chars)
- Program (required, dropdown)
- Description (required, 20-1000 chars)
- Author (autocomplete, default = current user)
- Course code (optional)
- Year (optional, dropdown)

**Step 2: Tags & License**
- Tags (multi-select, typeahead)
- Language (dropdown)
- Visibility (Public/Private/Class-only)
- License (required, dropdown)

**Step 3: File Upload**
- File upload (required, PDF/PPTX/DOCX/ZIP, max 50MB)
- Thumbnail (optional, image)
- TOS checkbox (required)
- Security note
- Progress bar

**Step 4: Success**
- Success message
- Close button

### DocumentCard.vue
- Thumbnail với hover overlay
- Title (2 lines max, truncate)
- Authors (comma-separated)
- Program
- Tags (max 3 visible + "+n")
- Downloads count
- Rating stars
- Year
- Quick actions: Preview, Download, Save
- Keyboard accessible

### PreviewModal.vue
- Embedded PDF/image viewer
- Metadata sidebar:
  - Document info (author, program, year, upload date)
  - Statistics (rating, downloads)
  - License
  - Tags
  - "Open in full page" link
- Footer actions: Report, Download
- Focus trap, ESC to close

### SearchBar.vue
- Instant suggestions (debounced 300ms)
- Recent searches
- Keyboard navigation (up/down/enter)
- Filter pills (optional)
- Result count display

## Design Tokens

Sử dụng CSS variables từ `design-tokens.css`:
- Colors: `--color-primary`, `--color-accent`, `--color-dark`, etc.
- Spacing: `--spacing-*` (8px base grid)
- Typography: `--font-*` variables
- Border radius: `--radius-*`
- Shadows: `--shadow-*`
- Breakpoints: 0-599px (mobile), 600-959px (tablet), ≥960px (desktop)

## Accessibility Features

### ARIA Landmarks
- `<main role="main">` - Main content
- `<nav aria-label="Breadcrumb">` - Navigation
- `<aside role="complementary">` - Sidebar
- `<form role="search">` - Search form

### Keyboard Navigation
- Skip link to main content
- Tab order: logical flow
- Enter/Space to activate buttons
- ESC to close modals
- Arrow keys for suggestions
- Focus trap in modals

### Screen Readers
- All images have alt text
- Form controls have labels
- Buttons have aria-labels
- Status updates with aria-live
- ARIA expanded states for collapsibles

### Color Contrast
- Text: ≥4.5:1 contrast ratio
- Large headings: ≥3:1 contrast ratio
- Focus indicators: visible (3px outline)

### Reduced Motion
- Respects `prefers-reduced-motion`
- Disables animations for users who prefer it

## Performance Optimizations

1. **Lazy Loading**
   - Images: `loading="lazy"`
   - Infinite scroll loads more as user scrolls

2. **Debouncing**
   - Search input: 300ms debounce
   - Prevents excessive API calls

3. **Virtual Scrolling**
   - Consider for large lists (>100 items)
   - Currently using pagination/infinite scroll

4. **Code Splitting**
   - Modals loaded on demand
   - Components can be lazy-loaded

5. **Caching**
   - Search results cached
   - Filter state in URL for shareability

## URL Query Parameters

Filters and search are synced with URL:
- `?q=search+query` - Search query
- `?category=id` - Category filter
- `?program=id` - Program filter
- `?year=2024` - Year filter
- `?fileType=pdf` - File type
- `?level=basic` - Level
- `?language=vi` - Language
- `?tags=tag1,tag2` - Tags (comma-separated)
- `?minRating=4.0` - Minimum rating
- `?sort=relevance` - Sort option
- `?page=2` - Page number

## API Integration Points

### Fetch Documents
```javascript
GET /api/documents
Query params: search, filters, pagination
Response: { documents: [...], total: number, page: number }
```

### Upload Document
```javascript
POST /api/documents/upload
Body: FormData with file and metadata
Response: { documentId: string, status: 'success' }
```

### Download Document
```javascript
GET /api/documents/:id/download
Response: File download
```

### Preview Document
```javascript
GET /api/documents/:id/preview
Response: File stream or preview URL
```

## Testing

### Unit Tests
- Component rendering
- Props validation
- Event emissions
- Computed properties

### Accessibility Tests
- ARIA attributes
- Keyboard navigation
- Screen reader compatibility
- Color contrast

### Snapshot Tests
- DocumentCard rendering
- FilterPanel states
- Modal states

### Integration Tests
- Search flow
- Filter application
- Upload workflow
- Preview modal

## Run Instructions

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

### Run Tests
```bash
npm run test
# or
npm run test:unit
npm run test:e2e
```

## File Structure

```
client/olf/
├── src/
│   ├── views/
│   │   └── DocumentsView.vue        # Main page
│   ├── components/
│   │   ├── DocumentCard.vue         # Document card component
│   │   ├── SearchBar.vue            # Search component
│   │   ├── FilterPanel.vue          # Filter panel
│   │   ├── PreviewModal.vue         # Preview modal
│   │   └── UploadModal.vue          # Upload modal
│   ├── data/
│   │   └── documentsData.json       # Sample data
│   └── assets/
│       └── styles/
│           └── design-tokens.css    # Design tokens
├── tests/
│   ├── DocumentCard.test.js          # Snapshot test
│   └── accessibility.test.js        # A11y tests
└── DOCUMENTS_PAGE_README.md         # This file
```

## Acceptance Criteria Checklist

- [x] Upload form enforces required fields and shows clear errors
- [x] Filters + search update results and URL query
- [x] Preview modal accessible and shows metadata + download
- [x] Keyboard-only users can navigate search, filters, cards, and modals
- [x] Mobile header collapses and upload CTA remains accessible
- [x] Breadcrumbs navigation
- [x] Active filter chips with clear functionality
- [x] Infinite scroll / pagination
- [x] Empty states with helpful messages
- [x] Loading states with skeletons
- [x] Error handling
- [x] Responsive design (mobile/tablet/desktop)
- [x] Accessibility (ARIA, keyboard nav, focus management)
- [x] Performance (lazy loading, debouncing)

## Future Enhancements

1. **Advanced Features**
   - Document versioning
   - Comments and reviews
   - Collections management
   - Advanced search (full-text, boolean operators)

2. **Social Features**
   - Share on social media
   - Follow authors
   - Notifications for new documents

3. **Analytics**
   - Track downloads
   - View statistics
   - Popular documents

4. **Admin Features**
   - Document moderation
   - Bulk operations
   - Analytics dashboard

## Notes

- Design tokens ensure consistency across the application
- All components follow Vue 3 Composition API
- Accessibility is built-in, not an afterthought
- Mobile-first responsive design
- Performance optimized with lazy loading and debouncing
- URL state management enables shareable links


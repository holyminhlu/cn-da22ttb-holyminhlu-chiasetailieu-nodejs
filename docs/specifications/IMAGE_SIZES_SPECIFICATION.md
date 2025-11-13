# HƯỚNG DẪN KÍCH THƯỚC ẢNH CHO TRANG CHỦ EDUSHARE

Tài liệu này liệt kê tất cả kích thước ảnh cần thiết cho trang chủ để thiết kế và cắt ghép ảnh phù hợp.

## 📐 BỘ SƯU TẬP NỔI BẬT (Featured Collections)

**Vị trí:** Section đầu tiên sau phần Hero  
**Component:** CollectionCarousel  
**Số lượng:** 3 ảnh cho các bộ sưu tập

### Kích thước ảnh cover:
- **Desktop (≥960px):** `1200px × 300px` (full container width)
- **Tablet (601px-959px):** `≥960px × 250px`
- **Mobile (≤600px):** `≥640px × 200px`

**Tỷ lệ khuyến nghị:** `4:1`  
**Format:** PNG, JPG, WebP  
**Dung lượng:** < 300KB mỗi ảnh

### Thông tin chi tiết:
- Container: `max-width: 1200px`
- Padding: `0 24px` (mỗi bên 24px)
- Image wrapper: `width: 100%`, `height: 300px` (desktop)
- Ảnh sẽ được crop tự động với `object-fit: cover`
- Có hiệu ứng zoom 1.1x khi hover

---

## 📚 THUMBNAIL TÀI LIỆU (Document Thumbnails)

**Vị trí:** Các section "Khóa học đề xuất", "Tài liệu mới nhất", "Tài liệu phổ biến theo ngành"  
**Component:** DocumentCard  
**Số lượng:** ~6-18 ảnh tùy section

### Kích thước ảnh thumbnail:
- **Aspect Ratio:** `16:9` (bắt buộc)
- **Width tối thiểu:** `560px × 315px` (cho 2x density)
- **Khuyến nghị:** `1120px × 630px` (HD quality)

### Grid layout:
- **Desktop (≥960px):** `repeat(auto-fill, minmax(280px, 1fr))`
  - Mỗi card tối thiểu: 280px width
  - Tỷ lệ 16:9 → ảnh hiển thị: `280px × 157.5px`
- **Tablet (≤959px):** `repeat(auto-fill, minmax(240px, 1fr))`
  - Ảnh hiển thị: `240px × 135px`
- **Mobile (≤599px):** `1fr` (1 cột)
  - Ảnh hiển thị: Full width × height tự động

**Format:** PNG, JPG, WebP  
**Dung lượng:** < 200KB mỗi ảnh  
**Lưu ý:** Ảnh sẽ được crop từ trung tâm với `object-fit: cover`

---

## 👤 AVATAR GIẢNG VIÊN (Instructor Avatars)

**Vị trí:** Section "Giảng viên nổi bật"  
**Component:** FeaturedInstructors  
**Số lượng:** 3 avatars

### Kích thước ảnh avatar:
- **Kích thước hiển thị:** `80px × 80px`
- **Border:** `3px solid #0B6EFD`
- **Format:** Hình tròn (border-radius: 50%)
- **Khuyến nghị thiết kế:** `160px × 160px` (cho 2x density)
- **Object-fit:** Cover (crop tròn từ trung tâm)

**Format:** PNG, JPG  
**Background:** Nên có background solid hoặc gradient  
**Lưu ý:** Ảnh sẽ tự động bo tròn, đảm bảo nội dung quan trọng nằm trong hình tròn

---

## 📋 TÓM TẮT KÍCH THƯỚC

| Loại ảnh | Kích thước thiết kế | Aspect Ratio | Format | Số lượng |
|----------|---------------------|--------------|--------|----------|
| **Collection Cover** | 1200×300px | 4:1 | PNG/JPG | 3 |
| **Document Thumbnail** | 1120×630px | 16:9 | PNG/JPG | 6-18 |
| **Instructor Avatar** | 160×160px | 1:1 (tròn) | PNG/JPG | 3 |

---

## 💡 LƯU Ý THIẾTẾ KẾ

### Optimization:
1. Nén ảnh trước khi upload (< 300KB mỗi ảnh)
2. Sử dụng WebP format nếu có thể
3. Thêm lazy loading cho tất cả ảnh
4. Nên có fallback placeholder

### Responsive:
- Tất cả ảnh sẽ tự động scale theo container
- `object-fit: cover` đảm bảo ảnh luôn fill container
- Tránh thiết kế với text hoặc logo ở các góc biên

### Hover Effects:
- Collection images: zoom 1.1x
- Document thumbnails: zoom 1.1x + overlay buttons
- Avatars: có border highlight

---

## 📁 ĐƯỜNG DẪN FILE

Dựa vào `homepageData.json`:

### Collections:
- `/img/articles/math-phys.png` - Toán & Lý
- `/img/articles/it.png` - CNTT & Lập trình
- `/img/articles/english.png` - Tiếng Anh

### Documents:
- `/img/articles/linear.png`
- `/img/articles/csharp.png`
- `/img/articles/physics.jpg`
- `/img/articles/algorithm.jpg`
- `/img/articles/toeic.png`
- `/img/articles/ml.png`

### Avatars:
- `/img/perfil.jpg` (dùng chung cho tất cả avatars)


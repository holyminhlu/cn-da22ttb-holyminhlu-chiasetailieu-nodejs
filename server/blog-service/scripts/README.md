# Blog Service Scripts

## Tạo BlogPosts Collection

Script này tạo collection `BlogPosts` trong MongoDB database `EduShareDB` với đầy đủ indexes và validation.

### Cách chạy:

```bash
# Từ thư mục blog-service
npm run create-collection

# Hoặc chạy trực tiếp
node scripts/create-blogposts-collection.js
```

### Collection Details:

- **Collection Name:** `BlogPosts`
- **Database:** `EduShareDB`
- **Connection:** `mongodb://127.0.0.1:27017/EduShareDB`

### Schema Fields:

- `blog_post_id` (String, unique) - ID duy nhất của bài viết
- `title` (String, required) - Tiêu đề bài viết
- `slug` (String, unique) - URL slug
- `description` (String, required, max 500 chars) - Mô tả ngắn
- `content` (String, required) - Nội dung đầy đủ
- `category` (String, enum) - Danh mục: 'Tài liệu học tập', 'Mẹo học tập', 'Công nghệ / Lập trình', 'Kinh nghiệm sinh viên', 'Hướng dẫn sử dụng OLF'
- `tags` (Array[String]) - Tags
- `author.id` (String, required) - ID tác giả
- `author.name` (String, required) - Tên tác giả
- `author.avatar` (String) - Avatar tác giả
- `coverImage` (String) - URL ảnh bìa
- `readingTime` (Number, min 1) - Thời gian đọc (phút)
- `featured` (Boolean) - Bài viết nổi bật
- `status` (String, enum) - Trạng thái: 'draft', 'published', 'archived'
- `views` (Number, default 0) - Số lượt xem
- `likes` (Number, default 0) - Số lượt like
- `publishedDate` (Date) - Ngày publish
- `createdAt`, `updatedAt` (Date, auto) - Timestamps

### Indexes:

1. `blog_post_id` (unique)
2. `slug` (unique)
3. `category`
4. `tags`
5. `featured`
6. `status`
7. `publishedDate` (descending)
8. `views` (descending)
9. `likes` (descending)
10. Text index trên: `title`, `description`, `content`, `tags`

### Lưu ý:

- Script sẽ kiểm tra xem collection đã tồn tại chưa
- Nếu collection đã tồn tại, script sẽ chỉ tạo/kiểm tra indexes
- Script sẽ tạo một document test và xóa nó để đảm bảo collection hoạt động đúng


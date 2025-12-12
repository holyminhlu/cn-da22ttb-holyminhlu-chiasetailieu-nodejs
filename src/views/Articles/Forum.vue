<template>
  <div class="forum-page">
    <div class="container">
      <section class="forum-header">
        <h1 class="forum-title">Diễn đàn học tập</h1>
        <p class="forum-subtitle">Nơi trao đổi kiến thức, hỏi đáp và chia sẻ tài liệu.</p>
      </section>

      <section class="forum-tools">
        <div class="tools-left">
          <div class="search-box">
            <input class="input" type="text" placeholder="Tìm câu hỏi, chủ đề..." />
          </div>
          <div class="filters">
            <select class="select">
              <option>Thể loại</option>
              <option>CNTT</option>
              <option>Kinh tế</option>
              <option>Ngoại ngữ</option>
              <option>Toán</option>
              <option>Khoa học</option>
            </select>
            <select class="select">
              <option>Mới nhất</option>
              <option>Phổ biến nhất</option>
            </select>
          </div>
        </div>
        <div class="tools-right">
          <button type="button" class="btn btn-primary">Tạo chủ đề mới</button>
        </div>
      </section>

      <div class="content-grid">
        <main class="topics">
          <ul class="topic-list">
            <li class="topic-card" v-for="t in topics" :key="t.id">
              <div class="topic-meta">
                <img :src="t.avatar" alt="" class="avatar" />
                <div class="author">
                  <span class="author-name">{{ t.author }}</span>
                  <span class="time">{{ t.time }}</span>
                </div>
              </div>
              <h3 class="topic-title">{{ t.title }}</h3>
              <p class="topic-desc">{{ t.description }}</p>
              <div class="topic-tags">
                <span class="tag" v-for="tag in t.tags" :key="tag">{{ tag }}</span>
              </div>
              <div class="topic-stats">
                <span class="stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10z"/></svg>
                  {{ t.replies }} trả lời
                </span>
                <span class="stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  {{ t.views }} lượt xem
                </span>
                <span class="stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
                  {{ t.category }}
                </span>
              </div>
            </li>
          </ul>

          <div class="pagination">
            <button type="button" class="btn btn-secondary">Tải thêm</button>
          </div>
        </main>

        <aside class="sidebar">
          <div class="sidebar-section">
            <h4 class="sidebar-title">Danh mục chủ đề</h4>
            <ul class="category-list">
              <li class="category-item" v-for="c in categories" :key="c.id">{{ c.name }}</li>
            </ul>
          </div>
          <div class="sidebar-section">
            <h4 class="sidebar-title">Chủ đề nổi bật</h4>
            <ul class="featured-list">
              <li class="featured-item" v-for="f in featured" :key="f.id">
                <span class="featured-title">{{ f.title }}</span>
                <span class="featured-count">{{ f.replies }} trả lời</span>
              </li>
            </ul>
          </div>
          <div class="sidebar-section">
            <h4 class="sidebar-title">Người dùng tích cực</h4>
            <ul class="users-list">
              <li class="user-item" v-for="u in activeUsers" :key="u.id">
                <img :src="u.avatar" alt="" class="avatar-sm" />
                <span class="user-name">{{ u.name }}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forum',
  data() {
    return {
      topics: [
        { id: 1, title: 'Cách ôn thi cấu trúc dữ liệu hiệu quả?', description: 'Chia sẻ phương pháp ôn thi, nguồn tài liệu và tips luyện tập.', tags: ['CNTT', 'DS&A'], replies: 12, views: 340, time: '2 giờ trước', author: 'Nguyễn Minh', avatar: '/perfil.jpg', category: 'CNTT' },
        { id: 2, title: 'Tài liệu TOEIC mới nhất 2025', description: 'Ai có bộ đề mới cập nhật không? Chia sẻ giúp mình.', tags: ['Ngoại ngữ', 'TOEIC'], replies: 8, views: 220, time: 'hôm qua', author: 'Lê Anh', avatar: '/perfil.jpg', category: 'Ngoại ngữ' },
        { id: 3, title: 'Kinh tế vi mô: tổng hợp công thức trọng tâm', description: 'Tổng hợp công thức và cách áp dụng vào bài tập.', tags: ['Kinh tế'], replies: 5, views: 180, time: '3 ngày trước', author: 'Phạm Hà', avatar: '/perfil.jpg', category: 'Kinh tế' },
        { id: 4, title: 'Lập trình web: nên học framework nào?', description: 'Vue, React hay Svelte phù hợp với người mới?', tags: ['CNTT', 'Web'], replies: 20, views: 540, time: '1 giờ trước', author: 'Trần Tuấn', avatar: '/perfil.jpg', category: 'CNTT' },
        { id: 5, title: 'Xác suất thống kê: bài tập mẫu có lời giải', description: 'Xin tài liệu bài tập mẫu có lời giải chi tiết.', tags: ['Toán', 'Xác suất'], replies: 4, views: 140, time: '5 giờ trước', author: 'Hoàng Mai', avatar: '/perfil.jpg', category: 'Toán' },
        { id: 6, title: 'Vật lý đại cương: cách ghi nhớ nhanh', description: 'Chia sẻ mẹo nhớ công thức và các định luật cơ bản.', tags: ['Khoa học', 'Vật lý'], replies: 9, views: 260, time: '2 ngày trước', author: 'Đỗ Phú', avatar: '/perfil.jpg', category: 'Khoa học' }
      ],
      categories: [
        { id: 'it', name: 'CNTT' },
        { id: 'econ', name: 'Kinh tế' },
        { id: 'lang', name: 'Ngoại ngữ' },
        { id: 'math', name: 'Toán' },
        { id: 'sci', name: 'Khoa học' }
      ],
      featured: [
        { id: 'f1', title: 'Hướng dẫn đồ án web chuẩn chỉnh', replies: 32 },
        { id: 'f2', title: 'Chiến lược ôn thi TOEIC 800+', replies: 18 },
        { id: 'f3', title: 'Cẩm nang kinh tế vi mô cho người mới', replies: 21 }
      ],
      activeUsers: [
        { id: 'u1', name: 'Thanh Hà', avatar: '/perfil.jpg' },
        { id: 'u2', name: 'Bảo Long', avatar: '/perfil.jpg' },
        { id: 'u3', name: 'Quỳnh Anh', avatar: '/perfil.jpg' }
      ]
    }
  }
}
</script>

<style scoped>
.forum-page { min-height: 100vh; background: var(--color-light-bg); color: var(--color-dark); font-family: var(--font-family-base); }
.container { max-width: var(--container-max-width); margin: 0 auto; padding: 0 var(--container-padding); }

.forum-header { padding: var(--spacing-12) 0 var(--spacing-6); text-align: center; }
.forum-title { font-family: var(--font-family-heading); font-size: clamp(var(--font-size-3xl), 4vw, var(--font-size-4xl)); font-weight: var(--font-weight-bold); margin: 0; }
.forum-subtitle { margin-top: var(--spacing-3); font-size: var(--font-size-lg); color: var(--color-neutral-600); }

.forum-tools { display: flex; justify-content: space-between; align-items: center; gap: var(--spacing-6); padding: var(--spacing-6) 0; }
.tools-left { display: flex; flex-wrap: wrap; align-items: center; gap: var(--spacing-4); }
.search-box { min-width: 280px; }
.input { width: 100%; padding: var(--spacing-3) var(--spacing-4); border: 1px solid var(--color-neutral-200); border-radius: var(--radius-sm); background: #fff; font-size: var(--font-size-base); }
.filters { display: flex; gap: var(--spacing-3); }
.select { padding: var(--spacing-3) var(--spacing-4); border: 1px solid var(--color-neutral-200); border-radius: var(--radius-sm); background: #fff; font-size: var(--font-size-base); }
.tools-right { display: flex; align-items: center; }
.btn { display: inline-flex; align-items: center; gap: var(--spacing-2); padding: var(--spacing-3) var(--spacing-6); border-radius: var(--radius-sm); font-weight: var(--font-weight-semibold); border: none; cursor: pointer; transition: var(--transition-fast); }
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-primary:hover { filter: brightness(0.95); transform: translateY(-2px); }
.btn-secondary { background: #fff; color: var(--color-primary); border: 1px solid var(--color-neutral-200); }
.btn-secondary:hover { background: var(--color-neutral-100); }

.content-grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: var(--spacing-8); align-items: start; padding-bottom: var(--spacing-12); }
.topics { background: transparent; }
.topic-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr; gap: var(--spacing-6); }
.topic-card { background: #fff; border: 1px solid var(--color-neutral-200); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); padding: var(--spacing-5); display: grid; gap: var(--spacing-3); }
.topic-meta { display: flex; align-items: center; gap: var(--spacing-3); }
.avatar { width: 40px; height: 40px; border-radius: var(--radius-full); object-fit: cover; }
.author { display: flex; flex-direction: column; }
.author-name { font-weight: var(--font-weight-medium); color: var(--color-neutral-800); }
.time { font-size: var(--font-size-sm); color: var(--color-neutral-500); }
.topic-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); margin: 0; color: var(--color-dark); }
.topic-desc { margin: 0; color: var(--color-neutral-700); line-height: var(--line-height-relaxed); }
.topic-tags { display: flex; flex-wrap: wrap; gap: var(--spacing-2); }
.tag { display: inline-flex; align-items: center; padding: 6px 10px; font-size: var(--font-size-sm); border-radius: var(--radius-full); background: var(--color-primary-light); color: var(--color-primary); }
.topic-stats { display: flex; flex-wrap: wrap; gap: var(--spacing-6); color: var(--color-neutral-600); font-size: var(--font-size-sm); }
.stat { display: inline-flex; align-items: center; gap: var(--spacing-2); }

.pagination { display: flex; justify-content: center; padding-top: var(--spacing-6); }

.sidebar { display: grid; gap: var(--spacing-6); }
.sidebar-section { background: #fff; border: 1px solid var(--color-neutral-200); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); padding: var(--spacing-5); }
.sidebar-title { font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin: 0 0 var(--spacing-4); color: var(--color-dark); text-align: left; }
.category-list, .featured-list, .users-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--spacing-3); }
.category-item { padding: var(--spacing-2) var(--spacing-3); border-radius: var(--radius-sm); background: var(--color-neutral-100); color: var(--color-neutral-700); }
.featured-item { display: flex; justify-content: space-between; align-items: center; gap: var(--spacing-3); padding: var(--spacing-2) var(--spacing-3); border-radius: var(--radius-sm); background: var(--color-neutral-100); }
.featured-title { color: var(--color-neutral-800); }
.featured-count { color: var(--color-neutral-600); font-size: var(--font-size-sm); }
.user-item { display: flex; align-items: center; gap: var(--spacing-3); }
.avatar-sm { width: 28px; height: 28px; border-radius: var(--radius-full); object-fit: cover; }
.user-name { color: var(--color-neutral-800); font-size: var(--font-size-sm); }

@media (max-width: 959px) {
  .forum-tools { flex-direction: column; align-items: stretch; }
  .content-grid { grid-template-columns: 1fr; }
}

@media (max-width: 599px) {
  .forum-header { padding: var(--spacing-10) 0 var(--spacing-4); }
  .search-box { min-width: 100%; }
  .filters { width: 100%; }
  .topic-card { padding: var(--spacing-4); }
}
</style>
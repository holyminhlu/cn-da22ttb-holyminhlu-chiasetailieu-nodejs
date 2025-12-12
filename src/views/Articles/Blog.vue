<template>
  <main class="blog-page">
    <section class="blog-hero">
      <div class="container hero-inner">
        <div>
          <h1>Blog EduShare</h1>
          <p>Chia sẻ kiến thức, mẹo học tập và cập nhật mới nhất từ cộng đồng.</p>
          <div class="hero-actions">
            <button class="btn primary">Viết bài</button>
            <button class="btn">Quy định đăng bài</button>
          </div>
        </div>
      </div>
    </section>

    <section class="container blog-layout">
      <aside class="sidebar">
        <div class="card">
          <h2 class="card-title">Danh mục</h2>
          <ul class="category-list">
            <li><a href="#">Học tập hiệu quả</a></li>
            <li><a href="#">Công nghệ & Lập trình</a></li>
            <li><a href="#">Ngoại ngữ</a></li>
            <li><a href="#">Kỹ năng mềm</a></li>
            <li><a href="#">Hướng nghiệp</a></li>
          </ul>
        </div>

        <div class="card">
          <h2 class="card-title">Thẻ nổi bật</h2>
          <div class="tags">
            <a class="tag" href="#">learning</a>
            <a class="tag" href="#">productivity</a>
            <a class="tag" href="#">javascript</a>
            <a class="tag" href="#">python</a>
            <a class="tag" href="#">ielts</a>
            <a class="tag" href="#">career</a>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">Bài viết mới</h2>
          <ul class="recent-list">
            <li v-for="post in recentPosts" :key="post.id">
              <a href="#">{{ post.title }}</a>
              <span class="meta">{{ post.time }}</span>
            </li>
          </ul>
        </div>
      </aside>

      <section class="content">
        <div class="featured-grid">
          <article v-for="post in filteredFeatured" :key="post.id" class="featured-card">
            <div class="thumb" :style="{ backgroundImage: `url(${post.image})` }"></div>
            <div class="featured-body">
              <div class="chip">{{ post.category }}</div>
              <h3 class="title"><a href="#">{{ post.title }}</a></h3>
              <p class="excerpt">{{ post.excerpt }}</p>
              <div class="post-meta">
                <span>✍️ {{ post.author }}</span>
                <span>· {{ post.time }}</span>
                <div class="tags">
                  <span v-for="tag in post.tags" :key="tag" class="tag small">{{ tag }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="toolbar">
          <div class="tabs">
            <button :class="['tab', activeTab === 'latest' ? 'active' : '']" @click="activeTab = 'latest'">Mới nhất</button>
            <button :class="['tab', activeTab === 'popular' ? 'active' : '']" @click="activeTab = 'popular'">Phổ biến</button>
            <button :class="['tab', activeTab === 'editor' ? 'active' : '']" @click="activeTab = 'editor'">Biên tập chọn</button>
          </div>
        </div>

        <ul class="post-list">
          <li v-for="post in filteredPosts" :key="post.id" class="post-item">
            <div class="post-left">
              <div class="thumb sm" :style="{ backgroundImage: `url(${post.image})` }"></div>
            </div>
            <div class="post-right">
              <div class="chip">{{ post.category }}</div>
              <h3 class="title"><a href="#">{{ post.title }}</a></h3>
              <p class="excerpt">{{ post.excerpt }}</p>
              <div class="post-meta">
                <span>✍️ {{ post.author }}</span>
                <span>· {{ post.time }}</span>
                <span>· 🔁 {{ post.shares }}</span>
              </div>
            </div>
          </li>
        </ul>

        <div class="pagination">
          <button class="btn" disabled>«</button>
          <button class="btn primary">1</button>
          <button class="btn">2</button>
          <button class="btn">3</button>
          <button class="btn">»</button>
        </div>
      </section>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Blog LOF',
  data() {
    return {
      search: '',
      activeTab: 'latest',
      featured: [
        { id: 1, title: '7 kỹ thuật ghi nhớ giúp học nhanh gấp đôi', excerpt: 'Áp dụng phương pháp Feynman, Pomodoro và Spaced Repetition...', category: 'Học tập hiệu quả', author: 'Lan Pham', time: '2 giờ trước', image: '/img/images/tranding-food-1.png', tags: ['learning', 'productivity'] },
        { id: 2, title: 'Bí quyết học từ vựng IELTS bền vững', excerpt: 'Kết hợp Shadowing, Collocations và thói quen đọc...', category: 'Ngoại ngữ', author: 'Quang Tran', time: 'hôm qua', image: '/img/images/tranding-food-2.png', tags: ['ielts', 'english'] },
        { id: 3, title: 'Lộ trình học JavaScript hiện đại 2025', excerpt: 'ESNext, TypeScript, React/Vue, Testing, Performance...', category: 'Công nghệ', author: 'Tuan Nguyen', time: '3 ngày trước', image: '/img/images/tranding-food-3.png', tags: ['javascript', 'roadmap'] }
      ],
      posts: [
        { id: 11, title: 'Ghi chú hiệu quả với Zettelkasten', excerpt: 'Cách xây dựng mạng lưới kiến thức cá nhân...', category: 'Học tập hiệu quả', author: 'My Dang', time: '2 giờ trước', shares: 12, image: '/img/images/tranding-food-4.png' },
        { id: 12, title: 'Tối ưu thời gian với time blocking', excerpt: 'Lập lịch theo khối giúp tăng năng suất...', category: 'Kỹ năng mềm', author: 'Binh Le', time: 'hôm qua', shares: 30, image: '/img/images/tranding-food-5.png' },
        { id: 13, title: '30 dự án Python cho người mới', excerpt: 'Học qua dự án nhỏ: CLI, web, data...', category: 'Công nghệ', author: 'Hao Pham', time: '2 ngày trước', shares: 44, image: '/img/images/tranding-food-6.png' },
        { id: 14, title: 'Phương pháp luyện nói tiếng Anh mỗi ngày', excerpt: 'Shadowing, recording, conversation clubs...', category: 'Ngoại ngữ', author: 'Trang Vo', time: '3 ngày trước', shares: 27, image: '/img/images/tranding-food-7.png' }
      ],
    }
  },
  computed: {
    filteredFeatured() {
      const q = this.search.trim().toLowerCase()
      if (!q) return this.featured
      return this.featured.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.author && p.author.toLowerCase().includes(q))
      )
    },
    filteredPosts() {
      const q = this.search.trim().toLowerCase()
      if (!q) return this.posts
      return this.posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.author && p.author.toLowerCase().includes(q))
      )
    },
    recentPosts() {
      return this.posts.slice(0, 4)
    }
  }
}
</script>

<style scoped>
.blog-page { padding-top: 100px; }

.container { max-width: 1200px; margin: 0 auto; padding: 20px; }

.blog-hero { background: linear-gradient(135deg, #fff7ed 0%, #eff6ff 100%); }
.hero-inner { display: grid; gap: 24px; align-items: center; }
.blog-hero h1 { margin: 0 0 8px 0; font-size: 32px; color: #111827; }
.blog-hero p { margin: 0; color: #4b5563; }
.hero-actions { margin-top: 12px; display: flex; gap: 10px; }

.blog-layout { display: grid; grid-template-columns: 300px 1fr; gap: 24px; }
.sidebar .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
.card + .card { margin-top: 16px; }
.card-title { margin: 0 0 10px 0; font-size: 16px; color: #111827; }
.category-list { list-style: none; padding: 0; margin: 0; }
.category-list li a { display: block; padding: 8px 10px; border-radius: 8px; color: #374151; text-decoration: none; }
.category-list li a:hover { background: #f3f4f6; }
.tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag { background: #f3f4f6; color: #374151; padding: 6px 10px; border-radius: 999px; text-decoration: none; font-size: 12px; }
.tag.small { font-size: 11px; padding: 4px 8px; }

.featured-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px; }
.featured-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; }
.thumb { background-size: cover; background-position: center; height: 160px; }
.thumb.sm { height: 90px; width: 140px; border-radius: 12px; }
.featured-body { padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.chip { display: inline-block; padding: 4px 8px; background: #eef2ff; color: #3730a3; border-radius: 999px; font-size: 12px; }
.title { margin: 0; }
.title a { color: #111827; text-decoration: none; }
.title a:hover { color: #4f46e5; }
.excerpt { margin: 0; color: #4b5563; }
.post-meta { display: flex; gap: 10px; align-items: center; justify-content: space-between; flex-wrap: wrap; }

.toolbar { display: flex; justify-content: space-between; align-items: center; margin: 12px 0; }
.tabs { display: flex; gap: 8px; }
.tab { border: 1px solid #e5e7eb; background: #fff; padding: 8px 12px; border-radius: 8px; cursor: pointer; }
.tab.active { background: #eef2ff; border-color: #4f46e5; color: #3730a3; }

.post-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.post-item { display: grid; grid-template-columns: 160px 1fr; gap: 16px; background: #fff; border: 1px solid #f3f4f6; border-radius: 12px; padding: 12px; }
.post-left { display: flex; align-items: center; justify-content: center; }
.post-right .chip { margin-bottom: 6px; }

.btn { padding: 10px 16px; border-radius: 8px; border: 1px solid #e5e7eb; background: #ffffff; color: #374151; cursor: pointer; }
.btn.primary { background: #4f46e5; color: #ffffff; border-color: #4f46e5; }
.pagination { margin-top: 16px; display: flex; gap: 8px; justify-content: center; }

@media (max-width: 991px) {
  .hero-inner { grid-template-columns: 1fr; }
  .blog-layout { grid-template-columns: 1fr; }
  .featured-grid { grid-template-columns: 1fr; }
  .post-item { grid-template-columns: 1fr; }
  .thumb.sm { width: 100%; height: 160px; }
}
</style>



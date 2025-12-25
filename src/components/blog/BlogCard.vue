<template>
  <article class="blog-card" @click="goToDetail">
    <div class="blog-card-thumbnail" :style="{ backgroundImage: `url(${post.coverImage || '/img/images/tranding-food-1.png'})` }">
      <div class="blog-card-category">{{ post.category }}</div>
    </div>
    <div class="blog-card-body">
      <h3 class="blog-card-title">{{ post.title }}</h3>
      <p class="blog-card-description">{{ post.description }}</p>
      <div class="blog-card-meta">
        <div class="blog-card-tags">
          <span 
            v-for="tag in post.tags.slice(0, 3)" 
            :key="tag" 
            class="blog-card-tag"
            @click.stop="filterByTag(tag)"
          >
            #{{ tag }}
          </span>
        </div>
        <div class="blog-card-info">
          <span class="blog-card-date">{{ formatDate(post.publishedDate) }}</span>
          <span class="blog-card-reading-time">📖 {{ post.readingTime }} phút</span>
        </div>
      </div>
      <button class="blog-card-button" @click.stop="goToDetail">
        Đọc tiếp →
      </button>
    </div>
  </article>
</template>

<script>
export default {
  name: 'BlogCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToDetail() {
      // Navigate to blog detail page using slug
      this.$router.push(`/blog/${this.post.slug || this.post.blog_post_id}`)
    },
    filterByTag(tag) {
      // Emit event to parent to filter by tag
      this.$emit('filter-by-tag', tag)
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Hôm nay'
      if (diffDays === 1) return 'Hôm qua'
      if (diffDays < 7) return `${diffDays} ngày trước`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`
      return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  }
}
</script>

<style scoped>
.blog-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.blog-card-thumbnail {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.blog-card-category {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(79, 70, 229, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.blog-card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.blog-card-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px 0;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.blog-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.blog-card-tag {
  background: #f3f4f6;
  color: #4f46e5;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.blog-card-tag:hover {
  background: #eef2ff;
  color: #3730a3;
}

.blog-card-info {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #9ca3af;
}

.blog-card-date {
  display: flex;
  align-items: center;
}

.blog-card-reading-time {
  display: flex;
  align-items: center;
}

.blog-card-button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.blog-card-button:hover {
  background: #4338ca;
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 768px) {
  .blog-card-thumbnail {
    height: 180px;
  }
  
  .blog-card-body {
    padding: 16px;
  }
  
  .blog-card-title {
    font-size: 18px;
  }
}
</style>



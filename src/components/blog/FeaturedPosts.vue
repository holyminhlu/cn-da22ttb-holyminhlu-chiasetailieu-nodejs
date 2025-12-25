<template>
  <section class="featured-posts">
    <h2 class="featured-posts-title">Bài Viết Nổi Bật</h2>
    <div class="featured-posts-grid">
      <article 
        v-for="post in featuredPosts" 
        :key="post.blog_post_id || post.id"
        class="featured-post-card"
        @click="goToDetail(post)"
      >
        <div 
          class="featured-post-image" 
          :style="{ backgroundImage: `url(${post.coverImage || post.image || '/img/images/tranding-food-1.png'})` }"
        >
          <div class="featured-post-overlay">
            <div class="featured-post-category">{{ post.category }}</div>
          </div>
        </div>
        <div class="featured-post-content">
          <h3 class="featured-post-title">{{ post.title }}</h3>
          <p class="featured-post-description">{{ truncateDescription(post.description) }}</p>
          <div class="featured-post-meta">
            <div class="featured-post-tags">
              <span 
                v-for="tag in post.tags.slice(0, 2)" 
                :key="tag" 
                class="featured-post-tag"
                @click.stop="filterByTag(tag)"
              >
                #{{ tag }}
              </span>
            </div>
            <span class="featured-post-date">{{ formatDate(post.publishedDate) }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeaturedPosts',
  props: {
    featuredPosts: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    goToDetail(post) {
      this.$router.push(`/blog/${post.slug || post.blog_post_id || post.id}`)
    },
    filterByTag(tag) {
      this.$emit('filter-by-tag', tag)
    },
    truncateDescription(description) {
      if (!description) return ''
      if (description.length <= 100) return description
      return description.substring(0, 100) + '...'
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
      return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })
    }
  }
}
</script>

<style scoped>
.featured-posts {
  margin-bottom: 40px;
}

.featured-posts-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

.featured-posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.featured-post-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.featured-post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.featured-post-image {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.featured-post-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  display: flex;
  align-items: flex-start;
  padding: 12px;
}

.featured-post-category {
  background: rgba(79, 70, 229, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.featured-post-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.featured-post-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-post-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px 0;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.featured-post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.featured-post-tag {
  background: #f3f4f6;
  color: #4f46e5;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.featured-post-tag:hover {
  background: #eef2ff;
  color: #3730a3;
}

.featured-post-date {
  font-size: 12px;
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 991px) {
  .featured-posts-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .featured-posts-grid {
    grid-template-columns: 1fr;
  }
  
  .featured-post-image {
    height: 180px;
  }
}
</style>



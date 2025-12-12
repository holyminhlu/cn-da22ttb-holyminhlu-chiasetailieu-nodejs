<template>
  <div class="profile-stats" role="group" aria-label="Thống kê người dùng">
    <div class="stat-item" :title="`${uploads} tài liệu đã tải lên`">
      <div class="stat-value">{{ formatNumber(uploads) }}</div>
      <div class="stat-label">Tài liệu</div>
    </div>
    <div class="stat-item" :title="`${downloads} lượt tải xuống`">
      <div class="stat-value">{{ formatNumber(downloads) }}</div>
      <div class="stat-label">Lượt tải</div>
    </div>
    <div class="stat-item" :title="`${bookmarks} tài liệu đã lưu`">
      <div class="stat-value">{{ formatNumber(bookmarks) }}</div>
      <div class="stat-label">Đã lưu</div>
    </div>
    <div class="stat-item" :title="`${points} điểm uy tín`">
      <div class="stat-value">{{ formatNumber(points) }}</div>
      <div class="stat-label">Điểm</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileStats',
  props: {
    uploads: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    }
  },
  methods: {
    formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num.toString()
    }
  }
}
</script>

<style scoped>
.profile-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-item {
  text-align: center;
  cursor: default;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0B6EFD;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>













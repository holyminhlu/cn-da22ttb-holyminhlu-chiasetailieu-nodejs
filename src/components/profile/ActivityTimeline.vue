<template>
  <div class="activity-timeline" role="list">
    <div
      v-for="(activity, index) in activities"
      :key="index"
      class="activity-item"
      role="listitem"
    >
      <div class="activity-icon">
        <span v-if="activity.icon">{{ activity.icon }}</span>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
      <div class="activity-content">
        <p class="activity-text">{{ activity.text }}</p>
        <time class="activity-date" :datetime="activity.date">{{ formatDate(activity.date) }}</time>
      </div>
    </div>
    <div v-if="activities.length === 0" class="empty-state">
      <p>Chưa có hoạt động nào</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityTimeline',
  props: {
    activities: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return 'Hôm nay'
      if (days === 1) return 'Hôm qua'
      if (days < 7) return `${days} ngày trước`
      if (days < 30) return `${Math.floor(days / 7)} tuần trước`
      if (days < 365) return `${Math.floor(days / 30)} tháng trước`
      return date.toLocaleDateString('vi-VN')
    }
  }
}
</script>

<style scoped>
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  position: relative;
  padding-left: 2rem;
}

.activity-item::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 24px;
  bottom: -24px;
  width: 2px;
  background: #E2E8F0;
}

.activity-item:last-child::before {
  display: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0B6EFD;
  flex-shrink: 0;
  position: absolute;
  left: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 0.25rem 0;
  color: #0F172A;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.activity-date {
  color: #64748B;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #64748B;
}
</style>













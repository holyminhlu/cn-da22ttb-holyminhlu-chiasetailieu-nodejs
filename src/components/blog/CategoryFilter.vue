<template>
  <div class="category-filter">
    <h3 class="category-filter-title">Danh Mục</h3>
    <div class="category-filter-list">
      <button
        v-for="category in categories"
        :key="category"
        :class="['category-filter-item', { active: selectedCategory === category }]"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>
    </div>
    <button 
      v-if="selectedCategory"
      class="category-filter-clear"
      @click="clearFilter"
    >
      Xóa bộ lọc
    </button>
  </div>
</template>

<script>
export default {
  name: 'CategoryFilter',
  props: {
    categories: {
      type: Array,
      default: () => [
        'Tài liệu học tập',
        'Mẹo học tập',
        'Công nghệ / Lập trình',
        'Kinh nghiệm sinh viên',
        'Hướng dẫn sử dụng OLF'
      ]
    },
    selectedCategory: {
      type: String,
      default: ''
    }
  },
  methods: {
    selectCategory(category) {
      this.$emit('filter-by-category', category === this.selectedCategory ? '' : category)
    },
    clearFilter() {
      this.$emit('filter-by-category', '')
    }
  }
}
</script>

<style scoped>
.category-filter {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.category-filter-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.category-filter-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-filter-item {
  background: #f9fafb;
  border: 2px solid transparent;
  color: #374151;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.category-filter-item:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.category-filter-item.active {
  background: #eef2ff;
  border-color: #4f46e5;
  color: #4f46e5;
  font-weight: 600;
}

.category-filter-clear {
  margin-top: 12px;
  width: 100%;
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-filter-clear:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

/* Responsive */
@media (max-width: 768px) {
  .category-filter {
    padding: 16px;
  }
  
  .category-filter-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .category-filter-item {
    flex: 1;
    min-width: calc(50% - 4px);
  }
}
</style>



<template>
  <div class="filter-panel" role="complementary" aria-label="Bộ lọc tài liệu">
    <!-- Mobile: Collapsible Accordion -->
    <button
      v-if="isMobile"
      class="filter-toggle"
      type="button"
      :aria-expanded="isOpen"
      aria-controls="filter-content"
      @click="togglePanel"
    >
      <span>Bộ lọc</span>
      <svg
        :class="['toggle-icon', { open: isOpen }]"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <!-- Filter Content -->
    <div
      :id="isMobile ? 'filter-content' : null"
      :class="['filter-content', { 'mobile-open': isMobile && isOpen, 'mobile-closed': isMobile && !isOpen }]"
    >
      <!-- Category Filter -->
      <div class="filter-section">
        <label class="filter-label" for="filter-category">
          Chuyên ngành
        </label>
        <select
          id="filter-category"
          v-model="localFilters.category"
          class="filter-select"
          @change="emitFilters"
        >
          <option value="">Tất cả</option>
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.label }}
          </option>
        </select>
      </div>

      <!-- Program Filter -->
      <div class="filter-section">
        <label class="filter-label" for="filter-program">
          Chương trình đào tạo <span class="required">*</span>
        </label>
        <select
          id="filter-program"
          v-model="localFilters.program"
          class="filter-select"
          @change="emitFilters"
        >
          <option value="">Tất cả</option>
          <option
            v-for="prog in programs"
            :key="prog.id"
            :value="prog.id"
          >
            {{ prog.label }}
          </option>
        </select>
      </div>

      <!-- Year Filter -->
      <div class="filter-section">
        <label class="filter-label" for="filter-year">
          Năm học
        </label>
        <select
          id="filter-year"
          v-model="localFilters.year"
          class="filter-select"
          @change="emitFilters"
        >
          <option value="">Tất cả</option>
          <option
            v-for="y in years"
            :key="y"
            :value="y"
          >
            {{ y }}
          </option>
        </select>
      </div>

      <!-- File Type Filter -->
      <div class="filter-section">
        <label class="filter-label" for="filter-file-type">
          Loại file
        </label>
        <select
          id="filter-file-type"
          v-model="localFilters.fileType"
          class="filter-select"
          @change="emitFilters"
        >
          <option value="">Tất cả</option>
          <option value="pdf">PDF</option>
          <option value="pptx">PowerPoint</option>
          <option value="docx">Word</option>
          <option value="zip">ZIP</option>
        </select>
      </div>

      <!-- Level Filter -->
      <div class="filter-section">
        <label class="filter-label" for="filter-level">
          Mức độ
        </label>
        <select
          id="filter-level"
          v-model="localFilters.level"
          class="filter-select"
          @change="emitFilters"
        >
          <option value="">Tất cả</option>
          <option value="basic">Cơ bản</option>
          <option value="advanced">Nâng cao</option>
        </select>
      </div>

      <!-- Language Filter -->
      <div class="filter-section">
        <label class="filter-label" for="filter-language">
          Ngôn ngữ
        </label>
        <select
          id="filter-language"
          v-model="localFilters.language"
          class="filter-select"
          @change="emitFilters"
        >
          <option value="">Tất cả</option>
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
      </div>

      <!-- Tags Filter (Typeahead) -->
      <div class="filter-section">
        <label class="filter-label" for="filter-tags">
          Tags
        </label>
        <div class="tags-input-wrapper">
          <input
            id="filter-tags"
            v-model="tagInput"
            type="text"
            class="tags-input"
            placeholder="Nhập tag và nhấn Enter"
            @keydown.enter.prevent="addTag"
            @keydown.delete="removeLastTag"
          />
          <div class="tags-list">
            <span
              v-for="(tag, index) in localFilters.tags"
              :key="index"
              class="tag-chip"
            >
              {{ tag }}
              <button
                type="button"
                class="tag-remove"
                :aria-label="`Xóa tag ${tag}`"
                @click="removeTag(index)"
              >
                ×
              </button>
            </span>
          </div>
        </div>
      </div>

      <!-- Rating Filter -->
      <div class="filter-section">
        <label class="filter-label">
          Đánh giá tối thiểu
        </label>
        <div class="rating-filter">
          <input
            id="filter-rating"
            v-model.number="localFilters.minRating"
            type="range"
            min="0"
            max="5"
            step="0.1"
            class="rating-slider"
            @input="emitFilters"
          />
          <div class="rating-display">
            <span>{{ localFilters.minRating.toFixed(1) }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Sort By -->
      <div class="filter-section">
        <label class="filter-label" for="filter-sort">
          Sắp xếp theo
        </label>
        <select
          id="filter-sort"
          v-model="localFilters.sortBy"
          class="filter-select"
          @change="emitFilters"
        >
          <option value="relevance">Phù hợp nhất</option>
          <option value="newest">Mới nhất</option>
          <option value="downloads">Nhiều lượt tải</option>
          <option value="rating">Đánh giá cao</option>
        </select>
      </div>

      <!-- Clear All Button -->
      <button
        v-if="hasActiveFilters"
        class="clear-all-btn"
        type="button"
        @click="clearAllFilters"
      >
        Xóa tất cả bộ lọc
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

export default {
  name: 'FilterPanel',
  props: {
    filters: {
      type: Object,
      default: () => ({
        category: '',
        program: '',
        year: '',
        fileType: '',
        level: '',
        language: '',
        tags: [],
        minRating: 0,
        sortBy: 'relevance'
      })
    },
    programs: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    },
    availableTags: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:filters'],
  setup(props, { emit }) {
    const localFilters = ref({ ...props.filters })
    const tagInput = ref('')
    const isOpen = ref(false)
    const isMobile = ref(window.innerWidth < 960)

    // Generate years (2015-2026)
    const years = Array.from({ length: 12 }, (_, i) => 2015 + i)

    // Watch for external filter changes
    watch(() => props.filters, (newFilters) => {
      localFilters.value = { ...newFilters }
    }, { deep: true })

    // Check if any filter is active
    const hasActiveFilters = computed(() => {
      return localFilters.value.category !== '' ||
             localFilters.value.program !== '' ||
             localFilters.value.year !== '' ||
             localFilters.value.fileType !== '' ||
             localFilters.value.level !== '' ||
             localFilters.value.language !== '' ||
             localFilters.value.tags.length > 0 ||
             localFilters.value.minRating > 0 ||
             localFilters.value.sortBy !== 'relevance'
    })

    const emitFilters = () => {
      emit('update:filters', { ...localFilters.value })
    }

    const addTag = () => {
      const tag = tagInput.value.trim()
      if (tag && !localFilters.value.tags.includes(tag)) {
        localFilters.value.tags.push(tag)
        tagInput.value = ''
        emitFilters()
      }
    }

    const removeTag = (index) => {
      localFilters.value.tags.splice(index, 1)
      emitFilters()
    }

    const removeLastTag = () => {
      if (tagInput.value === '' && localFilters.value.tags.length > 0) {
        removeTag(localFilters.value.tags.length - 1)
      }
    }

    const clearAllFilters = () => {
      localFilters.value = {
        category: '',
        program: '',
        year: '',
        fileType: '',
        level: '',
        language: '',
        tags: [],
        minRating: 0,
        sortBy: 'relevance'
      }
      emitFilters()
    }

    const togglePanel = () => {
      isOpen.value = !isOpen.value
    }

    const handleResize = () => {
      isMobile.value = window.innerWidth < 960
      if (!isMobile.value) {
        isOpen.value = true
      }
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
      if (!isMobile.value) {
        isOpen.value = true
      }
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      localFilters,
      tagInput,
      isOpen,
      isMobile,
      years,
      hasActiveFilters,
      emitFilters,
      addTag,
      removeTag,
      removeLastTag,
      clearAllFilters,
      togglePanel
    }
  }
}
</script>

<style scoped>
.filter-panel {
  background: white;
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-md);
}

.filter-toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-base);
}

.filter-toggle:hover {
  background: var(--color-primary-hover);
}

.filter-toggle:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.toggle-icon {
  transition: transform var(--transition-base);
}

.toggle-icon.open {
  transform: rotate(180deg);
}

.filter-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-5);
  margin-top: var(--spacing-4);
}

@media (max-width: 959px) {
  .filter-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
}

@media (min-width: 1200px) {
  .filter-content {
    grid-template-columns: repeat(3, 1fr);
  }
}

.filter-content.mobile-closed {
  display: none !important;
}

.filter-content.mobile-open {
  display: grid !important;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--color-neutral-50);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-neutral-200);
  transition: var(--transition-base);
}

.filter-section:hover {
  border-color: var(--color-primary);
  background: var(--color-neutral-100);
}

.filter-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-dark);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.required {
  color: var(--color-error);
}

.filter-select {
  padding: var(--spacing-3);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  background: white;
  cursor: pointer;
  transition: var(--transition-base);
  font-family: var(--font-family-base);
}

.filter-select:hover {
  border-color: var(--color-primary);
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.tags-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.tags-input {
  padding: var(--spacing-3);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-family: var(--font-family-base);
  transition: var(--transition-base);
}

.tags-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-3);
  background: var(--color-neutral-100);
  color: var(--color-dark);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
}

.tag-remove {
  background: transparent;
  border: none;
  color: var(--color-neutral-600);
  cursor: pointer;
  font-size: var(--font-size-lg);
  line-height: 1;
  padding: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition-fast);
}

.tag-remove:hover {
  background: var(--color-neutral-300);
  color: var(--color-error);
}

.rating-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.rating-slider {
  flex: 1;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--color-neutral-200);
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.rating-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  transition: var(--transition-fast);
}

.rating-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.rating-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
  transition: var(--transition-fast);
}

.rating-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.rating-slider:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 4px;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  min-width: 60px;
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
}

.clear-all-btn {
  padding: var(--spacing-3);
  background: var(--color-neutral-100);
  color: var(--color-dark);
  border: 2px solid var(--color-neutral-300);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-base);
  margin-top: var(--spacing-2);
}

.clear-all-btn:hover {
  background: var(--color-neutral-200);
  border-color: var(--color-neutral-400);
}

.clear-all-btn:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

@media (max-width: 959px) {
  .filter-panel {
    margin-bottom: var(--spacing-4);
  }
}

@media (prefers-reduced-motion: reduce) {
  .toggle-icon,
  .filter-select,
  .tags-input,
  .rating-slider,
  .clear-all-btn {
    transition: none;
  }
}
</style>


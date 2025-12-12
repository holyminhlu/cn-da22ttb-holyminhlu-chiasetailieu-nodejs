<template>
  <div class="search-bar-wrapper" role="search" aria-label="Tìm kiếm tài liệu">
    <div class="search-input-container">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input
        ref="searchInput"
        v-model="query"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        autocomplete="off"
        aria-label="Tìm kiếm"
        aria-expanded="showSuggestions"
        aria-autocomplete="list"
        role="combobox"
        @input="handleInput"
        @keydown.enter.prevent="handleSubmit"
        @keydown.down.prevent="navigateSuggestions(1)"
        @keydown.up.prevent="navigateSuggestions(-1)"
        @keydown.esc="closeSuggestions"
        @focus="showSuggestions = true"
        @blur="handleBlur"
      />
      <button
        v-if="query"
        class="clear-btn"
        type="button"
        aria-label="Xóa tìm kiếm"
        @click="clearSearch"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <button
        class="search-submit-btn"
        type="button"
        aria-label="Tìm kiếm"
        @click="handleSubmit"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>
    </div>

    <!-- Filter Pills -->
    <div v-if="showFilters && filters.length > 0" class="filter-pills" role="group" aria-label="Bộ lọc tìm kiếm">
      <button
        v-for="filter in filters"
        :key="filter.id"
        :class="['filter-pill', { active: filter.active }]"
        type="button"
        :aria-pressed="filter.active"
        @click="toggleFilter(filter)"
      >
        {{ filter.label }}
        <svg v-if="filter.active" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
    </div>

    <!-- Suggestions Dropdown -->
    <div
      v-if="showSuggestions && (suggestions.length > 0 || recentSearches.length > 0)"
      class="suggestions-dropdown"
      role="listbox"
      :aria-label="suggestions.length > 0 ? 'Gợi ý tìm kiếm' : 'Tìm kiếm gần đây'"
    >
      <div v-if="recentSearches.length > 0 && !query" class="suggestions-section">
        <div class="suggestions-header">Tìm kiếm gần đây</div>
        <button
          v-for="(recent, index) in recentSearches"
          :key="`recent-${index}`"
          :class="['suggestion-item', { highlighted: highlightedIndex === index }]"
          type="button"
          role="option"
          @click="selectSuggestion(recent)"
          @mouseenter="highlightedIndex = index"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span>{{ recent }}</span>
        </button>
      </div>
      
      <div v-if="suggestions.length > 0" class="suggestions-section">
        <div v-if="recentSearches.length > 0" class="suggestions-header">Gợi ý</div>
        <button
          v-for="(suggestion, index) in suggestions"
          :key="`suggest-${index}`"
          :class="['suggestion-item', { highlighted: highlightedIndex === recentSearches.length + index }]"
          type="button"
          role="option"
          @click="selectSuggestion(suggestion)"
          @mouseenter="highlightedIndex = recentSearches.length + index"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span v-html="highlightMatch(suggestion)"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue'

export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Tìm theo môn, mã học phần, tên tác giả...'
    },
    showFilters: {
      type: Boolean,
      default: true
    },
    filters: {
      type: Array,
      default: () => []
    },
    autocompleteEnabled: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'search', 'filter-change'],
  setup(props, { emit }) {
    const query = ref(props.modelValue)
    const showSuggestions = ref(false)
    const suggestions = ref([])
    const recentSearches = ref(JSON.parse(localStorage.getItem('recentSearches') || '[]'))
    const highlightedIndex = ref(-1)
    const searchInput = ref(null)

    // Mock autocomplete suggestions - replace with API call
    const mockSuggestions = [
      'Đại số tuyến tính',
      'Lập trình C++',
      'Toán cao cấp',
      'Cấu trúc dữ liệu',
      'Hệ điều hành',
      'Mạng máy tính',
      'Cơ sở dữ liệu',
      'Java programming',
      'Machine Learning',
      'Web development'
    ]

    // Watch for external changes
    watch(() => props.modelValue, (newVal) => {
      query.value = newVal
    })

    const handleInput = async () => {
      emit('update:modelValue', query.value)
      
      if (!props.autocompleteEnabled || !query.value.trim()) {
        suggestions.value = []
        return
      }

      // Debounce search - in production, use debounce utility
      const searchTerm = query.value.toLowerCase()
      suggestions.value = mockSuggestions
        .filter(item => item.toLowerCase().includes(searchTerm))
        .slice(0, 5)
      
      showSuggestions.value = true
    }

    const handleSubmit = () => {
      if (highlightedIndex.value >= 0 && suggestions.value.length > 0) {
        const selected = highlightedIndex.value < recentSearches.value.length
          ? recentSearches.value[highlightedIndex.value]
          : suggestions.value[highlightedIndex.value - recentSearches.value.length]
        query.value = selected
      }

      if (query.value.trim()) {
        // Save to recent searches
        const recent = recentSearches.value.filter(r => r !== query.value)
        recent.unshift(query.value)
        recentSearches.value = recent.slice(0, 5)
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))

        emit('search', query.value)
        closeSuggestions()
      }
    }

    const selectSuggestion = (suggestion) => {
      query.value = suggestion
      emit('update:modelValue', suggestion)
      handleSubmit()
    }

    const navigateSuggestions = (direction) => {
      const totalItems = recentSearches.value.length + suggestions.value.length
      if (totalItems === 0) return

      highlightedIndex.value += direction
      if (highlightedIndex.value < 0) {
        highlightedIndex.value = totalItems - 1
      } else if (highlightedIndex.value >= totalItems) {
        highlightedIndex.value = 0
      }

      // Scroll into view
      nextTick(() => {
        const highlightedEl = searchInput.value?.parentElement?.querySelector('.highlighted')
        highlightedEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      })
    }

    const closeSuggestions = () => {
      showSuggestions.value = false
      highlightedIndex.value = -1
    }

    const handleBlur = () => {
      // Delay to allow click events
      setTimeout(() => {
        closeSuggestions()
      }, 200)
    }

    const clearSearch = () => {
      query.value = ''
      emit('update:modelValue', '')
      suggestions.value = []
      searchInput.value?.focus()
    }

    const toggleFilter = (filter) => {
      filter.active = !filter.active
      emit('filter-change', props.filters)
    }

    const highlightMatch = (text) => {
      if (!query.value.trim()) return text
      const regex = new RegExp(`(${query.value})`, 'gi')
      return text.replace(regex, '<mark>$1</mark>')
    }

    return {
      query,
      showSuggestions,
      suggestions,
      recentSearches,
      highlightedIndex,
      searchInput,
      handleInput,
      handleSubmit,
      selectSuggestion,
      navigateSuggestions,
      closeSuggestions,
      handleBlur,
      clearSearch,
      toggleFilter,
      highlightMatch
    }
  }
}
</script>

<style scoped>
.search-bar-wrapper {
  position: relative;
  width: 100%;
  overflow: visible;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  transition: all 0.2s;
}

.search-input-container:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-bar-wrapper:focus-within .suggestions-dropdown {
  border-color: #3b82f6;
}

.search-icon {
  color: #6b7280;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #0F172A;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  margin-right: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.clear-btn:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}

.search-submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
  margin-left: 0.5rem;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.search-submit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.search-submit-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-pill:hover {
  background: #e5e7eb;
}

.filter-pill.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.filter-pill:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 99999;
  margin-top: 0.5rem;
}

.suggestions-section {
  padding: 0.5rem 0;
}

.suggestions-section:not(:last-child) {
  border-bottom: 1px solid #f3f4f6;
}

.suggestions-header {
  padding: 0.75rem 1rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #1f2937;
  font-size: 0.9375rem;
  transition: all 0.15s ease;
  border-left: 3px solid transparent;
}

.suggestion-item:hover,
.suggestion-item.highlighted {
  background: #f8fafc;
  border-left-color: #3b82f6;
}

.suggestion-item svg {
  color: #9ca3af;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.suggestion-item:hover svg,
.suggestion-item.highlighted svg {
  color: #3b82f6;
}

.suggestion-item mark {
  background: #dbeafe;
  color: #1e40af;
  font-weight: 600;
  padding: 0 0.125rem;
  border-radius: 2px;
}

/* Responsive */
@media (max-width: 599px) {
  .search-input-container {
    padding: 0.625rem 0.875rem;
  }

  .filter-pills {
    margin-top: 0.5rem;
  }
}
</style>

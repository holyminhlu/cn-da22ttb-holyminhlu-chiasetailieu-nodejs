<template>
  <article
    :class="['document-card', { compact }]"
    role="article"
    :aria-label="document.title"
  >
    <div class="card-image-wrapper">
      <img
        v-if="document.thumbnail"
        :src="document.thumbnail"
        :alt="`${document.title} thumbnail`"
        class="thumbnail"
        loading="lazy"
        @error="handleImageError"
      />
      <div v-else class="thumbnail-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      </div>
      <div class="card-overlay">
        <div class="quick-actions">
          <button
            class="action-btn"
            type="button"
            aria-label="Xem trước"
            title="Xem trước"
            @click.stop="handlePreview"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          <button
            class="action-btn"
            type="button"
            aria-label="Tải xuống"
            title="Tải xuống"
            @click.stop="handleDownload"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button
            class="action-btn"
            type="button"
            :aria-label="isSaved ? 'Bỏ lưu' : 'Lưu tài liệu'"
            :title="isSaved ? 'Bỏ lưu' : 'Lưu tài liệu'"
            @click.stop="toggleSave"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              :fill="isSaved ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div v-if="fileType" class="file-type-badge">
        {{ fileType }}
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="title">
        {{ document.title || 'Untitled' }}
      </h3>
      
      <!-- Authors -->
      <div v-if="displayAuthors" class="author-info">
        <span class="author-label">Tác giả:</span>
        <span class="author-name">
          {{ displayAuthors }}
        </span>
      </div>

      <!-- Program -->
      <div v-if="document.program" class="program-info">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <span class="program-name">{{ document.program }}</span>
      </div>

      <div class="tags" v-if="document.tags && document.tags.length > 0">
        <span
          v-for="tag in displayTags"
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </span>
        <span v-if="remainingTagsCount > 0" class="tag tag-more">
          +{{ remainingTagsCount }}
        </span>
      </div>

      <div class="card-meta">
        <div class="meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>{{ document.rating || 'N/A' }}</span>
        </div>
        <div class="meta-item" v-if="document.downloads !== undefined">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>{{ formatNumber(document.downloads) }}</span>
        </div>
        <div class="meta-item" v-if="document.year">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{{ document.year }}</span>
        </div>
      </div>

      <div v-if="document.license" class="license-info">
        <span class="license-badge">{{ document.license }}</span>
      </div>
    </div>
  </article>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'DocumentCard',
  props: {
    document: {
      type: Object,
      required: true
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  emits: ['preview', 'download', 'save'],
  setup(props, { emit }) {
    const isSaved = ref(false)
    
    // Check if document is saved when component mounts
    // This could be enhanced with API call to check saved status
    const imageError = ref(false)
    const maxVisibleTags = 3

    const displayAuthors = computed(() => {
      if (props.document.authors && Array.isArray(props.document.authors)) {
        return props.document.authors.join(', ')
      }
      if (props.document.author) {
        if (typeof props.document.author === 'object') {
          return props.document.author.name
        }
        return props.document.author
      }
      return null
    })

    const displayTags = computed(() => {
      if (!props.document.tags || !Array.isArray(props.document.tags)) {
        return []
      }
      return props.document.tags.slice(0, maxVisibleTags)
    })

    const remainingTagsCount = computed(() => {
      if (!props.document.tags || !Array.isArray(props.document.tags)) {
        return 0
      }
      return Math.max(0, props.document.tags.length - maxVisibleTags)
    })

    // Get fileType from document.file.fileType or document.fileType
    const fileType = computed(() => {
      if (props.document.file && props.document.file.fileType) {
        return props.document.file.fileType
      }
      if (props.document.fileType) {
        return props.document.fileType
      }
      return null
    })

    const handlePreview = () => {
      emit('preview', props.document)
    }

    const handleDownload = () => {
      emit('download', props.document)
    }

    const toggleSave = () => {
      console.log('🔖 Toggle save clicked:', {
        documentId: props.document.document_id || props.document.id || props.document._id,
        currentState: isSaved.value
      })
      isSaved.value = !isSaved.value
      emit('save', { document: props.document, saved: isSaved.value })
      console.log('🔖 Save event emitted:', { saved: isSaved.value })
    }

    const handleImageError = () => {
      imageError.value = true
    }

    const formatNumber = (num) => {
      if (!num && num !== 0) return '0'
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num.toString()
    }

    return {
      isSaved,
      imageError,
      displayAuthors,
      displayTags,
      remainingTagsCount,
      fileType,
      handlePreview,
      handleDownload,
      toggleSave,
      handleImageError,
      formatNumber
    }
  }
}
</script>

<style scoped>
.document-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  width: 100%; /* Fill wrapper width */
  height: 480px; /* Fixed height for all cards */
  max-width: 100%; /* Fill the grid column */
}

.document-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(29, 78, 216, 0.15);
  border-color: rgba(29, 78, 216, 0.2);
}

.document-card:focus-within {
  outline: 3px solid #1d4ed8;
  outline-offset: 4px;
}

.document-card.compact {
  flex-direction: row;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 180px; /* Fixed height for thumbnails */
  overflow: hidden;
  background: #f3f4f6;
  flex-shrink: 0;
}

.document-card.compact .card-image-wrapper {
  width: 120px;
  height: 120px; /* Fixed size for compact mode */
  flex-shrink: 0;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.document-card:hover .thumbnail {
  transform: scale(1.1);
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  background: #f3f4f6;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.document-card:hover .card-overlay {
  opacity: 1;
}

.quick-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #0F172A;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #1d4ed8;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
}

.action-btn:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
}

.file-type-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-content {
  padding: 1rem;
  flex: 1 1 auto; /* Grow to fill space but maintain consistency */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden; /* Prevent content from overflowing */
  min-height: 0; /* Allow flex shrinking */
}

.title {
  font-size: 1rem;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.8em; /* Fixed height for exactly 2 lines */
  flex-shrink: 0;
}

.title-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}

.title-link:hover {
  color: #1d4ed8;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  height: 24px; /* Fixed height for author section */
  flex-shrink: 0;
  overflow: hidden;
  white-space: nowrap;
}

.author-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-neutral-600);
}

.author-name {
  color: var(--color-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.program-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-neutral-600);
  height: 24px; /* Fixed height for program section */
  flex-shrink: 0;
  overflow: hidden;
}

.program-info svg {
  color: var(--color-primary);
  flex-shrink: 0;
}

.program-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 32px;
  max-height: 64px; /* Limit tag area height */
  overflow: hidden; /* Hide overflowing tags */
  flex-shrink: 0;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 6px;
  font-size: 0.75rem;
}

.tag-more {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.card-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: auto; /* Push meta to bottom */
  padding-top: 0.5rem;
  height: 28px; /* Fixed height for meta section */
  flex-shrink: 0;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.meta-item svg {
  color: #00C2A8;
}

.license-info {
  margin-top: 0;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
  height: 32px; /* Fixed height for license section */
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.license-badge {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Compact variant */
.document-card.compact .card-content {
  padding: 0.75rem;
}

.document-card.compact .title {
  font-size: 0.9375rem;
}

/* Responsive */
@media (max-width: 959px) {
  .document-card {
    max-width: 100%; /* Full width on tablet */
  }
}

@media (min-width: 1200px) {
  .document-card {
    max-width: 100%; /* Ensure cards don't exceed column width on large screens */
  }
}

@media (max-width: 599px) {
  .document-card {
    height: 420px; /* Fixed height for mobile */
    max-width: 100%; /* Full width on mobile */
  }

  .card-image-wrapper {
    height: 160px;
  }

  .card-content {
    padding: 0.75rem;
    gap: 0.5rem;
  }

  .quick-actions {
    gap: 0.5rem;
  }

  .action-btn {
    width: 36px;
    height: 36px;
  }
}
</style>
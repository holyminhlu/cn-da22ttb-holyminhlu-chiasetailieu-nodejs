<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-if="isOpen"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="document ? `modal-title-${document.id}` : 'modal-title'"
        @click.self="close"
        @keydown.esc="close"
      >
        <div class="modal-container" ref="modalContainer">
          <button
            class="modal-close"
            type="button"
            aria-label="Đóng"
            @click="close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div v-if="document" class="modal-content">
            <header class="modal-header">
              <div class="title-wrapper">
                <div class="title-meta">
                  <span class="file-badge">
                    {{ document.fileType || 'Tài liệu' }}
                  </span>
                  <span v-if="document.license" class="license-pill">
                    {{ document.license }}
                  </span>
                  <span v-if="document.level" class="level-pill">
                    {{ document.level === 'advanced' ? 'Nâng cao' : 'Cơ bản' }}
                  </span>
                </div>
                <h2 :id="`modal-title-${document.id}`" class="modal-title">
                  {{ document.title }}
                </h2>
                <p v-if="document.description" class="modal-description">
                  {{ document.description }}
                </p>
                <div class="info-chips">
                  <div class="info-chip" v-if="document.authors?.length || document.author">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>{{ document.authors?.length ? document.authors.join(', ') : (typeof document.author === 'object' ? document.author.name : document.author) }}</span>
                  </div>
                  <div class="info-chip" v-if="document.program">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <span>{{ document.program }}</span>
                  </div>
                  <div class="info-chip" v-if="document.year">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{{ document.year }}</span>
                  </div>
                  <div class="info-chip" v-if="document.uploadDate">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                      <path d="M16 2v4M8 2v4m-5 4h18"></path>
                    </svg>
                    <span>{{ formatDate(document.uploadDate) }}</span>
                  </div>
                </div>
              </div>
              <div class="stats-row">
                <div class="stat-card">
                  <span class="stat-label">Đánh giá</span>
                  <div class="stat-value">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>{{ document.rating ? document.rating.toFixed(1) : 'Chưa có' }}</span>
                  </div>
                  <small v-if="document.ratingCount">{{ document.ratingCount }} lượt đánh giá</small>
                </div>
                <div class="stat-card">
                  <span class="stat-label">Lượt tải</span>
                  <div class="stat-value">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>{{ document.downloads !== undefined ? formatNumber(document.downloads) : '0' }}</span>
                  </div>
                </div>
                <div class="stat-card">
                  <span class="stat-label">Lượt xem</span>
                  <div class="stat-value">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>{{ document.views !== undefined ? formatNumber(document.views) : '0' }}</span>
                  </div>
                </div>
              </div>
            </header>

            <div class="modal-body-wrapper">
              <section class="preview-pane" aria-label="Khu vực xem trước">
                <div class="preview-toolbar">
                  <div class="preview-status">
                    <span class="dot"></span>
                    <span>{{ previewType === 'placeholder' ? 'Không thể hiển thị xem trước' : 'Xem trước trực tiếp' }}</span>
                  </div>
                  <div class="toolbar-actions">
                    <button class="ghost-btn" type="button" @click="handleDownload">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Tải xuống
                    </button>
                    <button class="ghost-btn" type="button" @click="handleReport">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 3v18h18"></path>
                        <path d="M7 7h8l-2 4 2 4H7z"></path>
                      </svg>
                      Báo cáo
                    </button>
                    <a
                      v-if="document.fileUrl"
                      :href="document.fileUrl"
                      class="ghost-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Mở tab mới
                    </a>
                  </div>
                </div>

                <div v-if="previewType === 'pdf'" class="preview-surface">
                  <iframe
                    :src="previewSource"
                    class="preview-iframe"
                    title="PDF Preview"
                  ></iframe>
                </div>

                <div v-else-if="previewType === 'image'" class="preview-surface image-mode">
                  <img
                    :src="previewSource"
                    :alt="document.title"
                    class="preview-image"
                  />
                </div>

                <div v-else-if="previewType === 'docx'" class="preview-surface docx-mode">
                  <div class="docx-preview-wrapper">
                    <div
                      ref="docxPreviewEl"
                      class="docx-preview-container"
                      aria-label="Word document preview"
                    ></div>
                    <div v-if="docxLoading" class="docx-preview-overlay">
                      <span class="loader" aria-hidden="true"></span>
                      <p>Đang tải tài liệu Word...</p>
                    </div>
                    <div v-else-if="docxError" class="docx-preview-overlay error">
                      <p>{{ docxError }}</p>
                      <button class="btn btn-secondary" type="button" @click="handleImmediateDownload">
                        Tải xuống để xem
                      </button>
                    </div>
                  </div>
                </div>

                <div v-else-if="previewType === 'pptx'" class="preview-surface pptx-mode">
                  <iframe
                    :src="previewSource"
                    class="preview-iframe"
                    title="PowerPoint Preview"
                    frameborder="0"
                  ></iframe>
                </div>

                <div v-else class="preview-placeholder">
                  <div class="placeholder-card">
                    <div class="icon-ring">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <p class="placeholder-title">Xem trước không khả dụng</p>
                    <p class="placeholder-subtitle">
                      Loại tệp hoặc đường dẫn hiện tại không hỗ trợ xem trực tiếp. Bạn có thể tải tài liệu để mở bằng ứng dụng phù hợp.
                    </p>
                    <div class="placeholder-actions">
                      <button class="btn btn-primary" type="button" @click="handleImmediateDownload">
                        Tải xuống tài liệu
                      </button>
                      <a
                        v-if="document.fileUrl"
                        :href="document.fileUrl"
                        class="btn btn-secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Mở bằng tab mới
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              <aside class="info-pane" role="complementary" aria-label="Thông tin tài liệu">
                <div class="info-section">
                  <h3>Thông tin chung</h3>
                  <ul class="detail-list">
                    <li>
                      <span>Chuyên ngành</span>
                      <strong>{{ document.program || 'Đang cập nhật' }}</strong>
                    </li>
                    <li>
                      <span>Môn / Mã học phần</span>
                      <strong>{{ document.courseCode || 'Không có' }}</strong>
                    </li>
                    <li>
                      <span>Năm học</span>
                      <strong>{{ document.year || 'Chưa rõ' }}</strong>
                    </li>
                    <li>
                      <span>Định dạng tệp</span>
                      <strong>{{ document.fileType?.toUpperCase() || 'PDF' }}</strong>
                    </li>
                    <li>
                      <span>Kích thước</span>
                      <strong>{{ document.file?.fileSize ? `${(document.file.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Đang cập nhật' }}</strong>
                    </li>
                  </ul>
                </div>

                <div v-if="document.tags?.length" class="info-section">
                  <h3>Tags nổi bật</h3>
                  <div class="tags-grid">
                    <span v-for="tag in document.tags" :key="tag" class="tag-pill">
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <div class="info-section">
                  <h3>Hành động</h3>
                  <div class="action-row">
                    <button class="btn btn-primary" type="button" @click="handleImmediateDownload">
                      Tải xuống ngay
                    </button>
                    <button class="btn btn-secondary btn-report" type="button" @click="handleReport">
                      Báo cáo tài liệu
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'
import { renderAsync } from 'docx-preview'

export default {
  name: 'PreviewModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    document: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'download', 'report'],
  setup(props, { emit }) {
    const modalContainer = ref(null)
    const previewType = ref('placeholder')
    const docxPreviewEl = ref(null)
    const docxLoading = ref(false)
    const docxError = ref('')
    let docxAbortController = null

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
    const wordExtensions = ['doc', 'docx']
    const powerpointExtensions = ['ppt', 'pptx']

    const resetDocxState = () => {
      if (docxAbortController) {
        docxAbortController.abort()
        docxAbortController = null
      }
      docxLoading.value = false
      docxError.value = ''
      if (docxPreviewEl.value) {
        docxPreviewEl.value.innerHTML = ''
      }
    }

    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        document.body.style.overflow = 'hidden'
        nextTick(() => {
          modalContainer.value?.focus()
        })
      } else {
        document.body.style.overflow = ''
        resetDocxState()
      }
    })

    const extractExtension = (value = '') => {
      if (!value) return ''
      const sanitized = value.split('?')[0].split('#')[0]
      const parts = sanitized.split('.')
      if (parts.length < 2) return ''
      return parts.pop().toLowerCase()
    }

    const resolveFileUrl = (docOverride = null) => {
      const doc = docOverride || props.document
      if (!doc) return ''
      if (doc.fileUrl) return doc.fileUrl
      if (typeof doc.file === 'string') return doc.file
      if (doc.file && doc.file.fileUrl) return doc.file.fileUrl
      return ''
    }

    const getFileMetadata = (doc) => {
      const url = resolveFileUrl(doc)
      const rawFileType = doc?.fileType?.toString().toLowerCase() ||
        (typeof doc?.file === 'object' && doc.file?.fileType
          ? doc.file.fileType.toString().toLowerCase()
          : '')
      const normalizedType = rawFileType.includes('/')
        ? rawFileType.split('/').pop()
        : rawFileType
      const fallbackName = (typeof doc?.file === 'object' && doc.file?.originalName) ||
        (typeof doc?.file === 'object' && doc.file?.fileName) ||
        ''
      const extension = extractExtension(url) || extractExtension(fallbackName)

      return {
        url,
        normalizedType,
        extension
      }
    }

    const determinePreviewType = (doc) => {
      const { normalizedType = '', extension = '' } = getFileMetadata(doc)
      const typeHint = normalizedType || ''
      const extHint = extension || ''

      if (typeHint.includes('pdf') || extHint === 'pdf') {
        return 'pdf'
      }

      if (imageExtensions.some(ext => typeHint.includes(ext) || extHint === ext)) {
        return 'image'
      }

      const wordTokens = ['word', 'document', ...wordExtensions]
      if (wordTokens.some(token => typeHint.includes(token)) || wordExtensions.includes(extHint)) {
        return 'docx'
      }

      const powerpointTokens = ['powerpoint', 'presentation', ...powerpointExtensions]
      if (powerpointTokens.some(token => typeHint.includes(token)) || powerpointExtensions.includes(extHint)) {
        return 'pptx'
      }

      return 'placeholder'
    }

    const loadDocxPreview = async () => {
      const doc = props.document
      if (!doc) return

      const url = resolveFileUrl(doc)
      if (!url) {
        docxError.value = 'Không tìm thấy đường dẫn tài liệu.'
        return
      }

      if (docxAbortController) {
        docxAbortController.abort()
      }
      docxAbortController = new AbortController()

      docxLoading.value = true
      docxError.value = ''

      try {
        await nextTick()
        if (!docxPreviewEl.value) {
          throw new Error('DOCX preview container is not ready')
        }
        docxPreviewEl.value.innerHTML = ''

        const response = await fetch(url, { signal: docxAbortController.signal })
        if (!response.ok) {
          throw new Error(`Không thể tải file (mã ${response.status})`)
        }

        const buffer = await response.arrayBuffer()
        await renderAsync(buffer, docxPreviewEl.value, null, {
          inWrapper: true,
          className: 'docx-rendered',
          ignoreFonts: true
        })
      } catch (error) {
        if (docxAbortController?.signal.aborted) {
          return
        }
        console.error('DOCX preview error:', error)
        docxError.value = 'Không thể hiển thị file Word. Vui lòng tải xuống để xem chi tiết.'
      } finally {
        if (!docxAbortController?.signal.aborted) {
          docxLoading.value = false
        }
      }
    }

    watch(() => props.document, (doc) => {
      resetDocxState()
      if (doc) {
        previewType.value = determinePreviewType(doc)
      } else {
        previewType.value = 'placeholder'
      }
    })

    watch(previewType, (type) => {
      if (type === 'docx') {
        loadDocxPreview()
      } else {
        resetDocxState()
      }
    })

    const previewSource = computed(() => {
      if (!props.document) return ''
      const doc = props.document
      const url = resolveFileUrl(doc)
      
      if (previewType.value === 'pdf') {
        return url || `/preview/${doc.id}`
      }
      
      if (previewType.value === 'image') {
        return doc.thumbnail || url
      }
      
      if (previewType.value === 'pptx') {
        if (!url) return ''
        // Sử dụng Microsoft Office Online Viewer để xem PPTX
        // Hoặc có thể dùng Google Docs Viewer
        const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`
      }
      
      return url
    })

    const close = () => {
      emit('close')
    }

    const handleDownload = () => {
      emit('download', props.document)
    }

    const handleImmediateDownload = () => {
      handleDownload()
      const url = resolveFileUrl()
      if (url) {
        window.open(url, '_blank')
      }
    }

    const handleReport = () => {
      emit('report', props.document)
    }

    const formatNumber = (num) => {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num.toString()
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    onMounted(() => {
      // Trap focus within modal
      const handleKeyDown = (e) => {
        if (!props.isOpen) return
        if (e.key === 'Escape') {
          close()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      
      onUnmounted(() => {
        document.removeEventListener('keydown', handleKeyDown)
      })
    })

    return {
      modalContainer,
      previewType,
      previewSource,
      docxPreviewEl,
      docxLoading,
      docxError,
      close,
      handleDownload,
      handleImmediateDownload,
      handleReport,
      formatNumber,
      formatDate
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 25000;
  padding: 2rem 1rem;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  background: white;
  border-radius: 10px;
  max-width: 90vw;
  max-height: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  outline: none;
  margin: auto;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.modal-close:focus-visible {
  outline: 3px solid #0B6EFD;
  outline-offset: 2px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  max-height: none;
  overflow: visible;
}

.modal-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.02), transparent);
}

.title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.title-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.file-badge,
.license-pill,
.level-pill {
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.file-badge {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.license-pill {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

.level-pill {
  background: rgba(249, 115, 22, 0.12);
  color: #ea580c;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
  margin: 0;
}

.modal-description {
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
}

.info-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.info-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  background: #f8fafc;
  border-radius: 999px;
  font-size: 0.875rem;
  color: #1e293b;
}

.info-chip svg {
  color: #2563eb;
}

.stats-row {
  display: flex;
  gap: 1rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 140px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.stat-value {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
}

.stat-card small {
  color: #94a3b8;
  font-size: 0.75rem;
}

.modal-body-wrapper {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(280px, 1fr);
  gap: 1.5rem;
  padding: 1.5rem 2rem 2rem;
  background: #f8fafc;
}

.preview-pane {
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 540px;
}

.preview-toolbar {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.preview-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #0f172a;
}

.preview-status .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  display: inline-block;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.ghost-btn {
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  background: transparent;
  border: 1px solid transparent;
  font-size: 0.85rem;
  color: #1f2937;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  box-sizing: border-box;
  height: 38px;
  white-space: nowrap;
}

.ghost-btn:hover {
  border-color: #e2e8f0;
  background: #f8fafc;
}

.ghost-btn svg {
  color: #2563eb;
  flex-shrink: 0;
}

.preview-surface {
  flex: 1;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.preview-surface.image-mode {
  background: #0b1120;
}

.docx-mode {
  background: #e2e8f0;
}

.pptx-mode {
  background: #f8fafc;
}

.docx-preview-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 1rem;
}

.docx-preview-container {
  min-height: 100%;
  width: 100%;
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.06);
}

.docx-preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
  background: rgba(241, 245, 249, 0.92);
  padding: 1.5rem;
}

.docx-preview-overlay.error {
  background: rgba(255, 255, 255, 0.95);
}

.docx-preview-overlay .loader {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 3px solid #cbd5f5;
  border-top-color: #2563eb;
  animation: docx-spin 0.9s linear infinite;
}

@keyframes docx-spin {
  to {
    transform: rotate(360deg);
  }
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  background: #111827;
}

.preview-placeholder {
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.placeholder-card {
  max-width: 420px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.icon-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 1px dashed #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.placeholder-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.placeholder-subtitle {
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

.placeholder-actions {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  width: 100%;
  align-items: stretch;
}

.placeholder-actions .btn {
  flex: 1;
  width: 100%;
  height: 56px;
  min-height: 56px;
  max-height: 56px;
  font-size: 0.95rem;
  padding: 0 1rem;
  box-sizing: border-box;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

@media (max-width: 639px) {
  .placeholder-actions {
    flex-direction: column;
  }
  
  .placeholder-actions .btn {
    width: 100%;
  }
}

.info-pane {
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-height: 100%;
  overflow-y: auto;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.info-section h3 {
  margin: 0;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.detail-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #475569;
}

.detail-list span {
  color: #94a3b8;
}

.detail-list strong {
  color: #0f172a;
  font-size: 0.95rem;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-pill {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: #f1f5f9;
  font-size: 0.85rem;
  color: #0f172a;
}

.action-row {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  width: 100%;
}

.action-row .btn {
  flex: 1;
  width: 100%;
  height: 56px;
  min-height: 56px;
  max-height: 56px;
  white-space: nowrap;
  font-size: 0.95rem;
  padding: 0 1rem;
  box-sizing: border-box;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-row .btn svg {
  flex-shrink: 0;
}

@media (max-width: 639px) {
  .action-row {
    flex-direction: column;
  }
  
  .action-row .btn {
    width: 100%;
  }
}

.btn {
  /* Reset defaults */
  margin: 0;
  padding: 0 1rem;
  border: 1px solid transparent;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  box-sizing: border-box;
  
  /* Style */
  border-radius: 10px;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.15);
}

.btn-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-secondary {
  background: #ffffff;
  color: #0f172a;
  border-color: #e2e8f0;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.4);
  outline-offset: 2px;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s, opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

/* Responsive */
@media (max-width: 1199px) {
  .modal-body-wrapper {
    grid-template-columns: 1fr;
  }

  .info-pane {
    max-height: none;
  }
}

@media (max-width: 599px) {
  .modal-container {
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }

  .modal-header {
    padding: 1.5rem 1.25rem;
  }

  .modal-body-wrapper {
    padding: 1.25rem;
  }

  .preview-pane {
    border-radius: 14px;
  }

  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .pdf-preview,
  .image-preview {
    height: 300px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .modal-container,
  .modal-leave-active .modal-container {
    transition: none;
  }
}
</style>

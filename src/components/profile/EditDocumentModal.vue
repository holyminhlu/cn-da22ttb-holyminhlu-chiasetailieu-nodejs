<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Sửa tài liệu"
      tabindex="-1"
      @keydown.esc.stop.prevent="$emit('close')"
      @click.self="$emit('close')"
    >
      <div class="edit-document-modal">
        <div class="edit-document-modal__header">
          <h3 class="edit-document-modal__title">Sửa tài liệu</h3>
          <button class="btn-icon" type="button" aria-label="Đóng" @click="$emit('close')">
            ✕
          </button>
        </div>

        <div class="edit-document-modal__body" ref="modalBodyEl">
          <div v-if="document" class="readonly-block">
            <h4 class="readonly-title">Thông tin tài liệu (không sửa)</h4>
            <div class="readonly-grid">
              <div class="readonly-item">
                <span class="readonly-label">Document ID</span>
                <span class="readonly-value">{{ document.document_id || document.id || document._id || '-' }}</span>
              </div>
              <div class="readonly-item">
                <span class="readonly-label">Trạng thái</span>
                <span class="readonly-value">{{ document.status || '-' }}</span>
              </div>
              <div class="readonly-item">
                <span class="readonly-label">License</span>
                <span class="readonly-value">{{ document.license || '-' }}</span>
              </div>
              <div class="readonly-item">
                <span class="readonly-label">Lượt tải</span>
                <span class="readonly-value">{{ (document.downloads ?? '-') }}</span>
              </div>
              <div class="readonly-item">
                <span class="readonly-label">Lượt xem</span>
                <span class="readonly-value">{{ (document.views ?? '-') }}</span>
              </div>
              <div class="readonly-item">
                <span class="readonly-label">Ngày tải lên</span>
                <span class="readonly-value">{{ formatDate(document.uploadDate || document.createdAt || document.updatedAt) }}</span>
              </div>
              <div class="readonly-item full">
                <span class="readonly-label">File</span>
                <span class="readonly-value">
                  {{ document.file?.originalName || document.file?.fileName || '-' }}
                  <template v-if="document.file?.fileSize"> ({{ formatBytes(document.file.fileSize) }})</template>
                </span>
              </div>
              <div class="readonly-item full" v-if="document.file?.fileUrl">
                <span class="readonly-label">File URL</span>
                <span class="readonly-value">{{ document.file.fileUrl }}</span>
              </div>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="label" for="doc-title">Tên tài liệu</label>
              <input id="doc-title" v-model.trim="form.title" class="input" type="text" maxlength="200" />
            </div>

            <div class="form-group full">
              <label class="label" for="doc-description">Mô tả</label>
              <textarea id="doc-description" v-model.trim="form.description" class="textarea" rows="4" maxlength="1000" />
              <p class="hint">Tối thiểu 20 ký tự.</p>
            </div>

            <div class="form-group">
              <label class="label" for="doc-program">Chương trình đào tạo</label>
              <select id="doc-program" v-model="form.program" class="select">
                <option value="">Chọn chương trình đào tạo</option>
                <option v-for="prog in programs" :key="prog.id" :value="prog.id">
                  {{ prog.label }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="label" for="doc-course">Mã học phần / Môn học</label>
              <input id="doc-course" v-model.trim="form.courseCode" class="input" type="text" />
            </div>

            <div class="form-group">
              <label class="label" for="doc-year">Năm học</label>
              <select id="doc-year" v-model="form.year" class="select">
                <option value="">Chọn năm học</option>
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label" for="doc-language">Ngôn ngữ</label>
              <select id="doc-language" v-model="form.language" class="select">
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label" for="doc-visibility">Quyền truy cập</label>
              <select id="doc-visibility" v-model="form.visibility" class="select">
                <option value="public">Công khai</option>
                <option value="private">Riêng tư</option>
                <option value="class-only">Chỉ lớp học</option>
              </select>
            </div>
          </div>
        </div>

        <div class="edit-document-modal__footer">
          <button class="btn-secondary" type="button" :disabled="saving" @click="$emit('close')">Hủy</button>
          <button class="btn-primary" type="button" :disabled="saving" @click="submit">
            {{ saving ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { reactive, watch, nextTick, ref, onUnmounted } from 'vue'

export default {
  name: 'EditDocumentModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    document: {
      type: Object,
      default: null
    },
    programs: {
      type: Array,
      default: () => []
    },
    saving: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const modalBodyEl = ref(null)
    let previousBodyOverflow = ''

    // Match UploadModal years range (2015-2026)
    const years = Array.from({ length: 12 }, (_, i) => 2015 + i)

    const form = reactive({
      title: '',
      description: '',
      program: '',
      courseCode: '',
      year: '',
      language: 'vi',
      visibility: 'public'
    })

    const resolveProgramId = (doc = {}) => {
      const raw = (doc.programId || doc.program_id || doc.program || doc.programName || '').toString()
      if (!raw) return ''
      const list = Array.isArray(props.programs) ? props.programs : []
      const byId = list.find(p => (p?.id || '').toString() === raw)
      if (byId) return byId.id
      const byLabel = list.find(p => (p?.label || '').toString() === raw)
      if (byLabel) return byLabel.id
      // Fallback: keep the raw value (in case DB stores program as id already)
      return raw
    }

    const hydrate = () => {
      const doc = props.document || {}
      form.title = (doc.title || '').toString()
      form.description = (doc.description || '').toString()
      form.program = resolveProgramId(doc)
      form.courseCode = (doc.courseCode || doc.course_code || '').toString()

      // Ensure year selection matches the select option values (numbers)
      const rawYear = doc.year ?? doc.schoolYear ?? doc.academicYear
      const parsedYear = rawYear === '' || rawYear === null || rawYear === undefined ? '' : parseInt(rawYear, 10)
      form.year = Number.isFinite(parsedYear) ? parsedYear : ''

      const languages = Array.isArray(doc.languages) ? doc.languages : (doc.language ? [doc.language] : [])
      form.language = (languages[0] || 'vi').toString()
      form.visibility = (doc.visibility || 'public').toString()
    }

    const lockBodyScroll = () => {
      if (typeof document === 'undefined') return
      // Store previous value so we can restore correctly
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }

    const unlockBodyScroll = () => {
      if (typeof document === 'undefined') return
      document.body.style.overflow = previousBodyOverflow || ''
    }

    watch(
      () => props.show,
      async (isOpen) => {
        if (isOpen) {
          hydrate()
          lockBodyScroll()
          await nextTick()
          // Ensure the modal is focusable and scrolling starts at top
          if (modalBodyEl.value) {
            modalBodyEl.value.scrollTop = 0
          }
        } else {
          unlockBodyScroll()
        }
      },
      { immediate: true }
    )

    watch(
      () => props.document,
      () => {
        if (props.show) hydrate()
      },
      { deep: false }
    )

    onUnmounted(() => {
      // Safety: ensure scroll is restored if component unmounts while open
      unlockBodyScroll()
    })

    const submit = () => {
      if (!form.title.trim()) {
        return
      }
      if (!form.description.trim() || form.description.trim().length < 20) {
        return
      }

      emit('save', {
        title: form.title.trim(),
        description: form.description.trim(),
        program: (form.program || '').toString().trim(),
        courseCode: form.courseCode.trim(),
        year: form.year === '' || form.year === null || form.year === undefined ? '' : String(form.year),
        languages: [form.language],
        visibility: form.visibility
      })
    }

    const formatBytes = (bytes) => {
      const num = Number(bytes)
      if (!Number.isFinite(num) || num <= 0) return '0 B'
      const units = ['B', 'KB', 'MB', 'GB', 'TB']
      const idx = Math.min(units.length - 1, Math.floor(Math.log(num) / Math.log(1024)))
      const value = num / Math.pow(1024, idx)
      return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`
    }

    const formatDate = (value) => {
      if (!value) return '-'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return '-'
      return date.toLocaleString('vi-VN')
    }

    return {
      form,
      modalBodyEl,
      years,
      submit,
      formatBytes,
      formatDate
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 2000;
  overflow: auto;
}

.edit-document-modal {
  width: 100%;
  max-width: 720px;
  max-height: calc(100vh - 2rem);
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.2);
  display: flex;
  flex-direction: column;
}

.edit-document-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #E2E8F0;
}

.edit-document-modal__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0F172A;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  color: #0F172A;
}

.edit-document-modal__body {
  padding: 1.25rem;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.readonly-block {
  padding: 0.9rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  background: #F8FAFF;
  margin-bottom: 1rem;
}

.readonly-title {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0F172A;
}

.readonly-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1rem;
}

.readonly-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.readonly-item.full {
  grid-column: 1 / -1;
}

.readonly-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.readonly-value {
  font-size: 0.9rem;
  color: #0F172A;
  word-break: break-word;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-group.full {
  grid-column: 1 / -1;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.375rem;
}

.input,
.select,
.textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #0F172A;
  background: white;
}

.textarea {
  resize: vertical;
  min-height: 110px;
}

.hint {
  margin: 0.375rem 0 0;
  font-size: 0.8125rem;
  color: #64748B;
}

.edit-document-modal__footer {
  display: flex;
  justify-content: stretch;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #E2E8F0;
  background: #F8FAFF;
}

.edit-document-modal__footer .btn-secondary,
.edit-document-modal__footer .btn-primary {
  flex: 1 1 0;
}

.btn-primary,
.btn-secondary {
  height: 44px;
  padding: 0 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
  box-sizing: border-box;
  white-space: nowrap;
  margin: 0;
}

.btn-secondary {
  border: 1px solid #E2E8F0;
  background: white;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  border: none;
  background: #0B6EFD;
  color: white;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>

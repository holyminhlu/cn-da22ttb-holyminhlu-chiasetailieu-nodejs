<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-if="isOpen"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
        @click.self="handleClose"
        @keydown.esc="handleClose"
      >
        <div
          ref="modalContainer"
          class="modal-container"
          tabindex="-1"
        >
          <!-- Close Button -->
          <button
            class="modal-close"
            type="button"
            aria-label="Đóng"
            @click="handleClose"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Modal Header -->
          <div class="modal-header">
            <h2 id="upload-modal-title" class="modal-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 8px;">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Tải lên tài liệu
            </h2>
            <div class="header-meta">
              <p>Chia sẻ tri thức của bạn cho cộng đồng. Điền đầy đủ thông tin giúp đội ngũ xét duyệt nhanh chóng hơn.</p>
              <div class="header-pills">
                <div class="header-pill">
                  <span>Định dạng hỗ trợ</span>
                  <strong>PDF / PPTX / DOCX / ZIP</strong>
                </div>
                <div class="header-pill">
                  <span>Kích thước tối đa</span>
                  <strong>50&nbsp;MB</strong>
                </div>
                <div class="header-pill">
                  <span>Thời gian duyệt</span>
                  <strong>&lt; 24 giờ</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <!-- Success Step -->
            <div v-if="showSuccess" class="success-step">
              <div class="success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 class="success-title">Tải lên thành công!</h3>
              <p class="success-message">
                Tài liệu của bạn đã được tải lên thành công.
              </p>
              <div class="form-actions">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="handleClose"
                >
                  Đóng
                </button>
              </div>
            </div>

            <!-- Main Form -->
            <form v-else @submit.prevent="handleSubmit" class="upload-form">
              <div class="form-section">
                <div class="section-heading">
                  <h3>Thông tin nổi bật</h3>
                  <p>Đặt tên và mô tả thật rõ ràng để người học nhanh chóng tìm thấy tài liệu của bạn.</p>
                </div>
                <div class="section-grid">
                  <div class="form-group span-2">
                    <label for="doc-title" class="form-label required">Tên tài liệu</label>
                    <input
                      id="doc-title"
                      v-model="formData.title"
                      type="text"
                      class="form-input"
                      :class="{ error: errors.title }"
                      maxlength="150"
                      required
                      aria-required="true"
                      aria-invalid="errors.title ? 'true' : 'false'"
                      aria-describedby="title-error title-help"
                      @blur="validateField('title')"
                    />
                    <span id="title-help" class="form-help">{{ formData.title.length }}/150 ký tự</span>
                    <span v-if="errors.title" id="title-error" class="form-error" role="alert">
                      {{ errors.title }}
                    </span>
                  </div>
                  <div class="form-group span-2">
                    <label for="doc-description" class="form-label required">Mô tả ngắn</label>
                    <textarea
                      id="doc-description"
                      v-model="formData.description"
                      class="form-textarea"
                      :class="{ error: errors.description }"
                      rows="4"
                      minlength="20"
                      maxlength="1000"
                      required
                      aria-required="true"
                      aria-invalid="errors.description ? 'true' : 'false'"
                      aria-describedby="description-error description-help"
                      @blur="validateField('description')"
                    ></textarea>
                    <span id="description-help" class="form-help">{{ formData.description.length }}/1000 ký tự (tối thiểu 20)</span>
                    <span v-if="errors.description" id="description-error" class="form-error" role="alert">
                      {{ errors.description }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <div class="section-heading">
                  <h3>Chi tiết học thuật</h3>
                  <p>Điền thông tin giúp hệ thống phân loại và đề xuất chính xác hơn.</p>
                </div>
                <div class="section-grid three">
                  <div class="form-group span-2">
                    <label for="doc-program" class="form-label required">Chương trình đào tạo</label>
                    <select
                      id="doc-program"
                      v-model="formData.program"
                      class="form-select"
                      :class="{ error: errors.program }"
                      required
                      aria-required="true"
                      aria-invalid="errors.program ? 'true' : 'false'"
                      aria-describedby="program-error"
                      @blur="validateField('program')"
                    >
                      <option value="">Chọn chương trình đào tạo</option>
                      <option
                        v-for="prog in programs"
                        :key="prog.id"
                        :value="prog.id"
                      >
                        {{ prog.label }}
                      </option>
                    </select>
                    <span v-if="errors.program" id="program-error" class="form-error" role="alert">
                      {{ errors.program }}
                    </span>
                  </div>
                  <div class="form-group">
                    <label for="doc-course-code" class="form-label">Mã học phần / Môn học</label>
                    <input
                      id="doc-course-code"
                      v-model="formData.courseCode"
                      type="text"
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label for="doc-author" class="form-label">Tác giả</label>
                    <input
                      id="doc-author"
                      v-model="formData.author"
                      type="text"
                      class="form-input"
                      :placeholder="defaultAuthor"
                    />
                  </div>
                  <div class="form-group">
                    <label for="doc-year" class="form-label">Năm học</label>
                    <select id="doc-year" v-model="formData.year" class="form-select">
                      <option value="">Chọn năm học</option>
                      <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="doc-language" class="form-label">Ngôn ngữ</label>
                    <select id="doc-language" v-model="formData.language" class="form-select">
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="doc-visibility" class="form-label">Quyền truy cập</label>
                    <select id="doc-visibility" v-model="formData.visibility" class="form-select">
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="class-only">Class-only</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <div class="section-heading">
                  <h3>Phân loại & thẻ</h3>
                  <p>Thêm tag và giấy phép để cộng đồng biết họ có thể sử dụng tài liệu thế nào.</p>
                </div>
                <div class="section-grid">
                  <div class="form-group span-2">
                    <label for="doc-tags" class="form-label">Tags</label>
                    <div class="tags-input-wrapper">
                      <input
                        id="doc-tags"
                        v-model="tagInput"
                        type="text"
                        class="form-input"
                        placeholder="Nhập tag và nhấn Enter"
                        @keydown.enter.prevent="addTag"
                      />
                      <div class="tags-list">
                        <span
                          v-for="(tag, index) in formData.tags"
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
                  <div class="form-group">
                    <label for="doc-license" class="form-label required">License</label>
                    <select
                      id="doc-license"
                      v-model="formData.license"
                      class="form-select"
                      :class="{ error: errors.license }"
                      required
                      aria-required="true"
                      aria-invalid="errors.license ? 'true' : 'false'"
                      aria-describedby="license-error"
                      @blur="validateField('license')"
                    >
                      <option value="">Chọn license</option>
                      <option value="CC-BY">CC-BY</option>
                      <option value="CC-BY-NC">CC-BY-NC</option>
                      <option value="CC-BY-SA">CC-BY-SA</option>
                      <option value="All rights reserved">All rights reserved</option>
                    </select>
                    <span v-if="errors.license" id="license-error" class="form-error" role="alert">
                      {{ errors.license }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="form-section file-section">
                <div class="section-heading">
                  <h3>Tệp & hình ảnh</h3>
                  <p>Kéo thả file để tải nhanh, thêm thumbnail để tài liệu nổi bật hơn.</p>
                </div>
                <div class="file-grid">
                  <div class="file-card">
                    <label for="doc-file" class="form-label required">File tài liệu</label>
                    <input
                      id="doc-file"
                      ref="fileInput"
                      type="file"
                      class="file-input"
                      accept=".pdf,.pptx,.docx,.zip"
                      required
                      aria-required="true"
                      aria-invalid="errors.file ? 'true' : 'false'"
                      aria-describedby="file-error file-help"
                      @change="handleFileSelect"
                    />
                    <div
                      v-if="!selectedFile"
                      class="file-dropzone"
                      :class="{ dragging: isDragging }"
                      @dragover.prevent="isDragging = true"
                      @dragleave.prevent="isDragging = false"
                      @drop.prevent="handleFileDrop"
                      @click="$refs.fileInput?.click()"
                    >
                      <div class="file-dropzone-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                      </div>
                      <p class="file-dropzone-text">
                        <strong>Kéo thả file vào đây</strong><br>
                        hoặc <span class="file-label-link">click để chọn file</span>
                      </p>
                      <div class="file-dropzone-hint">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <span>Chấp nhận: PDF, PPTX, DOCX, ZIP • Tối đa 50MB</span>
                      </div>
                    </div>
                    <div v-else class="file-selected">
                      <div class="file-info">
                        <div class="file-icon">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                        </div>
                        <div class="file-details">
                          <span class="file-name" :title="selectedFile.name">{{ selectedFile.name }}</span>
                          <div class="file-meta">
                            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
                            <span class="file-type">{{ selectedFile.name.split('.').pop().toUpperCase() }}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        class="file-remove"
                        aria-label="Xóa file"
                        @click="removeFile"
                        title="Xóa file"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    <span id="file-help" class="form-help">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      Chấp nhận định dạng: PDF, PPTX, DOCX, ZIP. Kích thước tối đa 50MB.
                    </span>
                    <span v-if="errors.file" id="file-error" class="form-error" role="alert">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {{ errors.file }}
                    </span>
                  </div>
                  <div class="thumbnail-card">
                    <label for="doc-thumbnail" class="form-label">Thumbnail (tùy chọn)</label>
                    <input
                      id="doc-thumbnail"
                      type="file"
                      class="form-input"
                      accept="image/*"
                      @change="handleThumbnailSelect"
                    />
                    <div v-if="selectedThumbnail" class="thumbnail-preview">
                      <img :src="thumbnailPreview" alt="Thumbnail preview" />
                      <button
                        type="button"
                        class="thumbnail-remove"
                        @click="removeThumbnail"
                      >
                        ×
                      </button>
                    </div>
                    <p class="form-help">Ảnh 4:3, tối đa 5MB. Giúp tài liệu nổi bật hơn trên trang danh sách.</p>
                  </div>
                </div>
              </div>

              <div class="form-section confirm-section">
                <div class="section-heading">
                  <h3>Xác nhận & bảo mật</h3>
                  <p>Vui lòng đọc kỹ điều khoản trước khi chia sẻ tài liệu.</p>
                </div>
                <div class="tos-card">
                  <label class="checkbox-label">
                    <input
                      v-model="formData.acceptTOS"
                      type="checkbox"
                      required
                      aria-required="true"
                    />
                    <span>
                      Tôi đã đọc và đồng ý với
                      <a href="/chinhsach" target="_blank">Điều khoản dịch vụ</a> &
                      <a href="#" target="_blank">Chính sách bảo mật</a>
                    </span>
                  </label>
                  <div class="security-note">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span>Tất cả file sẽ được quét virus tự động trước khi tải lên.</span>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="handleClose"
                  :disabled="isUploading"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="!canSubmit || isUploading"
                >
                  {{ isUploading ? 'Đang tải lên...' : 'Tải lên' }}
                </button>
              </div>
            </form>

            <!-- Upload Progress -->
            <div v-if="isUploading" class="upload-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${uploadProgress}%` }"
                ></div>
              </div>
              <div class="progress-info">
                <span>{{ uploadProgress }}% hoàn thành</span>
                <button
                  v-if="canCancel"
                  type="button"
                  class="progress-cancel"
                  @click="cancelUpload"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

export default {
  name: 'UploadModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    programs: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'upload-success'],
  setup(props, { emit }) {
    const modalContainer = ref(null)
    const fileInput = ref(null)
    const tagInput = ref('')
    const selectedFile = ref(null)
    const selectedThumbnail = ref(null)
    const thumbnailPreview = ref('')
    const isDragging = ref(false)
    const isUploading = ref(false)
    const uploadProgress = ref(0)
    const canCancel = ref(true)
    const showSuccess = ref(false)

    // Generate years (2015-2026)
    const years = Array.from({ length: 12 }, (_, i) => 2015 + i)

    // Get default author from localStorage
    const defaultAuthor = ref(localStorage.getItem('userFullName') || 'Người dùng')

    const canSubmit = computed(() => {
      return formData.value.title.trim() &&
             formData.value.program &&
             formData.value.description.trim().length >= 20 &&
             formData.value.license &&
             selectedFile.value &&
             formData.value.acceptTOS &&
             !errors.value.title &&
             !errors.value.program &&
             !errors.value.description &&
             !errors.value.license &&
             !errors.value.file
    })

    const formData = ref({
      title: '',
      program: '',
      description: '',
      author: defaultAuthor.value,
      courseCode: '',
      year: '',
      tags: [],
      language: 'vi',
      visibility: 'public',
      license: '',
      file: null,
      thumbnail: null,
      acceptTOS: false
    })

    const errors = ref({})

    // Validation rules
    const validateField = (field) => {
      errors.value[field] = ''
      
      switch (field) {
        case 'title':
          if (!formData.value.title.trim()) {
            errors.value.title = 'Tên tài liệu là bắt buộc'
          } else if (formData.value.title.length > 150) {
            errors.value.title = 'Tên tài liệu không được vượt quá 150 ký tự'
          }
          break
        case 'program':
          if (!formData.value.program) {
            errors.value.program = 'Chương trình đào tạo là bắt buộc'
          }
          break
        case 'description':
          if (!formData.value.description.trim()) {
            errors.value.description = 'Mô tả là bắt buộc'
          } else if (formData.value.description.length < 20) {
            errors.value.description = 'Mô tả phải có ít nhất 20 ký tự'
          } else if (formData.value.description.length > 1000) {
            errors.value.description = 'Mô tả không được vượt quá 1000 ký tự'
          }
          break
        case 'license':
          if (!formData.value.license) {
            errors.value.license = 'License là bắt buộc'
          }
          break
        case 'file':
          if (!selectedFile.value) {
            errors.value.file = 'File tài liệu là bắt buộc'
          } else {
            const allowedTypes = ['.pdf', '.pptx', '.docx', '.zip']
            const fileExtension = '.' + selectedFile.value.name.split('.').pop().toLowerCase()
            const maxSize = 50 * 1024 * 1024 // 50MB
            
            if (!allowedTypes.includes(fileExtension)) {
              errors.value.file = 'Chỉ cho phép file PDF, PPTX, DOCX, ZIP'
            } else if (selectedFile.value.size > maxSize) {
              errors.value.file = 'Kích thước file không được vượt quá 50MB'
            }
          }
          break
      }
    }

    const handleSubmit = async () => {
      // Validate all fields
      validateField('title')
      validateField('program')
      validateField('description')
      validateField('license')
      validateField('file')
      
      if (!canSubmit.value) {
        return
      }
      
      // Start upload
      await handleUpload()
    }

    const addTag = () => {
      const tag = tagInput.value.trim()
      if (tag && !formData.value.tags.includes(tag)) {
        formData.value.tags.push(tag)
        tagInput.value = ''
      }
    }

    const removeTag = (index) => {
      formData.value.tags.splice(index, 1)
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedFile.value = file
        formData.value.file = file
        validateField('file')
      }
    }

    const handleFileDrop = (event) => {
      isDragging.value = false
      const file = event.dataTransfer.files[0]
      if (file) {
        selectedFile.value = file
        formData.value.file = file
        validateField('file')
      }
    }

    const removeFile = () => {
      selectedFile.value = null
      formData.value.file = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      errors.value.file = ''
    }

    const handleThumbnailSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedThumbnail.value = file
        formData.value.thumbnail = file
        const reader = new FileReader()
        reader.onload = (e) => {
          thumbnailPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const removeThumbnail = () => {
      selectedThumbnail.value = null
      formData.value.thumbnail = null
      thumbnailPreview.value = ''
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }


    const handleUpload = async () => {
      isUploading.value = true
      uploadProgress.value = 0
      canCancel.value = true

      try {
        console.log('🚀 Starting upload...')
        
        // Get user info from localStorage
        const userId = localStorage.getItem('userId') || localStorage.getItem('user_id')
        const userFullName = localStorage.getItem('userFullName') || defaultAuthor.value
        const userAvatar = localStorage.getItem('userAvatar') || ''

        console.log('👤 User ID:', userId)

        if (!userId) {
          throw new Error('Bạn cần đăng nhập để tải lên tài liệu')
        }

        if (!selectedFile.value) {
          throw new Error('Vui lòng chọn file để tải lên')
        }

        // Simulate initial progress
        uploadProgress.value = 10
        await new Promise(resolve => setTimeout(resolve, 200))

        // Prepare FormData với file thực tế
        const formDataToSend = new FormData()
        
        // Thêm file tài liệu
        formDataToSend.append('file', selectedFile.value)
        
        // Thêm thumbnail nếu có
        if (selectedThumbnail.value) {
          formDataToSend.append('thumbnail', selectedThumbnail.value)
        }

        // Thêm metadata
        formDataToSend.append('title', formData.value.title.trim())
        formDataToSend.append('description', formData.value.description.trim())
        formDataToSend.append('uploaderId', userId)
        formDataToSend.append('author', JSON.stringify({
          id: userId,
          name: formData.value.author || userFullName,
          avatar: userAvatar
        }))
        if (formData.value.program) formDataToSend.append('program', formData.value.program)
        if (formData.value.courseCode) formDataToSend.append('courseCode', formData.value.courseCode)
        if (formData.value.tags && formData.value.tags.length > 0) {
          formDataToSend.append('tags', JSON.stringify(formData.value.tags))
        }
        formDataToSend.append('languages', JSON.stringify([formData.value.language || 'vi']))
        if (formData.value.year) formDataToSend.append('year', formData.value.year)
        formDataToSend.append('license', formData.value.license)
        formDataToSend.append('visibility', formData.value.visibility || 'public')
        formDataToSend.append('status', 'published')

        console.log('📤 Sending FormData to API...')
        uploadProgress.value = 20

        // Create upload request với progress tracking
        const controller = new AbortController()
        window.currentUploadController = controller
        
        // Use XMLHttpRequest để track upload progress thực tế
        const xhr = new XMLHttpRequest()
        window.currentUploadXHR = xhr
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100)
            uploadProgress.value = 10 + Math.round(percentComplete * 0.85) // 10-95%
            console.log(`Upload progress: ${uploadProgress.value}%`)
          }
        })

        // Create promise wrapper for xhr
        const uploadPromise = new Promise((resolve, reject) => {
          xhr.addEventListener('load', () => {
            window.currentUploadXHR = null
            if (xhr.status >= 200 && xhr.status < 300) {
              uploadProgress.value = 100
              try {
                const result = JSON.parse(xhr.responseText)
                resolve(result)
              } catch (e) {
                reject(new Error('Invalid response from server'))
              }
            } else {
              let errorData
              try {
                errorData = JSON.parse(xhr.responseText)
              } catch {
                errorData = { message: xhr.statusText || 'Lỗi không xác định' }
              }
              reject(new Error(errorData.message || `HTTP ${xhr.status}: ${xhr.statusText}`))
            }
          })

          xhr.addEventListener('error', (e) => {
            window.currentUploadXHR = null
            console.error('❌ XHR Error:', e)
            console.error('Response status:', xhr.status)
            console.error('Response text:', xhr.responseText)
            
            // Check if error is due to wrong endpoint
            if (xhr.responseText && xhr.responseText.includes('correctEndpoint')) {
              reject(new Error('Request đang đi đến sai endpoint. Vui lòng refresh trang và thử lại.'))
            } else {
              reject(new Error('Lỗi kết nối khi upload. Vui lòng kiểm tra network và thử lại.'))
            }
          })

          xhr.addEventListener('abort', () => {
            window.currentUploadXHR = null
            reject(new Error('Upload đã bị hủy'))
          })

          // QUAN TRỌNG: Luôn sử dụng API Gateway, không gửi trực tiếp đến document-service
          const apiUrl = 'http://localhost:3000/api/documents/upload'
          
          console.log('📤 Uploading to API Gateway:', apiUrl)
          console.log('📋 FormData keys:', Array.from(formDataToSend.keys()))
          
          xhr.open('POST', apiUrl)
          
          // Set authorization header
          const token = localStorage.getItem('token')
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`)
          }
          
          // KHÔNG set Content-Type header - browser sẽ tự động set với boundary cho multipart/form-data
          // Setting it manually sẽ break multipart encoding
          
          console.log('🚀 Sending request...')
          xhr.send(formDataToSend)
        })

        const result = await uploadPromise
        console.log('✅ Upload success:', result)

        uploadProgress.value = 100
        
        // Show success step
        await new Promise(resolve => setTimeout(resolve, 500))
        showSuccess.value = true
        emit('upload-success', { 
          ...formData.value, 
          id: result.data?._id || result.data?.id 
        })
        
      } catch (error) {
        console.error('❌ Upload failed:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
        errors.value.file = error.message || 'Tải lên thất bại. Vui lòng thử lại.'
        isUploading.value = false
        uploadProgress.value = 0
      } finally {
        canCancel.value = false
        window.currentUploadController = null
        window.currentUploadXHR = null
      }
    }

    const cancelUpload = () => {
      // Cancel the upload request if it exists
      if (window.currentUploadController) {
        window.currentUploadController.abort()
        window.currentUploadController = null
      }
      // Also cancel XHR if exists
      const xhr = window.currentUploadXHR
      if (xhr) {
        xhr.abort()
        window.currentUploadXHR = null
      }
      isUploading.value = false
      uploadProgress.value = 0
      canCancel.value = false
      console.log('🚫 Upload cancelled')
    }

    const handleClose = () => {
      if (isUploading.value) {
        if (confirm('Bạn có chắc muốn hủy? Tiến trình tải lên sẽ bị dừng.')) {
          cancelUpload()
          emit('close')
          resetForm()
        }
      } else {
        emit('close')
        resetForm()
      }
    }

    const resetForm = () => {
      showSuccess.value = false
      formData.value = {
        title: '',
        program: '',
        description: '',
        author: defaultAuthor.value,
        courseCode: '',
        year: '',
        tags: [],
        language: 'vi',
        visibility: 'public',
        license: '',
        file: null,
        thumbnail: null,
        acceptTOS: false
      }
      errors.value = {}
      tagInput.value = ''
      selectedFile.value = null
      selectedThumbnail.value = null
      thumbnailPreview.value = ''
      isUploading.value = false
      uploadProgress.value = 0
      if (fileInput.value) {
        fileInput.value.value = ''
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
        resetForm()
      }
    })

    // Focus trap
    onMounted(() => {
      const handleKeyDown = (e) => {
        if (!props.isOpen) return
        if (e.key === 'Escape') {
          handleClose()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      
      onUnmounted(() => {
        document.removeEventListener('keydown', handleKeyDown)
      })
    })

    return {
      modalContainer,
      fileInput,
      tagInput,
      selectedFile,
      selectedThumbnail,
      thumbnailPreview,
      isDragging,
      isUploading,
      uploadProgress,
      canCancel,
      showSuccess,
      years,
      defaultAuthor,
      formData,
      errors,
      validateField,
      canSubmit,
      addTag,
      removeTag,
      handleFileSelect,
      handleFileDrop,
      removeFile,
      handleThumbnailSelect,
      removeThumbnail,
      formatFileSize,
      handleSubmit,
      cancelUpload,
      handleClose
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
  z-index: var(--z-modal-backdrop);
  padding: 3rem 1.25rem 2rem;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  background: white;
  border-radius: var(--radius-lg);
  max-width: 920px;
  width: 100%;
  max-height: none;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
  outline: none;
  margin-top: 40px;
}

.modal-close {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
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
  transition: var(--transition-base);
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.modal-close:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.modal-header {
  padding: var(--spacing-6) var(--spacing-6) var(--spacing-4);
  border-bottom: 1px solid var(--color-neutral-200);
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  position: sticky;
  top: 0;
  z-index: 5;
}

.modal-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-dark);
  margin-bottom: var(--spacing-4);
}

.header-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.header-meta p {
  margin: 0;
  color: var(--color-neutral-600);
  font-size: var(--font-size-base);
}

.header-pills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-3);
}

.header-pill {
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-neutral-200);
  background: white;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.header-pill span {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-neutral-500);
}

.header-pill strong {
  font-size: var(--font-size-base);
  color: var(--color-dark);
}

.step-indicator {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.step-indicator-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.step-text {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-700);
  font-weight: var(--font-weight-semibold);
}

.step-name {
  font-size: var(--font-size-xs);
  color: var(--color-neutral-500);
  font-weight: var(--font-weight-normal);
}

.step-progress {
  height: 6px;
  background: var(--color-neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.step-progress-bar {
  height: 100%;
  background: var(--color-primary);
  transition: width var(--transition-base);
}

.modal-body {
  flex: 1;
  padding: var(--spacing-6);
  background: #f8fafc;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.form-section {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-neutral-200);
}

.section-heading {
  margin-bottom: var(--spacing-4);
}

.section-heading h3 {
  margin: 0 0 var(--spacing-2);
  font-size: var(--font-size-lg);
  color: var(--color-dark);
}

.section-heading p {
  margin: 0;
  color: var(--color-neutral-600);
  font-size: var(--font-size-sm);
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-4);
}

.section-grid.three {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.form-group.span-2 {
  grid-column: span 2;
}

.step-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-dark);
  margin-bottom: var(--spacing-2);
}

.form-label.required::after {
  content: ' *';
  color: var(--color-error);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--spacing-3);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-family: var(--font-family-base);
  transition: var(--transition-base);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: var(--color-error);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-help {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-neutral-500);
  margin-top: var(--spacing-1);
}

.form-error {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: var(--spacing-1);
}

.file-section .file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-4);
}

.file-card,
.thumbnail-card {
  background: #fdfefe;
  border: 1px dashed var(--color-neutral-300);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.file-upload-area {
  margin-top: var(--spacing-2);
}

.file-input {
  display: none;
}

.file-dropzone {
  border: 2px dashed var(--color-neutral-300);
  border-radius: var(--radius-lg);
  padding: var(--spacing-10) var(--spacing-6);
  text-align: center;
  background: linear-gradient(135deg, var(--color-neutral-50) 0%, var(--color-neutral-100) 100%);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.file-dropzone::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.file-dropzone:hover::before {
  left: 100%;
}

.file-dropzone:hover,
.file-dropzone.dragging {
  border-color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-lightest) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-dropzone-icon {
  margin-bottom: var(--spacing-4);
  color: var(--color-neutral-400);
  transition: var(--transition-base);
}

.file-dropzone:hover .file-dropzone-icon,
.file-dropzone.dragging .file-dropzone-icon {
  color: var(--color-primary);
  transform: scale(1.1);
}

.file-dropzone-text {
  font-size: var(--font-size-base);
  color: var(--color-dark);
  margin-bottom: var(--spacing-3);
  line-height: 1.6;
}

.file-dropzone-text strong {
  font-weight: var(--font-weight-semibold);
  color: var(--color-dark);
}

.file-dropzone-hint {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-neutral-600);
  background: rgba(255, 255, 255, 0.8);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-full);
  margin-top: var(--spacing-2);
}

.file-label-link {
  color: var(--color-primary);
  text-decoration: underline;
  cursor: pointer;
}

.file-hint {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-500);
  margin-top: var(--spacing-2);
}

.file-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4);
  background: linear-gradient(135deg, var(--color-success-light) 0%, var(--color-primary-light) 100%);
  border-radius: var(--radius-md);
  border: 2px solid var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.file-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  flex: 1;
  min-width: 0;
}

.file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: var(--radius-md);
  color: var(--color-primary);
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  min-width: 0;
  flex: 1;
}

.file-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-size-base);
}

.file-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  font-size: var(--font-size-sm);
}

.file-size {
  color: var(--color-neutral-700);
  font-weight: var(--font-weight-medium);
}

.file-type {
  background: white;
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
}

.file-remove {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-error);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.file-remove:hover {
  background: var(--color-error);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.thumbnail-preview {
  position: relative;
  display: inline-block;
  margin-top: var(--spacing-3);
}

.thumbnail-preview img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-neutral-200);
}

.thumbnail-remove {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: var(--color-error);
  color: white;
  cursor: pointer;
  font-size: var(--font-size-lg);
  line-height: 1;
}

.tags-input-wrapper {
  margin-top: var(--spacing-2);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
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

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-dark);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 2px;
  cursor: pointer;
}

.checkbox-label a {
  color: var(--color-primary);
  text-decoration: underline;
}

.tos-card {
  background: var(--color-neutral-50);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  border: 1px solid var(--color-neutral-200);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.security-note {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: white;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-neutral-700);
  border: 1px solid var(--color-neutral-200);
}

.security-note svg {
  color: var(--color-primary);
  flex-shrink: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  margin-top: var(--spacing-2);
  padding: var(--spacing-4) var(--spacing-5);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-neutral-200);
  background: white;
  box-shadow: var(--shadow-md);
}

.btn {
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-base);
  border: none;
  font-size: var(--font-size-base);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--color-neutral-100);
  color: var(--color-dark);
  border: 2px solid var(--color-neutral-300);
}

.btn-secondary:hover {
  background: var(--color-neutral-200);
}

.btn:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

@media (max-width: 767px) {
  .section-grid,
  .section-grid.three {
    grid-template-columns: 1fr;
  }

  .form-group.span-2 {
    grid-column: span 1;
  }

  .form-section {
    padding: var(--spacing-4);
  }

  .header-pills {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}

.success-step {
  text-align: center;
  padding: var(--spacing-8) var(--spacing-4);
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-4);
  background: var(--color-success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.success-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-dark);
  margin-bottom: var(--spacing-3);
}

.success-message {
  font-size: var(--font-size-base);
  color: var(--color-neutral-600);
  margin-bottom: var(--spacing-6);
}

.upload-progress {
  margin-top: var(--spacing-6);
  padding: var(--spacing-5);
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-neutral-50) 100%);
  border-radius: var(--radius-md);
  border: 2px solid var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 12px;
  background: var(--color-neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--spacing-3);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  transition: width 0.3s ease;
  border-radius: var(--radius-full);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--color-dark);
  font-weight: var(--font-weight-medium);
}

.progress-cancel {
  background: transparent;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  font-size: var(--font-size-sm);
  text-decoration: underline;
  padding: 0;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--transition-base);
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform var(--transition-base), opacity var(--transition-base);
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
@media (max-width: 599px) {
  .modal-container {
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-header {
    padding: var(--spacing-4);
  }

  .modal-body {
    padding: var(--spacing-4);
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .step-content,
  .step-progress-bar,
  .progress-fill {
    transition: none;
    animation: none;
  }
}
</style>


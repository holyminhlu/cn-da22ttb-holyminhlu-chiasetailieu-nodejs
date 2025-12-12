<template>
  <Teleport to="body">
    <transition name="modal">
      <div
        v-if="show"
        class="modal-overlay"
        @click.self="$emit('close')"
        @keydown.esc="$emit('close')"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cover-upload-title"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="cover-upload-title">Thay ảnh bìa</h2>
            <button class="modal-close" @click="$emit('close')" aria-label="Đóng">
              ×
            </button>
          </div>

          <div class="upload-content">
            <div
              class="upload-area"
              :class="{ 'drag-over': isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                @change="handleFileSelect"
                class="file-input"
                aria-label="Chọn ảnh bìa"
              />
              <div v-if="!preview" class="upload-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p>Kéo thả ảnh vào đây hoặc <button type="button" class="link-button" @click="$refs.fileInput.click()">chọn từ máy tính</button></p>
                <p class="upload-hint">JPG, PNG hoặc WEBP (tối đa 10MB)</p>
                <p class="upload-hint">Khuyến nghị: 1200x300px hoặc tỷ lệ 4:1</p>
              </div>
              <div v-else class="preview-container">
                <img :src="preview" alt="Preview" class="preview-image" />
                <button class="remove-preview" @click="removePreview" aria-label="Xóa ảnh">
                  ×
                </button>
              </div>
            </div>

            <div v-if="error" class="error-message" role="alert">
              {{ error }}
            </div>

            <div class="upload-actions">
              <button type="button" class="btn-secondary" @click="$emit('close')">Hủy</button>
              <button
                type="button"
                class="btn-primary"
                :disabled="!preview || uploading"
                @click="handleUpload"
              >
                <span v-if="uploading">Đang tải lên...</span>
                <span v-else>Lưu ảnh bìa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'CoverUploader',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const preview = ref(null)
    const selectedFile = ref(null)
    const isDragging = ref(false)
    const uploading = ref(false)
    const error = ref('')

    const validateFile = (file) => {
      error.value = ''
      
      // Check type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        error.value = 'Chỉ chấp nhận file ảnh JPG, PNG hoặc WEBP'
        return false
      }

      // Check size (10MB for cover images)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        error.value = 'Kích thước file không được vượt quá 10MB'
        return false
      }

      return true
    }

    const createPreview = (file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        preview.value = e.target.result
      }
      reader.readAsDataURL(file)
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file && validateFile(file)) {
        selectedFile.value = file
        createPreview(file)
      }
    }

    const handleDrop = (event) => {
      isDragging.value = false
      const file = event.dataTransfer.files[0]
      if (file && validateFile(file)) {
        selectedFile.value = file
        createPreview(file)
      }
    }

    const removePreview = () => {
      preview.value = null
      selectedFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const handleUpload = async () => {
      if (!selectedFile.value) return

      uploading.value = true
      error.value = ''
      
      try {
        const userId = localStorage.getItem('userId')
        const userEmail = localStorage.getItem('userEmail')
        
        if (!userId || !userEmail) {
          throw new Error('Bạn cần đăng nhập để upload ảnh bìa')
        }

        // Create FormData for file upload
        const formData = new FormData()
        formData.append('cover', selectedFile.value)
        formData.append('email', userEmail)

        // Upload cover image to API
        const response = await fetch('http://localhost:3000/api/auth/profile/cover', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Lỗi khi upload ảnh bìa' }))
          throw new Error(errorData.message || 'Lỗi khi upload ảnh bìa')
        }

        const result = await response.json()
        
        if (result.success && result.data && result.data.cover_url) {
          emit('save', result.data.cover_url)
        } else {
          throw new Error(result.message || 'Không lấy được URL ảnh bìa')
        }
      } catch (err) {
        error.value = err.message || 'Lỗi khi tải lên ảnh. Vui lòng thử lại.'
        console.error('Upload error:', err)
      } finally {
        uploading.value = false
      }
    }

    return {
      fileInput,
      preview,
      isDragging,
      uploading,
      error,
      handleFileSelect,
      handleDrop,
      removePreview,
      handleUpload
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #E2E8F0;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #64748B;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.2s;
}

.modal-close:hover {
  background: #F1F5F9;
}

.upload-content {
  padding: 2rem;
}

.upload-area {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 1;
  border: 2px dashed #E2E8F0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: border-color 0.2s;
  background: #F8FAFF;
}

.upload-area.drag-over {
  border-color: #0B6EFD;
  background: #F0F7FF;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.upload-placeholder {
  text-align: center;
  padding: 2rem;
  color: #64748B;
}

.upload-placeholder svg {
  margin: 0 auto 1rem;
  color: #94A3B8;
}

.upload-placeholder p {
  margin: 0.5rem 0;
}

.link-button {
  background: none;
  border: none;
  color: #0B6EFD;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
}

.upload-hint {
  font-size: 0.875rem;
  color: #94A3B8;
}

.preview-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-preview {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.remove-preview:hover {
  background: rgba(0, 0, 0, 0.8);
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #FEE2E2;
  color: #991B1B;
  border-radius: 8px;
  font-size: 0.875rem;
}

.upload-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: #0B6EFD;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0956D9;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #F1F5F9;
  color: #0F172A;
}

.btn-secondary:hover {
  background: #E2E8F0;
}
</style>


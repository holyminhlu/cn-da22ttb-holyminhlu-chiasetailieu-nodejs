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
        aria-labelledby="edit-profile-title"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="edit-profile-title">Chỉnh sửa hồ sơ</h2>
            <button class="modal-close" @click="$emit('close')" aria-label="Đóng">
              ×
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="edit-form">
            <div class="form-group">
              <label for="displayName">Tên hiển thị <span class="required">*</span></label>
              <input
                id="displayName"
                v-model="formData.displayName"
                type="text"
                required
                maxlength="50"
                :aria-invalid="errors.displayName ? 'true' : 'false'"
                :aria-describedby="errors.displayName ? 'displayName-error' : undefined"
              />
              <div v-if="errors.displayName" id="displayName-error" class="error-message" role="alert">
                {{ errors.displayName }}
              </div>
            </div>

            <div class="form-group">
              <label for="bio">Giới thiệu</label>
              <textarea
                id="bio"
                v-model="formData.bio"
                rows="4"
                maxlength="300"
                placeholder="Viết vài dòng về bản thân..."
              ></textarea>
              <div class="char-count">{{ formData.bio.length }}/300</div>
            </div>

            <div class="form-group">
              <label for="program">Chương trình đào tạo</label>
              <select id="program" v-model="formData.program">
                <option value="">Chọn chương trình</option>
                <option value="CNTT">CNTT</option>
                <option value="Kinh tế">Kinh tế</option>
                <option value="Ngoại ngữ">Ngoại ngữ</option>
                <option value="Khoa học">Khoa học</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div class="form-group">
              <label for="location">Địa điểm</label>
              <input
                id="location"
                v-model="formData.location"
                type="text"
                placeholder="Ví dụ: Hà Nội"
              />
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="$emit('close')">Hủy</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                <span v-if="saving">Đang lưu...</span>
                <span v-else>Lưu thay đổi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'EditProfileModal',
  props: {
    initialData: {
      type: Object,
      default: () => ({})
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const formData = ref({
      displayName: '',
      bio: '',
      program: '',
      location: ''
    })
    const errors = ref({})
    const saving = ref(false)

    watch(() => props.initialData, (newData) => {
      if (newData) {
        formData.value = {
          displayName: newData.displayName || newData.fullName || '',
          bio: newData.bio || '',
          program: newData.program || '',
          location: newData.location || ''
        }
      }
    }, { immediate: true })

    const validate = () => {
      errors.value = {}
      if (!formData.value.displayName || formData.value.displayName.trim() === '') {
        errors.value.displayName = 'Tên hiển thị là bắt buộc'
        return false
      }
      if (formData.value.displayName.length > 50) {
        errors.value.displayName = 'Tên hiển thị không được vượt quá 50 ký tự'
        return false
      }
      return true
    }

    const handleSubmit = async () => {
      if (!validate()) return

      saving.value = true
      try {
        emit('save', { ...formData.value })
        // Modal sẽ được đóng từ parent component
      } catch (error) {
        console.error('Error saving profile:', error)
      } finally {
        saving.value = false
      }
    }

    return {
      formData,
      errors,
      saving,
      handleSubmit
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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
  padding: 1.5rem;
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

.edit-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #0F172A;
}

.required {
  color: #EF4444;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #0B6EFD;
  box-shadow: 0 0 0 3px rgba(11, 110, 253, 0.1);
}

.form-group input[aria-invalid="true"],
.form-group textarea[aria-invalid="true"] {
  border-color: #EF4444;
}

.char-count {
  text-align: right;
  font-size: 0.875rem;
  color: #64748B;
  margin-top: 0.25rem;
}

.error-message {
  font-size: 0.875rem;
  color: #EF4444;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E2E8F0;
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













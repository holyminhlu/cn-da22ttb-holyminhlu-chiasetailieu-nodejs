<template>
  <form @submit.prevent="handleSubmit" class="settings-form">
    <div class="form-section">
      <h3 class="section-title">Thông tin cá nhân</h3>
      
      <div class="form-group">
        <label for="displayName">Tên hiển thị <span class="required">*</span></label>
        <input
          id="displayName"
          v-model="formData.displayName"
          type="text"
          required
          maxlength="50"
        />
        <div class="form-hint">Tên sẽ hiển thị công khai trên hồ sơ của bạn</div>
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
    </div>

    <div class="form-section">
      <h3 class="section-title">Tùy chọn</h3>

      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="formData.emailNotifications" />
          <span>Nhận thông báo qua email</span>
        </label>
      </div>

      <div class="form-group">
        <label for="language">Ngôn ngữ</label>
        <select id="language" v-model="formData.language">
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="$emit('cancel')">Hủy</button>
      <button type="submit" class="btn-primary" :disabled="saving">
        <span v-if="saving">Đang lưu...</span>
        <span v-else>Lưu thay đổi</span>
      </button>
    </div>
  </form>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'SettingsForm',
  props: {
    initialData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const formData = ref({
      displayName: '',
      bio: '',
      program: '',
      emailNotifications: true,
      language: 'vi'
    })
    const saving = ref(false)

    watch(() => props.initialData, (newData) => {
      if (newData) {
        formData.value = {
          displayName: newData.displayName || newData.fullName || '',
          bio: newData.bio || '',
          program: newData.program || '',
          emailNotifications: newData.emailNotifications !== false,
          language: newData.language || 'vi'
        }
      }
    }, { immediate: true })

    const handleSubmit = async () => {
      saving.value = true
      try {
        emit('save', { ...formData.value })
      } catch (error) {
        console.error('Error saving settings:', error)
      } finally {
        saving.value = false
      }
    }

    return {
      formData,
      saving,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  padding-bottom: 2rem;
  border-bottom: 1px solid #E2E8F0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 1.5rem 0;
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

.form-hint {
  font-size: 0.875rem;
  color: #64748B;
  margin-top: 0.25rem;
}

.char-count {
  text-align: right;
  font-size: 0.875rem;
  color: #64748B;
  margin-top: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #0B6EFD;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
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













<template>
  <div class="security-form">
    <!-- Change Password -->
    <div class="form-section">
      <h3 class="section-title">Thay đổi mật khẩu</h3>
      
      <form @submit.prevent="handleChangePassword" class="password-form">
        <div class="form-group">
          <label for="currentPassword">Mật khẩu hiện tại <span class="required">*</span></label>
          <input
            id="currentPassword"
            v-model="passwordForm.currentPassword"
            type="password"
            required
          />
        </div>

        <div class="form-group">
          <label for="newPassword">Mật khẩu mới <span class="required">*</span></label>
          <input
            id="newPassword"
            v-model="passwordForm.newPassword"
            type="password"
            required
            minlength="8"
          />
          <div class="form-hint">Tối thiểu 8 ký tự, bao gồm chữ hoa và số</div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu mới <span class="required">*</span></label>
          <input
            id="confirmPassword"
            v-model="passwordForm.confirmPassword"
            type="password"
            required
          />
          <div v-if="passwordError" class="error-message" role="alert">
            {{ passwordError }}
          </div>
        </div>

        <button type="submit" class="btn-primary" :disabled="changingPassword">
          <span v-if="changingPassword">Đang thay đổi...</span>
          <span v-else>Thay đổi mật khẩu</span>
        </button>
      </form>
    </div>

    <!-- Two-Factor Authentication -->
    <div class="form-section">
      <h3 class="section-title">Xác thực hai yếu tố (2FA)</h3>
      <p class="section-description">Bảo vệ tài khoản của bạn bằng xác thực hai yếu tố</p>
      <button class="btn-secondary" @click="$emit('enable-2fa')">
        Bật 2FA
      </button>
    </div>

    <!-- Connected Accounts -->
    <div class="form-section">
      <h3 class="section-title">Tài khoản đã kết nối</h3>
      <div v-if="connectedAccounts.length > 0" class="connected-accounts">
        <div
          v-for="account in connectedAccounts"
          :key="account.provider"
          class="account-item"
        >
          <div class="account-info">
            <span class="account-provider">{{ account.providerName }}</span>
            <span class="account-date">Kết nối {{ formatDate(account.connectedAt) }}</span>
          </div>
          <button
            class="btn-danger-small"
            @click="$emit('disconnect-account', account.provider)"
          >
            Ngắt kết nối
          </button>
        </div>
      </div>
      <p v-else class="empty-text">Chưa có tài khoản nào được kết nối</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SecurityForm',
  props: {
    connectedAccounts: {
      type: Array,
      default: () => []
    }
  },
  emits: ['change-password', 'enable-2fa', 'disconnect-account'],
  setup(props, { emit }) {
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    const passwordError = ref('')
    const changingPassword = ref(false)

    const validatePassword = () => {
      passwordError.value = ''

      if (passwordForm.value.newPassword.length < 8) {
        passwordError.value = 'Mật khẩu phải có ít nhất 8 ký tự'
        return false
      }

      if (!/[A-Z]/.test(passwordForm.value.newPassword)) {
        passwordError.value = 'Mật khẩu phải có ít nhất 1 chữ hoa'
        return false
      }

      if (!/[0-9]/.test(passwordForm.value.newPassword)) {
        passwordError.value = 'Mật khẩu phải có ít nhất 1 số'
        return false
      }

      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordError.value = 'Mật khẩu xác nhận không khớp'
        return false
      }

      return true
    }

    const handleChangePassword = async () => {
      if (!validatePassword()) return

      changingPassword.value = true
      try {
        emit('change-password', {
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword
        })
        // Reset form
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        console.error('Error changing password:', error)
      } finally {
        changingPassword.value = false
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN')
    }

    return {
      passwordForm,
      passwordError,
      changingPassword,
      handleChangePassword,
      formatDate
    }
  }
}
</script>

<style scoped>
.security-form {
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
  margin: 0 0 0.5rem 0;
}

.section-description {
  color: #64748B;
  margin: 0 0 1rem 0;
  font-size: 0.9375rem;
}

.password-form {
  margin-top: 1.5rem;
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

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #0B6EFD;
  box-shadow: 0 0 0 3px rgba(11, 110, 253, 0.1);
}

.form-hint {
  font-size: 0.875rem;
  color: #64748B;
  margin-top: 0.25rem;
}

.error-message {
  font-size: 0.875rem;
  color: #EF4444;
  margin-top: 0.25rem;
}

.connected-accounts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #F8FAFF;
  border-radius: 8px;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.account-provider {
  font-weight: 600;
  color: #0F172A;
}

.account-date {
  font-size: 0.875rem;
  color: #64748B;
}

.empty-text {
  color: #64748B;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary,
.btn-danger-small {
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

.btn-danger-small {
  padding: 0.5rem 1rem;
  background: transparent;
  color: #EF4444;
  border: 1.5px solid #EF4444;
  font-size: 0.875rem;
}

.btn-danger-small:hover {
  background: #EF4444;
  color: white;
}
</style>













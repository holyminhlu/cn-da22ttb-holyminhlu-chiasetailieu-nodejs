<template>
  <div class="admin-shell admin-auth">
    <div class="login-box">
      <h2>Đăng nhập quản trị viên</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            v-model="email" 
            required 
            placeholder="Nhập email"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label>Mật khẩu</label>
          <input 
            type="password" 
            v-model="password" 
            required 
            placeholder="Nhập mật khẩu"
            class="form-control"
          />
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { loginUser } from '@/utils/authAPI.js'

export default {
  name: 'AdminLoginView',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      errorMessage: ''
    }
  },
  mounted() {
    // Nếu đã đăng nhập và là admin, chuyển đến dashboard
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    if (token && role === 'admin') {
      this.$router.push('/administrator/manager-dashboard')
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.errorMessage = ''

      try {
        const result = await loginUser(this.email, this.password)
        
        if (result.success) {
          // Kiểm tra role
          const userRole = result.data?.user?.role || localStorage.getItem('userRole')
          
          if (userRole !== 'admin') {
            this.errorMessage = 'Bạn không có quyền truy cập trang quản trị'
            localStorage.removeItem('token')
            localStorage.removeItem('userRole')
            this.loading = false
            return
          }

          // Đăng nhập thành công, chuyển đến dashboard
          this.$router.push('/administrator/manager-dashboard')
        } else {
          this.errorMessage = result.message || 'Đăng nhập thất bại'
        }
      } catch (error) {
        console.error('Login error:', error)
        this.errorMessage = 'Có lỗi xảy ra khi đăng nhập'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.admin-auth {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-light-bg);
  padding: var(--spacing-6);
}

.login-box {
  background: #fff;
  padding: var(--spacing-10);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-neutral-200);
  width: 100%;
  max-width: 400px;
}

.login-box h2 {
  margin: 0 0 30px 0;
  text-align: center;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-900);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-neutral-800);
  font-size: var(--font-size-sm);
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  box-sizing: border-box;
}

.form-control:focus {
  outline: 2px solid rgba(29, 78, 216, 0.25);
  outline-offset: 2px;
  border-color: rgba(29, 78, 216, 0.35);
}

.error-message {
  color: rgba(153, 27, 27, 0.95);
  font-size: var(--font-size-sm);
  margin-bottom: 15px;
  text-align: center;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background: var(--color-primary);
  color: #fff;
  border: 1px solid rgba(29, 78, 216, 0.35);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  cursor: pointer;
}

.btn-login:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-login:disabled {
  background: var(--color-neutral-400);
  cursor: not-allowed;
}
</style>



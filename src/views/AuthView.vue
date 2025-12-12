<template>
  <div class="auth-page">
    <!-- Header with Logo -->
    <header class="auth-header">
      <div class="container">
        <router-link to="/" class="auth-logo">
          <span class="logo-edu">Edu</span><span class="logo-share">Share</span>
        </router-link>
      </div>
    </header>

    <!-- Main Content -->
    <main class="auth-main">
      <div class="auth-container">
        <!-- Left Side: Illustration (Desktop only) -->
        <div class="auth-illustration">
          <div class="illustration-content">
            <h2 class="welcome-title">Chào mừng bạn đến với EduShare</h2>
            <p class="welcome-subtitle">Kho chia sẻ tài liệu và học tập trực tuyến của cộng đồng sinh viên.</p>
            <div class="illustration-image">
              <!-- SVG Learning Illustration -->
              <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#0B6EFD;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#00C2A8;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle cx="200" cy="150" r="120" fill="url(#grad1)" opacity="0.1"/>
                <path d="M150 200 L200 100 L250 200 Z" fill="url(#grad1)" opacity="0.3"/>
                <circle cx="180" cy="130" r="20" fill="#0B6EFD"/>
                <circle cx="220" cy="130" r="20" fill="#0B6EFD"/>
                <rect x="170" y="180" width="60" height="30" rx="5" fill="url(#grad1)" opacity="0.5"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Right Side: Form Card -->
        <div class="auth-form-wrapper">
          <div class="auth-card">
            <!-- Tab Toggle -->
            <div class="auth-tabs" role="tablist">
              <button
                :class="['tab-button', { active: activeTab === 'signin' }]"
                @click="switchTab('signin')"
                role="tab"
                aria-selected="true"
                aria-controls="signin-panel"
                id="signin-tab"
              >
                Đăng nhập
              </button>
              <button
                :class="['tab-button', { active: activeTab === 'signup' }]"
                @click="switchTab('signup')"
                role="tab"
                aria-selected="false"
                aria-controls="signup-panel"
                id="signup-tab"
              >
                Đăng ký
              </button>
            </div>

            <!-- Toast Notification -->
            <transition name="toast">
              <div v-if="toast.message" :class="['toast', toast.type]" role="alert">
                {{ toast.message }}
              </div>
            </transition>

            <!-- Sign In Form -->
            <div
              v-show="activeTab === 'signin'"
              id="signin-panel"
              role="tabpanel"
              aria-labelledby="signin-tab"
            >
              <form @submit.prevent="handleSignIn" class="auth-form" novalidate>
                <InputField
                  v-model="signInForm.email"
                  type="email"
                  label="Email"
                  placeholder="Nhập địa chỉ email của bạn"
                  :error="signInErrors.email"
                  :required="true"
                  icon="✉️"
                  @blur="validateSignInEmail"
                  id="signin-email"
                />

                <PasswordField
                  v-model="signInForm.password"
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  :error="signInErrors.password"
                  :required="true"
                  @blur="validateSignInPassword"
                  id="signin-password"
                />

                <div class="form-options">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      v-model="signInForm.rememberMe"
                      aria-label="Ghi nhớ đăng nhập"
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <button
                    type="button"
                    class="link-button"
                    @click="showForgotPassword = true"
                    aria-label="Quên mật khẩu"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  type="submit"
                  class="btn-primary"
                  :disabled="signInLoading"
                  :aria-busy="signInLoading"
                >
                  <span v-if="signInLoading" class="spinner"></span>
                  <span v-else>Đăng nhập</span>
                </button>

                <div class="auth-divider">
                  <span>hoặc</span>
                </div>

                <div class="oauth-buttons">
                  <button type="button" class="btn-oauth" @click="handleOAuth('google')" aria-label="Đăng nhập bằng Google">
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <g fill="#000" fill-rule="evenodd">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.965-2.188l-2.908-2.258c-.806.54-1.837.86-3.057.86-2.35 0-4.34-1.587-5.054-3.72H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                        <path d="M3.946 10.694c-.18-.54-.282-1.117-.282-1.694s.102-1.154.282-1.694V4.974H.957C.348 6.174 0 7.55 0 9s.348 2.826.957 4.026l2.989-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.974L3.946 7.306C4.66 5.173 6.65 3.58 9 3.58z" fill="#EA4335"/>
                      </g>
                    </svg>
                    Tiếp tục với Google
                  </button>
                  <button type="button" class="btn-oauth" @click="handleOAuth('microsoft')" aria-label="Đăng nhập bằng Microsoft">
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#00A4EF" d="M0 0h8v8H0z"/>
                      <path fill="#FFB900" d="M10 0h8v8h-8z"/>
                      <path fill="#7FBA00" d="M0 10h8v8H0z"/>
                      <path fill="#F25022" d="M10 10h8v8h-8z"/>
                    </svg>
                    Tiếp tục với Microsoft
                  </button>
                </div>

                <p class="auth-switch">
                  Chưa có tài khoản?
                  <button type="button" class="link-button" @click="switchTab('signup')">
                    Đăng ký ngay
                  </button>
                </p>
              </form>
            </div>

            <!-- Sign Up Form -->
            <div
              v-show="activeTab === 'signup'"
              id="signup-panel"
              role="tabpanel"
              aria-labelledby="signup-tab"
            >
              <form @submit.prevent="handleSignUp" class="auth-form" novalidate>
                <InputField
                  v-model="signUpForm.fullName"
                  type="text"
                  label="Họ và tên đầy đủ"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  :error="signUpErrors.fullName"
                  :required="true"
                  icon="👤"
                  @blur="validateSignUpFullName"
                  id="signup-fullname"
                />

                <InputField
                  v-model="signUpForm.email"
                  type="email"
                  label="Email"
                  placeholder="Nhập địa chỉ email của bạn"
                  :error="signUpErrors.email"
                  :required="true"
                  icon="✉️"
                  @blur="validateSignUpEmail"
                  id="signup-email"
                />

                <PasswordField
                  v-model="signUpForm.password"
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  :error="signUpErrors.password"
                  :required="true"
                  @blur="validateSignUpPassword"
                  id="signup-password"
                />

                <PasswordField
                  v-model="signUpForm.confirmPassword"
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
                  :error="signUpErrors.confirmPassword"
                  :required="true"
                  @blur="validateSignUpConfirmPassword"
                  id="signup-confirm-password"
                />

                <div class="form-group">
                  <label for="signup-program" class="form-label">
                    Chương trình đào tạo <span class="required">*</span>
                  </label>
                  <select
                    v-model="signUpForm.program"
                    id="signup-program"
                    class="form-select"
                    :class="{ 'error': signUpErrors.program }"
                    @blur="validateSignUpProgram"
                    aria-describedby="signup-program-error"
                    aria-invalid="signUpErrors.program ? 'true' : 'false'"
                  >
                    <option value="">Chọn chương trình đào tạo</option>
                    <option v-for="prog in programs" :key="prog" :value="prog">{{ prog }}</option>
                  </select>
                  <div v-if="signUpErrors.program" id="signup-program-error" class="error-message">
                    {{ signUpErrors.program }}
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    Vai trò <span class="required">*</span>
                  </label>
                  <div class="radio-group">
                    <label v-for="role in roles" :key="role.value" class="radio-label">
                      <input
                        type="radio"
                        :value="role.value"
                        v-model="signUpForm.role"
                        @change="validateSignUpRole"
                        :name="'signup-role'"
                      />
                      <span>{{ role.label }}</span>
                    </label>
                  </div>
                  <div v-if="signUpErrors.role" class="error-message">
                    {{ signUpErrors.role }}
                  </div>
                </div>

                <div class="form-group">
                  <label class="checkbox-label terms-checkbox">
                    <input
                      type="checkbox"
                      v-model="signUpForm.acceptTerms"
                      @change="validateSignUpTerms"
                      aria-describedby="signup-terms-error"
                      aria-invalid="signUpErrors.acceptTerms ? 'true' : 'false'"
                    />
                    <span>
                      Tôi đồng ý với
                      <router-link to="/chinhsach" class="link-inline">Điều khoản sử dụng</router-link>
                      &amp;
                      <router-link to="/chinhsach" class="link-inline">Chính sách bảo mật</router-link>
                      <span class="required">*</span>
                    </span>
                  </label>
                  <div v-if="signUpErrors.acceptTerms" id="signup-terms-error" class="error-message">
                    {{ signUpErrors.acceptTerms }}
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn-primary"
                  :disabled="signUpLoading"
                  :aria-busy="signUpLoading"
                >
                  <span v-if="signUpLoading" class="spinner"></span>
                  <span v-else>Đăng ký tài khoản</span>
                </button>

                <div class="auth-divider">
                  <span>hoặc</span>
                </div>

                <div class="oauth-buttons">
                  <button type="button" class="btn-oauth" @click="handleOAuth('google')" aria-label="Đăng ký bằng Google">
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <g fill="#000" fill-rule="evenodd">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.965-2.188l-2.908-2.258c-.806.54-1.837.86-3.057.86-2.35 0-4.34-1.587-5.054-3.72H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                        <path d="M3.946 10.694c-.18-.54-.282-1.117-.282-1.694s.102-1.154.282-1.694V4.974H.957C.348 6.174 0 7.55 0 9s.348 2.826.957 4.026l2.989-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.974L3.946 7.306C4.66 5.173 6.65 3.58 9 3.58z" fill="#EA4335"/>
                      </g>
                    </svg>
                    Tiếp tục với Google
                  </button>
                </div>

                <p class="auth-switch">
                  Đã có tài khoản?
                  <button type="button" class="link-button" @click="switchTab('signin')">
                    Đăng nhập ngay
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="auth-footer">
      <div class="container">
        <p class="footer-text">
          © {{ currentYear }} EduShare. Tất cả quyền được bảo lưu.
        </p>
        <div class="footer-links">
          <router-link to="/chinhsach" class="footer-link">Chính sách bảo mật</router-link>
          <span class="separator">•</span>
          <router-link to="/chinhsach" class="footer-link">Điều khoản dịch vụ</router-link>
          <span class="separator">•</span>
          <router-link to="/gioithieu" class="footer-link">Liên hệ</router-link>
        </div>
      </div>
    </footer>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="modal-overlay" @click="showForgotPassword = false">
      <div class="modal-content" @click.stop role="dialog" aria-labelledby="forgot-password-title">
        <button class="modal-close" @click="showForgotPassword = false" aria-label="Đóng">
          ×
        </button>
        <h2 id="forgot-password-title">Quên mật khẩu</h2>
        <p>Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
        <form @submit.prevent="handleForgotPassword">
          <InputField
            v-model="forgotPasswordEmail"
            type="email"
            label="Email"
            placeholder="Nhập địa chỉ email của bạn"
            :required="true"
          />
          <button type="submit" class="btn-primary">Gửi liên kết</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/auth/InputField.vue'
import PasswordField from '@/components/auth/PasswordField.vue'
import { validateEmail, validatePassword, validateFullName, validateConfirmPassword } from '@/utils/validate.js'
import { registerUser, loginUser } from '@/utils/authAPI.js'

export default {
  name: 'AuthView',
  components: {
    InputField,
    PasswordField
  },
  setup() {
    const router = useRouter()
    const activeTab = ref('signin')
    const signInLoading = ref(false)
    const signUpLoading = ref(false)
    const showForgotPassword = ref(false)
    const forgotPasswordEmail = ref('')
    const currentYear = new Date().getFullYear()

    // Sign In Form
    const signInForm = ref({
      email: '',
      password: '',
      rememberMe: false
    })
    const signInErrors = ref({
      email: '',
      password: ''
    })

    // Sign Up Form
    const signUpForm = ref({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      program: '',
      role: '',
      acceptTerms: false
    })
    const signUpErrors = ref({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      program: '',
      role: '',
      acceptTerms: ''
    })

    // Toast notification
    const toast = ref({
      message: '',
      type: 'success' // 'success' | 'error'
    })

    // Data
    const roles = [
      { value: 'student', label: 'Sinh viên' },
      { value: 'instructor', label: 'Giảng viên' },
      { value: 'guest', label: 'Khách' }
    ]
    const programs = ['CNTT', 'Kinh tế', 'Ngoại ngữ', 'Khoa học', 'Khác']

    // Methods
    const switchTab = (tab) => {
      activeTab.value = tab
      resetErrors()
    }

    const resetErrors = () => {
      signInErrors.value = { email: '', password: '' }
      signUpErrors.value = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        program: '',
        role: '',
        acceptTerms: ''
      }
    }

    const showToast = (message, type = 'success') => {
      toast.value = { message, type }
      setTimeout(() => {
        toast.value.message = ''
      }, 5000)
    }

    // Sign In Validation
    const validateSignInEmail = () => {
      if (!signInForm.value.email) {
        signInErrors.value.email = 'Vui lòng nhập địa chỉ email'
        return false
      }
      const emailCheck = validateEmail(signInForm.value.email)
      if (!emailCheck.isValid) {
        signInErrors.value.email = emailCheck.message
        return false
      }
      signInErrors.value.email = ''
      return true
    }

    const validateSignInPassword = () => {
      if (!signInForm.value.password) {
        signInErrors.value.password = 'Vui lòng nhập mật khẩu'
        return false
      }
      signInErrors.value.password = ''
      return true
    }

    const validateSignIn = () => {
      const emailValid = validateSignInEmail()
      const passwordValid = validateSignInPassword()
      return emailValid && passwordValid
    }

    // Sign Up Validation
    const validateSignUpFullName = () => {
      const check = validateFullName(signUpForm.value.fullName)
      signUpErrors.value.fullName = check.isValid ? '' : check.message
      return check.isValid
    }

    const validateSignUpEmail = async () => {
      if (!signUpForm.value.email) {
        signUpErrors.value.email = 'Vui lòng nhập địa chỉ email'
        return false
      }
      const emailCheck = validateEmail(signUpForm.value.email)
      if (!emailCheck.isValid) {
        signUpErrors.value.email = emailCheck.message
        return false
      }
      signUpErrors.value.email = ''
      return true
    }

    const validateSignUpPassword = () => {
      const check = validatePassword(signUpForm.value.password)
      signUpErrors.value.password = check.isValid ? '' : check.message
      return check.isValid
    }

    const validateSignUpConfirmPassword = () => {
      const check = validateConfirmPassword(signUpForm.value.password, signUpForm.value.confirmPassword)
      signUpErrors.value.confirmPassword = check.isValid ? '' : check.message
      return check.isValid
    }

    const validateSignUpProgram = () => {
      if (!signUpForm.value.program) {
        signUpErrors.value.program = 'Vui lòng chọn chương trình đào tạo'
        return false
      }
      signUpErrors.value.program = ''
      return true
    }

    const validateSignUpRole = () => {
      if (!signUpForm.value.role) {
        signUpErrors.value.role = 'Vui lòng chọn vai trò'
        return false
      }
      signUpErrors.value.role = ''
      return true
    }

    const validateSignUpTerms = () => {
      if (!signUpForm.value.acceptTerms) {
        signUpErrors.value.acceptTerms = 'Bạn phải đồng ý với điều khoản'
        return false
      }
      signUpErrors.value.acceptTerms = ''
      return true
    }

    const validateSignUp = () => {
      const fullNameValid = validateSignUpFullName()
      const emailValid = validateSignUpEmail()
      const passwordValid = validateSignUpPassword()
      const confirmPasswordValid = validateSignUpConfirmPassword()
      const programValid = validateSignUpProgram()
      const roleValid = validateSignUpRole()
      const termsValid = validateSignUpTerms()
      return fullNameValid && emailValid && passwordValid && confirmPasswordValid && programValid && roleValid && termsValid
    }

    // Submit Handlers
    const handleSignIn = async () => {
      if (!validateSignIn()) return

      signInLoading.value = true
      try {
        const result = await loginUser(signInForm.value.email, signInForm.value.password)
        if (result.success) {
          showToast('Đăng nhập thành công!', 'success')
          setTimeout(() => {
            router.push('/')
          }, 1000)
        } else {
          showToast(result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.', 'error')
        }
      } catch (error) {
        console.error('Login error:', error)
        showToast('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.', 'error')
      } finally {
        signInLoading.value = false
      }
    }

    const handleSignUp = async () => {
      // Validate all fields
      if (!validateSignUp()) return

      signUpLoading.value = true
      try {
        const roleMapping = {
          'student': 'student',
          'instructor': 'instructor',
          'guest': 'student' // Default guest to student
        }
        
        const result = await registerUser({
          fullName: signUpForm.value.fullName,
          email: signUpForm.value.email,
          passWord: signUpForm.value.password,
          role: roleMapping[signUpForm.value.role] || 'student',
          major: signUpForm.value.program
        })

        if (result.success) {
          showToast('Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success')
          setTimeout(() => {
            switchTab('signin')
            signInForm.value.email = signUpForm.value.email
          }, 1500)
        } else {
          showToast(result.message || 'Đăng ký thất bại. Vui lòng thử lại.', 'error')
        }
      } catch (error) {
        console.error('Registration error:', error)
        showToast('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.', 'error')
      } finally {
        signUpLoading.value = false
      }
    }

    const handleForgotPassword = () => {
      // TODO: Implement forgot password functionality
      showToast('Tính năng quên mật khẩu đang được phát triển.', 'error')
      showForgotPassword.value = false
    }

    const handleOAuth = (provider) => {
      // TODO: Implement OAuth login
      showToast(`Tính năng đăng nhập bằng ${provider} đang được phát triển.`, 'error')
    }

    // Check route query to determine initial tab
    onMounted(() => {
      const route = router.currentRoute.value
      if (route.query.tab === 'signup') {
        activeTab.value = 'signup'
      }
    })

    return {
      activeTab,
      signInForm,
      signInErrors,
      signInLoading,
      signUpForm,
      signUpErrors,
      signUpLoading,
      showForgotPassword,
      forgotPasswordEmail,
      toast,
      roles,
      programs,
      currentYear,
      switchTab,
      validateSignInEmail,
      validateSignInPassword,
      validateSignUpFullName,
      validateSignUpEmail,
      validateSignUpPassword,
      validateSignUpConfirmPassword,
      validateSignUpProgram,
      validateSignUpRole,
      validateSignUpTerms,
      handleSignIn,
      handleSignUp,
      handleForgotPassword,
      handleOAuth
    }
  }
}
</script>

<style scoped>
/* CSS Variables */
:root {
  --color-primary: #0B6EFD;
  --color-accent: #00C2A8;
  --color-text: #0F172A;
  --color-text-light: #64748B;
  --color-background: #F8FAFF;
  --color-white: #FFFFFF;
  --color-border: #E2E8F0;
  --color-error: #EF4444;
  --color-success: #10B981;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Header */
.auth-header {
  padding: 1.5rem 0;
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.auth-logo {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-edu {
  color: var(--color-primary);
}

.logo-share {
  color: var(--color-accent);
}

/* Main Content */
.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-container {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  animation: fadeIn 0.3s ease-in;
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

/* Illustration (Desktop) */
.auth-illustration {
  display: none;
}

.illustration-content {
  padding: 2rem;
  text-align: center;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.welcome-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-light);
  margin-bottom: 2rem;
}

.illustration-image {
  margin-top: 2rem;
}

.illustration-image svg {
  max-width: 100%;
  height: auto;
}

/* Form Card */
.auth-form-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 2.5rem;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Tabs */
.auth-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-border);
}

.tab-button {
  flex: 1;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-light);
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  bottom: -2px;
}

.tab-button:hover {
  color: var(--color-primary);
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab-button:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

/* Toast */
.toast {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  animation: slideDown 0.25s ease-out;
}

.toast.success {
  background: #D1FAE5;
  color: #065F46;
  border: 1px solid var(--color-success);
}

.toast.error {
  background: #FEE2E2;
  color: #991B1B;
  border: 1px solid var(--color-error);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: var(--transition);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.required {
  color: var(--color-error);
}

.form-select {
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  background: var(--color-white);
  transition: var(--transition);
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(11, 110, 253, 0.1);
}

.form-select.error {
  border-color: var(--color-error);
}

.radio-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9375rem;
}

.radio-label input[type="radio"] {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.125rem;
  cursor: pointer;
  accent-color: var(--color-primary);
  flex-shrink: 0;
}

.terms-checkbox {
  margin-top: 0.5rem;
}

.link-inline {
  color: var(--color-primary);
  text-decoration: none;
}

.link-inline:hover {
  text-decoration: underline;
}

.error-message {
  font-size: 0.875rem;
  color: var(--color-error);
  margin-top: 0.25rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.link-button {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  padding: 0;
}

.link-button:hover {
  text-decoration: underline;
}

.link-button:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Buttons */
.btn-primary {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
}

.btn-primary:hover:not(:disabled) {
  background: #0956D9;
  transform: scale(1.02);
}

.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--color-white);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Divider */
.auth-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-border);
}

.auth-divider span {
  padding: 0 1rem;
  font-size: 0.875rem;
  color: var(--color-text-light);
}

/* OAuth Buttons */
.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-oauth {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-white);
  color: var(--color-text);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-oauth:hover {
  background: var(--color-background);
  border-color: var(--color-primary);
  transform: scale(1.01);
}

.btn-oauth:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn-oauth svg {
  flex-shrink: 0;
}

/* Auth Switch */
.auth-switch {
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-top: 1rem;
}

/* Footer */
.auth-footer {
  padding: 2rem 1rem;
  background: var(--color-white);
  border-top: 1px solid var(--color-border);
}

.footer-text {
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.75rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  font-size: 0.875rem;
}

.footer-link {
  color: var(--color-primary);
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

.separator {
  color: var(--color-text-light);
}

/* Modal */
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
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-light);
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.modal-close:hover {
  background: var(--color-background);
  color: var(--color-text);
}

.modal-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.modal-content p {
  font-size: 0.9375rem;
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
}

/* Responsive */
@media (min-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  .auth-illustration {
    display: block;
  }

  .auth-card {
    padding: 3rem;
  }
}

@media (max-width: 767px) {
  .auth-card {
    padding: 1.5rem;
    border-radius: var(--radius-md);
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .radio-group {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>


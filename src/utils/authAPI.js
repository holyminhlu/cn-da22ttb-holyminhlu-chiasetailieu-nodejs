/**
 * Authentication API utilities
 * Connects to the auth service at http://localhost:3001
 */

const API_BASE_URL = 'http://localhost:3001'

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.fullName - Full name
 * @param {string} userData.email - Email address
 * @param {string} userData.passWord - Password
 * @param {string} [userData.role] - User role (student, instructor, admin)
 * @param {string} [userData.phone] - Phone number
 * @param {string} [userData.major] - Major/program
 * @returns {Promise<{success: boolean, message: string, data?: Object}>}
 */
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      return {
        success: true,
        message: result.message || 'Đăng ký thành công!',
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      message: 'Có lỗi xảy ra khi đăng ký. Vui lòng kiểm tra kết nối mạng.'
    }
  }
}

/**
 * Login user
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {Promise<{success: boolean, message: string, data?: Object}>}
 */
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        passWord: password
      }),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      // Save user data to localStorage
      if (result.data && result.data.token) {
        localStorage.setItem('token', result.data.token)
      }
      if (result.data && result.data.user) {
        localStorage.setItem('userFullName', result.data.user.fullName || '')
        localStorage.setItem('userEmail', result.data.user.email || '')
        localStorage.setItem('isLoggedIn', 'true')
        
        // Save role to localStorage
        if (result.data.user.role) {
          localStorage.setItem('userRole', result.data.user.role)
        }
        
        if (result.data.user.id) {
          localStorage.setItem('userId', result.data.user.id)
        } else if (result.data.user._id) {
          localStorage.setItem('userId', result.data.user._id)
        }
        if (result.data.user.user_id) {
          localStorage.setItem('user_id', result.data.user.user_id)
        }
        
        // Save other user data if available
        // Always save avatar and cover URLs, even if empty (to preserve existing)
        if (result.data.user.avatar_url !== undefined) {
          localStorage.setItem('userAvatar', result.data.user.avatar_url || '')
        }
        if (result.data.user.cover_url !== undefined) {
          localStorage.setItem('userCover', result.data.user.cover_url || '')
        }
        if (result.data.user.is_verified !== undefined) {
          localStorage.setItem('userVerified', result.data.user.is_verified.toString())
        }
      }

      // Emit login success event
      try {
        const bus = await import('@/utils/eventBus.js')
        bus.default.emit('login-success', {
          fullName: result.data?.user?.fullName,
          email: result.data?.user?.email,
          isLoggedIn: true
        })
      } catch (error) {
        // Event bus not critical, just log
        console.log('Event bus not available:', error)
      }

      return {
        success: true,
        message: result.message || 'Đăng nhập thành công!',
        data: result.data
      }
    } else {
      return {
        success: false,
        message: result.message || 'Email hoặc mật khẩu không đúng.'
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      message: 'Có lỗi xảy ra khi đăng nhập. Vui lòng kiểm tra kết nối mạng.'
    }
  }
}

/**
 * Check if email exists
 * @param {string} email - Email address to check
 * @returns {Promise<boolean>}
 */
export async function checkEmailExists(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/checkemail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const result = await response.json()
    return result.exists === true
  } catch (error) {
    console.error('Check email error:', error)
    return false
  }
}


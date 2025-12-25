import axios from 'axios'

// Use relative path to go through Vue proxy
const API_BASE_URL = '/api/courses'

// Payment API base – always go through gateway (/api) so it works in Docker/nginx and avoids CORS
const PAYMENTS_BASE_URL = '/api/payments'

/**
 * Get all courses
 */
export async function getAllCourses(params = {}) {
  try {
    const response = await axios.get(`${API_BASE_URL}`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

/**
 * Search courses
 */
export async function searchCourses(params = {}) {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, { params })
    return response.data
  } catch (error) {
    console.error('Error searching courses:', error)
    throw error
  }
}

/**
 * Get course by ID
 */
export async function getCourseById(courseId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/${courseId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching course:', error)
    throw error
  }
}

/**
 * Enroll in a course
 */
export async function enrollCourse(courseId, userId) {
  try {
    console.log('🔄 Enrolling in course:', { courseId, userId })
    const response = await axios.post(`${API_BASE_URL}/${courseId}/enroll`, {
      user_id: userId
    }, {
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('✅ Enrollment response:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error enrolling in course:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    
    // If we have a response, return it so frontend can handle it
    if (error.response) {
      return error.response.data
    }
    
    // Otherwise, throw a formatted error
    throw {
      success: false,
      message: error.message || 'Có lỗi xảy ra khi đăng ký khóa học',
      error: error
    }
  }
}

/**
 * Get enrollment status
 */
export async function getEnrollment(courseId, userId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/${courseId}/enrollment`, {
      params: { user_id: userId }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching enrollment:', error)
    throw error
  }
}

/**
 * Get my enrolled courses
 */
export async function getMyEnrollments(userId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/my-enrollments/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching my enrollments:', error)
    throw error
  }
}

/**
 * Create payment via PayOS (backend: POST /api/payments/create)
 */
export async function createPayment(courseId, userId, customerInfo = {}) {
  try {
    if (!courseId) throw new Error('courseId is required')
    if (!userId) throw new Error('userId is required')

    console.log('💳 Creating payment (PayOS):', { courseId, userId })

    const response = await axios.post(
      `${PAYMENTS_BASE_URL}/create`,
      {
        course_id: courseId,
        user_id: userId,
        customer_name: customerInfo.customer_name,
        customer_email: customerInfo.customer_email,
        customer_phone: customerInfo.customer_phone
      },
      {
        // Tăng timeout để chờ PayOS (backend cũng có timeout nội bộ 10s)
        timeout: 40000,
        headers: { 'Content-Type': 'application/json' }
      }
    )
    return response.data
  } catch (error) {
    console.error('❌ Error creating payment (PayOS):', error)
    if (error.response) return error.response.data
    return {
      success: false,
      message: error.message || 'Có lỗi xảy ra khi tạo thanh toán',
      error
    }
  }
}

/**
 * Get payment status via backend (GET /api/payments/:payment_id/status)
 */
export async function getPaymentStatus(paymentId) {
  try {
    if (!paymentId) throw new Error('paymentId is required')
    const response = await axios.get(`${PAYMENTS_BASE_URL}/${paymentId}/status`, {
      timeout: 10000
    })
    return response.data
  } catch (error) {
    console.error('❌ Error getting payment status (PayOS):', error)
    if (error.response) return error.response.data
    return {
      success: false,
      message: error.message || 'Có lỗi xảy ra khi kiểm tra trạng thái thanh toán',
      error
    }
  }
}

/**
 * Update course progress with retry logic
 */
export async function updateProgress(courseId, userId, lessonId, moduleId, retries = 1) {
  const maxRetries = retries
  let lastError = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const url = `${API_BASE_URL}/${courseId}/progress`
      const requestBody = {
        user_id: userId,
        lesson_id: lessonId,
        module_id: moduleId
      }
      
      console.log(`🔄 Updating progress (attempt ${attempt + 1}/${maxRetries + 1}):`, { 
        courseId, 
        userId, 
        lessonId, 
        moduleId,
        url
      })
      
      const startTime = Date.now()
      
      // Log full request details
      console.log('📤 Full request details:', {
        method: 'PUT',
        url: url,
        fullUrl: window.location.origin + url,
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      })
      
      const response = await axios.put(url, requestBody, {
        timeout: 30000, // 30s timeout - increased to allow server processing time
        headers: {
          'Content-Type': 'application/json'
        },
        validateStatus: (status) => status < 500 // Don't throw on 4xx errors
      })
      
      const elapsed = Date.now() - startTime
      console.log(`✅ Request completed in ${elapsed}ms`)
      console.log('Response status:', response.status)
      console.log('Response data:', response.data)
      
      // If we got a response, return it (even if it's an error response)
      if (response.status >= 200 && response.status < 300) {
        return response.data
      } else {
        // 4xx error - don't retry, return error response
        return response.data || {
          success: false,
          message: `Lỗi ${response.status}: ${response.statusText}`
        }
      }
    } catch (error) {
      lastError = error
      console.error(`❌ Error updating progress (attempt ${attempt + 1}/${maxRetries + 1}):`, error)
      
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        name: error.name,
        hasResponse: !!error.response,
        hasRequest: !!error.request
      })
      
      // Determine error type
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout')
      const isNetworkError = !error.response && (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error'))
      const isConnectionError = error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT'
      
      // If we have a response (4xx/5xx), return it immediately
      if (error.response) {
        console.log('Server responded with error:', error.response.status, error.response.data)
        return error.response.data || {
          success: false,
          message: error.message || 'Có lỗi xảy ra khi cập nhật tiến độ'
        }
      }
      
      // If it's a timeout or network error and we have retries left, wait and retry
      if (attempt < maxRetries && (isTimeout || isNetworkError || isConnectionError)) {
        const delay = 1000 // Fixed 1s delay
        console.log(`⏳ Retrying in ${delay}ms... (${attempt + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      // Network error or timeout - throw if no retries left
      if (attempt === maxRetries) {
        let errorMessage = 'Có lỗi xảy ra khi cập nhật tiến độ. Vui lòng thử lại.'
        
        if (isTimeout) {
          errorMessage = 'Yêu cầu bị timeout. Vui lòng kiểm tra kết nối mạng và thử lại.'
        } else if (isNetworkError) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
        } else if (isConnectionError) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng đảm bảo server đang chạy.'
        } else if (error.message) {
          errorMessage = error.message
        }
        
        throw {
          success: false,
          message: errorMessage,
          error: error,
          errorCode: error.code
        }
      }
    }
  }
  
  // Should never reach here, but just in case
  throw {
    success: false,
    message: lastError?.message || 'Có lỗi xảy ra khi cập nhật tiến độ',
    error: lastError
  }
}


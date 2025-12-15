# 🔧 Complete Payment API Fix - Production Ready

## 📋 Phân Tích Nguyên Nhân Timeout

### 1. Các Nguyên Nhân Backend Gây Treo Request

#### ❌ Nguyên nhân 1: Thiếu res.json() / res.send()
```javascript
// SAI - Không trả response
if (error) {
    console.error(error)
    // Missing: return res.json(...)
}

// ĐÚNG - Luôn trả response
if (error) {
    return res.status(500).json({
        success: false,
        message: 'Error occurred'
    })
}
```

#### ❌ Nguyên nhân 2: await vào Promise không resolve/reject
```javascript
// SAI - Promise có thể không resolve
const result = await sepayService.createPayment(data)
// Nếu SePay API không phản hồi, sẽ treo mãi

// ĐÚNG - Thêm timeout
const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), 15000)
})
const result = await Promise.race([sepayCall, timeout])
```

#### ❌ Nguyên nhân 3: Middleware không gọi next()
```javascript
// SAI - Không gọi next()
app.use((req, res) => {
    if (error) {
        console.error(error)
        // Missing: next() hoặc res.json()
    }
})

// ĐÚNG - Luôn gọi next() hoặc trả response
app.use((req, res, next) => {
    if (error) {
        return res.status(500).json({ error: 'Error' })
    }
    next()
})
```

#### ❌ Nguyên nhân 4: Điều kiện if/return làm thoát hàm mà không trả response
```javascript
// SAI - Return không có response
if (condition) {
    return // Missing response
}

// ĐÚNG - Luôn trả response
if (condition) {
    return res.json({ success: true })
}
```

#### ❌ Nguyên nhân 5: Payload frontend không khớp với backend
```javascript
// Frontend gửi: { courseId, userId }
// Backend expect: { course_id, user_id }
// → Backend không tìm thấy course_id → Logic sai → Không trả response
```

## ✅ Code Production-Ready

### Backend: POST /api/payments (Complete)

```javascript
exports.createPayment = async (req, res) => {
    const requestStartTime = Date.now();
    
    // ========== CHECKPOINT 0: Entry Point ==========
    console.log('\n💳 ========== CREATE PAYMENT REQUEST ==========')
    console.log(`Time: ${new Date().toISOString()}`)
    console.log(`Method: ${req.method}`)
    console.log(`Path: ${req.path}`)
    console.log(`Body:`, JSON.stringify(req.body, null, 2))
    
    try {
        // ========== CHECKPOINT 1: Validate Request Body ==========
        console.log('📋 [CHECKPOINT 1] Validating request body...')
        if (!req.body || typeof req.body !== 'object') {
            console.error('❌ [CHECKPOINT 1] Invalid request body')
            return res.status(400).json({
                success: false,
                message: 'Request body không hợp lệ'
            })
        }
        console.log('✅ [CHECKPOINT 1] Request body valid')
        
        // ========== CHECKPOINT 2: Normalize Payload ==========
        console.log('🔄 [CHECKPOINT 2] Normalizing payload...')
        const { course_id, courseId, user_id, userId } = req.body
        const finalCourseId = course_id || courseId
        const finalUserId = user_id || userId || req.user?.id
        
        console.log(`   course_id: ${finalCourseId ? '✅' : '❌'}`)
        console.log(`   user_id: ${finalUserId ? '✅' : '❌'}`)
        
        // ========== CHECKPOINT 3: Validate Required Fields ==========
        console.log('✅ [CHECKPOINT 3] Validating required fields...')
        if (!finalUserId) {
            console.error('❌ [CHECKPOINT 3] Missing user_id')
            return res.status(401).json({
                success: false,
                message: 'Người dùng chưa đăng nhập',
                required: ['course_id', 'user_id'],
                received: {
                    course_id: finalCourseId ? '✅' : '❌',
                    user_id: finalUserId ? '✅' : '❌'
                }
            })
        }
        
        if (!finalCourseId) {
            console.error('❌ [CHECKPOINT 3] Missing course_id')
            return res.status(400).json({
                success: false,
                message: 'course_id là bắt buộc',
                required: ['course_id', 'user_id']
            })
        }
        
        if (typeof finalCourseId !== 'string' || finalCourseId.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'course_id phải là chuỗi không rỗng'
            })
        }
        
        if (typeof finalUserId !== 'string' || finalUserId.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'user_id phải là chuỗi không rỗng'
            })
        }
        console.log('✅ [CHECKPOINT 3] Required fields valid')
        
        // ========== CHECKPOINT 4: Find Course ==========
        console.log(`📚 [CHECKPOINT 4] Looking up course: ${finalCourseId}`)
        const course = await Course.findOne({ course_id: finalCourseId })
        if (!course) {
            console.error(`❌ [CHECKPOINT 4] Course not found`)
            return res.status(404).json({
                success: false,
                message: 'Khóa học không tồn tại',
                course_id: finalCourseId
            })
        }
        console.log(`✅ [CHECKPOINT 4] Course found: ${course.title}`)
        
        // ========== CHECKPOINT 5: Validate Pricing ==========
        console.log(`💰 [CHECKPOINT 5] Checking pricing...`)
        if (course.pricing.isFree || course.pricing.price === 0) {
            console.error(`❌ [CHECKPOINT 5] Course is free`)
            return res.status(400).json({
                success: false,
                message: 'Khóa học này miễn phí, không cần thanh toán'
            })
        }
        console.log(`✅ [CHECKPOINT 5] Price: ${course.pricing.price} ${course.pricing.currency}`)
        
        // ========== CHECKPOINT 6: Check Enrollment ==========
        console.log(`📋 [CHECKPOINT 6] Checking enrollment...`)
        const existingEnrollment = await Enrollment.findOne({
            user_id: finalUserId,
            course_id: finalCourseId
        })
        if (existingEnrollment) {
            console.error(`❌ [CHECKPOINT 6] User already enrolled`)
            return res.status(400).json({
                success: false,
                message: 'Bạn đã đăng ký khóa học này rồi'
            })
        }
        console.log(`✅ [CHECKPOINT 6] No existing enrollment`)
        
        // ========== CHECKPOINT 7: Check Pending Payment ==========
        console.log(`💳 [CHECKPOINT 7] Checking pending payments...`)
        const pendingPayment = await Payment.findOne({
            user_id: finalUserId,
            course_id: finalCourseId,
            status: { $in: ['pending', 'processing'] }
        })
        if (pendingPayment && pendingPayment.sepay_payment_url) {
            console.log(`✅ [CHECKPOINT 7] Returning existing payment`)
            return res.json({
                success: true,
                message: 'Đã có payment đang chờ thanh toán',
                data: {
                    payment_id: pendingPayment.payment_id,
                    payment_url: pendingPayment.sepay_payment_url,
                    amount: pendingPayment.amount,
                    currency: pendingPayment.currency
                }
            })
        }
        console.log(`✅ [CHECKPOINT 7] No pending payment`)
        
        // ========== CHECKPOINT 8: Create Payment Record ==========
        console.log(`💾 [CHECKPOINT 8] Creating payment record...`)
        let payment
        try {
            payment = new Payment({
                user_id: finalUserId,
                course_id: finalCourseId,
                amount: course.pricing.price,
                currency: course.pricing.currency || 'VND',
                status: 'pending',
                customer_info: {
                    name: req.body.customer_name || req.user?.name || 'Khách hàng',
                    email: req.body.customer_email || req.user?.email || '',
                    phone: req.body.customer_phone || req.user?.phone || ''
                }
            })
            await payment.save()
            console.log(`✅ [CHECKPOINT 8] Payment created: ${payment.payment_id}`)
        } catch (dbError) {
            console.error(`❌ [CHECKPOINT 8] Database error:`, dbError.message)
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo payment record',
                error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
            })
        }
        
        // ========== CHECKPOINT 9: Create SePay Payment ==========
        console.log(`📤 [CHECKPOINT 9] Calling SePay service...`)
        const sepayStartTime = Date.now()
        let sepayResult = null
        
        try {
            const sepayCall = sepayService.createPayment({
                orderId: payment.payment_id,
                amount: payment.amount,
                description: `Thanh toán khóa học: ${course.title}`,
                customerName: payment.customer_info.name,
                customerEmail: payment.customer_info.email,
                customerPhone: payment.customer_info.phone,
                returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/success?payment_id=${payment.payment_id}`,
                cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/cancel?payment_id=${payment.payment_id}`,
                webhookUrl: process.env.SEPAY_IPN_URL
            })
            
            // Timeout protection - 15 seconds max
            const sepayTimeout = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('SePay service timeout after 15 seconds'))
                }, 15000)
            })
            
            sepayResult = await Promise.race([sepayCall, sepayTimeout])
            const sepayElapsed = Date.now() - sepayStartTime
            console.log(`✅ [CHECKPOINT 9] SePay response in ${sepayElapsed}ms`)
            
            // Validate result
            if (!sepayResult || (!sepayResult.paymentUrl && !sepayResult.checkoutUrl)) {
                throw new Error('SePay returned invalid response: no payment URL')
            }
            
        } catch (sepayError) {
            const sepayElapsed = Date.now() - sepayStartTime
            console.error(`❌ [CHECKPOINT 9] SePay error after ${sepayElapsed}ms:`)
            console.error('   Error:', sepayError.message)
            
            // Cleanup payment record
            if (payment && payment._id) {
                try {
                    await Payment.findByIdAndDelete(payment._id)
                } catch (deleteError) {
                    console.error('   Error deleting payment:', deleteError.message)
                }
            }
            
            // QUAN TRỌNG: Luôn trả response
            if (!res.headersSent) {
                return res.status(500).json({
                    success: false,
                    message: sepayError.message?.includes('timeout')
                        ? 'SePay service không phản hồi kịp thời. Vui lòng thử lại sau.'
                        : 'Lỗi khi tạo payment link',
                    error: process.env.NODE_ENV === 'development' ? sepayError.message : undefined,
                    timestamp: new Date().toISOString()
                })
            }
            return // Exit if headers already sent
        }
        
        // ========== CHECKPOINT 10: Update Payment ==========
        console.log(`💾 [CHECKPOINT 10] Updating payment...`)
        payment.sepay_payment_url = sepayResult.paymentUrl || sepayResult.checkoutUrl
        payment.status = 'processing'
        payment.expired_at = sepayResult.expiresAt || new Date(Date.now() + 30 * 60 * 1000)
        await payment.save()
        console.log(`✅ [CHECKPOINT 10] Payment updated`)
        
        // ========== CHECKPOINT 11: Build Response ==========
        console.log(`📦 [CHECKPOINT 11] Building response...`)
        const responseData = {
            payment_id: payment.payment_id,
            payment_url: payment.sepay_payment_url,
            amount: payment.amount,
            currency: payment.currency,
            expires_at: payment.expired_at
        }
        
        if (sepayResult.formFields) {
            responseData.checkout_url = sepayResult.checkoutUrl
            responseData.form_fields = sepayResult.formFields
        }
        
        const totalElapsed = Date.now() - requestStartTime
        console.log(`✅ [CHECKPOINT 11] Payment created successfully in ${totalElapsed}ms`)
        
        // ========== CHECKPOINT 12: Return Response ==========
        // QUAN TRỌNG NHẤT: Luôn trả response
        if (!res.headersSent) {
            return res.json({
                success: true,
                message: 'Tạo payment link thành công',
                data: responseData
            })
        } else {
            console.error('⚠️ [CRITICAL] Response headers already sent!')
        }
        
    } catch (error) {
        const elapsed = Date.now() - requestStartTime
        console.error(`\n❌ ========== UNHANDLED ERROR ==========`)
        console.error(`Elapsed: ${elapsed}ms`)
        console.error('Error:', error.message)
        console.error('Stack:', error.stack?.substring(0, 500))
        
        // QUAN TRỌNG: Luôn trả response trong catch block
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo payment',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
                timestamp: new Date().toISOString()
            })
        }
    }
}
```

### Frontend: createPayment() - Complete

```javascript
import axios from 'axios';

const API_BASE_URL = '/api/payments';

/**
 * Tạo payment request cho khóa học
 * @param {string} courseId - ID của khóa học
 * @param {string} userId - ID của người dùng
 * @param {object} customerInfo - Thông tin khách hàng (optional)
 * @returns {Promise<object>} Payment response
 */
export const createPayment = async (courseId, userId, customerInfo = {}) => {
  try {
    // Validate input
    if (!courseId) {
      throw new Error('courseId is required');
    }
    if (!userId) {
      throw new Error('userId is required');
    }

    console.log('💳 Creating payment:', { courseId, userId });

    // Payload structure - Backend sẽ normalize
    const payload = {
      course_id: courseId, // Backend hỗ trợ cả courseId và course_id
      user_id: userId,     // Backend hỗ trợ cả userId và user_id
      customer_name: customerInfo.customer_name,
      customer_email: customerInfo.customer_email,
      customer_phone: customerInfo.customer_phone
    };

    const response = await axios.post(API_BASE_URL, payload, {
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Payment created:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Payment error:', error);
    
    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Vui lòng thử lại.');
    }
    
    // Handle HTTP errors
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Không thể tạo payment');
    }
    
    throw error;
  }
};
```

## 📊 Payload Structure

### Frontend → Backend

**Hỗ trợ cả 2 formats:**

```json
// Format 1: camelCase (frontend thường dùng)
{
  "courseId": "693fc2fac94fc9a5544e6065",
  "userId": "6908204708e0d1762ce43424",
  "customer_name": "Nguyễn Văn A",
  "customer_email": "user@example.com",
  "customer_phone": "0123456789"
}

// Format 2: snake_case (backend expect)
{
  "course_id": "693fc2fac94fc9a5544e6065",
  "user_id": "6908204708e0d1762ce43424",
  "customer_name": "Nguyễn Văn A",
  "customer_email": "user@example.com",
  "customer_phone": "0123456789"
}
```

**Backend sẽ normalize:**
```javascript
const finalCourseId = course_id || courseId
const finalUserId = user_id || userId || req.user?.id
```

### Backend → Frontend

```json
{
  "success": true,
  "message": "Tạo payment link thành công",
  "data": {
    "payment_id": "payment_abc123",
    "payment_url": "https://sepay.vn/checkout/...",
    "amount": 5000,
    "currency": "VND",
    "expires_at": "2024-12-15T10:30:00Z",
    "checkout_url": "...", // Nếu dùng SDK
    "form_fields": {...}   // Nếu dùng SDK
  }
}
```

## ✅ Checklist Test

### 1. Postman Test

```bash
# Test 1: Valid request
POST http://localhost:3000/api/payments
Content-Type: application/json

{
  "courseId": "693fc2fac94fc9a5544e6065",
  "userId": "6908204708e0d1762ce43424"
}

# Expected: 200 OK với payment_url trong < 1 second

# Test 2: Missing courseId
{
  "userId": "6908204708e0d1762ce43424"
}

# Expected: 400 Bad Request với message rõ ràng

# Test 3: Missing userId
{
  "courseId": "693fc2fac94fc9a5544e6065"
}

# Expected: 401 Unauthorized với message rõ ràng
```

### 2. Browser Test

1. Open DevTools → Network tab
2. Navigate to paid course page
3. Click "Đăng ký"
4. Check:
   - ✅ Request: POST /api/payments
   - ✅ Status: 200 OK
   - ✅ Response time: < 1 second (mock) hoặc < 15 seconds (real)
   - ✅ Response có `payment_url`
   - ✅ Browser redirect đến payment URL

### 3. Backend Logs Check

**Phải thấy tất cả 12 checkpoints:**

```
💳 ========== CREATE PAYMENT REQUEST ==========
📋 [CHECKPOINT 1] Validating request body...
✅ [CHECKPOINT 1] Request body valid
🔄 [CHECKPOINT 2] Normalizing payload...
✅ [CHECKPOINT 3] Required fields valid
📚 [CHECKPOINT 4] Looking up course...
✅ [CHECKPOINT 4] Course found: ...
💰 [CHECKPOINT 5] Checking pricing...
✅ [CHECKPOINT 5] Price: 5000 VND
📋 [CHECKPOINT 6] Checking enrollment...
✅ [CHECKPOINT 6] No existing enrollment
💳 [CHECKPOINT 7] Checking pending payments...
✅ [CHECKPOINT 7] No pending payment
💾 [CHECKPOINT 8] Creating payment record...
✅ [CHECKPOINT 8] Payment created: payment_...
📤 [CHECKPOINT 9] Calling SePay service...
✅ [CHECKPOINT 9] SePay response in XXXms
💾 [CHECKPOINT 10] Updating payment...
✅ [CHECKPOINT 10] Payment updated
📦 [CHECKPOINT 11] Building response...
✅ [CHECKPOINT 11] Payment created successfully in XXXms
```

### 4. Verify No Timeout

**Test với invalid SePay config:**
- Set `SEPAY_API_KEY=""` để force mock mode
- Expected: Response trong < 1 second với mock URL

**Test với SePay timeout:**
- Block SePay API call
- Expected: Response trong 15 seconds với error message

---

## 🎯 Success Criteria

- ✅ API trả response trong < 1 second (mock) hoặc < 15 seconds (real)
- ✅ Không có ECONNABORTED error
- ✅ Frontend nhận được JSON response hợp lệ
- ✅ Payment được tạo trong database
- ✅ User được redirect đến payment URL
- ✅ Tất cả 12 checkpoints được log

---

**Sau khi apply fix, restart service và test lại!**


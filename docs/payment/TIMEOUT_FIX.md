# 🔧 Fix Timeout Issue - POST /api/payments

## 📋 Phân Tích Nguyên Nhân

### 1. ECONNABORTED - Request Timeout

**Nguyên nhân chính:**
- ✅ **SePay API call bị treo** - Không có timeout hoặc timeout quá dài
- ✅ **Promise không resolve** - SePay service không trả về kết quả
- ✅ **Thiếu error handling** - Không catch timeout errors
- ✅ **Không có checkpoint logging** - Khó debug vị trí treo

### 2. Các Lỗi Backend Phổ Biến

#### ❌ Lỗi 1: Thiếu res.json() / res.send()
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

#### ❌ Lỗi 2: await vào promise không resolve
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

#### ❌ Lỗi 3: Middleware không next()
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

#### ❌ Lỗi 4: Logic xử lý payment sai payload
```javascript
// SAI - Payload không đúng format
const { courseId } = req.body // Frontend gửi courseId
const course = await Course.findOne({ course_id: courseId }) // Backend expect course_id

// ĐÚNG - Validate và normalize
const { course_id, courseId } = req.body
const finalCourseId = course_id || courseId
if (!finalCourseId) {
    return res.status(400).json({ message: 'course_id is required' })
}
```

## ✅ Code Production-Ready

### Backend: POST /api/payments

```javascript
exports.createPayment = async (req, res) => {
    const requestStartTime = Date.now();
    
    try {
        // ========== CHECKPOINT 1: Validate Input ==========
        console.log('\n💳 [CHECKPOINT 1] CREATE PAYMENT REQUEST')
        console.log(`Time: ${new Date().toISOString()}`)
        console.log('Request body:', JSON.stringify(req.body, null, 2))
        
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Request body không hợp lệ'
            })
        }
        
        // Normalize payload - hỗ trợ cả courseId và course_id
        const { course_id, courseId, user_id, userId } = req.body
        const finalCourseId = course_id || courseId
        const finalUserId = user_id || userId || req.user?.id
        
        if (!finalUserId) {
            return res.status(401).json({
                success: false,
                message: 'Người dùng chưa đăng nhập',
                required: ['course_id', 'user_id']
            })
        }
        
        if (!finalCourseId) {
            return res.status(400).json({
                success: false,
                message: 'course_id là bắt buộc',
                required: ['course_id', 'user_id']
            })
        }
        
        // ========== CHECKPOINT 2: Find Course ==========
        console.log(`📚 [CHECKPOINT 2] Looking up course: ${finalCourseId}`)
        const course = await Course.findOne({ course_id: finalCourseId })
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Khóa học không tồn tại',
                course_id: finalCourseId
            })
        }
        console.log(`✅ [CHECKPOINT 2] Course found: ${course.title}`)
        
        // ========== CHECKPOINT 3: Validate Pricing ==========
        console.log(`💰 [CHECKPOINT 3] Checking pricing...`)
        if (course.pricing.isFree || course.pricing.price === 0) {
            return res.status(400).json({
                success: false,
                message: 'Khóa học này miễn phí, không cần thanh toán'
            })
        }
        console.log(`✅ [CHECKPOINT 3] Price: ${course.pricing.price} ${course.pricing.currency}`)
        
        // ========== CHECKPOINT 4: Check Enrollment ==========
        console.log(`📋 [CHECKPOINT 4] Checking enrollment...`)
        const existingEnrollment = await Enrollment.findOne({
            user_id: finalUserId,
            course_id: finalCourseId
        })
        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã đăng ký khóa học này rồi'
            })
        }
        console.log(`✅ [CHECKPOINT 4] No existing enrollment`)
        
        // ========== CHECKPOINT 5: Check Pending Payment ==========
        console.log(`💳 [CHECKPOINT 5] Checking pending payments...`)
        const pendingPayment = await Payment.findOne({
            user_id: finalUserId,
            course_id: finalCourseId,
            status: { $in: ['pending', 'processing'] }
        })
        if (pendingPayment && pendingPayment.sepay_payment_url) {
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
        console.log(`✅ [CHECKPOINT 5] No pending payment`)
        
        // ========== CHECKPOINT 6: Create Payment Record ==========
        console.log(`💾 [CHECKPOINT 6] Creating payment record...`)
        const payment = new Payment({
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
        console.log(`✅ [CHECKPOINT 6] Payment created: ${payment.payment_id}`)
        
        // ========== CHECKPOINT 7: Create SePay Payment ==========
        console.log(`📤 [CHECKPOINT 7] Calling SePay service...`)
        const sepayStartTime = Date.now()
        
        // Wrap với timeout để tránh treo
        const sepayCall = sepayService.createPayment({
            orderId: payment.payment_id,
            amount: payment.amount,
            description: `Thanh toán khóa học: ${course.title}`,
            returnUrl: `${process.env.FRONTEND_URL}/payment/success?payment_id=${payment.payment_id}`,
            cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel?payment_id=${payment.payment_id}`,
            webhookUrl: process.env.SEPAY_IPN_URL
        })
        
        const sepayTimeout = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('SePay service timeout after 15 seconds'))
            }, 15000)
        })
        
        const sepayResult = await Promise.race([sepayCall, sepayTimeout])
        const sepayElapsed = Date.now() - sepayStartTime
        console.log(`✅ [CHECKPOINT 7] SePay response in ${sepayElapsed}ms`)
        
        // ========== CHECKPOINT 8: Update Payment ==========
        console.log(`💾 [CHECKPOINT 8] Updating payment with SePay info...`)
        payment.sepay_payment_url = sepayResult.paymentUrl || sepayResult.checkoutUrl
        payment.status = 'processing'
        await payment.save()
        console.log(`✅ [CHECKPOINT 8] Payment updated`)
        
        // ========== CHECKPOINT 9: Return Response ==========
        const totalElapsed = Date.now() - requestStartTime
        console.log(`✅ [CHECKPOINT 9] Payment created successfully in ${totalElapsed}ms`)
        
        return res.json({
            success: true,
            message: 'Tạo payment link thành công',
            data: {
                payment_id: payment.payment_id,
                payment_url: payment.sepay_payment_url,
                amount: payment.amount,
                currency: payment.currency
            }
        })
        
    } catch (error) {
        const elapsed = Date.now() - requestStartTime
        console.error(`\n❌ ERROR after ${elapsed}ms:`)
        console.error('Error:', error)
        console.error('Error message:', error.message)
        console.error('Error name:', error.name)
        
        // QUAN TRỌNG: Luôn trả về response
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message?.includes('timeout') 
                    ? 'Service không phản hồi kịp thời. Vui lòng thử lại.'
                    : 'Lỗi khi tạo payment',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
                errorType: error.name,
                timestamp: new Date().toISOString()
            })
        }
    }
}
```

### Frontend: createPayment()

```javascript
export const createPayment = async (courseId, userId, customerInfo = {}) => {
  try {
    // Validate input
    if (!courseId) throw new Error('courseId is required');
    if (!userId) throw new Error('userId is required');

    console.log('💳 Creating payment:', { courseId, userId });

    const response = await axios.post('/api/payments', {
      course_id: courseId, // Backend expect course_id
      user_id: userId,     // Backend expect user_id
      customer_name: customerInfo.customer_name,
      customer_email: customerInfo.customer_email,
      customer_phone: customerInfo.customer_phone
    }, {
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Payment created:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Payment error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Vui lòng thử lại.');
    }
    
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Không thể tạo payment');
    }
    
    throw error;
  }
};
```

## 📊 Payload Structure

### Frontend → Backend

```json
{
  "course_id": "6909807aece94ce94df477ca",
  "user_id": "6908204708e0d1762ce43424",
  "customer_name": "Nguyễn Văn A",
  "customer_email": "user@example.com",
  "customer_phone": "0123456789"
}
```

### Backend → Frontend (Success)

```json
{
  "success": true,
  "message": "Tạo payment link thành công",
  "data": {
    "payment_id": "payment_abc123",
    "payment_url": "https://sepay.vn/checkout/...",
    "amount": 5000,
    "currency": "VND",
    "expires_at": "2024-12-15T10:30:00Z"
  }
}
```

### Backend → Frontend (Error)

```json
{
  "success": false,
  "message": "Lỗi khi tạo payment",
  "error": "SePay service timeout after 15 seconds",
  "errorType": "Error",
  "timestamp": "2024-12-15T10:25:00Z"
}
```

## ✅ Checklist Test

### 1. Postman Test

```bash
# Test với valid data
POST http://localhost:3000/api/payments
Content-Type: application/json

{
  "course_id": "test_course_id",
  "user_id": "test_user_id"
}

# Expected: 200 OK với payment_url
```

### 2. Browser Test

1. Open DevTools → Network tab
2. Click "Đăng ký" trên khóa học có phí
3. Check request:
   - ✅ Status: 200 (not timeout)
   - ✅ Response time: < 1 second
   - ✅ Response có `payment_url`

### 3. Backend Logs Check

```
✅ [CHECKPOINT 1] CREATE PAYMENT REQUEST
✅ [CHECKPOINT 2] Course found
✅ [CHECKPOINT 3] Price: 5000 VND
✅ [CHECKPOINT 4] No existing enrollment
✅ [CHECKPOINT 5] No pending payment
✅ [CHECKPOINT 6] Payment created
✅ [CHECKPOINT 7] SePay response in XXXms
✅ [CHECKPOINT 8] Payment updated
✅ [CHECKPOINT 9] Payment created successfully in XXXms
```

### 4. Timeout Test

```bash
# Simulate timeout bằng cách block SePay API
# Expected: Response trong 15 seconds với error message
```

## 🎯 Success Criteria

- ✅ API trả response trong < 1 giây (mock) hoặc < 15 giây (real SePay)
- ✅ Không có ECONNABORTED error
- ✅ Frontend nhận được JSON response hợp lệ
- ✅ Payment được tạo trong database
- ✅ User được redirect đến payment URL

---

**Sau khi apply fix, test lại và verify logs để đảm bảo không còn timeout!**


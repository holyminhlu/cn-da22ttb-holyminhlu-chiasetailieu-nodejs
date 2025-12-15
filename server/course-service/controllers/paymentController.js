const Payment = require('../models/paymentModel')
const Enrollment = require('../models/enrollmentModel')
const Course = require('../models/courseModel')
const sepayService = require('../services/sepayService')
const { v4: uuidv4 } = require('uuid')

/**
 * Tạo payment request - FLOW CHUẨN (KHÔNG GỌI API CỔNG THANH TOÁN)
 * Endpoint này chỉ tạo payment_url local và trả response ngay lập tức
 * Payment URL sẽ được xử lý bởi cổng thanh toán, callback sẽ được xử lý sau
 */
exports.createPaymentFast = async (req, res) => {
    const requestStartTime = Date.now();
    
    // Log ngay khi function được gọi
    console.log('\n🚀 ========== CREATE PAYMENT FAST CALLED ==========')
    console.log(`Time: ${new Date().toISOString()}`)
    console.log(`Method: ${req.method}`)
    console.log(`Path: ${req.path}`)
    console.log(`URL: ${req.url}`)
    console.log(`Body exists:`, !!req.body)
    
    try {
        console.log('\n💳 ========== CREATE PAYMENT (FAST) ==========')
        console.log(`Time: ${new Date().toISOString()}`)
        console.log('Request body:', JSON.stringify(req.body, null, 2))
        
        // Validate request body
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Request body không hợp lệ'
            })
        }
        
        // Normalize payload
        const { course_id, courseId, user_id, userId } = req.body
        const finalCourseId = course_id || courseId
        const finalUserId = user_id || userId || req.user?.id

        // Validate user_id
        if (!finalUserId) {
            return res.status(401).json({
                success: false,
                message: 'Người dùng chưa đăng nhập. Vui lòng cung cấp user_id trong request body.',
                required: ['course_id', 'user_id'],
                received: {
                    course_id: finalCourseId ? '✅' : '❌',
                    user_id: finalUserId ? '✅' : '❌'
                }
            })
        }

        // Validate course_id
        if (!finalCourseId) {
            return res.status(400).json({
                success: false,
                message: 'course_id là bắt buộc',
                required: ['course_id', 'user_id'],
                received: {
                    course_id: finalCourseId ? '✅' : '❌',
                    user_id: finalUserId ? '✅' : '❌'
                }
            })
        }
        
        // Validate format
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

        // 1. Kiểm tra khóa học tồn tại
        // Hỗ trợ tìm bằng cả MongoDB _id và course_id
        let course = null
        
        // Thử tìm bằng MongoDB _id trước (nếu là ObjectId hợp lệ)
        if (finalCourseId && /^[0-9a-fA-F]{24}$/.test(finalCourseId)) {
            try {
                const mongoose = require('mongoose')
                course = await Course.findById(finalCourseId)
                if (course) {
                    console.log(`✅ Course found by MongoDB _id: ${finalCourseId}`)
                }
            } catch (error) {
                console.log(`⚠️ Error finding by _id: ${error.message}`)
            }
        }
        
        // Nếu không tìm thấy, thử tìm bằng course_id
        if (!course) {
            course = await Course.findOne({ course_id: finalCourseId })
            if (course) {
                console.log(`✅ Course found by course_id: ${finalCourseId}`)
            }
        }
        
        // Nếu vẫn không tìm thấy, thử tìm bằng _id với ObjectId constructor
        if (!course) {
            try {
                const mongoose = require('mongoose')
                if (mongoose.Types.ObjectId.isValid(finalCourseId)) {
                    course = await Course.findOne({ _id: new mongoose.Types.ObjectId(finalCourseId) })
                    if (course) {
                        console.log(`✅ Course found by ObjectId constructor: ${finalCourseId}`)
                    }
                }
            } catch (error) {
                console.log(`⚠️ Error finding by ObjectId: ${error.message}`)
            }
        }
        
        if (!course) {
            console.error(`❌ Course not found: ${finalCourseId}`)
            return res.status(404).json({
                success: false,
                message: 'Khóa học không tồn tại',
                course_id: finalCourseId,
                note: 'Đã thử tìm bằng MongoDB _id và course_id nhưng không tìm thấy'
            })
        }
        
        console.log(`✅ Course found: ${course.title} (course_id: ${course.course_id})`)

        // 2. Kiểm tra khóa học có phí không
        if (course.pricing.isFree || course.pricing.price === 0) {
            return res.status(400).json({
                success: false,
                message: 'Khóa học này miễn phí, không cần thanh toán',
                course_id: finalCourseId
            })
        }

        // 3. Kiểm tra đã đăng ký chưa
        const existingEnrollment = await Enrollment.findOne({
            user_id: finalUserId,
            course_id: finalCourseId
        })

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã đăng ký khóa học này rồi',
                enrollment_id: existingEnrollment.enrollment_id
            })
        }

        // 4. Kiểm tra có payment pending không
        const pendingPayment = await Payment.findOne({
            user_id: finalUserId,
            course_id: finalCourseId,
            status: { $in: ['pending', 'processing'] }
        })

        if (pendingPayment && pendingPayment.sepay_payment_url && 
            (!pendingPayment.expired_at || pendingPayment.expired_at > new Date())) {
            // Trả về payment URL hiện có
            return res.json({
                success: true,
                message: 'Đã có payment đang chờ thanh toán',
                data: {
                    payment_id: pendingPayment.payment_id,
                    payment_url: pendingPayment.sepay_payment_url,
                    amount: pendingPayment.amount,
                    currency: pendingPayment.currency,
                    expires_at: pendingPayment.expired_at
                }
            })
        }

        // 5. Tạo payment record
        const payment = new Payment({
            user_id: finalUserId,
            course_id: finalCourseId,
            amount: course.pricing.price,
            currency: course.pricing.currency || 'VND',
            status: 'pending',
            customer_info: {
                name: req.user?.name || req.body.customer_name || 'Khách hàng',
                email: req.user?.email || req.body.customer_email || '',
                phone: req.user?.phone || req.body.customer_phone || ''
            },
            metadata: {
                course_title: course.title,
                course_instructor: course.instructor?.name || 'Unknown'
            }
        })

        await payment.save()

        // 6. TẠO PAYMENT_URL LOCAL (KHÔNG GỌI API CỔNG THANH TOÁN)
        // Payment URL sẽ được tạo local, cổng thanh toán sẽ xử lý sau
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080'
        const paymentUrl = `${frontendUrl}/payment/process?payment_id=${payment.payment_id}&course_id=${finalCourseId}&amount=${payment.amount}`
        
        // Lưu payment_url vào database
        payment.sepay_payment_url = paymentUrl
        payment.status = 'processing'
        payment.expired_at = new Date(Date.now() + 30 * 60 * 1000) // 30 phút
        await payment.save()

        // 7. TRẢ RESPONSE NGAY LẬP TỨC (< 100ms)
        const elapsed = Date.now() - requestStartTime
        console.log(`✅ Payment created in ${elapsed}ms`)
        
        return res.json({
            success: true,
            message: 'Tạo payment link thành công',
            data: {
                payment_id: payment.payment_id,
                payment_url: paymentUrl,
                amount: payment.amount,
                currency: payment.currency,
                expires_at: payment.expired_at,
                course: {
                    course_id: course.course_id,
                    title: course.title,
                    thumbnail: course.thumbnail
                }
            }
        })

    } catch (error) {
        const elapsed = Date.now() - requestStartTime
        console.error('\n❌ ========== CREATE PAYMENT (FAST) ERROR ==========')
        console.error(`Elapsed: ${elapsed}ms`)
        console.error('Error:', error.message)
        console.error('Error stack:', error.stack)
        
        // Đảm bảo luôn trả về response
        if (!res.headersSent) {
            let statusCode = 500
            let message = 'Lỗi khi tạo payment'
            
            if (error.name === 'ValidationError') {
                statusCode = 400
                message = 'Dữ liệu không hợp lệ: ' + error.message
            } else if (error.name === 'CastError') {
                statusCode = 400
                message = 'Định dạng dữ liệu không đúng'
            }
            
            return res.status(statusCode).json({
                success: false,
                message: message,
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
                errorType: error.name,
                timestamp: new Date().toISOString()
            })
        }
    }
}

/**
 * Tạo payment request cho khóa học
 */
exports.createPayment = async (req, res) => {
    const requestStartTime = Date.now();
    
    // Set response timeout để đảm bảo không treo request
    res.setTimeout(25000, () => {
        if (!res.headersSent) {
            console.error('⏱️ [TIMEOUT] Response timeout after 25s - sending timeout response');
            try {
                res.status(504).json({
                    success: false,
                    message: 'Request timeout - server took too long to respond',
                    timestamp: new Date().toISOString()
                });
            } catch (e) {
                console.error('Failed to send timeout response:', e.message);
            }
        }
    });
    
    // Ensure response is sent even if client disconnects
    req.on('aborted', () => {
        console.warn('⚠️ Client aborted payment request');
    });
    
    req.on('close', () => {
        if (!res.headersSent) {
            console.warn('⚠️ Client closed connection before payment response');
        }
    });
    
    try {
        console.log('\n💳 ========== CREATE PAYMENT REQUEST ==========')
        console.log(`Time: ${new Date().toISOString()}`)
        console.log(`Method: ${req.method}`)
        console.log(`Path: ${req.path}`)
        console.log(`Headers:`, JSON.stringify(req.headers, null, 2))
        console.log('Request body:', JSON.stringify(req.body, null, 2))
        console.log('Request user:', req.user)
        
        // Validate request body
        if (!req.body || typeof req.body !== 'object') {
            console.error('❌ Invalid request body')
            return res.status(400).json({
                success: false,
                message: 'Request body không hợp lệ'
            })
        }
        
        // Normalize payload - hỗ trợ cả courseId/course_id và userId/user_id
        const { course_id, courseId, user_id, userId } = req.body
        const finalCourseId = course_id || courseId
        const finalUserId = user_id || userId || req.user?.id

        // Validate user_id
        if (!finalUserId) {
            console.error('❌ [CHECKPOINT 1] No user_id provided')
            console.error('   req.user:', req.user)
            console.error('   req.body.user_id:', user_id)
            console.error('   req.body.userId:', userId)
            return res.status(401).json({
                success: false,
                message: 'Người dùng chưa đăng nhập. Vui lòng cung cấp user_id trong request body.',
                required: ['course_id', 'user_id'],
                received: {
                    course_id: finalCourseId ? '✅' : '❌',
                    user_id: finalUserId ? '✅' : '❌'
                }
            })
        }

        // Validate course_id
        if (!finalCourseId) {
            console.error('❌ [CHECKPOINT 1] No course_id provided')
            return res.status(400).json({
                success: false,
                message: 'course_id là bắt buộc',
                required: ['course_id', 'user_id'],
                received: {
                    course_id: finalCourseId ? '✅' : '❌',
                    user_id: finalUserId ? '✅' : '❌'
                }
            })
        }
        
        // Validate format
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
        
        // Use normalized values
        const course_id_normalized = finalCourseId
        const user_id_normalized = finalUserId

        console.log(`💳 [CHECKPOINT 1] Creating payment for course: ${course_id_normalized}, user: ${user_id_normalized}`)

        // 1. Kiểm tra khóa học tồn tại
        console.log(`📚 [CHECKPOINT 2] Looking up course: ${course_id_normalized}`)
        const course = await Course.findOne({ course_id: course_id_normalized })
        if (!course) {
            console.error(`❌ [CHECKPOINT 2] Course not found: ${course_id_normalized}`)
            return res.status(404).json({
                success: false,
                message: 'Khóa học không tồn tại',
                course_id: course_id_normalized
            })
        }
        console.log(`✅ [CHECKPOINT 2] Course found: ${course.title}`)

        // 2. Kiểm tra khóa học có phí không
        console.log(`💰 [CHECKPOINT 3] Checking course pricing...`)
        console.log(`   isFree: ${course.pricing.isFree}, price: ${course.pricing.price}`)
        if (course.pricing.isFree || course.pricing.price === 0) {
            console.error(`❌ [CHECKPOINT 3] Course is free, no payment needed`)
            return res.status(400).json({
                success: false,
                message: 'Khóa học này miễn phí, không cần thanh toán',
                course_id: course_id
            })
        }
        console.log(`✅ [CHECKPOINT 3] Course has price: ${course.pricing.price} ${course.pricing.currency}`)

        // 3. Kiểm tra đã đăng ký chưa
        console.log(`📋 [CHECKPOINT 4] Checking existing enrollment...`)
        const existingEnrollment = await Enrollment.findOne({
            user_id: user_id_normalized,
            course_id: course_id_normalized
        })

        if (existingEnrollment) {
            console.error(`❌ [CHECKPOINT 4] User already enrolled`)
            return res.status(400).json({
                success: false,
                message: 'Bạn đã đăng ký khóa học này rồi',
                enrollment_id: existingEnrollment.enrollment_id
            })
        }
        console.log(`✅ [CHECKPOINT 4] No existing enrollment`)

        // 4. Kiểm tra có payment pending không
        console.log(`💳 [CHECKPOINT 5] Checking pending payments...`)
        const pendingPayment = await Payment.findOne({
            user_id: user_id_normalized,
            course_id: course_id_normalized,
            status: { $in: ['pending', 'processing'] }
        })

        if (pendingPayment) {
            console.log(`⚠️ [CHECKPOINT 5] Found pending payment: ${pendingPayment.payment_id}`)
            // Trả về payment URL hiện có nếu chưa hết hạn
            if (pendingPayment.sepay_payment_url && 
                (!pendingPayment.expired_at || pendingPayment.expired_at > new Date())) {
                console.log(`✅ [CHECKPOINT 5] Returning existing payment URL`)
                return res.json({
                    success: true,
                    message: 'Đã có payment đang chờ thanh toán',
                    data: {
                        payment_id: pendingPayment.payment_id,
                        payment_url: pendingPayment.sepay_payment_url,
                        amount: pendingPayment.amount,
                        currency: pendingPayment.currency,
                        expires_at: pendingPayment.expired_at
                    }
                })
            } else {
                console.log(`⚠️ [CHECKPOINT 5] Pending payment expired, creating new one`)
            }
        } else {
            console.log(`✅ [CHECKPOINT 5] No pending payment`)
        }

        // 5. Tạo payment record
        console.log(`💾 [CHECKPOINT 6] Creating payment record...`)
        let payment
        try {
            payment = new Payment({
                user_id: user_id_normalized,
                course_id: course_id_normalized,
                amount: course.pricing.price,
                currency: course.pricing.currency || 'VND',
                status: 'pending',
                customer_info: {
                    name: req.user?.name || req.body.customer_name || 'Khách hàng',
                    email: req.user?.email || req.body.customer_email || '',
                    phone: req.user?.phone || req.body.customer_phone || ''
                },
                metadata: {
                    course_title: course.title,
                    course_instructor: course.instructor?.name || 'Unknown'
                }
            })

            await payment.save()
            console.log(`✅ [CHECKPOINT 6] Payment record created: ${payment.payment_id}`)
            console.log(`   Amount: ${payment.amount} ${payment.currency}`)
            console.log(`   Status: ${payment.status}`)
        } catch (dbError) {
            console.error(`❌ [CHECKPOINT 6] Error creating payment record:`)
            console.error('   Error:', dbError)
            console.error('   Error message:', dbError.message)
            // QUAN TRỌNG: Luôn trả về response
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo payment record',
                error: process.env.NODE_ENV === 'development' ? dbError.message : undefined,
                errorType: dbError.name,
                timestamp: new Date().toISOString()
            })
        }

        // 6. Tạo SePay payment link
        const sepayStartTime = Date.now()
        let sepayResult = null
        try {
            console.log('📤 [CHECKPOINT 7] Calling SePay service to create payment...')
            console.log(`   Payment ID: ${payment.payment_id}`)
            console.log(`   Amount: ${payment.amount} ${payment.currency}`)
            console.log(`   Course: ${course.title}`)
            
            // Wrap SePay call với timeout để tránh treo
            const sepayCall = sepayService.createPayment({
                orderId: payment.payment_id,
                amount: payment.amount,
                description: `Thanh toán khóa học: ${course.title}`,
                customerName: payment.customer_info.name,
                customerEmail: payment.customer_info.email,
                customerPhone: payment.customer_info.phone,
                returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/success?payment_id=${payment.payment_id}`,
                cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/cancel?payment_id=${payment.payment_id}`,
                errorUrl: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/cancel?payment_id=${payment.payment_id}`,
                webhookUrl: process.env.SEPAY_IPN_URL || `${process.env.NGROK_URL || 'https://restrainingly-cabbagy-eliz.ngrok-free.dev'}/api/payment/sepay/ipn`
            })
            
            // Timeout wrapper - fail fast nếu SePay không phản hồi
            // Giảm xuống 10s để đảm bảo response trong 25s total
            const sepayTimeout = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('SePay service timeout after 10 seconds'))
                }, 10000) // 10 seconds max - giảm từ 15s
            })
            
            console.log('   ⏳ Waiting for SePay response (max 10s)...')
            sepayResult = await Promise.race([sepayCall, sepayTimeout])
            const sepayElapsed = Date.now() - sepayStartTime
            
            console.log(`✅ [CHECKPOINT 7] SePay service response received in ${sepayElapsed}ms`)
            console.log('   SePay result type:', sepayResult?.method || 'unknown')
            console.log('   Payment URL:', sepayResult?.paymentUrl || sepayResult?.checkoutUrl || 'N/A')
            
            // Validate sepayResult
            if (!sepayResult || (!sepayResult.paymentUrl && !sepayResult.checkoutUrl)) {
                throw new Error('SePay service returned invalid response: no payment URL')
            }

            // 8. Cập nhật payment với SePay info
            console.log(`💾 [CHECKPOINT 8] Updating payment with SePay info...`)
            payment.sepay_transaction_id = sepayResult.transactionId
            payment.sepay_order_id = sepayResult.orderId
            payment.sepay_payment_url = sepayResult.paymentUrl || sepayResult.checkoutUrl
            payment.status = 'processing'
            if (sepayResult.expiresAt) {
                payment.expired_at = sepayResult.expiresAt instanceof Date 
                    ? sepayResult.expiresAt 
                    : new Date(sepayResult.expiresAt)
            } else {
                // Default: 30 phút
                payment.expired_at = new Date(Date.now() + 30 * 60 * 1000)
            }

            await payment.save()
            console.log(`✅ [CHECKPOINT 8] Payment updated with SePay info`)
            console.log(`   Payment URL: ${payment.sepay_payment_url}`)
            console.log(`   Status: ${payment.status}`)

            // 9. Build response data
            console.log(`📦 [CHECKPOINT 9] Building response data...`)
            const responseData = {
                payment_id: payment.payment_id,
                payment_url: payment.sepay_payment_url,
                amount: payment.amount,
                currency: payment.currency,
                expires_at: payment.expired_at,
                course: {
                    course_id: course.course_id,
                    title: course.title,
                    thumbnail: course.thumbnail
                }
            }

            // Nếu sử dụng SDK, thêm checkout form fields
            if (sepayResult.method === 'sdk' && sepayResult.checkoutUrl && sepayResult.formFields) {
                responseData.checkout_url = sepayResult.checkoutUrl
                responseData.form_fields = sepayResult.formFields
                responseData.payment_method = 'sdk_form'
                console.log('   Payment method: SDK form')
            } else if (sepayResult.method === 'mock') {
                responseData.payment_method = 'mock'
                console.log('   Payment method: Mock (for testing)')
            } else {
                responseData.qr_code = sepayResult.qrCode || null
                responseData.payment_method = sepayResult.method || 'api'
                console.log(`   Payment method: ${responseData.payment_method}`)
            }

            const totalElapsed = Date.now() - requestStartTime
            console.log(`✅ [CHECKPOINT 9] Payment created successfully in ${totalElapsed}ms`)
            console.log(`   Payment URL: ${responseData.payment_url}`)
            console.log(`   Total time: ${totalElapsed}ms`)
            
            // QUAN TRỌNG: Luôn trả về response - ĐÂY LÀ ĐIỂM QUAN TRỌNG NHẤT
            if (!res.headersSent) {
                return res.json({
                    success: true,
                    message: 'Tạo payment link thành công',
                    data: responseData
                })
            } else {
                console.error('⚠️ [CHECKPOINT 9] Response headers already sent!')
                // Headers đã được sent, không thể gửi response nữa
                // Đây là trường hợp không nên xảy ra - log để debug
                return // Exit function
            }
        } catch (sepayError) {
            const sepayElapsed = Date.now() - sepayStartTime
            console.error(`❌ [CHECKPOINT 7] SePay error after ${sepayElapsed}ms:`)
            console.error('   Error:', sepayError)
            console.error('   Error message:', sepayError.message)
            console.error('   Error name:', sepayError.name)
            console.error('   Error code:', sepayError.code)
            if (sepayError.stack) {
                console.error('   Error stack:', sepayError.stack.substring(0, 500))
            }
            
            // Xóa payment record nếu tạo thất bại (chỉ nếu payment đã được tạo)
            if (payment && payment._id) {
                try {
                    console.log('   🧹 Cleaning up payment record...')
                    await Payment.findByIdAndDelete(payment._id)
                    console.log('   ✅ Payment record deleted')
                } catch (deleteError) {
                    console.error('   ❌ Error deleting payment:', deleteError.message)
                    // Không throw - tiếp tục xử lý error response
                }
            }

            // QUAN TRỌNG: Luôn trả về response, không để request treo
            // Đây là điểm quan trọng nhất - phải luôn có response
            if (!res.headersSent) {
                const errorMessage = sepayError.message?.includes('timeout') 
                    ? 'SePay service không phản hồi kịp thời. Vui lòng thử lại sau.'
                    : sepayError.message?.includes('mock') 
                        ? 'Đang sử dụng mock payment URL để test.'
                        : 'Lỗi khi tạo payment link'
                
                return res.status(500).json({
                    success: false,
                    message: errorMessage,
                    error: process.env.NODE_ENV === 'development' ? sepayError.message : undefined,
                    errorType: sepayError.name,
                    errorCode: sepayError.code,
                    timestamp: new Date().toISOString(),
                    elapsed: sepayElapsed
                })
            } else {
                console.error('   ⚠️ [CRITICAL] Response headers already sent, cannot send error response!')
                console.error('   This should never happen - check for missing return statements')
            }
        }
    } catch (error) {
        const elapsed = Date.now() - requestStartTime;
        console.error('\n❌ ========== CREATE PAYMENT ERROR ==========')
        console.error(`Time: ${new Date().toISOString()}`)
        console.error(`Elapsed: ${elapsed}ms`)
        console.error('Error:', error)
        console.error('Error message:', error.message)
        console.error('Error name:', error.name)
        console.error('Error stack:', error.stack)
        
        // Log request info for debugging
        if (req.body) {
            console.error('Request body:', JSON.stringify(req.body, null, 2))
        }
        console.error('==========================================\n')
        
        // Đảm bảo không crash server - luôn trả về response
        if (!res.headersSent) {
            // Phân loại lỗi để trả về status code phù hợp
            let statusCode = 500;
            let message = 'Lỗi khi tạo payment';
            
            if (error.name === 'ValidationError') {
                statusCode = 400;
                message = 'Dữ liệu không hợp lệ: ' + error.message;
            } else if (error.name === 'CastError') {
                statusCode = 400;
                message = 'Định dạng dữ liệu không đúng';
            } else if (error.message && error.message.includes('not found')) {
                statusCode = 404;
                message = error.message;
            }
            
            res.status(statusCode).json({
                success: false,
                message: message,
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
                errorType: error.name,
                timestamp: new Date().toISOString()
            })
        } else {
            // Nếu headers đã được gửi, chỉ log error
            console.error('⚠️ Response headers already sent, cannot send error response')
        }
    }
}

/**
 * Kiểm tra trạng thái payment
 */
exports.getPaymentStatus = async (req, res) => {
    try {
        const { payment_id } = req.params
        const user_id = req.user?.id || req.query.user_id

        if (!payment_id) {
            return res.status(400).json({
                success: false,
                message: 'payment_id là bắt buộc'
            })
        }

        const payment = await Payment.findOne({ payment_id })

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment không tồn tại'
            })
        }

        // Kiểm tra quyền truy cập
        if (user_id && payment.user_id !== user_id) {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền truy cập payment này'
            })
        }

        // Nếu payment đang processing, kiểm tra lại từ SePay
        if (payment.status === 'processing' && payment.sepay_transaction_id) {
            try {
                const sepayStatus = await sepayService.checkPaymentStatus(payment.sepay_transaction_id)
                
                // Cập nhật status nếu thay đổi
                if (sepayStatus.status === 'completed' && payment.status !== 'completed') {
                    payment.status = 'completed'
                    payment.paid_at = sepayStatus.paidAt || new Date()
                    await payment.save()

                    // Tự động tạo enrollment nếu chưa có
                    await createEnrollmentAfterPayment(payment)
                } else if (sepayStatus.status === 'failed' && payment.status !== 'failed') {
                    payment.status = 'failed'
                    await payment.save()
                }
            } catch (sepayError) {
                console.error('❌ Check SePay status error:', sepayError.message)
                // Không throw error, chỉ log
            }
        }

        return res.json({
            success: true,
            data: {
                payment_id: payment.payment_id,
                status: payment.status,
                amount: payment.amount,
                currency: payment.currency,
                course_id: payment.course_id,
                enrollment_id: payment.enrollment_id,
                paid_at: payment.paid_at,
                created_at: payment.createdAt,
                expires_at: payment.expired_at
            }
        })
    } catch (error) {
        console.error('❌ Get payment status error:', error)
        res.status(500).json({
            success: false,
            message: 'Lỗi khi kiểm tra payment status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Xử lý IPN (Instant Payment Notification) từ SePay
 * IPN là endpoint chuyên dụng để nhận thông báo thanh toán
 */
exports.handleIPN = async (req, res) => {
    const ipnStartTime = Date.now()
    
    try {
        console.log('\n📨 ========== IPN RECEIVED ==========')
        console.log('Time:', new Date().toISOString())
        console.log('Headers:', JSON.stringify(req.headers, null, 2))
        console.log('Body:', JSON.stringify(req.body, null, 2))
        
        const ipnData = req.body
        const signature = req.headers['x-sepay-signature'] || 
                        req.headers['x-signature'] || 
                        req.headers['sepay-signature'] ||
                        req.query.signature

        // 1. Validate IPN data structure
        if (!ipnData || (!ipnData.transaction_id && !ipnData.order_id)) {
            console.error('❌ Invalid IPN data: missing transaction_id or order_id')
            return res.status(400).json({
                success: false,
                message: 'Invalid IPN data'
            })
        }

        // 2. Verify IPN signature (bảo mật)
        if (signature && process.env.SEPAY_SECRET_KEY) {
            const isValid = sepayService.verifyWebhookSignature(ipnData, signature)
            if (!isValid) {
                console.error('❌ Invalid IPN signature')
                return res.status(401).json({
                    success: false,
                    message: 'Invalid signature'
                })
            }
            console.log('✅ IPN signature verified')
        } else {
            console.log('⚠️ IPN signature verification skipped (no secret key)')
        }

        // 3. Parse IPN data
        let parsedData
        try {
            parsedData = sepayService.parseWebhook(ipnData)
        } catch (parseError) {
            console.error('❌ Error parsing IPN data:', parseError)
            return res.status(400).json({
                success: false,
                message: 'Invalid IPN data format',
                error: process.env.NODE_ENV === 'development' ? parseError.message : undefined
            })
        }

        console.log('📋 Parsed IPN data:', parsedData)

        // 4. Tìm payment record (tìm bằng nhiều cách để đảm bảo tìm thấy)
        let payment = await Payment.findOne({
            $or: [
                { payment_id: parsedData.orderId },
                { sepay_transaction_id: parsedData.transactionId },
                { sepay_order_id: parsedData.orderId }
            ]
        })

        if (!payment) {
            console.error('❌ Payment not found for IPN:', {
                orderId: parsedData.orderId,
                transactionId: parsedData.transactionId
            })
            
            // Trả về 200 để SePay không retry, nhưng log error
            return res.status(200).json({
                success: false,
                message: 'Payment not found',
                note: 'IPN received but payment record not found. This may be a test IPN or payment was deleted.'
            })
        }

        console.log(`✅ Payment found: ${payment.payment_id}, current status: ${payment.status}`)

        // 5. Idempotency check - nếu đã xử lý IPN này rồi, skip
        const ipnHash = `${parsedData.transactionId}_${parsedData.status}_${parsedData.amount}`
        if (payment.sepay_callback_data && 
            payment.sepay_callback_data.ipn_hash === ipnHash &&
            payment.status === 'completed') {
            console.log('✅ IPN already processed (idempotency check)')
            return res.status(200).json({
                success: true,
                message: 'IPN already processed',
                payment_id: payment.payment_id,
                status: payment.status
            })
        }

        // 6. Validate amount (bảo mật - đảm bảo amount không bị thay đổi)
        if (Math.abs(payment.amount - parsedData.amount) > 0.01) {
            console.error('❌ Amount mismatch:', {
                payment_amount: payment.amount,
                ipn_amount: parsedData.amount
            })
            return res.status(400).json({
                success: false,
                message: 'Amount mismatch - possible fraud attempt'
            })
        }

        // 7. Cập nhật payment status
        const oldStatus = payment.status
        const statusMap = {
            'completed': 'completed',
            'success': 'completed',
            'paid': 'completed',
            'failed': 'failed',
            'fail': 'failed',
            'cancelled': 'cancelled',
            'cancel': 'cancelled',
            'pending': 'processing',
            'processing': 'processing'
        }
        
        const newStatus = statusMap[parsedData.status?.toLowerCase()] || payment.status
        
        if (newStatus !== payment.status) {
            payment.status = newStatus
            console.log(`📊 Status changed: ${oldStatus} -> ${newStatus}`)
        }
        
        // 8. Cập nhật thông tin thanh toán
        if (parsedData.status === 'completed' || parsedData.status === 'success' || parsedData.status === 'paid') {
            if (!payment.paid_at) {
                payment.paid_at = parsedData.paidAt || new Date()
            }
            if (parsedData.paymentMethod) {
                payment.payment_method = parsedData.paymentMethod
            }
        }

        // 9. Lưu IPN data để audit
        payment.sepay_callback_data = {
            ...ipnData,
            ipn_hash: ipnHash,
            received_at: new Date(),
            processed_at: new Date()
        }

        await payment.save()
        console.log(`✅ Payment ${payment.payment_id} updated: ${oldStatus} -> ${payment.status}`)

        // 10. Xử lý enrollment nếu payment completed
        if (payment.status === 'completed' && !payment.enrollment_id) {
            try {
                console.log('🎓 Creating enrollment after payment completion...')
                await createEnrollmentAfterPayment(payment)
                console.log('✅ Enrollment created successfully')
            } catch (enrollmentError) {
                console.error('❌ Error creating enrollment:', enrollmentError)
                // Không throw error - payment đã completed, enrollment có thể tạo sau
                // Log để xử lý manual nếu cần
            }
        }

        const elapsed = Date.now() - ipnStartTime
        console.log(`✅ IPN processed successfully in ${elapsed}ms`)
        console.log('==========================================\n')

        // 11. Trả về response cho SePay (QUAN TRỌNG: phải trả về 200 OK)
        return res.status(200).json({
            success: true,
            message: 'IPN processed successfully',
            payment_id: payment.payment_id,
            status: payment.status,
            enrollment_created: !!payment.enrollment_id
        })

    } catch (error) {
        const elapsed = Date.now() - ipnStartTime
        console.error('\n❌ ========== IPN PROCESSING ERROR ==========')
        console.error('Error:', error)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        console.error(`Elapsed: ${elapsed}ms`)
        console.error('==========================================\n')
        
        // QUAN TRỌNG: Vẫn trả về 200 OK để SePay không retry liên tục
        // Nhưng log error để xử lý manual
        return res.status(200).json({
            success: false,
            message: 'IPN processing error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            note: 'Error logged for manual review'
        })
    }
}

/**
 * Xử lý webhook từ SePay (alias của IPN để tương thích)
 */
exports.handleWebhook = async (req, res) => {
    // Webhook và IPN là cùng một endpoint, chỉ khác tên
    return exports.handleIPN(req, res)
}

/**
 * Helper function: Tạo enrollment sau khi payment completed
 */
async function createEnrollmentAfterPayment(payment) {
    try {
        // Kiểm tra đã có enrollment chưa
        const existingEnrollment = await Enrollment.findOne({
            user_id: payment.user_id,
            course_id: payment.course_id
        })

        if (existingEnrollment) {
            console.log(`✅ Enrollment already exists: ${existingEnrollment.enrollment_id}`)
            payment.enrollment_id = existingEnrollment.enrollment_id
            await payment.save()
            return existingEnrollment
        }

        // Tạo enrollment mới
        const enrollment = new Enrollment({
            user_id: payment.user_id,
            course_id: payment.course_id,
            status: 'active',
            progress: {
                completedLessons: [],
                completionPercentage: 0
            }
        })

        await enrollment.save()
        console.log(`✅ Enrollment created: ${enrollment.enrollment_id}`)

        // Cập nhật payment với enrollment_id
        payment.enrollment_id = enrollment.enrollment_id
        await payment.save()

        // Tăng enrolledCount của course
        await Course.updateOne(
            { course_id: payment.course_id },
            { $inc: { enrolledCount: 1 } }
        )

        return enrollment
    } catch (error) {
        console.error('❌ Create enrollment error:', error)
        throw error
    }
}

/**
 * Lấy danh sách payments của user
 */
exports.getUserPayments = async (req, res) => {
    try {
        const user_id = req.user?.id || req.query.user_id

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'Người dùng chưa đăng nhập'
            })
        }

        const payments = await Payment.find({ user_id })
            .sort({ createdAt: -1 })
            .limit(50)

        return res.json({
            success: true,
            data: payments.map(p => ({
                payment_id: p.payment_id,
                course_id: p.course_id,
                amount: p.amount,
                currency: p.currency,
                status: p.status,
                enrollment_id: p.enrollment_id,
                paid_at: p.paid_at,
                created_at: p.createdAt
            }))
        })
    } catch (error) {
        console.error('❌ Get user payments error:', error)
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách payments',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

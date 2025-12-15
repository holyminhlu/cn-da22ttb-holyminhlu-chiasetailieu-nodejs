const express = require('express');
const router = express.Router();

console.log('\n💳 Loading payment routes...');

// Import controllers
let createPayment, createPaymentFast, getPaymentStatus, handleWebhook, handleIPN, getUserPayments;

try {
    const controllers = require('../controllers/paymentController');
    createPayment = controllers.createPayment;
    createPaymentFast = controllers.createPaymentFast; // Fast endpoint - không gọi API cổng thanh toán
    getPaymentStatus = controllers.getPaymentStatus;
    handleWebhook = controllers.handleWebhook;
    handleIPN = controllers.handleIPN;
    getUserPayments = controllers.getUserPayments;
    console.log('✅ Payment controllers loaded successfully');
} catch (error) {
    console.error('❌ Error loading payment controllers:', error);
    throw error;
}

// Middleware để log route access
const logRoute = (routeName) => {
    return (req, res, next) => {
        console.log(`\n💳 Payment route: ${routeName}`);
        console.log(`Method: ${req.method}, Path: ${req.path}`);
        next();
    };
};

// Wrapper để catch errors
const asyncHandler = (fn, routeName) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.error(`❌ Error in ${routeName}:`, error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: `Lỗi xử lý payment request`,
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        }
    };
};

// Payment routes
// GET /payments - Info endpoint
router.get('/', logRoute('GET /payments'), (req, res) => {
    res.json({
        success: true,
        message: 'Payment API is running',
        endpoints: {
            createPayment: 'POST /payments/create (Fast - recommended)',
            createPaymentLegacy: 'POST /payments (Legacy - calls SePay API)',
            getUserPayments: 'GET /payments/user',
            getPaymentStatus: 'GET /payments/:payment_id/status',
            ipn: 'POST /payments/ipn',
            webhook: 'POST /payments/webhook'
        },
        timestamp: new Date().toISOString()
    });
});

// TEST ROUTE - Tối giản để test connectivity (comment out sau khi test xong)
// router.post('/test', logRoute('POST /payments/test'), (req, res) => {
//     console.log('✅ PAYMENT TEST ROUTE HIT');
//     console.log('Request body:', req.body);
//     return res.json({ 
//         success: true, 
//         message: 'Payment route connectivity test successful',
//         timestamp: new Date().toISOString()
//     });
// });

// Debug: Test endpoint để verify route hoạt động (đặt trước để test nhanh)
router.post('/create/test', (req, res) => {
    console.log('✅ PAYMENT CREATE TEST ROUTE HIT');
    console.log('Request body:', req.body);
    return res.json({ 
        success: true, 
        message: 'Payment create route is working',
        timestamp: new Date().toISOString(),
        received: {
            course_id: req.body?.course_id,
            user_id: req.body?.user_id
        }
    });
});

// Fast endpoint - Flow chuẩn: chỉ tạo payment_url local, không gọi API cổng thanh toán
router.post('/create', logRoute('POST /payments/create'), asyncHandler(createPaymentFast, 'POST /payments/create'));

// Legacy endpoint - Vẫn giữ để tương thích (có gọi SePay API)
router.post('/', logRoute('POST /payments'), asyncHandler(createPayment, 'POST /payments'));

router.get('/user', logRoute('GET /payments/user'), asyncHandler(getUserPayments, 'GET /payments/user'));
router.get('/:payment_id/status', logRoute('GET /payments/:payment_id/status'), asyncHandler(getPaymentStatus, 'GET /payments/:payment_id/status'));

// IPN endpoint - Instant Payment Notification từ SePay
router.post('/ipn', logRoute('POST /payments/ipn'), asyncHandler(handleIPN, 'POST /payments/ipn'));

// Webhook endpoint (alias của IPN để tương thích)
router.post('/webhook', logRoute('POST /payments/webhook'), asyncHandler(handleWebhook, 'POST /payments/webhook'));

module.exports = router;


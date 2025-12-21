const express = require('express');
const router = express.Router();

console.log('\n📋 Loading auth routes...');

// Import controllers với error handling
let CreateAccount, LoginAccount, getCustomerByEmail, updateCustomerInfo, checkEmailExists, verifyEmail;

try {
    const controllers = require('../controllers/authController');
    CreateAccount = controllers.CreateAccount;
    LoginAccount = controllers.LoginAccount;
    getCustomerByEmail = controllers.getCustomerByEmail;
    updateCustomerInfo = controllers.updateCustomerInfo;
    checkEmailExists = controllers.checkEmailExists;
    verifyEmail = controllers.verifyEmail;
    console.log('✅ Auth controllers loaded successfully');
} catch (error) {
    console.error('❌ Error loading controllers:', error);
    throw error;
}

// Middleware để log route access
const logRoute = (routeName) => {
    return (req, res, next) => {
        console.log(`\n🎯 Route hit: ${routeName}`);
        console.log(`Method: ${req.method}, Path: ${req.path}`);
        next();
    };
};

// Wrapper để catch errors và log
const asyncHandler = (fn, routeName) => {
    return async (req, res, next) => {
        try {
            console.log(`\n🎯 Executing: ${routeName}`);
            await fn(req, res, next);
        } catch (error) {
            console.error(`\n❌ Error in ${routeName}:`, error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: `Lỗi xử lý request tại ${routeName}`,
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        }
    };
};

// Public routes
router.post('/register', logRoute('POST /register'), asyncHandler(CreateAccount, 'POST /register'));
router.post('/createaccount', logRoute('POST /createaccount'), asyncHandler(CreateAccount, 'POST /createaccount')); // Giữ route cũ để backward compatibility
router.post('/login', logRoute('POST /login'), asyncHandler(LoginAccount, 'POST /login'));
router.post('/checkemail', logRoute('POST /checkemail'), asyncHandler(checkEmailExists, 'POST /checkemail'));
router.get('/verify', logRoute('GET /verify'), asyncHandler(verifyEmail, 'GET /verify'));

// Handle GET requests to POST-only endpoints (show error message)
router.get('/register', (req, res) => {
    res.status(405).json({
        success: false,
        message: 'Method Not Allowed. Vui lòng sử dụng POST method để đăng ký.',
        allowedMethods: ['POST'],
        example: {
            method: 'POST',
            url: 'http://localhost:3001/register',
            body: {
                fullName: 'Your Name',
                email: 'your.email@example.com',
                passWord: 'yourpassword'
            }
        }
    });
});

router.get('/login', (req, res) => {
    res.status(405).json({
        success: false,
        message: 'Method Not Allowed. Vui lòng sử dụng POST method để đăng nhập.',
        allowedMethods: ['POST'],
        example: {
            method: 'POST',
            url: 'http://localhost:3001/login',
            body: {
                email: 'your.email@example.com',
                passWord: 'yourpassword'
            }
        }
    });
});

// Protected routes (có thể thêm middleware JWT sau)
// Note: Admin routes đã được tách ra thành adminRoute.js riêng
router.get('/customer', getCustomerByEmail);
router.post('/customer/update', updateCustomerInfo);

// Upload routes - phải đặt trước các routes khác để tránh conflict
// Upload cover image route
let uploadCoverImage, uploadCoverMiddleware;
try {
    const controllers = require('../controllers/authController');
    uploadCoverImage = controllers.uploadCoverImage;
    uploadCoverMiddleware = controllers.uploadCoverMiddleware;
    console.log('✅ Upload cover controller loaded successfully');
    
    // Định nghĩa route upload cover
    router.post('/profile/cover', 
        logRoute('POST /profile/cover'), 
        uploadCoverMiddleware, 
        asyncHandler(uploadCoverImage, 'POST /profile/cover')
    );
} catch (error) {
    console.error('❌ Error loading upload cover controller:', error);
    // Định nghĩa route error handler nếu controller không load được
    router.post('/profile/cover', (req, res) => {
        res.status(500).json({
            success: false,
            message: 'Upload cover service không khả dụng. Vui lòng kiểm tra server logs.'
        });
    });
}

// Upload avatar image route
let uploadAvatarImage, uploadAvatarMiddleware;
try {
    const controllers = require('../controllers/authController');
    uploadAvatarImage = controllers.uploadAvatarImage;
    uploadAvatarMiddleware = controllers.uploadAvatarMiddleware;
    console.log('✅ Upload avatar controller loaded successfully');
    console.log('   - uploadAvatarImage:', typeof uploadAvatarImage);
    console.log('   - uploadAvatarMiddleware:', typeof uploadAvatarMiddleware);
    
    // Định nghĩa route upload avatar
    router.post('/profile/avatar', 
        logRoute('POST /profile/avatar'), 
        uploadAvatarMiddleware, 
        asyncHandler(uploadAvatarImage, 'POST /profile/avatar')
    );
    console.log('✅ Route POST /profile/avatar registered successfully');
} catch (error) {
    console.error('❌ Error loading upload avatar controller:', error);
    console.error('Error stack:', error.stack);
    // Định nghĩa route error handler nếu controller không load được
    router.post('/profile/avatar', (req, res) => {
        res.status(500).json({
            success: false,
            message: 'Upload avatar service không khả dụng. Vui lòng kiểm tra server logs.',
            error: error.message
        });
    });
}

module.exports = router;
const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Middleware để log route access
const logRoute = (routeName) => {
    return (req, res, next) => {
        console.log(`\n🎯 Admin Route hit: ${routeName}`);
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

// Tất cả admin routes đều yêu cầu:
// 1. Xác thực JWT token (authenticateToken)
// 2. Kiểm tra role = 'admin' (checkRole(['admin']))
router.use(authenticateToken);
router.use(checkRole(['admin']));

// Admin routes
router.get('/users', 
    logRoute('GET /admin/users'), 
    asyncHandler(adminController.getAllUsers, 'GET /admin/users')
);

router.get('/users/:id', 
    logRoute('GET /admin/users/:id'), 
    asyncHandler(adminController.getUserById, 'GET /admin/users/:id')
);

router.put('/users/:id', 
    logRoute('PUT /admin/users/:id'), 
    asyncHandler(adminController.updateUser, 'PUT /admin/users/:id')
);

router.delete('/users/:id', 
    logRoute('DELETE /admin/users/:id'), 
    asyncHandler(adminController.deleteUser, 'DELETE /admin/users/:id')
);

module.exports = router;


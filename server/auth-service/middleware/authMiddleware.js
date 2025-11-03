const jwt = require('jsonwebtoken');
const User = require('../models/authModel');

const JWT_SECRET = process.env.JWT_SECRET || 'eduShare_secret_key_2024';

/**
 * Middleware xác thực JWT token
 * Sử dụng: router.get('/protected-route', authenticateToken, controller)
 */
const authenticateToken = async (req, res, next) => {
    try {
        // Lấy token từ header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token. Vui lòng đăng nhập lại!'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Tìm user từ token
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Người dùng không tồn tại!'
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Tài khoản đã bị khóa!'
            });
        }

        // Gán user vào request để dùng trong controller
        req.user = {
            id: user._id,
            user_id: user.user_id,
            email: user.email,
            role: user.role,
            fullName: user.fullName
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token đã hết hạn. Vui lòng đăng nhập lại!'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ!'
            });
        }

        console.error('Lỗi xác thực token:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực!'
        });
    }
};

/**
 * Middleware kiểm tra role
 * Sử dụng: router.get('/admin-route', authenticateToken, checkRole(['admin']), controller)
 */
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Chưa xác thực!'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập!'
            });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    checkRole
};




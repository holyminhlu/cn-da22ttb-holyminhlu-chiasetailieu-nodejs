const User = require('../models/authModel');

/**
 * Get all users (Admin only)
 * GET /admin/users
 * Query params: search, page, limit
 */
exports.getAllUsers = async (req, res) => {
    try {
        const { search, page = 1, limit = 100 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Build query
        let query = {};
        if (search) {
            query = {
                $or: [
                    { email: { $regex: search, $options: 'i' } },
                    { fullName: { $regex: search, $options: 'i' } }
                ]
            };
        }
        
        // Get users (exclude password)
        const users = await User.find(query)
            .select('-passWord')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await User.countDocuments(query);
        
        res.json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi lấy danh sách người dùng'
        });
    }
};

/**
 * Get user by ID (Admin only)
 * GET /admin/users/:id
 */
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id).select('-passWord');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi lấy thông tin người dùng'
        });
    }
};

/**
 * Update user (Admin only)
 * PUT /admin/users/:id
 */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Remove password from update data if present
        delete updateData.passWord;
        
        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-passWord');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        res.json({
            success: true,
            message: 'Cập nhật người dùng thành công',
            data: user
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi cập nhật người dùng'
        });
    }
};

/**
 * Delete user (Admin only)
 * DELETE /admin/users/:id
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        res.json({
            success: true,
            message: 'Xóa người dùng thành công'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi xóa người dùng'
        });
    }
};


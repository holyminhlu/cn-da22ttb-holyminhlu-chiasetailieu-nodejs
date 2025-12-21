const express = require('express');
const router = express.Router();

// Import controllers
const {
    createPost,
    getAllPosts,
    getPostById,
    getFeaturedPosts,
    getPopularPosts,
    getRelatedPosts,
    getAllTags,
    updatePost,
    deletePost
} = require('../controllers/blogController');

// Middleware để log route access
const logRoute = (routeName) => {
    return (req, res, next) => {
        console.log(`\n🎯 Blog Route hit: ${routeName}`);
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

// Routes - Specific routes first, then parameterized routes

// GET /blogs/featured - Lấy bài viết nổi bật
router.get('/featured', logRoute('GET /blogs/featured'), asyncHandler(getFeaturedPosts, 'GET /blogs/featured'));

// GET /blogs/popular - Lấy bài viết phổ biến
router.get('/popular', logRoute('GET /blogs/popular'), asyncHandler(getPopularPosts, 'GET /blogs/popular'));

// GET /blogs/tags - Lấy tất cả tags
router.get('/tags', logRoute('GET /blogs/tags'), asyncHandler(getAllTags, 'GET /blogs/tags'));

// GET /blogs/:id/related - Lấy bài viết liên quan
router.get('/:id/related', logRoute('GET /blogs/:id/related'), asyncHandler(getRelatedPosts, 'GET /blogs/:id/related'));

// GET /blogs - Lấy danh sách bài viết (với pagination và filtering)
router.get('/', logRoute('GET /blogs'), asyncHandler(getAllPosts, 'GET /blogs'));

// GET /blogs/:id - Lấy bài viết theo ID hoặc slug
router.get('/:id', logRoute('GET /blogs/:id'), asyncHandler(getPostById, 'GET /blogs/:id'));

// POST /blogs - Tạo bài viết mới (admin only)
router.post('/', logRoute('POST /blogs'), asyncHandler(createPost, 'POST /blogs'));

// PUT /blogs/:id - Cập nhật bài viết (admin only)
router.put('/:id', logRoute('PUT /blogs/:id'), asyncHandler(updatePost, 'PUT /blogs/:id'));

// DELETE /blogs/:id - Xóa bài viết (admin only)
router.delete('/:id', logRoute('DELETE /blogs/:id'), asyncHandler(deletePost, 'DELETE /blogs/:id'));

module.exports = router;


const express = require('express');
const router = express.Router();

console.log('\n📋 Loading document routes...');

// Import controllers
let uploadDocument, searchDocuments, getAllDocuments, getDocumentById, getUserBookmarks, addBookmark, removeBookmark;

try {
    const controllers = require('../controllers/documentController');
    uploadDocument = controllers.uploadDocument;
    searchDocuments = controllers.searchDocuments;
    getAllDocuments = controllers.getAllDocuments;
    getDocumentById = controllers.getDocumentById;
    getUserBookmarks = controllers.getUserBookmarks;
    addBookmark = controllers.addBookmark;
    removeBookmark = controllers.removeBookmark;
    console.log('✅ Controllers loaded successfully');
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

// Wrapper để catch errors
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

// Routes - Order matters! Specific routes must come before parameterized routes
router.post('/upload', logRoute('POST /documents/upload'), asyncHandler(uploadDocument, 'POST /documents/upload'));
router.get('/search', logRoute('GET /documents/search'), asyncHandler(searchDocuments, 'GET /documents/search'));
router.get('/bookmarks/:userId', logRoute('GET /documents/bookmarks/:userId'), asyncHandler(getUserBookmarks, 'GET /documents/bookmarks/:userId'));
router.post('/bookmarks', logRoute('POST /documents/bookmarks'), asyncHandler(addBookmark, 'POST /documents/bookmarks'));
router.delete('/bookmarks', logRoute('DELETE /documents/bookmarks'), asyncHandler(removeBookmark, 'DELETE /documents/bookmarks'));
router.get('/', logRoute('GET /documents'), asyncHandler(getAllDocuments, 'GET /documents'));
// :id route must be last to avoid matching /upload, /search, /bookmarks, etc.
router.get('/:id', logRoute('GET /documents/:id'), asyncHandler(getDocumentById, 'GET /documents/:id'));

module.exports = router;


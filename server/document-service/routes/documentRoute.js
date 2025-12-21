const express = require('express');
const router = express.Router();

console.log('\n📋 Loading document routes...');

// Import controllers
let uploadDocument, searchDocuments, getAllDocuments, getDocumentById, getUserBookmarks, addBookmark, removeBookmark, incrementViews, incrementDownloads;

console.log('🔍 Checking route handlers...');

try {
    const controllers = require('../controllers/documentController');
    uploadDocument = controllers.uploadDocument;
    searchDocuments = controllers.searchDocuments;
    getAllDocuments = controllers.getAllDocuments;
    getDocumentById = controllers.getDocumentById;
    getUserBookmarks = controllers.getUserBookmarks;
    addBookmark = controllers.addBookmark;
    removeBookmark = controllers.removeBookmark;
    incrementViews = controllers.incrementViews;
    incrementDownloads = controllers.incrementDownloads;
    console.log('✅ Controllers loaded successfully');
    console.log('   - incrementViews:', typeof incrementViews);
    console.log('   - incrementDownloads:', typeof incrementDownloads);
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
// Supports both async and sync functions
const asyncHandler = (fn, routeName) => {
    return (req, res, next) => {
        try {
            console.log(`\n🎯 Executing: ${routeName}`);
            const result = fn(req, res, next);
            
            // If function returns a promise, handle it
            if (result && typeof result.then === 'function') {
                result.catch((error) => {
                    console.error(`\n❌ Error in ${routeName}:`, error);
                    if (!res.headersSent) {
                        res.status(500).json({
                            success: false,
                            message: `Lỗi xử lý request tại ${routeName}`,
                            error: process.env.NODE_ENV === 'development' ? error.message : undefined
                        });
                    }
                });
            }
        } catch (error) {
            // Sync errors are caught here
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
// 1. Exact paths first
router.post('/upload', logRoute('POST /documents/upload'), asyncHandler(uploadDocument, 'POST /documents/upload'));
router.get('/search', logRoute('GET /documents/search'), asyncHandler(searchDocuments, 'GET /documents/search'));
router.get('/', logRoute('GET /documents'), asyncHandler(getAllDocuments, 'GET /documents'));

// 2. Specific paths with parameters
router.get('/bookmarks/:userId', logRoute('GET /documents/bookmarks/:userId'), asyncHandler(getUserBookmarks, 'GET /documents/bookmarks/:userId'));
router.post('/bookmarks', logRoute('POST /documents/bookmarks'), asyncHandler(addBookmark, 'POST /documents/bookmarks'));
router.delete('/bookmarks', logRoute('DELETE /documents/bookmarks'), asyncHandler(removeBookmark, 'DELETE /documents/bookmarks'));

// 3. Nested routes with :id - MOST SPECIFIC FIRST
console.log('📝 Registering nested routes...');

// POST routes first (different HTTP method, won't conflict with GET /:id)
router.post('/:id/view', logRoute('POST /documents/:id/view'), asyncHandler(incrementViews, 'POST /documents/:id/view'));
console.log('   ✅ Registered: POST /:id/view');
router.post('/:id/download', logRoute('POST /documents/:id/download'), asyncHandler(incrementDownloads, 'POST /documents/:id/download'));
console.log('   ✅ Registered: POST /:id/download');

// 4. Generic :id route LAST (must be last to avoid matching specific routes above)
router.get('/:id', logRoute('GET /documents/:id'), asyncHandler(getDocumentById, 'GET /documents/:id'));
console.log('   ✅ Registered: GET /:id (generic route - must be last)');

module.exports = router;


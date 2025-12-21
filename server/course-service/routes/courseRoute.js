const express = require('express');
const router = express.Router();

console.log('\n📋 Loading course routes...');

// Import controllers
let getAllCourses, searchCourses, getCourseById, enrollCourse, getEnrollment, getMyEnrollments, createCourse, uploadCourseFilesMiddleware, updateProgress, getCourseStats;

try {
    const controllers = require('../controllers/courseController');
    getAllCourses = controllers.getAllCourses;
    searchCourses = controllers.searchCourses;
    getCourseById = controllers.getCourseById;
    enrollCourse = controllers.enrollCourse;
    getEnrollment = controllers.getEnrollment;
    getMyEnrollments = controllers.getMyEnrollments;
    createCourse = controllers.createCourse;
    uploadCourseFilesMiddleware = controllers.uploadCourseFilesMiddleware;
    updateProgress = controllers.updateProgress;
    getCourseStats = controllers.getCourseStats;
    console.log('✅ Controllers loaded successfully');
} catch (error) {
    console.error('❌ Error loading controllers:', error);
    throw error;
}

// Middleware để log route access
const logRoute = (routeName) => {
    return (req, res, next) => {
        const routeStartTime = Date.now()
        console.log(`\n🎯 Route hit: ${routeName}`);
        console.log(`Time: ${new Date().toISOString()}`);
        console.log(`Method: ${req.method}, Path: ${req.path}`);
        console.log(`Params:`, req.params);
        console.log(`Body received:`, req.body ? JSON.stringify(req.body) : 'No body');
        console.log(`Body type:`, typeof req.body);
        
        // Handle request abort
        req.on('aborted', () => {
            const elapsed = Date.now() - routeStartTime
            console.log(`⚠️ Request aborted for ${routeName} after ${elapsed}ms`);
        });
        
        req.on('close', () => {
            if (!res.headersSent) {
                const elapsed = Date.now() - routeStartTime
                console.log(`⚠️ Request closed before response for ${routeName} after ${elapsed}ms`);
            }
        });
        
        console.log(`✅ Calling next() for ${routeName}`);
        next();
    };
};

// Wrapper để catch errors
const asyncHandler = (fn, routeName) => {
    return async (req, res, next) => {
        const startTime = Date.now();
        try {
            console.log(`\n🎯 Executing: ${routeName}`);
            console.log(`Request body:`, req.body ? JSON.stringify(req.body) : 'No body');
            
            // Set timeout for response
            res.setTimeout(20000, () => {
                if (!res.headersSent) {
                    console.error(`⏱️ Response timeout for ${routeName} after 20s`);
                    res.status(504).json({
                        success: false,
                        message: 'Request timeout'
                    });
                }
            });
            
            await fn(req, res, next);
            
            const elapsed = Date.now() - startTime;
            console.log(`✅ ${routeName} completed in ${elapsed}ms`);
        } catch (error) {
            const elapsed = Date.now() - startTime;
            console.error(`\n❌ Error in ${routeName} after ${elapsed}ms:`, error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            
            // Don't send response if connection is closed or already sent
            if (error.code === 'ECONNABORTED' || error.type === 'request.aborted') {
                console.log('⚠️ Request was aborted, skipping error response');
                return;
            }
            
            if (!res.headersSent && !res.writableEnded) {
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
router.get('/stats', logRoute('GET /courses/stats'), asyncHandler(getCourseStats, 'GET /courses/stats'));
router.get('/search', logRoute('GET /courses/search'), asyncHandler(searchCourses, 'GET /courses/search'));
router.get('/my-enrollments/:userId', logRoute('GET /courses/my-enrollments/:userId'), asyncHandler(getMyEnrollments, 'GET /courses/my-enrollments/:userId'));
router.post('/', logRoute('POST /courses'), uploadCourseFilesMiddleware, asyncHandler(createCourse, 'POST /courses'));
router.get('/', logRoute('GET /courses'), asyncHandler(getAllCourses, 'GET /courses'));
// Enrollment routes must come before /:id route
router.post('/:id/enroll', logRoute('POST /courses/:id/enroll'), asyncHandler(enrollCourse, 'POST /courses/:id/enroll'));
router.get('/:id/enrollment', logRoute('GET /courses/:id/enrollment'), asyncHandler(getEnrollment, 'GET /courses/:id/enrollment'));
router.put('/:id/progress', logRoute('PUT /courses/:id/progress'), asyncHandler(updateProgress, 'PUT /courses/:id/progress'));
// :id route must be last to avoid matching /search, /enroll, etc.
router.get('/:id', logRoute('GET /courses/:id'), asyncHandler(getCourseById, 'GET /courses/:id'));

module.exports = router;


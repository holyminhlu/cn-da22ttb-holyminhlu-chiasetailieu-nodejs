const express = require('express');
const router = express.Router();

console.log('\n📋 Loading course routes...');

// Import controllers
let getAllCourses, searchCourses, getCourseById, enrollCourse, getEnrollment, getMyEnrollments, createCourse, uploadCourseFilesMiddleware;

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
router.get('/search', logRoute('GET /courses/search'), asyncHandler(searchCourses, 'GET /courses/search'));
router.get('/my-enrollments/:userId', logRoute('GET /courses/my-enrollments/:userId'), asyncHandler(getMyEnrollments, 'GET /courses/my-enrollments/:userId'));
router.post('/', logRoute('POST /courses'), uploadCourseFilesMiddleware, asyncHandler(createCourse, 'POST /courses'));
router.get('/', logRoute('GET /courses'), asyncHandler(getAllCourses, 'GET /courses'));
// Enrollment routes must come before /:id route
router.post('/:id/enroll', logRoute('POST /courses/:id/enroll'), asyncHandler(enrollCourse, 'POST /courses/:id/enroll'));
router.get('/:id/enrollment', logRoute('GET /courses/:id/enrollment'), asyncHandler(getEnrollment, 'GET /courses/:id/enrollment'));
// :id route must be last to avoid matching /search, /enroll, etc.
router.get('/:id', logRoute('GET /courses/:id'), asyncHandler(getCourseById, 'GET /courses/:id'));

module.exports = router;


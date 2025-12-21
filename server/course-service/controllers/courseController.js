const Course = require('../models/courseModel')
const Enrollment = require('../models/enrollmentModel')
const Payment = require('../models/paymentModel')
const mongoose = require('mongoose')

// User model - connect to UserCollection from auth-service
const UserSchema = new mongoose.Schema({}, { collection: 'UserCollection', strict: false })
const User = mongoose.models.UserCollection || mongoose.model('UserCollection', UserSchema)
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, '../uploads')
const thumbnailsDir = path.join(uploadsDir, 'thumbnails')
const videosDir = path.join(uploadsDir, 'videos')

;[uploadsDir, thumbnailsDir, videosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        console.log(`✅ Created directory: ${dir}`)
    }
})

// Cấu hình multer cho thumbnail
const thumbnailStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, thumbnailsDir)
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now()
        const uuid = uuidv4().replace(/-/g, '')
        const ext = path.extname(file.originalname)
        const fileName = `course_${timestamp}_${uuid}${ext}`
        cb(null, fileName)
    }
})

const thumbnailFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Thumbnail phải là file hình ảnh'), false)
    }
}

const uploadThumbnail = multer({
    storage: thumbnailStorage,
    fileFilter: thumbnailFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

// Cấu hình multer cho video
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videosDir)
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now()
        const uuid = uuidv4().replace(/-/g, '')
        const ext = path.extname(file.originalname)
        const fileName = `video_${timestamp}_${uuid}${ext}`
        cb(null, fileName)
    }
})

const videoFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true)
    } else {
        cb(new Error('Video phải là file video'), false)
    }
}

const uploadVideo = multer({
    storage: videoStorage,
    fileFilter: videoFileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB
    }
})

// Multer for multiple files (thumbnail + videos)
const uploadCourseFiles = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.fieldname === 'thumbnail') {
                cb(null, thumbnailsDir)
            } else if (file.fieldname.startsWith('video_')) {
                cb(null, videosDir)
            } else {
                cb(null, uploadsDir)
            }
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now()
            const uuid = uuidv4().replace(/-/g, '')
            const ext = path.extname(file.originalname)
            
            if (file.fieldname === 'thumbnail') {
                const fileName = `course_${timestamp}_${uuid}${ext}`
                cb(null, fileName)
            } else if (file.fieldname.startsWith('video_')) {
                const fileName = `video_${timestamp}_${uuid}${ext}`
                cb(null, fileName)
            } else {
                const fileName = `file_${timestamp}_${uuid}${ext}`
                cb(null, fileName)
            }
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'thumbnail') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true)
            } else {
                cb(new Error('Thumbnail phải là file hình ảnh'), false)
            }
        } else if (file.fieldname.startsWith('video_')) {
            if (file.mimetype.startsWith('video/')) {
                cb(null, true)
            } else {
                cb(new Error('Video phải là file video'), false)
            }
        } else {
            cb(null, true)
        }
    },
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB max per file
    }
})

/**
 * Get all courses
 * GET /courses
 */
exports.getAllCourses = async (req, res) => {
    try {
        const {
            limit = 20,
            page = 1,
            sortBy = 'newest',
            category,
            level,
            isFree,
            status = 'published',
            visibility = 'public'
        } = req.query

        console.log('\n🔍 ========== GET ALL COURSES ==========')
        console.log('Query:', req.query)

        // Build query
        const query = {
            status: status,
            visibility: visibility
        }

        // Category filter
        if (category) {
            query.category = category
        }

        // Level filter
        if (level) {
            query.level = level
        }

        // Free filter
        if (isFree !== undefined) {
            query['pricing.isFree'] = isFree === 'true'
        }

        // Build sort
        let sort = {}
        switch (sortBy) {
            case 'newest':
                sort = { createdAt: -1 }
                break
            case 'popular':
                sort = { enrolledCount: -1 }
                break
            case 'rating':
                sort = { rating: -1 }
                break
            case 'title':
                sort = { title: 1 }
                break
            default:
                sort = { createdAt: -1 }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)

        const courses = await Course.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))

        const total = await Course.countDocuments(query)

        // Format response
        const formattedCourses = courses.map(course => ({
            id: course._id.toString(), // Convert ObjectId to string for frontend
            course_id: course.course_id,
            title: course.title,
            subtitle: course.subtitle,
            description: course.description,
            thumbnail: course.thumbnail ? course.thumbnail.filePath : null,
            instructor: course.instructor,
            category: course.category,
            level: course.level,
            pricing: course.pricing,
            duration: course.duration,
            lessonsCount: course.lessonsCount,
            enrolledCount: course.enrolledCount,
            rating: course.rating,
            ratingCount: course.ratingCount,
            reviewCount: course.reviewCount,
            tags: course.tags,
            languages: course.languages,
            isBestSeller: course.isBestSeller,
            createdAt: course.createdAt
        }))

        console.log(`✅ Found ${formattedCourses.length} courses`)
        console.log('=========================================\n')

        res.json({
            success: true,
            data: formattedCourses,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                pages: Math.ceil(total / parseInt(limit))
            }
        })
    } catch (error) {
        console.error('❌ Get all courses error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi lấy danh sách khóa học.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Search courses
 * GET /courses/search
 */
exports.searchCourses = async (req, res) => {
    try {
        const {
            q,
            category,
            level,
            isFree,
            limit = 20,
            page = 1,
            sortBy = 'relevance'
        } = req.query

        console.log('\n🔍 ========== SEARCH COURSES ==========')
        console.log('Query:', req.query)

        // Build query
        const query = {
            status: 'published',
            visibility: 'public'
        }

        // Text search
        if (q && q.trim()) {
            query.$text = { $search: q.trim() }
        }

        // Category filter
        if (category) {
            query.category = category
        }

        // Level filter
        if (level) {
            query.level = level
        }

        // Free filter
        if (isFree !== undefined) {
            query['pricing.isFree'] = isFree === 'true'
        }

        // Build sort
        let sort = {}
        switch (sortBy) {
            case 'relevance':
                if (q && q.trim()) {
                    sort = { score: { $meta: 'textScore' } }
                } else {
                    sort = { createdAt: -1 }
                }
                break
            case 'newest':
                sort = { createdAt: -1 }
                break
            case 'popular':
                sort = { enrolledCount: -1 }
                break
            case 'rating':
                sort = { rating: -1 }
                break
            default:
                sort = { createdAt: -1 }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)

        // Execute query
        let courses
        if (q && q.trim() && sortBy === 'relevance') {
            courses = await Course.find(query, { score: { $meta: 'textScore' } })
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
        } else {
            courses = await Course.find(query)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
        }

        const total = await Course.countDocuments(query)

        // Format response
        const formattedCourses = courses.map(course => ({
            id: course._id.toString(), // Convert ObjectId to string for frontend
            course_id: course.course_id,
            title: course.title,
            subtitle: course.subtitle,
            description: course.description,
            thumbnail: course.thumbnail ? course.thumbnail.filePath : null,
            instructor: course.instructor,
            category: course.category,
            level: course.level,
            pricing: course.pricing,
            duration: course.duration,
            lessonsCount: course.lessonsCount,
            enrolledCount: course.enrolledCount,
            rating: course.rating,
            ratingCount: course.ratingCount,
            reviewCount: course.reviewCount,
            tags: course.tags,
            languages: course.languages,
            isBestSeller: course.isBestSeller,
            createdAt: course.createdAt
        }))

        console.log(`✅ Found ${formattedCourses.length} courses`)
        console.log('=========================================\n')

        res.json({
            success: true,
            data: formattedCourses,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                pages: Math.ceil(total / parseInt(limit))
            }
        })
    } catch (error) {
        console.error('❌ Search courses error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi tìm kiếm khóa học.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Get course by ID
 * GET /courses/:id
 */
exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params

        console.log('\n📚 ========== GET COURSE BY ID ==========')
        console.log('Course ID:', id)
        console.log('ID type:', typeof id)

        // Try to find by MongoDB ObjectId first, then by course_id
        let course = null
        
        // Check if id is a valid MongoDB ObjectId format (24 hex characters)
        if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
            try {
                course = await Course.findById(id)
                console.log('Found by MongoDB _id:', course ? 'Yes' : 'No')
            } catch (error) {
                console.log('Error finding by _id:', error.message)
            }
        }
        
        // If not found by _id, try course_id
        if (!course) {
            course = await Course.findOne({ course_id: id })
            console.log('Found by course_id:', course ? 'Yes' : 'No')
        }
        
        // Last resort: try _id as string
        if (!course && mongoose.Types.ObjectId.isValid(id)) {
            try {
                course = await Course.findOne({ _id: new mongoose.Types.ObjectId(id) })
                console.log('Found by ObjectId constructor:', course ? 'Yes' : 'No')
            } catch (error) {
                console.log('Error finding by ObjectId:', error.message)
            }
        }

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy khóa học'
            })
        }

        // Increment views or enrolledCount if needed
        // For now, just return the course

        console.log('✅ Course found:', course.title)
        console.log('Course _id:', course._id)
        console.log('Course course_id:', course.course_id)
        console.log('=========================================\n')

        res.json({
            success: true,
            data: {
                id: course._id.toString(), // Convert ObjectId to string
                course_id: course.course_id,
                title: course.title,
                subtitle: course.subtitle,
                description: course.description,
                thumbnail: course.thumbnail ? course.thumbnail.filePath : null,
                instructor: course.instructor,
                category: course.category,
                level: course.level,
                modules: course.modules,
                pricing: course.pricing,
                duration: course.duration,
                lessonsCount: course.lessonsCount,
                enrolledCount: course.enrolledCount,
                rating: course.rating,
                ratingCount: course.ratingCount,
                reviewCount: course.reviewCount,
                tags: course.tags,
                languages: course.languages,
                whatYouWillLearn: course.whatYouWillLearn,
                requirements: course.requirements,
                targetAudience: course.targetAudience,
                isBestSeller: course.isBestSeller,
                status: course.status,
                visibility: course.visibility,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt
            }
        })
    } catch (error) {
        console.error('❌ Get course by ID error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi lấy thông tin khóa học.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Enroll in a course
 * POST /courses/:id/enroll
 */
exports.enrollCourse = async (req, res) => {
    try {
        const { id } = req.params
        const { user_id } = req.body

        console.log('\n📝 ========== ENROLL COURSE ==========')
        console.log('Course ID:', id)
        console.log('User ID:', user_id)

        // Validation
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu user_id'
            })
        }

        // Find course
        let course = await Course.findOne({
            $or: [
                { _id: id },
                { course_id: id }
            ]
        })

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy khóa học'
            })
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            user_id: user_id,
            course_id: course.course_id
        })

        if (existingEnrollment) {
            return res.json({
                success: true,
                message: 'Bạn đã đăng ký khóa học này rồi',
                data: {
                    enrollment_id: existingEnrollment.enrollment_id,
                    course_id: course.course_id,
                    enrolledAt: existingEnrollment.enrolledAt,
                    progress: existingEnrollment.progress
                },
                alreadyEnrolled: true
            })
        }

        // Check if course requires payment
        if (!course.pricing.isFree && course.pricing.price > 0) {
            // Check if user has completed payment for this course
            const completedPayment = await Payment.findOne({
                user_id: user_id,
                course_id: course.course_id,
                status: 'completed'
            })

            if (!completedPayment) {
                // Check if there's a pending payment
                const pendingPayment = await Payment.findOne({
                    user_id: user_id,
                    course_id: course.course_id,
                    status: { $in: ['pending', 'processing'] }
                })

                if (pendingPayment) {
                    return res.status(402).json({
                        success: false,
                        message: 'Vui lòng hoàn tất thanh toán để đăng ký khóa học',
                        requiresPayment: true,
                        payment_id: pendingPayment.payment_id,
                        payment_url: pendingPayment.sepay_payment_url,
                        va_info: pendingPayment.va_info
                    })
                }

                // No payment found, need to create payment
                return res.status(402).json({
                    success: false,
                    message: 'Khóa học này yêu cầu thanh toán. Vui lòng thanh toán trước khi đăng ký.',
                    requiresPayment: true,
                    course_id: course.course_id,
                    amount: course.pricing.price,
                    currency: course.pricing.currency
                })
            }
        }

        // Create enrollment
        const enrollment = new Enrollment({
            user_id: user_id,
            course_id: course.course_id,
            progress: {
                completedLessons: [],
                completionPercentage: 0
            },
            status: 'active'
        })

        await enrollment.save()

        // Update course enrolledCount
        course.enrolledCount = (course.enrolledCount || 0) + 1
        await course.save()

        console.log('✅ Enrollment created successfully')
        console.log('=========================================\n')

        res.status(201).json({
            success: true,
            message: 'Đăng ký khóa học thành công!',
            data: {
                enrollment_id: enrollment.enrollment_id,
                course_id: course.course_id,
                course_title: course.title,
                enrolledAt: enrollment.enrolledAt,
                progress: enrollment.progress
            }
        })
    } catch (error) {
        console.error('❌ Enroll course error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi đăng ký khóa học.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Get my enrolled courses
 * GET /courses/my-enrollments/:userId
 */
exports.getMyEnrollments = async (req, res) => {
    try {
        const { userId } = req.params

        console.log('\n📚 ========== GET MY ENROLLMENTS ==========')
        console.log('User ID:', userId)

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu user_id'
            })
        }

        // Find all enrollments for this user
        const enrollments = await Enrollment.find({ user_id: userId })
            .sort({ enrolledAt: -1 })

        console.log(`Found ${enrollments.length} enrollments`)

        // Get course details for each enrollment
        const enrollmentsWithCourses = await Promise.all(
            enrollments.map(async (enrollment) => {
                // Hỗ trợ cả trường hợp course_id lưu theo business course_id hoặc MongoDB _id
                let course = await Course.findOne({ course_id: enrollment.course_id })

                if (!course && typeof enrollment.course_id === 'string' && /^[0-9a-fA-F]{24}$/.test(enrollment.course_id)) {
                    try {
                        course = await Course.findById(enrollment.course_id)
                    } catch (e) {
                        console.log(`⚠️ Error finding course by _id (${enrollment.course_id}):`, e.message)
                    }
                }

                if (!course) {
                    console.log(`⚠️ Course not found for enrollment: ${enrollment.course_id}`)
                    return null
                }

                return {
                    enrollment_id: enrollment.enrollment_id,
                    course_id: enrollment.course_id,
                    enrolledAt: enrollment.enrolledAt,
                    progress: enrollment.progress,
                    status: enrollment.status,
                    course: {
                        id: course._id.toString(),
                        course_id: course.course_id,
                        title: course.title,
                        subtitle: course.subtitle,
                        description: course.description,
                        thumbnail: course.thumbnail ? course.thumbnail.filePath : null,
                        category: course.category,
                        level: course.level,
                        instructor: course.instructor,
                        duration: course.duration,
                        lessonsCount: course.lessonsCount,
                        pricing: course.pricing
                    }
                }
            })
        )

        // Filter out null courses (if course was deleted)
        const validEnrollments = enrollmentsWithCourses.filter(e => e !== null)

        console.log(`✅ Returning ${validEnrollments.length} valid enrollments`)
        console.log('=========================================\n')

        res.json({
            success: true,
            data: validEnrollments
        })
    } catch (error) {
        console.error('❌ Get my enrollments error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi lấy danh sách khóa học đã đăng ký.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Get user enrollment status
 * GET /courses/:id/enrollment
 */
exports.getEnrollment = async (req, res) => {
    try {
        const { id } = req.params
        const { user_id } = req.query

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu user_id'
            })
        }

        // Find course
        let course = await Course.findOne({
            $or: [
                { _id: id },
                { course_id: id }
            ]
        })

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy khóa học'
            })
        }

        // Find enrollment
        const enrollment = await Enrollment.findOne({
            user_id: user_id,
            course_id: course.course_id
        })

        if (!enrollment) {
            return res.json({
                success: true,
                enrolled: false,
                data: null
            })
        }

        res.json({
            success: true,
            enrolled: true,
            data: {
                enrollment_id: enrollment.enrollment_id,
                course_id: course.course_id,
                enrolledAt: enrollment.enrolledAt,
                progress: enrollment.progress,
                status: enrollment.status
            }
        })
    } catch (error) {
        console.error('❌ Get enrollment error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi lấy thông tin đăng ký.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Update course progress
 * PUT /courses/:id/progress
 * 
 * Optimized version using findOneAndUpdate for atomic operations
 * Always returns response, never hangs
 */
exports.updateProgress = async (req, res) => {
    const startTime = Date.now()
    
    try {
        console.log('\n📊 ========== UPDATE PROGRESS ==========')
        console.log('Time:', new Date().toISOString())
        
        // Check MongoDB connection first
        const mongoose = require('mongoose')
        if (mongoose.connection.readyState !== 1) {
            console.error('❌ MongoDB not connected. State:', mongoose.connection.readyState)
            return res.status(503).json({
                success: false,
                message: 'Database connection not available. Please try again.'
            })
        }
        
        // Extract params and body
        const { id: courseId } = req.params
        const { user_id, lesson_id, module_id } = req.body

        console.log('Course ID:', courseId)
        console.log('User ID:', user_id)
        console.log('Lesson ID:', lesson_id)
        console.log('Module ID:', module_id)

        // Validation - return early if invalid
        if (!user_id || !lesson_id) {
            console.log('❌ Validation failed: missing user_id or lesson_id')
            return res.status(400).json({
                success: false,
                message: 'Thiếu user_id hoặc lesson_id'
            })
        }

        // Step 1: Find course (lean for performance)
        let course
        try {
            course = await Course.findOne({
                $or: [
                    { _id: courseId },
                    { course_id: courseId }
                ]
            })
            .lean()
            .maxTimeMS(3000) // 3s timeout
            
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy khóa học'
                })
            }
        } catch (courseError) {
            console.error('❌ Course query error:', courseError.message)
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi tìm khóa học. Vui lòng thử lại.'
            })
        }

        // Step 2: Calculate total lessons (for completion percentage)
        let totalLessons = 0
        if (course.modules && Array.isArray(course.modules)) {
            course.modules.forEach(module => {
                if (module.lessons && Array.isArray(module.lessons)) {
                    totalLessons += module.lessons.length
                }
            })
        }

        // Step 3: Find or create enrollment
        let enrollment
        try {
            enrollment = await Enrollment.findOne({
                user_id: user_id,
                course_id: course.course_id
            }).maxTimeMS(3000)

            if (!enrollment) {
                // Create new enrollment
                enrollment = new Enrollment({
                    user_id: user_id,
                    course_id: course.course_id,
                    progress: {
                        completedLessons: [],
                        completionPercentage: 0
                    },
                    status: 'active'
                })
            }

            // Step 4: Check if lesson already completed (prevent duplicates)
            const existingLessonIndex = enrollment.progress.completedLessons.findIndex(
                l => l.lesson_id === lesson_id
            )

            if (existingLessonIndex === -1) {
                // Add new completed lesson
                enrollment.progress.completedLessons.push({
                    lesson_id: lesson_id,
                    completedAt: new Date()
                })
            }

            // Update last accessed lesson
            if (module_id) {
                enrollment.progress.lastAccessedLesson = {
                    lesson_id: lesson_id,
                    module_id: module_id
                }
            } else {
                enrollment.progress.lastAccessedLesson = {
                    lesson_id: lesson_id
                }
            }

            // Calculate completion percentage
            const completedCount = enrollment.progress.completedLessons.length
            enrollment.progress.completionPercentage = totalLessons > 0
                ? Math.round((completedCount / totalLessons) * 100)
                : 0

            // Update status if completed
            if (enrollment.progress.completionPercentage >= 100 && enrollment.status === 'active') {
                enrollment.status = 'completed'
            }

            // Save to database with timeout protection
            await Promise.race([
                enrollment.save(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Save timeout')), 5000)
                )
            ])

            // Get fresh enrollment data (to ensure we have enrollment_id if it was auto-generated)
            enrollment = await Enrollment.findById(enrollment._id).lean()

        } catch (updateError) {
            console.error('❌ Enrollment update error:', updateError.message)
            if (updateError.message === 'Save timeout') {
                return res.status(504).json({
                    success: false,
                    message: 'Lưu tiến độ bị timeout. Vui lòng thử lại.'
                })
            }
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật tiến độ. Vui lòng thử lại.'
            })
        }

        // Step 5: Calculate final completion percentage
        const completedCount = enrollment.progress?.completedLessons?.length || 0
        const completionPercentage = totalLessons > 0
            ? Math.round((completedCount / totalLessons) * 100)
            : 0

        const totalTime = Date.now() - startTime
        console.log(`✅ Progress updated: ${completionPercentage}% (${completedCount}/${totalLessons} lessons)`)
        console.log(`Total time: ${totalTime}ms`)
        console.log('=========================================\n')

        // Step 6: Return success response
        return res.json({
            success: true,
            message: 'Cập nhật tiến độ thành công',
            data: {
                enrollment_id: enrollment.enrollment_id || enrollment._id,
                progress: {
                    completedLessons: enrollment.progress?.completedLessons || [],
                    completionPercentage: completionPercentage,
                    lastAccessedLesson: enrollment.progress?.lastAccessedLesson
                },
                status: enrollment.status || 'active'
            }
        })

    } catch (error) {
        const elapsed = Date.now() - startTime
        console.error('❌ Update progress error:', error)
        console.error('Error after:', elapsed, 'ms')
        console.error('Error stack:', error.stack)

        // Always return error response if headers not sent
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Đã có lỗi xảy ra khi cập nhật tiến độ.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        }
    }
}

/**
 * Create new course
 * POST /courses
 */
exports.createCourse = async (req, res) => {
    try {
        console.log('\n📝 ========== CREATE COURSE ==========')
        console.log('Request body keys:', Object.keys(req.body || {}))
        console.log('Request files:', req.files ? (Array.isArray(req.files) ? req.files.length : Object.keys(req.files).length) : 0)
        console.log('Content-Type:', req.headers['content-type'])
        console.log('Has req.file:', !!req.file)
        console.log('Has req.files:', !!req.files)
        if (req.files) {
            console.log('Files details:', req.files.map(f => ({ fieldname: f.fieldname, filename: f.filename, size: f.size })))
        }

        // Validate required fields
        const { title, description, category, level, instructorId, instructorName } = req.body

        if (!title || !description || !category || !level || !instructorId || !instructorName) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc: title, description, category, level, instructorId, instructorName'
            })
        }

        // Parse JSON fields
        let pricing = { isFree: true, price: 0, originalPrice: 0, currency: 'VND' }
        let tags = []
        let whatYouWillLearn = []
        let requirements = []
        let modules = []

        try {
            if (req.body.pricing) {
                pricing = typeof req.body.pricing === 'string' ? JSON.parse(req.body.pricing) : req.body.pricing
            }
            if (req.body.tags) {
                tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags
            }
            if (req.body.whatYouWillLearn) {
                whatYouWillLearn = typeof req.body.whatYouWillLearn === 'string' 
                    ? JSON.parse(req.body.whatYouWillLearn) 
                    : req.body.whatYouWillLearn
            }
            if (req.body.requirements) {
                requirements = typeof req.body.requirements === 'string' 
                    ? JSON.parse(req.body.requirements) 
                    : req.body.requirements
            }
            if (req.body.modules) {
                modules = typeof req.body.modules === 'string' 
                    ? JSON.parse(req.body.modules) 
                    : req.body.modules
            }
        } catch (parseError) {
            console.error('Error parsing JSON fields:', parseError)
            return res.status(400).json({
                success: false,
                message: 'Lỗi định dạng dữ liệu JSON'
            })
        }

        // Handle thumbnail upload
        let thumbnailData = null
        if (req.files) {
            const thumbnailFile = req.files.find(f => f.fieldname === 'thumbnail')
            if (thumbnailFile) {
                thumbnailData = {
                    originalName: thumbnailFile.originalname,
                    fileName: thumbnailFile.filename,
                    filePath: `/uploads/thumbnails/${thumbnailFile.filename}`,
                    fileSize: thumbnailFile.size,
                    mimeType: thumbnailFile.mimetype
                }
            }
        } else if (req.file && req.file.fieldname === 'thumbnail') {
            thumbnailData = {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                filePath: `/uploads/thumbnails/${req.file.filename}`,
                fileSize: req.file.size,
                mimeType: req.file.mimetype
            }
        }

        // Handle video files
        const videoFilesMap = {}
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach(file => {
                if (file.fieldname && file.fieldname.startsWith('video_')) {
                    const parts = file.fieldname.split('_')
                    if (parts.length >= 3) {
                        const moduleIndex = parts[1]
                        const lessonIndex = parts[2]
                        if (!videoFilesMap[moduleIndex]) {
                            videoFilesMap[moduleIndex] = {}
                        }
                        videoFilesMap[moduleIndex][lessonIndex] = {
                            fileName: file.filename,
                            filePath: `/uploads/videos/${file.filename}`,
                            originalName: file.originalname,
                            fileSize: file.size,
                            mimeType: file.mimetype
                        }
                    }
                }
            })
        }

        // Process modules and lessons
        const processedModules = modules.map((module, moduleIndex) => {
            const processedLessons = module.lessons.map((lesson, lessonIndex) => {
                const videoInfo = videoFilesMap[moduleIndex]?.[lessonIndex] || null
                return {
                    lesson_id: `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    title: lesson.title,
                    description: lesson.description || '',
                    duration: parseInt(lesson.duration) || 0,
                    content: lesson.content || '',
                    videoUrl: videoInfo ? videoInfo.filePath : '',
                    videoFileName: videoInfo ? videoInfo.fileName : '',
                    isPreview: lesson.isPreview || false,
                    order: lesson.order || (lessonIndex + 1)
                }
            })

            return {
                module_id: `module_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: module.title,
                description: module.description || '',
                lessons: processedLessons,
                order: module.order || (moduleIndex + 1)
            }
        })

        // Calculate total duration and lessons count
        const totalDurationMinutes = processedModules.reduce((sum, module) => {
            return sum + module.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0)
        }, 0)
        const totalHours = Math.ceil(totalDurationMinutes / 60)
        const totalLessons = processedModules.reduce((sum, module) => sum + module.lessons.length, 0)

        // Create course object
        const courseData = {
            title: title.trim(),
            subtitle: req.body.subtitle ? req.body.subtitle.trim() : '',
            description: description.trim(),
            thumbnail: thumbnailData,
            instructor: {
                id: instructorId,
                name: instructorName,
                avatar: '',
                bio: ''
            },
            category: category,
            level: level,
            modules: processedModules,
            pricing: pricing,
            duration: totalHours,
            lessonsCount: totalLessons,
            enrolledCount: 0,
            rating: 0,
            ratingCount: 0,
            reviewCount: 0,
            tags: tags,
            languages: ['vi'],
            whatYouWillLearn: whatYouWillLearn,
            requirements: requirements,
            targetAudience: [],
            isBestSeller: false,
            status: 'published',
            visibility: 'public'
        }

        // Create course in database
        const course = new Course(courseData)
        await course.save()

        console.log('✅ Course created successfully:', course.course_id)
        console.log('=========================================\n')

        res.status(201).json({
            success: true,
            message: 'Khóa học đã được tạo thành công!',
            data: {
                id: course._id.toString(), // Convert ObjectId to string for frontend
                course_id: course.course_id,
                title: course.title,
                thumbnail: course.thumbnail ? course.thumbnail.filePath : null
            }
        })
    } catch (error) {
        console.error('❌ Create course error:', error)
        console.error('Error stack:', error.stack)
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            code: error.code
        })
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi tạo khóa học.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            errorDetails: process.env.NODE_ENV === 'development' ? {
                name: error.name,
                stack: error.stack
            } : undefined
        })
    }
}

/**
 * Get course statistics
 * GET /courses/stats
 */
exports.getCourseStats = async (req, res) => {
    try {
        console.log('\n📊 ========== GET COURSE STATS ==========')

        // 1. Get total courses - count ALL courses in database
        const totalCourses = await Course.countDocuments({})
        console.log('📚 Total courses:', totalCourses)

        // 2. Get total students - count users with role = 'student'
        const totalStudents = await User.countDocuments({
            role: 'student'
        })
        console.log('👥 Total students:', totalStudents)

        // 3. Get total instructors - count users with role = 'instructor'
        const totalInstructors = await User.countDocuments({
            role: 'instructor'
        })
        console.log('👨‍🏫 Total instructors:', totalInstructors)

        // 4. Get total completed courses - count enrollments with status = 'completed'
        const totalCompleted = await Enrollment.countDocuments({
            status: 'completed'
        })
        console.log('✅ Total completed courses:', totalCompleted)

        console.log('📊 Final Statistics:')
        console.log('  Total courses:', totalCourses)
        console.log('  Total students:', totalStudents)
        console.log('  Total instructors:', totalInstructors)
        console.log('  Total completed:', totalCompleted)
        console.log('=========================================\n')

        res.json({
            success: true,
            data: {
                totalCourses: totalCourses || 0,
                totalStudents: totalStudents || 0,
                totalInstructors: totalInstructors || 0,
                totalCompleted: totalCompleted || 0
            }
        })
    } catch (error) {
        console.error('❌ Get course stats error:', error)
        console.error('Error stack:', error.stack)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi lấy thống kê khóa học.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

// Export multer middleware
exports.uploadThumbnailMiddleware = uploadThumbnail.single('thumbnail')
exports.uploadCourseFilesMiddleware = uploadCourseFiles.any()


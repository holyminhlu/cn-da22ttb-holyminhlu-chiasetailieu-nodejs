const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

// Helper function để generate course_id
const generateCourseId = () => {
    try {
        const courseId = `course_${uuidv4()}`
        console.log('🆔 Generated course_id:', courseId)
        return courseId
    } catch (error) {
        // Fallback nếu uuid không có
        const fallbackId = `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        console.log('🆔 Generated fallback course_id:', fallbackId)
        return fallbackId
    }
}

// Schema cho Lesson (Bài học)
const lessonSchema = new mongoose.Schema({
    lesson_id: {
        type: String,
        required: true,
        default: () => `lesson_${uuidv4()}`
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    duration: {
        type: Number, // Duration in minutes
        default: 0
    },
    videoUrl: {
        type: String,
        default: ''
    },
    content: {
        type: String, // HTML or markdown content
        default: ''
    },
    resources: [{
        title: String,
        url: String,
        type: String // 'pdf', 'video', 'link', etc.
    }],
    isPreview: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        required: true
    }
}, { _id: false })

// Schema cho Module (Module/Chương)
const moduleSchema = new mongoose.Schema({
    module_id: {
        type: String,
        required: true,
        default: () => `module_${uuidv4()}`
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    lessons: [lessonSchema],
    order: {
        type: Number,
        required: true
    }
}, { _id: false })

const courseSchema = new mongoose.Schema({
    course_id: {
        type: String,
        required: true,
        unique: true,
        default: generateCourseId
    },
    title: {
        type: String,
        required: [true, 'Tên khóa học là bắt buộc'],
        trim: true,
        maxlength: [200, 'Tên khóa học không được vượt quá 200 ký tự']
    },
    subtitle: {
        type: String,
        trim: true,
        maxlength: [300, 'Mô tả ngắn không được vượt quá 300 ký tự']
    },
    description: {
        type: String,
        required: [true, 'Mô tả là bắt buộc'],
        trim: true,
        minlength: [50, 'Mô tả phải có ít nhất 50 ký tự']
    },
    thumbnail: {
        originalName: String,
        fileName: String,
        filePath: String,
        fileSize: Number,
        mimeType: String
    },
    instructor: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: ''
        },
        bio: {
            type: String,
            default: ''
        }
    },
    category: {
        type: String,
        required: true,
        enum: ['programming', 'design', 'business', 'language', 'marketing', 'science', 'other'],
        index: true
    },
    level: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        index: true
    },
    modules: [moduleSchema],
    pricing: {
        isFree: {
            type: Boolean,
            default: false
        },
        price: {
            type: Number,
            default: 0
        },
        originalPrice: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 'VND'
        }
    },
    duration: {
        type: Number, // Total duration in hours
        default: 0
    },
    lessonsCount: {
        type: Number,
        default: 0
    },
    enrolledCount: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    languages: {
        type: [String],
        default: ['vi']
    },
    whatYouWillLearn: {
        type: [String],
        default: []
    },
    requirements: {
        type: [String],
        default: []
    },
    targetAudience: {
        type: [String],
        default: []
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published',
        index: true
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'Courses'
})

// Indexes
courseSchema.index({ course_id: 1 }, { unique: true })
courseSchema.index({ 'instructor.id': 1 })
courseSchema.index({ category: 1 })
courseSchema.index({ level: 1 })
courseSchema.index({ status: 1 })
courseSchema.index({ visibility: 1 })
courseSchema.index({ createdAt: -1 })
courseSchema.index({ enrolledCount: -1 })
courseSchema.index({ rating: -1 })
courseSchema.index({ title: 'text', description: 'text', subtitle: 'text', tags: 'text' })

// Update updatedAt before save
courseSchema.pre('save', function(next) {
    this.updatedAt = Date.now()
    next()
})

module.exports = mongoose.model('Courses', courseSchema)



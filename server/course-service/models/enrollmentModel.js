const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const enrollmentSchema = new mongoose.Schema({
    enrollment_id: {
        type: String,
        required: true,
        unique: true,
        default: () => `enrollment_${uuidv4()}`
    },
    user_id: {
        type: String,
        required: true,
        index: true
    },
    course_id: {
        type: String,
        required: true,
        index: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    progress: {
        completedLessons: [{
            lesson_id: String,
            completedAt: Date
        }],
        lastAccessedLesson: {
            lesson_id: String,
            module_id: String
        },
        completionPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    }
}, {
    timestamps: true,
    collection: 'Enrollments'
})

// Compound index to ensure one enrollment per user per course
enrollmentSchema.index({ user_id: 1, course_id: 1 }, { unique: true })
enrollmentSchema.index({ course_id: 1 })
enrollmentSchema.index({ enrolledAt: -1 })

module.exports = mongoose.model('Enrollments', enrollmentSchema)


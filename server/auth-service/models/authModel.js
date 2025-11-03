const mongoose = require('mongoose')

// Helper function để generate user_id
const generateUserId = () => {
    try {
        const { v4: uuidv4 } = require('uuid')
        const userId = `user_${uuidv4()}`
        console.log('🆔 Generated user_id:', userId)
        return userId
    } catch (error) {
        // Fallback nếu uuid không có
        const fallbackId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        console.log('🆔 Generated fallback user_id:', fallbackId)
        return fallbackId
    }
}

const accountSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        default: generateUserId
        // unique index được tạo ở dưới bằng schema.index()
    },
    fullName: {
        type: String,
        required: [true, 'Họ và tên là bắt buộc'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
        // unique index được tạo ở dưới bằng schema.index()
    },
    passWord: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student'
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', ''],
        default: ''
    },
    avatar_url: {
        type: String,
        default: '/img/default-avatar.png'
    },
    cover_url: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        maxlength: [500, 'Tiểu sử không quá 500 ký tự'],
        default: ''
    },
    university: {
        type: String,
        default: ''
    },
    major: {
        type: String,
        default: ''
    },
    uploaded_documents: {
        type: [String],
        default: []
    },
    enrolled_courses: {
        type: [String],
        default: []
    },
    saved_documents: {
        type: [String],
        default: []
    },
    contributions: {
        type: Number,
        default: 0
    },
    reputation_score: {
        type: Number,
        default: 0
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    last_login: {
        type: Date
    }
}, {
    timestamps: true,
    collection: 'UserCollection'
})

// Indexes
accountSchema.index({ email: 1 }, { unique: true })
accountSchema.index({ user_id: 1 }, { unique: true })
accountSchema.index({ role: 1 })

module.exports = mongoose.model('UserCollection', accountSchema)
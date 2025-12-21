const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

/**
 * Helper function để generate blog_post_id
 */
const generateBlogPostId = () => {
    try {
        const postId = `blog_${uuidv4()}`
        return postId
    } catch (error) {
        // Fallback nếu uuid không có
        const fallbackId = `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        return fallbackId
    }
}

/**
 * Schema cho Blog Posts Collection
 * Lưu trữ thông tin về các bài viết blog do quản trị viên đăng tải
 */
const blogPostSchema = new mongoose.Schema({
    blog_post_id: {
        type: String,
        required: true,
        unique: true,
        default: generateBlogPostId
    },
    title: {
        type: String,
        required: [true, 'Tiêu đề bài viết là bắt buộc'],
        trim: true,
        maxlength: [200, 'Tiêu đề không được vượt quá 200 ký tự']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Mô tả là bắt buộc'],
        trim: true,
        maxlength: [500, 'Mô tả không được vượt quá 500 ký tự']
    },
    content: {
        type: String,
        required: [true, 'Nội dung bài viết là bắt buộc'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Danh mục là bắt buộc'],
        enum: [
            'Tài liệu học tập',
            'Mẹo học tập',
            'Công nghệ / Lập trình',
            'Kinh nghiệm sinh viên',
            'Hướng dẫn sử dụng OLF'
        ],
        index: true
    },
    tags: {
        type: [String],
        default: [],
        index: true
    },
    author: {
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
        }
    },
    coverImage: {
        type: String,
        default: ''
    },
    readingTime: {
        type: Number,
        required: true,
        min: [1, 'Thời gian đọc phải ít nhất 1 phút']
    },
    featured: {
        type: Boolean,
        default: false,
        index: true
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published',
        index: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    publishedDate: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true,
    collection: 'BlogPosts'
})

// Indexes để tối ưu truy vấn
blogPostSchema.index({ blog_post_id: 1 }, { unique: true })
blogPostSchema.index({ slug: 1 }, { unique: true })
blogPostSchema.index({ category: 1 })
blogPostSchema.index({ status: 1 })
blogPostSchema.index({ featured: 1 })
blogPostSchema.index({ publishedDate: -1 })
blogPostSchema.index({ views: -1 })
blogPostSchema.index({ likes: -1 })
// Text search index
blogPostSchema.index({ 
    title: 'text', 
    description: 'text', 
    content: 'text',
    tags: 'text'
})

/**
 * Pre-save middleware để tự động tạo slug từ title nếu chưa có
 */
blogPostSchema.pre('save', function(next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
            .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
    }
    next()
})

module.exports = mongoose.model('BlogPost', blogPostSchema)


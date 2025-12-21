const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

// Helper function để generate document_id
const generateDocumentId = () => {
    try {
        const docId = `doc_${uuidv4()}`
        console.log('🆔 Generated document_id:', docId)
        return docId
    } catch (error) {
        // Fallback nếu uuid không có
        const fallbackId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        console.log('🆔 Generated fallback document_id:', fallbackId)
        return fallbackId
    }
}

const documentSchema = new mongoose.Schema({
    document_id: {
        type: String,
        required: true,
        unique: true,
        default: generateDocumentId
    },
    title: {
        type: String,
        required: [true, 'Tên tài liệu là bắt buộc'],
        trim: true,
        maxlength: [200, 'Tên tài liệu không được vượt quá 200 ký tự']
    },
    description: {
        type: String,
        required: [true, 'Mô tả là bắt buộc'],
        trim: true,
        minlength: [20, 'Mô tả phải có ít nhất 20 ký tự'],
        maxlength: [1000, 'Mô tả không được vượt quá 1000 ký tự']
    },
    file: {
        originalName: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        filePath: {
            type: String,
            required: true
        },
        fileSize: {
            type: Number,
            required: true
        },
        mimeType: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            enum: ['pdf', 'pptx', 'docx', 'zip'],
            required: true
        }
    },
    thumbnail: {
        originalName: String,
        fileName: String,
        filePath: String,
        fileSize: Number,
        mimeType: String
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
    uploaderId: {
        type: String,
        required: true,
        index: true
    },
    program: {
        type: String,
        default: ''
    },
    courseCode: {
        type: String,
        default: ''
    },
    year: {
        type: String,
        default: ''
    },
    tags: {
        type: [String],
        default: []
    },
    languages: {
        type: [String],
        default: ['vi']
    },
    license: {
        type: String,
        enum: ['CC-BY', 'CC-BY-NC', 'CC-BY-SA', 'All rights reserved'],
        required: true
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'class-only'],
        default: 'public'
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived', 'rejected'],
        default: 'published'
    },
    downloads: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'TaiLieu'
})

// Indexes
documentSchema.index({ document_id: 1 }, { unique: true })
documentSchema.index({ uploaderId: 1 })
documentSchema.index({ program: 1 })
documentSchema.index({ status: 1 })
documentSchema.index({ visibility: 1 })
documentSchema.index({ createdAt: -1 })
documentSchema.index({ downloads: -1 })
documentSchema.index({ 'author.name': 'text', title: 'text', description: 'text', tags: 'text' })

module.exports = mongoose.model('TaiLieu', documentSchema)


const Document = require('../models/documentModel')
const User = require('../models/userModel')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, '../uploads')
const documentsDir = path.join(uploadsDir, 'documents')
const thumbnailsDir = path.join(uploadsDir, 'thumbnails')

;[uploadsDir, documentsDir, thumbnailsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        console.log(`✅ Created directory: ${dir}`)
    }
})

// Cấu hình multer cho file tài liệu
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentsDir)
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now()
        const uuid = uuidv4().replace(/-/g, '')
        const ext = path.extname(file.originalname)
        const fileName = `${timestamp}_${uuid}${ext}`
        cb(null, fileName)
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
        const fileName = `${timestamp}_${uuid}${ext}`
        cb(null, fileName)
    }
})

// File filter cho document
const documentFileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.pptx', '.docx', '.zip']
    const ext = path.extname(file.originalname).toLowerCase()
    
    if (allowedTypes.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error(`Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`), false)
    }
}

// File filter cho thumbnail
const thumbnailFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Thumbnail phải là file hình ảnh'), false)
    }
}

// Multer middleware - sử dụng fields để upload cả file và thumbnail cùng lúc
const uploadFiles = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.fieldname === 'file') {
                cb(null, documentsDir)
            } else if (file.fieldname === 'thumbnail') {
                cb(null, thumbnailsDir)
            } else {
                cb(new Error('Invalid field name'), null)
            }
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now()
            const uuid = uuidv4().replace(/-/g, '')
            const ext = path.extname(file.originalname)
            const fileName = `${timestamp}_${uuid}${ext}`
            cb(null, fileName)
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'file') {
            const allowedTypes = ['.pdf', '.pptx', '.docx', '.zip']
            const ext = path.extname(file.originalname).toLowerCase()
            if (allowedTypes.includes(ext)) {
                cb(null, true)
            } else {
                cb(new Error(`Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`), false)
            }
        } else if (file.fieldname === 'thumbnail') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true)
            } else {
                cb(new Error('Thumbnail phải là file hình ảnh'), false)
            }
        } else {
            cb(new Error('Invalid field name'), false)
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB cho cả file và thumbnail
    }
}).fields([
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
])

/**
 * Upload document
 * POST /documents/upload
 */
exports.uploadDocument = async (req, res) => {
    console.log('\n🔵 ========== UPLOAD DOCUMENT CALLED ==========')
    console.log('Request received at:', new Date().toISOString())
    console.log('Request headers:', {
        'content-type': req.headers['content-type'],
        'content-length': req.headers['content-length']
    })

    try {
        // Upload files
        uploadFiles(req, res, async (err) => {
            if (err) {
                console.error('❌ Multer error:', err)
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({
                            success: false,
                            message: 'File quá lớn. Kích thước tối đa là 50MB.'
                        })
                    }
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    })
                }
                return res.status(400).json({
                    success: false,
                    message: err.message || 'Lỗi upload file'
                })
            }

            if (!req.files || !req.files.file || !req.files.file[0]) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng chọn file tài liệu để upload'
                })
            }

            try {
                    // Parse form data
                    const {
                        title,
                        description,
                        uploaderId,
                        author,
                        program,
                        courseCode,
                        tags,
                        languages,
                        year,
                        license,
                        visibility,
                        status
                    } = req.body

                    console.log('📋 Form data:', {
                        title,
                        description: description?.substring(0, 50) + '...',
                        uploaderId,
                        program,
                        courseCode,
                        license,
                        visibility,
                        status
                    })

                    // Validation
                    if (!title || !description || !uploaderId || !license) {
                        // Xóa files nếu có
                        if (req.files?.file && req.files.file[0]) {
                            try {
                                fs.unlinkSync(req.files.file[0].path)
                            } catch (e) {}
                        }
                        if (req.files?.thumbnail && req.files.thumbnail[0]) {
                            try {
                                fs.unlinkSync(req.files.thumbnail[0].path)
                            } catch (e) {}
                        }
                        
                        return res.status(400).json({
                            success: false,
                            message: 'Vui lòng điền đầy đủ thông tin: Tên tài liệu, Mô tả, Uploader ID, License'
                        })
                    }

                    if (description.length < 20) {
                        // Xóa files nếu có
                        if (req.files?.file && req.files.file[0]) {
                            try {
                                fs.unlinkSync(req.files.file[0].path)
                            } catch (e) {}
                        }
                        if (req.files?.thumbnail && req.files.thumbnail[0]) {
                            try {
                                fs.unlinkSync(req.files.thumbnail[0].path)
                            } catch (e) {}
                        }
                        
                        return res.status(400).json({
                            success: false,
                            message: 'Mô tả phải có ít nhất 20 ký tự'
                        })
                    }

                    // Parse author JSON nếu có
                    let authorObj = {
                        id: uploaderId,
                        name: 'Người dùng',
                        avatar: ''
                    }
                    if (author) {
                        try {
                            authorObj = JSON.parse(author)
                        } catch (e) {
                            console.warn('⚠️ Could not parse author JSON, using default')
                        }
                    }

                    // Parse tags JSON nếu có
                    let tagsArray = []
                    if (tags) {
                        try {
                            tagsArray = JSON.parse(tags)
                        } catch (e) {
                            // Nếu không phải JSON, coi như là string đơn giản
                            tagsArray = [tags]
                        }
                    }

                    // Parse languages JSON nếu có
                    let languagesArray = ['vi']
                    if (languages) {
                        try {
                            languagesArray = JSON.parse(languages)
                        } catch (e) {
                            languagesArray = [languages]
                        }
                    }

                    const file = req.files.file[0]
                    const thumbnail = req.files.thumbnail && req.files.thumbnail[0] ? req.files.thumbnail[0] : null

                    // Xác định file type
                    const fileExt = path.extname(file.originalname).toLowerCase().substring(1)
                    const fileTypeMap = {
                        'pdf': 'pdf',
                        'pptx': 'pptx',
                        'docx': 'docx',
                        'zip': 'zip'
                    }
                    const fileType = fileTypeMap[fileExt] || 'pdf'

                    // Tạo document object
                    const documentData = {
                        title: title.trim(),
                        description: description.trim(),
                        file: {
                            originalName: file.originalname,
                            fileName: file.filename,
                            filePath: `/uploads/documents/${file.filename}`,
                            fileSize: file.size,
                            mimeType: file.mimetype,
                            fileType: fileType
                        },
                        author: authorObj,
                        uploaderId: uploaderId,
                        license: license,
                        visibility: visibility || 'public',
                        status: status || 'published',
                        tags: tagsArray,
                        languages: languagesArray
                    }

                    // Thêm thumbnail nếu có
                    if (thumbnail) {
                        documentData.thumbnail = {
                            originalName: thumbnail.originalname,
                            fileName: thumbnail.filename,
                            filePath: `/uploads/thumbnails/${thumbnail.filename}`,
                            fileSize: thumbnail.size,
                            mimeType: thumbnail.mimetype
                        }
                    }

                    // Thêm các field optional
                    if (program) documentData.program = program
                    if (courseCode) documentData.courseCode = courseCode
                    if (year) documentData.year = year

                    console.log('💾 Saving document to database...')

                    // Lưu vào database
                    const newDocument = new Document(documentData)
                    await newDocument.save()

                    console.log('✅ Document saved successfully:', {
                        id: newDocument._id,
                        document_id: newDocument.document_id,
                        title: newDocument.title
                    })

                    // Trả về response
                    res.status(201).json({
                        success: true,
                        message: 'Tải lên tài liệu thành công!',
                        data: {
                            id: newDocument._id,
                            document_id: newDocument.document_id,
                            title: newDocument.title,
                            description: newDocument.description,
                            file: {
                                originalName: newDocument.file.originalName,
                                fileType: newDocument.file.fileType.toUpperCase(),
                                fileSize: newDocument.file.fileSize,
                                fileUrl: newDocument.file.filePath
                            },
                            thumbnail: newDocument.thumbnail ? {
                                fileName: newDocument.thumbnail.fileName,
                                fileUrl: newDocument.thumbnail.filePath
                            } : null,
                            author: newDocument.author,
                            uploadDate: newDocument.uploadDate
                        }
                    })

                    console.log('🔵 ========================================\n')

                } catch (error) {
                    console.error('\n❌ ========== LỖI UPLOAD ==========')
                    console.error('Error name:', error.name)
                    console.error('Error message:', error.message)
                    console.error('Error stack:', error.stack)
                    console.error('=====================================\n')

                    // Xóa files nếu có
                    if (req.files) {
                        try {
                            if (req.files.file && req.files.file[0]) {
                                fs.unlinkSync(req.files.file[0].path)
                            }
                            if (req.files.thumbnail && req.files.thumbnail[0]) {
                                fs.unlinkSync(req.files.thumbnail[0].path)
                            }
                        } catch (e) {
                            console.error('Failed to delete files:', e)
                        }
                    }

                    if (error.name === 'ValidationError') {
                        const messages = Object.values(error.errors).map(err => err.message)
                        return res.status(400).json({
                            success: false,
                            message: messages.join(', ')
                        })
                    }

                    res.status(500).json({
                        success: false,
                        message: 'Đã có lỗi xảy ra khi upload tài liệu. Vui lòng thử lại sau!',
                        error: process.env.NODE_ENV === 'development' ? error.message : undefined
                    })
                }
            })
    } catch (error) {
        console.error('\n❌ ========== UNHANDLED ERROR ==========')
        console.error('Error:', error)
        console.error('======================================\n')

        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi upload tài liệu.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Search documents
 * GET /documents/search
 */
exports.searchDocuments = async (req, res) => {
    try {
        const {
            q, // search query
            program,
            tags,
            year,
            fileType,
            language,
            visibility,
            status,
            uploaderId, // Filter by uploader
            limit = 20,
            page = 1,
            sortBy = 'relevance'
        } = req.query

        console.log('\n🔍 ========== SEARCH DOCUMENTS ==========')
        console.log('Query:', req.query)

        // Build query
        const query = {}

        // Status filter - chỉ lấy published documents
        query.status = status || 'published'

        // Visibility filter
        if (visibility) {
            query.visibility = visibility
        } else if (!uploaderId) {
            // Mặc định chỉ lấy public documents (trừ khi filter theo uploader)
            query.visibility = 'public'
        }

        // Uploader filter - if filtering by uploader, show all visibility levels
        if (uploaderId) {
            query.uploaderId = uploaderId
        }

        // Text search
        if (q && q.trim()) {
            query.$text = { $search: q.trim() }
        }

        // Program filter
        if (program) {
            query.program = program
        }

        // Year filter
        if (year) {
            query.year = year
        }

        // File type filter
        if (fileType) {
            query['file.fileType'] = fileType.toLowerCase()
        }

        // Language filter
        if (language) {
            query.languages = { $in: [language] }
        }

        // Tags filter
        if (tags) {
            const tagsArray = Array.isArray(tags) ? tags : tags.split(',')
            query.tags = { $in: tagsArray.map(t => t.trim()) }
        }

        console.log('MongoDB Query:', JSON.stringify(query, null, 2))

        // Build sort
        let sort = {}
        switch (sortBy) {
            case 'newest':
                sort = { createdAt: -1 }
                break
            case 'downloads':
                sort = { downloads: -1 }
                break
            case 'relevance':
            default:
                if (q && q.trim()) {
                    sort = { score: { $meta: 'textScore' } }
                } else {
                    sort = { createdAt: -1 }
                }
                break
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit)

        // Execute query
        let documents
        if (q && q.trim() && sortBy === 'relevance') {
            documents = await Document.find(query, { score: { $meta: 'textScore' } })
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
        } else {
            documents = await Document.find(query)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
        }

        // Get total count
        const total = await Document.countDocuments(query)

        // Format response
        const formattedDocs = documents.map(doc => {
            // Safe handling for fileType
            let fileType = 'PDF'
            if (doc.file && doc.file.fileType) {
                fileType = doc.file.fileType
            } else if (doc.file && doc.file.fileName) {
                // Try to infer from filename extension
                const ext = path.extname(doc.file.fileName).toLowerCase().substring(1)
                const fileTypeMap = {
                    'pdf': 'PDF',
                    'pptx': 'PPTX',
                    'docx': 'DOCX',
                    'zip': 'ZIP'
                }
                fileType = fileTypeMap[ext] || 'PDF'
            }
            
            return {
                id: doc._id,
                document_id: doc.document_id,
                title: doc.title,
                description: doc.description,
                thumbnail: doc.thumbnail ? doc.thumbnail.filePath : null,
                file: doc.file ? {
                    originalName: doc.file.originalName || 'Unknown',
                    fileType: fileType.toUpperCase(),
                    fileSize: doc.file.fileSize || 0,
                    fileUrl: doc.file.filePath || ''
                } : {
                    originalName: 'Unknown',
                    fileType: 'PDF',
                    fileSize: 0,
                    fileUrl: ''
                },
                author: doc.author || { id: '', name: 'Unknown', avatar: '' },
                program: doc.program || '',
                courseCode: doc.courseCode || '',
                year: doc.year || '',
                tags: doc.tags || [],
                languages: doc.languages || ['vi'],
                license: doc.license || '',
                downloads: doc.downloads || 0,
                views: doc.views || 0,
                uploadDate: doc.uploadDate || doc.createdAt
            }
        })

        console.log(`✅ Found ${formattedDocs.length} documents`)
        console.log('=========================================\n')

        res.json({
            success: true,
            data: formattedDocs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                pages: Math.ceil(total / parseInt(limit))
            }
        })
    } catch (error) {
        console.error('❌ Search error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi tìm kiếm tài liệu.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Get all documents
 * GET /documents
 */
exports.getAllDocuments = async (req, res) => {
    try {
        const {
            limit = 20,
            page = 1,
            sortBy = 'newest'
        } = req.query

        const query = {
            status: 'published',
            visibility: 'public'
        }

        // Build sort
        let sort = {}
        switch (sortBy) {
            case 'newest':
                sort = { createdAt: -1 }
                break
            case 'downloads':
                sort = { downloads: -1 }
                break
            default:
                sort = { createdAt: -1 }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)

        const documents = await Document.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))

        const total = await Document.countDocuments(query)

        const formattedDocs = documents.map(doc => {
            // Safe handling for fileType
            let fileType = 'PDF'
            if (doc.file && doc.file.fileType) {
                fileType = doc.file.fileType
            } else if (doc.file && doc.file.fileName) {
                // Try to infer from filename extension
                const ext = path.extname(doc.file.fileName).toLowerCase().substring(1)
                const fileTypeMap = {
                    'pdf': 'PDF',
                    'pptx': 'PPTX',
                    'docx': 'DOCX',
                    'zip': 'ZIP'
                }
                fileType = fileTypeMap[ext] || 'PDF'
            }
            
            return {
                id: doc._id,
                document_id: doc.document_id,
                title: doc.title,
                description: doc.description,
                thumbnail: doc.thumbnail ? doc.thumbnail.filePath : null,
                file: doc.file ? {
                    originalName: doc.file.originalName || 'Unknown',
                    fileType: fileType.toUpperCase(),
                    fileSize: doc.file.fileSize || 0,
                    fileUrl: doc.file.filePath || ''
                } : {
                    originalName: 'Unknown',
                    fileType: 'PDF',
                    fileSize: 0,
                    fileUrl: ''
                },
                author: doc.author || { id: '', name: 'Unknown', avatar: '' },
                program: doc.program || '',
                courseCode: doc.courseCode || '',
                year: doc.year || '',
                tags: doc.tags || [],
                languages: doc.languages || ['vi'],
                license: doc.license || '',
                downloads: doc.downloads || 0,
                views: doc.views || 0,
                uploadDate: doc.uploadDate || doc.createdAt
            }
        })

        res.json({
            success: true,
            data: formattedDocs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                pages: Math.ceil(total / parseInt(limit))
            }
        })
    } catch (error) {
        console.error('❌ Get all documents error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi lấy danh sách tài liệu.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Get document by ID
 * GET /documents/:id
 */
exports.getDocumentById = async (req, res) => {
    try {
        const { id } = req.params

        // Prevent route matching with reserved paths
        if (id === 'upload' || id === 'search') {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài liệu'
            })
        }

        let document = await Document.findOne({
            $or: [
                { _id: id },
                { document_id: id }
            ]
        })

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài liệu'
            })
        }

        // Note: Views should be incremented via POST /documents/:id/view endpoint
        // This GET endpoint only returns document data without incrementing views

        // Safe handling for fileType
        let fileType = 'PDF'
        if (document.file && document.file.fileType) {
            fileType = document.file.fileType
        } else if (document.file && document.file.fileName) {
            // Try to infer from filename extension
            const ext = path.extname(document.file.fileName).toLowerCase().substring(1)
            const fileTypeMap = {
                'pdf': 'PDF',
                'pptx': 'PPTX',
                'docx': 'DOCX',
                'zip': 'ZIP'
            }
            fileType = fileTypeMap[ext] || 'PDF'
        }

        res.json({
            success: true,
            data: {
                id: document._id,
                document_id: document.document_id,
                title: document.title,
                description: document.description,
                thumbnail: document.thumbnail ? document.thumbnail.filePath : null,
                file: document.file ? {
                    originalName: document.file.originalName || 'Unknown',
                    fileType: fileType.toUpperCase(),
                    fileSize: document.file.fileSize || 0,
                    fileUrl: document.file.filePath || ''
                } : {
                    originalName: 'Unknown',
                    fileType: 'PDF',
                    fileSize: 0,
                    fileUrl: ''
                },
                author: document.author,
                program: document.program,
                courseCode: document.courseCode,
                year: document.year,
                tags: document.tags,
                languages: document.languages,
                license: document.license,
                visibility: document.visibility,
                downloads: document.downloads,
                views: document.views,
                uploadDate: document.uploadDate || document.createdAt,
                createdAt: document.createdAt,
                updatedAt: document.updatedAt
            }
        })
    } catch (error) {
        console.error('❌ Get document by ID error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi lấy thông tin tài liệu.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Get user bookmarks
 * GET /documents/bookmarks/:userId
 */
exports.getUserBookmarks = async (req, res) => {
    try {
        const { userId } = req.params
        const { page = 1, limit = 20 } = req.query

        console.log('\n🔖 ========== GET USER BOOKMARKS ==========')
        console.log('User ID:', userId)

        // Get user's saved document IDs - try both _id and user_id
        // First try _id (MongoDB ObjectId) if userId looks like ObjectId
        let user = null
        if (/^[0-9a-fA-F]{24}$/.test(userId)) {
            // Try _id first if it's a valid ObjectId
            user = await User.findById(userId).select('saved_documents user_id _id')
        }
        
        // If not found, try user_id (string field)
        if (!user) {
            user = await User.findOne({ user_id: userId }).select('saved_documents user_id _id')
        }
        
        // If still not found, try _id conversion
        if (!user && /^[0-9a-fA-F]{24}$/.test(userId)) {
            try {
                const mongoose = require('mongoose')
                const objectId = new mongoose.Types.ObjectId(userId)
                user = await User.findById(objectId).select('saved_documents user_id _id')
            } catch (e) {
                // Ignore error
            }
        }
        
        if (!user) {
            console.log('❌ User not found with userId:', userId)
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại'
            })
        }

        console.log('👤 User found:', {
            _id: user._id,
            user_id: user.user_id,
            saved_documents_exists: user.saved_documents !== undefined,
            saved_documents_type: Array.isArray(user.saved_documents) ? 'array' : typeof user.saved_documents,
            saved_documents_value: user.saved_documents,
            saved_documents_raw: JSON.stringify(user.saved_documents)
        })

        const savedDocIds = user.saved_documents || []
        console.log('📋 Saved document IDs:', savedDocIds)
        console.log('📋 Saved document IDs count:', savedDocIds.length)
        console.log('📋 Saved document IDs type:', typeof savedDocIds)
        console.log('📋 Is array:', Array.isArray(savedDocIds))

        if (savedDocIds.length === 0) {
            console.log('No bookmarks found')
            return res.json({
                success: true,
                data: [],
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: 0,
                    pages: 0
                }
            })
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit)

        // Get documents with pagination
        const documents = await Document.find({
            document_id: { $in: savedDocIds }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))

        const total = await Document.countDocuments({
            document_id: { $in: savedDocIds }
        })

        // Format response
        const formattedDocs = documents.map(doc => {
            let fileType = 'PDF'
            if (doc.file && doc.file.fileType) {
                fileType = doc.file.fileType
            } else if (doc.file && doc.file.fileName) {
                const ext = path.extname(doc.file.fileName).toLowerCase().substring(1)
                const fileTypeMap = {
                    'pdf': 'PDF',
                    'pptx': 'PPTX',
                    'docx': 'DOCX',
                    'zip': 'ZIP'
                }
                fileType = fileTypeMap[ext] || 'PDF'
            }
            
            return {
                id: doc._id,
                document_id: doc.document_id,
                title: doc.title,
                description: doc.description,
                thumbnail: doc.thumbnail ? doc.thumbnail.filePath : null,
                file: doc.file ? {
                    originalName: doc.file.originalName || 'Unknown',
                    fileType: fileType.toUpperCase(),
                    fileSize: doc.file.fileSize || 0,
                    fileUrl: doc.file.filePath || ''
                } : {
                    originalName: 'Unknown',
                    fileType: 'PDF',
                    fileSize: 0,
                    fileUrl: ''
                },
                author: doc.author || { id: '', name: 'Unknown', avatar: '' },
                program: doc.program || '',
                courseCode: doc.courseCode || '',
                year: doc.year || '',
                tags: doc.tags || [],
                languages: doc.languages || ['vi'],
                license: doc.license || '',
                downloads: doc.downloads || 0,
                views: doc.views || 0,
                uploadDate: doc.uploadDate || doc.createdAt
            }
        })

        console.log(`✅ Found ${formattedDocs.length} bookmarks`)
        console.log('=========================================\n')

        res.json({
            success: true,
            data: formattedDocs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                pages: Math.ceil(total / parseInt(limit))
            }
        })
    } catch (error) {
        console.error('❌ Get bookmarks error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi lấy danh sách đã lưu.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Add bookmark
 * POST /documents/bookmarks
 */
exports.addBookmark = async (req, res) => {
    console.log('\n➕ ========== ADD BOOKMARK START ==========')
    console.log('Request body:', req.body)
    console.log('Request headers:', req.headers)
    
    try {
        const { userId, documentId } = req.body

        console.log('\n➕ ========== ADD BOOKMARK ==========')
        console.log('User ID:', userId)
        console.log('Document ID:', documentId)

        // Validation
        if (!userId || !documentId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu userId hoặc documentId'
            })
        }

        // Check if document exists - try document_id first
        // NEVER use findById for document_id (doc_xxx format) - it will cause CastError
        let document = await Document.findOne({ document_id: documentId })
        
        // Only try _id if documentId looks like MongoDB ObjectId (24 hex chars)
        // AND document_id search failed
        if (!document && /^[0-9a-fA-F]{24}$/.test(documentId)) {
            console.log('📋 documentId is ObjectId format, trying findById')
            try {
                document = await Document.findById(documentId)
            } catch (castError) {
                console.log('⚠️ CastError when using findById, ignoring:', castError.message)
                // Ignore CastError and continue
            }
        }
        
        // If still not found, do a final search by document_id only
        if (!document) {
            document = await Document.findOne({ document_id: documentId })
        }

        if (!document) {
            console.log('❌ Document not found with documentId:', documentId)
            return res.status(404).json({
                success: false,
                message: 'Tài liệu không tồn tại'
            })
        }

        // Get document_id - ensure we have the correct document_id
        const documentIdToSave = document.document_id
        if (!documentIdToSave) {
            console.error('❌ Document found but has no document_id:', document._id)
            return res.status(500).json({
                success: false,
                message: 'Tài liệu không có document_id hợp lệ'
            })
        }

        console.log('📄 Document found:', {
            _id: document._id,
            document_id: documentIdToSave,
            title: document.title
        })

        // Get user - try both _id and user_id
        // First try _id (MongoDB ObjectId) if userId looks like ObjectId
        let user = null
        if (/^[0-9a-fA-F]{24}$/.test(userId)) {
            // Try _id first if it's a valid ObjectId
            user = await User.findById(userId)
        }
        
        // If not found, try user_id (string field)
        if (!user) {
            user = await User.findOne({ user_id: userId })
        }
        
        // If still not found, try _id conversion
        if (!user && /^[0-9a-fA-F]{24}$/.test(userId)) {
            try {
                const mongoose = require('mongoose')
                const objectId = new mongoose.Types.ObjectId(userId)
                user = await User.findById(objectId)
            } catch (e) {
                // Ignore error
            }
        }
        
        if (!user) {
            console.log('❌ User not found with userId:', userId)
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại'
            })
        }

        console.log('👤 User found:', {
            _id: user._id,
            user_id: user.user_id,
            saved_documents_exists: user.saved_documents !== undefined,
            saved_documents_type: Array.isArray(user.saved_documents) ? 'array' : typeof user.saved_documents,
            saved_documents_count: user.saved_documents ? user.saved_documents.length : 0
        })

        // Check if already bookmarked
        if (user.saved_documents && user.saved_documents.includes(documentIdToSave)) {
            console.log('⚠️ Document already bookmarked')
            return res.json({
                success: true,
                message: 'Tài liệu đã được lưu trước đó',
                alreadyBookmarked: true
            })
        }

        // Add to saved_documents
        if (!user.saved_documents) {
            user.saved_documents = []
        }
        
        console.log('📝 Before adding - saved_documents:', user.saved_documents)
        console.log('📝 Document ID to save:', documentIdToSave)
        
        // Ensure we're not adding duplicates
        if (!user.saved_documents.includes(documentIdToSave)) {
            user.saved_documents.push(documentIdToSave)
            console.log('✅ Added documentId to array')
        } else {
            console.log('⚠️ Document already in array, skipping')
        }
        
        console.log('📝 After adding - saved_documents:', user.saved_documents)
        console.log('📝 User document isModified:', user.isModified('saved_documents'))
        
        // Mark the field as modified to ensure it's saved
        user.markModified('saved_documents')
        console.log('📝 After markModified - isModified:', user.isModified('saved_documents'))
        
        try {
            console.log('💾 Attempting to save user...')
            console.log('📝 User document before save:', {
                _id: user._id,
                user_id: user.user_id,
                fullName: user.fullName,
                email: user.email,
                saved_documents: user.saved_documents
            })
            
            // Use updateOne instead of save to avoid validation issues
            // This will only update the saved_documents field
            const updateResult = await User.updateOne(
                { _id: user._id },
                { 
                    $set: { 
                        saved_documents: user.saved_documents 
                    } 
                }
            )
            
            console.log('✅ User updated successfully')
            console.log('📝 Update result:', updateResult)
            
            // Verify by fetching
            const savedUser = await User.findById(user._id).select('saved_documents')
            console.log('📝 Verified saved_documents:', savedUser ? savedUser.saved_documents : 'null')
        } catch (saveError) {
            console.error('❌ Error saving user:', saveError)
            console.error('❌ Save error details:', {
                name: saveError.name,
                message: saveError.message,
                code: saveError.code,
                errors: saveError.errors
            })
            throw saveError
        }

        // Verify the save by re-fetching the user - use same method as finding
        let savedUser = null
        if (/^[0-9a-fA-F]{24}$/.test(userId)) {
            savedUser = await User.findById(userId).select('saved_documents')
        }
        if (!savedUser) {
            savedUser = await User.findOne({ user_id: userId }).select('saved_documents')
        }
        
        console.log('✅ Bookmark added successfully')
        console.log('Saved document_id:', documentIdToSave)
        console.log('User saved_documents after save:', savedUser ? savedUser.saved_documents : 'null')
        console.log('User saved_documents count:', savedUser && savedUser.saved_documents ? savedUser.saved_documents.length : 0)
        
        if (!savedUser || !savedUser.saved_documents || !savedUser.saved_documents.includes(documentIdToSave)) {
            console.error('⚠️ WARNING: Document not found in saved_documents after save!')
        }
        
        console.log('=========================================\n')

        res.json({
            success: true,
            message: 'Đã lưu tài liệu thành công!'
        })
    } catch (error) {
        console.error('\n❌ ========== ADD BOOKMARK ERROR ==========')
        console.error('Error:', error)
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        console.error('Error code:', error.code)
        console.error('Error stack:', error.stack)
        if (error.errors) {
            console.error('Validation errors:', error.errors)
        }
        console.error('==========================================\n')
        
        // Always return error details in development
        const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi lưu tài liệu.',
            error: isDev ? error.message : undefined,
            errorName: isDev ? error.name : undefined,
            errorStack: isDev ? error.stack : undefined,
            errorDetails: isDev ? {
                name: error.name,
                message: error.message,
                code: error.code,
                errors: error.errors
            } : undefined
        })
    }
}

/**
 * Remove bookmark
 * DELETE /documents/bookmarks
 */
exports.removeBookmark = async (req, res) => {
    try {
        const { userId, documentId } = req.body

        console.log('\n➖ ========== REMOVE BOOKMARK ==========')
        console.log('User ID:', userId)
        console.log('Document ID:', documentId)

        // Validation
        if (!userId || !documentId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu userId hoặc documentId'
            })
        }

        // Get user - try both user_id and _id
        let user = await User.findOne({ user_id: userId })
        
        // If not found, try _id (MongoDB ObjectId)
        if (!user) {
            user = await User.findById(userId)
        }
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại'
            })
        }

        // Check if document exists - try document_id first
        // NEVER use findById for document_id (doc_xxx format) - it will cause CastError
        let document = await Document.findOne({ document_id: documentId })
        
        // Only try _id if documentId looks like MongoDB ObjectId (24 hex chars)
        // AND document_id search failed
        if (!document && /^[0-9a-fA-F]{24}$/.test(documentId)) {
            console.log('📋 documentId is ObjectId format, trying findById')
            try {
                document = await Document.findById(documentId)
            } catch (castError) {
                console.log('⚠️ CastError when using findById, ignoring:', castError.message)
                // Ignore CastError and continue
            }
        }
        
        // If still not found, do a final search by document_id only
        if (!document) {
            document = await Document.findOne({ document_id: documentId })
        }

        if (!document) {
            console.log('❌ Document not found with documentId:', documentId)
            return res.status(404).json({
                success: false,
                message: 'Tài liệu không tồn tại'
            })
        }

        // Get document_id - ensure we have the correct document_id
        const documentIdToRemove = document.document_id
        if (!documentIdToRemove) {
            console.error('❌ Document found but has no document_id:', document._id)
            return res.status(500).json({
                success: false,
                message: 'Tài liệu không có document_id hợp lệ'
            })
        }
        if (!user.saved_documents) {
            user.saved_documents = []
        }
        user.saved_documents = user.saved_documents.filter(id => id !== documentIdToRemove)
        
        // Mark the field as modified to ensure it's saved
        user.markModified('saved_documents')
        
        await user.save()
        
        // Verify the save by re-fetching the user - use same method as finding
        let savedUser = null
        if (/^[0-9a-fA-F]{24}$/.test(userId)) {
            savedUser = await User.findById(userId).select('saved_documents')
        }
        if (!savedUser) {
            savedUser = await User.findOne({ user_id: userId }).select('saved_documents')
        }
        
        console.log('✅ Bookmark removed successfully')
        console.log('Removed document_id:', documentIdToRemove)
        console.log('User saved_documents after remove:', savedUser ? savedUser.saved_documents : 'null')
        console.log('User saved_documents count:', savedUser && savedUser.saved_documents ? savedUser.saved_documents.length : 0)
        console.log('=========================================\n')

        res.json({
            success: true,
            message: 'Đã bỏ lưu tài liệu thành công!'
        })
    } catch (error) {
        console.error('❌ Remove bookmark error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi bỏ lưu tài liệu.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Increment document views
 * POST /documents/:id/view
 */
exports.incrementViews = async (req, res) => {
    try {
        const { id } = req.params

        console.log('\n👁️ ========== INCREMENT VIEWS ==========')
        console.log('Document ID:', id)

        // Find document by document_id or _id
        let document = await Document.findOne({ document_id: id })
        
        if (!document && /^[0-9a-fA-F]{24}$/.test(id)) {
            try {
                document = await Document.findById(id)
            } catch (castError) {
                console.log('⚠️ CastError when using findById, ignoring:', castError.message)
            }
        }

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Tài liệu không tồn tại'
            })
        }

        // Get current views count before increment
        const oldViews = document.views || 0

        // Increment views using atomic operation to prevent race conditions
        const result = await Document.findOneAndUpdate(
            { _id: document._id },
            { $inc: { views: 1 } },
            { new: true, select: 'views document_id' }
        )

        if (!result) {
            console.error('❌ Failed to update views count')
            return res.status(500).json({
                success: false,
                message: 'Không thể cập nhật lượt xem'
            })
        }

        console.log(`✅ Views incremented. Old: ${oldViews} → New: ${result.views}`)
        console.log('=========================================\n')

        res.json({
            success: true,
            message: 'Đã cập nhật lượt xem',
            data: {
                document_id: document.document_id,
                views: result.views
            }
        })
    } catch (error) {
        console.error('❌ Increment views error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi cập nhật lượt xem.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Increment document downloads
 * POST /documents/:id/download
 */
exports.incrementDownloads = async (req, res) => {
    try {
        const { id } = req.params
        const requestId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        console.log('\n⬇️ ========== INCREMENT DOWNLOADS ==========')
        console.log('Request ID:', requestId)
        console.log('Document ID:', id)
        console.log('Timestamp:', new Date().toISOString())
        console.log('Headers:', JSON.stringify(req.headers, null, 2))

        // Find document by document_id or _id
        let document = await Document.findOne({ document_id: id })
        
        if (!document && /^[0-9a-fA-F]{24}$/.test(id)) {
            try {
                document = await Document.findById(id)
            } catch (castError) {
                console.log('⚠️ CastError when using findById, ignoring:', castError.message)
            }
        }

        if (!document) {
            console.log('❌ Document not found for ID:', id)
            return res.status(404).json({
                success: false,
                message: 'Tài liệu không tồn tại'
            })
        }

        // Get current downloads count before increment
        const oldDownloads = document.downloads || 0
        console.log('📊 Current downloads count:', oldDownloads)

        // Increment downloads using atomic operation to prevent race conditions
        const result = await Document.findOneAndUpdate(
            { _id: document._id },
            { $inc: { downloads: 1 } },
            { new: true, select: 'downloads document_id' }
        )

        if (!result) {
            console.error('❌ Failed to update downloads count')
            return res.status(500).json({
                success: false,
                message: 'Không thể cập nhật lượt tải'
            })
        }

        console.log(`✅ Downloads incremented. Old: ${oldDownloads} → New: ${result.downloads}`)
        console.log('Request ID:', requestId)
        console.log('=========================================\n')

        res.json({
            success: true,
            message: 'Đã cập nhật lượt tải',
            data: {
                document_id: document.document_id,
                downloads: result.downloads,
                requestId: requestId
            }
        })
    } catch (error) {
        console.error('❌ Increment downloads error:', error)
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi cập nhật lượt tải.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}



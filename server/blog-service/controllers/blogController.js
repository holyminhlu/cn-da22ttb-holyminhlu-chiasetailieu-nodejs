const BlogPost = require('../models/blogPostModel')

/**
 * Tạo bài viết mới (chỉ dành cho admin)
 */
exports.createPost = async (req, res) => {
    try {
        console.log('\n📝 ========== CREATE BLOG POST ==========')
        console.log('Request body keys:', Object.keys(req.body))
        console.log('Title:', req.body.title ? 'Present' : 'Missing')
        console.log('Description:', req.body.description ? 'Present' : 'Missing')
        console.log('Content length:', req.body.content ? req.body.content.length : 0)
        console.log('Category:', req.body.category || 'Missing')
        console.log('CoverImage length:', req.body.coverImage ? req.body.coverImage.length : 0)
        
        const {
            title,
            description,
            content,
            category,
            tags,
            author,
            coverImage,
            readingTime,
            featured,
            status
        } = req.body

        // Validation
        if (!title || !description || !content || !category) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin: title, description, content, category'
            })
        }

        // Tạo slug từ title
        let slug = title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        
        // Ensure slug is not empty
        if (!slug || slug.length === 0) {
            slug = `post-${Date.now()}`
        }
        
        console.log('Generated slug:', slug)

        // Kiểm tra slug đã tồn tại chưa - nếu có thì thêm timestamp
        let finalSlug = slug
        let existingPost = await BlogPost.findOne({ slug: finalSlug })
        if (existingPost) {
            finalSlug = `${slug}-${Date.now()}`
            console.log('Slug exists, using:', finalSlug)
        }

        // Validate and limit coverImage size (max 1MB base64 string)
        let finalCoverImage = coverImage || ''
        if (finalCoverImage && typeof finalCoverImage === 'string') {
            // If base64 is too large, truncate or use empty string
            if (finalCoverImage.length > 1024 * 1024) {
                console.warn('CoverImage base64 too large, using empty string')
                finalCoverImage = ''
            }
            // Limit to reasonable size (500KB base64)
            if (finalCoverImage.length > 500 * 1024) {
                console.warn('CoverImage base64 large, but accepting it')
            }
        }

        // Prepare author object
        let authorObj = author
        if (!authorObj || typeof authorObj !== 'object') {
            authorObj = {
                id: req.body.authorId || req.body.author?.id || 'admin',
                name: req.body.authorName || req.body.author?.name || 'Admin OLF',
                avatar: req.body.authorAvatar || req.body.author?.avatar || ''
            }
        }
        
        // Ensure author has required fields
        if (!authorObj.id) authorObj.id = 'admin'
        if (!authorObj.name) authorObj.name = 'Admin OLF'
        if (!authorObj.avatar) authorObj.avatar = ''
        
        console.log('Author object:', authorObj)
        console.log('Content length:', content ? content.length : 0)
        console.log('CoverImage length:', finalCoverImage ? finalCoverImage.length : 0)

        const newPost = new BlogPost({
            title: title.trim(),
            slug: finalSlug,
            description: description.trim(),
            content: content,
            category: category,
            tags: Array.isArray(tags) ? tags : [],
            author: authorObj,
            coverImage: finalCoverImage,
            readingTime: readingTime || 5,
            featured: featured || false,
            status: status || 'published'
        })
        
        console.log('Attempting to save post...')
        const savedPost = await newPost.save()
        console.log('Post saved successfully:', savedPost.blog_post_id)

        res.status(201).json({
            success: true,
            message: 'Tạo bài viết thành công',
            data: savedPost
        })
    } catch (error) {
        console.error('\n❌ ========== ERROR CREATING BLOG POST ==========')
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        console.error('Error code:', error.code)
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2))
        }
        console.error('Error stack:', error.stack)
        console.error('================================================\n')
        
        // More detailed error message
        let errorMessage = 'Lỗi khi tạo bài viết'
        let statusCode = 500
        
        if (error.name === 'ValidationError') {
            statusCode = 400
            const validationErrors = Object.values(error.errors).map(e => e.message)
            errorMessage = `Lỗi validation: ${validationErrors.join(', ')}`
        } else if (error.code === 11000) {
            statusCode = 400
            // Extract field name from error
            const field = Object.keys(error.keyPattern || {})[0] || 'field'
            errorMessage = `${field} đã tồn tại, vui lòng thay đổi`
        } else if (error.message) {
            errorMessage = error.message
        }
        
        res.status(statusCode).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            errorDetails: process.env.NODE_ENV === 'development' ? {
                name: error.name,
                code: error.code,
                errors: error.errors
            } : undefined
        })
    }
}

/**
 * Lấy danh sách bài viết với pagination và filtering
 */
exports.getAllPosts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            tag,
            featured,
            status = 'published',
            search,
            sortBy = 'publishedDate',
            sortOrder = 'desc'
        } = req.query

        // Build query
        const query = { status }

        if (category) {
            query.category = category
        }

        if (tag) {
            query.tags = { $in: [tag] }
        }

        if (featured !== undefined) {
            query.featured = featured === 'true'
        }

        if (search) {
            query.$text = { $search: search }
        }

        // Sort options
        const sortOptions = {}
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit)

        // Execute query
        const posts = await BlogPost.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-content') // Không trả về content trong list view

        const total = await BlogPost.countDocuments(query)

        res.json({
            success: true,
            data: posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        })
    } catch (error) {
        console.error('Error getting blog posts:', error)
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách bài viết',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Lấy bài viết theo ID hoặc slug
 */
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params

        // Tìm theo blog_post_id hoặc slug
        const post = await BlogPost.findOne({
            $or: [
                { blog_post_id: id },
                { slug: id }
            ]
        })

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            })
        }

        // Chỉ trả về bài viết đã published (trừ khi là admin)
        if (post.status !== 'published') {
            // TODO: Kiểm tra quyền admin
            return res.status(404).json({
                success: false,
                message: 'Bài viết không tồn tại hoặc đã bị ẩn'
            })
        }

        // Tăng lượt xem
        post.views += 1
        await post.save()

        res.json({
            success: true,
            data: post
        })
    } catch (error) {
        console.error('Error getting blog post:', error)
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy bài viết',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Lấy các bài viết nổi bật (featured)
 */
exports.getFeaturedPosts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3

        const posts = await BlogPost.find({
            featured: true,
            status: 'published'
        })
            .sort({ publishedDate: -1 })
            .limit(limit)
            .select('-content')

        res.json({
            success: true,
            data: posts
        })
    } catch (error) {
        console.error('Error getting featured posts:', error)
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy bài viết nổi bật',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Lấy các bài viết phổ biến (theo views)
 */
exports.getPopularPosts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5

        const posts = await BlogPost.find({
            status: 'published'
        })
            .sort({ views: -1 })
            .limit(limit)
            .select('-content')

        res.json({
            success: true,
            data: posts
        })
    } catch (error) {
        console.error('Error getting popular posts:', error)
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy bài viết phổ biến',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Lấy các bài viết liên quan (cùng category hoặc tag)
 */
exports.getRelatedPosts = async (req, res) => {
    try {
        const { id } = req.params
        const limit = parseInt(req.query.limit) || 4

        // Lấy bài viết hiện tại
        const currentPost = await BlogPost.findOne({
            $or: [
                { blog_post_id: id },
                { slug: id }
            ]
        })

        if (!currentPost) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            })
        }

        // Tìm bài viết liên quan (cùng category hoặc có tag chung)
        const relatedPosts = await BlogPost.find({
            $and: [
                {
                    $or: [
                        { blog_post_id: { $ne: currentPost.blog_post_id } },
                        { slug: { $ne: currentPost.slug } }
                    ]
                },
                {
                    $or: [
                        { category: currentPost.category },
                        { tags: { $in: currentPost.tags } }
                    ]
                },
                { status: 'published' }
            ]
        })
            .sort({ publishedDate: -1 })
            .limit(limit)
            .select('-content')

        res.json({
            success: true,
            data: relatedPosts
        })
    } catch (error) {
        console.error('Error getting related posts:', error)
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy bài viết liên quan',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Lấy tất cả tags (để tạo tag cloud)
 */
exports.getAllTags = async (req, res) => {
    try {
        const posts = await BlogPost.find({
            status: 'published'
        }).select('tags')

        // Đếm số lần xuất hiện của mỗi tag
        const tagCounts = {}
        posts.forEach(post => {
            post.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1
            })
        })

        // Chuyển thành array và sắp xếp
        const tags = Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)

        res.json({
            success: true,
            data: tags
        })
    } catch (error) {
        console.error('Error getting tags:', error)
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách tags',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Cập nhật bài viết (chỉ dành cho admin)
 */
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params
        const updateData = req.body

        // Không cho phép cập nhật blog_post_id
        delete updateData.blog_post_id

        // Nếu cập nhật title, tự động tạo slug mới
        if (updateData.title) {
            updateData.slug = updateData.title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
        }

        const post = await BlogPost.findOneAndUpdate(
            {
                $or: [
                    { blog_post_id: id },
                    { slug: id }
                ]
            },
            updateData,
            { new: true, runValidators: true }
        )

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            })
        }

        res.json({
            success: true,
            message: 'Cập nhật bài viết thành công',
            data: post
        })
    } catch (error) {
        console.error('Error updating blog post:', error)
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật bài viết',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Xóa bài viết (chỉ dành cho admin)
 */
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params

        const post = await BlogPost.findOneAndDelete({
            $or: [
                { blog_post_id: id },
                { slug: id }
            ]
        })

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            })
        }

        res.json({
            success: true,
            message: 'Xóa bài viết thành công'
        })
    } catch (error) {
        console.error('Error deleting blog post:', error)
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa bài viết',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}



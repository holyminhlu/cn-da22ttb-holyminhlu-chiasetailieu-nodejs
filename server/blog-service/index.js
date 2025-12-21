const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const blogRoute = require('./routes/blogRoute');

const app = express();
const PORT = 3006; // Port cho blog-service (đổi từ 3005 vì Forum Service đang dùng port đó)

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// Middleware để log requests
app.use((req, res, next) => {
    req.on('aborted', () => {
        console.log(`\n⚠️ Request aborted: ${req.method} ${req.path}`);
    });
    
    console.log('\n📥 ========== BLOG SERVICE REQUEST ==========');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`Query:`, req.query);
    
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    console.log('==========================================\n');
    
    next();
});

// Error handler cho middleware
app.use((err, req, res, next) => {
    if (err.code === 'ECONNABORTED' || err.type === 'request.aborted') {
        console.log('⚠️ Request aborted by client:', req.method, req.path);
        return;
    }
    
    if (err instanceof SyntaxError && 'body' in err) {
        console.error('\n❌ JSON Parse Error:', err.message);
        if (!res.headersSent) {
            return res.status(400).json({
                success: false,
                message: 'JSON không hợp lệ. Vui lòng kiểm tra request body.',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }
    next(err);
});

// MongoDB connection - supports both local and cloud
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/EduShareDB';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => {
        console.log('\n✅ ========== MONGODB CONNECTED (Blog Service) ==========');
        console.log('Database: EduShareDB');
        console.log('Collection: BlogPosts');
        console.log('Connection:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
        console.log('========================================================\n');
    })
    .catch(err => {
        console.error('\n❌ ========== MONGODB CONNECTION ERROR ==========');
        console.error('Error:', err.message);
        console.error('====================================================\n');
    });

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Blog Service đang chạy bình thường!',
        timestamp: new Date().toISOString(),
        endpoints: {
            getAll: 'GET /blogs',
            getById: 'GET /blogs/:id',
            getFeatured: 'GET /blogs/featured',
            getPopular: 'GET /blogs/popular',
            getRelated: 'GET /blogs/:id/related',
            getTags: 'GET /blogs/tags',
            create: 'POST /blogs',
            update: 'PUT /blogs/:id',
            delete: 'DELETE /blogs/:id',
            test: 'GET /test'
        }
    });
});

// Routes
app.use('/blogs', blogRoute);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'OpenLearnFoundation Blog Service đang chạy',
        version: '1.0.0',
        endpoints: {
            getAll: 'GET /blogs',
            getById: 'GET /blogs/:id',
            getFeatured: 'GET /blogs/featured',
            getPopular: 'GET /blogs/popular',
            getRelated: 'GET /blogs/:id/related',
            getTags: 'GET /blogs/tags',
            create: 'POST /blogs',
            update: 'PUT /blogs/:id',
            delete: 'DELETE /blogs/:id',
            test: 'GET /test'
        }
    });
});

// 404 handler
app.use((req, res) => {
    console.log(`\n⚠️ ========== 404 NOT FOUND ==========`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log('=====================================\n');
    
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} không tồn tại`,
        availableRoutes: {
            getAll: 'GET /blogs',
            getById: 'GET /blogs/:id',
            getFeatured: 'GET /blogs/featured',
            getPopular: 'GET /blogs/popular',
            getRelated: 'GET /blogs/:id/related',
            getTags: 'GET /blogs/tags',
            create: 'POST /blogs',
            update: 'PUT /blogs/:id',
            delete: 'DELETE /blogs/:id',
            test: 'GET /test',
            root: 'GET /'
        }
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('\n💥 ========== UNHANDLED ERROR ==========');
    console.error('Error:', err);
    console.error('Request:', req.method, req.path);
    console.error('Stack:', err.stack);
    console.error('======================================\n');
    
    res.status(500).json({
        success: false,
        message: 'Đã có lỗi xảy ra trên server',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log('\n🚀 =======================================');
    console.log(`✅ Blog-Service đang lắng nghe tại http://localhost:${PORT}`);
    console.log(`✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB`);
    console.log(`✅ Collection: BlogPosts`);
    console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
    console.log(`✅ Get all posts: GET http://localhost:${PORT}/blogs`);
    console.log(`✅ Get featured: GET http://localhost:${PORT}/blogs/featured`);
    console.log('======================================\n');
});



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const documentRoute = require('./routes/documentRoute');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase body size limit

// Serve static files từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware để log tất cả requests
app.use((req, res, next) => {
    // Handle request abort
    req.on('aborted', () => {
        console.log(`\n⚠️ Request aborted: ${req.method} ${req.path}`);
    });
    
    req.on('close', () => {
        if (!res.headersSent) {
            console.log(`\n⚠️ Request closed before response: ${req.method} ${req.path}`);
        }
    });
    
    console.log('\n📥 ========== NEW REQUEST ==========');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`Query:`, req.query);
    console.log(`Headers:`, {
        'content-type': req.headers['content-type'],
        'origin': req.headers['origin'],
        'user-agent': req.headers['user-agent']
    });
    
    // Log body nếu không phải multipart
    if (req.body && Object.keys(req.body).length > 0 && 
        !req.headers['content-type']?.includes('multipart/form-data')) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    } else {
        // For POST/PUT requests, log if body is empty
        if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') && 
            !req.headers['content-type']?.includes('multipart/form-data')) {
            console.log('Body: (empty or not parsed)');
            console.log('Content-Type header:', req.headers['content-type']);
            console.log('Body exists:', !!req.body);
            if (req.body) {
                console.log('Body type:', typeof req.body);
                console.log('Body keys:', Object.keys(req.body));
            }
        } else {
            console.log('Body: (empty or multipart)');
        }
    }
    console.log('=====================================\n');
    
    next();
});

// Error handler cho middleware
app.use((err, req, res, next) => {
    // Ignore request aborted errors (client closed connection)
    if (err.code === 'ECONNABORTED' || err.type === 'request.aborted') {
        console.log('⚠️ Request aborted by client:', req.method, req.path);
        return; // Don't send response if request was aborted
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
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
    .then(() => {
        console.log('\n✅ ========== MONGODB CONNECTED ==========');
        console.log('Database: EduShareDB');
        console.log('Collections:');
        console.log('  - TaiLieu (Documents)');
        console.log('  - UserCollection (Users)');
        console.log('Connection:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
        console.log('==========================================\n');
    })
    .catch(err => {
        console.error('\n❌ ========== MONGODB CONNECTION ERROR ==========');
        console.error('Error:', err.message);
        console.error('====================================================\n');
    });

// Test endpoint
app.get('/test', (req, res) => {
    console.log('✅ Test endpoint called');
    res.json({
        success: true,
        message: 'Document Service đang chạy bình thường!',
        timestamp: new Date().toISOString(),
        endpoints: {
            upload: 'POST /documents/upload',
            search: 'GET /documents/search',
            getAll: 'GET /documents',
            getById: 'GET /documents/:id',
            test: 'GET /test'
        }
    });
});

app.use('/documents', documentRoute);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'EduShare Document Service đang chạy',
        version: '1.0.0',
        endpoints: {
            upload: 'POST /documents/upload',
            search: 'GET /documents/search',
            getAll: 'GET /documents',
            getById: 'GET /documents/:id',
            test: 'GET /test'
        }
    });
});

// 404 handler - must be after all routes
app.use((req, res) => {
    console.log(`\n⚠️ ========== 404 NOT FOUND ==========`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`Original URL: ${req.originalUrl}`);
    console.log(`Query:`, req.query);
    console.log(`Params:`, req.params);
    console.log('Available routes:');
    console.log('  - POST /documents/upload');
    console.log('  - GET /documents/search');
    console.log('  - GET /documents');
    console.log('  - POST /documents/:id/view');
    console.log('  - POST /documents/:id/download');
    console.log('  - GET /documents/:id');
    console.log('=====================================\n');
    
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} không tồn tại`,
        availableRoutes: {
            upload: 'POST /documents/upload',
            search: 'GET /documents/search',
            getAll: 'GET /documents',
            incrementViews: 'POST /documents/:id/view',
            incrementDownloads: 'POST /documents/:id/download',
            getById: 'GET /documents/:id',
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
    console.log(`✅ Document-Service đang lắng nghe tại http://localhost:${PORT}`);
    console.log(`✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB`);
    console.log(`✅ Collection: TaiLieu`);
    console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
    console.log(`✅ Upload: POST http://localhost:${PORT}/documents/upload`);
    console.log(`✅ Search: GET http://localhost:${PORT}/documents/search`);
    console.log(`✅ Static files: http://localhost:${PORT}/uploads`);
    console.log('======================================\n');
});


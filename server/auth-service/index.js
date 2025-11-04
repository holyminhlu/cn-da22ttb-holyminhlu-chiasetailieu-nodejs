const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const authRoute = require('./routes/authRoute');

const app = express();
const PORT = 3001;

app.use(cors());

// Chỉ parse JSON khi không phải multipart/form-data
app.use((req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
        // Skip JSON parsing for multipart/form-data - multer sẽ xử lý
        console.log('📦 Skipping JSON parsing for multipart/form-data');
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.use(express.urlencoded({ extended: true }));

// Middleware để log tất cả requests
app.use((req, res, next) => {
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
    
    // Log body nếu có
    if (req.body && Object.keys(req.body).length > 0) {
        // Ẩn password trong log
        const safeBody = { ...req.body };
        if (safeBody.passWord) {
            safeBody.passWord = '***HIDDEN***';
        }
        console.log('Body:', JSON.stringify(safeBody, null, 2));
    } else {
        console.log('Body: (empty)');
    }
    console.log('=====================================\n');
    
    next();
});

// Error handler cho middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        console.error('\n❌ JSON Parse Error:', err.message);
        return res.status(400).json({
            success: false,
            message: 'JSON không hợp lệ. Vui lòng kiểm tra request body.',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
    next(err);
});

// mongoose.connect('mongodb+srv://holyminhludauden_db_user:<db_password>@openlearnfoundation.fniy67o.mongodb.net/EduShareDB')
mongoose.connect('mongodb://127.0.0.1:27017/EduShareDB')    
    .then(()=>console.log('Kết nối MongoDB thành công'))
    .catch(err => console.error('Lỗi kết nối MongoDB',err));

// Test endpoint
app.get('/test', (req, res) => {
    console.log('✅ Test endpoint called');
    res.json({
        success: true,
        message: 'Service đang chạy bình thường!',
        timestamp: new Date().toISOString(),
        endpoints: {
            register: 'POST /register',
            login: 'POST /login',
            test: 'GET /test'
        }
    });
});

// Serve static files for covers
app.use('/uploads', express.static('uploads'));

app.use('/', require('./routes/authRoute'));

app.get('/', (req, res)=>{
    res.json({
        success: true,
        message: 'EduShare Auth Service đang chạy',
        version: '1.0.0',
        endpoints: {
            register: 'POST /register',
            login: 'POST /login',
            test: 'GET /test'
        }
    });
});

// 404 handler - Route không tìm thấy
app.use((req, res) => {
    console.log(`\n⚠️ ========== 404 NOT FOUND ==========`);
    console.log(`${req.method} ${req.path} - Route không tồn tại`);
    console.log('=====================================\n');
    
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} không tồn tại`,
        availableRoutes: {
            register: 'POST /register',
            login: 'POST /login',
            test: 'GET /test',
            root: 'GET /'
        }
    });
});

// Global error handler - Bắt tất cả lỗi không được handle
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

app.listen(PORT, () =>{
    console.log('\n🚀 =======================================');
    console.log(`✅ Auth-Service đang lắng nghe tại http://localhost:${PORT}`);
    console.log(`✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB`);
    console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
    console.log(`✅ Register: POST http://localhost:${PORT}/register`);
    console.log(`✅ Login: POST http://localhost:${PORT}/login`);
    console.log(`✅ Upload Avatar: POST http://localhost:${PORT}/profile/avatar`);
    console.log(`✅ Upload Cover: POST http://localhost:${PORT}/profile/cover`);
    console.log('======================================\n');
})



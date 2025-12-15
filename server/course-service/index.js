const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const courseRoute = require('./routes/courseRoute');
const paymentRoute = require('./routes/paymentRoute');

const app = express();
const PORT = 3004;

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:3004'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
// Body parser với error handling tốt hơn
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body if needed
    req.rawBody = buf;
  }
}));

// Serve static files từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve thumbnails and videos separately for better organization
app.use('/uploads/thumbnails', express.static(path.join(__dirname, 'uploads/thumbnails')));
app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));

// Middleware để log tất cả requests
app.use((req, res, next) => {
    const requestStartTime = Date.now()
    
    console.log('\n📥 ========== NEW REQUEST ==========');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`Original URL: ${req.originalUrl}`);
    console.log(`Query:`, req.query);
    console.log(`Headers:`, {
        'content-type': req.headers['content-type'],
        'content-length': req.headers['content-length'],
        'origin': req.headers['origin']
    });
    console.log(`Has body:`, !!req.body);
    if (req.body) {
        console.log(`Body keys:`, Object.keys(req.body));
        console.log(`Body:`, JSON.stringify(req.body).substring(0, 200));
    }
    
    // Handle request abort
    req.on('aborted', () => {
        const elapsed = Date.now() - requestStartTime
        console.log(`\n⚠️ Request aborted after ${elapsed}ms: ${req.method} ${req.path}`)
    })
    
    req.on('close', () => {
        if (!res.headersSent) {
            const elapsed = Date.now() - requestStartTime
            console.log(`\n⚠️ Request closed before response after ${elapsed}ms: ${req.method} ${req.path}`)
        }
    })
    
    // Log body nếu không phải multipart
    if (req.body && Object.keys(req.body).length > 0 && 
        !req.headers['content-type']?.includes('multipart/form-data')) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    } else {
        if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') && 
            !req.headers['content-type']?.includes('multipart/form-data')) {
            console.log('Body: (empty or not parsed)');
        } else {
            console.log('Body: (empty or multipart)');
        }
    }
    console.log('=====================================\n');
    
    next();
});

// Error handler cho middleware
app.use((err, req, res, next) => {
    // Handle request aborted errors gracefully
    if (err.code === 'ECONNABORTED' || err.type === 'request.aborted' || err.message?.includes('request aborted')) {
        console.log('\n⚠️ Request aborted by client:', req.method, req.path);
        // Don't send response if connection is already closed
        if (!res.headersSent && !res.writableEnded) {
            return res.status(499).json({
                success: false,
                message: 'Request đã bị hủy bởi client'
            });
        }
        return; // Connection already closed, don't try to send response
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

// MongoDB connection with optimized options
mongoose.connect('mongodb://127.0.0.1:27017/EduShareDB', {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 2, // Maintain at least 2 socket connections
    // Note: bufferCommands and bufferMaxEntries are not valid connection options
    // They are mongoose global settings, not connection options
})
    .then(() => {
        console.log('\n✅ ========== MONGODB CONNECTED ==========');
        console.log('Database: EduShareDB');
        console.log('Collections: Courses, Enrollments');
        console.log('Connection: mongodb://127.0.0.1:27017/EduShareDB');
        console.log('Connection state:', mongoose.connection.readyState);
        console.log('==========================================\n');
    })
    .catch(err => {
        console.error('\n❌ ========== MONGODB CONNECTION ERROR ==========');
        console.error('Error:', err.message);
        console.error('Error code:', err.code);
        console.error('====================================================\n');
    });

// Test endpoint
app.get('/test', (req, res) => {
    console.log('✅ Test endpoint called');
    res.json({
        success: true,
        message: 'Course Service đang chạy bình thường!',
        timestamp: new Date().toISOString(),
        endpoints: {
            getAll: 'GET /courses',
            search: 'GET /courses/search',
            getById: 'GET /courses/:id',
            enroll: 'POST /courses/:id/enroll',
            payments: 'GET /payments',
            createPayment: 'POST /payments',
            getUserPayments: 'GET /payments/user',
            getPaymentStatus: 'GET /payments/:payment_id/status',
            paymentIPN: 'POST /payments/ipn',
            paymentWebhook: 'POST /payments/webhook',
            test: 'GET /test'
        }
    });
});

app.use('/courses', courseRoute);
app.use('/payments', paymentRoute);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'EduShare Course Service đang chạy',
        version: '1.0.0',
        endpoints: {
            getAll: 'GET /courses',
            search: 'GET /courses/search',
            getById: 'GET /courses/:id',
            enroll: 'POST /courses/:id/enroll',
            payments: 'GET /payments',
            createPayment: 'POST /payments',
            getUserPayments: 'GET /payments/user',
            getPaymentStatus: 'GET /payments/:payment_id/status',
            paymentIPN: 'POST /payments/ipn',
            paymentWebhook: 'POST /payments/webhook',
            test: 'GET /test'
        }
    });
});

// 404 handler
app.use((req, res) => {
    console.log(`\n⚠️ ========== 404 NOT FOUND ==========`);
    console.log(`${req.method} ${req.path} - Route không tồn tại`);
    console.log('=====================================\n');
    
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} không tồn tại`,
        availableRoutes: {
            getAll: 'GET /courses',
            search: 'GET /courses/search',
            getById: 'GET /courses/:id',
            enroll: 'POST /courses/:id/enroll',
            payments: 'GET /payments',
            createPayment: 'POST /payments',
            getUserPayments: 'GET /payments/user',
            getPaymentStatus: 'GET /payments/:payment_id/status',
            paymentIPN: 'POST /payments/ipn',
            paymentWebhook: 'POST /payments/webhook',
            test: 'GET /test',
            root: 'GET /'
        }
    });
});

// Global error handler
app.use((err, req, res, next) => {
    // Skip logging and response for aborted requests
    if (err.code === 'ECONNABORTED' || err.type === 'request.aborted' || err.message?.includes('request aborted')) {
        console.log('\n⚠️ Request aborted (connection closed by client):', req.method, req.path);
        // Don't try to send response if connection is closed
        if (!res.headersSent && !res.writableEnded) {
            return res.status(499).json({
                success: false,
                message: 'Request đã bị hủy'
            });
        }
        return;
    }
    
    console.error('\n💥 ========== UNHANDLED ERROR ==========');
    console.error('Error:', err);
    console.error('Request:', req.method, req.path);
    console.error('Stack:', err.stack);
    console.error('======================================\n');
    
    // Only send response if headers haven't been sent
    if (!res.headersSent) {
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra trên server',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

app.listen(PORT, () => {
    console.log('\n🚀 =======================================');
    console.log(`✅ Course-Service đang lắng nghe tại http://localhost:${PORT}`);
    console.log(`✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB`);
    console.log(`✅ Collection: Courses`);
    console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
    console.log(`✅ Get all: GET http://localhost:${PORT}/courses`);
    console.log(`✅ Search: GET http://localhost:${PORT}/courses/search`);
    console.log(`✅ Static files: http://localhost:${PORT}/uploads`);
    console.log('======================================\n');
});


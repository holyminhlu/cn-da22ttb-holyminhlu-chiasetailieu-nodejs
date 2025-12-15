const express = require('express');
const cors = require('cors');
const proxyRoutes = require('./routes/proxyRoutes');
const loggerMid = require('./middleware/loggerMid');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration với options cho multipart
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:3003', 'http://localhost:3004'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Parse JSON body conditionally - skip for courses enroll and forum routes to avoid stream conflicts
app.use((req, res, next) => {
  // Skip body parsing for courses enroll to let proxy handle raw stream
  const isEnrollRoute = (req.originalUrl.includes('/courses') && req.originalUrl.includes('/enroll')) ||
                        (req.path.includes('/courses') && req.path.includes('/enroll'));
  
  // Skip body parsing for forum routes to avoid ECONNRESET issues
  const isForumRoute = req.originalUrl.includes('/forum') || req.path.includes('/forum');
  
  // Skip body parsing for SePay IPN - IPN sẽ được parse bởi course service
  const isSePayIPN = req.originalUrl.includes('/payment/sepay/ipn') || req.path.includes('/payment/sepay/ipn');
  
  if ((isEnrollRoute && req.method === 'POST') || 
      (isForumRoute && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) ||
      (isSePayIPN && req.method === 'POST')) {
    if (isForumRoute) {
      console.log('⏭️ Skipping body parsing for forum route - proxy will handle raw stream');
    } else if (isSePayIPN) {
      console.log('⏭️ Skipping body parsing for SePay IPN - proxy will handle');
    } else {
      console.log('⏭️ Skipping body parsing for courses enroll - proxy will handle');
    }
    return next();
  }
  
  // Parse JSON for other routes (including PUT /courses/:id/progress)
  const jsonParser = express.json({ 
    limit: '50mb',
    verify: (req, res, buf, encoding) => {
      // Store raw body for debugging if needed
      req.rawBody = buf;
    }
  });
  
  jsonParser(req, res, (err) => {
    if (err) {
      console.error('❌ JSON parsing error:', err.message);
      console.error('   Path:', req.originalUrl);
      console.error('   Content-Type:', req.headers['content-type']);
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON in request body',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    next();
  });
});

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(loggerMid);            // ✅ logger có thể đọc body nếu cần

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Gateway is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      courses: 'GET /api/courses',
      documents: 'GET /api/documents',
      auth: 'POST /api/auth/login',
      payments: 'POST /api/payments',
      test: 'GET /test'
    },
    services: {
      courseService: 'http://localhost:3004',
      documentService: 'http://localhost:3003',
      authService: 'http://localhost:3001'
    }
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API Gateway is running',
    routes: {
      courses: '/api/courses',
      documents: '/api/documents',
      auth: '/api/auth',
      payments: '/api/payments'
    }
  });
});

app.use('/api', proxyRoutes);  // ✅ Proxy sau cùng

// 404 handler
app.use((req, res) => {
  console.log(`\n⚠️ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} không tồn tại`,
    availableRoutes: {
      root: 'GET /',
      courses: 'GET /api/courses',
      documents: 'GET /api/documents',
      auth: 'POST /api/auth/login',
      payments: 'POST /api/payments',
      test: 'GET /test'
    }
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway chạy tại http://localhost:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
  console.log(`Courses endpoint: http://localhost:${PORT}/api/courses`);
});

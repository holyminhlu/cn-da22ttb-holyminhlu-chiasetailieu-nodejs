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

// Parse JSON body conditionally - skip for courses enroll endpoint to avoid stream conflicts
app.use((req, res, next) => {
  // Skip body parsing for courses enroll to let proxy handle raw stream
  // Check both originalUrl and path to catch the route
  const isEnrollRoute = (req.originalUrl.includes('/courses') && req.originalUrl.includes('/enroll')) ||
                        (req.path.includes('/courses') && req.path.includes('/enroll'));
  
  if (isEnrollRoute && req.method === 'POST') {
    console.log('⏭️ Skipping body parsing for courses enroll - proxy will handle');
    return next();
  }
  // Parse JSON for other routes
  express.json({ limit: '50mb' })(req, res, next);
});

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(loggerMid);            // ✅ logger có thể đọc body nếu cần

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API Gateway is running',
    routes: {
      courses: '/api/courses',
      documents: '/api/documents',
      auth: '/api/auth'
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
      courses: 'GET /api/courses',
      documents: 'GET /api/documents',
      auth: 'POST /api/auth/login',
      test: 'GET /test'
    }
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway chạy tại http://localhost:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
  console.log(`Courses endpoint: http://localhost:${PORT}/api/courses`);
});

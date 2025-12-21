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

// ⚠️ CRITICAL: DO NOT use body-parser for proxy routes!
// Body parsing should ONLY happen at the destination service, not at gateway.
// Parsing body at gateway causes request to be consumed/aborted before proxy can forward it.

// Only parse body for non-proxy routes (if any)
// For all /api/* routes, skip body parsing and let services handle it
app.use((req, res, next) => {
  // Skip body parsing for ALL /api routes - let services handle body parsing
  if (req.path.startsWith('/api/')) {
    console.log(`⏭️ Skipping body parsing for proxy route: ${req.method} ${req.originalUrl}`);
    return next();
  }
  
  // Only parse body for non-proxy routes (like /test, /, etc.)
  const jsonParser = express.json({ limit: '50mb' });
  jsonParser(req, res, next);
});

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
      test: 'GET /test'
    },
    services: {
      courseService: process.env.COURSE_SERVICE_URL || 'http://localhost:3004',
      documentService: process.env.DOCUMENT_SERVICE_URL || 'http://localhost:3003',
      authService: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      blogService: process.env.BLOG_SERVICE_URL || 'http://localhost:3006',
      forumService: process.env.FORUM_SERVICE_URL || 'http://localhost:3005'
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
      root: 'GET /',
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

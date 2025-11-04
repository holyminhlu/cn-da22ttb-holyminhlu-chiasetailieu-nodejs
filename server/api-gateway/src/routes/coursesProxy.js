const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
  target: 'http://localhost:3004', // Course service port
  changeOrigin: true,
  // Same pattern as documentsProxy - when mounted at /courses, path is already stripped
  // So /api/courses -> /courses in router -> / (empty) in middleware
  // We need to add /courses prefix back
  pathRewrite: { '^/(.*)': '/courses/$1' }, // Add /courses prefix to match service routes
  selfHandleResponse: false,
  timeout: 300000, // 5 minutes timeout for large file uploads
  proxyTimeout: 300000, // 5 minutes proxy timeout
  preserveHeaderKeyCase: true,
  // Don't buffer - let stream pass through for better performance
  buffer: false,
  onProxyReq: (proxyReq, req, res) => {
    console.log('\n📤 ========== PROXY REQUEST (Courses) ==========');
    console.log(`Method: ${req.method}`);
    console.log(`Original Path: ${req.originalUrl}`);
    console.log(`Request Path: ${req.path}`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Rewritten Path will be: /courses${req.url}`);
    console.log(`Content-Type: ${req.headers['content-type']}`);
    console.log(`Proxying to: http://localhost:3004/courses${req.url}`);
    console.log(`Has req.body:`, !!req.body);
    if (req.body) {
      console.log(`req.body keys:`, Object.keys(req.body));
      console.log(`req.body:`, JSON.stringify(req.body));
    }
    
    // For POST/PUT/PATCH with parsed body, forward it
    // For enroll endpoint, body should not be parsed, so stream will pass through
    if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') && req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      console.log('📤 Forwarding parsed body:', bodyData);
      proxyReq.write(bodyData);
    } else if (req.headers['content-type']?.includes('multipart/form-data')) {
      console.log('📦 Multipart/form-data detected - forwarding stream directly');
    } else if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('📤 POST/PUT/PATCH - forwarding raw stream (body not parsed)');
    }
    console.log('================================================\n');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('\n📥 ========== PROXY RESPONSE (Courses) ==========');
    console.log(`Status: ${proxyRes.statusCode}`);
    console.log(`Path: ${req.originalUrl}`);
    console.log(`Method: ${req.method}`);
    console.log(`Content-Type: ${proxyRes.headers['content-type']}`);
    if (proxyRes.statusCode >= 400) {
      console.log(`⚠️ Error response: Status ${proxyRes.statusCode}`);
    }
    console.log('==================================================\n');
  },
  onError: (err, req, res) => {
    console.error('\n❌ ========== PROXY ERROR (Courses) ==========');
    console.error('Error:', err.message);
    console.error('Error code:', err.code);
    console.error('Path:', req.originalUrl);
    console.error('Method:', req.method);
    console.error('===============================================\n');
    
    if (!res.headersSent) {
      let statusCode = 500;
      let message = 'Lỗi kết nối Courses Service.';
      
      if (err.code === 'ECONNREFUSED') {
        statusCode = 503;
        message = 'Courses Service không chạy hoặc không thể kết nối. Kiểm tra service có đang chạy tại port 3004 không.';
      } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
        statusCode = 504;
        message = 'Courses Service không phản hồi kịp thời. Service có thể đang quá tải hoặc gặp lỗi.';
      }
      
      res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        errorCode: err.code
      });
    }
  },
  logLevel: 'debug'
});


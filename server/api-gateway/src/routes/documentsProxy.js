const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
  target: 'http://localhost:3003', // Documents service port
  changeOrigin: true,
  pathRewrite: { '^/(.*)': '/documents/$1' }, // Add /documents prefix to match service routes
  selfHandleResponse: false,
  timeout: 30000, // 30 seconds timeout
  proxyTimeout: 30000, // 30 seconds proxy timeout
  // Quan trọng: không rewrite body cho multipart/form-data
  onProxyReq: (proxyReq, req, res) => {
    console.log('\n📤 ========== PROXY REQUEST (Documents) ==========');
    console.log(`Method: ${req.method}`);
    console.log(`Original Path: ${req.originalUrl}`);
    console.log(`Rewritten Path: ${req.url}`);
    console.log(`Content-Type: ${req.headers['content-type']}`);
    console.log(`Proxying to: http://localhost:3003${req.url}`);
    console.log(`Content-Length: ${req.headers['content-length'] || 'unknown'}`);
    
    // Đối với multipart/form-data, KHÔNG rewrite body
    // http-proxy-middleware sẽ tự động stream data
    // Chỉ xử lý JSON body
    if (req.body && Object.keys(req.body).length > 0 && 
        !req.headers['content-type']?.includes('multipart/form-data')) {
      let bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
      console.log('Body (JSON):', bodyData.substring(0, 500) + (bodyData.length > 500 ? '...' : ''));
    } else if (req.headers['content-type']?.includes('multipart/form-data')) {
      console.log('Body: multipart/form-data (streaming)...');
      // Preserve original content-type header for multipart
      proxyReq.setHeader('Content-Type', req.headers['content-type']);
    } else {
      // For POST/PUT requests without body, log it
      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        console.log('⚠️ Warning: POST/PUT request without body detected');
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Has body:', !!req.body);
        if (req.body) {
          console.log('Body keys:', Object.keys(req.body));
        }
      }
    }
    console.log('================================================\n');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('\n📥 ========== PROXY RESPONSE (Documents) ==========');
    console.log(`Status: ${proxyRes.statusCode}`);
    console.log(`Path: ${req.originalUrl}`);
    console.log('==================================================\n');
  },
  onError: (err, req, res) => {
    console.error('\n❌ ========== PROXY ERROR (Documents) ==========');
    console.error('Error:', err.message);
    console.error('Error code:', err.code);
    console.error('Path:', req.originalUrl);
    console.error('Method:', req.method);
    console.error('===============================================\n');
    
    if (!res.headersSent) {
      let statusCode = 500;
      let message = 'Lỗi kết nối Documents Service.';
      
      if (err.code === 'ECONNREFUSED') {
        statusCode = 503;
        message = 'Documents Service không chạy hoặc không thể kết nối. Kiểm tra service có đang chạy tại port 3003 không.';
      } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
        statusCode = 504;
        message = 'Documents Service không phản hồi kịp thời. Service có thể đang quá tải hoặc gặp lỗi.';
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


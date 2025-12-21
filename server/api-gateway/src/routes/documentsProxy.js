const { createProxyMiddleware } = require('http-proxy-middleware');

const DOCUMENT_SERVICE_URL = process.env.DOCUMENT_SERVICE_URL || 'http://localhost:3003';

module.exports = createProxyMiddleware({
  target: DOCUMENT_SERVICE_URL, // Documents service port
  changeOrigin: true,
  pathRewrite: { '^/(.*)': '/documents/$1' }, // Add /documents prefix to match service routes
  selfHandleResponse: false,
  timeout: 60000, // 60 seconds timeout (increased for rating operations)
  proxyTimeout: 60000, // 60 seconds proxy timeout
  buffer: false, // CRITICAL: Don't buffer response - stream immediately
  xfwd: true, // Forward X-Forwarded-* headers
  followRedirects: true,
  ws: false, // Disable WebSocket support
  // Quan trọng: không rewrite body cho multipart/form-data
  onProxyReq: (proxyReq, req, res) => {
    console.log('\n📤 ========== PROXY REQUEST (Documents) ==========');
    console.log(`Method: ${req.method}`);
    console.log(`Original Path: ${req.originalUrl}`);
    console.log(`Rewritten Path: ${req.url}`);
    console.log(`Target: http://localhost:3003${req.url}`);
    console.log(`Content-Type: ${req.headers['content-type']}`);
    console.log(`Content-Length: ${req.headers['content-length'] || 'unknown'}`);
    console.log(`Has body:`, !!req.body);
    
    // Handle request abort
    req.on('aborted', () => {
      console.log('⚠️ Client aborted request during proxy');
      proxyReq.destroy();
    });
    
    req.on('close', () => {
      if (!res.headersSent) {
        console.log('⚠️ Client closed connection during proxy');
      }
    });
    
    // Đối với multipart/form-data, KHÔNG rewrite body
    // http-proxy-middleware sẽ tự động stream data
    // Chỉ xử lý JSON body
    if (req.body && Object.keys(req.body).length > 0 && 
        !req.headers['content-type']?.includes('multipart/form-data')) {
      try {
        let bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
        console.log('Body (JSON):', bodyData.substring(0, 500) + (bodyData.length > 500 ? '...' : ''));
      } catch (bodyError) {
        console.error('❌ Error writing body to proxy:', bodyError.message);
      }
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
    const responseStartTime = Date.now();
    console.log('\n📥 ========== PROXY RESPONSE (Documents) ==========');
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Status: ${proxyRes.statusCode}`);
    console.log(`Path: ${req.originalUrl}`);
    console.log(`Content-Length: ${proxyRes.headers['content-length'] || 'unknown'}`);
    console.log(`Headers sent to client: ${res.headersSent}`);
    
    // CRITICAL: Log when response starts streaming
    // With buffer: false, response should stream immediately
    proxyRes.on('data', (chunk) => {
      if (!res.headersSent) {
        console.log('📤 First chunk received, forwarding to client...');
      }
    });
    
    proxyRes.on('end', () => {
      const responseTime = Date.now() - responseStartTime;
      console.log(`✅ Response stream completed in ${responseTime}ms`);
      console.log(`Response finished: ${res.finished}`);
    });
    
    console.log('==================================================\n');
  },
  onError: (err, req, res) => {
    // Ignore aborted requests
    if (err.code === 'ECONNABORTED' || err.message?.includes('aborted')) {
      console.log('\n⚠️ Request aborted (ignored):', req.method, req.originalUrl);
      return;
    }
    
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


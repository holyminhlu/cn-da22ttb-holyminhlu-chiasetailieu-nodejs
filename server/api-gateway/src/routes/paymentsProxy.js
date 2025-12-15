const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
  target: 'http://localhost:3004', // Course service port (payments are handled by course service)
  changeOrigin: true,
  // No pathRewrite needed - path is already /payments when mounted at /payments
  // /api/payments -> /payments in router -> /payments in service (no rewrite needed)
  selfHandleResponse: false,
  timeout: 30000,
  proxyTimeout: 30000,
  // QUAN TRỌNG: Không buffer body, forward ngay
  buffer: false,
  // QUAN TRỌNG: Log khi proxy được khởi tạo
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    const requestStartTime = Date.now();
    console.log(`\n💳 ========== PAYMENT PROXY REQUEST ==========`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`Original URL: ${req.originalUrl}`);
    console.log(`Request Path: ${req.path}`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Target: http://localhost:3004/payments${req.url}`);
    console.log(`Content-Type: ${req.headers['content-type'] || 'not set'}`);
    console.log(`Has req.body:`, !!req.body);
    console.log(`Has req.rawBody:`, !!req.rawBody);
    
    // QUAN TRỌNG: Với POST/PUT/PATCH, phải forward body
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      // Handle JSON body if present
      if (req.body && Object.keys(req.body).length > 0) {
        try {
          const bodyData = JSON.stringify(req.body);
          console.log(`📤 Body data:`, bodyData);
          console.log(`📤 Body size: ${Buffer.byteLength(bodyData)} bytes`);
          
          // Remove Content-Length header if exists (will be recalculated)
          proxyReq.removeHeader('Content-Length');
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          
          // Write body và end request
          proxyReq.write(bodyData);
          proxyReq.end();
          console.log(`✅ Body forwarded successfully`);
        } catch (bodyError) {
          console.error(`❌ Error processing body:`, bodyError);
          console.error(`   Error stack:`, bodyError.stack);
          // Don't throw - let proxy continue, backend will handle error
        }
      } else if (req.rawBody) {
        // Nếu có rawBody, forward raw body
        console.log(`📤 Forwarding raw body (${req.rawBody.length} bytes)`);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', req.rawBody.length);
        proxyReq.write(req.rawBody);
        proxyReq.end();
        console.log(`✅ Raw body forwarded successfully`);
      } else {
        console.log(`⚠️ No body data to forward - ending request`);
        // Nếu không có body, vẫn phải end request
        proxyReq.end();
      }
    }
    // Với GET/DELETE, không cần xử lý body
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`\n💳 ========== PAYMENT PROXY RESPONSE ==========`);
    console.log(`Status: ${proxyRes.statusCode}`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.originalUrl}`);
    console.log(`Headers:`, JSON.stringify(proxyRes.headers, null, 2));
    console.log(`==========================================\n`);
  },
  onError: (err, req, res) => {
    console.error('\n❌ ========== PAYMENT PROXY ERROR ==========');
    console.error(`Time: ${new Date().toISOString()}`);
    console.error(`Error: ${err.message}`);
    console.error(`Error Code: ${err.code}`);
    console.error(`Error Stack: ${err.stack}`);
    console.error(`Request: ${req.method} ${req.originalUrl}`);
    console.error(`==========================================\n`);
    
    if (!res.headersSent) {
      let statusCode = 500;
      let message = 'Lỗi kết nối Payment Service.';
      
      if (err.code === 'ECONNREFUSED') {
        statusCode = 503;
        message = 'Payment Service không chạy hoặc không thể kết nối. Kiểm tra Course Service có đang chạy tại port 3004 không.';
      } else if (err.code === 'ETIMEDOUT') {
        statusCode = 504;
        message = 'Payment Service không phản hồi kịp thời (timeout).';
      } else if (err.code === 'ECONNRESET') {
        statusCode = 502;
        message = 'Payment Service đã đóng kết nối. Có thể do lỗi xử lý request hoặc service crash.';
      }
      
      res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        errorCode: err.code,
        timestamp: new Date().toISOString()
      });
    }
  }
});


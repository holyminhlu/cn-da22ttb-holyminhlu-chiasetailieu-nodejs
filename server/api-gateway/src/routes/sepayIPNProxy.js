const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * SePay IPN Proxy - Route chuyên dụng cho SePay IPN callback
 * Endpoint: /api/payment/sepay/ipn
 * Target: Course Service payment IPN handler
 */
module.exports = createProxyMiddleware({
  target: 'http://localhost:3004', // Course service port
  changeOrigin: true,
  // Path: /api/payment/sepay/ipn -> /payments/ipn in course service
  pathRewrite: { '^/api/payment/sepay/ipn': '/payments/ipn' },
  selfHandleResponse: false,
  timeout: 30000,
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`\n📨 SePay IPN Proxy: ${req.method} ${req.originalUrl} -> http://localhost:3004/payments/ipn`);
    console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
    console.log(`Body:`, req.body ? JSON.stringify(req.body, null, 2) : 'No body');
    
    // Handle JSON body if present (IPN từ SePay là JSON)
    if (req.body && req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
      console.log(`📤 IPN body forwarded (${Buffer.byteLength(bodyData)} bytes)`);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 SePay IPN Proxy Response: ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error('\n❌ SePay IPN Proxy Error:', err.message);
    console.error('Error code:', err.code);
    if (!res.headersSent) {
      let statusCode = 500;
      let message = 'Lỗi kết nối Payment Service.';

      if (err.code === 'ECONNREFUSED') {
        statusCode = 503;
        message = 'Payment Service không chạy hoặc không thể kết nối.';
      } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
        statusCode = 504;
        message = 'Payment Service không phản hồi kịp thời.';
      }

      // QUAN TRỌNG: IPN phải luôn trả về 200 OK để SePay không retry
      // Nhưng log error để xử lý manual
      res.status(200).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        errorCode: err.code,
        note: 'IPN processing error logged for manual review'
      });
    }
  }
});


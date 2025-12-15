const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
  target: 'http://localhost:3005',
  changeOrigin: true,
  // No pathRewrite needed - path is already /posts when mounted at /forum
  // /api/forum/posts -> /forum/posts -> /posts (after router strips /forum)
  selfHandleResponse: false,
  timeout: 30000, // 30 seconds timeout
  proxyTimeout: 30000, // 30 seconds proxy timeout
  onProxyReq: (proxyReq, req, res) => {
    console.log(`\n📤 Forum Proxy: ${req.method} ${req.originalUrl} -> http://localhost:3005${req.url}`);
    console.log(`Content-Type: ${req.headers['content-type']}`);
    
    // Body parsing is skipped in index.js, so http-proxy-middleware will handle raw stream
    // No need to manually write body - it will be streamed automatically
    // For multipart/form-data, http-proxy-middleware will handle it automatically
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Forum Proxy Response: ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error('\n❌ Forum Proxy Error:', err.message);
    console.error('Error code:', err.code);
    if (!res.headersSent) {
      let statusCode = 500;
      let message = 'Lỗi kết nối Forum Service.';
      
      if (err.code === 'ECONNREFUSED') {
        statusCode = 503;
        message = 'Forum Service không chạy hoặc không thể kết nối. Kiểm tra service có đang chạy tại port 3005 không.';
      } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
        statusCode = 504;
        message = 'Forum Service không phản hồi kịp thời.';
      }
      
      res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        errorCode: err.code
      });
    }
  }
});

const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Blog Service Proxy
 * Routes: /api/blogs -> http://localhost:3006/blogs
 */
const BLOG_SERVICE_URL = process.env.BLOG_SERVICE_URL || 'http://localhost:3006';

module.exports = createProxyMiddleware({
  target: BLOG_SERVICE_URL, // Blog service port (đổi từ 3005 vì Forum Service đang dùng port đó)
  changeOrigin: true,
  pathRewrite: (path, req) => {
    // When mounted at /blogs in router, path received is / (root) or /something
    // We need to rewrite to /blogs or /blogs/something
    // Remove leading slash if present, then add /blogs prefix
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    if (cleanPath === '') {
      return '/blogs';  // Root path -> /blogs (no trailing slash)
    }
    return `/blogs/${cleanPath}`;  // Other paths -> /blogs/something
  },
  selfHandleResponse: false,
  timeout: 60000, // 60 seconds timeout
  proxyTimeout: 60000, // 60 seconds proxy timeout
  buffer: false,
  xfwd: true,
  followRedirects: true,
  ws: false,
  onProxyReq: (proxyReq, req, res) => {
    console.log('\n📤 ========== PROXY REQUEST (Blogs) ==========');
    console.log(`Method: ${req.method}`);
    console.log(`Original Path: ${req.originalUrl}`);
    console.log(`Request Path: ${req.path}`);
    console.log(`Rewritten Path: ${req.url}`);
    console.log(`Target: http://localhost:3006${req.url}`);
    console.log(`Content-Type: ${req.headers['content-type'] || 'application/json'}`);
    
    // Handle JSON body
    if (req.body && req.headers['content-type']?.includes('application/json')) {
      let bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
    
    console.log('==========================================\n');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`\n📥 ========== PROXY RESPONSE (Blogs) ==========`);
    console.log(`Status: ${proxyRes.statusCode}`);
    console.log(`Path: ${req.path}`);
    console.log('==========================================\n');
  },
  onError: (err, req, res) => {
    console.error('\n❌ ========== PROXY ERROR (Blogs) ==========');
    console.error(`Error: ${err.message}`);
    console.error(`Error code: ${err.code}`);
    console.error(`Path: ${req.originalUrl}`);
    console.error(`Method: ${req.method}`);
    console.error('==========================================\n');
    
    if (!res.headersSent) {
      let statusCode = 502;
      let message = 'Không thể kết nối đến Blog Service';
      
      if (err.code === 'ECONNREFUSED') {
        statusCode = 503;
        message = 'Blog Service không chạy hoặc không thể kết nối. Kiểm tra service có đang chạy tại port 3006 không.';
      } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
        statusCode = 504;
        message = 'Blog Service không phản hồi kịp thời. Service có thể đang quá tải hoặc gặp lỗi.';
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



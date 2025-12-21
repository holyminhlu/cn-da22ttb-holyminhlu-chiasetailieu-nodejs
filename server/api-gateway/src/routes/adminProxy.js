const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Admin Proxy - Forward /api/admin/* to auth-service
 * Path rewrite: /api/admin -> /admin
 * Example: /api/admin/users -> http://auth-service:3001/admin/users
 */
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

module.exports = createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  // When router matches /admin, Express strips /admin prefix
  // So /api/admin/users becomes /users in req.path
  // We need to add /admin prefix back: /users -> /admin/users
  pathRewrite: { '^/(.*)$': '/admin/$1' },
  selfHandleResponse: false,
  timeout: 30000, // 30 seconds timeout
  proxyTimeout: 30000, // 30 seconds proxy timeout
  onProxyReq: (proxyReq, req, res) => {
    console.log(`\n🔐 ========== ADMIN PROXY REQUEST ==========`);
    console.log(`Original URL: ${req.originalUrl}`);
    console.log(`Request URL (after rewrite): ${req.url}`);
    console.log(`Target: ${AUTH_SERVICE_URL}${req.url}`);
    console.log(`Authorization: ${req.headers['authorization'] ? 'Present' : 'Missing'}`);
    console.log(`==========================================\n`);
    
    // Forward Authorization header (JWT token)
    if (req.headers['authorization']) {
      proxyReq.setHeader('Authorization', req.headers['authorization']);
    }
    
    // Handle JSON body if present
    if (req.body && req.headers['content-type']?.includes('application/json')) {
      let bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📥 Admin Proxy Response: ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error('\n❌ Admin Proxy Error:', err.message);
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        message: 'Không thể kết nối đến Auth Service',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
});


const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' },
  selfHandleResponse: false, // Đảm bảo proxy tự xử lý response
  onProxyReq: (proxyReq, req, res) => {
    // Chỉ xử lý JSON body, multipart/form-data sẽ được pass through tự động
    if (req.body && req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      let bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
    // Với multipart/form-data, không cần can thiệp, multer sẽ tự xử lý
  }
});
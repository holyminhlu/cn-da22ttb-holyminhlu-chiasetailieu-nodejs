const express = require('express');
const cors = require('cors');
const proxyRoutes = require('./routes/proxyRoutes');
const loggerMid = require('./middleware/loggerMid');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration với options cho multipart
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:3003'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Chỉ parse JSON khi không phải multipart/form-data
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    // Skip JSON parsing for multipart/form-data - multer sẽ xử lý
    console.log('📦 Skipping JSON parsing for multipart/form-data');
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(loggerMid);            // ✅ logger có thể đọc body nếu cần
app.use('/api', proxyRoutes);  // ✅ Proxy sau cùng

app.listen(PORT, () => {
  console.log(`API Gateway chạy tại http://localhost:${PORT}`);
});

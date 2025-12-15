const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const postRoute = require('./routes/postRoute');

const app = express();
const PORT = 3005;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:3005'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`\n📥 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body).substring(0, 200));
  }
  next();
});

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/EduShareDB', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('\n✅ ========== MONGODB CONNECTED ==========');
    console.log('Database: EduShareDB');
    console.log('Collection: Posts (Forum)');
    console.log('Connection: mongodb://127.0.0.1:27017/EduShareDB');
    console.log('==========================================\n');
  })
  .catch(err => {
    console.error('\n❌ ========== MONGODB CONNECTION ERROR ==========');
    console.error('Error:', err.message);
    console.error('====================================================\n');
  });

// Routes
app.use('/posts', postRoute);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Forum Service đang chạy bình thường!',
    timestamp: new Date().toISOString(),
    endpoints: {
      getAllPosts: 'GET /posts',
      getPost: 'GET /posts/:id',
      createPost: 'POST /posts',
      updatePost: 'PUT /posts/:id',
      deletePost: 'DELETE /posts/:id',
      toggleLike: 'POST /posts/:id/like',
      addComment: 'POST /posts/:id/comments',
      deleteComment: 'DELETE /posts/:postId/comments/:commentId',
      uploadImage: 'POST /posts/upload-image'
    }
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EduShare Forum Service',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`\n⚠️ 404 NOT FOUND: ${req.method} ${req.path}\n`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} không tồn tại`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('\n❌ ERROR:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi server',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 =======================================');
  console.log(`✅ Forum-Service đang lắng nghe tại http://localhost:${PORT}`);
  console.log(`✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB`);
  console.log(`✅ Collection: Posts`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
  console.log(`✅ Get posts: GET http://localhost:${PORT}/posts`);
  console.log(`✅ Static files: http://localhost:${PORT}/uploads`);
  console.log('======================================\n');
});




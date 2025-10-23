const express = require('express');
const cors = require('cors');
const proxyRoutes = require('./routes/proxyRoutes');
const loggerMid = require('./middleware/loggerMid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());       // ✅ Đặt trước để parse JSON cho mọi request
app.use(loggerMid);            // ✅ logger có thể đọc body nếu cần
app.use('/api', proxyRoutes);  // ✅ Proxy sau cùng

app.listen(PORT, () => {
  console.log(`API Gateway chạy tại http://localhost:${PORT}`);
});

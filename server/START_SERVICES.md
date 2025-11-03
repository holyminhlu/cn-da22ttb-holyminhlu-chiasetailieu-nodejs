# Hướng dẫn chạy Services

## 📋 Yêu cầu

- Node.js >= 14.x
- MongoDB đang chạy tại `localhost:27017`
- npm hoặc yarn

## 🚀 Chạy các Services

### Option 1: Chạy từng service riêng (Khuyến nghị cho development)

Mở **3 terminals** riêng biệt:

#### Terminal 1: API Gateway
```bash
cd server/api-gateway
npm install  # Nếu chưa cài
npm start
```
➡️ Chạy tại: http://localhost:3000

#### Terminal 2: Documents Service
```bash
cd server/documents-service
npm install  # Nếu chưa cài
npm start
```
➡️ Chạy tại: http://localhost:3003

#### Terminal 3: Auth Service (nếu cần)
```bash
cd server/auth-service
npm install  # Nếu chưa cài
npm start
```
➡️ Chạy tại: http://localhost:3001

### Option 2: Chạy với nodemon (tự động restart khi code thay đổi)

```bash
# Terminal 1
cd server/api-gateway
npm run dev

# Terminal 2
cd server/documents-service
npm run dev

# Terminal 3
cd server/auth-service
npm run dev
```

## ✅ Kiểm tra Services đang chạy

### 1. API Gateway
```bash
curl http://localhost:3000/api/documents
```
Hoặc mở browser: http://localhost:3000

### 2. Documents Service
```bash
curl http://localhost:3003/test
```
Hoặc mở browser: http://localhost:3003/test

### 3. Auth Service
```bash
curl http://localhost:3001/test
```
Hoặc mở browser: http://localhost:3001/test

## 🔍 Troubleshooting

### Lỗi: "Port already in use"

Nếu port đã được sử dụng, đổi PORT trong `.env` hoặc kill process:

**Windows:**
```powershell
# Tìm process dùng port 3000
netstat -ano | findstr :3000

# Kill process (thay PID bằng process ID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:3000 | xargs kill
```

### Lỗi: "Cannot connect to MongoDB"

1. Kiểm tra MongoDB đã chạy chưa:
   ```bash
   # Windows
   Get-Service MongoDB

   # Linux/Mac
   sudo systemctl status mongod
   ```

2. Kiểm tra connection string trong code:
   - Documents Service: `mongodb://127.0.0.1:27017/EduShareDB`
   - Auth Service: `mongodb://127.0.0.1:27017/EduShareDB`

### Lỗi: "Module not found"

Chạy `npm install` trong thư mục service bị lỗi:
```bash
cd server/<service-name>
npm install
```

## 📝 Logs

Các services sẽ log ra terminal:
- ✅ Kết nối MongoDB thành công
- 📥 Request logs
- ❌ Error logs

## 🔗 Endpoints

### API Gateway (Port 3000)
- `GET /api/documents` - List documents
- `POST /api/documents` - Create document
- `GET /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Documents Service (Port 3003)
- `GET /documents` - List documents
- `POST /documents` - Create document
- `GET /documents/search?q=...` - Search
- `GET /documents/trending` - Trending

### Auth Service (Port 3001)
- `POST /register` - Register
- `POST /login` - Login
- `GET /test` - Test endpoint

---

**Tip**: Luôn chạy API Gateway trước, sau đó mới chạy các services khác.


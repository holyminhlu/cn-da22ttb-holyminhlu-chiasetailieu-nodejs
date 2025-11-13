# 🔄 RESTART SERVICES - Instructions

## ⚠️ IMPORTANT: All Required Services

To run the application, you need **4 services** running in **separate terminals**:

1. **API Gateway** (Port 3000) - **REQUIRED** - Routes all frontend requests
2. **Auth Service** (Port 3001) - User authentication
3. **Document Service** (Port 3003) - Document management
4. **Course Service** (Port 3004) - Course management

## 🚀 Starting All Services

### Terminal 1: API Gateway (PORT 3000) - **CRITICAL**
```bash
cd server/api-gateway
npm start
```
**Expected Output:**
```
API Gateway chạy tại http://localhost:3000
Test endpoint: http://localhost:3000/test
Courses endpoint: http://localhost:3000/api/courses
```

### Terminal 2: Auth Service (PORT 3001)
```bash
cd server/auth-service
npm start
```
**Expected Output:**
```
✅ Auth-Service đang lắng nghe tại http://localhost:3001
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
✅ Test endpoint: http://localhost:3001/test
```

### Terminal 3: Document Service (PORT 3003)
```bash
cd server/document-service
npm start
```
**Expected Output:**
```
✅ Document-Service đang lắng nghe tại http://localhost:3003
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
✅ Test endpoint: http://localhost:3003/test
```

### Terminal 4: Course Service (PORT 3004)
```bash
cd server/course-service
npm start
```
**Expected Output:**
```
✅ Course-Service đang lắng nghe tại http://localhost:3004
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
✅ Test endpoint: http://localhost:3004/test
```

## ✅ Quick Health Check

After starting all services, verify they're running:

```bash
# Test API Gateway
curl http://localhost:3000/test

# Test Auth Service
curl http://localhost:3001/test

# Test Document Service
curl http://localhost:3003/test

# Test Course Service
curl http://localhost:3004/test

# Test Courses through API Gateway
curl http://localhost:3000/api/courses?limit=5
```

## 🔍 Troubleshooting

### Frontend shows "Cannot load course list"

Check:
1. ✅ **API Gateway running?** (Port 3000) - **Most common issue!**
2. ✅ Course Service running? (Port 3004)
3. ✅ MongoDB data imported? (Check if courses exist)

### Proxy Error: ECONNREFUSED

This means API Gateway (port 3000) is **NOT running**. Start it in a separate terminal.

### Service won't start

1. Check if port is already in use:
   ```bash
   netstat -ano | findstr :3000
   ```
2. Kill process if needed:
   ```bash
   taskkill /PID <PID> /F
   ```
3. Restart service

## 📝 Notes

- **Always start API Gateway first** - Frontend depends on it
- Keep all services running in separate terminal windows
- If you change any service code, restart that specific service
- If you change API Gateway proxy routes, restart API Gateway


# 🔄 RESTART SERVICES - Instructions

## Current Issue
Document Service chưa được restart sau khi đổi mount từ `/documents` → `/`

## Solution: Restart Document Service

### Steps:
1. **Go to Document Service terminal**
2. **Stop service**: Press `Ctrl+C`
3. **Restart**: Run `npm start` again

### Expected Output:
```
📋 Loading document routes...
✅ Controllers loaded successfully

🚀 =======================================
✅ Document-Service đang lắng nghe tại http://localhost:3003
✅ MongoDB: mongodb://127.0.0.1:27017/EduShareDB
✅ Test endpoint: http://localhost:3003/test
✅ Upload: POST http://localhost:3003/documents/upload
✅ List: GET http://localhost:3003/documents
======================================

✅ Kết nối MongoDB thành công
```

### After Restart:
Try upload from frontend again and check if "Route hit: POST /upload" appears in logs

## Also Restart API Gateway (if needed)

If you changed proxyRoutes.js, restart Gateway too:
1. Stop: `Ctrl+C`
2. Start: `npm start`

## Quick Check

```bash
# Test if service is using new code
curl http://localhost:3003/test
```

If still shows old endpoints, service not restarted!


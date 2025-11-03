# ⚠️ ACTION REQUIRED - Restart Service

## Current Status

✅ **Code đã được sửa:**
- Document Service: Changed mount from `/documents` → `/`
- Proxy: Added pathRewrite to strip `/documents`
- Routes: POST `/upload` is defined

❌ **Service chưa restart:**
- Service đang chạy với code cũ (PID 17356)
- Vẫn expect `/documents/upload` → nhận `/upload` → 404

## 🔄 RESTART NOW

### Option 1: Manual Restart
```
1. Tìm terminal đang chạy Document Service
2. Ctrl+C để dừng
3. Chạy lại: npm start
```

### Option 2: Script Restart
```powershell
cd server/document-service
.\restart-service.ps1
```

### Option 3: Kill & Restart
```powershell
taskkill /PID 17356 /F
cd server/document-service  
npm start
```

## ✅ Verification

Sau khi restart, kiểm tra:

```bash
# 1. Test endpoint
curl http://localhost:3003/test

# 2. Check logs có:
# - "Loading document routes..."
# - "Controllers loaded successfully"

# 3. Test upload từ frontend
# - Should see "Route hit: POST /upload"
# - Should NOT see 404 error
```

## 📊 Expected Flow After Restart

```
Frontend: POST /api/documents/upload
    ↓
Gateway: /documents/upload
    ↓  
Proxy: pathRewrite → /upload
    ↓
Document Service: POST /upload ✅
    ↓
Route matches! ✅
    ↓
Upload handler executes ✅
```

## 🎯 Next Steps

1. **Restart Document Service** (BẮT BUỘC)
2. **Test upload** từ frontend
3. **Verify** file saved và metadata in MongoDB
4. **Check logs** không có lỗi

---

**Priority:** 🔴 HIGH - Cannot proceed without restart  
**Time Required:** ~30 seconds  
**Impact:** Upload will NOT work until service restarted


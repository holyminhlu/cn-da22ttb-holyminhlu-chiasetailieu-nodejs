# Final Test Checklist

## ✅ Configuration Fixed

### Changes Made:
1. **Document Service index.js**: Changed mount from `/documents` to `/`
2. **documentsProxy.js**: Added `pathRewrite: { '^/documents': '' }`
3. Added debug logging to proxyRoutes

### Request Flow:
```
Frontend: POST /api/documents/upload
    ↓
Gateway (index.js): Strip /api → /documents/upload
    ↓
proxyRoutes: Match /documents → /documents/upload  
    ↓
documentsProxy: pathRewrite ^/documents → /upload
    ↓
Document Service: Handle /upload ✅
```

## 🚀 Next Steps

### 1. Restart Services
```bash
# Restart Document Service
cd server/document-service
npm start

# Restart API Gateway (in another terminal)
cd server/api-gateway  
npm start
```

### 2. Test Upload
1. Open browser: http://localhost:8080
2. Login
3. Click "Tải lên tài liệu" (📤)
4. Fill form
5. Upload file
6. Verify success

### 3. Check Logs

**Expected Gateway logs:**
```
🎯 documentsProxy middleware matched! Path: /upload Original: /documents/upload
📤 ========== PROXY REQUEST (Documents) ==========
Rewritten Path: /upload
Proxying to: http://localhost:3003/upload
```

**Expected Document Service logs:**
```
🎯 Route hit: POST /upload
📄 Saving file as: ...
✅ Document saved successfully
```

### 4. Verify Results

**Database:**
- Document saved in TaiLieu collection
- All metadata present

**File System:**
- File in server/uploads/documents/
- Thumbnail in server/uploads/thumbnails/ (if provided)

**API Response:**
- Status: 201 Created
- Success: true
- document_id returned

## ✅ Success Criteria

- [ ] Upload completes without errors
- [ ] File saved to filesystem
- [ ] Metadata in MongoDB
- [ ] Success response returned
- [ ] Frontend shows success message
- [ ] No 404 errors
- [ ] No proxy errors

## 🐛 If Still Failing

Check:
1. Services restarted?
2. MongoDB running?
3. Port 3003 available?
4. Port 3000 available?
5. File permissions OK?
6. Check full logs

## 📝 Notes

- Proxy now strips /documents prefix
- Document Service expects /upload
- All routes handle /upload, /, /:id
- Test endpoint still at /test


# Document Service - Deployment Checklist

## ✅ Đã Hoàn Thành

### Service Structure
- [x] document-service directory created
- [x] package.json with all dependencies
- [x] index.js entry point (port 3003)
- [x] controllers/documentController.js
- [x] models/documentModel.js
- [x] routes/documentRoute.js
- [x] node_modules installed

### MongoDB Integration
- [x] Mongoose connection to EduShareDB
- [x] TaiLieu collection schema
- [x] Auto-generate document_id
- [x] Indexes configured
- [x] Validation rules set

### File Upload System
- [x] Multer configured
- [x] Document upload (PDF, PPTX, DOCX, ZIP)
- [x] Thumbnail upload (optional)
- [x] File size limits (50MB/5MB)
- [x] uploads/ directories created
- [x] Unique file naming
- [x] Error cleanup

### API Endpoints
- [x] POST /documents/upload
- [x] GET /documents (with pagination, filtering, search)
- [x] GET /documents/:id
- [x] GET /test (health check)

### API Gateway
- [x] documentsProxy.js configured
- [x] proxyRoutes.js updated
- [x] Multipart handling correct
- [x] CORS configured
- [x] Error handling

### Frontend Integration
- [x] UploadModal component works
- [x] Multi-step form (4 steps)
- [x] File validation
- [x] Progress tracking
- [x] Error handling
- [x] Success confirmation

### Documentation
- [x] DOCUMENT_SERVICE_GUIDE.md
- [x] UPLOAD_SETUP_GUIDE.md
- [x] DOCUMENT_SERVICE_SUMMARY.md
- [x] README.md
- [x] DEPLOYMENT_CHECKLIST.md

## 🧪 Testing Checklist

### Basic Tests
- [ ] Service starts without errors
- [ ] MongoDB connection works
- [ ] Test endpoint responds
- [ ] Health check passes

### Upload Tests
- [ ] Upload document without thumbnail
- [ ] Upload document with thumbnail
- [ ] Validate file type rejection
- [ ] Validate file size rejection
- [ ] Test error cleanup

### API Tests
- [ ] POST /documents/upload
- [ ] GET /documents
- [ ] GET /documents?page=2
- [ ] GET /documents?search=query
- [ ] GET /documents?program=X
- [ ] GET /documents/:id

### Integration Tests
- [ ] API Gateway routing
- [ ] Frontend upload flow
- [ ] File serving
- [ ] Database persistence
- [ ] File system storage

## 🚀 Deployment Steps

### 1. Start Services

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Document Service
cd server/document-service
npm start

# Terminal 3: API Gateway
cd server/api-gateway
npm start

# Terminal 4: Frontend
cd client/olf
npm run serve
```

### 2. Verify Services

```bash
# Test MongoDB
mongo
> use EduShareDB
> db.TaiLieu.find()

# Test Document Service
curl http://localhost:3003/test

# Test API Gateway
curl http://localhost:3000/api/documents

# Test Frontend
Open http://localhost:8080 in browser
```

### 3. Test Upload

1. Login to website
2. Click upload button
3. Fill all steps
4. Upload document
5. Verify success
6. Check MongoDB
7. Check file system

## 📊 Expected Results

### Successful Upload
- HTTP 201 response
- Document saved in MongoDB
- File saved in uploads/documents/
- Thumbnail saved in uploads/thumbnails/
- Success message in UI

### MongoDB Record
```json
{
  "document_id": "doc_xxx",
  "title": "...",
  "file_path": "/uploads/documents/...",
  "thumbnail_path": "/uploads/thumbnails/...",
  ...
}
```

### File System
```
server/uploads/
├── documents/
│   └── [timestamp]-[random].pdf
└── thumbnails/
    └── thumb_[timestamp]-[random].jpg
```

## ⚠️ Troubleshooting

### Common Issues

1. **MongoDB not running**
   - Solution: Start `mongod`

2. **Port already in use**
   - Solution: Kill process or change port

3. **Multer error**
   - Solution: Check file permissions

4. **Proxy error**
   - Solution: Verify API Gateway config

5. **File not served**
   - Solution: Check static file serving

## 🔐 Security Checklist

- [ ] Add authentication middleware
- [ ] Implement role-based access
- [ ] Add rate limiting
- [ ] Validate file content
- [ ] Add virus scanning
- [ ] Sanitize file names
- [ ] Set proper CORS
- [ ] Use HTTPS in production

## 📈 Future Enhancements

- [ ] Cloud storage integration (S3, etc.)
- [ ] Preview generation
- [ ] OCR support
- [ ] Advanced search
- [ ] Document versioning
- [ ] Download tracking
- [ ] Analytics dashboard
- [ ] Batch upload
- [ ] Document categories
- [ ] Rating/review system

## 📞 Support

If issues occur:
1. Check service logs
2. Verify MongoDB connection
3. Check file permissions
4. Review error messages
5. Test individual components
6. Check documentation

## ✅ Final Verification

Before marking as complete:
- [ ] All services running
- [ ] All tests passing
- [ ] Documentation complete
- [ ] No errors in logs
- [ ] Upload works end-to-end
- [ ] Files accessible
- [ ] Search functional
- [ ] UI responsive

---

**Status:** ✅ Ready for Testing
**Date:** 2025-01-XX
**Version:** 1.0.0


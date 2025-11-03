# Quick Fix: Proxy Issue với Multipart/Form-Data

## Vấn đề
Request từ frontend đang đến trực tiếp document-service (`localhost:3003`) thay vì qua API Gateway (`localhost:3000`), dẫn đến path sai (`/upload` thay vì `/documents/upload`).

## Nguyên nhân
`http-proxy-middleware` có thể không handle multipart/form-data stream đúng cách, khiến request bị redirect hoặc retry trực tiếp.

## Giải pháp

### Option 1: Thêm route redirect trong document-service (Temporary Fix)

Thêm route để catch và redirect:

```javascript
// Trong server/document-service/index.js
app.post('/upload', (req, res) => {
    console.log('⚠️ Direct /upload request detected, redirecting...');
    // Không thể redirect POST, nên trả về error message
    return res.status(404).json({
        success: false,
        message: 'Vui lòng sử dụng API Gateway: http://localhost:3000/api/documents/upload',
        correctEndpoint: 'http://localhost:3000/api/documents/upload'
    });
});
```

### Option 2: Sửa Frontend để handle error và retry (Recommended)

Update UploadModal.vue để retry với correct endpoint nếu fail:

```javascript
// Trong handleUpload function
const uploadPromise = new Promise((resolve, reject) => {
    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Success
        } else if (xhr.status === 404 && xhr.responseText.includes('correctEndpoint')) {
            // Retry với correct endpoint
            console.log('🔄 Retrying with correct endpoint...');
            // Retry logic here
        }
    });
});
```

### Option 3: Fix Proxy Configuration (Best Solution)

Đảm bảo proxy không modify body cho multipart:

```javascript
// Trong documentsProxy.js
onProxyReq: (proxyReq, req, res) => {
    // QUAN TRỌNG: Không modify body cho multipart
    if (!req.headers['content-type']?.includes('multipart/form-data')) {
        // Only handle JSON here
    }
    // Multipart sẽ được stream tự động
}
```

## Bước thực hiện ngay

1. **Restart cả 2 services:**
   ```bash
   # Terminal 1: API Gateway
   cd server/api-gateway
   npm start
   
   # Terminal 2: Document Service  
   cd server/document-service
   npm start
   ```

2. **Clear browser cache và cookies**

3. **Test lại upload**

4. **Kiểm tra Network tab trong DevTools:**
   - Request URL phải là: `http://localhost:3000/api/documents/upload`
   - KHÔNG phải: `http://localhost:3003/upload`

5. **Nếu vẫn lỗi, thử test trực tiếp:**
   ```bash
   curl -X POST http://localhost:3000/api/documents/upload \
     -F "file=@test.pdf" \
     -F "title=Test" \
     -F "description=Test" \
     -F "uploaderId=test" \
     -F "license=CC-BY"
   ```


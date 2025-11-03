# Debug Proxy Issue

## Current Problem
Document Service nhận `/upload` thay vì `/documents/upload`

## Analysis
Request flow:
1. Frontend: `POST /api/documents/upload`
2. Gateway index.js: mount `/api`, receive `/api/documents/upload`
3. Gateway strip `/api` → path becomes `/documents/upload` 
4. Forward to proxyRoutes
5. proxyRoutes: mount `/documents`, should match `/documents/upload`
6. Proxy forward to Document Service
7. Document Service: expect `/documents/upload`, but receiving `/upload`

## Issue
Path is getting truncated somewhere in the proxy chain

## Fix Attempted
1. Removed pathRewrite from documentsProxy.js
2. Added debug logging to proxyRoutes

## Next Steps
1. Restart API Gateway (Ctrl+C and `npm start` again)
2. Try upload from frontend
3. Check logs for debug messages
4. Verify path at each step

## Expected Logs
```
🎯 documentsProxy middleware matched! Path: /upload Original: /documents/upload
📤 ========== PROXY REQUEST (Documents) ==========
Proxying to: http://localhost:3003/upload
```

## Current Logs
Document Service receives `/upload` - wrong!

## Solution
Need to fix path forwarding in http-proxy-middleware config


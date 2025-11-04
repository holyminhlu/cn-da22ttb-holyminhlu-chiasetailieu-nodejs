module.exports = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  
  // Log POST/PUT/PATCH requests with body (skip multipart/form-data)
  if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') && 
      req.body && 
      !req.headers['content-type']?.includes('multipart/form-data')) {
    console.log(`[${timestamp}] Request body:`, JSON.stringify(req.body));
  } else if (req.headers['content-type']?.includes('multipart/form-data')) {
    console.log(`[${timestamp}] Multipart/form-data request - skipping body log`);
  }
  
  next();
};
module.exports = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  
  // Log POST/PUT/PATCH requests with body
  if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') && req.body) {
    console.log(`[${timestamp}] Request body:`, JSON.stringify(req.body));
  }
  
  next();
};
/**
 * Test script để kiểm tra route /users có hoạt động không
 * Chạy: node test-users-route.js
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/users',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('\n🧪 Testing GET /users endpoint...\n');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log(data);
    }
    
    if (res.statusCode === 200) {
      console.log('\n✅ Route /users is working!');
    } else if (res.statusCode === 404) {
      console.log('\n❌ Route /users not found. Make sure auth service is restarted after adding routes.');
    } else {
      console.log(`\n⚠️ Unexpected status code: ${res.statusCode}`);
    }
    
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('\n❌ Error:', error.message);
  console.error('Make sure auth service is running on port 3001');
  process.exit(1);
});

req.end();


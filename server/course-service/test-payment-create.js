/**
 * Test Payment Create Endpoint
 * Usage: node test-payment-create.js
 */

const http = require('http');

const testData = {
  course_id: '693fc2fac94fc9a5544e6065', // MongoDB _id
  user_id: '6908204708e0d1762ce43424'
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3004,
  path: '/payments/create',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  },
  timeout: 10000
};

console.log('🧪 Testing Payment Create Endpoint...');
console.log('Request:', testData);
console.log('URL: http://localhost:3004/payments/create\n');

const startTime = Date.now();

const req = http.request(options, (res) => {
  const elapsed = Date.now() - startTime;
  
  console.log(`\n✅ Response received in ${elapsed}ms`);
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📦 Response Body:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
      
      if (json.success && json.data && json.data.payment_url) {
        console.log('\n✅ SUCCESS: Payment created!');
        console.log(`Payment URL: ${json.data.payment_url}`);
      } else {
        console.log('\n❌ FAILED: Payment not created');
        console.log('Response:', json);
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  const elapsed = Date.now() - startTime;
  console.error(`\n❌ Request error after ${elapsed}ms:`);
  console.error('Error:', error.message);
  console.error('Code:', error.code);
  
  if (error.code === 'ECONNREFUSED') {
    console.error('\n💡 Course Service không chạy tại port 3004');
    console.error('   Fix: cd server/course-service && npm start');
  } else if (error.code === 'ETIMEDOUT') {
    console.error('\n💡 Request timeout - service không phản hồi');
  }
});

req.on('timeout', () => {
  const elapsed = Date.now() - startTime;
  console.error(`\n⏱️ Request timeout after ${elapsed}ms`);
  req.destroy();
});

req.setTimeout(10000);

req.write(postData);
req.end();


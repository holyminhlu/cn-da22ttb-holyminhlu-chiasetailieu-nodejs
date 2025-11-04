// Test Register Endpoint
const http = require('http');

const testData = {
    fullName: 'Test User',
    email: `test_${Date.now()}@example.com`,
    passWord: 'password123',
    phone: '0123456789'
};

const postData = JSON.stringify(testData);

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('🧪 Testing Register Endpoint...\n');
console.log('Request Data:', testData);
console.log('\n---\n');

const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    console.log('\n---\n');

    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            console.log('✅ Response:');
            console.log(JSON.stringify(response, null, 2));
        } catch (e) {
            console.log('📄 Raw Response:');
            console.log(data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request Error:');
    console.error(error);
});

req.write(postData);
req.end();






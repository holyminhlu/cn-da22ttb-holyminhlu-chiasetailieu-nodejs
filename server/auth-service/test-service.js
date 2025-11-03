// Comprehensive Service Test
const http = require('http');

const BASE_URL = 'http://localhost:3001';

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const postData = data ? JSON.stringify(data) : null;

        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (postData) {
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }

        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(responseData);
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: jsonData
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: responseData
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (postData) {
            req.write(postData);
        }

        req.end();
    });
}

async function runTests() {
    log('\n🧪 ========== SERVICE TEST ==========\n', 'blue');

    // Test 1: Root endpoint
    log('Test 1: GET / (Root endpoint)', 'yellow');
    try {
        const result = await makeRequest('GET', '/');
        if (result.statusCode === 200) {
            log('✅ Root endpoint OK', 'green');
            console.log('Response:', JSON.stringify(result.data, null, 2));
        } else {
            log(`❌ Root endpoint failed: ${result.statusCode}`, 'red');
        }
    } catch (error) {
        log(`❌ Root endpoint error: ${error.message}`, 'red');
        log('💡 Service có thể chưa chạy. Chạy: npm start', 'yellow');
        return;
    }

    // Test 2: Test endpoint
    log('\nTest 2: GET /test', 'yellow');
    try {
        const result = await makeRequest('GET', '/test');
        if (result.statusCode === 200) {
            log('✅ Test endpoint OK', 'green');
            console.log('Response:', JSON.stringify(result.data, null, 2));
        } else {
            log(`❌ Test endpoint failed: ${result.statusCode}`, 'red');
        }
    } catch (error) {
        log(`❌ Test endpoint error: ${error.message}`, 'red');
    }

    // Test 3: Register endpoint (POST)
    log('\nTest 3: POST /register', 'yellow');
    try {
        const registerData = {
            fullName: 'Test User',
            email: `test_${Date.now()}@example.com`,
            passWord: 'password123'
        };
        
        const result = await makeRequest('POST', '/register', registerData);
        log(`Status: ${result.statusCode}`, result.statusCode === 201 ? 'green' : 'red');
        console.log('Response:', JSON.stringify(result.data, null, 2));
        
        if (result.statusCode === 201) {
            log('✅ Register OK', 'green');
        } else {
            log('❌ Register failed', 'red');
        }
    } catch (error) {
        log(`❌ Register error: ${error.message}`, 'red');
        console.error(error);
    }

    // Test 4: Login endpoint (POST)
    log('\nTest 4: POST /login', 'yellow');
    try {
        const loginData = {
            email: 'test@example.com',
            passWord: 'password123'
        };
        
        const result = await makeRequest('POST', '/login', loginData);
        log(`Status: ${result.statusCode}`, result.statusCode === 200 ? 'green' : 'yellow');
        console.log('Response:', JSON.stringify(result.data, null, 2));
    } catch (error) {
        log(`❌ Login error: ${error.message}`, 'red');
    }

    // Test 5: Wrong method (GET on POST endpoint)
    log('\nTest 5: GET /register (should fail)', 'yellow');
    try {
        const result = await makeRequest('GET', '/register');
        log(`Status: ${result.statusCode}`, result.statusCode === 405 ? 'green' : 'red');
        console.log('Response:', JSON.stringify(result.data, null, 2));
    } catch (error) {
        log(`❌ Error: ${error.message}`, 'red');
    }

    log('\n✅ ========== TEST COMPLETE ==========\n', 'blue');
}

// Run tests
runTests().catch(error => {
    log(`\n💥 Fatal error: ${error.message}`, 'red');
    process.exit(1);
});





// Script tự động start service và test
const { spawn, exec } = require('child_process');
const http = require('http');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkService() {
    return new Promise((resolve) => {
        log('\n🔍 Checking if service is running...', 'yellow');
        
        const req = http.request({
            hostname: 'localhost',
            port: 3001,
            path: '/test',
            method: 'GET',
            timeout: 2000
        }, (res) => {
            log('✅ Service is already running!', 'green');
            resolve(true);
        });
        
        req.on('error', () => {
            log('❌ Service is not running', 'red');
            resolve(false);
        });
        
        req.on('timeout', () => {
            req.destroy();
            log('❌ Service timeout (not running)', 'red');
            resolve(false);
        });
        
        req.end();
    });
}

function startService() {
    return new Promise((resolve, reject) => {
        log('\n🚀 Starting auth-service...', 'blue');
        log('   This will start in background...', 'yellow');
        
        const serviceProcess = spawn('npm', ['start'], {
            cwd: __dirname,
            stdio: 'pipe',
            shell: true
        });
        
        let serviceReady = false;
        let startupOutput = '';
        
        serviceProcess.stdout.on('data', (data) => {
            const output = data.toString();
            startupOutput += output;
            process.stdout.write(output);
            
            // Check if service is ready
            if (output.includes('Auth-Service đang lắng nghe') || 
                output.includes('listening')) {
                if (!serviceReady) {
                    serviceReady = true;
                    log('\n✅ Service started successfully!', 'green');
                    setTimeout(() => resolve(serviceProcess), 2000);
                }
            }
        });
        
        serviceProcess.stderr.on('data', (data) => {
            const output = data.toString();
            process.stderr.write(output);
            
            // Check for errors
            if (output.includes('Error') || output.includes('EADDRINUSE')) {
                log('\n❌ Error starting service', 'red');
                reject(new Error('Service failed to start'));
            }
        });
        
        serviceProcess.on('error', (error) => {
            log(`\n❌ Failed to start service: ${error.message}`, 'red');
            reject(error);
        });
        
        // Timeout after 30 seconds
        setTimeout(() => {
            if (!serviceReady) {
                // Check if service is actually running
                checkService().then((running) => {
                    if (running) {
                        log('\n✅ Service appears to be running!', 'green');
                        resolve(serviceProcess);
                    } else {
                        log('\n⚠️ Service may still be starting...', 'yellow');
                        log('   Check manually: npm start', 'yellow');
                        reject(new Error('Service startup timeout'));
                    }
                });
            }
        }, 30000);
    });
}

function testRegister() {
    return new Promise((resolve, reject) => {
        const testData = {
            fullName: 'Test User Auto',
            email: `test_auto_${Date.now()}@example.com`,
            passWord: 'password123'
        };

        const postData = JSON.stringify(testData);

        log('\n🧪 Testing register endpoint...', 'blue');

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

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.success) {
                        log('✅ REGISTER TEST: SUCCESS!', 'green');
                        log(`   User created: ${response.data?.user?.email}`, 'cyan');
                        resolve(true);
                    } else {
                        log('❌ REGISTER TEST: FAILED', 'red');
                        log(`   Message: ${response.message}`, 'red');
                        resolve(false);
                    }
                } catch (e) {
                    log('⚠️ Could not parse response', 'yellow');
                    log(`   Status: ${res.statusCode}`, 'yellow');
                    log(`   Body: ${data}`, 'yellow');
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            log(`❌ Request error: ${error.message}`, 'red');
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    log('\n' + '='.repeat(60), 'blue');
    log('🚀 AUTO START & TEST - Auth Service', 'blue');
    log('='.repeat(60) + '\n', 'blue');
    
    try {
        // Check if service is running
        const isRunning = await checkService();
        
        let serviceProcess = null;
        
        if (!isRunning) {
            // Start service
            log('\n📦 Service không chạy. Đang khởi động...', 'yellow');
            serviceProcess = await startService();
            
            // Wait a bit for service to be ready
            log('\n⏳ Waiting for service to be ready...', 'yellow');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Verify service is running
            const verified = await checkService();
            if (!verified) {
                log('\n❌ Service failed to start properly', 'red');
                log('💡 Start manually: npm start', 'yellow');
                process.exit(1);
            }
        }
        
        // Test register
        log('\n' + '─'.repeat(60), 'blue');
        const testResult = await testRegister();
        
        // Summary
        log('\n' + '='.repeat(60), testResult ? 'green' : 'red');
        if (testResult) {
            log('✅ TẤT CẢ TEST PASS!', 'green');
            log('   Backend hoạt động bình thường!', 'green');
            log('\n💡 Service đang chạy. Có thể test từ client bây giờ!', 'yellow');
        } else {
            log('❌ TEST FAILED', 'red');
            log('   Xem error message ở trên để fix', 'red');
        }
        log('='.repeat(60) + '\n', testResult ? 'green' : 'red');
        
        // Keep service running
        if (serviceProcess) {
            log('💡 Service đang chạy trong background.', 'yellow');
            log('   Để stop: Tìm process và kill hoặc Ctrl+C trong terminal khác', 'yellow');
        }
        
        // Exit if service was started by us (optional)
        // Or keep running if you want
        // process.exit(testResult ? 0 : 1);
        
    } catch (error) {
        log(`\n💥 Fatal error: ${error.message}`, 'red');
        console.error(error);
        process.exit(1);
    }
}

main();







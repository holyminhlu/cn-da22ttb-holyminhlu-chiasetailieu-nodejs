// Run All Debug Tests - Tổng hợp tất cả debug
const { spawn } = require('child_process');
const path = require('path');

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

function runScript(scriptName) {
    return new Promise((resolve, reject) => {
        log(`\n🚀 Running: ${scriptName}`, 'blue');
        log('─'.repeat(50), 'blue');
        
        const scriptPath = path.join(__dirname, scriptName);
        const process = spawn('node', [scriptPath], {
            cwd: __dirname,
            stdio: 'inherit'
        });
        
        process.on('close', (code) => {
            if (code === 0) {
                log(`\n✅ ${scriptName} completed`, 'green');
                resolve(true);
            } else {
                log(`\n❌ ${scriptName} failed with code ${code}`, 'red');
                resolve(false);
            }
        });
        
        process.on('error', (error) => {
            log(`\n❌ Error running ${scriptName}: ${error.message}`, 'red');
            reject(error);
        });
    });
}

async function main() {
    log('\n' + '='.repeat(60), 'blue');
    log('🔍 DEBUG REGISTER - CHẠY TẤT CẢ KIỂM TRA', 'blue');
    log('='.repeat(60) + '\n', 'blue');
    
    log('📋 Scripts sẽ chạy:', 'cyan');
    log('  1. debug-register.js - Kiểm tra hệ thống', 'cyan');
    log('  2. debug-request.js - Test request (cần service chạy)', 'cyan');
    log('\n💡 Đảm bảo service đang chạy: npm start', 'yellow');
    log('─'.repeat(60) + '\n', 'blue');
    
    try {
        // Run system check
        await runScript('debug-register.js');
        
        log('\n' + '─'.repeat(60), 'blue');
        log('⚠️  Tiếp theo sẽ test request. Đảm bảo service đang chạy!', 'yellow');
        log('   Nhấn Ctrl+C để bỏ qua hoặc đợi 3 giây...', 'yellow');
        log('─'.repeat(60) + '\n', 'blue');
        
        // Wait 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Run request test
        await runScript('debug-request.js');
        
        log('\n' + '='.repeat(60), 'green');
        log('✅ HOÀN TẤT TẤT CẢ KIỂM TRA', 'green');
        log('='.repeat(60) + '\n', 'green');
        
    } catch (error) {
        log(`\n💥 Fatal error: ${error.message}`, 'red');
        process.exit(1);
    }
}

main();






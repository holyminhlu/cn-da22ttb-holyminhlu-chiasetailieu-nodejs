/**
 * Payment API Test Script
 * Usage: node test-payment.js [course_id] [user_id]
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/payments';
const COURSE_ID = process.argv[2] || 'YOUR_COURSE_ID';
const USER_ID = process.argv[3] || 'YOUR_USER_ID';

// Colors for console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testConnectivity() {
  log('\n🧪 Test 1: Testing API Gateway connectivity...', 'yellow');
  try {
    const response = await axios.get('http://localhost:3000/test', { timeout: 5000 });
    if (response.data.success) {
      log('✅ API Gateway is running', 'green');
      return true;
    }
  } catch (error) {
    log('❌ API Gateway is not running', 'red');
    return false;
  }
}

async function testCourseService() {
  log('\n🧪 Test 2: Testing Course Service connectivity...', 'yellow');
  try {
    const response = await axios.get('http://localhost:3004/test', { timeout: 5000 });
    if (response.data.success) {
      log('✅ Course Service is running', 'green');
      return true;
    }
  } catch (error) {
    log('❌ Course Service is not running', 'red');
    return false;
  }
}

async function testPaymentRoute() {
  log('\n🧪 Test 3: Testing Payment Route...', 'yellow');
  try {
    const response = await axios.get(BASE_URL, { timeout: 5000 });
    if (response.data.success) {
      log('✅ Payment Route is accessible', 'green');
      return true;
    }
  } catch (error) {
    log('❌ Payment Route is not accessible', 'red');
    return false;
  }
}

async function testCreatePayment() {
  log('\n🧪 Test 4: Creating payment...', 'yellow');
  log(`Course ID: ${COURSE_ID}`, 'yellow');
  log(`User ID: ${USER_ID}`, 'yellow');
  
  if (COURSE_ID === 'YOUR_COURSE_ID' || USER_ID === 'YOUR_USER_ID') {
    log('⚠️  Please provide valid course_id and user_id', 'yellow');
    log('Usage: node test-payment.js <course_id> <user_id>', 'yellow');
    return null;
  }
  
  const startTime = Date.now();
  
  try {
    const response = await axios.post(BASE_URL, {
      course_id: COURSE_ID,
      user_id: USER_ID,
      customer_name: 'Test User',
      customer_email: 'test@example.com',
      customer_phone: '0123456789'
    }, {
      timeout: 30000
    });
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    
    log(`\n✅ Payment created successfully (${elapsed}s)`, 'green');
    log(`HTTP Status: ${response.status}`, 'green');
    console.log('\nResponse:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    
    log(`\n❌ Payment creation failed (${elapsed}s)`, 'red');
    
    if (error.response) {
      log(`HTTP Status: ${error.response.status}`, 'red');
      log('Error Response:', 'red');
      console.log(JSON.stringify(error.response.data, null, 2));
    } else if (error.code === 'ECONNABORTED') {
      log('Error: Request timeout', 'red');
    } else {
      log(`Error: ${error.message}`, 'red');
    }
    
    return null;
  }
}

async function testGetPaymentStatus(paymentId) {
  if (!paymentId) return;
  
  log('\n🧪 Test 5: Getting payment status...', 'yellow');
  
  try {
    const response = await axios.get(`${BASE_URL}/${paymentId}/status`, {
      timeout: 10000
    });
    
    if (response.data.success) {
      log('✅ Payment status retrieved', 'green');
      console.log('\nResponse:', JSON.stringify(response.data, null, 2));
    } else {
      log('❌ Failed to get payment status', 'red');
    }
  } catch (error) {
    log('❌ Failed to get payment status', 'red');
    if (error.response) {
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      log(`Error: ${error.message}`, 'red');
    }
  }
}

async function runTests() {
  log('🧪 Payment API Test Script', 'yellow');
  log('================================', 'yellow');
  
  // Test connectivity
  const gatewayOk = await testConnectivity();
  if (!gatewayOk) {
    log('\n❌ API Gateway is not running. Please start it first.', 'red');
    process.exit(1);
  }
  
  const courseServiceOk = await testCourseService();
  if (!courseServiceOk) {
    log('\n❌ Course Service is not running. Please start it first.', 'red');
    process.exit(1);
  }
  
  await testPaymentRoute();
  
  // Test create payment
  const paymentData = await testCreatePayment();
  
  // Test get payment status
  if (paymentData && paymentData.data && paymentData.data.payment_id) {
    await testGetPaymentStatus(paymentData.data.payment_id);
  }
  
  log('\n✅ All tests completed!', 'green');
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test script error: ${error.message}`, 'red');
  process.exit(1);
});


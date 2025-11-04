// Quick test script to check if courses route is working
const axios = require('axios');

async function testRoute() {
  console.log('\n🧪 Testing API Gateway courses route...\n');
  
  try {
    // Test 1: Test endpoint
    console.log('1️⃣ Testing /test endpoint...');
    const testRes = await axios.get('http://localhost:3000/test');
    console.log('✅ /test:', testRes.data);
    
    // Test 2: Courses endpoint
    console.log('\n2️⃣ Testing /api/courses endpoint...');
    const coursesRes = await axios.get('http://localhost:3000/api/courses');
    console.log('✅ /api/courses:', {
      status: coursesRes.status,
      success: coursesRes.data.success,
      count: coursesRes.data.data?.length || 0
    });
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to API Gateway. Make sure it is running on port 3000');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

testRoute();


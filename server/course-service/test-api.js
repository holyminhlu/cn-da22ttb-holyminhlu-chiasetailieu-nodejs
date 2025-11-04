// Test script để kiểm tra course service API
const axios = require('axios');

const API_BASE = 'http://localhost:3004/courses';

async function testCourseAPI() {
    console.log('\n🧪 ========== TESTING COURSE API ==========\n');
    
    try {
        // Test 1: Get all courses
        console.log('1️⃣ Testing GET /courses...');
        const response = await axios.get(API_BASE);
        console.log('✅ Status:', response.status);
        console.log('✅ Response:', JSON.stringify(response.data, null, 2));
        
        if (response.data.success && response.data.data) {
            console.log(`✅ Found ${response.data.data.length} courses`);
            if (response.data.data.length > 0) {
                console.log('✅ Sample course:', {
                    id: response.data.data[0].course_id,
                    title: response.data.data[0].title,
                    category: response.data.data[0].category
                });
            }
        }
        
        // Test 2: Get course by ID (if courses exist)
        if (response.data.success && response.data.data && response.data.data.length > 0) {
            const firstCourse = response.data.data[0];
            console.log(`\n2️⃣ Testing GET /courses/${firstCourse.course_id}...`);
            const courseResponse = await axios.get(`${API_BASE}/${firstCourse.course_id}`);
            console.log('✅ Status:', courseResponse.status);
            console.log('✅ Course details retrieved successfully');
        }
        
        console.log('\n✅ All tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Test failed!');
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Cannot connect to course service. Make sure it is running on port 3004');
            console.error('   Run: cd server/course-service && npm start');
        } else if (error.response) {
            console.error('❌ HTTP Error:', error.response.status);
            console.error('❌ Response:', error.response.data);
        } else {
            console.error('❌ Error:', error.message);
        }
        process.exit(1);
    }
}

testCourseAPI();


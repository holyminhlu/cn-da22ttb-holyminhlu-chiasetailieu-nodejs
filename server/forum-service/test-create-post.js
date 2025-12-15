const axios = require('axios');

const testData = {
  author: {
    userId: 'test123',
    name: 'Test User',
    avatar: ''
  },
  content: 'This is a test post from script',
  images: []
};

async function testCreatePost() {
  try {
    console.log('🧪 Testing POST /posts');
    console.log('📤 Sending data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post('http://localhost:3005/posts', testData);
    
    console.log('✅ Success!');
    console.log('📥 Response:', JSON.stringify(response.data, null, 2));
    console.log('📥 Status:', response.status);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('📥 Response status:', error.response.status);
      console.error('📥 Response data:', error.response.data);
    }
  }
}

async function testGetPosts() {
  try {
    console.log('\n🧪 Testing GET /posts');
    
    const response = await axios.get('http://localhost:3005/posts');
    
    console.log('✅ Success!');
    console.log('📥 Total posts:', response.data.pagination.total);
    console.log('📥 Posts count:', response.data.data.length);
    
    if (response.data.data.length > 0) {
      console.log('📥 First post:', {
        id: response.data.data[0]._id,
        author: response.data.data[0].author.name,
        content: response.data.data[0].content.substring(0, 50) + '...'
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function runTests() {
  console.log('========================================');
  console.log('🚀 Forum Service API Test');
  console.log('========================================\n');
  
  // Test GET first
  await testGetPosts();
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test POST
  await testCreatePost();
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test GET again to see if post was created
  await testGetPosts();
  
  console.log('\n========================================');
  console.log('✅ Tests completed');
  console.log('========================================');
}

runTests();




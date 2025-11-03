/**
 * Test script để kiểm tra chức năng lưu bookmark
 * Chạy: node test-save-bookmark.js
 */

const http = require('http');

const userId = '6908204708e0d1762ce43424';
const documentId = 'doc_2c2cdee6-3903-49ea-8605-44f156f25146'; // Từ logs

console.log('\n🧪 ========== TEST SAVE BOOKMARK ==========');
console.log('User ID:', userId);
console.log('Document ID:', documentId);
console.log('Testing POST to: http://localhost:3003/documents/bookmarks\n');

const postData = JSON.stringify({
    userId: userId,
    documentId: documentId
});

const options = {
    hostname: 'localhost',
    port: 3003,
    path: '/documents/bookmarks',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    console.log(`✅ Status Code: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('\n📥 Response Body:');
        try {
            const json = JSON.parse(data);
            console.log(JSON.stringify(json, null, 2));
            
            // Print error details if available
            if (!json.success && json.errorDetails) {
                console.log('\n🔍 Error Details:');
                console.log('  Name:', json.errorName);
                console.log('  Message:', json.error);
                if (json.errorStack) {
                    console.log('\n📚 Stack Trace:');
                    console.log(json.errorStack);
                }
            }
        } catch (e) {
            console.log('Raw response:', data);
        }
        
        if (res.statusCode === 200) {
            console.log('\n✅ Test thành công!');
        } else {
            console.log('\n❌ Test thất bại! Status:', res.statusCode);
        }
        console.log('=========================================\n');
    });
});

req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    console.log('=========================================\n');
});

req.write(postData);
req.end();


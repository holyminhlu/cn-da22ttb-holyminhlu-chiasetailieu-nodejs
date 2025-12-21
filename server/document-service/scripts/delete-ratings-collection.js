/**
 * Script để xóa collection DocumentRatings từ MongoDB
 * 
 * Chạy script này để xóa hoàn toàn collection DocumentRatings
 * 
 * Usage:
 *   cd server/document-service
 *   node scripts/delete-ratings-collection.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/EduShareDB';
const COLLECTION_NAME = 'DocumentRatings';

async function deleteRatingsCollection() {
    console.log('\n🗑️  ========== DELETE RATINGS COLLECTION ==========\n');
    
    try {
        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB\n');
        
        // Get database
        const db = mongoose.connection.db;
        
        // Check if collection exists
        const collections = await db.listCollections().toArray();
        const collectionExists = collections.some(col => col.name === COLLECTION_NAME);
        
        if (!collectionExists) {
            console.log(`ℹ️  Collection "${COLLECTION_NAME}" không tồn tại`);
            console.log('   → Không cần xóa\n');
            await mongoose.connection.close();
            console.log('✅ Done\n');
            return;
        }
        
        // Get collection stats before deletion
        const collection = db.collection(COLLECTION_NAME);
        const count = await collection.countDocuments();
        console.log(`📊 Collection "${COLLECTION_NAME}" có ${count} documents`);
        
        if (count === 0) {
            console.log('ℹ️  Collection rỗng, chỉ cần drop collection\n');
        } else {
            console.log(`⚠️  Sẽ xóa ${count} documents\n`);
        }
        
        // Drop collection
        console.log(`🗑️  Dropping collection "${COLLECTION_NAME}"...`);
        await db.collection(COLLECTION_NAME).drop();
        console.log(`✅ Collection "${COLLECTION_NAME}" đã được xóa thành công\n`);
        
        // Verify deletion
        const collectionsAfter = await db.listCollections().toArray();
        const stillExists = collectionsAfter.some(col => col.name === COLLECTION_NAME);
        
        if (stillExists) {
            console.error('❌ Collection vẫn còn tồn tại sau khi xóa!');
            process.exit(1);
        } else {
            console.log('✅ Verified: Collection đã được xóa hoàn toàn\n');
        }
        
        // Close connection
        await mongoose.connection.close();
        console.log('✅ Done\n');
        
    } catch (error) {
        console.error('\n❌ ========== ERROR ==========');
        console.error('Error:', error.message);
        
        if (error.code === 'NamespaceNotFound') {
            console.error(`\nℹ️  Collection "${COLLECTION_NAME}" không tồn tại`);
            console.error('   → Không cần xóa\n');
        } else {
            console.error('\n💥 Lỗi khi xóa collection');
            console.error('Stack:', error.stack);
        }
        
        try {
            await mongoose.connection.close();
        } catch (closeError) {
            // Ignore close errors
        }
        
        process.exit(1);
    }
}

// Run script
deleteRatingsCollection();


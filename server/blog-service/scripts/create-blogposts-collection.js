/**
 * Script to create BlogPosts collection in MongoDB
 * Run: node scripts/create-blogposts-collection.js
 */

const mongoose = require('mongoose')
const BlogPost = require('../models/blogPostModel')

const MONGODB_URI = 'mongodb://127.0.0.1:27017/EduShareDB'

async function createBlogPostsCollection() {
  try {
    console.log('\n🔄 ========== CREATING BLOGPOSTS COLLECTION ==========\n')
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log('✅ Connected to MongoDB:', MONGODB_URI)
    
    // Get database
    const db = mongoose.connection.db
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)
    
    console.log('\n📋 Existing collections:', collectionNames)
    
    // Check if BlogPosts collection exists
    if (collectionNames.includes('BlogPosts')) {
      console.log('✅ BlogPosts collection already exists')
      
      // Get collection stats
      try {
        const stats = await db.command({ collStats: 'BlogPosts' })
        console.log('📊 Collection stats:')
        console.log('   - Documents:', stats.count || 0)
        console.log('   - Size:', stats.size ? (stats.size / 1024).toFixed(2) + ' KB' : 'N/A')
        console.log('   - Indexes:', stats.nindexes || 0)
      } catch (statsError) {
        console.log('⚠️ Could not get collection stats:', statsError.message)
        // Get document count instead
        const count = await db.collection('BlogPosts').countDocuments()
        console.log('📊 Document count:', count)
      }
    } else {
      console.log('📝 Creating BlogPosts collection...')
      
      // Create collection by inserting a dummy document and then deleting it
      // This ensures the collection is created with proper schema
      const tempPost = new BlogPost({
        blog_post_id: 'temp_' + Date.now(),
        title: 'Temp Post',
        slug: 'temp-post-' + Date.now(),
        description: 'Temporary post for collection creation',
        content: 'This is a temporary post',
        category: 'Mẹo học tập',
        tags: ['temp'],
        author: {
          id: 'temp_admin',
          name: 'Temp Admin',
          avatar: ''
        },
        coverImage: '',
        readingTime: 5,
        featured: false,
        status: 'draft'
      })
      
      await tempPost.save()
      console.log('✅ Collection created')
      
      // Delete temp document
      await BlogPost.deleteOne({ blog_post_id: tempPost.blog_post_id })
      console.log('✅ Temp document removed')
    }
    
    // Ensure indexes exist
    console.log('\n📇 Creating indexes...')
    await BlogPost.createIndexes()
    console.log('✅ Indexes created/verified')
    
    // List all indexes
    const indexes = await db.collection('BlogPosts').indexes()
    console.log('\n📑 Indexes on BlogPosts collection:')
    indexes.forEach((index, i) => {
      console.log(`   ${i + 1}. ${index.name}:`, JSON.stringify(index.key))
    })
    
    // Test insert and query
    console.log('\n🧪 Testing collection...')
    const testPost = new BlogPost({
      title: 'Bài viết test',
      slug: 'bai-viet-test-' + Date.now(),
      description: 'Đây là bài viết test để kiểm tra collection',
      content: 'Nội dung bài viết test...',
      category: 'Mẹo học tập',
      tags: ['test', 'học tập'],
      author: {
        id: 'test_admin',
        name: 'Test Admin',
        avatar: ''
      },
      coverImage: '',
      readingTime: 3,
      featured: false,
      status: 'published'
    })
    
    await testPost.save()
    console.log('✅ Test document inserted:', testPost.blog_post_id)
    
    // Query test
    const found = await BlogPost.findOne({ blog_post_id: testPost.blog_post_id })
    console.log('✅ Test document queried:', found ? 'Success' : 'Failed')
    
    // Test slug query
    const foundBySlug = await BlogPost.findOne({ slug: testPost.slug })
    console.log('✅ Test document queried by slug:', foundBySlug ? 'Success' : 'Failed')
    
    // Clean up test document
    await BlogPost.deleteOne({ blog_post_id: testPost.blog_post_id })
    console.log('✅ Test document removed')
    
    console.log('\n✅ ========== BLOGPOSTS COLLECTION READY ==========\n')
    console.log('Collection name: BlogPosts')
    console.log('Database: EduShareDB')
    console.log('Schema fields:')
    console.log('  - blog_post_id (String, unique)')
    console.log('  - title (String, required, text index)')
    console.log('  - slug (String, unique)')
    console.log('  - description (String, required, max 500 chars, text index)')
    console.log('  - content (String, required, text index)')
    console.log('  - category (String, enum, indexed)')
    console.log('  - tags (Array[String], indexed, text index)')
    console.log('  - author.id (String, required)')
    console.log('  - author.name (String, required)')
    console.log('  - author.avatar (String)')
    console.log('  - coverImage (String)')
    console.log('  - readingTime (Number, min 1)')
    console.log('  - featured (Boolean, indexed)')
    console.log('  - status (String: draft/published/archived, indexed)')
    console.log('  - views (Number, default 0, indexed)')
    console.log('  - likes (Number, default 0, indexed)')
    console.log('  - publishedDate (Date, indexed)')
    console.log('  - createdAt, updatedAt (auto)')
    console.log('\nIndexes:')
    console.log('  - blog_post_id (unique)')
    console.log('  - slug (unique)')
    console.log('  - category')
    console.log('  - status')
    console.log('  - featured')
    console.log('  - publishedDate (descending)')
    console.log('  - views (descending)')
    console.log('  - likes (descending)')
    console.log('  - Text index on: title, description, content, tags')
    console.log('\n')
    
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error creating BlogPosts collection:', error)
    console.error('Error details:', error.message)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
    process.exit(1)
  }
}

// Run script
createBlogPostsCollection()


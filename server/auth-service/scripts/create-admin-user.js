/**
 * Script to create admin user in MongoDB
 * Run: node scripts/create-admin-user.js
 * 
 * Usage:
 *   node scripts/create-admin-user.js
 *   node scripts/create-admin-user.js --email admin@example.com --password admin123 --name "Admin User"
 */

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/authModel')

const MONGODB_URI = 'mongodb://127.0.0.1:27017/EduShareDB'

// Default admin credentials (có thể override bằng command line arguments)
const DEFAULT_ADMIN = {
  fullName: 'Admin OLF',
  email: 'admin@olf.edu.vn',
  passWord: 'admin123456',
  role: 'admin'
}

async function createAdminUser() {
  try {
    console.log('\n🔄 ========== CREATING ADMIN USER ==========\n')
    
    // Parse command line arguments
    const args = process.argv.slice(2)
    const adminData = { ...DEFAULT_ADMIN }
    
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--email' && args[i + 1]) {
        adminData.email = args[i + 1]
        i++
      } else if (args[i] === '--password' && args[i + 1]) {
        adminData.passWord = args[i + 1]
        i++
      } else if (args[i] === '--name' && args[i + 1]) {
        adminData.fullName = args[i + 1]
        i++
      }
    }
    
    console.log('📋 Admin user data:')
    console.log('   - Full Name:', adminData.fullName)
    console.log('   - Email:', adminData.email)
    console.log('   - Role: admin')
    console.log('   - Password:', '*'.repeat(adminData.passWord.length))
    
    // Validation
    if (!adminData.fullName || !adminData.email || !adminData.passWord) {
      console.error('❌ Error: Missing required fields')
      process.exit(1)
    }
    
    if (adminData.passWord.length < 6) {
      console.error('❌ Error: Password must be at least 6 characters')
      process.exit(1)
    }
    
    // Connect to MongoDB
    console.log('\n📡 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log('✅ Connected to MongoDB:', MONGODB_URI)
    
    // Check if admin user already exists
    console.log('\n🔍 Checking if admin user exists...')
    const existingUser = await User.findOne({ 
      $or: [
        { email: adminData.email.toLowerCase() },
        { role: 'admin' }
      ]
    })
    
    if (existingUser) {
      if (existingUser.email === adminData.email.toLowerCase()) {
        console.log('⚠️  User with this email already exists:')
        console.log('   - Email:', existingUser.email)
        console.log('   - Full Name:', existingUser.fullName)
        console.log('   - Role:', existingUser.role)
        console.log('   - User ID:', existingUser.user_id)
        
        // Ask if user wants to update to admin
        console.log('\n💡 To update this user to admin role, run:')
        console.log(`   node scripts/update-user-role.js --email ${adminData.email} --role admin`)
        
        process.exit(0)
      } else if (existingUser.role === 'admin') {
        console.log('⚠️  An admin user already exists:')
        console.log('   - Email:', existingUser.email)
        console.log('   - Full Name:', existingUser.fullName)
        console.log('   - User ID:', existingUser.user_id)
        console.log('\n✅ You can use this existing admin account')
        process.exit(0)
      }
    }
    
    // Hash password
    console.log('\n🔐 Hashing password...')
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(adminData.passWord, salt)
    console.log('✅ Password hashed')
    
    // Create admin user
    console.log('\n📝 Creating admin user...')
    const adminUser = new User({
      fullName: adminData.fullName.trim(),
      email: adminData.email.toLowerCase().trim(),
      passWord: hashedPassword,
      role: 'admin',
      phone: '',
      is_verified: true,
      is_active: true
    })
    
    await adminUser.save()
    console.log('✅ Admin user created successfully!')
    
    // Display created user info
    console.log('\n✅ ========== ADMIN USER CREATED ==========\n')
    console.log('User Information:')
    console.log('   - User ID:', adminUser.user_id)
    console.log('   - Full Name:', adminUser.fullName)
    console.log('   - Email:', adminUser.email)
    console.log('   - Role:', adminUser.role)
    console.log('   - Is Verified:', adminUser.is_verified)
    console.log('   - Is Active:', adminUser.is_active)
    console.log('   - Created At:', adminUser.createdAt)
    console.log('\n📝 Login Credentials:')
    console.log('   - Email:', adminUser.email)
    console.log('   - Password:', adminData.passWord)
    console.log('\n⚠️  IMPORTANT: Save these credentials securely!')
    console.log('   You can now login with this admin account.')
    console.log('\n')
    
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error)
    console.error('Error details:', error.message)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
    
    // Handle duplicate email error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      console.error(`\n⚠️  ${field === 'email' ? 'Email' : field} already exists!`)
    }
    
    process.exit(1)
  }
}

// Run script
createAdminUser()


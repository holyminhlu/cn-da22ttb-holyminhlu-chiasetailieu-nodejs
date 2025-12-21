/**
 * Script để manually enroll user sau khi payment completed
 * Sử dụng khi IPN không được gửi hoặc không được xử lý
 * 
 * Usage: node scripts/manual-enroll-after-payment.js <payment_id>
 */

const mongoose = require('mongoose')
const Payment = require('../models/paymentModel')
const Enrollment = require('../models/enrollmentModel')
const Course = require('../models/courseModel')

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/EduShareDB'

async function manualEnrollAfterPayment(paymentId) {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Find payment
        const payment = await Payment.findOne({ payment_id: paymentId })
        
        if (!payment) {
            console.error(`❌ Payment not found: ${paymentId}`)
            process.exit(1)
        }

        console.log(`\n📋 Payment Info:`)
        console.log(`   Payment ID: ${payment.payment_id}`)
        console.log(`   User ID: ${payment.user_id}`)
        console.log(`   Course ID: ${payment.course_id}`)
        console.log(`   Amount: ${payment.amount} ${payment.currency}`)
        console.log(`   Status: ${payment.status}`)
        console.log(`   Enrollment ID: ${payment.enrollment_id || 'None'}`)

        // Check if payment is completed
        if (payment.status !== 'completed' && payment.status !== 'success') {
            console.error(`❌ Payment status is not completed: ${payment.status}`)
            console.log(`   Update payment status to 'completed' first? (y/n)`)
            process.exit(1)
        }

        // Check if enrollment already exists
        const existingEnrollment = await Enrollment.findOne({
            user_id: payment.user_id,
            course_id: payment.course_id
        })

        if (existingEnrollment) {
            console.log(`\n✅ Enrollment already exists:`)
            console.log(`   Enrollment ID: ${existingEnrollment.enrollment_id}`)
            
            // Update payment with enrollment_id if not set
            if (!payment.enrollment_id) {
                payment.enrollment_id = existingEnrollment.enrollment_id
                await payment.save()
                console.log(`   ✅ Updated payment with enrollment_id`)
            }
            
            await mongoose.disconnect()
            process.exit(0)
        }

        // Create new enrollment
        console.log(`\n🎓 Creating enrollment...`)
        const enrollment = new Enrollment({
            user_id: payment.user_id,
            course_id: payment.course_id,
            status: 'active',
            progress: {
                completedLessons: [],
                completionPercentage: 0
            }
        })

        await enrollment.save()
        console.log(`✅ Enrollment created: ${enrollment.enrollment_id}`)

        // Update payment with enrollment_id
        payment.enrollment_id = enrollment.enrollment_id
        if (!payment.paid_at) {
            payment.paid_at = new Date()
        }
        await payment.save()
        console.log(`✅ Payment updated with enrollment_id`)

        // Update course enrolledCount
        await Course.updateOne(
            { course_id: payment.course_id },
            { $inc: { enrolledCount: 1 } }
        )
        console.log(`✅ Course enrolledCount incremented`)

        console.log(`\n✅ Successfully enrolled user in course!`)
        await mongoose.disconnect()
        process.exit(0)

    } catch (error) {
        console.error('\n❌ Error:', error)
        await mongoose.disconnect()
        process.exit(1)
    }
}

// Get payment_id from command line
const paymentId = process.argv[2]

if (!paymentId) {
    console.error('❌ Usage: node scripts/manual-enroll-after-payment.js <payment_id>')
    process.exit(1)
}

manualEnrollAfterPayment(paymentId)





const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const paymentSchema = new mongoose.Schema({
    payment_id: {
        type: String,
        required: true,
        unique: true,
        default: () => `payment_${uuidv4()}`
    },
    user_id: {
        type: String,
        required: true,
        index: true
    },
    course_id: {
        type: String,
        required: true,
        index: true
    },
    enrollment_id: {
        type: String,
        default: null,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'VND',
        enum: ['VND', 'USD']
    },
    // SePay transaction info
    sepay_transaction_id: {
        type: String,
        default: null,
        index: true
    },
    sepay_order_id: {
        type: String,
        default: null,
        index: true
    },
    sepay_payment_url: {
        type: String,
        default: null
    },
    payment_method: {
        type: String,
        enum: ['sepay', 'bank_transfer', 'wallet'],
        default: 'sepay'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
        default: 'pending',
        index: true
    },
    // Payment details
    customer_info: {
        name: String,
        email: String,
        phone: String
    },
    // SePay callback data
    sepay_callback_data: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    // Timestamps
    paid_at: {
        type: Date,
        default: null
    },
    expired_at: {
        type: Date,
        default: null // Payment link expiration
    },
    // Metadata
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
    collection: 'Payments'
})

// Indexes
paymentSchema.index({ payment_id: 1 }, { unique: true })
paymentSchema.index({ user_id: 1, course_id: 1 })
paymentSchema.index({ status: 1, createdAt: -1 })
paymentSchema.index({ sepay_transaction_id: 1 })
paymentSchema.index({ sepay_order_id: 1 })
paymentSchema.index({ expired_at: 1 }, { expireAfterSeconds: 0 }) // Auto delete expired payments

// Update updatedAt before save
paymentSchema.pre('save', function(next) {
    this.updatedAt = Date.now()
    next()
})

module.exports = mongoose.model('Payments', paymentSchema)


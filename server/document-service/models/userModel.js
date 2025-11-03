const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    fullName: {
        type: String,
        required: false // Not required since user may exist from auth-service
    },
    email: {
        type: String,
        required: false, // Not required since user may exist from auth-service
        unique: true,
        sparse: true, // Only enforce uniqueness if email exists
        index: true
    },
    saved_documents: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
    collection: 'UserCollection',
    strict: false // Allow other fields from auth-service
})

module.exports = mongoose.model('UserCollection', userSchema)


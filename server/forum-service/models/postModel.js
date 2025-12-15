const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    userId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  author: {
    userId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  images: [{
    type: String
  }],
  likes: [{
    userId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
postSchema.index({ createdAt: -1 });
postSchema.index({ 'author.userId': 1 });

// Virtual for likes count
postSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count
postSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Ensure virtuals are included in JSON
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;




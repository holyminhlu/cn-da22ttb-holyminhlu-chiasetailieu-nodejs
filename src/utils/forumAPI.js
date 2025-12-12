import axios from 'axios';

const API_BASE_URL = '/api/forum';

// Get all posts
export const getAllPosts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Get single post
export const getPostById = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

// Create new post
export const createPost = async (postData) => {
  try {
    console.log('📤 Sending POST request to:', `${API_BASE_URL}/posts`);
    console.log('📤 Post data:', JSON.stringify(postData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/posts`, postData);
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error creating post:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error message:', error.message);
    throw error;
  }
};

// Update post
export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete post
export const deletePost = async (postId, userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Toggle like
export const toggleLike = async (postId, userId, userName) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts/${postId}/like`, {
      userId,
      userName
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Add comment
export const addComment = async (postId, commentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Delete comment
export const deleteComment = async (postId, commentId, userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Upload image - Call forum service directly to avoid proxy issues with multipart
export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    // Call forum service directly for file uploads
    const response = await axios.post('http://localhost:3005/posts/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};


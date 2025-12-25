/**
 * Admin API utilities
 * API calls for admin management functions
 */

const API_BASE_URL = '/api'
const ADMIN_BASE_URL = '/api/admin'

/**
 * Get authentication token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('token')
}

/**
 * Get authorization headers
 */
function getAuthHeaders() {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

// ==================== USERS MANAGEMENT ====================

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
export async function getAllUsers(params = {}) {
  try {
    const queryString = Object.keys(params).length > 0 ? `?${new URLSearchParams(params)}` : ''
    const response = await fetch(`${ADMIN_BASE_URL}/users${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

/**
 * Get user by ID (admin only)
 * GET /api/admin/users/:id
 */
export async function getUserById(userId) {
  try {
    const response = await fetch(`${ADMIN_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

/**
 * Update user (admin only)
 * PUT /api/admin/users/:id
 */
export async function updateUser(userId, userData) {
  try {
    const response = await fetch(`${ADMIN_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

/**
 * Delete user (admin only)
 * DELETE /api/admin/users/:id
 */
export async function deleteUser(userId) {
  try {
    const response = await fetch(`${ADMIN_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

// ==================== DOCUMENTS MANAGEMENT ====================

/**
 * Get all documents (admin view)
 */
export async function getAllDocuments(params = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/documents?${new URLSearchParams(params)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error fetching documents:', error)
    throw error
  }
}

/**
 * Delete document
 */
export async function deleteDocument(documentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error deleting document:', error)
    throw error
  }
}

/**
 * Restore soft-deleted document
 */
export async function restoreDocument(documentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/restore`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error restoring document:', error)
    throw error
  }
}

/**
 * Permanently delete document (destructive)
 */
export async function deleteDocumentPermanent(documentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/permanent?force=true`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error permanently deleting document:', error)
    throw error
  }
}

/**
 * Update document
 */
export async function updateDocument(documentId, documentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(documentData)
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

// ==================== COURSES MANAGEMENT ====================

/**
 * Get all courses (admin view)
 */
export async function getAllCourses(params = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses?${new URLSearchParams(params)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

/**
 * Delete course
 */
export async function deleteCourse(courseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error deleting course:', error)
    throw error
  }
}

/**
 * Restore soft-deleted course
 */
export async function restoreCourse(courseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/restore`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error restoring course:', error)
    throw error
  }
}

/**
 * Permanently delete course (destructive)
 */
export async function deleteCoursePermanent(courseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/permanent?force=true`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error permanently deleting course:', error)
    throw error
  }
}

/**
 * Update course
 */
export async function updateCourse(courseId, courseData) {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData)
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error updating course:', error)
    throw error
  }
}

// ==================== BLOG POSTS MANAGEMENT ====================

/**
 * Get all blog posts (admin view)
 */
export async function getAllBlogPosts(params = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs?${new URLSearchParams(params)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    throw error
  }
}

/**
 * Create blog post
 */
export async function createBlogPost(postData) {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error creating blog post:', error)
    throw error
  }
}

/**
 * Update blog post
 */
export async function updateBlogPost(postId, postData) {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${postId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error updating blog post:', error)
    throw error
  }
}

/**
 * Delete blog post
 */
export async function deleteBlogPost(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error deleting blog post:', error)
    throw error
  }
}

/**
 * Restore soft-deleted blog post (admin only)
 */
export async function restoreBlogPost(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${postId}/restore`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error restoring blog post:', error)
    throw error
  }
}

/**
 * Permanently delete blog post (destructive) (admin only)
 */
export async function deleteBlogPostPermanent(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${postId}/permanent?force=true`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error permanently deleting blog post:', error)
    throw error
  }
}

/**
 * Get blog post by ID
 */
export async function getBlogPostById(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${postId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error fetching blog post:', error)
    throw error
  }
}

// ==================== FORUM POSTS MANAGEMENT ====================

/**
 * Get all forum posts (admin view)
 */
export async function getAllForumPosts(params = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/forum/posts?${new URLSearchParams(params)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error fetching forum posts:', error)
    throw error
  }
}

/**
 * Get forum post by ID
 */
export async function getForumPostById(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error fetching forum post:', error)
    throw error
  }
}

/**
 * Update forum post
 */
export async function updateForumPost(postId, postData) {
  try {
    const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error updating forum post:', error)
    throw error
  }
}

/**
 * Delete forum post
 */
export async function deleteForumPost(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error deleting forum post:', error)
    throw error
  }
}

/**
 * Restore soft-deleted forum post
 */
export async function restoreForumPost(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/restore`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error restoring forum post:', error)
    throw error
  }
}

/**
 * Permanently delete forum post (destructive)
 */
export async function deleteForumPostPermanent(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/permanent?force=true`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error permanently deleting forum post:', error)
    throw error
  }
}


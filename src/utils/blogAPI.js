import axios from 'axios'

// Use relative path to go through Vue proxy
const API_BASE_URL = '/api/blogs'

/**
 * Get all blog posts with pagination and filtering
 * @param {Object} params - Query parameters (page, limit, category, tag, search, etc.)
 */
export async function getAllPosts(params = {}) {
  try {
    const response = await axios.get(`${API_BASE_URL}`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    throw error
  }
}

/**
 * Get blog post by ID or slug
 * @param {String} id - Blog post ID or slug
 */
export async function getPostById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching blog post:', error)
    throw error
  }
}

/**
 * Get featured posts
 * @param {Number} limit - Number of featured posts to return (default: 3)
 */
export async function getFeaturedPosts(limit = 3) {
  try {
    const response = await axios.get(`${API_BASE_URL}/featured`, {
      params: { limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    throw error
  }
}

/**
 * Get popular posts (by views)
 * @param {Number} limit - Number of popular posts to return (default: 5)
 */
export async function getPopularPosts(limit = 5) {
  try {
    const response = await axios.get(`${API_BASE_URL}/popular`, {
      params: { limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching popular posts:', error)
    throw error
  }
}

/**
 * Get related posts
 * @param {String} id - Blog post ID or slug
 * @param {Number} limit - Number of related posts to return (default: 4)
 */
export async function getRelatedPosts(id, limit = 4) {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}/related`, {
      params: { limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching related posts:', error)
    throw error
  }
}

/**
 * Get all tags (for tag cloud)
 */
export async function getAllTags() {
  try {
    const response = await axios.get(`${API_BASE_URL}/tags`)
    return response.data
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw error
  }
}

/**
 * Search blog posts
 * @param {String} query - Search query
 * @param {Object} params - Additional query parameters
 */
export async function searchPosts(query, params = {}) {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      params: {
        search: query,
        ...params
      }
    })
    return response.data
  } catch (error) {
    console.error('Error searching blog posts:', error)
    throw error
  }
}



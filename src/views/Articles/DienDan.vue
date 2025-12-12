<template>
  <main class="forum-page">
    <!-- Hero Section -->
    <section class="forum-hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">Diễn Đàn</span> Học Tập
        </h1>
        <p class="hero-subtitle">💬 Chia sẻ kiến thức • 🚀 Kết nối cộng đồng • ✨ Học tập cùng nhau</p>
        
        <!-- Search Bar -->
        <div class="search-wrapper">
          <div class="search-container">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Tìm kiếm bài viết, chủ đề..."
              @input="handleSearch"
            />
            <button v-if="searchQuery" class="clear-search" @click="clearSearch">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="forum-container">
      <div class="container-wide">
        <div class="forum-layout">
          <!-- Sidebar -->
          <aside class="sidebar">
            <!-- Quick Actions -->
            <div class="sidebar-card">
              <button class="btn-create-post" @click="showCreateModal = true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Tạo bài viết
              </button>
            </div>

            <!-- Filter Options -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">Bộ lọc</h3>
              <div class="filter-options">
                <button
                  v-for="filter in filterOptions"
                  :key="filter.value"
                  class="filter-btn"
                  :class="{ active: activeFilter === filter.value }"
                  @click="setFilter(filter.value)"
                >
                  <span class="filter-icon">{{ filter.icon }}</span>
                  <span class="filter-label">{{ filter.label }}</span>
                </button>
              </div>
            </div>

            <!-- Stats -->
            <div class="sidebar-card stats-card">
              <h3 class="sidebar-title">Thống kê</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">{{ totalPosts }}</div>
                  <div class="stat-label">Bài viết</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ totalMembers }}</div>
                  <div class="stat-label">Thành viên</div>
                </div>
              </div>
            </div>
          </aside>

          <!-- Main Feed -->
          <div class="main-feed">
            <!-- Create Post Card -->
            <div class="create-post-card">
              <div class="create-post-header">
                <div class="user-avatar">
                  <img
                    v-if="currentUser.avatar"
                    :src="getUserAvatarUrl(currentUser.avatar)"
                    :alt="currentUser.name"
                    class="avatar-img"
                  />
                  <span v-else>{{ getUserInitial() }}</span>
                </div>
                <input
                  type="text"
                  class="post-input"
                  placeholder="Bạn đang nghĩ gì?"
                  @click="showCreateModal = true"
                  readonly
                />
              </div>
              <div class="create-post-actions">
                <button class="action-btn" @click="showCreateModal = true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  Ảnh
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="loading-state">
              <div class="spinner"></div>
              <p>Đang tải bài viết...</p>
            </div>

            <!-- Results Info -->
            <div v-else-if="searchQuery || activeFilter !== 'all'" class="results-info">
              <div class="results-text">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                <span v-if="posts.length > 0">
                  Hiển thị <strong>{{ posts.length }}</strong> / {{ totalPosts }} bài viết
                </span>
                <span v-else>
                  Không có kết quả
                </span>
              </div>
            </div>

            <!-- Posts Feed -->
            <div v-if="!loading && posts.length > 0" class="posts-feed">
              <article
                v-for="post in posts"
                :key="post._id"
                class="post-card"
              >
                <!-- Post Header -->
                <div class="post-header">
                  <div class="post-author">
                    <div class="author-avatar">
                      <img
                        v-if="post.author.avatar"
                        :src="getUserAvatarUrl(post.author.avatar)"
                        :alt="post.author.name"
                        class="avatar-img"
                      />
                      <span v-else>{{ post.author.name.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="author-info">
                      <div class="author-name">{{ post.author.name }}</div>
                      <div class="post-time">{{ formatTime(post.createdAt) }}</div>
                    </div>
                  </div>
                  <button
                    v-if="isPostAuthor(post)"
                    class="post-menu-btn"
                    @click="togglePostMenu(post._id)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </button>
                  <!-- Post Menu Dropdown -->
                  <div v-if="activePostMenu === post._id" class="post-menu-dropdown">
                    <button @click="handleDeletePost(post._id)" class="menu-item delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Xóa bài viết
                    </button>
                  </div>
                </div>

                <!-- Post Content -->
                <div class="post-content">
                  <p class="post-text">{{ post.content }}</p>
                  
                  <!-- Post Images -->
                  <div v-if="post.images && post.images.length > 0" class="post-images">
                    <div class="images-grid" :class="getImageGridClass(post.images.length)">
                      <img
                        v-for="(image, index) in post.images"
                        :key="index"
                        :src="getImageUrl(image)"
                        :alt="`Image ${index + 1}`"
                        class="post-image"
                        @click="openImageViewer(post.images, index)"
                      />
                    </div>
                  </div>
                </div>

                <!-- Post Stats -->
                <div class="post-stats">
                  <div class="stat-item">
                    <span v-if="post.likes && post.likes.length > 0">
                      {{ post.likes.length }} lượt thích
                    </span>
                  </div>
                  <div class="stat-item">
                    <span v-if="post.comments && post.comments.length > 0">
                      {{ post.comments.length }} bình luận
                    </span>
                  </div>
                </div>

                <!-- Post Actions -->
                <div class="post-actions">
                  <button
                    class="action-button"
                    :class="{ liked: isLikedByUser(post) }"
                    @click="handleToggleLike(post)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" :stroke="isLikedByUser(post) ? '#e74c3c' : 'currentColor'" :fill="isLikedByUser(post) ? '#e74c3c' : 'none'" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Thích
                  </button>
                  <button
                    class="action-button"
                    @click="toggleComments(post._id)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Bình luận
                  </button>
                </div>

                <!-- Comments Section -->
                <div v-if="activeComments === post._id" class="comments-section">
                  <!-- Existing Comments -->
                  <div v-if="post.comments && post.comments.length > 0" class="comments-list">
                    <div
                      v-for="comment in post.comments"
                      :key="comment._id"
                      class="comment-item"
                    >
                      <div class="comment-avatar">
                        <img
                          v-if="comment.author.avatar"
                          :src="getUserAvatarUrl(comment.author.avatar)"
                          :alt="comment.author.name"
                          class="avatar-img"
                        />
                        <span v-else>{{ comment.author.name.charAt(0).toUpperCase() }}</span>
                      </div>
                      <div class="comment-content">
                        <div class="comment-bubble">
                          <div class="comment-author">{{ comment.author.name }}</div>
                          <div class="comment-text">{{ comment.content }}</div>
                        </div>
                        <div class="comment-actions">
                          <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                          <button
                            v-if="isCommentAuthor(comment) || isPostAuthor(post)"
                            class="delete-comment-btn"
                            @click="handleDeleteComment(post._id, comment._id)"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Add Comment -->
                  <div class="add-comment">
                    <div class="comment-avatar">
                      <img
                        v-if="currentUser.avatar"
                        :src="getUserAvatarUrl(currentUser.avatar)"
                        :alt="currentUser.name"
                        class="avatar-img"
                      />
                      <span v-else>{{ getUserInitial() }}</span>
                    </div>
                    <div class="comment-input-wrapper">
                      <input
                        v-model="commentInputs[post._id]"
                        type="text"
                        class="comment-input"
                        placeholder="Viết bình luận..."
                        @keyup.enter="handleAddComment(post._id)"
                      />
                      <button
                        class="send-comment-btn"
                        :disabled="!commentInputs[post._id] || !commentInputs[post._id].trim()"
                        @click="handleAddComment(post._id)"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path v-if="searchQuery || activeFilter !== 'all'" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                <path v-else d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3>{{ getEmptyStateTitle() }}</h3>
              <p>{{ getEmptyStateMessage() }}</p>
              <button v-if="!searchQuery && activeFilter === 'all'" class="btn-create" @click="showCreateModal = true">
                Tạo bài viết đầu tiên
              </button>
              <button v-else class="btn-create" @click="resetFilters">
                Xem tất cả bài viết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll to Top Button -->
    <button
      v-if="showScrollTop"
      class="scroll-top-btn"
      @click="scrollToTop"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>

    <!-- Create Post Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal-content create-post-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Tạo bài viết</h2>
          <button class="modal-close" @click="closeCreateModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Author Info -->
          <div class="post-author-info">
            <div class="author-avatar">
              <img
                v-if="currentUser.avatar"
                :src="getUserAvatarUrl(currentUser.avatar)"
                :alt="currentUser.name"
                class="avatar-img"
              />
              <span v-else>{{ getUserInitial() }}</span>
            </div>
            <div class="author-name">{{ currentUser.name }}</div>
          </div>

          <!-- Post Content Input -->
          <textarea
            v-model="newPost.content"
            class="post-textarea"
            placeholder="Bạn đang nghĩ gì?"
            rows="5"
            ref="postTextarea"
          ></textarea>

          <!-- Image Preview -->
          <div v-if="newPost.images.length > 0" class="image-preview-container">
            <div class="image-preview-grid">
              <div
                v-for="(image, index) in newPost.images"
                :key="index"
                class="image-preview-item"
              >
                <img :src="image" :alt="`Preview ${index + 1}`" />
                <button class="remove-image-btn" @click="removeImage(index)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Upload Progress -->
          <div v-if="uploading" class="upload-progress">
            <div class="spinner-small"></div>
            <span>Đang tải ảnh lên...</span>
          </div>

          <!-- Add to Post Actions -->
          <div class="add-to-post">
            <span class="add-to-post-label">Thêm vào bài viết</span>
            <div class="add-to-post-actions">
              <label class="add-action-btn">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleImageUpload"
                  style="display: none"
                />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#45bd62" stroke="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="white"></circle>
                  <polyline points="21 15 16 10 5 21" stroke="white" stroke-width="2" fill="none"></polyline>
                </svg>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="btn-post"
            :disabled="!canPost || posting"
            @click="handleCreatePost"
          >
            <span v-if="posting" class="posting-spinner"></span>
            {{ posting ? 'Đang đăng...' : 'Đăng bài' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import {
  getAllPosts,
  createPost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  uploadImage
} from '@/utils/forumAPI'

export default {
  name: 'DienDan',
  setup() {
    const loading = ref(false)
    const posting = ref(false)
    const uploading = ref(false)
    const posts = ref([])
    const allPosts = ref([]) // Store all posts for filtering
    const showCreateModal = ref(false)
    const activeComments = ref(null)
    const activePostMenu = ref(null)
    const commentInputs = ref({})
    const postTextarea = ref(null)
    const searchQuery = ref('')
    const activeFilter = ref('all')
    const showScrollTop = ref(false)

    const currentUser = ref({
      userId: localStorage.getItem('userId') || localStorage.getItem('user_id') || 'guest',
      name: localStorage.getItem('userName') || localStorage.getItem('user_name') || 'Người dùng',
      avatar: localStorage.getItem('userAvatar') || ''
    })

    const newPost = ref({
      content: '',
      images: []
    })

    const filterOptions = ref([
      { value: 'all', label: 'Tất cả', icon: '📋' },
      { value: 'recent', label: 'Mới nhất', icon: '🕐' },
      { value: 'popular', label: 'Phổ biến', icon: '🔥' },
      { value: 'mine', label: 'Của tôi', icon: '👤' }
    ])

    // Computed
    const canPost = computed(() => {
      return newPost.value.content.trim().length > 0 || newPost.value.images.length > 0
    })

    const totalPosts = computed(() => {
      return allPosts.value.length
    })

    const totalMembers = computed(() => {
      const uniqueAuthors = new Set(allPosts.value.map(p => p.author.userId))
      return uniqueAuthors.size || 1
    })

    // Methods
    const fetchPosts = async () => {
      loading.value = true
      try {
        const response = await getAllPosts(1, 50)
        console.log('📥 Fetched posts:', response)
        
        if (response.success) {
          allPosts.value = response.data
          posts.value = response.data
          console.log(`✅ Loaded ${allPosts.value.length} posts`)
          applyFilter()
        }
      } catch (error) {
        console.error('❌ Error fetching posts:', error)
        if (window.$toast) {
          window.$toast.error('Không thể tải bài viết')
        }
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => {
      if (!searchQuery.value.trim()) {
        posts.value = [...allPosts.value]
        applyFilter()
        return
      }

      const query = searchQuery.value.toLowerCase()
      posts.value = allPosts.value.filter(post => {
        return (
          post.content.toLowerCase().includes(query) ||
          post.author.name.toLowerCase().includes(query)
        )
      })
      applyFilter()
    }

    const clearSearch = () => {
      searchQuery.value = ''
      handleSearch()
    }

    const setFilter = (filterValue) => {
      activeFilter.value = filterValue
      applyFilter()
    }

    const applyFilter = () => {
      let filtered = searchQuery.value.trim() 
        ? posts.value 
        : [...allPosts.value]

      console.log(`🔍 Applying filter: ${activeFilter.value}, Total posts: ${allPosts.value.length}`)

      switch (activeFilter.value) {
        case 'recent':
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case 'popular':
          filtered.sort((a, b) => {
            const aScore = (a.likes?.length || 0) + (a.comments?.length || 0) * 2
            const bScore = (b.likes?.length || 0) + (b.comments?.length || 0) * 2
            return bScore - aScore
          })
          break
        case 'mine':
          filtered = filtered.filter(post => post.author.userId === currentUser.value.userId)
          console.log(`👤 'Mine' filter: ${filtered.length} posts by user ${currentUser.value.userId}`)
          break
        default:
          // 'all' - keep current order
          break
      }

      posts.value = filtered
      console.log(`✅ Filtered posts: ${posts.value.length}`)
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const handleScroll = () => {
      showScrollTop.value = window.scrollY > 300
    }

    const handleCreatePost = async () => {
      if (!canPost.value || posting.value) return

      posting.value = true
      try {
        const postData = {
          author: {
            userId: currentUser.value.userId,
            name: currentUser.value.name,
            avatar: currentUser.value.avatar
          },
          content: newPost.value.content.trim(),
          images: newPost.value.images
        }

        console.log('📝 Creating post with data:', postData)

        const response = await createPost(postData)
        console.log('✅ Post created successfully:', response)
        console.log('✅ Post data:', response.data)
        console.log('✅ Post _id:', response.data._id)
        
        if (response.success && response.data) {
          // Add to allPosts using new array to trigger reactivity
          allPosts.value = [response.data, ...allPosts.value]
          
          // Reset to 'all' filter to show new post
          activeFilter.value = 'all'
          searchQuery.value = ''
          
          // Update posts display with new array
          posts.value = [...allPosts.value]
          
          console.log(`✅ Total posts after adding: ${allPosts.value.length}`)
          console.log(`✅ Displayed posts: ${posts.value.length}`)
          
          if (window.$toast) {
            window.$toast.success('Đăng bài thành công!')
          }
          closeCreateModal()
          
          // Scroll to top to show new post after a small delay
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }, 100)
        } else {
          throw new Error(response.message || 'Failed to create post')
        }
      } catch (error) {
        console.error('❌ Error creating post:', error)
        console.error('Error details:', error.response?.data || error.message)
        
        const errorMsg = error.response?.data?.message || error.message || 'Không thể đăng bài'
        if (window.$toast) {
          window.$toast.error(errorMsg)
        }
      } finally {
        posting.value = false
      }
    }

    const handleImageUpload = async (event) => {
      const files = Array.from(event.target.files)
      if (files.length === 0) return

      console.log(`📤 Uploading ${files.length} image(s)...`)

      uploading.value = true
      try {
        for (const file of files) {
          console.log(`⬆️ Uploading: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
          
          // Validate file size (5MB max)
          if (file.size > 5 * 1024 * 1024) {
            if (window.$toast) {
              window.$toast.error(`File ${file.name} quá lớn (max 5MB)`)
            }
            continue
          }

          const response = await uploadImage(file)
          console.log('✅ Upload response:', response)
          
          if (response.success) {
            const fullUrl = `http://localhost:3005${response.data.url}`
            newPost.value.images.push(fullUrl)
            console.log(`✅ Image added: ${fullUrl}`)
          } else {
            throw new Error(response.message || 'Upload failed')
          }
        }

        if (window.$toast && files.length > 0) {
          window.$toast.success(`Đã tải lên ${files.length} ảnh`)
        }

        // Clear input so same file can be selected again
        event.target.value = ''
      } catch (error) {
        console.error('❌ Error uploading images:', error)
        console.error('Error details:', error.response?.data || error.message)
        
        const errorMsg = error.response?.data?.message || error.message || 'Không thể tải ảnh lên'
        if (window.$toast) {
          window.$toast.error(errorMsg)
        }

        // Clear input on error too
        event.target.value = ''
      } finally {
        uploading.value = false
      }
    }

    const removeImage = (index) => {
      newPost.value.images.splice(index, 1)
    }

    const handleToggleLike = async (post) => {
      try {
        const response = await toggleLike(
          post._id,
          currentUser.value.userId,
          currentUser.value.name
        )
        
        if (response.success) {
          // Update local post data
          const postIndex = posts.value.findIndex(p => p._id === post._id)
          if (postIndex !== -1) {
            posts.value[postIndex].likes = response.data.likes
          }
        }
      } catch (error) {
        console.error('Error toggling like:', error)
        if (window.$toast) {
          window.$toast.error('Không thể thực hiện thao tác')
        }
      }
    }

    const handleAddComment = async (postId) => {
      const content = commentInputs.value[postId]
      if (!content || !content.trim()) return

      try {
        const commentData = {
          author: {
            userId: currentUser.value.userId,
            name: currentUser.value.name,
            avatar: currentUser.value.avatar
          },
          content: content.trim()
        }

        const response = await addComment(postId, commentData)
        
        if (response.success) {
          // Update local post data
          const postIndex = posts.value.findIndex(p => p._id === postId)
          if (postIndex !== -1) {
            posts.value[postIndex].comments.push(response.data.comment)
          }
          commentInputs.value[postId] = ''
        }
      } catch (error) {
        console.error('Error adding comment:', error)
        if (window.$toast) {
          window.$toast.error('Không thể thêm bình luận')
        }
      }
    }

    const handleDeleteComment = async (postId, commentId) => {
      if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return

      try {
        const response = await deleteComment(postId, commentId, currentUser.value.userId)
        
        if (response.success) {
          // Update local post data
          const postIndex = posts.value.findIndex(p => p._id === postId)
          if (postIndex !== -1) {
            const commentIndex = posts.value[postIndex].comments.findIndex(c => c._id === commentId)
            if (commentIndex !== -1) {
              posts.value[postIndex].comments.splice(commentIndex, 1)
            }
          }
          if (window.$toast) {
            window.$toast.success('Đã xóa bình luận')
          }
        }
      } catch (error) {
        console.error('Error deleting comment:', error)
        if (window.$toast) {
          window.$toast.error('Không thể xóa bình luận')
        }
      }
    }

    const handleDeletePost = async (postId) => {
      if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return

      try {
        const response = await deletePost(postId, currentUser.value.userId)
        
        if (response.success) {
          const postIndex = posts.value.findIndex(p => p._id === postId)
          if (postIndex !== -1) {
            posts.value.splice(postIndex, 1)
          }
          const allPostIndex = allPosts.value.findIndex(p => p._id === postId)
          if (allPostIndex !== -1) {
            allPosts.value.splice(allPostIndex, 1)
          }
          if (window.$toast) {
            window.$toast.success('Đã xóa bài viết')
          }
        }
        activePostMenu.value = null
      } catch (error) {
        console.error('Error deleting post:', error)
        if (window.$toast) {
          window.$toast.error('Không thể xóa bài viết')
        }
      }
    }

    const toggleComments = (postId) => {
      activeComments.value = activeComments.value === postId ? null : postId
    }

    const togglePostMenu = (postId) => {
      activePostMenu.value = activePostMenu.value === postId ? null : postId
    }

    const isLikedByUser = (post) => {
      if (!post.likes || post.likes.length === 0) return false
      return post.likes.some(like => like.userId === currentUser.value.userId)
    }

    const isPostAuthor = (post) => {
      return post.author.userId === currentUser.value.userId
    }

    const isCommentAuthor = (comment) => {
      return comment.author.userId === currentUser.value.userId
    }

    const getUserInitial = () => {
      return currentUser.value.name.charAt(0).toUpperCase()
    }

    const getUserAvatarUrl = (avatarPath) => {
      if (!avatarPath) return ''
      
      // If already a full URL, return as is
      if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath
      }
      
      // If starts with /uploads, it's from auth service (port 3001)
      if (avatarPath.startsWith('/uploads')) {
        return `http://localhost:3001${avatarPath}`
      }
      
      // Otherwise assume it's a relative path
      return avatarPath
    }

    const getImageUrl = (imagePath) => {
      if (imagePath.startsWith('http')) return imagePath
      return `http://localhost:3005${imagePath}`
    }

    const getImageGridClass = (count) => {
      if (count === 1) return 'grid-1'
      if (count === 2) return 'grid-2'
      if (count === 3) return 'grid-3'
      return 'grid-4'
    }

    const formatTime = (timestamp) => {
      const now = new Date()
      const time = new Date(timestamp)
      const diff = Math.floor((now - time) / 1000) // seconds

      if (diff < 60) return 'Vừa xong'
      if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
      if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
      if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`
      
      return time.toLocaleDateString('vi-VN')
    }

    const closeCreateModal = () => {
      showCreateModal.value = false
      newPost.value = {
        content: '',
        images: []
      }
    }

    const openImageViewer = (images, index) => {
      // Future: implement image viewer/lightbox
      console.log('Open image viewer:', images, index)
    }

    const getEmptyStateTitle = () => {
      if (searchQuery.value) {
        return 'Không tìm thấy kết quả'
      }
      if (activeFilter.value === 'mine') {
        return 'Bạn chưa có bài viết nào'
      }
      return 'Chưa có bài viết nào'
    }

    const getEmptyStateMessage = () => {
      if (searchQuery.value) {
        return `Không có bài viết nào khớp với "${searchQuery.value}"`
      }
      if (activeFilter.value === 'mine') {
        return 'Hãy chia sẻ suy nghĩ của bạn với cộng đồng!'
      }
      if (activeFilter.value === 'popular') {
        return 'Chưa có bài viết phổ biến nào'
      }
      return 'Hãy là người đầu tiên chia sẻ điều gì đó!'
    }

    const resetFilters = () => {
      searchQuery.value = ''
      activeFilter.value = 'all'
      posts.value = [...allPosts.value]
    }

    // Close menus when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.post-menu-btn')) {
        activePostMenu.value = null
      }
    }

    onMounted(() => {
      console.log('🚀 Forum page mounted')
      console.log('👤 Current user:', currentUser.value)
      
      fetchPosts()
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('scroll', handleScroll)
      
      // Focus textarea when modal opens
      if (showCreateModal.value) {
        nextTick(() => {
          postTextarea.value?.focus()
        })
      }
    })

    return {
      loading,
      posting,
      uploading,
      posts,
      allPosts,
      showCreateModal,
      activeComments,
      activePostMenu,
      commentInputs,
      currentUser,
      newPost,
      canPost,
      postTextarea,
      searchQuery,
      activeFilter,
      filterOptions,
      showScrollTop,
      totalPosts,
      totalMembers,
      fetchPosts,
      handleSearch,
      clearSearch,
      setFilter,
      applyFilter,
      scrollToTop,
      handleCreatePost,
      handleImageUpload,
      removeImage,
      handleToggleLike,
      handleAddComment,
      handleDeleteComment,
      handleDeletePost,
      toggleComments,
      togglePostMenu,
      isLikedByUser,
      isPostAuthor,
      isCommentAuthor,
      getUserInitial,
      getUserAvatarUrl,
      getImageUrl,
      getImageGridClass,
      formatTime,
      closeCreateModal,
      openImageViewer,
      getEmptyStateTitle,
      getEmptyStateMessage,
      resetFilters
    }
  }
}
</script>

<style scoped>
.forum-page {
  padding-top: 80px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ebf0 100%);
}

.forum-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%, #f093fb 100%);
  position: relative;
  overflow: hidden;
  padding: 60px 20px 80px;
}

.forum-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  color: white;
  letter-spacing: -0.5px;
}

.gradient-text {
  background: linear-gradient(135deg, #fff 0%, #a8edea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 32px;
  font-weight: 500;
}

/* Search Bar */
.search-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 14px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.search-container:focus-within {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}

.search-icon {
  color: #667eea;
  flex-shrink: 0;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #050505;
  outline: none;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-search {
  background: #f0f2f5;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #65676b;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-left: 8px;
}

.clear-search:hover {
  background: #e4e6eb;
  transform: rotate(90deg);
}

.forum-container {
  padding: 24px 20px;
  margin-top: -40px;
  position: relative;
  z-index: 2;
}

.container-wide {
  max-width: 1200px;
  margin: 0 auto;
}

.forum-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.sidebar-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.sidebar-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #65676b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.btn-create-post {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-create-post:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-create-post:active {
  transform: translateY(0);
}

/* Filter Options */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  color: #65676b;
  font-weight: 500;
}

.filter-btn:hover {
  background: #f0f2f5;
  color: #050505;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  color: #667eea;
  font-weight: 600;
}

.filter-icon {
  font-size: 1.25rem;
}

.filter-label {
  flex: 1;
  font-size: 0.9375rem;
}

/* Stats Card */
.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stats-card .sidebar-title {
  color: rgba(255, 255, 255, 0.9);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: white;
}

.stat-label {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.8);
}

.main-feed {
  flex: 1;
  min-width: 0;
}

/* Scroll to Top Button */
.scroll-top-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 1000;
}

.scroll-top-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
}

.scroll-top-btn:active {
  transform: translateY(-2px);
}

/* Create Post Card */
.create-post-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.create-post-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.create-post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar,
.author-avatar,
.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.post-input {
  flex: 1;
  border: none;
  background: #f0f2f5;
  border-radius: 24px;
  padding: 12px 16px;
  font-size: 1rem;
  cursor: pointer;
  color: #65676b;
}

.post-input:focus {
  outline: none;
}

.create-post-actions {
  display: flex;
  justify-content: center;
  padding-top: 12px;
  border-top: 1px solid #e4e6eb;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #65676b;
  font-weight: 600;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #f0f2f5;
}

/* Results Info */
.results-info {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.results-text {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #65676b;
  font-size: 0.9375rem;
}

.results-text svg {
  color: #667eea;
  flex-shrink: 0;
}

.results-text strong {
  color: #667eea;
  font-weight: 600;
}

/* Posts Feed */
.posts-feed {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.post-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

/* Post Header */
.post-header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #050505;
  font-size: 0.9375rem;
}

.post-time {
  font-size: 0.8125rem;
  color: #65676b;
}

.post-menu-btn {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  color: #65676b;
  transition: background 0.2s;
}

.post-menu-btn:hover {
  background: #f0f2f5;
}

.post-menu-dropdown {
  position: absolute;
  top: 50px;
  right: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 180px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9375rem;
  color: #050505;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #f0f2f5;
}

.menu-item.delete {
  color: #e74c3c;
}

/* Post Content */
.post-content {
  padding: 0 16px 16px;
}

.post-text {
  color: #050505;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 12px 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Post Images */
.post-images {
  margin-top: 12px;
}

.images-grid {
  display: grid;
  gap: 4px;
  border-radius: 8px;
  overflow: hidden;
}

.images-grid.grid-1 {
  grid-template-columns: 1fr;
}

.images-grid.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.images-grid.grid-3 {
  grid-template-columns: repeat(2, 1fr);
}

.images-grid.grid-3 .post-image:first-child {
  grid-row: span 2;
}

.images-grid.grid-4 {
  grid-template-columns: repeat(2, 1fr);
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  min-height: 200px;
  max-height: 500px;
}

.images-grid.grid-2 .post-image,
.images-grid.grid-3 .post-image,
.images-grid.grid-4 .post-image {
  max-height: 300px;
}

/* Post Stats */
.post-stats {
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  color: #65676b;
  font-size: 0.9375rem;
  border-top: 1px solid #e4e6eb;
}

.stat-item span {
  cursor: pointer;
}

.stat-item span:hover {
  text-decoration: underline;
}

/* Post Actions */
.post-actions {
  padding: 4px 16px 8px;
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #e4e6eb;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #65676b;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: background 0.2s;
}

.action-button:hover {
  background: #f0f2f5;
}

.action-button.liked {
  color: #e74c3c;
}

/* Comments Section */
.comments-section {
  padding: 8px 16px 16px;
  background: #f7f8fa;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.comment-item {
  display: flex;
  gap: 8px;
}

.comment-content {
  flex: 1;
}

.comment-bubble {
  background: #f0f2f5;
  border-radius: 18px;
  padding: 8px 12px;
  display: inline-block;
}

.comment-author {
  font-weight: 600;
  font-size: 0.8125rem;
  color: #050505;
  margin-bottom: 2px;
}

.comment-text {
  font-size: 0.9375rem;
  color: #050505;
  word-wrap: break-word;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  margin-left: 12px;
}

.comment-time {
  font-size: 0.75rem;
  color: #65676b;
}

.delete-comment-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.75rem;
  color: #65676b;
  font-weight: 600;
}

.delete-comment-btn:hover {
  text-decoration: underline;
}

/* Add Comment */
.add-comment {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f0f2f5;
  border-radius: 24px;
  padding-right: 8px;
}

.comment-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 12px;
  font-size: 0.9375rem;
  border-radius: 24px;
}

.comment-input:focus {
  outline: none;
}

.send-comment-btn {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.send-comment-btn:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.1);
}

.send-comment-btn:disabled {
  color: #bcc0c4;
  cursor: not-allowed;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.spinner {
  width: 56px;
  height: 56px;
  border: 5px solid #f0f2f5;
  border-top-color: #667eea;
  border-right-color: #764ba2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 1.125rem;
  color: #65676b;
  font-weight: 500;
}

.empty-state {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fc 100%);
}

.empty-state svg {
  color: #667eea;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #050505;
  margin-bottom: 12px;
  font-weight: 700;
}

.empty-state p {
  color: #65676b;
  margin-bottom: 28px;
  font-size: 1.0625rem;
}

.btn-create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 32px;
  font-size: 1.0625rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Create Post Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 580px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.create-post-modal {
  max-height: 85vh;
}

.modal-header {
  padding: 24px;
  border-bottom: 2px solid #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.modal-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #050505;
  margin: 0;
  flex: 1;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-close {
  position: absolute;
  right: 20px;
  background: #f0f2f5;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #65676b;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #e4e6eb;
  transform: rotate(90deg);
}

.modal-body {
  padding: 16px 20px;
}

.post-author-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.post-textarea {
  width: 100%;
  border: none;
  resize: vertical;
  font-size: 1.5rem;
  color: #050505;
  font-family: inherit;
  min-height: 120px;
  padding: 0;
}

.post-textarea:focus {
  outline: none;
}

.post-textarea::placeholder {
  color: #bcc0c4;
}

/* Image Preview */
.image-preview-container {
  margin-top: 16px;
  border: 1px solid #e4e6eb;
  border-radius: 8px;
  padding: 12px;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}

.image-preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.remove-image-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f0f2f5;
  border-radius: 8px;
  margin-top: 12px;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid #e4e6eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.add-to-post {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid #e4e6eb;
  border-radius: 8px;
  margin-top: 16px;
}

.add-to-post-label {
  font-weight: 600;
  color: #050505;
  font-size: 0.9375rem;
}

.add-to-post-actions {
  display: flex;
  gap: 4px;
}

.add-action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.add-action-btn:hover {
  background: #f0f2f5;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 2px solid #f0f2f5;
  background: #f8f9fc;
}

.btn-post {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 1.0625rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-post::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-post:hover:not(:disabled)::before {
  left: 100%;
}

.btn-post:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-post:active:not(:disabled) {
  transform: translateY(0);
}

.btn-post:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.posting-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

/* Responsive */
@media (max-width: 1024px) {
  .forum-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: relative;
    top: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .sidebar-card {
    height: 100%;
  }
}

@media (max-width: 768px) {
  .forum-hero {
    padding: 40px 16px 60px;
  }
  
  .hero-title {
    font-size: 1.75rem;
  }
  
  .hero-subtitle {
    font-size: 0.9375rem;
    margin-bottom: 24px;
  }
  
  .search-wrapper {
    max-width: 100%;
  }
  
  .search-container {
    padding: 12px 20px;
  }
  
  .forum-container {
    padding: 16px 12px;
    margin-top: -30px;
  }
  
  .container-wide {
    max-width: 100%;
  }
  
  .sidebar {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .btn-create-post {
    padding: 12px 16px;
    font-size: 0.9375rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .create-post-card {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .posts-feed {
    gap: 16px;
  }
  
  .post-card {
    border-radius: 12px;
  }
  
  .post-header {
    padding: 12px;
  }
  
  .post-content {
    padding: 0 12px 12px;
  }
  
  .post-stats,
  .post-actions {
    padding-left: 12px;
    padding-right: 12px;
  }
  
  .comments-section {
    padding: 8px 12px 12px;
  }
  
  .post-textarea {
    font-size: 1.125rem;
  }
  
  .modal-content {
    margin: 20px;
    max-width: calc(100vw - 40px);
  }
  
  .scroll-top-btn {
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
  }
  
  .empty-state {
    padding: 60px 24px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }
  
  .hero-subtitle {
    font-size: 0.875rem;
  }
  
  .search-container {
    padding: 10px 16px;
  }
  
  .filter-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  
  .action-button {
    font-size: 0.875rem;
    padding: 6px;
  }
  
  .post-text {
    font-size: 0.9375rem;
  }
}
</style>

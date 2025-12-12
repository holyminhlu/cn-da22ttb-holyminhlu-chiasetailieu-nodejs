<template>
  <div class="profile-page" v-if="!loading">
    <!-- Skip to main content link for accessibility -->
    <a href="#main-content" class="skip-link">Bỏ qua đến nội dung chính</a>

    <!-- Profile Hero -->
    <ProfileHero
      :cover-url="userProfile.cover"
      :avatar-url="userProfile.avatar"
      :display-name="userProfile.displayName || userProfile.fullName"
      :username="userProfile.username || userProfile.email"
      :role="userRole"
      :verified="userProfile.verified"
      :location="userProfile.location"
      :is-owner="isOwner"
      @edit-profile="openEditModal"
      @upload-avatar="openAvatarUploader"
      @upload-cover="openCoverUploader"
      @follow="handleFollow"
      @message="handleMessage"
    />

    <!-- Main Content -->
    <main id="main-content" class="profile-main">
      <div class="container">
        <div class="profile-layout">
          <!-- Left Sidebar (Desktop) -->
          <aside class="profile-sidebar" role="complementary">
            <ProfileStats
              :uploads="userProfile.stats?.uploads || 0"
              :downloads="userProfile.stats?.downloads || 0"
              :bookmarks="userProfile.stats?.bookmarks || 0"
              :points="userProfile.stats?.points || 0"
            />

            <!-- Bio Card -->
            <div class="bio-card">
              <h3 class="card-title">Giới thiệu</h3>
              <p v-if="userProfile.bio" class="bio-text">{{ userProfile.bio }}</p>
              <p v-else class="bio-empty">Chưa có thông tin giới thiệu.</p>
              
              <div v-if="userProfile.program" class="bio-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>{{ userProfile.program }}</span>
              </div>

              <div v-if="userProfile.location" class="bio-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{{ userProfile.location }}</span>
              </div>

              <div v-if="userProfile.joined" class="bio-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Tham gia {{ formatDate(userProfile.joined) }}</span>
              </div>
            </div>

            <!-- Badges (if any) -->
            <div v-if="badges.length > 0" class="badges-card">
              <h3 class="card-title">Thành tựu</h3>
              <div class="badges-list">
                <div v-for="badge in badges" :key="badge.id" class="badge-item" :title="badge.description">
                  <span class="badge-icon">{{ badge.icon }}</span>
                  <span class="badge-name">{{ badge.name }}</span>
                </div>
              </div>
            </div>
          </aside>

          <!-- Right Main Content -->
          <div class="profile-content">
            <ProfileTabs
              :tabs="tabs"
              :active-tab="activeTab"
              @tab-change="handleTabChange"
            >
              <!-- Overview Tab -->
              <template #overview>
                <div class="tab-content">
                  <h2 class="tab-title">Tổng quan</h2>
                  <p v-if="userProfile.bio" class="overview-bio">{{ userProfile.bio }}</p>
                  
                  <!-- Highlighted Documents -->
                  <div v-if="highlightedDocuments.length > 0" class="highlighted-docs">
                    <h3 class="section-title">Tài liệu nổi bật</h3>
                    <div class="documents-grid">
                      <DocumentCard
                        v-for="doc in highlightedDocuments"
                        :key="doc.id"
                        :document="doc"
                        @preview="handlePreview"
                        @download="handleDownload"
                        @save="handleSave"
                      />
                    </div>
                  </div>
                </div>
              </template>

              <!-- Documents Tab -->
              <template #documents>
                <div class="tab-content">
                  <div class="documents-header">
                    <h2 class="tab-title">Tài liệu của tôi</h2>
                    <button v-if="isOwner" class="btn-primary" @click="handleUploadDocument">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      Tải lên tài liệu
                    </button>
                  </div>

                  <!-- Filters and Sort -->
                  <div class="documents-filters">
                    <div class="filter-group">
                      <label for="filter-visibility">Lọc:</label>
                      <select id="filter-visibility" v-model="documentFilter" class="filter-select">
                        <option value="all">Tất cả</option>
                        <option value="drafts">Bản nháp</option>
                        <option value="published">Đã xuất bản</option>
                        <option value="private">Riêng tư</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label for="sort-documents">Sắp xếp:</label>
                      <select id="sort-documents" v-model="documentSort" class="filter-select">
                        <option value="newest">Mới nhất</option>
                        <option value="downloads">Nhiều lượt tải</option>
                        <option value="rating">Đánh giá cao</option>
                      </select>
                    </div>
                    <div class="view-toggle">
                      <button
                        :class="['view-btn', { active: viewMode === 'grid' }]"
                        @click="viewMode = 'grid'"
                        aria-label="Xem dạng lưới"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                      </button>
                      <button
                        :class="['view-btn', { active: viewMode === 'list' }]"
                        @click="viewMode = 'list'"
                        aria-label="Xem dạng danh sách"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Documents List/Grid -->
                  <div v-if="filteredDocuments.length > 0" :class="['documents-grid', { 'list-view': viewMode === 'list' }]">
                    <DocumentCard
                      v-for="doc in filteredDocuments"
                      :key="doc.id"
                      :document="doc"
                      :compact="viewMode === 'list'"
                      @preview="handlePreview"
                      @download="handleDownload"
                      @save="handleSave"
                    />
                  </div>
                  <div v-else class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <h3>Bạn chưa tải lên tài liệu nào</h3>
                    <p v-if="isOwner">Bắt đầu bằng cách tải lên tài liệu đầu tiên của bạn.</p>
                    <button v-if="isOwner" class="btn-primary" @click="handleUploadDocument">
                      Tải lên tài liệu đầu tiên
                    </button>
                  </div>
                </div>
              </template>

              <!-- Bookmarks Tab -->
              <template #bookmarks>
                <div class="tab-content">
                  <h2 class="tab-title">Đã lưu</h2>
                  <div v-if="bookmarks.length > 0" class="documents-grid">
                    <DocumentCard
                      v-for="doc in bookmarks"
                      :key="doc.id"
                      :document="doc"
                      @preview="handlePreview"
                      @download="handleDownload"
                      @save="handleSave"
                    />
                  </div>
                  <div v-else class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h3>Chưa có tài liệu nào được lưu</h3>
                    <p>Lưu tài liệu để truy cập nhanh sau này.</p>
                  </div>
                </div>
              </template>

              <!-- Activity Tab -->
              <template #activity>
                <div class="tab-content">
                  <h2 class="tab-title">Hoạt động</h2>
                  <ActivityTimeline :activities="activities" />
                </div>
              </template>

              <!-- Settings Tab -->
              <template #settings>
                <div class="tab-content">
                  <h2 class="tab-title">Cài đặt</h2>
                  <SettingsForm
                    :initial-data="userProfile"
                    @save="handleSettingsSave"
                    @cancel="handleSettingsCancel"
                  />
                </div>
              </template>

              <!-- Security Tab -->
              <template #security>
                <div class="tab-content">
                  <h2 class="tab-title">Bảo mật</h2>
                  <SecurityForm
                    :connected-accounts="connectedAccounts"
                    @change-password="handleChangePassword"
                    @enable-2fa="handleEnable2FA"
                    @disconnect-account="handleDisconnectAccount"
                  />
                </div>
              </template>
            </ProfileTabs>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <EditProfileModal
      :show="showEditModal"
      :initial-data="userProfile"
      @close="showEditModal = false"
      @save="handleProfileSave"
    />

    <AvatarUploader
      :show="showAvatarUploader"
      @close="showAvatarUploader = false"
      @save="handleAvatarSave"
    />

    <CoverUploader
      :show="showCoverUploader"
      @close="showCoverUploader = false"
      @save="handleCoverSave"
    />

    <ConfirmModal
      :show="showConfirmModal"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :type="confirmModal.type"
      @confirm="handleConfirm"
      @cancel="showConfirmModal = false"
    />

    <!-- Toast Notifications -->
    <Toast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />
  </div>

  <!-- Loading State -->
  <div v-else class="profile-loading">
    <div class="skeleton-hero"></div>
    <div class="skeleton-content">
      <div class="skeleton-sidebar"></div>
      <div class="skeleton-main"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProfileHero from '@/components/profile/ProfileHero.vue'
import ProfileStats from '@/components/profile/ProfileStats.vue'
import ProfileTabs from '@/components/profile/ProfileTabs.vue'
import EditProfileModal from '@/components/profile/EditProfileModal.vue'
import AvatarUploader from '@/components/profile/AvatarUploader.vue'
import CoverUploader from '@/components/profile/CoverUploader.vue'
import ActivityTimeline from '@/components/profile/ActivityTimeline.vue'
import SettingsForm from '@/components/profile/SettingsForm.vue'
import SecurityForm from '@/components/profile/SecurityForm.vue'
import DocumentCard from '@/components/DocumentCard.vue'
import ConfirmModal from '@/components/profile/ConfirmModal.vue'
import Toast from '@/components/profile/Toast.vue'

export default {
  name: 'UserProfileView',
  components: {
    ProfileHero,
    ProfileStats,
    ProfileTabs,
    EditProfileModal,
    AvatarUploader,
    CoverUploader,
    ActivityTimeline,
    SettingsForm,
    SecurityForm,
    DocumentCard,
    ConfirmModal,
    Toast
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const loading = ref(true)
    const activeTab = ref(route.query.tab || 'overview')
    const showEditModal = ref(false)
    const showAvatarUploader = ref(false)
    const showCoverUploader = ref(false)
    const showConfirmModal = ref(false)
    const documentFilter = ref('all')
    const documentSort = ref('newest')
    const viewMode = ref('grid')
    
    const userProfile = ref({
      id: '',
      displayName: '',
      fullName: '',
      username: '',
      email: '',
      role: 'student',
      program: '',
      bio: '',
      avatar: '',
      cover: '',
      verified: false,
      location: '',
      joined: '',
      stats: {
        uploads: 0,
        downloads: 0,
        bookmarks: 0,
        points: 0
      }
    })

    const documents = ref([])
    const bookmarks = ref([])
    const activities = ref([])
    const badges = ref([])
    const connectedAccounts = ref([])

    const confirmModal = ref({
      title: '',
      message: '',
      type: 'danger',
      onConfirm: null
    })

    const toast = ref({
      show: false,
      message: '',
      type: 'success'
    })

    // Computed
    const isOwner = computed(() => {
      const currentEmail = localStorage.getItem('userEmail')
      return currentEmail === userProfile.value.email
    })

    const userRole = computed(() => {
      const roleMap = {
        'student': 'Sinh viên',
        'instructor': 'Giảng viên',
        'admin': 'Quản trị viên',
        'guest': 'Khách'
      }
      return roleMap[userProfile.value.role] || userProfile.value.role
    })

    const tabs = computed(() => [
      { id: 'overview', label: 'Tổng quan', icon: '📊' },
      { id: 'documents', label: 'Tài liệu', icon: '📄' },
      { id: 'bookmarks', label: 'Đã lưu', icon: '🔖' },
      { id: 'activity', label: 'Hoạt động', icon: '📈' },
      { id: 'settings', label: 'Cài đặt', icon: '⚙️' },
      { id: 'security', label: 'Bảo mật', icon: '🔒' }
    ])

    const highlightedDocuments = computed(() => {
      return documents.value
        .filter(doc => doc.visibility === 'public')
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, 6)
    })

    const filteredDocuments = computed(() => {
      let filtered = [...documents.value]

      // Filter by visibility
      if (documentFilter.value !== 'all') {
        filtered = filtered.filter(doc => {
          if (documentFilter.value === 'drafts') return doc.status === 'draft'
          if (documentFilter.value === 'published') return doc.status === 'published'
          if (documentFilter.value === 'private') return doc.visibility === 'private'
          return true
        })
      }

      // Sort
      if (documentSort.value === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      } else if (documentSort.value === 'downloads') {
        filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      } else if (documentSort.value === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      }

      return filtered
    })

    // Methods
    const fetchUserProfile = async () => {
      loading.value = true
      try {
        // Get user ID from route or localStorage
        const userId = route.params.id || localStorage.getItem('userId')
        const userEmail = route.params.email || localStorage.getItem('userEmail')

        // TODO: Replace with actual API call
        // const response = await fetch(`/api/users/${userId}`)
        // const data = await response.json()

        // Mock data for now
        const mockData = {
          id: userId || 'u123',
          displayName: localStorage.getItem('userFullName') || 'Nguyễn Văn A',
          fullName: localStorage.getItem('userFullName') || 'Nguyễn Văn A',
          username: userEmail?.split('@')[0] || 'nguyenvana',
          email: userEmail || 'nguyenvana@example.com',
          role: localStorage.getItem('userRole') || 'student',
          program: 'CNTT',
          bio: 'Sinh viên năm 4, thích chia sẻ tài liệu học tập.',
          avatar: localStorage.getItem('userAvatar') || '',
          cover: localStorage.getItem('userCover') || '',
          verified: localStorage.getItem('userVerified') === 'true',
          location: 'Hà Nội',
          joined: '2022-09-12',
          stats: {
            uploads: 12,
            downloads: 4520,
            bookmarks: 34,
            points: 128
          }
        }

        userProfile.value = { ...mockData }
        
        // Fetch documents, bookmarks, activities
        await Promise.all([
          fetchDocuments(),
          fetchBookmarks(),
          fetchActivities()
        ])
      } catch (error) {
        console.error('Error fetching profile:', error)
        showToast('Không thể tải thông tin hồ sơ', 'error')
      } finally {
        loading.value = false
      }
    }

    const fetchDocuments = async () => {
      try {
        // Get uploaderId from localStorage (the user_id from login)
        const uploaderId = localStorage.getItem('userId')
        if (!uploaderId) {
          console.warn('No uploader ID found, skipping documents fetch')
          documents.value = []
          return
        }
        
        console.log('Fetching documents for user:', uploaderId)
        
        // Call API to get user's documents
        const response = await fetch(`http://localhost:3000/api/documents/search?uploaderId=${uploaderId}&limit=100&sortBy=newest`)
        const result = await response.json()
        
        console.log('Documents fetch result:', result)
        
        if (result.success && result.data) {
          documents.value = result.data
          // Update stats with actual count
          userProfile.value.stats.uploads = result.data.length
        } else {
          documents.value = []
        }
      } catch (error) {
        console.error('Error fetching documents:', error)
        documents.value = []
      }
    }

    const fetchBookmarks = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          console.warn('No user ID found, skipping bookmarks fetch')
          bookmarks.value = []
          return
        }
        
        console.log('Fetching bookmarks for user:', userId)
        
        // Call API to get user's bookmarks
        const response = await fetch(`http://localhost:3000/api/documents/bookmarks/${userId}`)
        
        if (!response.ok) {
          console.error('Failed to fetch bookmarks:', response.status, response.statusText)
          bookmarks.value = []
          return
        }
        
        const result = await response.json()
        
        console.log('Bookmarks fetch result:', result)
        
        if (result.success && result.data && Array.isArray(result.data)) {
          bookmarks.value = result.data
          // Update stats with actual count
          userProfile.value.stats.bookmarks = result.data.length
          console.log(`✅ Loaded ${result.data.length} bookmarks`)
        } else {
          console.warn('No bookmarks data in response:', result)
          bookmarks.value = []
          userProfile.value.stats.bookmarks = 0
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error)
        bookmarks.value = []
        userProfile.value.stats.bookmarks = 0
      }
    }

    const fetchActivities = async () => {
      // TODO: API call
      activities.value = [
        {
          type: 'upload',
          text: 'Đã tải lên Slide Cơ sở dữ liệu',
          date: '2024-05-12',
          icon: '📤'
        }
      ]
    }

    const handleTabChange = (tabId) => {
      activeTab.value = tabId
      router.replace({ query: { tab: tabId } })
    }

    const openEditModal = () => {
      showEditModal.value = true
    }

    const openAvatarUploader = () => {
      showAvatarUploader.value = true
    }

    const openCoverUploader = () => {
      showCoverUploader.value = true
    }

    const handleProfileSave = async (data) => {
      try {
        // TODO: API call to save profile
        userProfile.value = { ...userProfile.value, ...data }
        showEditModal.value = false
        showToast('Hồ sơ đã được lưu', 'success')
      } catch (error) {
        showToast('Lỗi khi lưu hồ sơ', 'error')
      }
    }

    const handleAvatarSave = async (avatarUrl) => {
      try {
        // Lưu avatar URL vào user profile và localStorage
        userProfile.value.avatar = avatarUrl
        // Lưu vào localStorage để giữ lại sau khi đăng xuất/đăng nhập lại
        // Nếu avatarUrl là full URL, giữ nguyên; nếu là relative path, convert sang full URL
        const avatarUrlToSave = avatarUrl.startsWith('http') 
          ? avatarUrl 
          : avatarUrl.startsWith('/') 
            ? `http://localhost:3001${avatarUrl}`
            : `http://localhost:3001/uploads/avatars/${avatarUrl}`
        localStorage.setItem('userAvatar', avatarUrlToSave)
        showAvatarUploader.value = false
        showToast('Ảnh đại diện đã được cập nhật', 'success')
      } catch (error) {
        showToast('Lỗi khi tải lên ảnh đại diện', 'error')
      }
    }

    const handleCoverSave = async (coverUrl) => {
      try {
        userProfile.value.cover = coverUrl
        // Lưu cover_url vào localStorage để giữ lại sau khi đăng xuất/đăng nhập lại
        localStorage.setItem('userCover', coverUrl)
        showCoverUploader.value = false
        showToast('Ảnh bìa đã được cập nhật', 'success')
      } catch (error) {
        showToast('Lỗi khi tải lên ảnh bìa', 'error')
      }
    }

    const handleFollow = async () => {
      // TODO: API call
      showToast('Đã theo dõi', 'success')
    }

    const handleMessage = () => {
      // TODO: Open message modal
      showToast('Tính năng đang được phát triển', 'info')
    }

    const handleUploadDocument = () => {
      // TODO: Open upload modal
      showToast('Tính năng đang được phát triển', 'info')
    }

    const handlePreview = (document) => {
      // TODO: Open preview modal
      console.log('Preview:', document)
    }

    const handleDownload = (document) => {
      // TODO: Download document
      console.log('Download:', document)
    }

    const handleSave = async (data) => {
      console.log('💾 UserProfileView - handleSave called:', data)
      try {
        const { document, saved } = data
        const userId = localStorage.getItem('userId')
        console.log('💾 UserProfileView - UserId from localStorage:', userId)
        
        if (!userId) {
          console.warn('💾 UserProfileView - No userId found')
          showToast('Bạn cần đăng nhập để lưu tài liệu', 'error')
          return
        }
        
        const documentId = document.document_id || document.id || document._id
        console.log('💾 UserProfileView - Document ID to save:', documentId)
        
        // Call API to add/remove bookmark
        const endpoint = 'http://localhost:3000/api/documents/bookmarks'
        
        console.log('💾 UserProfileView - Sending request to:', endpoint)
        console.log('💾 UserProfileView - Request body:', { userId, documentId, method: saved ? 'POST' : 'DELETE' })
        
        const response = await fetch(endpoint, {
          method: saved ? 'POST' : 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            documentId: documentId
          })
        })
        
        console.log('💾 UserProfileView - Response status:', response.status, response.statusText)
        
        // Handle non-JSON responses (like timeout errors)
        if (!response.ok || response.status >= 400) {
          const contentType = response.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text()
            console.error('❌ UserProfileView - Non-JSON response:', text)
            throw new Error(`Server error: ${response.status} ${response.statusText}. ${text.substring(0, 100)}`)
          }
        }
        
        const result = await response.json()
        console.log('💾 UserProfileView - Response data:', result)
        
        if (result.success) {
          console.log('✅ UserProfileView - Bookmark saved successfully')
          showToast(saved ? 'Đã lưu tài liệu thành công!' : 'Đã bỏ lưu tài liệu', 'success')
          // Always refresh bookmarks to update UI
          await fetchBookmarks()
        } else {
          console.error('❌ UserProfileView - Bookmark save failed:', result.message)
          showToast(result.message || 'Có lỗi xảy ra', 'error')
        }
      } catch (error) {
        console.error('❌ UserProfileView - Error saving bookmark:', error)
        showToast('Có lỗi xảy ra khi lưu tài liệu', 'error')
      }
    }

    const handleSettingsSave = async (data) => {
      try {
        // TODO: API call to save settings
        // await updateSettings(data)
        userProfile.value = { ...userProfile.value, ...data }
        showToast('Cài đặt đã được lưu', 'success')
      } catch (error) {
        showToast('Lỗi khi lưu cài đặt', 'error')
      }
    }

    const handleSettingsCancel = () => {
      // Reset form
    }

    const handleChangePassword = async (data) => {
      try {
        // TODO: API call to change password
        // await changePassword(data.currentPassword, data.newPassword)
        console.log('Password change requested for:', data)
        showToast('Mật khẩu đã được thay đổi', 'success')
      } catch (error) {
        showToast('Lỗi khi thay đổi mật khẩu', 'error')
      }
    }

    const handleEnable2FA = async () => {
      // TODO: Open 2FA setup modal
      showToast('Tính năng đang được phát triển', 'info')
    }

    const handleDisconnectAccount = (provider) => {
      confirmModal.value = {
        title: 'Xác nhận ngắt kết nối',
        message: `Bạn có chắc chắn muốn ngắt kết nối tài khoản ${provider}?`,
        type: 'danger',
        onConfirm: async () => {
          // TODO: API call
          connectedAccounts.value = connectedAccounts.value.filter(acc => acc.provider !== provider)
          showToast('Đã ngắt kết nối tài khoản', 'success')
          showConfirmModal.value = false
        }
      }
      showConfirmModal.value = true
    }

    const handleConfirm = () => {
      if (confirmModal.value.onConfirm) {
        confirmModal.value.onConfirm()
      }
    }

    const showToast = (message, type = 'success') => {
      toast.value = { show: true, message, type }
      setTimeout(() => {
        toast.value.show = false
      }, 5000)
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' })
    }

    onMounted(() => {
      fetchUserProfile()
    })

    return {
      loading,
      activeTab,
      userProfile,
      documents,
      bookmarks,
      activities,
      badges,
      connectedAccounts,
      isOwner,
      userRole,
      tabs,
      highlightedDocuments,
      filteredDocuments,
      documentFilter,
      documentSort,
      viewMode,
      showEditModal,
      showAvatarUploader,
      showCoverUploader,
      showConfirmModal,
      confirmModal,
      toast,
      handleTabChange,
      openEditModal,
      openAvatarUploader,
      openCoverUploader,
      handleProfileSave,
      handleAvatarSave,
      handleCoverSave,
      handleFollow,
      handleMessage,
      handleUploadDocument,
      handlePreview,
      handleDownload,
      handleSave,
      handleSettingsSave,
      handleSettingsCancel,
      handleChangePassword,
      handleEnable2FA,
      handleDisconnectAccount,
      handleConfirm,
      formatDate
    }
  }
}
</script>

<style scoped>
/* Profile Page Styles */
.profile-page {
  min-height: 100vh;
  background: #F8FAFF;
  padding-top: 80px; /* Header height */
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0B6EFD;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

.profile-main {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.profile-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

/* Sidebar */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bio-card,
.badges-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 1rem 0;
}

.bio-text {
  color: #64748B;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.bio-empty {
  color: #94A3B8;
  font-style: italic;
  margin-bottom: 1rem;
}

.bio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748B;
  font-size: 0.9375rem;
  margin-bottom: 0.5rem;
}

.bio-item svg {
  flex-shrink: 0;
  color: #0B6EFD;
}

.badges-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #F8FAFF;
  border-radius: 8px;
  transition: background 0.2s;
}

.badge-item:hover {
  background: #F1F5F9;
}

.badge-icon {
  font-size: 1.5rem;
}

.badge-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #0F172A;
}

/* Content */
.profile-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tab-content {
  padding: 2rem;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 1.5rem 0;
}

/* Documents */
.documents-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.documents-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  color: #64748B;
  font-weight: 500;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 0.9375rem;
  background: white;
  color: #0F172A;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.view-btn {
  padding: 0.5rem;
  border: 1px solid #E2E8F0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.view-btn.active {
  background: #0B6EFD;
  border-color: #0B6EFD;
  color: white;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.documents-grid.list-view {
  grid-template-columns: 1fr;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748B;
}

.empty-state svg {
  margin: 0 auto 1rem;
  color: #94A3B8;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #0B6EFD;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #0956D9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(11, 110, 253, 0.3);
}

/* Loading */
.profile-loading {
  padding-top: 80px;
}

.skeleton-hero {
  height: 300px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-content {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
  padding: 2rem;
}

.skeleton-sidebar,
.skeleton-main {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Responsive */
@media (min-width: 960px) {
  .profile-layout {
    grid-template-columns: 320px 1fr;
  }
}

@media (max-width: 959px) {
  .documents-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .documents-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .view-toggle {
    margin-left: 0;
  }
}

@media (max-width: 599px) {
  .tab-content {
    padding: 1rem;
  }

  .documents-grid {
    grid-template-columns: 1fr;
  }
}
</style>


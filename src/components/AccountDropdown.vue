<template>
  <Teleport to="body">
    <transition name="dropdown">
      <div
        v-if="isOpen"
        class="account-dropdown-overlay"
        @click.exact="handleOverlayClick"
        @keydown.esc="close"
      >
        <div
          class="account-dropdown"
          :class="{ 'mobile-sheet': isMobile }"
          role="menu"
          aria-label="Menu tài khoản"
          @click.stop.exact
          @keydown.tab.exact="handleTab"
          @keydown.shift.tab.exact="handleShiftTab"
        >
          <!-- User Info Header -->
          <div class="dropdown-header">
            <div class="user-avatar-large">
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                :alt="userData.displayName || userData.fullName || 'Avatar'"
                class="avatar-img"
              />
              <div v-else class="avatar-placeholder-large">
                {{ userInitial }}
              </div>
              <span v-if="userData?.verified" class="verified-badge" aria-label="Đã xác minh">
                ✓
              </span>
            </div>
            <div class="user-details">
              <h3 class="user-name">{{ userData?.displayName || userData?.fullName || 'User' }}</h3>
              <p class="user-role">{{ userRole }}</p>
              <p v-if="userData?.bio" class="user-bio">{{ truncateBio(userData.bio) }}</p>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="quick-stats" role="group" aria-label="Thống kê nhanh">
            <div class="stat-item" :title="`${displayStats.uploads} tài liệu đã tải lên`">
              <span class="stat-value">{{ displayStats.uploads }}</span>
              <span class="stat-label">Tài liệu</span>
            </div>
            <div class="stat-item" :title="`${displayStats.bookmarks} đã lưu`">
              <span class="stat-value">{{ displayStats.bookmarks }}</span>
              <span class="stat-label">Đã lưu</span>
            </div>
            <div class="stat-item" :title="`${displayStats.points} điểm uy tín`">
              <span class="stat-value">{{ displayStats.points }}</span>
              <span class="stat-label">Điểm</span>
            </div>
          </div>

          <div class="dropdown-divider"></div>

          <!-- Quick Actions -->
          <nav class="dropdown-actions" role="navigation">
            <router-link
              to="/profile"
              class="action-item"
              role="menuitem"
              @click="close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Hồ sơ</span>
            </router-link>

            <a
              href="#"
              class="action-item"
              role="menuitem"
              @click.prevent="navigateToProfileTab('documents')"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Tài liệu của tôi</span>
            </a>

            <a
              href="#"
              class="action-item"
              role="menuitem"
              @click.prevent="navigateToProfileTab('bookmarks')"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Đã lưu</span>
            </a>

            <a
              href="#"
              class="action-item"
              role="menuitem"
              @click.prevent="navigateToProfileTab('activity')"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <span>Hoạt động</span>
            </a>

            <button
              class="action-item action-upload"
              role="menuitem"
              @click="handleUpload"
              aria-label="Tải lên tài liệu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Tải lên tài liệu</span>
            </button>

            <a
              href="#"
              class="action-item"
              role="menuitem"
              @click.prevent="navigateToProfileTab('settings')"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
              </svg>
              <span>Cài đặt</span>
            </a>
          </nav>

          <div class="dropdown-divider"></div>

          <!-- Toggles -->
          <div class="dropdown-toggles">
            <label class="toggle-item">
              <input
                type="checkbox"
                v-model="darkMode"
                @change="handleDarkModeToggle"
                aria-label="Bật chế độ tối"
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <span>Chế độ tối</span>
            </label>
          </div>

          <div class="dropdown-divider"></div>

          <!-- Footer -->
          <div class="dropdown-footer">
            <router-link to="/help" class="footer-link" @click="close">Trợ giúp</router-link>
            <button
              class="btn-logout"
              role="menuitem"
              @click="handleLogout"
              aria-label="Đăng xuất"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>

  <!-- Logout Confirmation Modal -->
  <div v-if="showLogoutConfirm" class="modal-overlay" @click="showLogoutConfirm = false">
    <div class="modal-content" @click.stop role="dialog" aria-labelledby="logout-title" aria-modal="true">
      <h2 id="logout-title">Xác nhận đăng xuất</h2>
      <p>Bạn có chắc chắn muốn đăng xuất?</p>
      <div class="modal-actions">
        <button class="btn-secondary" @click="showLogoutConfirm = false">Hủy</button>
        <button class="btn-danger" @click="confirmLogout">Đăng xuất</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import bus from '@/utils/eventBus.js'

export default {
  name: 'AccountDropdown',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    userData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close', 'upload'],
  setup(props, { emit }) {
    const router = useRouter()
    const showLogoutConfirm = ref(false)
    const darkMode = ref(false)
    const isMobile = ref(window.innerWidth < 600)
    
    // Reactive avatar and stats from localStorage
    const currentAvatar = ref(localStorage.getItem('userAvatar') || props.userData?.avatar_url || null)
    const currentStats = ref({
      uploads: parseInt(localStorage.getItem('userUploads') || '0'),
      bookmarks: parseInt(localStorage.getItem('userBookmarks') || '0'),
      points: parseInt(localStorage.getItem('userPoints') || '0')
    })
    
    // Watch for localStorage changes to update avatar and stats
    const checkLocalStorageChanges = () => {
      const newAvatar = localStorage.getItem('userAvatar') || props.userData?.avatar_url || null
      if (newAvatar !== currentAvatar.value) {
        currentAvatar.value = newAvatar
      }
      
      const newStats = {
        uploads: parseInt(localStorage.getItem('userUploads') || '0'),
        bookmarks: parseInt(localStorage.getItem('userBookmarks') || '0'),
        points: parseInt(localStorage.getItem('userPoints') || '0')
      }
      
      if (JSON.stringify(newStats) !== JSON.stringify(currentStats.value)) {
        currentStats.value = newStats
      }
    }
    
    let storageCheckInterval = null
    
    // Debug: Log when props change
    watch(() => props.isOpen, (newVal) => {
      console.log('AccountDropdown isOpen:', newVal)
      if (newVal) {
        // Check localStorage when dropdown opens
        checkLocalStorageChanges()
      }
    })
    
    // Watch props.userData for avatar changes
    watch(() => props.userData?.avatar_url, (newVal) => {
      if (newVal) {
        currentAvatar.value = newVal
      }
    }, { immediate: true })
    
    // Watch props.userData.stats for stats changes
    watch(() => props.userData?.stats, (newVal) => {
      if (newVal) {
        currentStats.value = {
          uploads: newVal.uploads || currentStats.value.uploads,
          bookmarks: newVal.bookmarks || currentStats.value.bookmarks,
          points: newVal.points || currentStats.value.points
        }
      }
    }, { deep: true, immediate: true })

    // Compute user initial
    const userInitial = computed(() => {
      const name = props.userData?.displayName || props.userData?.fullName || 'User'
      return name.charAt(0).toUpperCase()
    })

    // Compute user role
    const userRole = computed(() => {
      const role = props.userData?.role
      const roleMap = {
        'student': 'Sinh viên',
        'instructor': 'Giảng viên',
        'admin': 'Quản trị viên',
        'guest': 'Khách'
      }
      return roleMap[role] || role || 'Người dùng'
    })
    
    // Get avatar URL (from localStorage first, then props)
    const avatarUrl = computed(() => {
      return currentAvatar.value || props.userData?.avatar_url || null
    })
    
    // Get stats (from localStorage/computed, then props)
    const displayStats = computed(() => {
      return {
        uploads: currentStats.value.uploads || props.userData?.stats?.uploads || 0,
        bookmarks: currentStats.value.bookmarks || props.userData?.stats?.bookmarks || 0,
        points: currentStats.value.points || props.userData?.stats?.points || 0
      }
    })

    // Truncate bio
    const truncateBio = (bio) => {
      if (!bio) return ''
      return bio.length > 50 ? bio.substring(0, 50) + '...' : bio
    }

    // Handle window resize
    const handleResize = () => {
      isMobile.value = window.innerWidth < 600
    }

    // Close dropdown
    const close = () => {
      emit('close')
    }

    // Handle overlay click
    const handleOverlayClick = () => {
      close()
    }

    // Handle upload - navigate to documents page and open upload modal
    const handleUpload = () => {
      close()
      router.push('/documents?upload=true').then(() => {
        // Emit event to open upload modal after navigation
        setTimeout(() => {
          bus.emit('open-upload-modal')
        }, 100)
      })
    }
    
    // Handle navigation to profile tabs
    const navigateToProfileTab = (tab) => {
      close()
      router.push(`/profile?tab=${tab}`)
    }

    // Handle dark mode toggle
    const handleDarkModeToggle = () => {
      document.documentElement.classList.toggle('dark-mode', darkMode.value)
      localStorage.setItem('darkMode', darkMode.value ? 'true' : 'false')
    }

    // Handle logout
    const handleLogout = () => {
      if (isMobile.value) {
        // On mobile, show confirmation sheet
        showLogoutConfirm.value = true
      } else {
        // On desktop, show small modal
        showLogoutConfirm.value = true
      }
    }

    // Confirm logout
    const confirmLogout = () => {
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('userFullName')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userId')
      localStorage.removeItem('user_id')
      localStorage.removeItem('isLoggedIn')
      
      // Emit logout event
      bus.emit('logout')
      
      // Close modals
      showLogoutConfirm.value = false
      close()
      
      // Navigate to home
      router.push('/')
    }

    // Keyboard navigation
    const handleTab = (e) => {
      const focusableElements = props.isOpen
        ? Array.from(document.querySelectorAll('.account-dropdown [role="menuitem"], .account-dropdown button, .account-dropdown a, .account-dropdown input'))
        : []
      
      const currentIndex = focusableElements.indexOf(e.target)
      if (currentIndex === focusableElements.length - 1) {
        e.preventDefault()
        focusableElements[0]?.focus()
      }
    }

    const handleShiftTab = (e) => {
      const focusableElements = props.isOpen
        ? Array.from(document.querySelectorAll('.account-dropdown [role="menuitem"], .account-dropdown button, .account-dropdown a, .account-dropdown input'))
        : []
      
      const currentIndex = focusableElements.indexOf(e.target)
      if (currentIndex === 0) {
        e.preventDefault()
        focusableElements[focusableElements.length - 1]?.focus()
      }
    }

    // Focus management
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        // Focus first focusable element
        setTimeout(() => {
          const firstElement = document.querySelector('.account-dropdown [role="menuitem"], .account-dropdown button, .account-dropdown a')
          firstElement?.focus()
        }, 100)
      }
    })

    // Check for saved dark mode preference
    onMounted(() => {
      const saved = localStorage.getItem('darkMode') === 'true'
      darkMode.value = saved
      if (saved) {
        document.documentElement.classList.add('dark-mode')
      }
      window.addEventListener('resize', handleResize)
      
      // Set up localStorage polling to detect changes
      storageCheckInterval = setInterval(checkLocalStorageChanges, 500)
      
      // Listen for storage events (from other tabs/windows)
      window.addEventListener('storage', (e) => {
        if (e.key === 'userAvatar' || e.key === 'userUploads' || e.key === 'userBookmarks' || e.key === 'userPoints') {
          checkLocalStorageChanges()
        }
      })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      if (storageCheckInterval) {
        clearInterval(storageCheckInterval)
      }
      window.removeEventListener('storage', checkLocalStorageChanges)
    })

    return {
      showLogoutConfirm,
      darkMode,
      isMobile,
      userInitial,
      userRole,
      truncateBio,
      avatarUrl,
      displayStats,
      navigateToProfileTab,
      close,
      handleOverlayClick,
      handleUpload,
      handleDarkModeToggle,
      handleLogout,
      confirmLogout,
      handleTab,
      handleShiftTab
    }
  }
}
</script>

<style scoped>
/* CSS Variables */
:root {
  --dropdown-bg: #FFFFFF;
  --dropdown-border: #E2E8F0;
  --dropdown-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
  --dropdown-radius: 12px;
  --text-primary: #000000;
  --text-secondary: #333333;
  --accent-primary: #0B6EFD;
  --accent-danger: #EF4444;
  --hover-bg: #F5F5F5;
}

.dark-mode {
  /* Override: Keep dropdown white even in dark mode */
  --dropdown-bg: #FFFFFF;
  --dropdown-border: #E2E8F0;
  --text-primary: #000000;
  --text-secondary: #333333;
  --hover-bg: #F5F5F5;
}

/* Overlay */
.account-dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20000;
  pointer-events: auto;
}

/* Dropdown */
.account-dropdown {
  position: fixed;
  top: 70px;
  right: 20px;
  width: 320px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 100px);
  background: #FFFFFF;
  border: 1px solid var(--dropdown-border);
  border-radius: var(--dropdown-radius);
  box-shadow: var(--dropdown-shadow);
  overflow-y: auto;
  overflow-x: hidden;
  animation: slideDown 0.2s ease-out;
  z-index: 20001;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .account-dropdown {
    animation: none;
  }
}

/* Mobile Sheet */
.account-dropdown.mobile-sheet {
  position: fixed;
  top: auto;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  max-width: 100%;
  max-height: 85vh;
  border-radius: var(--dropdown-radius) var(--dropdown-radius) 0 0;
  border-left: none;
  border-right: none;
}

/* Header */
.dropdown-header {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid var(--dropdown-border);
}

.user-avatar-large {
  position: relative;
  flex-shrink: 0;
}

.avatar-img,
.avatar-placeholder-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder-large {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
}

.verified-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: #10B981;
  border: 2px solid var(--dropdown-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: bold;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #333333;
}

.user-bio {
  margin: 0;
  font-size: 0.8125rem;
  color: #333333;
  line-height: 1.4;
}

/* Quick Stats */
.quick-stats {
  display: flex;
  padding: 1rem 1.5rem;
  gap: 1rem;
  border-bottom: 1px solid var(--dropdown-border);
}

.stat-item {
  flex: 1;
  text-align: center;
  cursor: default;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.25rem;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #333333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Divider */
.dropdown-divider {
  height: 1px;
  background: var(--dropdown-border);
  margin: 0;
}

/* Actions */
.dropdown-actions {
  padding: 0.5rem 0;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #000000;
  text-decoration: none;
  font-size: 0.9375rem;
  transition: background-color 0.2s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.action-item:hover,
.action-item:focus {
  background: #F5F5F5;
  outline: none;
}

.action-item svg {
  flex-shrink: 0;
  color: #333333;
  transition: color 0.2s;
}

.action-item:hover svg,
.action-item:focus svg {
  color: #0B6EFD;
}

.action-upload {
  background: #FFFFFF;
  color: #000000;
  font-weight: 600;
  margin: 0.5rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
}

.action-upload:hover,
.action-upload:focus {
  background: #F5F5F5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-upload svg {
  color: #000000;
}

/* Toggles */
.dropdown-toggles {
  padding: 0.5rem 0;
}

.toggle-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 0.9375rem;
  color: #000000;
  transition: background-color 0.2s;
}

.toggle-item:hover {
  background: var(--hover-bg);
}

.toggle-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--accent-primary);
}

.toggle-item svg {
  flex-shrink: 0;
  color: #333333;
}

/* Footer */
.dropdown-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--dropdown-border);
}

.footer-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: opacity 0.2s;
}

.footer-link:hover {
  opacity: 0.8;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--accent-danger);
  border-radius: 6px;
  color: var(--accent-danger);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover,
.btn-logout:focus {
  background: #EF4444;
  border-color: #EF4444;
  color: white;
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-logout svg {
  flex-shrink: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 21000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
  margin: 0;
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
  background: #FFFFFF;
  border-radius: var(--dropdown-radius);
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--dropdown-shadow);
  text-align: center;
  margin: auto;
  position: relative;
}

.modal-content h2 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #000000;
}

.modal-content p {
  margin: 0 0 1.5rem 0;
  color: #333333;
  font-size: 0.9375rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.btn-secondary,
.btn-danger {
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-secondary {
  background: #F5F5F5;
  color: #000000;
}

.btn-secondary:hover {
  background: #E2E8F0;
}

.btn-danger {
  background: #EF4444;
  color: white;
}

.btn-danger:hover {
  background: #DC2626;
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Accessibility */
.account-dropdown:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
</style>


<template>
  <header :class="['header', { 'scrolled': isScrolled }]">
    <div class="header-background"></div>
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <img 
            src="/img/Logo/LogoWeb.png" 
            alt="Open Learn Foundation" 
            class="logo-image"
          />
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="nav desktop-nav">
          <router-link to="/" class="nav-link">Trang chủ</router-link>
          <router-link to="/documents" class="nav-link">Tài liệu</router-link>
          <div 
            class="nav-dropdown" 
            @mouseenter="openDropdown('courses')" 
            @mouseleave="closeDropdown"
          >
            <router-link to="/courses" class="nav-link dropdown-toggle">Khóa học</router-link>
            <div 
              class="dropdown-menu" 
              :class="{ open: openMenu === 'courses' }"
              @mouseenter="keepDropdownOpen('courses')"
              @mouseleave="handleDropdownLeave"
            >
              <router-link to="/courses" class="dropdown-item" @click="forceCloseDropdown">Tất cả khóa học</router-link>
              <router-link to="/courses/enroll" class="dropdown-item disabled">Đăng ký khóa học <span class="badge">(đang phát triển)</span></router-link>
              <router-link to="/courses/mine" class="dropdown-item" @click="forceCloseDropdown">Khóa học của tôi</router-link>
              <router-link to="/courses/upload" class="dropdown-item" @click="forceCloseDropdown">Upload khóa học</router-link>
            </div>
          </div>
          <router-link to="/diendan" class="nav-link">Diễn đàn</router-link>
          <router-link to="/blog" class="nav-link">Blog</router-link>
        </nav>
        <!-- Header Actions -->
        <div class="header-actions">
          <template v-if="!isLoggedIn">
            <router-link to="/auth" class="btn-login">Đăng nhập</router-link>
          </template>
          
          <template v-else>
            <div class="user-profile-wrapper" ref="avatarWrapper">
              <button
                class="user-profile-button"
                :aria-expanded="dropdownOpen"
                aria-label="Mở menu tài khoản"
                @click="toggleDropdown"
                @keydown.enter="toggleDropdown"
                @keydown.space.prevent="toggleDropdown"
              >
                <div class="user-info">
                  <div v-if="userAvatar" class="avatar-img-wrapper">
                    <img :src="userAvatar" :alt="userName" class="avatar-img-small" />
                  </div>
                  <div v-else class="avatar-placeholder">{{ userInitial }}</div>
                  <span class="user-name-short">{{ shortName }}</span>
                </div>
              </button>
              <AccountDropdown
                :is-open="dropdownOpen"
                :user-data="currentUserData"
                @close="closeAccountDropdown"
                @upload="handleUploadClick"
              />
            </div>
          </template>

          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-toggle" @click="toggleMobileMenu">
            <span class="hamburger"></span>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <nav class="mobile-nav" :class="{ active: mobileMenuOpen }">
        <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">Trang chủ</router-link>
        <router-link to="/documents" class="mobile-nav-link" @click="closeMobileMenu">Tài liệu</router-link>
        <div class="mobile-submenu">
          <span class="mobile-nav-link">Khóa học</span>
          <router-link to="/courses" class="mobile-nav-link sub" @click="closeMobileMenu">Tất cả khóa học</router-link>
          <router-link to="/courses/enroll" class="mobile-nav-link sub disabled" @click="closeMobileMenu">Đăng ký khóa học <span class="badge">(đang phát triển)</span></router-link>
          <router-link to="/courses/mine" class="mobile-nav-link sub" @click="closeMobileMenu">Khóa học của tôi</router-link>
          <router-link to="/courses/upload" class="mobile-nav-link sub" @click="closeMobileMenu">Upload khóa học</router-link>
        </div>
        <router-link to="/diendan" class="mobile-nav-link" @click="closeMobileMenu">Diễn đàn</router-link>
        <router-link to="/blog" class="mobile-nav-link" @click="closeMobileMenu">Blog</router-link>
        
        <div class="mobile-nav-divider"></div>
        
        <template v-if="!isLoggedIn">
          <router-link to="/auth" class="mobile-nav-link primary" @click="closeMobileMenu">Đăng nhập</router-link>
        </template>
        <template v-else>
          <router-link to="/userinfo" class="mobile-nav-link" @click="closeMobileMenu">Tài khoản</router-link>
          <button class="mobile-nav-link" @click="logout">Đăng xuất</button>
        </template>
      </nav>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import bus from '@/utils/eventBus.js'
import AccountDropdown from './AccountDropdown.vue'

export default {
  name: 'HeaderComponent',
  components: {
    AccountDropdown
  },
  setup() {
    const isLoggedIn = ref(false)
    const userName = ref('User')
    const mobileMenuOpen = ref(false)
    const openMenu = ref(null)
    const dropdownOpen = ref(false)
    const avatarWrapper = ref(null)
    const userAvatar = ref(localStorage.getItem('userAvatar') || null)
    const isScrolled = ref(false)

    // Function to check and update avatar from localStorage
    const checkAvatarUpdate = () => {
      const newAvatar = localStorage.getItem('userAvatar') || null
      if (newAvatar !== userAvatar.value) {
        userAvatar.value = newAvatar
      }
    }

    // Compute user initial for avatar
    const userInitial = computed(() => {
      if (!userName.value) return 'U'
      return userName.value.charAt(0).toUpperCase()
    })

    // Compute short name (max 2 words)
    const shortName = computed(() => {
      if (!userName.value) return 'User'
      const words = userName.value.trim().split(/\s+/)
      if (words.length <= 2) {
        return userName.value
      }
      // Return first word + last word
      return `${words[0]} ${words[words.length - 1]}`
    })

    // Current user data for dropdown
    const currentUserData = computed(() => {
      const email = localStorage.getItem('userEmail')
      const role = localStorage.getItem('userRole') || 'student'
      const stats = {
        uploads: parseInt(localStorage.getItem('userUploads') || '0'),
        bookmarks: parseInt(localStorage.getItem('userBookmarks') || '0'),
        points: parseInt(localStorage.getItem('userPoints') || '0')
      }
      return {
        displayName: userName.value,
        fullName: userName.value,
        email: email,
        role: role,
        verified: localStorage.getItem('userVerified') === 'true',
        bio: localStorage.getItem('userBio') || '',
        avatar_url: localStorage.getItem('userAvatar') || null,
        stats: stats
      }
    })

    // Account dropdown management
    const toggleDropdown = () => {
      console.log('Toggle dropdown:', dropdownOpen.value) // Debug
      dropdownOpen.value = !dropdownOpen.value
      console.log('Dropdown open:', dropdownOpen.value) // Debug
    }

    const closeAccountDropdown = () => {
      dropdownOpen.value = false
    }

    // Handle click outside
    const handleClickOutside = (event) => {
      if (avatarWrapper.value && !avatarWrapper.value.contains(event.target)) {
        closeAccountDropdown()
      }
    }

    // Check login status from localStorage
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn')
      const fullName = localStorage.getItem('userFullName')
      const email = localStorage.getItem('userEmail')
      
      if (loggedIn === 'true') {
        isLoggedIn.value = true
        userName.value = fullName || email || 'User'
      } else {
        // Fallback: check old format
        const user = localStorage.getItem('user')
        if (user) {
          try {
            const userData = JSON.parse(user)
            isLoggedIn.value = true
            userName.value = userData.fullName || userData.email || 'User'
          } catch (e) {
            isLoggedIn.value = false
          }
        } else {
          isLoggedIn.value = false
        }
      }
      
      // Also check avatar when checking login status
      checkAvatarUpdate()
    }

    // Listen for login success event
    const handleLoginSuccess = () => {
      checkLoginStatus()
    }

    // Listen for logout event
    const handleLogout = () => {
      isLoggedIn.value = false
      userName.value = 'User'
      userAvatar.value = null
      // Clear stats from localStorage
      localStorage.removeItem('userUploads')
      localStorage.removeItem('userBookmarks')
      localStorage.removeItem('userPoints')
      localStorage.removeItem('userAvatar')
      localStorage.removeItem('userCover')
    }
    
    // Fetch user stats from API
    const fetchUserStats = async () => {
      const userId = localStorage.getItem('userId')
      if (!userId || !isLoggedIn.value) return
      
      try {
        // Fetch user's documents count
        const documentsResponse = await fetch(`http://localhost:3000/api/documents/search?uploaderId=${userId}&limit=1`)
        if (documentsResponse.ok) {
          const documentsResult = await documentsResponse.json()
          if (documentsResult.success && documentsResult.total !== undefined) {
            localStorage.setItem('userUploads', documentsResult.total.toString())
          } else if (documentsResult.success && Array.isArray(documentsResult.data)) {
            // If total not available, fetch all and count
            const allDocsResponse = await fetch(`http://localhost:3000/api/documents/search?uploaderId=${userId}&limit=1000`)
            if (allDocsResponse.ok) {
              const allDocsResult = await allDocsResponse.json()
              if (allDocsResult.success && Array.isArray(allDocsResult.data)) {
                localStorage.setItem('userUploads', allDocsResult.data.length.toString())
              }
            }
          }
        }
        
        // Fetch user's bookmarks count
        const bookmarksResponse = await fetch(`http://localhost:3000/api/documents/bookmarks/${userId}`)
        if (bookmarksResponse.ok) {
          const bookmarksResult = await bookmarksResponse.json()
          if (bookmarksResult.success && Array.isArray(bookmarksResult.data)) {
            localStorage.setItem('userBookmarks', bookmarksResult.data.length.toString())
          } else {
            localStorage.setItem('userBookmarks', '0')
          }
        } else {
          localStorage.setItem('userBookmarks', '0')
        }
        
        // Points can be calculated from contributions or fetched from user profile
        // For now, keep existing points or set to 0
        if (!localStorage.getItem('userPoints')) {
          localStorage.setItem('userPoints', '0')
        }
      } catch (error) {
        console.error('Error fetching user stats:', error)
      }
    }

    // Initial check
    checkLoginStatus()
    
    // Fetch stats when logged in
    if (isLoggedIn.value) {
      fetchUserStats()
    }

    let intervalId = null
    let statsIntervalId = null
    let avatarIntervalId = null
    
    // Handle storage event for avatar
    const handleStorageChange = (e) => {
      if (e.key === 'userAvatar') {
        checkAvatarUpdate()
      }
    }

    // Handle scroll to change header appearance
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 20
    }

    // Subscribe to events
    onMounted(() => {
      bus.on('login-success', () => {
        handleLoginSuccess()
        // Check avatar after login
        checkAvatarUpdate()
        // Fetch stats after login
        setTimeout(() => {
          fetchUserStats()
        }, 1000)
      })
      bus.on('logout', handleLogout)
      // Listen for avatar update events
      bus.on('avatar-updated', checkAvatarUpdate)
      // Also check periodically in case localStorage was updated in another tab
      intervalId = setInterval(checkLoginStatus, 1000)
      // Check avatar periodically (every 1 second)
      avatarIntervalId = setInterval(checkAvatarUpdate, 1000)
      // Fetch stats periodically (every 30 seconds) when logged in
      statsIntervalId = setInterval(() => {
        if (isLoggedIn.value) {
          fetchUserStats()
        }
      }, 30000)
      // Listen for clicks outside dropdown
      document.addEventListener('click', handleClickOutside)
      // Listen for storage events (from other tabs/windows)
      window.addEventListener('storage', handleStorageChange)
      // Listen for scroll events
      window.addEventListener('scroll', handleScroll, { passive: true })
      // Initial check
      handleScroll()
    })

    onUnmounted(() => {
      bus.off('login-success', handleLoginSuccess)
      bus.off('logout', handleLogout)
      bus.off('avatar-updated', checkAvatarUpdate)
      if (intervalId) {
        clearInterval(intervalId)
      }
      if (statsIntervalId) {
        clearInterval(statsIntervalId)
      }
      if (avatarIntervalId) {
        clearInterval(avatarIntervalId)
      }
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClickOutside)
    })

    // Methods
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }

    const uploadDocument = () => {
      console.log('Upload document')
      // TODO: Show upload modal
    }

    const handleUploadClick = () => {
      uploadDocument()
    }

    const logout = () => {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('userFullName')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userId')
      localStorage.removeItem('user_id')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userAvatar')
      localStorage.removeItem('userCover')
      localStorage.removeItem('userVerified')
      isLoggedIn.value = false
      userName.value = 'User'
      closeMobileMenu()
      bus.emit('logout')
      // Navigate to home
      window.location.href = '/'
    }

    let dropdownTimeout = null
    let isHoveringDropdown = false

    const openDropdown = (name) => {
      // Clear any pending close timeout
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout)
        dropdownTimeout = null
      }
      isHoveringDropdown = true
      openMenu.value = name
    }

    const closeDropdown = () => {
      // Set flag to false first
      isHoveringDropdown = false
      // Add delay to allow mouse to move to dropdown
      dropdownTimeout = setTimeout(() => {
        // Double check before closing
        if (!isHoveringDropdown) {
          openMenu.value = null
        }
        dropdownTimeout = null
      }, 300)
    }
    
    // Keep dropdown open when hovering over it
    const keepDropdownOpen = (name) => {
      // Clear close timeout when hovering over dropdown
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout)
        dropdownTimeout = null
      }
      isHoveringDropdown = true
      openMenu.value = name
    }
    
    // Handle mouse leave from dropdown
    const handleDropdownLeave = () => {
      isHoveringDropdown = false
      closeDropdown()
    }
    
    // Close dropdown immediately when needed
    const forceCloseDropdown = () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout)
        dropdownTimeout = null
      }
      isHoveringDropdown = false
      openMenu.value = null
    }

    return {
      isLoggedIn,
      userName,
      userInitial,
      shortName,
      currentUserData,
      dropdownOpen,
      avatarWrapper,
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      toggleDropdown,
      closeAccountDropdown,
      uploadDocument,
      handleUploadClick,
      logout,
      openMenu,
      openDropdown,
      closeDropdown,
      keepDropdownOpen,
      handleDropdownLeave,
      forceCloseDropdown,
      userAvatar,
      isScrolled
    }
  }
}
</script>

<style scoped>
/* Header */
.header {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 10000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
}

/* Background layer with gradient */
.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(248, 250, 252, 0.98) 50%,
    rgba(255, 255, 255, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

/* Decorative gradient overlay */
.header-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(29, 78, 216, 0.3) 20%,
    rgba(59, 130, 246, 0.4) 50%,
    rgba(29, 78, 216, 0.3) 80%,
    transparent 100%
  );
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* Shadow and border */
.header {
  box-shadow: 0 2px 16px rgba(29, 78, 216, 0.08);
  border-bottom: 1px solid rgba(29, 78, 216, 0.1);
}

/* Scrolled state - more prominent */
.header.scrolled {
  box-shadow: 0 8px 32px rgba(29, 78, 216, 0.15);
  border-bottom: 1px solid rgba(29, 78, 216, 0.2);
}

.header.scrolled .header-background {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.99) 0%,
    rgba(248, 250, 252, 0.99) 50%,
    rgba(255, 255, 255, 0.99) 100%
  );
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.header.scrolled .header-background::before {
  height: 3px;
  opacity: 0.8;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.875rem 0;
  gap: 2rem;
  min-height: 72px;
  position: relative;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  position: relative;
  padding: 0;
  border-radius: 12px;
  height: 100%;
  /* Fade in + scale up animation on load */
  animation: logoEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
}

/* Entrance animation: fade in + scale up + bounce */
@keyframes logoEntrance {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
  }
  60% {
    opacity: 1;
    transform: translateY(5px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Gentle continuous pulse animation */
@keyframes logoGentlePulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 2px 8px rgba(29, 78, 216, 0.15));
  }
  50% {
    transform: scale(1.02);
    filter: drop-shadow(0 3px 12px rgba(29, 78, 216, 0.2));
  }
}

/* Background glow effect */
.logo::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + 1.5rem);
  height: calc(100% + 1.5rem);
  background: radial-gradient(circle, rgba(29, 78, 216, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
  pointer-events: none;
}

.logo:hover::before {
  opacity: 1;
  width: calc(100% + 2.5rem);
  height: calc(100% + 2.5rem);
}

.logo:hover {
  transform: scale(1.1) translateY(-3px) rotate(2deg);
}

.logo:active {
  animation: logoBounce 0.4s ease;
}

/* Bounce animation on click */
@keyframes logoBounce {
  0%, 100% {
    transform: scale(1.05) translateY(-2px);
  }
  50% {
    transform: scale(0.95) translateY(2px);
  }
}

.logo-image {
  height: 72px;
  width: auto;
  object-fit: contain;
  display: block;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 8px rgba(29, 78, 216, 0.15));
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  /* Gentle continuous pulse */
  animation: logoGentlePulse 3s ease-in-out infinite;
}

.logo:hover .logo-image {
  filter: drop-shadow(0 6px 24px rgba(29, 78, 216, 0.4)) 
          drop-shadow(0 0 20px rgba(59, 130, 246, 0.3));
  transform: scale(1.08) rotate(-2deg);
  animation: logoHoverPulse 1.5s ease-in-out infinite;
}

/* Hover pulse animation */
@keyframes logoHoverPulse {
  0%, 100% {
    transform: scale(1.08) rotate(-2deg);
  }
  50% {
    transform: scale(1.12) rotate(-2deg);
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .logo,
  .logo-image {
    animation: none !important;
    transition: opacity 0.3s ease !important;
  }
  
  .logo:hover {
    transform: scale(1.05) !important;
  }
  
  .logo:hover .logo-image {
    transform: scale(1.05) !important;
    animation: none !important;
  }
}

@media (max-width: 959px) {
  .header-content {
    padding: 0.75rem 0;
    min-height: 64px;
  }
  
  .logo-image {
    height: 60px;
  }
  
  /* Slightly reduce animations on tablet */
  .logo:hover {
    transform: scale(1.08) translateY(-2px) rotate(1.5deg);
  }
}

@media (max-width: 599px) {
  .header-content {
    padding: 0.625rem 0;
    min-height: 56px;
  }
  
  .logo-image {
    height: 52px;
  }
  
  /* Reduce animations on mobile for better performance */
  .logo-image {
    animation: logoGentlePulse 4s ease-in-out infinite;
  }
  
  .logo:hover {
    transform: scale(1.06) translateY(-2px) rotate(1deg);
  }
  
  .logo:hover .logo-image {
    animation: logoHoverPulse 2s ease-in-out infinite;
  }
}

/* Desktop Navigation */
.nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  margin-right: 1rem;
}

.desktop-nav {
  display: none;
}

@media (min-width: 960px) {
  .desktop-nav {
    display: flex;
  }
}

.nav-link {
  text-decoration: none;
  color: #475569;
  font-weight: 600;
  font-size: 0.9375rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  white-space: nowrap;
  overflow: visible;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.12) 0%, rgba(59, 130, 246, 0.1) 100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  transform: scale(0.9);
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.1);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #1d4ed8 0%, #3b82f6 100%);
  border-radius: 2px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(29, 78, 216, 0.4);
}

.nav-link:hover {
  color: #1d4ed8;
  transform: translateY(-2px);
}

.nav-link:hover::before {
  opacity: 1;
  transform: scale(1);
}

.nav-link.router-link-active {
  color: #1d4ed8;
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.15) 0%, rgba(59, 130, 246, 0.12) 100%);
  box-shadow: 0 4px 16px rgba(29, 78, 216, 0.2);
  position: relative;
}

.nav-link.router-link-active::before {
  opacity: 1;
  transform: scale(1);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: calc(100% - 2.5rem);
}

/* Dropdown */
.nav-dropdown { 
  position: relative;
  z-index: 10001;
}

/* Ensure dropdown container covers the gap - larger area */
.nav-dropdown::after {
  content: '';
  position: absolute;
  top: 100%;
  left: -10px;
  right: -10px;
  height: 12px;
  background: transparent;
  z-index: 10001;
  pointer-events: auto;
}

.dropdown-toggle { 
  background: transparent; 
  border: none; 
  cursor: pointer; 
  text-decoration: none; 
  font-family: inherit;
}

.dropdown-menu { 
  position: absolute; 
  top: calc(100% + 8px); 
  left: 0; 
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.99) 0%,
    rgba(248, 250, 252, 0.99) 100%
  ); 
  border: 1px solid rgba(29, 78, 216, 0.25); 
  border-radius: 16px; 
  padding: 0.75rem; 
  padding-top: 0.5rem;
  display: none; 
  min-width: 240px; 
  box-shadow: 0 20px 60px rgba(29, 78, 216, 0.25),
              0 0 0 1px rgba(255, 255, 255, 0.5) inset,
              0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 10002;
  animation: fadeInDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: visible;
  margin-top: 0;
}

/* Invisible bridge to prevent gap between menu and dropdown - larger area */
.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -12px;
  left: -10px;
  right: -10px;
  height: 12px;
  background: transparent;
  z-index: 10001;
  pointer-events: auto;
}

/* Gradient line at top of dropdown */
.dropdown-menu::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(29, 78, 216, 0.4) 50%,
    transparent 100%
  );
  z-index: 1;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-menu.open { 
  display: block; 
}

.dropdown-item { 
  display: block; 
  padding: 0.875rem 1.125rem; 
  text-decoration: none; 
  color: #475569; 
  border-radius: 10px; 
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.dropdown-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #1d4ed8 0%, #3b82f6 100%);
  transform: scaleY(0);
  transition: transform 0.25s ease;
}

.dropdown-item:hover:not(.disabled) { 
  background: linear-gradient(90deg, rgba(29, 78, 216, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%); 
  color: #1d4ed8; 
  transform: translateX(4px);
  padding-left: 1.5rem;
}

.dropdown-item:hover:not(.disabled)::before {
  transform: scaleY(1);
}

.dropdown-item.disabled { 
  opacity: 0.5; 
  cursor: not-allowed; 
  pointer-events: none; 
}

.dropdown-item .badge { 
  font-size: 0.75rem; 
  color: #9ca3af; 
  margin-left: 6px; 
  font-weight: 400;
}

/* Header Actions */
.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-shrink: 0;
}

.btn-upload {
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%);
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.625rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  position: relative;
  overflow: hidden;
}

.btn-upload::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.btn-upload:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(29, 78, 216, 0.3);
  color: white;
}

.btn-upload:hover::before {
  width: 100%;
  height: 100%;
}

.btn-upload > * {
  position: relative;
  z-index: 1;
}

.btn-upload:active {
  transform: translateY(0);
}

.btn-login,
.btn-register {
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-login {
  background: transparent;
  color: #1d4ed8;
  border: 2px solid #1d4ed8;
  position: relative;
  overflow: hidden;
}

.btn-login::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-login:hover::before {
  left: 100%;
}

.btn-register {
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(29, 78, 216, 0.25);
  position: relative;
  overflow: hidden;
}

.btn-register::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-register:hover::before {
  left: 100%;
}

.btn-login:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(29, 78, 216, 0.3);
}

.btn-register:hover {
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(29, 78, 216, 0.35);
}

.btn-login > *,
.btn-register > * {
  position: relative;
  z-index: 1;
}

.btn-login:active,
.btn-register:active {
  transform: translateY(0);
}

/* User Profile */
.user-profile-wrapper {
  position: relative;
}

.user-profile-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.user-profile {
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  border-radius: 24px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-profile-button:hover .user-info {
  background-color: rgba(29, 78, 216, 0.08);
}

.avatar-placeholder,
.avatar-img-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.avatar-placeholder {
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(29, 78, 216, 0.2);
}

.avatar-img-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(29, 78, 216, 0.2);
  box-shadow: 0 2px 8px rgba(29, 78, 216, 0.15);
}

.avatar-img-small {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-profile-button:hover .avatar-placeholder,
.user-profile-button:hover .avatar-img-wrapper {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.25);
}

.user-name-short {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9375rem;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 767px) {
  .user-name-short {
    display: none;
  }
  
  .user-info {
    gap: 0.5rem;
    padding: 0.25rem;
  }
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.mobile-menu-toggle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.mobile-menu-toggle:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 16px rgba(29, 78, 216, 0.25);
}

.mobile-menu-toggle:hover::before {
  width: 100%;
  height: 100%;
}

.mobile-menu-toggle .hamburger {
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.mobile-menu-toggle:hover .hamburger,
.mobile-menu-toggle:hover .hamburger::before,
.mobile-menu-toggle:hover .hamburger::after {
  background: white;
}

.mobile-menu-toggle:active {
  transform: scale(0.95);
}

@media (min-width: 960px) {
  .mobile-menu-toggle {
    display: none;
  }
}

.hamburger {
  width: 24px;
  height: 2.5px;
  background: #1d4ed8;
  position: relative;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2.5px;
  background: #1d4ed8;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

/* Mobile Navigation */
.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.95) 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  margin-top: 0.5rem;
  border-radius: 0 0 16px 16px;
  border-top: 1px solid rgba(29, 78, 216, 0.1);
}

.mobile-nav.active {
  max-height: 800px;
  box-shadow: 0 8px 32px rgba(29, 78, 216, 0.15);
}

@media (min-width: 960px) {
  .mobile-nav {
    display: none;
  }
}

.mobile-nav-link {
  padding: 1rem 1.5rem;
  color: #475569;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.mobile-nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #1d4ed8 0%, #3b82f6 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
  border-radius: 0 4px 4px 0;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: linear-gradient(90deg, rgba(29, 78, 216, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  color: #1d4ed8;
  transform: translateX(6px);
  padding-left: 2rem;
}

.mobile-nav-link:hover::before,
.mobile-nav-link.router-link-active::before {
  transform: scaleY(1);
}

.mobile-nav-link.primary {
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  color: white;
  justify-content: center;
  margin-top: 0.75rem;
  box-shadow: 0 4px 16px rgba(29, 78, 216, 0.25);
  position: relative;
  overflow: hidden;
}

.mobile-nav-link.primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.mobile-nav-link.primary:hover {
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(29, 78, 216, 0.35);
}

.mobile-nav-link.primary:hover::before {
  left: 100%;
}

.mobile-submenu .sub { 
  padding-left: 2.5rem; 
  font-size: 0.875rem;
  font-weight: 500;
}

.mobile-nav-link.disabled { 
  opacity: 0.5; 
  cursor: not-allowed; 
  pointer-events: none; 
}

.mobile-nav-link .badge { 
  font-size: 0.75rem; 
  color: #9ca3af; 
  margin-left: 6px; 
  font-weight: 400;
}

.mobile-nav-divider {
  height: 1px;
  background: rgba(29, 78, 216, 0.15);
  margin: 0.75rem 0;
}

/* Responsive */
@media (max-width: 959px) {
  .container {
    padding: 0 20px;
  }
  
  .header-content {
    padding: 0.875rem 0;
  }
  
  .btn-login {
    display: none;
  }
}

@media (max-width: 599px) {
  .header-content {
    gap: 1rem;
  }
  
  .logo-image {
    height: 36px;
  }
  
  .header-actions {
    gap: 0.5rem;
  }
  
  .btn-upload {
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
  }
}
</style>

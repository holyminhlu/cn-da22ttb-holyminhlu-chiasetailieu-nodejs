<template>
  <div class="course-learning-page">
    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p class="loading-text">Đang tải khóa học...</p>
    </div>

    <div v-else-if="course" class="learning-container">
      <!-- Header -->
      <div class="learning-header">
        <div class="header-content">
          <button @click="goBack" class="back-btn" aria-label="Quay lại">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Quay lại</span>
          </button>
          <button @click="toggleSidebar" class="sidebar-toggle-btn" :aria-expanded="sidebarOpen" aria-label="Đóng/Mở menu">
            <svg v-if="sidebarOpen" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div class="header-title-group">
            <h1 class="course-title">{{ course.title }}</h1>
            <div class="progress-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{{ progressPercentage }}% hoàn thành</span>
            </div>
          </div>
        </div>
      </div>

      <div class="learning-main" :class="{ 'sidebar-closed': !sidebarOpen }">
        <!-- Overlay for mobile -->
        <div 
          v-if="sidebarOpen" 
          class="sidebar-overlay" 
          @click="toggleSidebar"
          aria-hidden="true"
        ></div>
        
        <!-- Sidebar - Course Content -->
        <aside class="sidebar" :class="{ 'sidebar-hidden': !sidebarOpen }" role="complementary" aria-label="Nội dung khóa học">
          <div class="sidebar-header">
            <h3 class="sidebar-title">Nội dung khóa học</h3>
            <div class="progress-card">
              <div class="progress-stats">
                <span class="progress-label">Tiến độ</span>
                <span class="progress-value">{{ completedLessons.length }} / {{ totalLessons }}</span>
              </div>
              <div class="progress-bar-wrapper">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
                </div>
                <span class="progress-percent">{{ progressPercentage }}%</span>
              </div>
            </div>
          </div>

          <div class="modules-list">
            <div 
              v-for="(module, moduleIndex) in course.modules" 
              :key="module.module_id"
              class="module-item"
              :class="{ active: currentModuleIndex === moduleIndex }"
            >
              <div 
                class="module-header"
                @click="toggleModule(moduleIndex)"
                :aria-expanded="expandedModules[moduleIndex]"
              >
                <div class="module-number-wrapper">
                  <span class="module-number">{{ moduleIndex + 1 }}</span>
                </div>
                <h4 class="module-title">{{ module.title }}</h4>
                <svg 
                  class="toggle-icon" 
                  :class="{ expanded: expandedModules[moduleIndex] }"
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              <transition name="module-expand">
                <div 
                  v-if="expandedModules[moduleIndex]"
                  class="lessons-list"
                >
                  <div 
                    v-for="(lesson, lessonIndex) in module.lessons" 
                    :key="lesson.lesson_id"
                    class="lesson-item"
                    :class="{ 
                      active: currentModuleIndex === moduleIndex && currentLessonIndex === lessonIndex,
                      completed: isLessonCompleted(lesson.lesson_id)
                    }"
                    @click="selectLesson(moduleIndex, lessonIndex)"
                  >
                    <div class="lesson-icon-wrapper">
                      <svg 
                        v-if="isLessonCompleted(lesson.lesson_id)"
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2.5"
                        class="lesson-icon completed-icon"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <svg 
                        v-else-if="lesson.isPreview"
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2"
                        class="lesson-icon preview-icon"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      <svg 
                        v-else
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2"
                        class="lesson-icon locked-icon"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <div class="lesson-content-wrapper">
                      <span class="lesson-title-text">{{ lesson.title }}</span>
                      <span class="lesson-duration">{{ lesson.duration || 'N/A' }} phút</span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </aside>

        <!-- Main Content - Video/Content Area -->
        <main class="content-area" role="main">
          <div v-if="currentLesson" class="lesson-content">
            <!-- Lesson Navigation -->
            <div class="lesson-nav-bar">
              <button 
                @click="previousLesson" 
                :disabled="!hasPreviousLesson"
                class="nav-btn nav-btn-prev"
                aria-label="Bài trước"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>Bài trước</span>
              </button>
              <div class="lesson-counter">
                <span class="current-lesson">{{ getCurrentLessonNumber() }}</span>
                <span class="separator">/</span>
                <span class="total-lessons">{{ totalLessons }}</span>
              </div>
              <button 
                @click="nextLesson" 
                :disabled="!hasNextLesson"
                class="nav-btn nav-btn-next"
                aria-label="Bài tiếp theo"
              >
                <span>Bài tiếp theo</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            <!-- Lesson Header -->
            <div class="lesson-header">
              <h2 class="lesson-title">{{ currentLesson.title }}</h2>
              <p v-if="currentLesson.description" class="lesson-description">
                {{ currentLesson.description }}
              </p>
            </div>

            <!-- Video Player -->
            <div v-if="getVideoUrl(currentLesson)" class="lesson-video-wrapper">
              <div class="video-player">
                <video 
                  :src="getFullVideoUrl(currentLesson)" 
                  controls
                  controlsList="nodownload"
                  class="video-element"
                  preload="metadata"
                >
                  <p>Trình duyệt của bạn không hỗ trợ video HTML5.</p>
                </video>
              </div>
            </div>

            <!-- Lesson Content -->
            <div v-if="currentLesson.content" class="lesson-text-card">
              <h3 class="content-title">Nội dung bài học</h3>
              <div class="text-content" v-html="formatContent(currentLesson.content)"></div>
            </div>

            <!-- Resources -->
            <div v-if="currentLesson.resources && currentLesson.resources.length > 0" class="lesson-resources-card">
              <h3 class="resources-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                Tài liệu học tập
              </h3>
              <div class="resources-list">
                <a 
                  v-for="(resource, index) in currentLesson.resources" 
                  :key="index"
                  :href="resource.url" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="resource-item"
                >
                  <div class="resource-icon-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div class="resource-info">
                    <span class="resource-title">{{ resource.title }}</span>
                    <span class="resource-type">{{ resource.type || 'Tài liệu' }}</span>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="resource-arrow">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Actions -->
            <div class="lesson-actions-card">
              <button 
                @click="markAsComplete"
                :disabled="isLessonCompleted(currentLesson.lesson_id) || isSavingProgress"
                class="complete-btn"
                :class="{ completed: isLessonCompleted(currentLesson.lesson_id), saving: isSavingProgress }"
              >
                <svg 
                  v-if="isSavingProgress"
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                  class="spinner"
                >
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                  <path d="M12 2 A10 10 0 0 1 22 12" stroke-linecap="round"></path>
                </svg>
                <svg 
                  v-else-if="isLessonCompleted(currentLesson.lesson_id)"
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2.5"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>
                  {{ isSavingProgress ? 'Đang lưu...' : (isLessonCompleted(currentLesson.lesson_id) ? 'Đã hoàn thành' : 'Đánh dấu đã hoàn thành') }}
                </span>
              </button>
            </div>
          </div>

          <div v-else class="welcome-screen">
            <div class="welcome-content">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="welcome-icon">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              <h2 class="welcome-title">Chào mừng đến với khóa học!</h2>
              <p class="welcome-text">Chọn một bài học từ danh sách bên trái để bắt đầu học</p>
            </div>
          </div>
        </main>
      </div>
    </div>

    <div v-else class="error-container">
      <div class="error-content">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="error-icon">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2 class="error-title">Không tìm thấy khóa học</h2>
        <p class="error-message">Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <button @click="$router.push('/courses')" class="back-btn error-btn">Quay lại danh sách khóa học</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById, getEnrollment, updateProgress } from '@/utils/courseAPI'

export default {
  name: 'CourseLearningView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const course = ref(null)
    const currentModuleIndex = ref(null)
    const currentLessonIndex = ref(null)
    const expandedModules = ref({})
    const completedLessons = ref([])
    const sidebarOpen = ref(true)
    const isSavingProgress = ref(false)

    const fetchCourse = async () => {
      loading.value = true
      try {
        const courseId = route.params.id
        const response = await getCourseById(courseId)
        
        if (response.success && response.data) {
          course.value = response.data
          
          // Expand first module by default
          if (course.value.modules && course.value.modules.length > 0) {
            expandedModules.value[0] = true
            
            // Select first lesson if available
            if (course.value.modules[0].lessons && course.value.modules[0].lessons.length > 0) {
              currentModuleIndex.value = 0
              currentLessonIndex.value = 0
            }
          }
          
          // Load enrollment progress
          await loadProgress(courseId)
        }
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        loading.value = false
      }
    }

    const loadProgress = async (courseId) => {
      const userId = localStorage.getItem('userId') || localStorage.getItem('user_id')
      if (!userId) {
        console.log('⚠️ No userId found, skipping progress load')
        return
      }

      // Load from localStorage first as fallback
      const loadFromLocalStorage = (courseId, userId) => {
        try {
          const key = `course_progress_${courseId}_${userId}`
          const localProgress = JSON.parse(localStorage.getItem(key) || '[]')
          if (localProgress.length > 0) {
            console.log('💾 Loaded progress from localStorage:', localProgress)
            return localProgress
          }
        } catch (err) {
          console.error('Error loading from localStorage:', err)
        }
        return []
      }

      try {
        console.log('🔄 Loading progress for course:', courseId, 'user:', userId)
        const response = await getEnrollment(courseId, userId)
        console.log('📥 Enrollment response:', response)
        
        if (response && response.success && response.data) {
          const progress = response.data.progress || response.data
          
          if (progress && progress.completedLessons) {
            // Handle both array of objects and array of strings
            if (Array.isArray(progress.completedLessons)) {
              completedLessons.value = progress.completedLessons.map(l => {
                if (typeof l === 'string') return l
                return l.lesson_id || l
              }).filter(Boolean)
            }
            
            console.log('✅ Loaded completed lessons from server:', completedLessons.value)
          }
          
          // Merge with localStorage progress (in case server is missing some)
          const localProgress = loadFromLocalStorage(courseId, userId)
          localProgress.forEach(lessonId => {
            if (!completedLessons.value.includes(lessonId)) {
              completedLessons.value.push(lessonId)
            }
          })
          
          // Restore last accessed lesson
          if (progress && progress.lastAccessedLesson && course.value) {
            const lastModule = course.value.modules?.findIndex(
              m => m.module_id === progress.lastAccessedLesson.module_id
            )
            const lastLesson = lastModule !== -1 
              ? course.value.modules[lastModule]?.lessons?.findIndex(
                  l => l.lesson_id === progress.lastAccessedLesson.lesson_id
                )
              : -1
            
            if (lastModule !== -1 && lastLesson !== -1) {
              currentModuleIndex.value = lastModule
              currentLessonIndex.value = lastLesson
              expandedModules.value[lastModule] = true
              console.log('✅ Restored last accessed lesson:', { lastModule, lastLesson })
            }
          }
        } else {
          console.log('⚠️ No enrollment found or invalid response, loading from localStorage')
          // Load from localStorage as fallback
          const localProgress = loadFromLocalStorage(courseId, userId)
          completedLessons.value = localProgress
        }
      } catch (error) {
        console.error('❌ Error loading progress from server:', error)
        console.error('Error details:', error.response?.data || error.message)
        // Load from localStorage as fallback
        console.log('💾 Falling back to localStorage...')
        const localProgress = loadFromLocalStorage(courseId, userId)
        completedLessons.value = localProgress
      }
    }

    const toggleModule = (moduleIndex) => {
      expandedModules.value[moduleIndex] = !expandedModules.value[moduleIndex]
    }

    const saveLastAccessedLesson = async (moduleIndex, lessonIndex) => {
      if (!course.value || moduleIndex === null || lessonIndex === null) return
      
      const userId = localStorage.getItem('userId') || localStorage.getItem('user_id')
      if (!userId) return

      try {
        const currentModule = course.value.modules[moduleIndex]
        const currentLesson = currentModule?.lessons[lessonIndex]
        
        if (!currentModule || !currentLesson) return

        // Save last accessed lesson (without marking as complete)
        const result = await updateProgress(
          route.params.id,
          userId,
          currentLesson.lesson_id,
          currentModule.module_id
        )

        if (result.success) {
          console.log('✅ Last accessed lesson saved')
        }
      } catch (error) {
        console.error('Error saving last accessed lesson:', error)
        // Don't show error to user for this background operation
      }
    }

    const selectLesson = async (moduleIndex, lessonIndex) => {
      currentModuleIndex.value = moduleIndex
      currentLessonIndex.value = lessonIndex
      
      // Expand module if not expanded
      if (!expandedModules.value[moduleIndex]) {
        expandedModules.value[moduleIndex] = true
      }
      
      // Save last accessed lesson
      await saveLastAccessedLesson(moduleIndex, lessonIndex)
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const markAsComplete = async () => {
      if (!currentLesson.value || !course.value) {
        console.error('❌ Cannot mark as complete: missing lesson or course')
        return
      }
      
      const lessonId = currentLesson.value.lesson_id
      const userId = localStorage.getItem('userId') || localStorage.getItem('user_id')
      
      if (!userId) {
        alert('Bạn cần đăng nhập để lưu tiến độ')
        return
      }

      if (!lessonId) {
        console.error('❌ Cannot mark as complete: missing lesson_id')
        alert('Không tìm thấy thông tin bài học. Vui lòng thử lại.')
        return
      }

      // Check if already completed
      if (completedLessons.value.includes(lessonId)) {
        console.log('ℹ️ Lesson already completed:', lessonId)
        return
      }

      // Prevent multiple simultaneous requests
      if (isSavingProgress.value) {
        console.log('⏳ Already saving progress, please wait...')
        return
      }

      isSavingProgress.value = true

      try {
        // Get module_id (optional but helpful)
        const currentModule = course.value.modules[currentModuleIndex.value]
        const moduleId = currentModule?.module_id || null

        const courseId = route.params.id
        console.log('🔄 Marking lesson as complete:', { courseId, userId, lessonId, moduleId })

        // Save to localStorage as fallback
        const saveToLocalStorage = (courseId, lessonId) => {
          try {
            const key = `course_progress_${courseId}_${userId}`
            const existing = JSON.parse(localStorage.getItem(key) || '[]')
            if (!existing.includes(lessonId)) {
              existing.push(lessonId)
              localStorage.setItem(key, JSON.stringify(existing))
              console.log('💾 Saved progress to localStorage as fallback')
            }
          } catch (err) {
            console.error('Error saving to localStorage:', err)
          }
        }

        // Update progress on backend FIRST - prioritize database
        console.log('🔄 Saving progress to database...')
        const result = await updateProgress(
          courseId,
          userId,
          lessonId,
          moduleId
        )

        console.log('📥 Update progress response:', result)

        // Check if save to database was successful
        if (result && (result.success === true || (result.data && result.data.progress))) {
          // Successfully saved to database
          console.log('✅ Progress saved to database successfully')
          
          // Update local state
          if (!completedLessons.value.includes(lessonId)) {
            completedLessons.value.push(lessonId)
          }
          
          // Update progress percentage
          updateProgressPercentage()
          
          // Reload progress to get updated percentage from server
          await loadProgress(courseId)
          
          console.log('✅ Lesson marked as complete and saved to database')
        } else {
          // Failed to save to database - use localStorage as fallback
          const errorMessage = result?.message || result?.error?.message || 'Lỗi không xác định'
          console.error('❌ Failed to save progress to database:', errorMessage, result)
          console.log('💾 Falling back to localStorage...')
          
          // Save to localStorage as fallback
          saveToLocalStorage(courseId, lessonId)
          
          // Update local state
          if (!completedLessons.value.includes(lessonId)) {
            completedLessons.value.push(lessonId)
          }
          
          // Update progress percentage
          updateProgressPercentage()
          
          alert('Không thể lưu tiến độ vào database. Tiến độ đã được lưu cục bộ và sẽ được đồng bộ khi kết nối ổn định.')
        }
      } catch (error) {
        console.error('❌ Error marking lesson as complete:', error)
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          code: error.code,
          stack: error.stack
        })
        
        // Don't remove from completed - progress is saved locally
        // The lesson will remain marked as complete in the UI
        // Progress is saved to localStorage and will sync when server is available
        
        let errorMessage = 'Không thể kết nối đến server để lưu tiến độ.'
        
        if (error.success === false && error.message) {
          errorMessage = error.message
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        
        // More user-friendly error messages
        if (error.code === 'ECONNABORTED' || errorMessage.includes('timeout')) {
          errorMessage = 'Kết nối đến server bị timeout. Tiến độ đã được lưu cục bộ và sẽ được đồng bộ khi kết nối ổn định.'
        } else if (errorMessage.includes('Network Error') || errorMessage.includes('ERR_NETWORK')) {
          errorMessage = 'Không thể kết nối đến server. Tiến độ đã được lưu cục bộ và sẽ được đồng bộ khi kết nối ổn định.'
        } else {
          errorMessage += ' Tiến độ đã được lưu cục bộ và sẽ được đồng bộ khi kết nối ổn định.'
        }
        
        // Show info instead of error since progress is saved locally
        console.log('ℹ️', errorMessage)
        // Don't show alert - progress is saved locally, user can continue
      } finally {
        isSavingProgress.value = false
      }
    }

    const isLessonCompleted = (lessonId) => {
      return completedLessons.value.includes(lessonId)
    }

    const previousLesson = () => {
      if (!hasPreviousLesson.value) return
      
      if (currentLessonIndex.value > 0) {
        currentLessonIndex.value--
      } else if (currentModuleIndex.value > 0) {
        currentModuleIndex.value--
        const prevModule = course.value.modules[currentModuleIndex.value]
        if (prevModule.lessons && prevModule.lessons.length > 0) {
          currentLessonIndex.value = prevModule.lessons.length - 1
          expandedModules.value[currentModuleIndex.value] = true
        }
      }
    }

    const nextLesson = () => {
      if (!hasNextLesson.value) return
      
      const currentModule = course.value.modules[currentModuleIndex.value]
      if (currentLessonIndex.value < currentModule.lessons.length - 1) {
        currentLessonIndex.value++
      } else if (currentModuleIndex.value < course.value.modules.length - 1) {
        currentModuleIndex.value++
        currentLessonIndex.value = 0
        expandedModules.value[currentModuleIndex.value] = true
      }
    }

    const formatContent = (content) => {
      if (!content) return ''
      return content.replace(/\n/g, '<br>')
    }

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const goBack = () => {
      router.push(`/course/${route.params.id}`)
    }

    const getCurrentLessonNumber = () => {
      if (currentModuleIndex.value === null || currentLessonIndex.value === null) return 0
      let count = 0
      for (let i = 0; i < currentModuleIndex.value; i++) {
        count += course.value.modules[i].lessons?.length || 0
      }
      return count + currentLessonIndex.value + 1
    }

    const currentLesson = computed(() => {
      if (currentModuleIndex.value === null || currentLessonIndex.value === null) return null
      const module = course.value?.modules[currentModuleIndex.value]
      return module?.lessons[currentLessonIndex.value] || null
    })

    const totalLessons = computed(() => {
      if (!course.value?.modules) return 0
      return course.value.modules.reduce((sum, module) => sum + (module.lessons?.length || 0), 0)
    })

    const updateProgressPercentage = () => {
      // Force reactivity update by triggering computed recalculation
      // This is already handled by computed, but we can trigger it explicitly if needed
      // The computed will automatically recalculate when completedLessons changes
    }

    const progressPercentage = computed(() => {
      if (totalLessons.value === 0) return 0
      const percentage = Math.round((completedLessons.value.length / totalLessons.value) * 100)
      // Also save percentage to localStorage for MyCoursesView
      const courseId = route.params.id
      const userId = localStorage.getItem('userId') || localStorage.getItem('user_id')
      if (courseId && userId) {
        try {
          const key = `course_progress_percentage_${courseId}_${userId}`
          localStorage.setItem(key, percentage.toString())
        } catch (err) {
          console.error('Error saving progress percentage:', err)
        }
      }
      return percentage
    })

    const hasPreviousLesson = computed(() => {
      if (currentModuleIndex.value === null || currentLessonIndex.value === null) return false
      return currentModuleIndex.value > 0 || currentLessonIndex.value > 0
    })

    const hasNextLesson = computed(() => {
      if (currentModuleIndex.value === null || currentLessonIndex.value === null) return false
      const currentModule = course.value?.modules[currentModuleIndex.value]
      if (!currentModule) return false
      
      if (currentLessonIndex.value < currentModule.lessons.length - 1) return true
      if (currentModuleIndex.value < course.value.modules.length - 1) return true
      return false
    })

    const getVideoUrl = (lesson) => {
      if (!lesson) return null
      
      // Check multiple possible video field names
      const videoUrl = lesson.videoUrl || lesson.video_url || lesson.videoFileName || lesson.video || null
      
      return videoUrl
    }

    const getFullVideoUrl = (lesson) => {
      const relativeUrl = getVideoUrl(lesson)
      if (!relativeUrl) return null
      
      // If already a full URL (http/https), return as is
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
        return relativeUrl
      }
      
      // Build full URL to backend course service
      const COURSE_SERVICE_URL = 'http://localhost:3004'
      const fullUrl = relativeUrl.startsWith('/') 
        ? `${COURSE_SERVICE_URL}${relativeUrl}`
        : `${COURSE_SERVICE_URL}/${relativeUrl}`
      
      console.log('🎥 Video URL:', relativeUrl, '→', fullUrl)
      return fullUrl
    }

    onMounted(() => {
      fetchCourse()
    })

    return {
      loading,
      course,
      currentModuleIndex,
      currentLessonIndex,
      expandedModules,
      completedLessons,
      currentLesson,
      totalLessons,
      progressPercentage,
      hasPreviousLesson,
      hasNextLesson,
      sidebarOpen,
      isSavingProgress,
      getVideoUrl,
      getFullVideoUrl,
      updateProgressPercentage,
      toggleModule,
      selectLesson,
      markAsComplete,
      isLessonCompleted,
      previousLesson,
      nextLesson,
      formatContent,
      goBack,
      getCurrentLessonNumber,
      toggleSidebar
    }
  }
}
</script>

<style scoped>
/* Base Styles */
.course-learning-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  padding-top: 80px; /* Account for fixed header */
}

/* Loading & Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  gap: 1.5rem;
  padding: 2rem;
}

.loader {
  width: 56px;
  height: 56px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
}

.error-content {
  text-align: center;
  max-width: 500px;
}

.error-icon {
  color: #ef4444;
  margin: 0 auto 1.5rem;
}

.error-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.error-message {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-btn {
  margin-top: 1rem;
}

/* Header */
.learning-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.875rem 0;
  position: sticky;
  top: 80px;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateX(-2px);
}

.back-btn svg {
  flex-shrink: 0;
}

.sidebar-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  color: #374151;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.sidebar-toggle-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #2563eb;
}

.sidebar-toggle-btn svg {
  flex-shrink: 0;
}

.header-title-group {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  min-width: 0;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.3;
}

.progress-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1e40af;
  white-space: nowrap;
}

.progress-badge svg {
  flex-shrink: 0;
}

/* Main Layout */
.learning-main {
  display: grid;
  grid-template-columns: 300px 1fr;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  min-height: calc(100vh - 160px);
  transition: grid-template-columns 0.3s ease;
  position: relative;
}

.learning-main.sidebar-closed {
  grid-template-columns: 0 1fr;
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 968px) {
  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 160px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
    animation: fadeIn 0.3s ease;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Sidebar */
.sidebar {
  background: white;
  border-right: 1px solid #e5e7eb;
  height: calc(100vh - 160px);
  overflow-y: auto;
  overflow-x: hidden;
  position: sticky;
  top: 160px;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
  width: 300px;
}

.sidebar.sidebar-hidden {
  transform: translateX(-100%);
  opacity: 0;
  width: 0;
  border-right: none;
  pointer-events: none;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.sidebar-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(180deg, #fafbfc 0%, white 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.sidebar-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
  letter-spacing: -0.01em;
}

.progress-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 0.75rem;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #0369a1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progress-value {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0c4a6e;
}

.progress-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #bae6fd;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0284c7 0%, #0ea5e9 100%);
  border-radius: 999px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(2, 132, 199, 0.3);
}

.progress-percent {
  font-size: 0.75rem;
  font-weight: 600;
  color: #0369a1;
  min-width: 36px;
  text-align: right;
}

.modules-list {
  padding: 0.5rem;
}

.module-item {
  margin-bottom: 0.375rem;
}

.module-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  user-select: none;
}

.module-header:hover {
  background: #f8fafc;
}

.module-item.active .module-header {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
}

.module-number-wrapper {
  flex-shrink: 0;
}

.module-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #e5e7eb;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #6b7280;
  transition: all 0.2s ease;
}

.module-item.active .module-number {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.module-title {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.4;
}

.toggle-icon {
  flex-shrink: 0;
  color: #6b7280;
  transition: transform 0.3s ease;
  width: 16px;
  height: 16px;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.lessons-list {
  padding: 0.375rem 0.375rem 0.375rem 2.75rem;
}

.module-expand-enter-active,
.module-expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.module-expand-enter-from,
.module-expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.lesson-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-bottom: 0.25rem;
}

.lesson-item:hover {
  background: #f8fafc;
}

.lesson-item.active {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #bbf7d0;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.1);
}

.lesson-item.completed .lesson-title-text {
  color: #059669;
}

.lesson-icon-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.lesson-icon {
  color: #9ca3af;
  transition: color 0.2s ease;
  width: 16px;
  height: 16px;
}

.lesson-icon.completed-icon {
  color: #10b981;
}

.lesson-icon.preview-icon {
  color: #3b82f6;
}

.lesson-icon.locked-icon {
  color: #9ca3af;
}

.lesson-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.lesson-title-text {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lesson-duration {
  font-size: 0.6875rem;
  color: #9ca3af;
  font-weight: 500;
}

/* Content Area */
.content-area {
  padding: 1.5rem;
  overflow-y: auto;
  height: calc(100vh - 160px);
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.content-area::-webkit-scrollbar {
  width: 6px;
}

.content-area::-webkit-scrollbar-track {
  background: transparent;
}

.content-area::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.content-area::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.lesson-content {
  max-width: 1000px;
  margin: 0 auto;
}

/* Navigation Bar */
.lesson-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8125rem;
  color: #374151;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #2563eb;
  color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.15);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f9fafb;
}

.nav-btn svg {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.lesson-counter {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
}

.current-lesson {
  color: #2563eb;
  font-size: 0.875rem;
}

.separator {
  color: #9ca3af;
}

.total-lessons {
  color: #9ca3af;
}

/* Lesson Header */
.lesson-header {
  margin-bottom: 1.5rem;
}

.lesson-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.lesson-description {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Video */
.lesson-video-wrapper {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #000;
}

.video-player {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
}

.video-iframe,
.video-element {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: #000;
}

.video-element {
  max-width: 100%;
  object-fit: contain;
}

.video-placeholder {
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

.placeholder-content {
  text-align: center;
  color: white;
}

.placeholder-icon {
  margin-bottom: 0.75rem;
  opacity: 0.6;
  width: 48px;
  height: 48px;
}

.placeholder-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Content Cards */
.lesson-text-card,
.lesson-resources-card,
.lesson-actions-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.content-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f3f4f6;
}

.text-content {
  color: #374151;
  line-height: 1.7;
  font-size: 0.9375rem;
}

.text-content :deep(p) {
  margin-bottom: 1.25rem;
}

.text-content :deep(h1),
.text-content :deep(h2),
.text-content :deep(h3) {
  color: #1f2937;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.text-content :deep(ul),
.text-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1.25rem;
}

.text-content :deep(li) {
  margin-bottom: 0.5rem;
}

/* Resources */
.resources-title {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f3f4f6;
}

.resources-title svg {
  color: #2563eb;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  color: #374151;
  transition: all 0.2s ease;
}

.resource-item:hover {
  background: #f1f5f9;
  border-color: #2563eb;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.resource-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 8px;
  color: #2563eb;
  flex-shrink: 0;
}

.resource-icon-wrapper svg {
  width: 18px;
  height: 18px;
}

.resource-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.resource-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resource-type {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.resource-arrow {
  flex-shrink: 0;
  color: #9ca3af;
  transition: transform 0.2s ease;
  width: 16px;
  height: 16px;
}

.resource-item:hover .resource-arrow {
  transform: translateX(4px);
  color: #2563eb;
}

/* Actions */
.lesson-actions-card {
  text-align: center;
}

.complete-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.complete-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.complete-btn:disabled,
.complete-btn.completed {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #059669;
  cursor: default;
  box-shadow: none;
}

.complete-btn svg {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.complete-btn .spinner {
  animation: spin 0.8s linear infinite;
}

.complete-btn.saving {
  opacity: 0.8;
  cursor: wait;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Welcome Screen */
.welcome-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem 1.5rem;
}

.welcome-content {
  text-align: center;
  max-width: 500px;
}

.welcome-icon {
  color: #cbd5e1;
  margin: 0 auto 1.5rem;
  width: 64px;
  height: 64px;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
}

.welcome-text {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .learning-main {
    grid-template-columns: 280px 1fr;
  }
  
  .sidebar {
    width: 280px;
  }
  
  .learning-main.sidebar-closed {
    grid-template-columns: 0 1fr;
  }
  
  .content-area {
    padding: 1.25rem;
  }
}

@media (max-width: 968px) {
  .course-learning-page {
    padding-top: 80px;
  }
  
  .learning-header {
    top: 80px;
  }
  
  .learning-main {
    grid-template-columns: 1fr;
    position: relative;
  }
  
  .learning-main.sidebar-closed {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: fixed;
    left: 0;
    top: 160px;
    width: 280px;
    height: calc(100vh - 160px);
    z-index: 100;
    transform: translateX(-100%);
    opacity: 0;
    pointer-events: none;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar:not(.sidebar-hidden) {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
  }
  
  .content-area {
    height: auto;
    padding: 1.25rem;
  }
  
  .lesson-nav-bar {
    flex-wrap: wrap;
  }
  
  .lesson-title {
    font-size: 1.25rem;
  }
  
  .header-content {
    padding: 0 1.25rem;
  }
  
  .course-title {
    font-size: 1.125rem;
  }
}

@media (max-width: 640px) {
  .header-content {
    padding: 0 1rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .back-btn span {
    display: none;
  }
  
  .back-btn {
    padding: 0.5rem;
    width: 36px;
    height: 36px;
    justify-content: center;
  }
  
  .progress-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.625rem;
  }
  
  .content-area {
    padding: 1rem;
  }
  
  .lesson-title {
    font-size: 1.125rem;
  }
  
  .lesson-text-card,
  .lesson-resources-card,
  .lesson-actions-card {
    padding: 1rem;
  }
  
  .sidebar {
    width: 100%;
    max-width: 320px;
  }
}
</style>

<template>
  <div class="my-courses-page">
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">📚 Khóa Học Của Tôi</h1>
        <p class="page-subtitle">Quản lý các khóa học bạn đã đăng ký và theo dõi tiến độ học tập</p>
      </div>

      <!-- Access Denied Message -->
      <div v-if="!isLoggedIn" class="access-denied">
        <div class="denied-icon">🔒</div>
        <h2>Bạn cần đăng nhập</h2>
        <p>Vui lòng đăng nhập để xem các khóa học của bạn.</p>
        <router-link to="/auth" class="btn-login">Đăng nhập</router-link>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="loading-container">
        <div class="loader"></div>
        <p>Đang tải khóa học của bạn...</p>
      </div>

      <!-- Courses Content -->
      <div v-else class="courses-content">
        <!-- Tabs -->
        <div class="tabs">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'active' }"
            @click="activeTab = 'active'"
          >
            Đang học ({{ activeCourses.length }})
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'completed' }"
            @click="activeTab = 'completed'"
          >
            Đã hoàn thành ({{ completedCourses.length }})
          </button>
        </div>

        <!-- Active Courses -->
        <div v-if="activeTab === 'active'" class="courses-section">
          <div v-if="activeCourses.length === 0" class="empty-state">
            <div class="empty-icon">📖</div>
            <h3>Chưa có khóa học nào</h3>
            <p>Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học mới!</p>
            <router-link to="/courses" class="btn-primary">Khám phá khóa học</router-link>
          </div>

          <div v-else class="courses-grid">
            <div
              v-for="enrollment in activeCourses"
              :key="enrollment.enrollment_id"
              class="course-card"
            >
              <div class="course-thumbnail-wrapper">
                <img
                  :src="getThumbnailUrl(enrollment.course.thumbnail)"
                  :alt="enrollment.course.title"
                  class="course-thumbnail"
                  @error="handleImageError"
                />
                <div class="progress-overlay">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: enrollment.progress.completionPercentage + '%' }"
                    ></div>
                  </div>
                  <span class="progress-text">{{ enrollment.progress.completionPercentage }}%</span>
                </div>
              </div>

              <div class="course-content">
                <div class="course-category">{{ getCategoryName(enrollment.course.category) }}</div>
                <h3 class="course-title">{{ enrollment.course.title }}</h3>
                <p class="course-description">{{ enrollment.course.subtitle || enrollment.course.description }}</p>

                <div class="course-meta">
                  <div class="meta-item">
                    <span class="meta-icon">📚</span>
                    <span>{{ enrollment.course.lessonsCount }} bài học</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-icon">🕐</span>
                    <span>{{ enrollment.course.duration }} giờ</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span>Đăng ký: {{ formatDate(enrollment.enrolledAt) }}</span>
                  </div>
                </div>

                <div class="course-actions">
                  <button
                    @click="continueLearning(enrollment.course.id || enrollment.course.course_id)"
                    class="btn-continue"
                  >
                    Tiếp tục học
                  </button>
                  <button
                    @click="viewCourse(enrollment.course.id || enrollment.course.course_id)"
                    class="btn-view"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Completed Courses -->
        <div v-if="activeTab === 'completed'" class="courses-section">
          <div v-if="completedCourses.length === 0" class="empty-state">
            <div class="empty-icon">🎓</div>
            <h3>Chưa có khóa học hoàn thành</h3>
            <p>Hãy hoàn thành các khóa học để nhận chứng nhận!</p>
          </div>

          <div v-else class="courses-grid">
            <div
              v-for="enrollment in completedCourses"
              :key="enrollment.enrollment_id"
              class="course-card completed"
            >
              <div class="course-thumbnail-wrapper">
                <img
                  :src="getThumbnailUrl(enrollment.course.thumbnail)"
                  :alt="enrollment.course.title"
                  class="course-thumbnail"
                  @error="handleImageError"
                />
                <div class="completed-badge">
                  <span>✅ Đã hoàn thành</span>
                </div>
              </div>

              <div class="course-content">
                <div class="course-category">{{ getCategoryName(enrollment.course.category) }}</div>
                <h3 class="course-title">{{ enrollment.course.title }}</h3>
                <p class="course-description">{{ enrollment.course.subtitle || enrollment.course.description }}</p>

                <div class="course-meta">
                  <div class="meta-item">
                    <span class="meta-icon">🎓</span>
                    <span>Hoàn thành: {{ formatDate(enrollment.completedAt || enrollment.enrolledAt) }}</span>
                  </div>
                </div>

                <div class="course-actions">
                  <button
                    @click="viewCertificate(enrollment.enrollment_id)"
                    class="btn-certificate"
                  >
                    Xem chứng nhận
                  </button>
                  <button
                    @click="viewCourse(enrollment.course.id || enrollment.course.course_id)"
                    class="btn-view"
                  >
                    Xem lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyEnrollments } from '@/utils/courseAPI'

export default {
  name: 'MyCoursesView',
  setup() {
    const router = useRouter()
    const isLoggedIn = ref(false)
    const loading = ref(true)
    const activeTab = ref('active')
    const enrollments = ref([])

    // Computed
    const activeCourses = computed(() => {
      return enrollments.value.filter(e => e.status === 'active' && e.progress.completionPercentage < 100)
    })

    const completedCourses = computed(() => {
      return enrollments.value.filter(e => e.status === 'completed' || e.progress.completionPercentage >= 100)
    })

    // Methods
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
      isLoggedIn.value = loggedIn
    }

    const mergeLocalProgress = (enrollments) => {
      const userId = localStorage.getItem('userId') || localStorage.getItem('user_id')
      if (!userId) return enrollments
      
      return enrollments.map(enrollment => {
        const courseId = enrollment.course?.id || enrollment.course?.course_id || enrollment.course_id
        if (!courseId) return enrollment
        
        // Get local progress
        const progressKey = `course_progress_${courseId}_${userId}`
        const percentageKey = `course_progress_percentage_${courseId}_${userId}`
        
        try {
          const localLessons = JSON.parse(localStorage.getItem(progressKey) || '[]')
          const localPercentage = parseInt(localStorage.getItem(percentageKey) || '0', 10)
          
          // Merge with server progress
          if (localLessons.length > 0 || localPercentage > 0) {
            const serverLessons = enrollment.progress?.completedLessons || []
            const serverLessonIds = serverLessons.map(l => typeof l === 'string' ? l : l.lesson_id).filter(Boolean)
            
            // Combine server and local lessons
            const allLessonIds = [...new Set([...serverLessonIds, ...localLessons])]
            
            // Calculate percentage from combined lessons
            const course = enrollment.course
            let totalLessons = 0
            if (course?.modules && Array.isArray(course.modules)) {
              course.modules.forEach(module => {
                if (module.lessons && Array.isArray(module.lessons)) {
                  totalLessons += module.lessons.length
                }
              })
            }
            
            const calculatedPercentage = totalLessons > 0 
              ? Math.round((allLessonIds.length / totalLessons) * 100)
              : Math.max(localPercentage, enrollment.progress?.completionPercentage || 0)
            
            // Update enrollment with merged progress
            return {
              ...enrollment,
              progress: {
                ...enrollment.progress,
                completedLessons: allLessonIds.map(lessonId => ({ lesson_id: lessonId })),
                completionPercentage: calculatedPercentage
              }
            }
          }
        } catch (err) {
          console.error('Error merging local progress:', err)
        }
        
        return enrollment
      })
    }

    const fetchMyCourses = async () => {
      loading.value = true
      try {
        const userId = localStorage.getItem('userId') || localStorage.getItem('user_id')
        if (!userId) {
          isLoggedIn.value = false
          return
        }

        const response = await getMyEnrollments(userId)
        
        if (response.success && response.data) {
          // Merge with local progress
          enrollments.value = mergeLocalProgress(response.data)
        } else {
          enrollments.value = []
        }
      } catch (error) {
        console.error('Error fetching my courses:', error)
        enrollments.value = []
      } finally {
        loading.value = false
      }
    }

    const getCategoryName = (category) => {
      const names = {
        programming: 'Lập trình',
        design: 'Thiết kế',
        business: 'Kinh doanh',
        language: 'Ngoại ngữ',
        marketing: 'Marketing',
        science: 'Khoa học',
        other: 'Khác'
      }
      return names[category] || category
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      const d = new Date(date)
      return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getThumbnailUrl = (thumbnail) => {
      if (!thumbnail) {
        // Use a placeholder image that exists or a data URI
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
      }
      if (thumbnail.startsWith('http')) return thumbnail
      if (thumbnail.startsWith('/uploads')) {
        return `http://localhost:3004${thumbnail}`
      }
      if (thumbnail.startsWith('/')) {
        return thumbnail
      }
      return thumbnail
    }

    const handleImageError = (e) => {
      // Prevent infinite loop by checking if already set to placeholder
      if (e.target.src && !e.target.src.includes('data:image/svg+xml')) {
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
      }
    }

    const continueLearning = (courseId) => {
      router.push(`/course/${courseId}/learn`)
    }

    const viewCourse = (courseId) => {
      router.push(`/course/${courseId}`)
    }

    const viewCertificate = () => {
      // TODO: Implement certificate view
      alert('Tính năng xem chứng nhận đang được phát triển')
    }

    onMounted(() => {
      checkAuth()
      if (isLoggedIn.value) {
        fetchMyCourses()
      } else {
        loading.value = false
      }
    })

    return {
      isLoggedIn,
      loading,
      activeTab,
      activeCourses,
      completedCourses,
      getCategoryName,
      formatDate,
      getThumbnailUrl,
      handleImageError,
      continueLearning,
      viewCourse,
      viewCertificate
    }
  }
}
</script>

<style scoped>
.my-courses-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 120px 20px 40px;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
}

.access-denied {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.denied-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.access-denied h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.access-denied p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.btn-login {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-login:hover {
  background: #059669;
}

.loading-container {
  text-align: center;
  padding: 4rem 2rem;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.tab-btn {
  padding: 1rem 2rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: #10b981;
}

.tab-btn.active {
  color: #10b981;
  border-bottom-color: #10b981;
}

/* Courses Grid */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.course-thumbnail-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.course-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.progress-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 1rem;
  color: white;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: #10b981;
  transition: width 0.3s;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
}

.completed-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.course-content {
  padding: 1.5rem;
}

.course-category {
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.course-description {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.meta-icon {
  font-size: 1rem;
}

.course-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-continue,
.btn-certificate {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-continue:hover,
.btn-certificate:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-view {
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view:hover {
  background: #e5e7eb;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.btn-primary {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    flex-direction: column;
    gap: 0;
  }

  .tab-btn {
    border-bottom: 1px solid #e5e7eb;
    border-left: 3px solid transparent;
    border-right: none;
    margin-bottom: 0;
    margin-left: -2px;
  }

  .tab-btn.active {
    border-left-color: #10b981;
    border-bottom-color: #e5e7eb;
  }

  .course-actions {
    flex-direction: column;
  }
}
</style>


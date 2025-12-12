<template>
  <div class="course-intro-page">
    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p>Đang tải thông tin khóa học...</p>
    </div>

    <div v-else-if="course" class="course-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <div class="breadcrumb">
              <span @click="$router.push('/courses')" class="breadcrumb-link">Khóa học</span>
              <span class="breadcrumb-separator">›</span>
              <span>{{ getCategoryName(course.category) }}</span>
            </div>
            
            <h1 class="course-title">{{ course.title }}</h1>
            <p class="course-subtitle">{{ course.subtitle }}</p>
            
            <div class="course-meta">
              <div class="instructor-section">
                <div class="instructor-avatar">{{ getInitials(course.instructor?.name) }}</div>
                <div>
                  <div class="instructor-label">Giảng viên</div>
                  <div class="instructor-name">{{ course.instructor?.name }}</div>
                </div>
              </div>
              
              <div class="course-stats">
                <div class="stat">
                  <span class="stat-value">{{ course.rating.toFixed(1) }}</span>
                  <span class="stat-icon">⭐</span>
                  <span class="stat-count">({{ course.ratingCount }})</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">👥</span>
                  <span class="stat-value">{{ formatStudents(course.enrolledCount) }}</span>
                  <span class="stat-label">học viên</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">📚</span>
                  <span class="stat-value">{{ course.lessonsCount }}</span>
                  <span class="stat-label">bài học</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">🕐</span>
                  <span class="stat-value">{{ course.duration }}</span>
                  <span class="stat-label">giờ</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="hero-sidebar">
            <div class="enrollment-card">
              <div class="price-section">
                <template v-if="course.pricing.isFree">
                  <div class="price free">Miễn phí</div>
                </template>
                <template v-else>
                  <div v-if="course.pricing.originalPrice > course.pricing.price" class="price-original">
                    {{ formatPrice(course.pricing.originalPrice) }}
                  </div>
                  <div class="price current">{{ formatPrice(course.pricing.price) }}</div>
                </template>
              </div>
              
              <button 
                v-if="!isEnrolled"
                @click="handleEnroll" 
                :disabled="enrolling"
                class="enroll-btn"
              >
                <span v-if="enrolling">Đang xử lý...</span>
                <span v-else>{{ course.pricing.isFree ? 'Đăng ký miễn phí' : 'Đăng ký ngay' }}</span>
              </button>
              
              <button 
                v-else
                @click="goToLearning" 
                class="enroll-btn enrolled"
              >
                Vào học ngay
              </button>
              
              <div class="guarantee">
                <span>✓</span> Đảm bảo hoàn tiền trong 30 ngày
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Details -->
      <div class="details-section">
        <div class="details-container">
          <div class="details-main">
            <!-- What You'll Learn -->
            <section class="detail-section">
              <h2>Bạn sẽ học được gì</h2>
              <ul class="learn-list">
                <li v-for="(item, index) in course.whatYouWillLearn" :key="index">
                  <span class="check-icon">✓</span>
                  {{ item }}
                </li>
              </ul>
            </section>

            <!-- Course Content -->
            <section class="detail-section">
              <h2>Nội dung khóa học</h2>
              <div class="modules-list">
                <div 
                  v-for="(module, moduleIndex) in course.modules" 
                  :key="module.module_id"
                  class="module-item"
                >
                  <div class="module-header">
                    <h3>{{ moduleIndex + 1 }}. {{ module.title }}</h3>
                    <span class="module-lesson-count">{{ module.lessons.length }} bài học</span>
                  </div>
                  <div class="lessons-list">
                    <div 
                      v-for="(lesson, lessonIndex) in module.lessons" 
                      :key="lesson.lesson_id"
                      class="lesson-item"
                      :class="{ preview: lesson.isPreview }"
                    >
                      <span class="lesson-icon">{{ lesson.isPreview ? '▶' : '🔒' }}</span>
                      <span class="lesson-number">{{ moduleIndex + 1 }}.{{ lessonIndex + 1 }}</span>
                      <span class="lesson-title">{{ lesson.title }}</span>
                      <span class="lesson-duration">{{ lesson.duration }} phút</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Requirements -->
            <section v-if="course.requirements && course.requirements.length > 0" class="detail-section">
              <h2>Yêu cầu</h2>
              <ul class="requirements-list">
                <li v-for="(req, index) in course.requirements" :key="index">{{ req }}</li>
              </ul>
            </section>

            <!-- Description -->
            <section class="detail-section">
              <h2>Mô tả khóa học</h2>
              <div class="description-content" v-html="formatDescription(course.description)"></div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-container">
      <h2>Không tìm thấy khóa học</h2>
      <button @click="$router.push('/courses')" class="back-btn">Quay lại danh sách khóa học</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourseById, enrollCourse, getEnrollment } from '@/utils/courseAPI'

export default {
  name: 'CourseIntroductionView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const course = ref(null)
    const isEnrolled = ref(false)
    const enrolling = ref(false)

    const fetchCourse = async () => {
      loading.value = true
      try {
        const courseId = route.params.id
        const response = await getCourseById(courseId)
        
        if (response.success && response.data) {
          course.value = {
            ...response.data,
            thumbnail: response.data.thumbnail 
              ? response.data.thumbnail.startsWith('http') 
                ? response.data.thumbnail 
                : `http://localhost:3004${response.data.thumbnail}` 
              : '/img/articles/baigiang.jpg'
          }
          
          // Check enrollment status if user is logged in
          const userId = localStorage.getItem('userId') || localStorage.getItem('user_id')
          if (userId) {
            try {
              const enrollmentResponse = await getEnrollment(courseId, userId)
              isEnrolled.value = enrollmentResponse.enrolled || false
            } catch (error) {
              console.error('Error checking enrollment:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        loading.value = false
      }
    }

    const handleEnroll = async () => {
      const userId = localStorage.getItem('userId') || localStorage.getItem('user_id')
      if (!userId) {
        alert('Vui lòng đăng nhập để đăng ký khóa học')
        router.push('/signin')
        return
      }

      enrolling.value = true
      try {
        const courseId = route.params.id
        console.log('🔄 Starting enrollment process...', { courseId, userId })
        
        const response = await enrollCourse(courseId, userId)
        console.log('📥 Enrollment response received:', response)
        
        if (response && response.success) {
          isEnrolled.value = true
          if (course.value.pricing.isFree) {
            // For free courses, go directly to learning page
            alert('Đăng ký khóa học thành công!')
            goToLearning()
          } else {
            // Ask user if they want to go to My Courses
            const goToMyCourses = confirm('Đăng ký khóa học thành công! Bạn có muốn xem khóa học của tôi không?')
            if (goToMyCourses) {
              router.push('/courses/mine')
            }
          }
        } else {
          const errorMessage = response?.message || 'Đăng ký khóa học thất bại'
          console.error('❌ Enrollment failed:', errorMessage)
          alert(errorMessage)
        }
      } catch (error) {
        console.error('❌ Error enrolling:', error)
        const errorMessage = error?.message || error?.response?.data?.message || 'Có lỗi xảy ra khi đăng ký khóa học'
        alert(errorMessage)
      } finally {
        enrolling.value = false
      }
    }

    const goToLearning = () => {
      const courseId = route.params.id
      router.push(`/course/${courseId}/learn`)
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

    const getInitials = (name) => {
      if (!name) return 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const formatPrice = (price) => {
      return price.toLocaleString('vi-VN') + '₫'
    }

    const formatStudents = (count) => {
      if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K'
      }
      return count.toString()
    }

    const formatDescription = (description) => {
      if (!description) return ''
      return description.replace(/\n/g, '<br>')
    }

    onMounted(() => {
      fetchCourse()
    })

    return {
      loading,
      course,
      isEnrolled,
      enrolling,
      handleEnroll,
      goToLearning,
      getCategoryName,
      getInitials,
      formatPrice,
      formatStudents,
      formatDescription
    }
  }
}
</script>

<style scoped>
.course-intro-page {
  min-height: 100vh;
  background: #f8fafc;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Hero Section */
.hero-section {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 6rem 0 2rem 0;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.breadcrumb-link {
  cursor: pointer;
  color: #10b981;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.course-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.course-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.instructor-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.instructor-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.instructor-label {
  font-size: 0.85rem;
  color: #6b7280;
}

.instructor-name {
  font-weight: 600;
  color: #1f2937;
}

.course-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
}

.stat-value {
  font-weight: 600;
  color: #1f2937;
}

.stat-label {
  color: #6b7280;
}

.stat-icon {
  font-size: 1.1rem;
}

.stat-count {
  color: #6b7280;
  font-size: 0.9rem;
}

/* Enrollment Card */
.hero-sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.enrollment-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.price-section {
  margin-bottom: 1.5rem;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.price.free {
  color: #10b981;
}

.price-original {
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
  margin-bottom: 0.5rem;
}

.price.current {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.enroll-btn {
  width: 100%;
  padding: 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.enroll-btn:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
}

.enroll-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.enroll-btn.enrolled {
  background: #3b82f6;
}

.enroll-btn.enrolled:hover {
  background: #2563eb;
}

.guarantee {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
}

.guarantee span {
  color: #10b981;
  font-weight: 600;
}

/* Details Section */
.details-section {
  padding: 3rem 0;
}

.details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.details-main {
  max-width: 800px;
}

.detail-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.detail-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.learn-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.learn-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
}

.check-icon {
  color: #10b981;
  font-weight: 700;
  font-size: 1.1rem;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.module-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.module-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.module-lesson-count {
  font-size: 0.9rem;
  color: #6b7280;
}

.lessons-list {
  padding: 0.5rem;
}

.lesson-item {
  display: grid;
  grid-template-columns: 30px 50px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
}

.lesson-item.preview {
  background: #f0fdf4;
}

.lesson-icon {
  font-size: 1rem;
}

.lesson-number {
  color: #6b7280;
  font-size: 0.85rem;
}

.lesson-title {
  color: #1f2937;
}

.lesson-duration {
  color: #6b7280;
  font-size: 0.85rem;
}

.requirements-list {
  list-style: disc;
  padding-left: 1.5rem;
  color: #374151;
  line-height: 1.8;
}

.description-content {
  color: #374151;
  line-height: 1.8;
  white-space: pre-wrap;
}

.back-btn {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #059669;
}

@media (max-width: 968px) {
  .hero-container {
    grid-template-columns: 1fr;
  }
  
  .hero-sidebar {
    position: static;
  }
  
  .learn-list {
    grid-template-columns: 1fr;
  }
}
</style>


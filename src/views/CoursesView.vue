<template>
  <div class="courses-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">🎓 Khóa Học Trực Tuyến</h1>
        <p class="page-subtitle">
          Học tập có hệ thống với các khóa học từ cơ bản đến nâng cao.
          Được thiết kế bởi các chuyên gia hàng đầu trong ngành.
        </p>
      </div>
    </div>

    <!-- Stats Banner -->
    <div class="stats-banner">
      <div class="stat-item">
        <div class="stat-number">{{ stats.totalCourses }}</div>
        <div class="stat-label">Khóa học</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.totalStudents }}+</div>
        <div class="stat-label">Học viên</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.totalInstructors }}</div>
        <div class="stat-label">Giảng viên</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.averageRating }}</div>
        <div class="stat-label">Đánh giá TB</div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filters-container">
        <div class="filter-group">
          <label class="filter-label">
            <i class="icon">📖</i> Chủ đề
          </label>
          <select v-model="filters.category" @change="applyFilters" class="filter-select">
            <option value="">Tất cả chủ đề</option>
            <option value="programming">Lập trình</option>
            <option value="design">Thiết kế</option>
            <option value="business">Kinh doanh</option>
            <option value="language">Ngoại ngữ</option>
            <option value="marketing">Marketing</option>
            <option value="science">Khoa học</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <i class="icon">🎯</i> Cấp độ
          </label>
          <select v-model="filters.level" @change="applyFilters" class="filter-select">
            <option value="">Tất cả cấp độ</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <i class="icon">💰</i> Giá
          </label>
          <select v-model="filters.price" @change="applyFilters" class="filter-select">
            <option value="">Tất cả</option>
            <option value="free">Miễn phí</option>
            <option value="paid">Có phí</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <i class="icon">⏱️</i> Thời lượng
          </label>
          <select v-model="filters.duration" @change="applyFilters" class="filter-select">
            <option value="">Tất cả</option>
            <option value="short">&lt; 5 giờ</option>
            <option value="medium">5-20 giờ</option>
            <option value="long">&gt; 20 giờ</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p class="loading-text">Đang tải khóa học...</p>
    </div>

    <!-- No Courses State -->
    <div v-else-if="courses.length === 0" class="no-courses-container">
      <div class="no-courses-icon">📚</div>
      <h3>Không tìm thấy khóa học nào</h3>
      <p>Thử thay đổi bộ lọc để xem thêm khóa học!</p>
    </div>

    <!-- Courses Grid -->
    <div v-else class="courses-container">
      <div class="courses-grid">
        <div 
          v-for="course in paginatedCourses" 
          :key="course.id"
          class="course-card"
          @click="goToCourse(course.id)"
        >
          <!-- Thumbnail -->
          <div class="course-thumbnail">
            <img 
              :src="course.thumbnail" 
              :alt="course.title"
              class="thumbnail-image"
            >
            <div v-if="course.isFree" class="free-badge">
              Miễn phí
            </div>
            <div v-if="course.isBestSeller" class="bestseller-badge">
              🔥 Best Seller
            </div>
            <div class="course-duration">
              <i class="icon">🕐</i> {{ course.duration }}
            </div>
          </div>

          <!-- Content -->
          <div class="course-content">
            <div class="course-category">{{ getCategoryName(course.category) }}</div>
            
            <h3 class="course-title">{{ course.title }}</h3>
            
            <p class="course-description">{{ course.description }}</p>

            <div class="instructor-info">
              <div class="instructor-avatar">{{ getInitials(course.instructorData?.name || course.instructor) }}</div>
              <span class="instructor-name">{{ course.instructorData?.name || course.instructor }}</span>
            </div>

            <div class="course-stats">
              <div class="stat">
                <i class="icon">⭐</i>
                <span class="stat-value">{{ course.rating.toFixed(1) }}</span>
                <span class="stat-count">({{ course.reviewCount }})</span>
              </div>
              <div class="stat">
                <i class="icon">👥</i>
                <span class="stat-value">{{ formatStudents(course.enrolledCount) }}</span>
              </div>
            </div>

            <div class="course-footer">
              <div class="course-level">
                <span class="level-badge" :class="course.level">
                  {{ getLevelName(course.level) }}
                </span>
              </div>
              <div class="course-price">
                <span v-if="course.isFree" class="price free">Miễn phí</span>
                <template v-else>
                  <span v-if="course.originalPrice" class="price original">
                    {{ formatPrice(course.originalPrice) }}
                  </span>
                  <span class="price current">{{ formatPrice(course.price) }}</span>
                </template>
              </div>
            </div>

            <button class="enroll-btn">
              <i class="icon">📚</i> 
              {{ course.isFree ? 'Học ngay' : 'Đăng ký' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && courses.length > 0" class="pagination">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <i class="icon">←</i>
      </button>
      
      <button
        v-for="page in displayPages"
        :key="page"
        class="page-btn"
        :class="{ active: page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      
      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        <i class="icon">→</i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'CoursesView',
  setup() {
    const router = useRouter()
    const loading = ref(true)
    const courses = ref([])
    const currentPage = ref(1)
    const coursesPerPage = 9

    const stats = ref({
      totalCourses: 256,
      totalStudents: 12547,
      totalInstructors: 48,
      averageRating: 4.8
    })

    // Filters
    const filters = ref({
      category: '',
      level: '',
      price: '',
      duration: ''
    })


    // Computed
    const filteredCourses = computed(() => {
      let result = [...courses.value]

      if (filters.value.category) {
        result = result.filter(c => c.category === filters.value.category)
      }
      if (filters.value.level) {
        result = result.filter(c => c.level === filters.value.level)
      }
      if (filters.value.price === 'free') {
        result = result.filter(c => c.isFree)
      } else if (filters.value.price === 'paid') {
        result = result.filter(c => !c.isFree)
      }
      if (filters.value.duration) {
        result = result.filter(c => {
          const hours = parseInt(c.duration) || 0
          if (filters.value.duration === 'short') return hours < 5
          if (filters.value.duration === 'medium') return hours >= 5 && hours <= 20
          if (filters.value.duration === 'long') return hours > 20
          return true
        })
      }

      return result
    })

    const paginatedCourses = computed(() => {
      const start = (currentPage.value - 1) * coursesPerPage
      return filteredCourses.value.slice(start, start + coursesPerPage)
    })

    const totalPages = computed(() => 
      Math.ceil(filteredCourses.value.length / coursesPerPage)
    )

    const displayPages = computed(() => {
      const pages = []
      const maxPages = 5
      let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
      let end = Math.min(totalPages.value, start + maxPages - 1)

      if (end - start < maxPages - 1) {
        start = Math.max(1, end - maxPages + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    // Methods
    const fetchCourses = async () => {
      loading.value = true
      try {
        // Build query params from filters
        const params = {
          limit: 100, // Get all courses for now
          page: 1,
          sortBy: 'newest',
          status: 'published',
          visibility: 'public'
        }
        
        if (filters.value.category) params.category = filters.value.category
        if (filters.value.level) params.level = filters.value.level
        if (filters.value.price === 'free') params.isFree = 'true'
        else if (filters.value.price === 'paid') params.isFree = 'false'
        
        // Use relative path to go through Vue proxy
        const apiUrl = '/api/courses?' + new URLSearchParams(params)
        console.log('Fetching courses from:', apiUrl)
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        console.log('Courses API response:', result)
        
        if (result.success && result.data && Array.isArray(result.data)) {
          // Transform API data to match component format
          courses.value = result.data.map(course => ({
            id: course.id || course._id || course.course_id, // Use MongoDB _id first for navigation
            course_id: course.course_id,
            title: course.title,
            subtitle: course.subtitle,
            description: course.description,
            thumbnail: course.thumbnail 
              ? (course.thumbnail.startsWith('http') 
                ? course.thumbnail 
                : `http://localhost:3004${course.thumbnail}`)
              : `/img/articles/${['baigiang.jpg', 'code.jpg', 'baibien.jpg'][Math.floor(Math.random() * 3)]}`,
            instructor: course.instructor?.name || 'Giảng viên',
            instructorData: course.instructor,
            category: course.category,
            level: course.level,
            duration: course.duration ? `${course.duration} giờ` : '0 giờ',
            rating: course.rating || 0,
            reviewCount: course.reviewCount || 0,
            enrolledCount: course.enrolledCount || 0,
            isFree: course.pricing?.isFree || false,
            isBestSeller: course.isBestSeller || false,
            price: course.pricing?.price || 0,
            originalPrice: course.pricing?.originalPrice || 0,
            lessonsCount: course.lessonsCount || 0,
            createdAt: course.createdAt ? new Date(course.createdAt) : new Date()
          }))
          
          // Update stats
          if (result.data.length > 0) {
            stats.value.totalCourses = result.pagination?.total || courses.value.length
            const totalEnrolled = courses.value.reduce((sum, c) => sum + (c.enrolledCount || 0), 0)
            stats.value.totalStudents = totalEnrolled
            const avgRating = courses.value.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.value.length
            stats.value.averageRating = avgRating.toFixed(1)
          }
        } else {
          console.warn('No courses found or invalid response:', result)
          courses.value = []
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        })
        courses.value = []
        // Show user-friendly error message
        alert('Không thể tải danh sách khóa học. Vui lòng kiểm tra:\n1. Course service có đang chạy không (port 3004)\n2. API Gateway có đang chạy không (port 3000)\n3. Dữ liệu đã được import vào MongoDB chưa')
      } finally {
        loading.value = false
      }
    }

    const applyFilters = () => {
      currentPage.value = 1
      fetchCourses() // Fetch lại khi filter thay đổi
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const goToCourse = (id) => {
      // Navigate to course introduction page
      router.push(`/course/${id}`)
    }

    const getCategoryName = (category) => {
      const names = {
        programming: 'Lập trình',
        design: 'Thiết kế',
        business: 'Kinh doanh',
        language: 'Ngoại ngữ',
        marketing: 'Marketing',
        science: 'Khoa học'
      }
      return names[category] || category
    }

    const getLevelName = (level) => {
      const names = {
        beginner: 'Cơ bản',
        intermediate: 'Trung cấp',
        advanced: 'Nâng cao',
        expert: 'Chuyên gia'
      }
      return names[level] || level
    }

    const getInitials = (name) => {
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

    onMounted(() => {
      console.log('CoursesView mounted, fetching courses...')
      fetchCourses()
    })

    return {
      loading,
      courses,
      currentPage,
      stats,
      filters,
      paginatedCourses,
      totalPages,
      displayPages,
      applyFilters,
      changePage,
      goToCourse,
      getCategoryName,
      getLevelName,
      getInitials,
      formatPrice,
      formatStudents
    }
  }
}
</script>

<style scoped>
.courses-page {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: 4rem;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 120px 20px 60px;
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
  line-height: 1.6;
}

/* Stats Banner */
.stats-banner {
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin: -30px 20px 3rem;
  padding: 2rem;
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
}

/* Filters */
.filters-section {
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem 20px;
  margin-bottom: 3rem;
}

.filters-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover {
  border-color: #10b981;
}

.filter-select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Loading & No Courses */
.loading-container,
.no-courses-container {
  text-align: center;
  padding: 4rem 20px;
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

.no-courses-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

/* Courses Grid */
.courses-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.course-thumbnail {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.course-card:hover .thumbnail-image {
  transform: scale(1.05);
}

.free-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #10b981;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.bestseller-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f59e0b;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.course-duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

.course-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-category {
  font-size: 0.85rem;
  color: #10b981;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.course-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

.instructor-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.instructor-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
}

.instructor-name {
  font-size: 0.9rem;
  color: #374151;
}

.course-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
}

.stat-value {
  font-weight: 600;
  color: #1f2937;
}

.stat-count {
  color: #6b7280;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.level-badge {
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.level-badge.beginner { background: #dbeafe; color: #1e40af; }
.level-badge.intermediate { background: #fef3c7; color: #92400e; }
.level-badge.advanced { background: #fce7f3; color: #9f1239; }
.level-badge.expert { background: #e0e7ff; color: #3730a3; }

.course-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.price {
  font-weight: 700;
}

.price.free {
  color: #10b981;
  font-size: 1.2rem;
}

.price.current {
  color: #1f2937;
  font-size: 1.3rem;
}

.price.original {
  color: #9ca3af;
  font-size: 0.9rem;
  text-decoration: line-through;
}

.enroll-btn {
  width: 100%;
  padding: 0.85rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: auto;
}

.enroll-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  border-color: #10b981;
  color: #10b981;
}

.page-btn.active {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  font-style: normal;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .stats-banner {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters-container {
    grid-template-columns: 1fr;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>


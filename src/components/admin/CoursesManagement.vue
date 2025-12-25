<template>
  <div class="courses-management admin-page">
    <div class="section-header">
      <h2>Quản lý khóa học</h2>
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm khóa học..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">Đang tải...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Giảng viên</th>
            <th>Học viên</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course._id || course.id">
            <td>{{ course.title }}</td>
            <td>{{ course.instructor?.name || '-' }}</td>
            <td>{{ course.enrollmentCount || 0 }}</td>
            <td>{{ formatPrice(course.price) }}</td>
            <td>
              <span v-if="isSoftDeleted(course)" class="status-badge archived">Đã xóa mềm</span>
              <span v-else class="status-badge active">Đang hoạt động</span>
            </td>
            <td>{{ formatDate(course.createdAt) }}</td>
            <td>
              <button @click="viewCourse(course)" class="btn-action">Xem</button>
              <button
                v-if="!isSoftDeleted(course)"
                @click="deleteCourse(course)"
                class="btn-action btn-delete"
              >Xóa</button>

              <button
                v-else
                @click="restoreCourse(course)"
                class="btn-action"
              >Khôi phục</button>

              <button
                v-if="isSoftDeleted(course)"
                @click="deleteCoursePermanent(course)"
                class="btn-action btn-delete"
              >Xóa vĩnh viễn</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="courses.length === 0" class="empty-state">
        Không có dữ liệu
      </div>
    </div>
  </div>
</template>

<script>
import { getAllCourses, deleteCourse, restoreCourse, deleteCoursePermanent } from '@/utils/adminAPI.js'

export default {
  name: 'CoursesManagement',
  data() {
    return {
      courses: [],
      loading: false,
      error: '',
      searchQuery: ''
    }
  },
  mounted() {
    this.loadCourses()
  },
  methods: {
    async loadCourses() {
      this.loading = true
      this.error = ''
      
      try {
        const params = { limit: 100, status: 'all', visibility: 'all' }
        if (this.searchQuery) {
          params.search = this.searchQuery
        }
        
        const result = await getAllCourses(params)
        if (result.success) {
          this.courses = result.data || []
        } else {
          this.error = result.message || 'Không thể tải danh sách khóa học'
        }
      } catch (error) {
        console.error('Error loading courses:', error)
        this.error = 'Có lỗi xảy ra khi tải dữ liệu'
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.loadCourses()
      }, 500)
    },
    viewCourse(course) {
      alert(`Thông tin khóa học:\n\nTiêu đề: ${course.title}\nGiảng viên: ${course.instructor?.name || '-'}\nHọc viên: ${course.enrollmentCount || 0}\nGiá: ${this.formatPrice(course.price)}`)
    },
    isSoftDeleted(course) {
      return course?.status === 'archived' || course?.visibility === 'private'
    },
    async deleteCourse(course) {
      if (!confirm(`Bạn có chắc muốn xóa khóa học "${course.title}"?`)) {
        return
      }

      try {
        const courseId = course._id || course.id || course.course_id
        const result = await deleteCourse(courseId)
        
        if (result.success) {
          this.loadCourses()
        } else {
          alert(result.message || 'Có lỗi xảy ra')
        }
      } catch (error) {
        console.error('Error deleting course:', error)
        alert('Có lỗi xảy ra khi xóa')
      }
    },
    async restoreCourse(course) {
      if (!confirm(`Bạn có chắc muốn khôi phục khóa học "${course.title}"?`)) {
        return
      }

      try {
        const courseId = course._id || course.id || course.course_id
        const result = await restoreCourse(courseId)

        if (result.success) {
          this.loadCourses()
        } else {
          alert(result.message || 'Có lỗi xảy ra')
        }
      } catch (error) {
        console.error('Error restoring course:', error)
        alert('Có lỗi xảy ra khi khôi phục')
      }
    },
    async deleteCoursePermanent(course) {
      const confirm1 = confirm(`XÓA VĨNH VIỄN sẽ xóa khóa học và dữ liệu liên quan (enrollments/payments).\n\nBạn có chắc muốn xóa vĩnh viễn "${course.title}"?`)
      if (!confirm1) return

      const confirm2 = confirm('Thao tác này KHÔNG THỂ HOÀN TÁC. Nhấn OK để xác nhận lần nữa.')
      if (!confirm2) return

      try {
        const courseId = course._id || course.id || course.course_id
        const result = await deleteCoursePermanent(courseId)

        if (result.success) {
          this.loadCourses()
        } else {
          alert(result.message || 'Có lỗi xảy ra')
        }
      } catch (error) {
        console.error('Error permanently deleting course:', error)
        alert('Có lỗi xảy ra khi xóa vĩnh viễn')
      }
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('vi-VN')
    },
    formatPrice(price) {
      if (!price) return 'Miễn phí'
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    }
  }
}
</script>

<style scoped>
.courses-management {
  background: white;
  padding: 30px;
  border-radius: 4px;
}

.section-header {
  margin-bottom: 30px;
}

.section-header h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: normal;
  color: #333;
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.loading, .error {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error {
  color: #d32f2f;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: 500;
  color: #333;
}

.data-table tr:hover {
  background-color: #f9f9f9;
}

.btn-action {
  padding: 6px 12px;
  margin-right: 8px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-action:hover {
  background-color: #555;
}

.btn-delete {
  background-color: #d32f2f;
}

.btn-delete:hover {
  background-color: #b71c1c;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #999;
}
</style>



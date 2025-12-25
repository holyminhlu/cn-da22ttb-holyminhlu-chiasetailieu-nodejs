<template>
  <div class="users-management admin-page">
    <div class="section-header">
      <h2>Quản lý tài khoản người dùng</h2>
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm theo email hoặc tên..."
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
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id || user.id">
            <td>{{ user.user_id || user._id }}</td>
            <td>{{ user.fullName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <span :class="['status-badge', user.is_active ? 'active' : 'inactive']">
                {{ user.is_active ? 'Hoạt động' : 'Khóa' }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <button @click="viewUser(user)" class="btn-action">Xem</button>
              <button @click="toggleUserStatus(user)" class="btn-action">
                {{ user.is_active ? 'Khóa' : 'Mở khóa' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="users.length === 0" class="empty-state">
        Không có dữ liệu
      </div>
    </div>
  </div>
</template>

<script>
import { getAllUsers, updateUser } from '@/utils/adminAPI.js'

export default {
  name: 'UsersManagement',
  data() {
    return {
      users: [],
      loading: false,
      error: '',
      searchQuery: ''
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    async loadUsers() {
      this.loading = true
      this.error = ''
      
      try {
        const params = {}
        if (this.searchQuery) {
          params.search = this.searchQuery
        }
        
        const result = await getAllUsers(params)
        if (result.success) {
          this.users = result.data || []
        } else {
          this.error = result.message || 'Không thể tải danh sách người dùng'
        }
      } catch (error) {
        console.error('Error loading users:', error)
        this.error = 'Có lỗi xảy ra khi tải dữ liệu'
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      // Debounce search
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.loadUsers()
      }, 500)
    },
    async toggleUserStatus(user) {
      const action = user.is_active ? 'khóa' : 'mở khóa'
      const userName = user.fullName || user.email
      
      if (!confirm(`Bạn có chắc muốn ${action} tài khoản của "${userName}"?\n\n${user.is_active ? 'Tài khoản sẽ không thể đăng nhập sau khi bị khóa.' : 'Tài khoản sẽ có thể đăng nhập lại sau khi mở khóa.'}`)) {
        return
      }

      try {
        const result = await updateUser(user._id || user.id, {
          is_active: !user.is_active
        })
        
        if (result.success) {
          alert(`${action.charAt(0).toUpperCase() + action.slice(1)} tài khoản thành công!`)
          this.loadUsers()
        } else {
          alert(result.message || 'Có lỗi xảy ra')
        }
      } catch (error) {
        console.error('Error updating user:', error)
        alert('Có lỗi xảy ra khi cập nhật trạng thái tài khoản')
      }
    },
    viewUser(user) {
      alert(`Thông tin người dùng:\n\nHọ tên: ${user.fullName}\nEmail: ${user.email}\nVai trò: ${user.role}\nTrạng thái: ${user.is_active ? 'Hoạt động' : 'Khóa'}`)
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('vi-VN')
    }
  }
}
</script>

<style scoped>
.users-management {
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

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactive {
  background-color: #ffebee;
  color: #c62828;
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

.empty-state {
  padding: 40px;
  text-align: center;
  color: #999;
}
</style>


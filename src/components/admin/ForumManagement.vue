<template>
  <div class="forum-management admin-page">
    <div class="section-header">
      <h2>Quản lý diễn đàn</h2>
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm bài viết diễn đàn..."
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
            <th>Người đăng</th>
            <th>Lượt thích</th>
            <th>Bình luận</th>
            <th>Trạng thái</th>
            <th>Ngày đăng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post._id || post.id">
            <td>{{ post.title || post.content?.substring(0, 50) + '...' }}</td>
            <td>{{ post.author?.name || post.user?.name || '-' }}</td>
            <td>{{ post.likes?.length || post.likesCount || 0 }}</td>
            <td>{{ post.comments?.length || post.commentsCount || 0 }}</td>
            <td>
              <span v-if="isSoftDeleted(post)" class="status-badge archived">Đã xóa mềm</span>
              <span v-else class="status-badge active">Đang hoạt động</span>
            </td>
            <td>{{ formatDate(post.createdAt || post.created_at) }}</td>
            <td>
              <button @click="viewPost(post)" class="btn-action">Xem</button>
              <button
                v-if="!isSoftDeleted(post)"
                @click="deletePost(post)"
                class="btn-action btn-delete"
              >Xóa</button>

              <button
                v-else
                @click="restorePost(post)"
                class="btn-action"
              >Khôi phục</button>

              <button
                v-if="isSoftDeleted(post)"
                @click="deletePostPermanent(post)"
                class="btn-action btn-delete"
              >Xóa vĩnh viễn</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="posts.length === 0" class="empty-state">
        Không có dữ liệu
      </div>
    </div>
  </div>
</template>

<script>
import { getAllForumPosts, deleteForumPost, restoreForumPost, deleteForumPostPermanent } from '@/utils/adminAPI.js'

export default {
  name: 'ForumManagement',
  data() {
    return {
      posts: [],
      loading: false,
      error: '',
      searchQuery: ''
    }
  },
  mounted() {
    this.loadPosts()
  },
  methods: {
    async loadPosts() {
      this.loading = true
      this.error = ''
      
      try {
        const params = { limit: 100, includeDeleted: true }
        if (this.searchQuery) {
          params.search = this.searchQuery
        }
        
        const result = await getAllForumPosts(params)
        if (result.success) {
          this.posts = result.data || result.posts || []
        } else {
          this.error = result.message || 'Không thể tải danh sách bài viết diễn đàn'
        }
      } catch (error) {
        console.error('Error loading forum posts:', error)
        this.error = 'Có lỗi xảy ra khi tải dữ liệu'
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.loadPosts()
      }, 500)
    },
    viewPost(post) {
      const title = post.title || 'Không có tiêu đề'
      const author = post.author?.name || post.user?.name || '-'
      const likes = post.likes?.length || post.likesCount || 0
      const comments = post.comments?.length || post.commentsCount || 0
      const content = post.content || post.text || '-'
      
      alert(`Thông tin bài viết:\n\nTiêu đề: ${title}\nNgười đăng: ${author}\nLượt thích: ${likes}\nBình luận: ${comments}\n\nNội dung: ${content.substring(0, 200)}...`)
    },
    isSoftDeleted(post) {
      return post?.is_deleted === true
    },
    async deletePost(post) {
      if (!confirm(`Bạn có chắc muốn xóa bài viết này?`)) {
        return
      }

      try {
        const postId = post._id || post.id
        const result = await deleteForumPost(postId)
        
        if (result.success) {
          this.loadPosts()
        } else {
          alert(result.message || 'Có lỗi xảy ra')
        }
      } catch (error) {
        console.error('Error deleting forum post:', error)
        alert('Có lỗi xảy ra khi xóa')
      }
    },
    async restorePost(post) {
      if (!confirm('Bạn có chắc muốn khôi phục bài viết này?')) {
        return
      }

      try {
        const postId = post._id || post.id
        const result = await restoreForumPost(postId)

        if (result.success) {
          this.loadPosts()
        } else {
          alert(result.message || 'Có lỗi xảy ra')
        }
      } catch (error) {
        console.error('Error restoring forum post:', error)
        alert('Có lỗi xảy ra khi khôi phục')
      }
    },
    async deletePostPermanent(post) {
      const confirm1 = confirm('XÓA VĨNH VIỄN sẽ xóa bài viết và ảnh liên quan trên ổ đĩa. Bạn có chắc muốn tiếp tục?')
      if (!confirm1) return

      const confirm2 = confirm('Thao tác này KHÔNG THỂ HOÀN TÁC. Nhấn OK để xác nhận lần nữa.')
      if (!confirm2) return

      try {
        const postId = post._id || post.id
        const result = await deleteForumPostPermanent(postId)

        if (result.success) {
          this.loadPosts()
        } else {
          alert(result.message || 'Có lỗi xảy ra')
        }
      } catch (error) {
        console.error('Error permanently deleting forum post:', error)
        alert('Có lỗi xảy ra khi xóa vĩnh viễn')
      }
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('vi-VN')
    }
  }
}
</script>

<style scoped>
.forum-management {
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



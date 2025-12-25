<template>
  <div class="admin-shell">
    <div class="admin-shell__layout">
      <aside class="admin-shell__sidebar">
        <div class="admin-shell__brand">OpenLearnFoundation • Admin</div>

        <nav class="admin-shell__nav" aria-label="Điều hướng quản trị">
          <div class="admin-shell__nav-group">
            <div class="admin-shell__nav-title">Người dùng</div>
            <button
              type="button"
              @click="activeTab = 'users'"
              :class="['admin-shell__nav-item', { 'is-active': activeTab === 'users' }]"
            >
              Tài khoản người dùng
            </button>
          </div>

          <div class="admin-shell__nav-group">
            <div class="admin-shell__nav-title">Nội dung</div>
            <button
              type="button"
              @click="activeTab = 'documents'"
              :class="['admin-shell__nav-item', { 'is-active': activeTab === 'documents' }]"
            >
              Tài liệu
            </button>
            <button
              type="button"
              @click="activeTab = 'courses'"
              :class="['admin-shell__nav-item', { 'is-active': activeTab === 'courses' }]"
            >
              Khóa học
            </button>
            <button
              type="button"
              @click="activeTab = 'posts'"
              :class="['admin-shell__nav-item', { 'is-active': activeTab === 'posts' }]"
            >
              Bài viết (Blog)
            </button>
            <button
              type="button"
              @click="activeTab = 'forum'"
              :class="['admin-shell__nav-item', { 'is-active': activeTab === 'forum' }]"
            >
              Diễn đàn
            </button>
          </div>
        </nav>
      </aside>

      <div class="admin-shell__main">
        <header class="admin-shell__header">
          <div>
            <h1 class="admin-shell__title">{{ currentTitle }}</h1>
            <div class="admin-shell__subtitle">{{ currentSubtitle }}</div>
          </div>

          <div class="admin-shell__header-actions">
            <div class="admin-shell__user" v-if="adminIdentity">{{ adminIdentity }}</div>
            <button type="button" @click="handleLogout" class="admin-shell__btn">Đăng xuất</button>
          </div>
        </header>

        <main class="admin-shell__content" role="main">
          <div class="admin-shell__surface">
            <UsersManagement v-if="activeTab === 'users'" />
            <DocumentsManagement v-if="activeTab === 'documents'" />
            <CoursesManagement v-if="activeTab === 'courses'" />
            <BlogPostsManagement v-if="activeTab === 'posts'" />
            <ForumManagement v-if="activeTab === 'forum'" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import UsersManagement from '@/components/admin/UsersManagement.vue'
import DocumentsManagement from '@/components/admin/DocumentsManagement.vue'
import CoursesManagement from '@/components/admin/CoursesManagement.vue'
import BlogPostsManagement from '@/components/admin/BlogPostsManagement.vue'
import ForumManagement from '@/components/admin/ForumManagement.vue'

export default {
  name: 'AdminDashboardView',
  components: {
    UsersManagement,
    DocumentsManagement,
    CoursesManagement,
    BlogPostsManagement,
    ForumManagement
  },
  data() {
    return {
      activeTab: 'users'
    }
  },
  computed: {
    currentTitle() {
      const map = {
        users: 'Quản lý tài khoản người dùng',
        documents: 'Quản lý tài liệu',
        courses: 'Quản lý khóa học',
        posts: 'Quản lý bài viết Blog',
        forum: 'Quản lý diễn đàn'
      }
      return map[this.activeTab] || 'Trang quản lý hệ thống'
    },
    currentSubtitle() {
      const map = {
        users: 'Khóa/mở khóa, xem thông tin người dùng.',
        documents: 'Xóa mềm, khôi phục, xóa vĩnh viễn tài liệu.',
        courses: 'Xóa mềm, khôi phục, xóa vĩnh viễn khóa học.',
        posts: 'Tạo/sửa, xóa mềm, khôi phục, xóa vĩnh viễn bài Blog.',
        forum: 'Xóa mềm, khôi phục, xóa vĩnh viễn bài viết diễn đàn.'
      }
      return map[this.activeTab] || 'Quản trị hệ thống.'
    },
    adminIdentity() {
      const email = localStorage.getItem('userEmail')
      const fullName = localStorage.getItem('userFullName')
      if (fullName && email) return `${fullName} • ${email}`
      return fullName || email || ''
    }
  },
  mounted() {
    // Kiểm tra quyền admin
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    
    if (!token || role !== 'admin') {
      this.$router.push('/administrator')
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userFullName')
      localStorage.removeItem('isLoggedIn')
      this.$router.push('/administrator')
    }
  }
}
</script>

<style scoped>
</style>


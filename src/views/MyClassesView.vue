<template>
  <main class="my-classes-page">
    <section class="container">
      <header class="page-header">
        <h1>Lớp của tôi</h1>
        <p>Quản lý lớp đã đăng ký và lớp đã hoàn thành.</p>
      </header>

      <div v-if="!isLoggedIn" class="empty-state">
        <div class="empty-card">
          <h3>Bạn chưa đăng nhập</h3>
          <p>Vui lòng đăng nhập để xem các lớp đã đăng ký.</p>
          <router-link to="/signin" class="btn primary">Đăng nhập</router-link>
        </div>
      </div>

      <div v-else class="content-grid">
        <section class="card">
          <h2 class="section-title">Đang tham gia</h2>
          <ul class="class-list" v-if="currentClasses.length">
            <li v-for="c in currentClasses" :key="c.id" class="class-item">
              <div>
                <h3 class="title">{{ c.title }}</h3>
                <p class="meta">🗓 {{ c.schedule }} · 💻 {{ c.platform }} · 👨‍🏫 {{ c.teacher }}</p>
              </div>
              <div class="actions">
                <button class="btn primary">Vào lớp</button>
                <button class="btn">Tài liệu</button>
              </div>
            </li>
          </ul>
          <p v-else class="muted">Chưa có lớp nào.</p>
        </section>

        <section class="card">
          <h2 class="section-title">Đã hoàn thành</h2>
          <ul class="class-list" v-if="completedClasses.length">
            <li v-for="c in completedClasses" :key="c.id" class="class-item">
              <div>
                <h3 class="title">{{ c.title }}</h3>
                <p class="meta">🎓 Hoàn thành ngày {{ c.completedAt }}</p>
              </div>
              <div class="actions">
                <button class="btn">Xem chứng nhận</button>
                <button class="btn">Xem lại</button>
              </div>
            </li>
          </ul>
          <p v-else class="muted">Chưa có lớp nào.</p>
        </section>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'MyClassesView',
  data() {
    return {
      isLoggedIn: false,
      currentClasses: [],
      completedClasses: []
    }
  },
  created() {
    const user = localStorage.getItem('user')
    if (user) {
      this.isLoggedIn = true
      // Demo data when logged in
      this.currentClasses = [
        { id: 1, title: 'React từ cơ bản đến nâng cao', schedule: 'Tối 2-4-6', platform: 'Zoom', teacher: 'Nguyễn Minh' },
      ]
      this.completedClasses = [
        { id: 2, title: 'IELTS Speaking Intensive', completedAt: '12/10/2025' }
      ]
    }
  }
}
</script>

<style scoped>
.my-classes-page { padding-top: 100px; }
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.page-header h1 { margin: 0; }
.page-header p { color: #4b5563; }

.empty-state { display: flex; justify-content: center; padding: 40px 0; }
.empty-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; text-align: center; max-width: 520px; }

.content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
.section-title { margin: 0 0 10px 0; }

.class-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.class-item { display: flex; justify-content: space-between; align-items: center; gap: 12px; border: 1px solid #f3f4f6; border-radius: 12px; padding: 12px; }
.title { margin: 0; }
.meta { margin: 4px 0 0 0; color: #6b7280; }
.muted { color: #6b7280; }
.actions { display: flex; gap: 8px; }
.btn { padding: 8px 14px; border-radius: 8px; border: 1px solid #e5e7eb; background: #ffffff; color: #374151; cursor: pointer; }
.btn.primary { background: #4f46e5; color: #ffffff; border-color: #4f46e5; }

@media (max-width: 991px) {
  .content-grid { grid-template-columns: 1fr; }
}
</style>



<template>
  <main class="classes-page">
    <section class="hero">
      <div class="container hero-inner">
        <div>
          <h1>Lớp học trực tuyến</h1>
          <p>Đăng ký lớp học online (tương tự Zoom/Google Meet) theo lịch cố định.</p>
        </div>
        <div class="hero-search">
          <input v-model="search" class="search" placeholder="Tìm lớp, giảng viên, chủ đề...">
        </div>
      </div>
    </section>

    <section class="container">
      <div class="filters">
        <select v-model="selectedTopic" class="select">
          <option value="">Chủ đề</option>
          <option v-for="t in topics" :key="t" :value="t">{{ t }}</option>
        </select>
        <select v-model="selectedLevel" class="select">
          <option value="">Trình độ</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select v-model="selectedSchedule" class="select">
          <option value="">Lịch học</option>
          <option value="Weekday">Ngày trong tuần</option>
          <option value="Weekend">Cuối tuần</option>
          <option value="Evening">Buổi tối</option>
        </select>
      </div>

      <div class="class-grid">
        <article v-for="c in filteredClasses" :key="c.id" class="class-card">
          <div class="class-header">
            <div class="chip">{{ c.topic }}</div>
            <span class="level">{{ c.level }}</span>
          </div>
          <h3 class="title">{{ c.title }}</h3>
          <p class="desc">{{ c.description }}</p>
          <ul class="meta">
            <li>👨‍🏫 {{ c.teacher }}</li>
            <li>🗓 {{ c.schedule }}</li>
            <li>⏱ {{ c.duration }} buổi</li>
            <li>💻 Online qua {{ c.platform }}</li>
          </ul>
          <div class="actions">
            <button class="btn primary" @click="register(c)">Đăng ký</button>
            <button class="btn">Chi tiết</button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'ClassRegisterView',
  data() {
    return {
      search: '',
      selectedTopic: '',
      selectedLevel: '',
      selectedSchedule: '',
      topics: ['Lập trình', 'Ngoại ngữ', 'Kỹ năng mềm', 'Khoa học dữ liệu'],
      classes: [
        { id: 1, title: 'React từ cơ bản đến nâng cao', description: 'Xây dựng ứng dụng SPA hiện đại với React Hooks.', topic: 'Lập trình', level: 'Intermediate', schedule: 'Tối 2-4-6', duration: 12, platform: 'Zoom', teacher: 'Nguyễn Minh' },
        { id: 2, title: 'IELTS Speaking Intensive', description: 'Rèn luyện phản xạ nói và phát âm chuẩn.', topic: 'Ngoại ngữ', level: 'Advanced', schedule: 'Tối 3-5', duration: 10, platform: 'Google Meet', teacher: 'Trần Thu' },
        { id: 3, title: 'Kỹ năng Ghi chú Zettelkasten', description: 'Xây dựng hệ thống kiến thức cá nhân.', topic: 'Kỹ năng mềm', level: 'Beginner', schedule: 'Cuối tuần', duration: 4, platform: 'Zoom', teacher: 'Phạm Anh' },
        { id: 4, title: 'Python cho Khoa học dữ liệu', description: 'Pandas, Numpy, trực quan hoá và dự án nhỏ.', topic: 'Khoa học dữ liệu', level: 'Beginner', schedule: 'Ngày trong tuần', duration: 14, platform: 'Google Meet', teacher: 'Lê Hảo' }
      ]
    }
  },
  computed: {
    filteredClasses() {
      const q = this.search.trim().toLowerCase()
      return this.classes.filter(c =>
        (!this.selectedTopic || c.topic === this.selectedTopic) &&
        (!this.selectedLevel || c.level === this.selectedLevel) &&
        (!this.selectedSchedule || c.schedule.includes(this.selectedSchedule)) &&
        (
          !q ||
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.teacher.toLowerCase().includes(q)
        )
      )
    }
  },
  methods: {
    register(c) {
      const user = localStorage.getItem('user')
      if (!user) {
        alert('Vui lòng đăng nhập để đăng ký lớp')
        return
      }
      alert(`Đã gửi yêu cầu đăng ký: ${c.title}`)
    }
  }
}
</script>

<style scoped>
.classes-page { padding-top: 100px; }
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.hero { background: linear-gradient(135deg, #eef2ff 0%, #ecfeff 100%); }
.hero-inner { display: grid; grid-template-columns: 1fr 420px; gap: 24px; align-items: center; }
.hero h1 { margin: 0 0 8px 0; font-size: 32px; color: #111827; }
.hero p { margin: 0; color: #4b5563; }
.hero-search .search { width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 14px; }

.filters { display: flex; gap: 12px; margin: 16px 0; }
.select { border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; }

.class-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.class-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.class-header { display: flex; justify-content: space-between; align-items: center; }
.chip { display: inline-block; padding: 4px 8px; background: #eef2ff; color: #3730a3; border-radius: 999px; font-size: 12px; }
.level { color: #6b7280; font-size: 12px; }
.title { margin: 0; }
.desc { margin: 0; color: #4b5563; }
.meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding-left: 16px; margin: 6px 0 0 0; }
.meta li { color: #374151; }
.actions { display: flex; gap: 8px; }
.btn { padding: 10px 16px; border-radius: 8px; border: 1px solid #e5e7eb; background: #ffffff; color: #374151; cursor: pointer; }
.btn.primary { background: #4f46e5; color: #ffffff; border-color: #4f46e5; }

@media (max-width: 991px) {
  .hero-inner { grid-template-columns: 1fr; }
  .class-grid { grid-template-columns: 1fr; }
}
</style>



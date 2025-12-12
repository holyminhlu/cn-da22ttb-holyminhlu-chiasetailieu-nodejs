<template>
  <div class="coming-soon-page">
    <div class="coming-soon-content">
      <div class="icon">🚧</div>
      <h1>Tính năng đang phát triển</h1>
      <p>Tính năng này sẽ sớm được ra mắt. Vui lòng quay lại sau!</p>
      <router-link to="/courses" class="btn-back">Quay lại danh sách khóa học</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComingSoonView'
}
</script>

<style scoped>
.coming-soon-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem;
}

.coming-soon-content {
  text-align: center;
  max-width: 500px;
}

.icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.btn-back {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-back:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
</style>









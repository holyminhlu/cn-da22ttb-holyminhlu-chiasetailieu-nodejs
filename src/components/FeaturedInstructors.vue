<template>
  <section class="featured-instructors" aria-label="Giảng viên nổi bật">
    <div class="container">
      <h2 class="section-title">{{ title }}</h2>
      <div class="instructors-grid">
        <article
          v-for="instructor in instructors"
          :key="instructor.id"
          class="instructor-card"
          role="article"
          :aria-label="`Giảng viên ${instructor.name}`"
        >
          <div class="instructor-avatar-wrapper">
            <img
              :src="instructor.avatar || '/img/perfil.jpg'"
              :alt="`Avatar của ${instructor.name}`"
              class="instructor-avatar"
              loading="lazy"
            />
            <div class="instructor-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
          <div class="instructor-info">
            <h3 class="instructor-name">{{ instructor.name }}</h3>
            <div class="instructor-topics">
              <span
                v-for="topic in instructor.topics"
                :key="topic"
                class="topic-tag"
              >
                {{ topic }}
              </span>
            </div>
            <div class="instructor-meta">
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span>{{ instructor.documentCount }} tài liệu</span>
              </div>
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>{{ instructor.rating }}</span>
              </div>
            </div>
          </div>
          <button
            class="view-profile-btn"
            type="button"
            :aria-label="`Xem hồ sơ của ${instructor.name}`"
            @click="viewProfile(instructor)"
          >
            Xem hồ sơ
          </button>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeaturedInstructors',
  props: {
    title: {
      type: String,
      default: 'Giảng viên nổi bật'
    },
    instructors: {
      type: Array,
      required: true
    }
  },
  emits: ['view-profile'],
  setup(props, { emit }) {
    const viewProfile = (instructor) => {
      emit('view-profile', instructor)
    }

    return {
      viewProfile
    }
  }
}
</script>

<style scoped>
.featured-instructors {
  padding: 2rem 0;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 1.5rem;
  text-align: center;
}

.instructors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.instructor-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.instructor-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(29, 78, 216, 0.15);
  border-color: #1d4ed8;
}

.instructor-avatar-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.instructor-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #1d4ed8;
}

.instructor-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: #1d4ed8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(29, 78, 216, 0.3);
}

.instructor-info {
  width: 100%;
  margin-bottom: 1rem;
}

.instructor-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 0.75rem;
}

.instructor-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.topic-tag {
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 6px;
  font-size: 0.875rem;
}

.instructor-meta {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item svg {
  color: #00C2A8;
}

.view-profile-btn {
  padding: 0.625rem 1.75rem;
  background: transparent;
  border: 2px solid #1d4ed8;
  border-radius: 8px;
  color: #1d4ed8;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: auto;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.view-profile-btn:hover {
  background: #1d4ed8;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
}

.view-profile-btn:active {
  transform: translateY(0);
}

.view-profile-btn:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 599px) {
  .instructors-grid {
    grid-template-columns: 1fr;
  }

  .instructor-card {
    padding: 1rem;
  }
}
</style>

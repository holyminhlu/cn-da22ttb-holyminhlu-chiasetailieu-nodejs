<template>
  <section class="hero-section" role="banner">
    <div class="hero-background"></div>
    <div class="container">
      <div class="hero-content" data-aos="fade-up">
        <h1 class="hero-title">
          {{ titleParts.firstPart }}<br v-if="titleParts.lastPart"><span class="hero-title-highlight">{{ titleParts.lastPart }}</span>
        </h1>
        <p class="hero-subtitle">{{ subtitle }}</p>
        
        <!-- Search Bar Slot -->
        <div v-if="$slots.search" class="hero-search">
          <slot name="search"></slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'HeroSection',
  props: {
    title: {
      type: String,
      default: 'Tìm kiếm, Chia sẻ tài liệu và học tập — Miễn phí'
    },
    subtitle: {
      type: String,
      default: 'Slides, đề cương, bài tập và khoá học từ cộng đồng.'
    }
  },
  setup(props) {
    // Split title to put "Miễn phí" on new line
    const titleParts = computed(() => {
      const fullTitle = props.title || ''
      const parts = fullTitle.split(' Miễn phí')
      return {
        firstPart: parts[0],
        lastPart: parts.length > 1 ? 'Miễn phí' : ''
      }
    })

    return {
      titleParts
    }
  }
}
</script>

<style scoped>
.hero-section {
  position: relative;
  padding: 200px 0 80px;
  padding-bottom: 120px;
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  color: white;
  overflow: visible;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.15;
  background-image: 
    radial-gradient(circle at 20% 40%, rgba(255, 255, 255, 0.25) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 40%);
  pointer-events: none;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
  overflow: visible;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  overflow: visible;
}

.hero-title {
  font-size: clamp(2.25rem, 6vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1.5rem;
  color: white;
  letter-spacing: -0.03em;
}

.hero-title-highlight {
  color: #fbbf24;
  display: block;
  margin-top: 0.5rem;
  text-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
}

.hero-subtitle {
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  line-height: 1.7;
  margin-bottom: 2.5rem;
  opacity: 0.95;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  color: rgba(255, 255, 255, 0.95);
  font-weight: var(--font-weight-normal);
}

.hero-search {
  max-width: 850px;
  margin: 0 auto;
  position: relative;
  z-index: 99998;
  overflow: visible;
}

/* Animation */
@media (prefers-reduced-motion: no-preference) {
  .hero-content {
    animation: fadeInUp 0.8s ease-out;
  }
  
  .hero-title {
    animation: fadeInUp 0.8s ease-out 0.1s both;
  }
  
  .hero-subtitle {
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  
  .hero-search {
    animation: fadeInUp 0.8s ease-out 0.3s both;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 959px) {
  .hero-section {
    padding: 160px 0 60px;
    padding-bottom: 100px;
  }
  
  .hero-content {
    max-width: 100%;
  }
}

@media (max-width: 599px) {
  .hero-section {
    padding: 120px 0 50px;
    padding-bottom: 80px;
  }
  
  .hero-title {
    font-size: clamp(1.875rem, 8vw, 2.5rem);
    margin-bottom: 1.25rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  .hero-search {
    max-width: 100%;
  }
}
</style>

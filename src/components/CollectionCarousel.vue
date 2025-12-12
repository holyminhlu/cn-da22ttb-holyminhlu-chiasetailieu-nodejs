<template>
  <section class="collection-carousel" aria-label="Bộ sưu tập nổi bật">
    <div class="container">
      <h2 class="section-title">{{ title }}</h2>
      <div class="carousel-wrapper">
        <div
          ref="carousel"
          class="carousel-track"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div
            v-for="(collection, index) in collections"
            :key="collection.id"
            class="carousel-slide"
            :aria-hidden="index !== currentIndex"
            :tabindex="index === currentIndex ? 0 : -1"
          >
            <div
              class="collection-card"
              role="button"
              :aria-label="`Xem bộ sưu tập ${collection.title}`"
              @click="selectCollection(collection)"
              @keydown.enter="selectCollection(collection)"
              @keydown.space.prevent="selectCollection(collection)"
            >
              <div class="collection-image-wrapper">
                <img
                  :src="collection.cover || '/img/articles/default-collection.jpg'"
                  :alt="`${collection.title} collection cover`"
                  class="collection-image"
                  loading="lazy"
                />
                <div class="collection-overlay"></div>
              </div>
              <div class="collection-info">
                <h3 class="collection-title">{{ collection.title }}</h3>
                <p v-if="collection.description" class="collection-description">
                  {{ collection.description }}
                </p>
                <div v-if="collection.count !== undefined" class="collection-meta">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span>{{ collection.count }} tài liệu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <button
          v-if="collections.length > 1"
          class="carousel-nav prev"
          type="button"
          aria-label="Bộ sưu tập trước"
          @click="navigate(-1)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          v-if="collections.length > 1"
          class="carousel-nav next"
          type="button"
          aria-label="Bộ sưu tập tiếp theo"
          @click="navigate(1)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <!-- Indicators -->
        <div v-if="collections.length > 1" class="carousel-indicators" role="tablist" aria-label="Carousel indicators">
          <button
            v-for="(collection, index) in collections"
            :key="collection.id"
            :class="['indicator', { active: index === currentIndex }]"
            type="button"
            role="tab"
            :aria-selected="index === currentIndex"
            :aria-label="`Go to slide ${index + 1}`"
            @click="goToSlide(index)"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'CollectionCarousel',
  props: {
    title: {
      type: String,
      default: 'Bộ sưu tập nổi bật'
    },
    collections: {
      type: Array,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    autoplayInterval: {
      type: Number,
      default: 5000
    }
  },
  emits: ['select-collection'],
  setup(props, { emit }) {
    const currentIndex = ref(0)
    const carousel = ref(null)
    const touchStartX = ref(0)
    const touchEndX = ref(0)
    let autoplayTimer = null

    const navigate = (direction) => {
      const newIndex = currentIndex.value + direction
      if (newIndex < 0) {
        currentIndex.value = props.collections.length - 1
      } else if (newIndex >= props.collections.length) {
        currentIndex.value = 0
      } else {
        currentIndex.value = newIndex
      }
    }

    const goToSlide = (index) => {
      currentIndex.value = index
    }

    const selectCollection = (collection) => {
      emit('select-collection', collection)
    }

    // Touch handlers for swipe
    const handleTouchStart = (e) => {
      touchStartX.value = e.touches[0].clientX
    }

    const handleTouchMove = (e) => {
      touchEndX.value = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      if (touchStartX.value - touchEndX.value > 50) {
        navigate(1) // Swipe left - next
      } else if (touchEndX.value - touchStartX.value > 50) {
        navigate(-1) // Swipe right - prev
      }
    }

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        navigate(-1)
      } else if (e.key === 'ArrowRight') {
        navigate(1)
      }
    }

    onMounted(() => {
      if (props.autoplay) {
        autoplayTimer = setInterval(() => {
          navigate(1)
        }, props.autoplayInterval)
      }
      
      if (carousel.value) {
        carousel.value.addEventListener('keydown', handleKeyDown)
      }
    })

    onUnmounted(() => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer)
      }
      if (carousel.value) {
        carousel.value.removeEventListener('keydown', handleKeyDown)
      }
    })

    return {
      currentIndex,
      carousel,
      navigate,
      goToSlide,
      selectCollection,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    }
  }
}
</script>

<style scoped>
.collection-carousel {
  padding: 4rem 0;
  background: #f8fafc;
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

.carousel-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
  border-radius: 10px;
  isolation: isolate;
}

.carousel-track {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  box-sizing: border-box;
}

.carousel-slide {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.collection-card {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.collection-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(29, 78, 216, 0.15);
  border-color: rgba(29, 78, 216, 0.2);
}

.collection-card:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 4px;
}

.collection-image-wrapper {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  flex-shrink: 0;
}

.collection-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s;
  display: block;
}

.collection-card:hover .collection-image {
  transform: scale(1.1);
}

.collection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.7) 100%);
}

.collection-info {
  padding: 1.5rem;
  position: relative;
  z-index: 1;
}

.collection-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.5rem;
}

.collection-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.collection-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.collection-meta svg {
  color: #00C2A8;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: all 0.3s;
  color: #0F172A;
}

.carousel-nav:hover {
  background: #1d4ed8;
  color: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 16px rgba(29, 78, 216, 0.3);
}

.carousel-nav:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}

.carousel-nav.prev {
  left: 1rem;
}

.carousel-nav.next {
  right: 1rem;
}

.carousel-indicators {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  padding: 1.5rem 0;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #1d4ed8;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.indicator.active {
  background: #1d4ed8;
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(29, 78, 216, 0.4);
}

.indicator:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 959px) {
  .carousel-nav {
    display: none;
  }

  .collection-image-wrapper {
    height: 250px;
  }
}

@media (max-width: 599px) {
  .collection-carousel {
    padding: 1.5rem 0;
  }

  .collection-image-wrapper {
    height: 200px;
  }

  .collection-info {
    padding: 1rem;
  }

  .collection-title {
    font-size: 1.25rem;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    transition: none;
  }

  .collection-card,
  .collection-image,
  .carousel-nav {
    transition: none;
  }
}
</style>

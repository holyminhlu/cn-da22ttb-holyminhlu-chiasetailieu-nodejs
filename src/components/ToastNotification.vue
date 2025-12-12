<template>
  <teleport to="body">
    <transition-group name="toast" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
        role="alert"
        :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
      >
        <div class="toast-icon">
          <svg v-if="toast.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <svg v-else-if="toast.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <div class="toast-content">
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button
          class="toast-close"
          type="button"
          aria-label="Đóng thông báo"
          @click="removeToast(toast.id)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </transition-group>
  </teleport>
</template>

<script>
import { ref, onMounted } from 'vue'

let toastId = 0

export default {
  name: 'ToastNotification',
  setup() {
    const toasts = ref([])

    const showToast = (message, type = 'info', duration = 3000) => {
      const id = toastId++
      const toast = {
        id,
        message,
        type
      }
      toasts.value.push(toast)

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    }

    const removeToast = (id) => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index > -1) {
        toasts.value.splice(index, 1)
      }
    }

    // Expose methods via provide/inject or global
    onMounted(() => {
      window.$toast = {
        show: showToast,
        success: (msg, duration) => showToast(msg, 'success', duration),
        error: (msg, duration) => showToast(msg, 'error', duration),
        info: (msg, duration) => showToast(msg, 'info', duration)
      }
    })

    return {
      toasts,
      removeToast
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  width: 100%;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  border-left: 4px solid;
}

.toast-success {
  border-left-color: #10b981;
}

.toast-error {
  border-left-color: #ef4444;
}

.toast-info {
  border-left-color: #0B6EFD;
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-info .toast-icon {
  color: #0B6EFD;
}

.toast-content {
  flex: 1;
}

.toast-message {
  margin: 0;
  color: #0F172A;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.toast-close {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
  margin-top: -0.125rem;
}

.toast-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.toast-close:focus-visible {
  outline: 2px solid #0B6EFD;
  outline-offset: 2px;
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive */
@media (max-width: 599px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active {
    transition: opacity 0.2s;
  }

  .toast-enter-from,
  .toast-leave-to {
    transform: none;
  }
}
</style>

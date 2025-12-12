<template>
  <Teleport to="body">
    <transition name="toast">
      <div
        v-if="show"
        :class="['toast', `toast-${type}`]"
        role="alert"
        aria-live="polite"
      >
        <p class="toast-message">{{ message }}</p>
        <button
          class="toast-close"
          @click="$emit('close')"
          aria-label="Đóng thông báo"
        >
          ×
        </button>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: 'ToastNotification',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close']
}
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  min-width: 300px;
  max-width: 500px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  z-index: 10000;
  animation: slideIn 0.3s ease-out;
}

.toast-success {
  background: #10B981;
  color: white;
}

.toast-error {
  background: #EF4444;
  color: white;
}

.toast-info {
  background: #0B6EFD;
  color: white;
}

.toast-warning {
  background: #F59E0B;
  color: white;
}

.toast-message {
  margin: 0;
  flex: 1;
}

.toast-close {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease-out;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 599px) {
  .toast {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
  }
}
</style>


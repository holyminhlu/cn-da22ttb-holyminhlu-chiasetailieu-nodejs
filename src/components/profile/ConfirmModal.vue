<template>
  <Teleport to="body">
    <transition name="modal">
      <div
        v-if="show"
        class="modal-overlay"
        @click.self="$emit('cancel')"
        @keydown.esc="$emit('cancel')"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title"
      >
        <div class="modal-content" :class="`modal-${type}`">
          <h2 :id="title" class="modal-title">{{ title }}</h2>
          <p class="modal-message">{{ message }}</p>
          <div class="modal-actions">
            <button class="btn-secondary" @click="$emit('cancel')">Hủy</button>
            <button :class="['btn-confirm', `btn-${type}`]" @click="$emit('confirm')">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'danger',
      validator: (value) => ['danger', 'warning', 'info'].includes(value)
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'cancel']
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 1rem 0;
}

.modal-message {
  color: #64748B;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-secondary,
.btn-confirm {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-secondary {
  background: #F1F5F9;
  color: #0F172A;
}

.btn-secondary:hover {
  background: #E2E8F0;
}

.btn-danger {
  background: #EF4444;
  color: white;
}

.btn-danger:hover {
  background: #DC2626;
}

.btn-warning {
  background: #F59E0B;
  color: white;
}

.btn-warning:hover {
  background: #D97706;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>













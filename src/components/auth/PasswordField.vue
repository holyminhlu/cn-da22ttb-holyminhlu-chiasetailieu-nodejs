<template>
  <div class="password-field">
    <label v-if="label" :for="id" class="password-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="password-wrapper" :class="{ 'has-error': error }">
      <input
        :id="id"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="error ? `${id}-error` : undefined"
        :aria-pressed="showPassword ? 'true' : 'false'"
        class="password-input"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      <button
        type="button"
        class="password-toggle"
        @click="togglePassword"
        :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'"
        :aria-pressed="showPassword ? 'true' : 'false'"
        tabindex="0"
      >
        <span v-if="showPassword" aria-hidden="true">🙈</span>
        <span v-else aria-hidden="true">👁️</span>
      </button>
    </div>
    <div v-if="error" :id="`${id}-error`" class="error-message" role="alert">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PasswordField',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  setup() {
    const showPassword = ref(false)

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    return {
      showPassword,
      togglePassword
    }
  }
}
</script>

<style scoped>
.password-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.password-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0F172A;
}

.required {
  color: #EF4444;
  margin-left: 0.25rem;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 3rem;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 1rem;
  background: #FFFFFF;
  color: #0F172A;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.password-input:focus {
  outline: none;
  border-color: #0B6EFD;
  box-shadow: 0 0 0 3px rgba(11, 110, 253, 0.1);
}

.password-input:disabled {
  background: #F1F5F9;
  cursor: not-allowed;
  opacity: 0.6;
}

.password-wrapper.has-error .password-input {
  border-color: #EF4444;
}

.password-wrapper.has-error .password-input:focus {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
  transition: color 0.2s;
  border-radius: 4px;
}

.password-toggle:hover {
  color: #0F172A;
  background: #F1F5F9;
}

.password-toggle:focus {
  outline: 2px solid #0B6EFD;
  outline-offset: 2px;
}

.password-toggle span {
  font-size: 1.125rem;
  display: block;
}

.error-message {
  font-size: 0.875rem;
  color: #EF4444;
  margin-top: 0.25rem;
}
</style>













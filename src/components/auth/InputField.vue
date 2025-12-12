<template>
  <div class="input-field">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="input-wrapper" :class="{ 'has-error': error, 'has-icon': icon }">
      <span v-if="icon" class="input-icon" :aria-hidden="true">{{ icon }}</span>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="error ? `${id}-error` : undefined"
        class="input"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
    </div>
    <div v-if="error" :id="`${id}-error`" class="error-message" role="alert">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputField',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
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
    icon: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue', 'blur', 'focus']
}
</script>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0F172A;
}

.required {
  color: #EF4444;
  margin-left: 0.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper.has-icon .input {
  padding-left: 2.5rem;
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  font-size: 1.125rem;
  pointer-events: none;
  z-index: 1;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 1rem;
  background: #FFFFFF;
  color: #0F172A;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input:focus {
  outline: none;
  border-color: #0B6EFD;
  box-shadow: 0 0 0 3px rgba(11, 110, 253, 0.1);
}

.input:disabled {
  background: #F1F5F9;
  cursor: not-allowed;
  opacity: 0.6;
}

.input-wrapper.has-error .input {
  border-color: #EF4444;
}

.input-wrapper.has-error .input:focus {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  font-size: 0.875rem;
  color: #EF4444;
  margin-top: 0.25rem;
}
</style>













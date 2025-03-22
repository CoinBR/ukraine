<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h3>Authentication Required</h3>
        <p>Enter your authentication code for {{ service.title }}</p>

        <form @submit.prevent="submitCode">
          <input
            type="text"
            v-model="code"
            placeholder="Enter 6-digit code"
            maxlength="6"
            ref="codeInput"
            autocomplete="one-time-code"
          >

          <p v-if="error" class="error-message">{{ error }}</p>

          <div class="modal-actions">
            <button type="button" @click.stop="$emit('close')">Cancel</button>
            <button type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Verifying...' : 'Verify' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue'
import { useToast } from "vue-toastification"
import { SanitizedService } from '@/types'

export default defineComponent({
  name: 'TOTPModal',
  props: {
    service: {
      type: Object as PropType<SanitizedService>,
      required: true
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const code = ref<string>('')
    const error = ref<string>('')
    const isSubmitting = ref<boolean>(false)
    const codeInput = ref<HTMLInputElement | null>(null)
    const toast = useToast()

    onMounted(() => {
      setTimeout(() => {
        codeInput.value?.focus()
      }, 100)
    })

    const submitCode = async (): Promise<void> => {
      if (code.value.length < 6) {
        error.value = 'Please enter a 6-digit code'
        return
      }

      isSubmitting.value = true

      try {
        emit('submit', code.value)
      } catch (err) {
        error.value = 'Invalid authentication code'
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      code,
      error,
      isSubmitting,
      codeInput,
      submitCode
    }
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it's above everything else */
}

.modal-content {
  background-color: var(--bg-secondary);
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 25rem;
  box-shadow: 0 0.625rem 1.5625rem rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10000;
}

.modal-content h3 {
  margin-top: 0;
}

.modal-content input {
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  background-color: var(--card-bg);
  border: 0.0625rem solid var(--border-color);
  color: var(--text-primary);
  border-radius: 0.25rem;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
}

.modal-actions button[type="button"] {
  background-color: transparent;
  border: 0.0625rem solid var(--border-color);
  color: var(--text-primary);
}

.modal-actions button[type="submit"] {
  background-color: var(--accent);
  border: none;
  color: white;
}

.modal-actions button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #ff6b6b;
  margin-top: 0.5rem;
}
</style>


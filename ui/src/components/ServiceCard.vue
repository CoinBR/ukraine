<template>
  <div
    class="service-card"
    @click="handleCardClick"
    :class="{
      'is-group': service.nested,
      'requires-auth': service.requiresAuth && !service.nested
    }"
  >
    <div class="card-icon">
      <img :src="iconPath" :alt="`${service.title} icon`" @error="handleImageError">
    </div>

    <div class="card-content">
      <h3>{{ service.title }}</h3>

      <div class="card-indicator">
        <span v-if="service.nested" class="indicator group">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1rem" height="1rem" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/>
          </svg>
          Group
        </span>
        <span v-else-if="service.requiresAuth" class="indicator auth">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1rem" height="1rem" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          Auth Required
        </span>
        <span v-else class="indicator direct">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1rem" height="1rem" fill="currentColor">
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
          </svg>
          Direct Access
        </span>
      </div>
    </div>

    <TOTPModal
      v-if="showModal"
      :service="service"
      @close="showModal = false"
      @submit="handleTOTPSubmit"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification"
import TOTPModal from './TOTPModal.vue'
import { accessService } from '@/services/api'
import { SanitizedService } from '@/types'

export default defineComponent({
  name: 'ServiceCard',
  components: {
    TOTPModal
  },
  props: {
    service: {
      type: Object as PropType<SanitizedService>,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const toast = useToast()
    const showModal = ref<boolean>(false)
    const useDefaultIcon = ref<boolean>(false)

    const iconPath = computed((): string => {
      if (useDefaultIcon.value) {
        return '/icons/default_icon.png'
      }

      // Generates icon filename from service title
      // Example: service.title = "API Documentation" → iconFilename = "api_documentation_icon.png"
      // Place this file in the public/icons/ directory
      const iconFilename = props.service.title
        .toLowerCase()
        .replace(/\s+/g, '_')
        .concat('_icon.png')
      return `/icons/${iconFilename}`
    })

    const handleImageError = (): void => {
      useDefaultIcon.value = true
    }

    const handleCardClick = (): void => {
      if (props.service.nested) {
        // Navigate to nested services view
        router.push(`/services/${encodeURIComponent(props.service.title)}`)
      } else if (props.service.requiresAuth) {
        // Requires authentication - show TOTP modal
        showModal.value = true
      } else {
        // Direct access
        handleDirectAccess()
      }
    }

    const handleDirectAccess = async (): Promise<void> => {
      try {
        const response = await accessService(props.service.title, null)

        if (response.success && response.url) {
          window.open(response.url, '_blank')
        } else {
          toast.error(response.message || 'Failed to access service')
        }
      } catch (error) {
        toast.error('Error connecting to service')
      }
    }

    const handleTOTPSubmit = async (code: string): Promise<void> => {
      try {
        const response = await accessService(props.service.title, code)

        if (response.success && response.url) {
          window.open(response.url, '_blank')
          showModal.value = false
          toast.success('Access granted')
        } else {
          toast.error(response.message || 'Authentication failed')
        }
      } catch (error) {
        toast.error('Error verifying authentication code')
      }
    }

    return {
      showModal,
      iconPath,
      handleImageError,
      handleCardClick,
      handleDirectAccess,
      handleTOTPSubmit
    }
  }
})
</script>

<style scoped>
.service-card {
  background-color: var(--card-bg);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 0.0625rem solid var(--border-color);
  position: relative;
  padding-bottom: 0.5rem;
}

.service-card:hover {
  transform: translateY(-0.3125rem);
  box-shadow: 0 0.625rem 1.25rem rgba(0, 0, 0, 0.3);
}

.service-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0.1875rem;
  background-color: var(--accent);
  opacity: 0;
  transition: opacity 0.2s;
}

.service-card:hover::after {
  opacity: 1;
}

.is-group::after {
  background-color: #4cd964;
}

.requires-auth::after {
  background-color: #ff9500;
}

.card-icon {
  padding: 1.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 12rem;
}

.card-icon img {
  max-width: 10rem;
  max-height: 10rem;
  width: auto;
  height: auto;
  object-fit: contain;
}

.card-content {
  padding: 0 1.25rem 1.25rem;
  text-align: center;
}

.card-content h3 {
  margin: 0 0 0.5rem;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
}

.card-indicator {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.indicator {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.indicator svg {
  margin-right: 0.25rem;
}

.indicator.group {
  color: #4cd964;
}

.indicator.auth {
  color: #ff9500;
}

.indicator.direct {
  color: #0a84ff;
}
</style>


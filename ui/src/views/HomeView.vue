<template>
  <div class="home-view">
    <div v-if="loading" class="loading-state">
      <p>Loading services...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadServices" class="retry-button">Retry</button>
    </div>
    <ServiceGrid v-else :services="services" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import ServiceGrid from '@/components/ServiceGrid.vue'
import { fetchServices } from '@/services/api'
import { SanitizedService } from '@/types'

export default defineComponent({
  name: 'HomeView',
  components: {
    ServiceGrid
  },
  setup() {
    const services = ref<SanitizedService[]>([])
    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)

    const loadServices = async (): Promise<void> => {
      loading.value = true
      error.value = null

      try {
        services.value = await fetchServices()
      } catch (err) {
        error.value = 'Failed to load services. Please try again.'
        console.error('Services loading error:', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadServices()
    })

    return {
      services,
      loading,
      error,
      loadServices
    }
  }
})
</script>

<style scoped>
.loading-state, .error-state {
  text-align: center;
  padding: 3rem 1rem;
}

.loading-state p, .error-state p {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.error-state p {
  color: #ff6b6b;
}

.retry-button {
  background-color: var(--accent);
  border: none;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}
</style>


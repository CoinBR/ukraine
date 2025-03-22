<template>
  <div class="nested-view">
    <div v-if="loading" class="loading-state">
      <p>Loading services...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadServices" class="retry-button">Retry</button>
      <router-link to="/" class="back-link">Back to main</router-link>
    </div>
    <div v-else-if="!parentService" class="not-found">
      <p>Service not found or has no nested services.</p>
      <router-link to="/" class="back-link">Back to main</router-link>
    </div>
    <div v-else class="nested-services">
      <div class="header-with-back">
        <router-link to="/" class="back-button">← Back</router-link>
        <h2>{{ parentService.title }}</h2>
      </div>

      <ServiceGrid v-if="parentService.nested" :services="parentService.nested" />
      <p v-else class="empty-message">No services found in this group.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ServiceGrid from '@/components/ServiceGrid.vue'
import { fetchServices } from '@/services/api'
import { SanitizedService } from '@/types'

export default defineComponent({
  name: 'NestedView',
  components: {
    ServiceGrid
  },
  setup() {
    const route = useRoute()
    const services = ref<SanitizedService[]>([])
    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)

    const parentService = computed(() => {
      const decodedTitle = decodeURIComponent(route.params.serviceTitle as string)
      return services.value.find(service => service.title === decodedTitle)
    })

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
      parentService,
      loadServices
    }
  }
})
</script>

<style scoped>
.header-with-back {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.back-button {
  margin-right: 1rem;
  color: var(--text-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
}

.back-button:hover {
  color: var(--accent);
}

h2 {
  margin: 0;
}

.loading-state, .error-state, .not-found {
  text-align: center;
  padding: 3rem 1rem;
}

.loading-state p, .not-found p {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.error-state p {
  color: #ff6b6b;
}

.retry-button, .back-link {
  display: inline-block;
  background-color: var(--accent);
  border: none;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin: 1rem 0.5rem;
  text-decoration: none;
}

.back-link.text {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.empty-message {
  text-align: center;
  margin: 3rem 0;
  color: var(--text-secondary);
  font-style: italic;
}
</style>


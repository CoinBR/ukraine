<template>
  <div class="service-grid">
    <ServiceCard
      v-for="(service, index) in services"
      :key="`service-${index}`"
      :service="service"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ServiceCard from './ServiceCard.vue'
import { SanitizedService } from '@/types'

export default defineComponent({
  name: 'ServiceGrid',
  components: {
    ServiceCard
  },
  props: {
    services: {
      type: Array as PropType<SanitizedService[]>,
      required: true
    }
  }
})
</script>

<style scoped>
.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}
</style>


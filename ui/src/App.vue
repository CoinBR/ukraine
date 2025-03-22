<template>
  <div class="app-container">
    <header>
      <h1 class="title">
        Service Map
        <span class="ukraine-label">Ukraine</span>
      </h1>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>

<style>
:root {
  --ukraine-blue: #0057b7;
  --ukraine-yellow: #ffd700;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin: 0;
  position: relative;
  display: inline-block;
}

.ukraine-label {
  font-size: 1rem;
  font-weight: 600;
  background-color: var(--ukraine-blue);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
  margin-left: 0.75rem;
  position: relative;
  top: -0.75rem;
  letter-spacing: 0.02em;
  border-bottom: 0.2rem solid var(--ukraine-yellow);
}
</style>


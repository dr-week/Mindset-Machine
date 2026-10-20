<script setup lang="ts">
import DashboardView from '@/components/DashboardView.vue'
</script>

<template>
  <main class="app-root">
    <DashboardView />
  </main>
</template>

<style lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.app-root {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 1.5rem;
  padding-bottom: 2rem;
  background-color: $color-bg-base;
}
</style>

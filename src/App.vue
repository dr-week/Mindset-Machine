<script setup lang="ts">
import DashboardView from '@/components/DashboardView.vue'
</script>

<template>
  <!-- This wrapper centers your premium layout on a deep dark backdrop -->
  <main class="min-h-screen bg-zinc-950 text-zinc-100 flex items-start pt-12 justify-center w-full">
    <DashboardView />
  </main>
</template>

<style>
/* Reset any weird default margins Vue added */
body {
  margin: 0;
  padding: 0;
  background-color: #09090b;
}
</style>

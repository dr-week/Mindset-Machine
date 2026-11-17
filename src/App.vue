<script setup lang="ts">
/**
 * App.vue — Root entry point (THIN orchestrator, <30 lines of logic)
 * All layout logic lives in AppShell. This file only mounts the shell.
 */
import { onMounted } from 'vue'
import AppShell from '@/layout/AppShell.vue'
import DashboardView from '@/components/DashboardView.vue'
import { useTasksStore } from '@/store/tasks'
import { nativeMobileBridge } from '@/services/mobile/nativeBridge'

const tasksStore = useTasksStore()

onMounted(async () => {
  await nativeMobileBridge.initializeAutoConnect((bio) => { tasksStore.biometrics = bio })
  if (!tasksStore.aiMotivation) await tasksStore.refreshMotivation()
})
</script>

<template>
  <AppShell>
    <DashboardView />
  </AppShell>
</template>

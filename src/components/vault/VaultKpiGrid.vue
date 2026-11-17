<script setup lang="ts">
defineProps<{
  tasksCount: number
  goalsCount: number
  timetableCount: number
  aiRoadmapsCount: number
}>()
</script>

<template>
  <div class="vault-kpis">
    <div class="kpi-card">
      <span class="val">{{ tasksCount }}</span>
      <span class="lbl">TASKS</span>
    </div>
    <div class="kpi-card">
      <span class="val">{{ goalsCount }}</span>
      <span class="lbl">GOALS</span>
    </div>
    <div class="kpi-card">
      <span class="val">{{ timetableCount }}</span>
      <span class="lbl">TIME BLOCKS</span>
    </div>
    <div class="kpi-card">
      <span class="val">{{ aiRoadmapsCount }}</span>
      <span class="lbl">AI ROADMAPS</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.vault-kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  .kpi-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: $radius-md;
    padding: 12px;
    .val { font-size: 1.25rem; font-weight: 800; color: #fff; }
    .lbl { font-size: 9px; font-weight: 700; color: $color-text-dim; letter-spacing: 0.06em; margin-top: 2px; }
  }
}
</style>

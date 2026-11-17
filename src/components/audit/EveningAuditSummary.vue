<script setup lang="ts">
defineProps<{
  completedCount: number
  completionRate: number
  activeGoalsCount: number
}>()
</script>

<template>
  <div class="audit-summary-strip">
    <div class="stat-cell">
      <span class="stat-num">{{ completedCount }}</span>
      <span class="stat-tag">COMPLETED</span>
    </div>
    <div class="stat-sep"></div>
    <div class="stat-cell">
      <span class="stat-num text-ember">{{ completionRate }}%</span>
      <span class="stat-tag">VELOCITY</span>
    </div>
    <div class="stat-sep"></div>
    <div class="stat-cell">
      <span class="stat-num text-emerald">{{ activeGoalsCount }}</span>
      <span class="stat-tag">ACTIVE GOALS</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.audit-summary-strip {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-md;
  padding: 10px 14px;
  margin-bottom: 16px;

  .stat-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    .stat-num { font-size: 16px; font-weight: 800; color: #fff; }
    .stat-tag { font-size: 8px; font-weight: 700; color: $color-text-dim; letter-spacing: 0.08em; }
  }
  .stat-sep { width: 1px; height: 22px; background: rgba(255, 255, 255, 0.06); }
}
.text-ember { color: #f59e0b; }
.text-emerald { color: #10b981; }
</style>

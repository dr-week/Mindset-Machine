<script setup lang="ts">
defineProps<{
  rate: number
  completedCount: number
  totalCount: number
}>()
</script>

<template>
  <div class="goal-progress-strip">
    <div class="gp-bar-track">
      <div class="gp-bar-fill" :style="{ width: `${rate}%` }"></div>
    </div>
    <span class="gp-meta">{{ completedCount }} of {{ totalCount }} achieved</span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.goal-progress-strip {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .gp-bar-track {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 9999px;
    overflow: hidden;

    .gp-bar-fill {
      height: 100%;
      background: #10b981;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }
  }

  .gp-meta {
    font-size: 10px;
    color: $color-text-dim;
    font-family: $font-mono;
  }
}
</style>

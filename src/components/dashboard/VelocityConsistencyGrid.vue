<script setup lang="ts">
import type { ConsistencyDay } from '@/types/mindset'

defineProps<{
  grid: ConsistencyDay[]
  completedCount: number
}>()
</script>

<template>
  <div class="consistency-strip">
    <div class="cs-header">
      <span class="cs-title">14-DAY CONSISTENCY</span>
      <span class="cs-badge">{{ completedCount }} done</span>
    </div>
    <div class="cs-grid">
      <div
        v-for="day in grid"
        :key="day.date"
        class="cs-block"
        :class="`lvl-${day.level}`"
        :title="`${day.dayLabel} (${day.date}): ${day.count} tasks completed`"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.consistency-strip {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  .cs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .cs-title {
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--color-text-dim, #52525b);
    }
    .cs-badge {
      font-size: 0.65rem;
      color: var(--color-text-muted, #71717a);
    }
  }
}
.cs-grid {
  display: flex;
  gap: 4px;
}
.cs-block {
  flex: 1;
  height: 18px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.2s ease;
  &.lvl-1 { background: rgba(16, 185, 129, 0.3); }
  &.lvl-2 { background: rgba(16, 185, 129, 0.5); }
  &.lvl-3 { background: rgba(16, 185, 129, 0.75); }
  &.lvl-4 { background: #10b981; box-shadow: 0 0 6px rgba(16, 185, 129, 0.4); }
}
</style>

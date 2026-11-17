<script setup lang="ts">
import { TrendingUp } from 'lucide-vue-next'
import type { ConsistencyDay } from '@/types/mindset'

defineProps<{
  grid: ConsistencyDay[]
}>()
</script>

<template>
  <div class="heatmap-section">
    <div class="section-head">
      <div class="head-left">
        <TrendingUp :size="14" class="text-ember" />
        <span>14-DAY KINETIC & COGNITIVE CONSISTENCY</span>
      </div>
      <span class="total-tag">{{ grid.reduce((a, b) => a + b.count, 0) }} total completions</span>
    </div>
    <div class="heatmap-strip">
      <div
        v-for="day in grid"
        :key="day.date"
        class="heatmap-day"
        :title="`${day.dayLabel} (${day.date}): ${day.count} activities`"
      >
        <div class="day-cell" :class="`lvl-${day.level}`"></div>
        <span class="day-label">{{ day.dayLabel }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.heatmap-section {
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md, 8px);
  padding: 16px;
  margin-bottom: 24px;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  .head-left {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-text-secondary, #a1a1aa);
  }
  .total-tag {
    color: var(--color-text-dim, #52525b);
  }
}
.heatmap-strip {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.heatmap-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 24px;
  .day-cell {
    width: 100%;
    height: 28px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.2s ease;
    &.lvl-1 { background: rgba(16, 185, 129, 0.25); border-color: rgba(16, 185, 129, 0.4); }
    &.lvl-2 { background: rgba(16, 185, 129, 0.45); border-color: rgba(16, 185, 129, 0.6); }
    &.lvl-3 { background: rgba(16, 185, 129, 0.7); border-color: rgba(16, 185, 129, 0.85); }
    &.lvl-4 { background: #10b981; border-color: #34d399; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
  }
  .day-label {
    font-size: 0.65rem;
    color: var(--color-text-dim, #52525b);
  }
}
.text-ember { color: #f59e0b; }
</style>

<script setup lang="ts">
import { CheckCircle2, Zap, Heart, Footprints } from 'lucide-vue-next'

defineProps<{
  summary: {
    totalActions: number
    completedTasksToday: number
    completedHabitsToday: number
    completedBlocksToday: number
    estimatedFocusMinutes: number
    recovery: number
    steps: number
  }
  restingHeartRate: number
}>()
</script>

<template>
  <div class="telemetry-grid">
    <div class="telemetry-card">
      <div class="t-top">
        <span class="t-label">EXECUTED ACTIONS</span>
        <CheckCircle2 :size="15" class="text-emerald" />
      </div>
      <div class="t-num">{{ summary.totalActions }}</div>
      <div class="t-sub">{{ summary.completedTasksToday }} tasks • {{ summary.completedHabitsToday }} habits • {{ summary.completedBlocksToday }} blocks</div>
    </div>

    <div class="telemetry-card">
      <div class="t-top">
        <span class="t-label">DEEP FOCUS TIME</span>
        <Zap :size="15" class="text-ember" />
      </div>
      <div class="t-num">{{ summary.estimatedFocusMinutes }} <small>min</small></div>
      <div class="t-sub">Estimated neuro-focus allocation</div>
    </div>

    <div class="telemetry-card">
      <div class="t-top">
        <span class="t-label">RECOVERY READINESS</span>
        <Heart :size="15" class="text-ember" />
      </div>
      <div class="t-num">{{ summary.recovery }}%</div>
      <div class="t-sub">Resting HR: {{ restingHeartRate }} BPM</div>
    </div>

    <div class="telemetry-card">
      <div class="t-top">
        <span class="t-label">KINETIC DISCIPLINE</span>
        <Footprints :size="15" class="text-emerald" />
      </div>
      <div class="t-num">{{ summary.steps.toLocaleString() }}</div>
      <div class="t-sub">Daily movement count</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.telemetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}
.telemetry-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md, 8px);
  padding: 14px;
  .t-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .t-label {
      font-size: 0.65rem;
      letter-spacing: 0.06em;
      color: var(--color-text-muted, #71717a);
      font-weight: 700;
    }
  }
  .t-num {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-text-primary, #ffffff);
    margin-bottom: 4px;
    small {
      font-size: 0.8rem;
      color: var(--color-text-muted, #71717a);
    }
  }
  .t-sub {
    font-size: 0.7rem;
    color: var(--color-text-dim, #52525b);
  }
}
.text-emerald { color: #10b981; }
.text-ember { color: #f59e0b; }
</style>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  taskCompletionRate: number
}>()

const circleRadius = 46
const circumference = 2 * Math.PI * circleRadius
const strokeDashoffset = computed(() => {
  const progress = Math.min(Math.max(props.taskCompletionRate / 100, 0), 1)
  return circumference * (1 - progress)
})
</script>

<template>
  <div class="gauge-center">
    <div class="gauge-stage">
      <svg class="gauge-svg" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="emberGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff7a45" />
            <stop offset="100%" stop-color="#ff5722" />
          </linearGradient>
        </defs>
        <circle class="gauge-track" cx="60" cy="60" :r="circleRadius" stroke-width="7" />
        <circle
          class="gauge-bar"
          cx="60"
          cy="60"
          :r="circleRadius"
          stroke-width="7"
          :style="{
            strokeDasharray: `${circumference}`,
            strokeDashoffset: `${strokeDashoffset}`
          }"
        />
      </svg>
      <div class="gauge-info">
        <span class="gauge-num">{{ taskCompletionRate }}<small>%</small></span>
        <span class="gauge-sub">VELOCITY</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gauge-center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0 6px;
}
.gauge-stage {
  position: relative;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gauge-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.gauge-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.05);
}
.gauge-bar {
  fill: none;
  stroke: url(#emberGlowGrad);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.gauge-info {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.gauge-num {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-text-primary, #ffffff);
  line-height: 1;
  small {
    font-size: 0.75rem;
    font-weight: 600;
  }
}
.gauge-sub {
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-text-muted, #71717a);
  margin-top: 2px;
}
</style>

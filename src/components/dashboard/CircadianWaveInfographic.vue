<script setup lang="ts">
import { computed } from 'vue'
import { Zap, Moon, Sun, ArrowUpRight } from 'lucide-vue-next'

const props = defineProps<{ recoveryScore: number; sleepHours: number }>()

const now = new Date()
const currentHour = now.getHours() + now.getMinutes() / 60
const currentX = computed(() => (currentHour / 24) * 240)
const currentY = computed(() => {
  const t = (currentHour / 24) * 2 * Math.PI
  return 32 - (Math.sin(t - 1.2) + 0.45 * Math.sin(2 * t - 1.8)) * 11
})

const currentPhase = computed(() => {
  if (currentHour >= 5 && currentHour < 12) {
    return { name: 'Morning Peak', action: 'Deep Work Focus', icon: Sun, color: 'text-amber' }
  } else if (currentHour >= 12 && currentHour < 15.5) {
    return { name: 'Tactical Dip', action: 'Flow & Tactical Tasks', icon: Zap, color: 'text-blue' }
  } else if (currentHour >= 15.5 && currentHour < 20.5) {
    return { name: 'Second Wave', action: 'Execution & High Output', icon: ArrowUpRight, color: 'text-emerald' }
  } else {
    return { name: 'Recovery Phase', action: 'Audit & Wind-down', icon: Moon, color: 'text-violet' }
  }
})

const dailyGainPercent = computed(() => (1.0 + (props.recoveryScore / 100) * 0.5).toFixed(2))
</script>

<template>
  <div class="circadian-infographic">
    <div class="ci-header">
      <div class="ci-phase">
        <component :is="currentPhase.icon" :size="12" :class="currentPhase.color" />
        <span class="phase-name">{{ currentPhase.name }}</span>
        <span class="phase-action">{{ currentPhase.action }}</span>
      </div>
      <div class="ci-compound-pill" title="Daily incremental compounding (+1% Mindset)">
        <span class="compound-val">+{{ dailyGainPercent }}%</span>
        <span class="compound-label">1% GAIN</span>
      </div>
    </div>

    <div class="ci-curve-container">
      <svg class="ci-svg" viewBox="0 0 240 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="circadianGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ff7a45" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#ff7a45" stop-opacity="0" />
          </linearGradient>
        </defs>
        <rect x="80" y="8" width="40" height="48" fill="rgba(255, 122, 69, 0.06)" rx="4" />
        <path d="M 0,48 Q 40,52 80,24 T 120,38 T 175,20 T 240,48 L 240,58 L 0,58 Z" fill="url(#circadianGrad)" />
        <path d="M 0,48 Q 40,52 80,24 T 120,38 T 175,20 T 240,48" fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.8" />
        <circle :cx="currentX" :cy="currentY" r="4" fill="#ff7a45" />
        <circle :cx="currentX" :cy="currentY" r="7" fill="none" stroke="#ff7a45" stroke-opacity="0.5" stroke-width="1" class="pulse-ring" />
      </svg>
      <div class="ci-time-axis">
        <span>06:00</span>
        <span class="peak-label">PEAK (10:00)</span>
        <span>14:00</span>
        <span>18:00</span>
        <span>22:00</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.circadian-infographic {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: $radius-sm;
  padding: 8px 10px;
  margin-top: 6px;
}
.ci-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .ci-phase {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    .phase-name { font-weight: 700; color: #fff; letter-spacing: 0.04em; }
    .phase-action { color: $color-text-dim; font-size: 9.5px; }
  }
  .ci-compound-pill {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.25);
    border-radius: $radius-xs;
    padding: 1px 6px;
    .compound-val { font-size: 10px; font-weight: 800; color: #34d399; font-family: $font-mono; }
    .compound-label { font-size: 8px; color: #a7f3d0; letter-spacing: 0.06em; font-weight: 600; }
  }
}
.ci-curve-container {
  position: relative;
  width: 100%;
  .ci-svg { width: 100%; height: 40px; display: block; overflow: visible; }
  .ci-time-axis {
    display: flex;
    justify-content: space-between;
    font-size: 8px;
    color: $color-text-dim;
    padding-top: 3px;
    font-family: $font-mono;
    .peak-label { color: rgba(255, 122, 69, 0.85); font-weight: 700; }
  }
}
.pulse-ring { animation: pulse-ring 2s infinite ease-out; transform-origin: center; }
@keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.6); opacity: 0; } }
.text-amber { color: #f59e0b; }
.text-blue { color: #3b82f6; }
.text-emerald { color: #10b981; }
.text-violet { color: #8b5cf6; }
</style>

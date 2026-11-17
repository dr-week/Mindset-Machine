<script setup lang="ts">
import { ref } from 'vue'
import { Activity, Bluetooth, RefreshCw, BarChart2 } from 'lucide-vue-next'
import type { BiometricTelemetry } from '@/types/mindset'
import CircadianWaveInfographic from './CircadianWaveInfographic.vue'

defineProps<{
  biometrics: BiometricTelemetry
  isPairingWearable: boolean
  syncingHealth: boolean
}>()

const emit = defineEmits<{
  (e: 'pair-wearable'): void
  (e: 'disconnect-wearable'): void
  (e: 'sync-health'): void
}>()

const showWave = ref(false)
</script>

<template>
  <div class="biometric-strip">
    <div class="bio-header">
      <div class="bio-title">
        <Activity :size="13" class="text-ember" />
        <span>READINESS & RECOVERY</span>
      </div>
      <div class="bio-actions">
        <button
          @click="showWave = !showWave"
          class="btn-bio-curve"
          :class="{ active: showWave }"
          title="Toggle 1% Mindset Biological Curve Infographic"
          type="button"
        >
          <BarChart2 :size="10" />
          <span>{{ showWave ? 'Curve' : '1% Infographic' }}</span>
        </button>

        <button
          @click="biometrics.device ? emit('disconnect-wearable') : emit('pair-wearable')"
          :disabled="isPairingWearable"
          class="btn-bio-watch"
          :class="{ connected: Boolean(biometrics.device) }"
          :title="biometrics.device ? 'Disconnect Wearable (' + biometrics.device.name + ')' : 'Pair Smartwatch'"
          type="button"
        >
          <Bluetooth :size="10" :class="{ spin: isPairingWearable }" />
          <span>{{ isPairingWearable ? 'Pairing...' : biometrics.device ? biometrics.device.name : 'Pair Watch' }}</span>
        </button>

        <button @click="emit('sync-health')" :disabled="syncingHealth" class="btn-bio-sync" title="Sync Google Fit / Health Connect" type="button">
          <RefreshCw :size="10" :class="{ spin: syncingHealth }" />
          <span>{{ syncingHealth ? 'Syncing...' : 'Sync' }}</span>
        </button>
      </div>
    </div>
    <div class="bio-stats-grid" :class="{ 'has-pulse': Boolean(biometrics.liveHeartRate) }">
      <div class="bio-stat-item"><span class="bio-val text-ember">{{ biometrics.recoveryScore }}%</span><span class="bio-lbl">RECOVERY</span></div>
      <div class="bio-stat-item"><span class="bio-val">{{ biometrics.sleepHours }}h</span><span class="bio-lbl">SLEEP</span></div>
      <div class="bio-stat-item"><span class="bio-val text-emerald">{{ biometrics.stepCount.toLocaleString() }}</span><span class="bio-lbl">STEPS</span></div>
      <div v-if="biometrics.liveHeartRate" class="bio-stat-item pulse-stat">
        <span class="bio-val text-ember animate-pulse">{{ biometrics.liveHeartRate }} <small>BPM</small></span>
        <span class="bio-lbl">PULSE (LIVE)</span>
      </div>
    </div>

    <!-- 1% Biological Mindset Infographic -->
    <CircadianWaveInfographic
      v-if="showWave"
      :recovery-score="biometrics.recoveryScore"
      :sleep-hours="biometrics.sleepHours"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.biometric-strip {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-sm;
  padding: 8px 10px;

  .bio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .bio-title { display: flex; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 700; color: $color-text-dim; letter-spacing: 0.08em; }
    .bio-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      .btn-bio-curve, .btn-bio-watch, .btn-bio-sync {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: $radius-xs;
        color: $color-text-dim;
        font-size: 9px;
        padding: 2px 5px;
        cursor: pointer;
        &:hover { color: #fff; }
        &.active { background: rgba(255, 122, 69, 0.15); border-color: rgba(255, 122, 69, 0.4); color: #ff7a45; }
        &.connected { background: rgba(16, 185, 129, 0.12); border-color: rgba(16, 185, 129, 0.35); color: #34d399; }
        .spin { animation: spin 1s linear infinite; }
      }
    }
  }

  .bio-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    &.has-pulse { grid-template-columns: repeat(4, 1fr); }
    .bio-stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(255, 255, 255, 0.015);
      border-radius: $radius-xs;
      padding: 4px;
      .bio-val { font-size: 13px; font-weight: 700; color: #fff; font-family: $font-mono; small { font-size: 8px; font-weight: 400; } }
      .bio-lbl { font-size: 8px; color: $color-text-dim; }
    }
  }
}

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>

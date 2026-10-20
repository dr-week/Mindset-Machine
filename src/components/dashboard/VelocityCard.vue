<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, Activity, Bluetooth, RefreshCw } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'

const tasksStore = useTasksStore()

const circleRadius = 46
const circumference = 2 * Math.PI * circleRadius
const strokeDashoffset = computed(() => {
  const progress = Math.min(Math.max(tasksStore.taskCompletionRate / 100, 0), 1)
  return circumference * (1 - progress)
})

const deepEnergyCount = computed(() =>
  tasksStore.tasks.filter((t) => t.energy === 'deep' && !t.completed).length,
)
const flowEnergyCount = computed(() =>
  tasksStore.tasks.filter((t) => t.energy === 'flow' && !t.completed).length,
)
const quickEnergyCount = computed(() =>
  tasksStore.tasks.filter((t) => t.energy === 'quick' && !t.completed).length,
)
</script>

<template>
  <section class="bento-box box-velocity zuari-card">
    <div class="box-header">
      <div class="title-with-icon">
        <TrendingUp :size="15" class="text-ember" />
        <span class="box-title">Velocity Index</span>
      </div>
      <span class="box-tag zuari-badge" data-variant="accent">
        <span class="zuari-badge-dot"></span>
        {{ tasksStore.dailyExecutionEfficiency }}% EFFICIENCY
      </span>
    </div>

    <div class="gauge-center">
      <div class="gauge-stage">
        <svg class="gauge-svg" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="emberGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff7a45" />
              <stop offset="100%" stop-color="#ff5722" />
            </linearGradient>
          </defs>
          <circle
            class="gauge-track"
            cx="60"
            cy="60"
            :r="circleRadius"
            stroke-width="7"
          />
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
          <span class="gauge-num">{{ tasksStore.taskCompletionRate }}<small>%</small></span>
          <span class="gauge-sub">VELOCITY</span>
        </div>
      </div>
    </div>

    <div class="gauge-metrics-bar">
      <div class="metric-item">
        <span class="m-val text-emerald">{{ tasksStore.completedTasks.length }}</span>
        <span class="m-label">DONE</span>
      </div>
      <div class="m-div"></div>
      <div class="metric-item">
        <span class="m-val">{{ tasksStore.uncompletedTasks.length }}</span>
        <span class="m-label">QUEUE</span>
      </div>
      <div class="m-div"></div>
      <div class="metric-item">
        <span class="m-val text-ember">{{ tasksStore.activeGoals.length }}</span>
        <span class="m-label">GOALS</span>
      </div>
    </div>

    <div class="cognitive-balance">
      <span class="cb-title">COGNITIVE LOAD</span>
      <div class="cb-bars">
        <div class="cb-pill deep" title="Deep Work items">
          <span class="cb-emoji">⚡</span>
          <span class="cb-name">Deep</span>
          <span class="cb-val">{{ deepEnergyCount }}</span>
        </div>
        <div class="cb-pill flow" title="Flow state items">
          <span class="cb-emoji">🌊</span>
          <span class="cb-name">Flow</span>
          <span class="cb-val">{{ flowEnergyCount }}</span>
        </div>
        <div class="cb-pill quick" title="Quick tactical items">
          <span class="cb-emoji">☕</span>
          <span class="cb-name">Quick</span>
          <span class="cb-val">{{ quickEnergyCount }}</span>
        </div>
      </div>
    </div>

    <!-- Biological Readiness & Health Sync (Huberman Circadian Index + IoT Wearable) -->
    <div class="biometric-strip">
      <div class="bio-header">
        <div class="bio-title">
          <Activity :size="13" class="text-ember" />
          <span>READINESS & RECOVERY</span>
        </div>
        <div class="bio-actions">
          <button
            @click="tasksStore.biometrics.device ? tasksStore.disconnectWearable() : tasksStore.pairWearableDevice()"
            :disabled="tasksStore.isPairingWearable"
            class="btn-bio-watch"
            :class="{ connected: Boolean(tasksStore.biometrics.device) }"
            :title="tasksStore.biometrics.device ? 'Disconnect Wearable (' + tasksStore.biometrics.device.name + ')' : 'Pair Bluetooth / Custom IoT Smartwatch'"
          >
            <Bluetooth :size="10" :class="{ spin: tasksStore.isPairingWearable }" />
            <span>{{
              tasksStore.isPairingWearable
                ? 'Pairing...'
                : tasksStore.biometrics.device
                ? tasksStore.biometrics.device.name
                : 'Pair Watch'
            }}</span>
          </button>

          <button
            @click="tasksStore.syncHealthData()"
            :disabled="tasksStore.syncingHealth"
            class="btn-bio-sync"
            title="Sync Health Connect / Google Fit"
          >
            <RefreshCw :size="10" :class="{ spin: tasksStore.syncingHealth }" />
            <span>{{ tasksStore.syncingHealth ? 'Syncing...' : 'Sync' }}</span>
          </button>
        </div>
      </div>
      <div class="bio-stats-grid">
        <div class="bio-stat-item">
          <span class="bio-val text-ember">{{ tasksStore.biometrics.recoveryScore }}%</span>
          <span class="bio-lbl">RECOVERY</span>
        </div>
        <div class="bio-stat-item">
          <span class="bio-val">{{ tasksStore.biometrics.sleepHours }}h</span>
          <span class="bio-lbl">SLEEP</span>
        </div>
        <div class="bio-stat-item">
          <span class="bio-val text-emerald">{{ tasksStore.biometrics.stepCount.toLocaleString() }}</span>
          <span class="bio-lbl">STEPS</span>
        </div>
        <div v-if="tasksStore.biometrics.liveHeartRate" class="bio-stat-item pulse-stat">
          <span class="bio-val text-ember animate-pulse">{{ tasksStore.biometrics.liveHeartRate }} <small>BPM</small></span>
          <span class="bio-lbl">PULSE (LIVE)</span>
        </div>
      </div>
    </div>

    <!-- 14-Day Visual Consistency Grid (Loop / GitHub style) -->
    <div class="consistency-strip">
      <div class="cs-header">
        <span class="cs-title">14-DAY CONSISTENCY</span>
        <span class="cs-badge">{{ tasksStore.completedTasks.length }} done</span>
      </div>
      <div class="cs-grid">
        <div
          v-for="day in tasksStore.dailyConsistencyGrid"
          :key="day.date"
          class="cs-block"
          :class="`lvl-${day.level}`"
          :title="`${day.dayLabel} (${day.date}): ${day.count} tasks completed`"
        ></div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.box-velocity {
  grid-column: span 4;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(18, 18, 22, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $radius-lg;
  padding: 1.15rem;

  @media (max-width: 900px) {
    grid-column: span 12;
  }
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-with-icon {
    display: flex;
    align-items: center;
    gap: 7px;

    .box-title {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
    }
  }

  .box-tag {
    font-family: $font-mono;
    font-size: 9px;
    letter-spacing: 0.08em;
    padding: 2px 6px;
    border-radius: $radius-xs;
    background: rgba(255, 87, 34, 0.1);
    color: $color-ember;
    font-weight: 600;
  }
}

.gauge-center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0;

  .gauge-stage {
    position: relative;
    width: 120px;
    height: 120px;

    .gauge-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);

      .gauge-track {
        fill: none;
        stroke: rgba(255, 255, 255, 0.05);
      }

      .gauge-bar {
        fill: none;
        stroke: url(#emberGlowGrad);
        stroke-linecap: round;
        transition: stroke-dashoffset 0.6s ease;
      }
    }

    .gauge-info {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;

      .gauge-num {
        font-family: $font-mono;
        font-size: 24px;
        font-weight: 800;
        color: #ffffff;
        line-height: 1;

        small {
          font-size: 13px;
          color: $color-ember;
        }
      }

      .gauge-sub {
        font-family: $font-mono;
        font-size: 8px;
        letter-spacing: 0.12em;
        color: $color-text-dim;
        margin-top: 3px;
      }
    }
  }
}

.gauge-metrics-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: $radius-md;
  padding: 0.5rem 0.25rem;

  .metric-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    .m-val {
      font-family: $font-mono;
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
    }

    .m-label {
      font-family: $font-mono;
      font-size: 8px;
      letter-spacing: 0.08em;
      color: $color-text-dim;
    }
  }

  .m-div {
    width: 1px;
    height: 18px;
    background: rgba(255, 255, 255, 0.06);
  }
}

.cognitive-balance {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  .cb-title {
    font-family: $font-mono;
    font-size: 8.5px;
    letter-spacing: 0.08em;
    color: $color-text-dim;
  }

  .cb-bars {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;

    .cb-pill {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.35rem 0.5rem;
      border-radius: $radius-xs;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);

      .cb-emoji { font-size: 10px; }
      .cb-name {
        font-size: 10px;
        color: $color-text-muted;
      }
      .cb-val {
        font-family: $font-mono;
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
      }
    }
  }
}

// Biological Readiness & Health Sync
.biometric-strip {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0.85rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: $radius-md;

  .bio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .bio-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: $font-mono;
      font-size: 9px;
      letter-spacing: 0.08em;
      color: $color-text-dim;
    }

    .bio-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-bio-watch {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: $radius-pill;
      color: #a78bfa;
      font-size: 9px;
      font-family: $font-mono;
      padding: 2px 7px;
      cursor: pointer;
      transition: all 0.15s ease;
      max-width: 130px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &:hover:not(:disabled) {
        background: rgba(139, 92, 246, 0.2);
        border-color: rgba(139, 92, 246, 0.4);
      }

      &.connected {
        background: rgba(16, 185, 129, 0.12);
        border-color: rgba(16, 185, 129, 0.35);
        color: #34d399;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-bio-sync {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(255, 87, 34, 0.1);
      border: 1px solid rgba(255, 87, 34, 0.25);
      border-radius: $radius-pill;
      color: $color-ember;
      font-size: 9.5px;
      padding: 2px 7px;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover:not(:disabled) {
        background: rgba(255, 87, 34, 0.2);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .bio-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 0.4rem;
    text-align: center;

    .bio-stat-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
      background: rgba(255, 255, 255, 0.02);
      padding: 0.35rem 0.2rem;
      border-radius: $radius-xs;

      &.pulse-stat {
        background: rgba(255, 87, 34, 0.05);
        border: 1px solid rgba(255, 87, 34, 0.15);

        small {
          font-size: 8px;
          opacity: 0.7;
          font-weight: normal;
        }
      }

      .bio-val {
        font-family: $font-mono;
        font-size: 13px;
        font-weight: 700;
        color: #ffffff;
      }

      .bio-lbl {
        font-family: $font-mono;
        font-size: 8px;
        letter-spacing: 0.08em;
        color: $color-text-dim;
      }
    }
  }
}

// 14-Day Consistency Grid (Loop Habit / GitHub style)
.consistency-strip {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.75rem 0.85rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: $radius-md;

  .cs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .cs-title {
      font-family: $font-mono;
      font-size: 8.5px;
      letter-spacing: 0.08em;
      color: $color-text-dim;
    }

    .cs-badge {
      font-family: $font-mono;
      font-size: 8px;
      color: $color-ember;
    }
  }

  .cs-grid {
    display: grid;
    grid-template-columns: repeat(14, 1fr);
    gap: 3px;

    .cs-block {
      aspect-ratio: 1;
      border-radius: 2px;
      transition: transform 0.15s ease;

      &.lvl-0 { background: rgba(255, 255, 255, 0.04); }
      &.lvl-1 { background: rgba(255, 87, 34, 0.25); }
      &.lvl-2 { background: rgba(255, 87, 34, 0.5); }
      &.lvl-3 { background: rgba(255, 87, 34, 0.75); }
      &.lvl-4 {
        background: #ff5722;
        box-shadow: 0 0 6px rgba(255, 87, 34, 0.5);
      }

      &:hover {
        transform: scale(1.2);
      }
    }
  }
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

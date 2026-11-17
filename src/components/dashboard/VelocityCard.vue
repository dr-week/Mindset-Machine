<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import BiometricTelemetryStrip from '@/components/dashboard/BiometricTelemetryStrip.vue'
import VelocityRadialGauge from './VelocityRadialGauge.vue'
import VelocityCognitiveLoad from './VelocityCognitiveLoad.vue'
import VelocityConsistencyGrid from './VelocityConsistencyGrid.vue'

const tasksStore = useTasksStore()

const deepCount = computed(() => tasksStore.tasks.filter((t) => t.energy === 'deep' && !t.completed).length)
const flowCount = computed(() => tasksStore.tasks.filter((t) => t.energy === 'flow' && !t.completed).length)
const quickCount = computed(() => tasksStore.tasks.filter((t) => t.energy === 'quick' && !t.completed).length)
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

    <VelocityRadialGauge :task-completion-rate="tasksStore.taskCompletionRate" />

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

    <VelocityCognitiveLoad
      :deep-count="deepCount"
      :flow-count="flowCount"
      :quick-count="quickCount"
    />

    <BiometricTelemetryStrip
      :biometrics="tasksStore.biometrics"
      :is-pairing-wearable="tasksStore.isPairingWearable"
      :syncing-health="tasksStore.syncingHealth"
      @pair-wearable="tasksStore.pairWearableDevice()"
      @disconnect-wearable="tasksStore.disconnectWearable()"
      @sync-health="tasksStore.syncHealthData()"
    />

    <VelocityConsistencyGrid
      :grid="tasksStore.dailyConsistencyGrid"
      :completed-count="tasksStore.completedTasks.length"
    />
  </section>
</template>

<style scoped lang="scss">
.box-velocity {
  display: flex;
  flex-direction: column;
}
.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.title-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}
.box-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
}
.gauge-metrics-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-sm, 6px);
  padding: 8px 12px;
  margin-top: 8px;
  .metric-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    .m-val {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--color-text-primary, #ffffff);
    }
    .m-label {
      font-size: 0.6rem;
      font-weight: 700;
      color: var(--color-text-dim, #52525b);
      letter-spacing: 0.05em;
    }
  }
  .m-div {
    width: 1px;
    height: 18px;
    background: rgba(255, 255, 255, 0.06);
  }
}
.text-emerald { color: #10b981; }
.text-ember { color: #f59e0b; }
</style>

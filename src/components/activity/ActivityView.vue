<script setup lang="ts">
import { computed } from 'vue'
import { Activity } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import ActivityTelemetryCards from '@/features/activity/components/ActivityTelemetryCards.vue'
import ActivityHeatmapStrip from '@/features/activity/components/ActivityHeatmapStrip.vue'
import ActivityTimelineList from '@/features/activity/components/ActivityTimelineList.vue'

const tasksStore = useTasksStore()
const summary = computed(() => tasksStore.todayActivitySummary)
const events = computed(() => tasksStore.activityTimeline)
</script>

<template>
  <div class="activity-view zuari-card">
    <div class="activity-header">
      <div class="header-left">
        <div class="glyph-pill">
          <Activity :size="20" class="text-ember" />
        </div>
        <div>
          <h2 class="view-title">Daily Activity Telemetry</h2>
          <p class="view-subtitle">Chronological ledger of tasks, circadian habits, focus blocks & biometrics.</p>
        </div>
      </div>

      <div class="live-status-badge">
        <span class="pulsing-dot"></span>
        <span>TELEMETRY ACTIVE</span>
      </div>
    </div>

    <ActivityTelemetryCards
      :summary="summary"
      :resting-heart-rate="tasksStore.biometrics.restingHeartRate"
    />

    <ActivityHeatmapStrip
      :grid="tasksStore.dailyConsistencyGrid"
    />

    <ActivityTimelineList
      :events="events"
    />
  </div>
</template>

<style scoped lang="scss">
.activity-view {
  padding: 1.25rem 1.5rem;
  @media (max-width: 680px) { padding: 1rem 0.85rem; }
}
.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}
.view-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
}
.view-subtitle {
  font-size: 0.8rem;
  color: var(--color-text-muted, #71717a);
}
.live-status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-full, 9999px);
  color: #34d399;
}
.pulsing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}
.text-ember { color: #f59e0b; }
</style>

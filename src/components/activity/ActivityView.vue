<script setup lang="ts">
import { computed } from 'vue'
import {
  Activity,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  Heart,
  Footprints,
  Sparkles,
} from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'

const tasksStore = useTasksStore()

const summary = computed(() => tasksStore.todayActivitySummary)
const events = computed(() => tasksStore.activityTimeline)

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return 'Today'
  }
}
</script>

<template>
  <div class="activity-view zuari-card">
    <!-- Header -->
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

    <!-- Daily High-Level Telemetry Metrics -->
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
        <div class="t-sub">Resting HR: {{ tasksStore.biometrics.restingHeartRate }} BPM</div>
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

    <!-- 14-Day Visual Heatmap Strip -->
    <div class="heatmap-section">
      <div class="section-head">
        <div class="head-left">
          <TrendingUp :size="14" class="text-ember" />
          <span>14-DAY KINETIC & COGNITIVE CONSISTENCY</span>
        </div>
        <span class="total-tag">{{ tasksStore.dailyConsistencyGrid.reduce((a, b) => a + b.count, 0) }} total completions</span>
      </div>
      <div class="heatmap-strip">
        <div
          v-for="day in tasksStore.dailyConsistencyGrid"
          :key="day.date"
          class="heatmap-day"
          :title="`${day.dayLabel} (${day.date}): ${day.count} activities`"
        >
          <div class="day-cell" :class="`lvl-${day.level}`"></div>
          <span class="day-label">{{ day.dayLabel }}</span>
        </div>
      </div>
    </div>

    <!-- Chronological Activity Ledger -->
    <div class="ledger-section">
      <div class="section-head">
        <div class="head-left">
          <Clock :size="14" class="text-ember" />
          <span>CHRONOLOGICAL ACTIVITY STREAM ({{ events.length }})</span>
        </div>
      </div>

      <div v-if="events.length === 0" class="empty-state">
        <Sparkles :size="24" class="text-muted" />
        <p>No activity recorded yet today. Complete tasks, habits, or focus blocks to log telemetry.</p>
      </div>

      <div v-else class="timeline-list">
        <div
          v-for="item in events"
          :key="item.id"
          class="timeline-item"
          :class="`type-${item.type}`"
        >
          <div class="item-time">
            {{ formatTime(item.timestamp) }}
          </div>

          <div class="item-icon-marker">
            <span class="marker-emoji">{{ item.icon }}</span>
          </div>

          <div class="item-content">
            <div class="item-header">
              <span class="item-title">{{ item.title }}</span>
              <span v-if="item.xpDelta" class="item-xp">+{{ item.xpDelta }} XP</span>
            </div>
            <span v-if="item.details" class="item-details">{{ item.details }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--surface, #12141a);
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
  border-radius: 16px;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.glyph-pill {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-high, #fff);
  letter-spacing: -0.01em;
}

.view-subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.82rem;
  color: var(--text-muted, #8e95a5);
}

.live-status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  letter-spacing: 0.05em;
}

.pulsing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse-glow 2s infinite ease-in-out;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

/* Telemetry Cards Grid */
.telemetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.85rem;
}

.telemetry-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}

.t-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.t-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted, #8e95a5);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.t-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
}

.t-num small {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted, #8e95a5);
}

.t-sub {
  font-size: 0.72rem;
  color: var(--text-muted, #8e95a5);
}

/* Heatmap Section */
.heatmap-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.head-left {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-high, #fff);
  text-transform: uppercase;
}

.total-tag {
  font-size: 0.72rem;
  color: var(--text-muted, #8e95a5);
}

.heatmap-strip {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  overflow-x: auto;
  padding: 4px 0;
}

.heatmap-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex: 1;
  min-width: 24px;
}

.day-cell {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.day-cell.lvl-0 { background: rgba(255, 255, 255, 0.05); }
.day-cell.lvl-1 { background: rgba(16, 185, 129, 0.25); }
.day-cell.lvl-2 { background: rgba(16, 185, 129, 0.5); }
.day-cell.lvl-3 { background: rgba(16, 185, 129, 0.75); }
.day-cell.lvl-4 { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }

.day-label {
  font-size: 0.65rem;
  color: var(--text-muted, #8e95a5);
}

/* Timeline Ledger */
.ledger-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  color: var(--text-muted, #8e95a5);
  font-size: 0.85rem;
  text-align: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.95rem;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.timeline-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(2px);
}

.item-time {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--text-muted, #8e95a5);
  min-width: 60px;
}

.item-icon-marker {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.marker-emoji {
  font-size: 0.95rem;
}

.item-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.item-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-high, #fff);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-xp {
  font-size: 0.72rem;
  font-weight: 700;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 1px 6px;
  border-radius: 4px;
}

.item-details {
  font-size: 0.72rem;
  color: var(--text-muted, #8e95a5);
  margin-top: 2px;
}
</style>

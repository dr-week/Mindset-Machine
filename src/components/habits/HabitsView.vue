<script setup lang="ts">
import { computed } from 'vue'
import { Flame, Sun, Sunset, Moon } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import HabitCreatorStrip from '@/components/habits/HabitCreatorStrip.vue'
import HabitPeriodSection from './HabitPeriodSection.vue'

const tasksStore = useTasksStore()

const morningHabits = computed(() => tasksStore.habits.filter((h) => h.period === 'morning'))
const afternoonHabits = computed(() => tasksStore.habits.filter((h) => h.period === 'afternoon'))
const eveningHabits = computed(() => tasksStore.habits.filter((h) => h.period === 'evening'))

const totalHabits = computed(() => tasksStore.habits.length)
const completedTodayCount = computed(() => tasksStore.habits.filter((h) => h.completedToday).length)
const overallConsistency = computed(() => {
  if (totalHabits.value === 0) return 0
  const sum = tasksStore.habits.reduce((acc, h) => acc + h.score, 0)
  return Math.round(sum / totalHabits.value)
})

function handleAddHabit(payload: {
  title: string
  period: 'morning' | 'afternoon' | 'evening'
  emoji: string
  targetDays: number
}): void {
  tasksStore.addHabit(payload.title, payload.period, payload.emoji, payload.targetDays)
}
</script>

<template>
  <div class="habits-view zuari-card">
    <div class="habits-header">
      <div class="header-main">
        <div class="header-glyph-pill">
          <Flame :size="20" class="text-ember" />
        </div>
        <div>
          <h2 class="view-title">Circadian Habit Engine</h2>
          <p class="view-subtitle">Loop-style consistency & biological prime non-negotiables.</p>
        </div>
      </div>

      <div class="metrics-strip">
        <div class="metric-chip">
          <span class="metric-val">{{ completedTodayCount }}/{{ totalHabits }}</span>
          <span class="metric-lbl">Executed Today</span>
        </div>
        <div class="metric-chip">
          <span class="metric-val text-ember">{{ overallConsistency }}%</span>
          <span class="metric-lbl">Overall Consistency</span>
        </div>
      </div>
    </div>

    <HabitCreatorStrip @add-habit="handleAddHabit" />

    <div class="circadian-sections">
      <HabitPeriodSection
        title="Morning Cortisol & Alignment"
        :icon="Sun"
        icon-class="icon-sun"
        :habits="morningHabits"
        @toggle="tasksStore.toggleHabit"
        @delete="tasksStore.deleteHabit"
      />

      <HabitPeriodSection
        title="Afternoon Sustained Focus & Vitality"
        :icon="Sunset"
        icon-class="icon-sunset"
        :habits="afternoonHabits"
        @toggle="tasksStore.toggleHabit"
        @delete="tasksStore.deleteHabit"
      />

      <HabitPeriodSection
        title="Evening Melatonin & Downtime"
        :icon="Moon"
        icon-class="icon-moon"
        :habits="eveningHabits"
        @toggle="tasksStore.toggleHabit"
        @delete="tasksStore.deleteHabit"
      />
    </div>
  </div>
</template>

<style scoped>
.habits-view {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
}
@media (max-width: 680px) {
  .habits-view { padding: 1rem 0.85rem; }
}
.habits-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.header-main { display: flex; align-items: center; gap: 0.75rem; }
.header-glyph-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 87, 34, 0.1);
  border: 1px solid rgba(255, 87, 34, 0.3);
  border-radius: var(--radius-sm, 6px);
}
.view-title { font-size: 1.15rem; font-weight: 700; color: #fff; margin: 0; }
.view-subtitle { font-size: 0.8rem; color: var(--color-text-dim, #71717a); margin: 0.15rem 0 0; }
.metrics-strip { display: flex; gap: 0.75rem; }
.metric-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-xs, 4px);
}
.metric-val { font-size: 0.95rem; font-weight: 700; color: #fff; }
.metric-lbl { font-size: 0.65rem; color: var(--color-text-dim, #71717a); text-transform: uppercase; }
.circadian-sections { display: flex; flex-direction: column; gap: 1.5rem; }
.text-ember { color: #f59e0b; }
.icon-sun { color: #f59e0b; }
.icon-sunset { color: #ff7a45; }
.icon-moon { color: #8b5cf6; }
</style>

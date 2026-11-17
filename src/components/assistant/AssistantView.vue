<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles, Calendar, Bell } from 'lucide-vue-next'
import { useTasksStore } from '@/store/tasks'
import { analyzeDailyRoutine } from '@/services/assistant/routineOptimizer'
import { generateMotivationalNudges } from '@/services/assistant/nudgeEngine'
import { calendarAssistantService } from '@/services/assistant/calendarAssistant'
import { notificationService } from '@/services/assistant/notificationService'
import type { MotivationNudge } from '@/types/assistant'
import AssistantNudgesSection from './AssistantNudgesSection.vue'
import AssistantRoutineSection from './AssistantRoutineSection.vue'

const tasksStore = useTasksStore()

const routineSuggestions = computed(() =>
  analyzeDailyRoutine(
    tasksStore.timetable,
    tasksStore.biometrics,
    tasksStore.dailyExecutionEfficiency
  )
)

const nudges = computed(() => generateMotivationalNudges(tasksStore.uncompletedTasks))

function exportCalendar(): void {
  calendarAssistantService.downloadIcsFile(tasksStore.timetable)
}

async function handleNudgeSelected(nudge: MotivationNudge): Promise<void> {
  await notificationService.requestPermission()
  notificationService.triggerPushToWorkReminder(nudge.headline, nudge.method)
  tasksStore.setTab('tasks')
}

async function enableNotifications(): Promise<void> {
  const granted = await notificationService.requestPermission()
  if (granted) {
    notificationService.sendNotification('Reminders Active', {
      body: 'Mindset Machine will push you before focus windows and keystone tasks.',
    })
  }
}
</script>

<template>
  <div class="assistant-view zuari-card">
    <div class="assistant-header">
      <div class="header-left">
        <div class="glyph-pill">
          <Sparkles :size="20" class="text-ember" />
        </div>
        <div>
          <h2 class="view-title">Personal Assistant & Schedule Optimizer</h2>
          <p class="view-subtitle">Circadian schedule recommendations, psychological work triggers, and calendar sync.</p>
        </div>
      </div>
      <div class="header-actions">
        <button @click="enableNotifications" class="btn-action-notif" title="Enable Work Reminders" type="button">
          <Bell :size="14" />
          <span>Remind Me</span>
        </button>
        <button @click="exportCalendar" class="btn-action-calendar" title="Export .ICS for Google Calendar" type="button">
          <Calendar :size="14" />
          <span>Export Calendar (.ics)</span>
        </button>
      </div>
    </div>

    <AssistantNudgesSection :nudges="nudges" @select-nudge="handleNudgeSelected" />
    <AssistantRoutineSection :suggestions="routineSuggestions" @apply-suggestion="tasksStore.setTab('timetable')" />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.assistant-view {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 680px) { padding: 1rem 0.85rem; }
}
.assistant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  .header-left { display: flex; align-items: center; gap: 12px; }
  .view-title { font-size: 1.25rem; font-weight: 700; color: #fff; margin: 0; }
  .view-subtitle { font-size: 0.8rem; color: $color-text-muted; margin: 0; }
  .header-actions { display: flex; align-items: center; gap: 8px; }
}
.btn-action-notif {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: $radius-sm;
  color: #34d399;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 12px;
  cursor: pointer;
  &:hover { background: rgba(16, 185, 129, 0.25); color: #fff; }
}
.btn-action-calendar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 87, 34, 0.15);
  border: 1px solid rgba(255, 87, 34, 0.35);
  border-radius: $radius-sm;
  color: #ff7a45;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 12px;
  cursor: pointer;
  &:hover { background: rgba(255, 87, 34, 0.25); color: #fff; }
}
.text-ember { color: #f59e0b; }
</style>

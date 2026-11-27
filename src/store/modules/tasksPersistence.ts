import { watch, type Ref } from 'vue'
import { saveStoredState } from '@/data/tasks'
import { playSuccessChime } from '@/services/audioFeedback'
import { triggerHaptic } from '@/services/haptics'
import { storageManager } from '@/services/storage/storageManager'
import type { Task, Goal, QuickNote, DayReview, TimeBlock, Habit, AiSuggestion, BiometricTelemetry } from '@/types/mindset'

export function useTasksPersistence(
  tasks: Ref<Task[]>,
  goals: Ref<Goal[]>,
  notes: Ref<QuickNote[]>,
  reviews: Ref<DayReview[]>,
  timetable: Ref<TimeBlock[]>,
  habits: Ref<Habit[]>,
  aiSuggestedTasks: Ref<AiSuggestion[]>,
  aiMotivation: Ref<string>,
  biometrics: Ref<BiometricTelemetry>
) {
  watch(
    [tasks, goals, notes, reviews, timetable, habits, aiSuggestedTasks, aiMotivation, biometrics],
    () => {
      saveStoredState({
        tasks: tasks.value,
        goals: goals.value,
        notes: notes.value,
        reviews: reviews.value,
        timetable: timetable.value,
        habits: habits.value,
        aiSuggestedTasks: aiSuggestedTasks.value,
        aiMotivation: aiMotivation.value,
        biometrics: biometrics.value,
      })
      storageManager.queueDebouncedSync({
        tasks: tasks.value,
        goals: goals.value,
        habits: habits.value,
        mindsetLogs: [],
      })
    },
    { deep: true }
  )

  function importFromJson(rawJson: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(rawJson)
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid JSON format' }
      }
      if (Array.isArray(parsed.tasks)) tasks.value = parsed.tasks
      if (Array.isArray(parsed.goals)) goals.value = parsed.goals
      if (Array.isArray(parsed.reviews)) reviews.value = parsed.reviews
      if (Array.isArray(parsed.timetable)) timetable.value = parsed.timetable
      if (typeof parsed.aiMotivation === 'string') aiMotivation.value = parsed.aiMotivation

      playSuccessChime()
      void triggerHaptic('heavy')
      return { success: true, message: `Successfully restored ${tasks.value.length} tasks and ${goals.value.length} goals!` }
    } catch (e: unknown) {
      return { success: false, message: (e as Error).message || 'Failed to parse backup JSON' }
    }
  }

  return { importFromJson }
}

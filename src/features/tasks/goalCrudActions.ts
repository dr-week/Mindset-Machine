import { triggerHaptic } from '@/services/haptics'
import { playCheckSound, playSuccessChime } from '@/services/audioFeedback'
import type { Task, Goal } from '@/types/mindset'
import type { Ref } from 'vue'

export function useGoalActions(
  goals: Ref<Goal[]>,
  tasks: Ref<Task[]>,
  lastDeletedGoal: Ref<Goal | null>,
  lastDeletedTask: Ref<Task | null>,
  createGoalEntity: (text: string, category?: 'monumental' | 'quarterly' | 'monthly', targetDate?: string) => Goal,
  setUndoToast: (message: string, durationMs?: number) => void
) {
  function addGoal(
    text: string,
    category: 'monumental' | 'quarterly' | 'monthly' = 'monumental',
    targetDate?: string,
  ): Goal {
    const goal = createGoalEntity(text, category, targetDate)
    goals.value.unshift(goal)
    void triggerHaptic('medium')
    return goal
  }

  function toggleGoal(id: string): void {
    const goal = goals.value.find((g) => g.id === id)
    if (goal) {
      goal.completed = !goal.completed
      goal.updatedAt = new Date().toISOString()
      if (goal.completed) {
        goal.completedAt = goal.updatedAt
        playSuccessChime()
        void triggerHaptic('heavy')
      } else {
        goal.completedAt = undefined
        void triggerHaptic('light')
      }
    }
  }

  function deleteGoal(id: string): void {
    const goalIndex = goals.value.findIndex((g) => g.id === id)
    if (goalIndex !== -1) {
      const deleted = goals.value[goalIndex]
      if (deleted) {
        deleted.deletedAt = new Date().toISOString()
        deleted.updatedAt = deleted.deletedAt
        lastDeletedGoal.value = deleted
        lastDeletedTask.value = null
        goals.value.splice(goalIndex, 1)
        void triggerHaptic('light')
        setUndoToast(`Goal removed: "${deleted.text.slice(0, 22)}..."`, 5000)
      }
    }
  }

  function undoLastDelete(): void {
    if (lastDeletedTask.value) {
      tasks.value.unshift(lastDeletedTask.value)
      lastDeletedTask.value = null
      playCheckSound()
      void triggerHaptic('medium')
      setUndoToast('Task restored', 2000)
    } else if (lastDeletedGoal.value) {
      goals.value.unshift(lastDeletedGoal.value)
      lastDeletedGoal.value = null
      playSuccessChime()
      void triggerHaptic('medium')
      setUndoToast('Goal restored', 2000)
    }
  }

  return {
    addGoal,
    toggleGoal,
    deleteGoal,
    undoLastDelete,
  }
}

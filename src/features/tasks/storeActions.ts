import { triggerHaptic } from '@/services/haptics'
import type { Task, Goal, ActiveTab } from '@/types/mindset'
import type { Ref } from 'vue'
import { useGoalActions } from './goalCrudActions'
import { useTaskCrudActions } from './taskCrudActions'

export function useTasksActions(context: {
  tasks: Ref<Task[]>
  goals: Ref<Goal[]>
  lastDeletedTask: Ref<Task | null>
  lastDeletedGoal: Ref<Goal | null>
  undoToastMessage: Ref<string | null>
  undoTimer: { value: ReturnType<typeof setTimeout> | null }
  currentTab: Ref<ActiveTab>
  taskFilter: Ref<'all' | 'high' | 'deep' | 'flow' | 'quick'>
  createTaskEntity: (opts: { title: string; priority?: 'low' | 'medium' | 'high'; energy?: import('@/types/mindset').EnergyLevel; time?: string }) => Task
  createGoalEntity: (text: string, category?: 'monumental' | 'quarterly' | 'monthly', targetDate?: string) => Goal
}) {
  const {
    tasks,
    goals,
    lastDeletedTask,
    lastDeletedGoal,
    undoToastMessage,
    undoTimer,
    currentTab,
    taskFilter,
    createTaskEntity,
    createGoalEntity,
  } = context

  function setUndoToast(message: string, durationMs = 5000) {
    undoToastMessage.value = message
    if (undoTimer.value) clearTimeout(undoTimer.value)
    undoTimer.value = setTimeout(() => {
      undoToastMessage.value = null
    }, durationMs)
  }

  const { addTask, toggleTask, deleteTask, sweepCompletedTasks } = useTaskCrudActions(
    tasks,
    lastDeletedTask,
    lastDeletedGoal,
    createTaskEntity,
    setUndoToast,
  )

  const { addGoal, toggleGoal, deleteGoal, undoLastDelete } = useGoalActions(
    goals,
    tasks,
    lastDeletedGoal,
    lastDeletedTask,
    createGoalEntity,
    setUndoToast,
  )

  function setFilter(filter: 'all' | 'high' | 'deep' | 'flow' | 'quick'): void {
    taskFilter.value = filter
  }

  function setTab(tab: ActiveTab): void {
    currentTab.value = tab
    void triggerHaptic('light')
  }

  return {
    addTask,
    toggleTask,
    deleteTask,
    addGoal,
    toggleGoal,
    deleteGoal,
    undoLastDelete,
    sweepCompletedTasks,
    setFilter,
    setTab,
    setUndoToast,
  }
}

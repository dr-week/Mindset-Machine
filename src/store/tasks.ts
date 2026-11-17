import { defineStore } from 'pinia'
import { createTaskEntity, createGoalEntity } from '@/data/tasks'
import { useTasksActions } from '@/features/tasks/storeActions'
import { useLifeCycleActions } from '@/features/timetable/lifecycleActions'
import { useIntegrationsActions } from '@/features/dashboard/integrationsActions'
import { useTasksState } from './modules/tasksState'
import { useTasksGetters } from './modules/tasksGetters'
import { useTasksPersistence } from './modules/tasksPersistence'

export const useTasksStore = defineStore('tasks', () => {
  const state = useTasksState()

  const getters = useTasksGetters(
    state.tasks,
    state.goals,
    state.habits,
    state.timetable,
    state.reviews,
    state.biometrics,
    state.taskFilter
  )

  const { importFromJson } = useTasksPersistence(
    state.tasks,
    state.goals,
    state.notes,
    state.reviews,
    state.timetable,
    state.habits,
    state.aiSuggestedTasks,
    state.aiMotivation,
    state.biometrics
  )

  const taskActions = useTasksActions({
    tasks: state.tasks,
    goals: state.goals,
    lastDeletedTask: state.lastDeletedTask,
    lastDeletedGoal: state.lastDeletedGoal,
    undoToastMessage: state.undoToastMessage,
    undoTimer: state.undoTimer,
    currentTab: state.currentTab,
    taskFilter: state.taskFilter,
    createTaskEntity,
    createGoalEntity,
  })

  const lifecycleActions = useLifeCycleActions({
    timetable: state.timetable,
    habits: state.habits,
    notes: state.notes,
    reviews: state.reviews,
    biometrics: state.biometrics,
    completedTasksCount: () => getters.completedTasks.value.length,
    taskCompletionRate: () => getters.taskCompletionRate.value,
  })

  const integrationActions = useIntegrationsActions({
    tasks: state.tasks,
    goals: state.goals,
    aiSuggestedTasks: state.aiSuggestedTasks,
    aiMotivation: state.aiMotivation,
    biometrics: state.biometrics,
    loadingAi: state.loadingAi,
    syncingHealth: state.syncingHealth,
    isPairingWearable: state.isPairingWearable,
    uncompletedTasks: getters.uncompletedTasks,
    addTask: taskActions.addTask,
    setUndoToast: taskActions.setUndoToast,
  })

  return {
    ...state,
    ...getters,
    importFromJson,
    ...taskActions,
    ...lifecycleActions,
    ...integrationActions,
  }
})

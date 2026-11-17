import { ref } from 'vue'
import { loadStoredState } from '@/data/tasks'
import type {
  Task,
  Goal,
  AiSuggestion,
  ActiveTab,
  BiometricTelemetry,
  TimeBlock,
  Habit,
  QuickNote,
  DayReview,
} from '@/types/mindset'

export function useTasksState() {
  const storedState = loadStoredState()

  const tasks = ref<Task[]>(storedState.tasks)
  const goals = ref<Goal[]>(storedState.goals)
  const reviews = ref<DayReview[]>(storedState.reviews || [])
  const notes = ref<QuickNote[]>(storedState.notes || [])
  const timetable = ref<TimeBlock[]>(storedState.timetable || [])
  const habits = ref<Habit[]>(storedState.habits || [])
  const biometrics = ref<BiometricTelemetry>(
    storedState.biometrics || {
      sleepHours: 7.5,
      deepSleepPercent: 21,
      restingHeartRate: 59,
      recoveryScore: 84,
      stepCount: 8420,
      lastSyncedAt: new Date().toISOString(),
      source: 'simulated',
    }
  )
  const aiSuggestedTasks = ref<AiSuggestion[]>(storedState.aiSuggestedTasks)
  const aiMotivation = ref<string>(storedState.aiMotivation)
  const loadingAi = ref<boolean>(false)
  const syncingHealth = ref<boolean>(false)
  const isPairingWearable = ref<boolean>(false)
  const useMockData = ref<boolean>(false)
  const currentTab = ref<ActiveTab>('dashboard')
  const taskFilter = ref<'all' | 'high' | 'deep' | 'flow' | 'quick'>('all')

  const undoToastMessage = ref<string | null>(null)
  const lastDeletedTask = ref<Task | null>(null)
  const lastDeletedGoal = ref<Goal | null>(null)
  const undoTimer = { value: null as ReturnType<typeof setTimeout> | null }

  return {
    tasks,
    goals,
    reviews,
    notes,
    timetable,
    habits,
    biometrics,
    aiSuggestedTasks,
    aiMotivation,
    loadingAi,
    syncingHealth,
    isPairingWearable,
    useMockData,
    currentTab,
    taskFilter,
    undoToastMessage,
    lastDeletedTask,
    lastDeletedGoal,
    undoTimer,
  }
}

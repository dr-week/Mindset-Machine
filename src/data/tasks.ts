import { loadFromStorage, saveToStorage } from './persistence'
import type { Task, Goal, AiSuggestion, QuickNote, TimeBlock, Habit, DayReview, BiometricTelemetry } from '@/types/mindset'
import { sampleTasks, sampleGoals, sampleNotes, sampleTimeBlocks, sampleHabits } from './seedData'

export * from './factories'
export * from './seedData'

export interface StoredState {
  tasks: Task[]
  goals: Goal[]
  notes: QuickNote[]
  timetable: TimeBlock[]
  habits: Habit[]
  aiSuggestedTasks: AiSuggestion[]
  aiMotivation: string
  reviews: DayReview[]
  biometrics?: BiometricTelemetry
}

export function loadStoredState(): StoredState {
  return {
    tasks: loadFromStorage<Task[]>('tasks', sampleTasks),
    goals: loadFromStorage<Goal[]>('goals', sampleGoals),
    notes: loadFromStorage<QuickNote[]>('notes', sampleNotes),
    timetable: loadFromStorage<TimeBlock[]>('timetable', sampleTimeBlocks),
    habits: loadFromStorage<Habit[]>('habits', sampleHabits),
    aiSuggestedTasks: loadFromStorage<AiSuggestion[]>('aiSuggestedTasks', []),
    aiMotivation: loadFromStorage<string>('aiMotivation', 'Focus sharp: finish one high-impact task now.'),
    reviews: loadFromStorage<DayReview[]>('reviews', []),
    biometrics: loadFromStorage<BiometricTelemetry | undefined>('biometrics', undefined),
  }
}

export function saveStoredState(state: StoredState): void {
  saveToStorage('tasks', state.tasks || [])
  saveToStorage('goals', state.goals || [])
  saveToStorage('notes', state.notes || [])
  saveToStorage('timetable', state.timetable || [])
  saveToStorage('habits', state.habits || [])
  saveToStorage('aiSuggestedTasks', state.aiSuggestedTasks || [])
  saveToStorage('aiMotivation', state.aiMotivation || '')
  saveToStorage('reviews', state.reviews || [])
  if (state.biometrics) {
    saveToStorage('biometrics', state.biometrics)
  }
}

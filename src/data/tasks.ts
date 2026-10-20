import { loadFromStorage, saveToStorage } from './persistence'
import type { Task, Goal, AiSuggestion } from '@/types/mindset'

function generateId(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function createTaskEntity({
  title,
  projectId = null,
  priority = 'medium',
  completed = false,
  energy = 'flow',
  isTopThree = false,
  time = 'Today',
}: Partial<Omit<Task, 'id' | 'createdAt'>> & { title: string }): Task {
  return {
    id: generateId('t-'),
    title: title || 'Untitled Task',
    completed,
    projectId,
    priority,
    energy,
    isTopThree,
    createdAt: new Date().toISOString(),
    time,
  }
}

export function createGoalEntity(
  text = '',
  category: 'monumental' | 'quarterly' | 'monthly' = 'monumental',
  targetDate?: string,
): Goal {
  return {
    id: generateId('g-'),
    text: text || 'New Goal',
    completed: false,
    createdAt: new Date().toISOString(),
    category,
    targetDate,
  }
}

export function createAiSuggestionEntity(suggestion = ''): AiSuggestion {
  return {
    id: generateId('a-'),
    suggestion,
    createdAt: new Date().toISOString(),
  }
}

const sampleGoals: Goal[] = [
  createGoalEntity('Build a high-leverage weekly revenue habit'),
  createGoalEntity('Launch MINDSET v2 with local-first IndexedDB'),
  createGoalEntity('Achieve 100% daily monk-mode focus blocks'),
]

const sampleTasks: Task[] = [
  createTaskEntity({
    title: 'Clarify top 3 priorities for today',
    priority: 'high',
    energy: 'deep',
    isTopThree: true,
    time: 'Today',
  }),
  createTaskEntity({
    title: 'Deploy IndexedDB non-blocking persistence',
    priority: 'high',
    energy: 'deep',
    isTopThree: true,
    time: 'Today',
  }),
  createTaskEntity({
    title: 'Refine tactile haptics & command palette',
    priority: 'medium',
    energy: 'flow',
    isTopThree: true,
    time: 'Today',
  }),
  createTaskEntity({
    title: 'Review evening metacognitive review log',
    priority: 'low',
    energy: 'quick',
    isTopThree: false,
    time: 'Tomorrow',
  }),
]

const sampleNotes: import('@/types/mindset').QuickNote[] = [
  {
    id: 'n-1',
    title: '🧠 Mental Model: The 90m Deep Block',
    content: 'Dedicate the first 90 minutes of the morning to the single highest-friction high-priority directive. Zero notifications before completion.',
    updatedAt: new Date().toISOString(),
    pinned: true,
  },
  {
    id: 'n-2',
    title: '⚡ Solo Leveling: Stats Mapping',
    content: '- Strength: Completing high-impact tasks (+25 XP)\n- Intellect: Finishing Deep work blocks (+30 XP)\n- Vitality: 7+ hours sleep & 8k+ steps (+20 XP)\n- Discipline: Unbroken 14-day momentum density',
    updatedAt: new Date().toISOString(),
    pinned: false,
  },
]

const sampleTimeBlocks: import('@/types/mindset').TimeBlock[] = [
  {
    id: 'tb-1',
    title: '☀️ Circadian Sun Awakening & Hydration',
    category: 'vitality',
    startTime: '06:30',
    endTime: '07:30',
    completed: true,
    notes: 'Direct optic sunlight exposure + 500ml electrolyte water.',
  },
  {
    id: 'tb-2',
    title: '⚡ 90m Deep Focus: Core Directive Execution',
    category: 'deep',
    startTime: '08:00',
    endTime: '09:30',
    completed: true,
    notes: 'Zero notification sanctuary. Single highest-friction task.',
  },
  {
    id: 'tb-3',
    title: '🌿 Movement, Somatic Reset & Nutrition',
    category: 'ritual',
    startTime: '10:00',
    endTime: '11:00',
    completed: false,
    notes: 'Zone 2 walk / resistance training & protein replenishment.',
  },
  {
    id: 'tb-4',
    title: '🌊 Secondary Flow Block: Architecture & Code',
    category: 'deep',
    startTime: '11:30',
    endTime: '13:30',
    completed: false,
    notes: 'Modular refactoring and system implementation.',
  },
  {
    id: 'tb-5',
    title: '☕ Low-Energy Buffer & Administrative Sweeping',
    category: 'admin',
    startTime: '14:30',
    endTime: '15:30',
    completed: false,
    notes: 'Clear communication, email sweeps, low cognitive overhead.',
  },
  {
    id: 'tb-6',
    title: '🌙 Evening Metacognitive Audit & Digital Sunset',
    category: 'rest',
    startTime: '21:30',
    endTime: '22:30',
    completed: false,
    notes: 'Log daily wins, set tomorrow top 3, screens off.',
  },
]

const sampleHabits: import('@/types/mindset').Habit[] = [
  {
    id: 'h-1',
    title: '☀️ 10m Direct Morning Sunlight Exposure',
    period: 'morning',
    iconEmoji: '☀️',
    streak: 8,
    completedToday: true,
    targetDaysPerWeek: 7,
    score: 92,
  },
  {
    id: 'h-2',
    title: '💧 500ml Electrolytes & Delayed Caffeine (90m)',
    period: 'morning',
    iconEmoji: '💧',
    streak: 6,
    completedToday: true,
    targetDaysPerWeek: 7,
    score: 86,
  },
  {
    id: 'h-3',
    title: '⚡ 90m Monk-Mode Deep Focus (Zero Pings)',
    period: 'morning',
    iconEmoji: '⚡',
    streak: 5,
    completedToday: false,
    targetDaysPerWeek: 5,
    score: 84,
  },
  {
    id: 'h-4',
    title: '🧘 10m Mid-Afternoon NSDR / Somatic Reset',
    period: 'afternoon',
    iconEmoji: '🧘',
    streak: 4,
    completedToday: false,
    targetDaysPerWeek: 6,
    score: 75,
  },
  {
    id: 'h-5',
    title: '🌙 Digital Sunset & Blue Light Block (21:30)',
    period: 'evening',
    iconEmoji: '🌙',
    streak: 9,
    completedToday: false,
    targetDaysPerWeek: 7,
    score: 94,
  },
]

export interface StoredState {
  tasks: Task[]
  goals: Goal[]
  notes: import('@/types/mindset').QuickNote[]
  timetable: import('@/types/mindset').TimeBlock[]
  habits: import('@/types/mindset').Habit[]
  aiSuggestedTasks: AiSuggestion[]
  aiMotivation: string
  reviews: import('@/types/mindset').DayReview[]
  biometrics?: import('@/types/mindset').BiometricTelemetry
}

export function loadStoredState(): StoredState {
  return {
    tasks: loadFromStorage<Task[]>('tasks', sampleTasks),
    goals: loadFromStorage<Goal[]>('goals', sampleGoals),
    notes: loadFromStorage<import('@/types/mindset').QuickNote[]>('notes', sampleNotes),
    timetable: loadFromStorage<import('@/types/mindset').TimeBlock[]>('timetable', sampleTimeBlocks),
    habits: loadFromStorage<import('@/types/mindset').Habit[]>('habits', sampleHabits),
    aiSuggestedTasks: loadFromStorage<AiSuggestion[]>('aiSuggestedTasks', []),
    aiMotivation: loadFromStorage<string>('aiMotivation', 'Focus sharp: finish one high-impact task now.'),
    reviews: loadFromStorage<import('@/types/mindset').DayReview[]>('reviews', []),
    biometrics: loadFromStorage<import('@/types/mindset').BiometricTelemetry | undefined>('biometrics', undefined),
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

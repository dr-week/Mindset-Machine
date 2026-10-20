export type EnergyLevel = 'deep' | 'flow' | 'quick'

export interface Task {
  id: string
  title: string
  completed: boolean
  projectId?: string | null
  priority: 'low' | 'medium' | 'high'
  energy?: EnergyLevel
  isTopThree?: boolean
  createdAt: string
  completedAt?: string
  time?: string
}

export interface Goal {
  id: string
  text: string
  completed: boolean
  createdAt: string
  completedAt?: string
  category?: 'monumental' | 'quarterly' | 'monthly'
  targetDate?: string
}

export interface ConsistencyDay {
  date: string
  dayLabel: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface AiSuggestion {
  id: string
  suggestion: string
  createdAt: string
}

export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S'

export interface HunterStats {
  xp: number
  level: number
  rank: HunterRank
  title: string
  strength: number // from completing high priority tasks
  intellect: number // from deep work
  vitality: number // from health sync & recovery
  discipline: number // from streaks & consistency
}

export interface QuickNote {
  id: string
  title: string
  content: string
  updatedAt: string
  pinned?: boolean
}

export interface TimeBlock {
  id: string
  title: string
  category: 'deep' | 'vitality' | 'admin' | 'rest' | 'ritual'
  startTime: string // '07:00'
  endTime: string   // '08:30'
  completed?: boolean
  notes?: string
}

export interface Habit {
  id: string
  title: string
  period: 'morning' | 'afternoon' | 'evening'
  iconEmoji: string
  streak: number
  completedToday: boolean
  lastCompletedDate?: string
  targetDaysPerWeek: number
  score: number // 0 - 100% consistency score (Loop Habit style)
}

export interface ActivityEvent {
  id: string
  title: string
  type: 'task' | 'habit' | 'timeblock' | 'biometrics' | 'audit' | 'level_up'
  timestamp: string // ISO string
  icon: string
  details?: string
  xpDelta?: number
}

export type ActiveTab = 'dashboard' | 'activity' | 'timetable' | 'habits' | 'notes' | 'database' | 'goals' | 'tasks' | 'ai'

export type WearableConnectionStatus = 'disconnected' | 'scanning' | 'connected'

export interface ConnectedWearable {
  id: string
  name: string
  type: 'ble_smartwatch' | 'fitness_band' | 'custom_iot' | 'health_connect'
  batteryLevel?: number
  lastSeen?: string
}

export interface BiometricTelemetry {
  sleepHours: number
  deepSleepPercent: number
  restingHeartRate: number
  liveHeartRate?: number
  recoveryScore: number // 0 - 100%
  stepCount: number
  lastSyncedAt: string
  source: 'health_connect' | 'ble_wearable' | 'custom_iot' | 'simulated'
  device?: ConnectedWearable
}

export interface DayReview {
  id: string
  date: string
  winNote: string
  tomorrowPriority: string
  completedCount: number
  velocityRate: number
  biometrics?: BiometricTelemetry
}

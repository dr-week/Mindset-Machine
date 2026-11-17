export interface RoutineSuggestion {
  id: string
  title: string
  rationale: string
  actionLabel: string
  type: 'circadian' | 'deep_work' | 'recovery' | 'friction'
  applied: boolean
}

export interface MotivationNudge {
  id: string
  method: 'five_minute_rule' | 'solo_leveling_xp' | 'friction_collapse' | 'circadian_pulse'
  headline: string
  subtext: string
  callToAction: string
  xpBonus: number
}

export interface CalendarEventPayload {
  title: string
  description: string
  startTime: string // ISO string or HH:mm
  endTime: string   // ISO string or HH:mm
  category: 'deep' | 'vitality' | 'admin' | 'rest' | 'ritual'
}

export interface GoogleFitSyncResult {
  steps: number
  activeMinutes: number
  restingHeartRate: number
  sleepHours: number
  recoveryScore: number
  syncedAt: string
}

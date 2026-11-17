import type { TimeBlock, BiometricTelemetry } from '@/types/mindset'
import type { RoutineSuggestion } from '@/types/assistant'

export function analyzeDailyRoutine(
  timetable: TimeBlock[],
  biometrics: BiometricTelemetry,
  efficiencyScore: number
): RoutineSuggestion[] {
  const suggestions: RoutineSuggestion[] = []

  if (biometrics.recoveryScore < 65) {
    suggestions.push({
      id: 'sug-recovery-low',
      title: 'Circadian Shield: Downscale Deep Work',
      rationale: `Readiness is at ${biometrics.recoveryScore}%. High cognitive strain today risks burnout. Shift 1 deep block to admin or recovery.`,
      actionLabel: 'Convert Deep Block to Rest',
      type: 'recovery',
      applied: false,
    })
  } else if (biometrics.recoveryScore >= 80) {
    suggestions.push({
      id: 'sug-recovery-high',
      title: 'Peak Awakening: Expand Morning Deep Focus',
      rationale: `High recovery readiness (${biometrics.recoveryScore}%). Schedule a 90-minute uninterrupted deep work block before 11:00 AM.`,
      actionLabel: 'Add 90m Deep Block',
      type: 'deep_work',
      applied: false,
    })
  }

  const hasAfternoonReset = timetable.some(
    (b) => (b.category === 'rest' || b.category === 'vitality') && parseInt(b.startTime.slice(0, 2)) >= 13 && parseInt(b.startTime.slice(0, 2)) <= 16
  )

  if (!hasAfternoonReset) {
    suggestions.push({
      id: 'sug-afternoon-reset',
      title: 'Insert Post-Prandial NSDR / Walk',
      rationale: 'Huberman protocol: A 15-minute non-sleep deep rest or light outdoor walk resets dopamine and clears afternoon brain fog.',
      actionLabel: 'Schedule 2:00 PM NSDR',
      type: 'circadian',
      applied: false,
    })
  }

  if (efficiencyScore < 50 && timetable.length > 5) {
    suggestions.push({
      id: 'sug-friction-collapse',
      title: 'Reduce Schedule Friction: Consolidate Blocks',
      rationale: 'Fragmented schedules create context-switching tax. Group smaller admin tasks into a single 45-minute sprint.',
      actionLabel: 'Consolidate Admin Blocks',
      type: 'friction',
      applied: false,
    })
  }

  return suggestions
}

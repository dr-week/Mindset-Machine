import { describe, it, expect } from 'vitest'
import { analyzeDailyRoutine } from '@/services/assistant/routineOptimizer'
import { generateMotivationalNudges } from '@/services/assistant/nudgeEngine'
import { calendarAssistantService } from '@/services/assistant/calendarAssistant'
import type { Task, TimeBlock, BiometricTelemetry } from '@/types/mindset'

describe('Assistant Services Unit Suite', () => {
  const mockBiometrics: BiometricTelemetry = {
    sleepHours: 5.5,
    deepSleepPercent: 12,
    restingHeartRate: 72,
    recoveryScore: 50,
    stepCount: 3000,
    lastSyncedAt: new Date().toISOString(),
    source: 'simulated',
  }

  const mockTasks: Task[] = [
    {
      id: 't-high',
      title: 'Architect Native Android Bridge',
      completed: false,
      priority: 'high',
      energy: 'deep',
      createdAt: new Date().toISOString(),
    },
    {
      id: 't-low',
      title: 'Tidy code comments',
      completed: false,
      priority: 'low',
      energy: 'quick',
      createdAt: new Date().toISOString(),
    },
  ]

  const mockTimetable: TimeBlock[] = [
    {
      id: 'tb-1',
      startTime: '09:00',
      endTime: '10:30',
      title: 'Deep System Architecture',
      category: 'deep-work',
      completed: true,
    },
  ]

  describe('routineOptimizer', () => {
    it('detects low recovery score and suggests sleep recovery adjustments', () => {
      const suggestions = analyzeDailyRoutine(mockTimetable, mockBiometrics, 40)
      const sleepSug = suggestions.find((s) => s.type === 'recovery')
      expect(sleepSug).toBeDefined()
      expect(sleepSug?.rationale).toContain('50%')
    })

    it('recommends circadian afternoon reset when missing', () => {
      const suggestions = analyzeDailyRoutine(mockTimetable, { ...mockBiometrics, recoveryScore: 90 }, 80)
      const resetSug = suggestions.find((s) => s.type === 'circadian')
      expect(resetSug).toBeDefined()
    })
  })

  describe('nudgeEngine', () => {
    it('generates multi-method motivation nudges for active tasks', () => {
      const nudges = generateMotivationalNudges(mockTasks)
      expect(nudges.length).toBeGreaterThanOrEqual(3)

      const methods = nudges.map((n) => n.method)
      expect(methods).toContain('five_minute_rule')
      expect(methods).toContain('solo_leveling_xp')
      expect(methods).toContain('friction_collapse')
      expect(methods).toContain('circadian_pulse')
    })

    it('awards 50 XP bonus for solo leveling quest', () => {
      const nudges = generateMotivationalNudges(mockTasks)
      const soloNudge = nudges.find((n) => n.method === 'solo_leveling_xp')
      expect(soloNudge?.xpBonus).toBe(50)
      expect(soloNudge?.headline).toContain('Hunter Awakening')
    })
  })

  describe('calendarAssistant', () => {
    it('generates RFC 5545 valid .ics calendar export string', () => {
      const ics = calendarAssistantService.generateIcsFeed(mockTimetable)
      expect(ics).toContain('BEGIN:VCALENDAR')
      expect(ics).toContain('BEGIN:VEVENT')
      expect(ics).toContain('SUMMARY:[Mindset] Deep System Architecture')
      expect(ics).toContain('END:VEVENT')
      expect(ics).toContain('END:VCALENDAR')
    })
  })
})

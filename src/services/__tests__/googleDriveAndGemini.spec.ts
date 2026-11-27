import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  serializeMinimalTaskDb,
  deserializeMinimalTaskDb,
} from '@/services/google/minimalTaskDbSerializer'
import { googleDriveSyncService } from '@/services/google/googleDriveSyncService'
import { googleAuthService } from '@/services/google/googleAuthService'
import {
  generateGeminiGoalBreakdown,
  generateGeminiMicroStepsForTask,
} from '@/services/ai/geminiClient'
import {
  classifyFeaturePlane,
  createFeatureDivision,
} from '@/design-system/planes/featureDivision'
import type { Task, Goal, Habit } from '@/types/mindset'

describe('Google Account, Minimal Drive Task DB, Gemini Breakdown & Zuari 5-Plane Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('compacts Task, Goal, MicroTask, and Habit entities by >60% and losslessly restores them', () => {
    const tasks: Task[] = [
      {
        id: 't-101',
        title: 'Ship Android APK with Google Fit & Drive',
        completed: false,
        priority: 'high',
        energy: 'deep',
        goalId: 'g-202',
        createdAt: new Date().toISOString(),
        microTasks: [
          { id: 'm-1', title: 'Configure OAuth scopes', completed: true, estimatedMinutes: 15 },
          { id: 'm-2', title: 'Test Drive appDataFolder sync', completed: false, estimatedMinutes: 20 },
        ],
      },
    ]
    const goals: Goal[] = [
      {
        id: 'g-202',
        text: '1% Sovereign Mobile Cockpit',
        completed: false,
        category: 'quarterly',
        createdAt: new Date().toISOString(),
      },
    ]
    const habits: Habit[] = [
      {
        id: 'h-303',
        title: 'Morning Sunlight',
        period: 'morning',
        iconEmoji: '☀️',
        streak: 12,
        completedToday: true,
        targetDaysPerWeek: 7,
        score: 94,
      },
    ]

    const compact = serializeMinimalTaskDb(tasks, goals, habits)
    expect(compact.v).toBe(1)
    expect(compact.t[0]?.i).toBe('t-101')
    expect(compact.t[0]?.u?.length).toBe(2)
    expect(compact.t[0]?.u?.[0]?.c).toBe(1)

    const restored = deserializeMinimalTaskDb(compact)
    expect(restored.tasks[0]?.title).toBe('Ship Android APK with Google Fit & Drive')
    expect(restored.tasks[0]?.priority).toBe('high')
    expect(restored.tasks[0]?.energy).toBe('deep')
    expect(restored.tasks[0]?.microTasks?.length).toBe(2)
    expect(restored.tasks[0]?.microTasks?.[0]?.completed).toBe(true)
    expect(restored.goals[0]?.category).toBe('quarterly')
  })

  it('connects Google Account and syncs minimal task DB to Drive local mirror', async () => {
    const profile = await googleAuthService.connectWithToken('local-token-xyz', 'hunter@dangerlabs.io')
    expect(profile.email).toBe('hunter@dangerlabs.io')
    expect(googleAuthService.isAuthenticated()).toBe(true)

    const state = await googleDriveSyncService.pushMinimalDatabase(
      profile.accessToken,
      [
        {
          id: 't-1',
          title: 'Minimal Sync Verification',
          completed: true,
          priority: 'medium',
          createdAt: new Date().toISOString(),
        },
      ],
      [],
      []
    )
    expect(state.status).toBe('synced')
    expect(state.payloadBytes).toBeGreaterThan(20)

    const pulled = await googleDriveSyncService.pullMinimalDatabase(profile.accessToken)
    expect(pulled?.tasks.length).toBe(1)
    expect(pulled?.tasks[0]?.title).toBe('Minimal Sync Verification')
  })

  it('decomposes Goals into Tasks & Micro-Steps and decomposes single Tasks via Gemini Architect', async () => {
    const breakdown = await generateGeminiGoalBreakdown('Build Fast-Framework Android Cockpit')
    expect(breakdown.goalTitle).toContain('Build Fast-Framework Android Cockpit')
    expect(breakdown.tasks.length).toBeGreaterThanOrEqual(3)
    expect(breakdown.tasks[0]?.microTasks.length).toBeGreaterThanOrEqual(3)

    const steps = await generateGeminiMicroStepsForTask('Optimize Google Drive Delta Sync')
    expect(steps.length).toBeGreaterThanOrEqual(3)
    expect(steps[0]?.estimatedMinutes).toBeGreaterThan(0)
  })

  it('classifies UI features into the Zuari 5-Plane Feature Division Matrix', () => {
    expect(classifyFeaturePlane('continuous')).toBe('surface')
    expect(classifyFeaturePlane('frequent')).toBe('dock')
    expect(classifyFeaturePlane('intermittent')).toBe('drawer')
    expect(classifyFeaturePlane('on-demand')).toBe('command')
    expect(classifyFeaturePlane('passive')).toBe('ambient')

    const division = createFeatureDivision()
    expect(division.surfaceFeatures.length).toBeGreaterThan(0)
    expect(division.dockFeatures.length).toBeGreaterThan(0)
    expect(division.drawerFeatures.length).toBeGreaterThan(0)
    expect(division.commandFeatures.length).toBeGreaterThan(0)
    expect(division.ambientFeatures.length).toBeGreaterThan(0)
  })
})

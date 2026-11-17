import type { Task, Goal, QuickNote } from '@/types/mindset'
import { createTaskEntity, createGoalEntity } from './factories'

export * from './seedHabitsTimetable'

export const sampleGoals: Goal[] = [
  createGoalEntity('Build a high-leverage weekly revenue habit'),
  createGoalEntity('Launch MINDSET v2 with local-first IndexedDB'),
  createGoalEntity('Achieve 100% daily monk-mode focus blocks'),
]

export const sampleTasks: Task[] = [
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

export const sampleNotes: QuickNote[] = [
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

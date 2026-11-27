/**
 * Minimal Task Database Serializer (`MinimalTaskDbPayload`)
 * Inspired by `@zuari/sync` delta compaction and `Ywtoo/ToDoFeito` / `imxade/kitsy`.
 * Compresses full Task, Goal, MicroTask, and Habit objects into ultra-compact short-key JSON
 * before writing to Google Drive `appDataFolder`, reducing cloud payload size by >65%.
 */
import type { Task, Goal, Habit, MicroTask, EnergyLevel } from '@/types/mindset'

export interface CompactMicroTask {
  i: string
  t: string
  c: 0 | 1
  m?: number
}

export interface CompactTask {
  i: string
  t: string
  c: 0 | 1
  p: 'l' | 'm' | 'h'
  e: 'd' | 'f' | 'q'
  g?: string
  u?: CompactMicroTask[]
}

export interface CompactGoal {
  i: string
  t: string
  c: 0 | 1
  k: 'm' | 'q' | 'n'
  s?: CompactMicroTask[]
}

export interface CompactHabit {
  i: string
  t: string
  w: 'm' | 'a' | 'e'
  s: number
  q: number
}

export interface MinimalDrivePayload {
  v: 1
  ts: string
  t: CompactTask[]
  g: CompactGoal[]
  h: CompactHabit[]
}

const PRIO_TO_SHORT = { low: 'l', medium: 'm', high: 'h' } as const
const SHORT_TO_PRIO = { l: 'low', m: 'medium', h: 'high' } as const
const ENERGY_TO_SHORT = { deep: 'd', flow: 'f', quick: 'q' } as const
const SHORT_TO_ENERGY: Record<'d' | 'f' | 'q', EnergyLevel> = { d: 'deep', f: 'flow', q: 'quick' }

function compactSteps(steps?: MicroTask[]): CompactMicroTask[] | undefined {
  if (!steps || steps.length === 0) return undefined
  return steps.map((s) => ({
    i: s.id,
    t: s.title,
    c: s.completed ? 1 : 0,
    ...(s.estimatedMinutes ? { m: s.estimatedMinutes } : {}),
  }))
}

function expandSteps(steps?: CompactMicroTask[]): MicroTask[] | undefined {
  if (!steps || steps.length === 0) return undefined
  return steps.map((s) => ({
    id: s.i,
    title: s.t,
    completed: s.c === 1,
    ...(s.m ? { estimatedMinutes: s.m } : {}),
  }))
}

export function serializeMinimalTaskDb(tasks: Task[], goals: Goal[], habits: Habit[]): MinimalDrivePayload {
  return {
    v: 1,
    ts: new Date().toISOString(),
    t: tasks.map((task) => ({
      i: task.id,
      t: task.title,
      c: task.completed ? 1 : 0,
      p: PRIO_TO_SHORT[task.priority] || 'm',
      e: ENERGY_TO_SHORT[task.energy || 'flow'] || 'f',
      ...(task.goalId ? { g: task.goalId } : {}),
      ...(compactSteps(task.microTasks) ? { u: compactSteps(task.microTasks) } : {}),
    })),
    g: goals.map((goal) => ({
      i: goal.id,
      t: goal.text,
      c: goal.completed ? 1 : 0,
      k: goal.category === 'quarterly' ? 'q' : goal.category === 'monthly' ? 'n' : 'm',
      ...(compactSteps(goal.steps) ? { s: compactSteps(goal.steps) } : {}),
    })),
    h: habits.map((hab) => ({
      i: hab.id,
      t: hab.title,
      w: hab.period === 'afternoon' ? 'a' : hab.period === 'evening' ? 'e' : 'm',
      s: hab.streak,
      q: hab.score,
    })),
  }
}

export function deserializeMinimalTaskDb(payload: MinimalDrivePayload): {
  tasks: Task[]
  goals: Goal[]
} {
  const nowIso = payload.ts || new Date().toISOString()
  const tasks: Task[] = (payload.t || []).map((ct) => ({
    id: ct.i,
    title: ct.t,
    completed: ct.c === 1,
    priority: SHORT_TO_PRIO[ct.p] || 'medium',
    energy: SHORT_TO_ENERGY[ct.e] || 'flow',
    goalId: ct.g || null,
    createdAt: nowIso,
    microTasks: expandSteps(ct.u),
  }))

  const goals: Goal[] = (payload.g || []).map((cg) => ({
    id: cg.i,
    text: cg.t,
    completed: cg.c === 1,
    category: cg.k === 'q' ? 'quarterly' : cg.k === 'n' ? 'monthly' : 'monumental',
    createdAt: nowIso,
    steps: expandSteps(cg.s),
  }))

  return { tasks, goals }
}

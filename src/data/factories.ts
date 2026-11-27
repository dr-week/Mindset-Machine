import type { Task, Goal, AiSuggestion, MicroTask } from '@/types/mindset'

export function generateId(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function createMicroTaskEntity(title: string, estimatedMinutes = 15): MicroTask {
  return {
    id: generateId('m-'),
    title: title || 'Action Step',
    completed: false,
    estimatedMinutes,
  }
}

export function createTaskEntity({
  title,
  projectId = null,
  goalId = null,
  priority = 'medium',
  completed = false,
  energy = 'flow',
  isTopThree = false,
  time = 'Today',
  microTasks = [],
}: Partial<Omit<Task, 'id' | 'createdAt'>> & { title: string }): Task {
  const now = new Date().toISOString()
  return {
    id: generateId('t-'),
    title: title || 'Untitled Task',
    completed,
    projectId,
    goalId,
    priority,
    energy,
    isTopThree,
    createdAt: now,
    updatedAt: now,
    time,
    microTasks,
  }
}

export function createGoalEntity(
  text = '',
  category: 'monumental' | 'quarterly' | 'monthly' = 'monumental',
  targetDate?: string,
  steps: MicroTask[] = []
): Goal {
  const now = new Date().toISOString()
  return {
    id: generateId('g-'),
    text: text || 'New Goal',
    completed: false,
    createdAt: now,
    updatedAt: now,
    category,
    targetDate,
    steps,
  }
}

export function createAiSuggestionEntity(suggestion = ''): AiSuggestion {
  return {
    id: generateId('a-'),
    suggestion,
    createdAt: new Date().toISOString(),
  }
}

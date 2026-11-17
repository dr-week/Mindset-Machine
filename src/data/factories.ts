import type { Task, Goal, AiSuggestion } from '@/types/mindset'

export function generateId(prefix = ''): string {
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

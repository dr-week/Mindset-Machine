import { loadFromStorage, saveToStorage } from './persistence'

function _generateId(prefix = '') {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function createTaskEntity({
  title,
  projectId = null,
  priority = 'normal',
  completed = false,
  time = '',
} = {}) {
  return {
    id: _generateId('t-'),
    title: title || 'Untitled Task',
    completed,
    projectId,
    priority,
    createdAt: new Date().toISOString(),
    time,
  }
}

export function createGoalEntity(text = '') {
  return {
    id: _generateId('g-'),
    text: text || 'New Goal',
    createdAt: new Date().toISOString(),
  }
}

export function createAiSuggestionEntity(suggestion) {
  return {
    id: _generateId('a-'),
    suggestion: suggestion || '',
    createdAt: new Date().toISOString(),
  }
}

const sampleGoals = [
  createGoalEntity('Build a focused weekly planning habit'),
  createGoalEntity('Launch the first productivity dashboard MVP'),
]

const sampleTasks = [
  createTaskEntity({
    title: 'Clarify top 3 priorities for today',
    priority: 'high',
    time: 'Today',
  }),
  createTaskEntity({
    title: 'Draft the UI layout for the task dashboard',
    priority: 'medium',
    time: 'Today',
  }),
  createTaskEntity({
    title: 'Review AI motivation prompt design',
    priority: 'low',
    time: 'Tomorrow',
  }),
]

export function loadStoredState() {
  return {
    tasks: loadFromStorage('tasks', sampleTasks),
    goals: loadFromStorage('goals', sampleGoals),
    aiSuggestedTasks: loadFromStorage('aiSuggestedTasks', []),
    aiMotivation: loadFromStorage('aiMotivation', ''),
  }
}

export function saveStoredState({ tasks, goals, aiSuggestedTasks, aiMotivation }) {
  saveToStorage('tasks', tasks || [])
  saveToStorage('goals', goals || [])
  saveToStorage('aiSuggestedTasks', aiSuggestedTasks || [])
  saveToStorage('aiMotivation', aiMotivation || '')
}

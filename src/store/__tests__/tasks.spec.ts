import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from '@/store/tasks'

describe('useTasksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with default goals and tasks', () => {
    const store = useTasksStore()
    expect(store.goals.length).toBeGreaterThan(0)
    expect(store.tasks.length).toBeGreaterThan(0)
    expect(store.currentTab).toBe('dashboard')
  })

  it('adds a goal and prepends to the goals list', () => {
    const store = useTasksStore()
    const initialCount = store.goals.length
    const goal = store.addGoal('Test Master Goal')

    expect(store.goals.length).toBe(initialCount + 1)
    expect(store.goals[0]?.id).toBe(goal.id)
    expect(store.goals[0]?.text).toBe('Test Master Goal')
    expect(store.goals[0]?.completed).toBe(false)
  })

  it('toggles goal completion correctly', () => {
    const store = useTasksStore()
    const goal = store.addGoal('Toggleable Goal')
    expect(store.goals[0]?.completed).toBe(false)

    store.toggleGoal(goal.id)
    expect(store.goals[0]?.completed).toBe(true)

    store.toggleGoal(goal.id)
    expect(store.goals[0]?.completed).toBe(false)
  })

  it('deletes a goal by ID', () => {
    const store = useTasksStore()
    const goal = store.addGoal('To be deleted')
    store.deleteGoal(goal.id)
    expect(store.goals.some((g) => g.id === goal.id)).toBe(false)
  })

  it('adds a task with specified priority', () => {
    const store = useTasksStore()
    const initialCount = store.tasks.length
    const task = store.addTask('Complete unit testing', 'high', 'Today')

    expect(store.tasks.length).toBe(initialCount + 1)
    expect(task.title).toBe('Complete unit testing')
    expect(task.priority).toBe('high')
    expect(task.completed).toBe(false)
  })

  it('toggles and deletes tasks', () => {
    const store = useTasksStore()
    const task = store.addTask('Test toggle/delete')
    expect(task.completed).toBe(false)

    store.toggleTask(task.id)
    expect(store.tasks.find((t) => t.id === task.id)?.completed).toBe(true)

    store.deleteTask(task.id)
    expect(store.tasks.find((t) => t.id === task.id)).toBeUndefined()
  })

  it('accepts an AI suggestion into actionable tasks', () => {
    const store = useTasksStore()
    store.aiSuggestedTasks = [
      {
        id: 'a-123',
        suggestion: 'Automated deep focus sprint',
        createdAt: new Date().toISOString(),
      },
    ]

    store.acceptAiSuggestion('a-123')
    expect(store.aiSuggestedTasks.length).toBe(0)
    expect(store.tasks[0]?.title).toBe('Automated deep focus sprint')
    expect(store.tasks[0]?.priority).toBe('high')
  })

  it('calculates correct completion rates', () => {
    const store = useTasksStore()
    store.tasks = [
      { id: '1', title: 'T1', completed: true, priority: 'high', createdAt: '' },
      { id: '2', title: 'T2', completed: false, priority: 'medium', createdAt: '' },
    ]
    expect(store.taskCompletionRate).toBe(50)

    store.goals = [
      { id: 'g1', text: 'G1', completed: true, createdAt: '' },
      { id: 'g2', text: 'G2', completed: true, createdAt: '' },
    ]
    expect(store.goalCompletionRate).toBe(100)
  })
})

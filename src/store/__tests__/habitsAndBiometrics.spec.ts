import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from '@/store/tasks'

describe('useTasksStore — Habits & Biometrics', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with default habits across circadian periods', () => {
    const store = useTasksStore()
    expect(store.habits.length).toBeGreaterThan(0)
    const periods = store.habits.map((h) => h.period)
    expect(periods).toContain('morning')
    expect(periods).toContain('afternoon')
    expect(periods).toContain('evening')
  })

  it('adds a habit and returns it in the list', () => {
    const store = useTasksStore()
    const before = store.habits.length
    store.addHabit('Cold Shower', 'morning', '🚿')
    expect(store.habits.length).toBe(before + 1)
    const added = store.habits.find((h) => h.title === 'Cold Shower')
    expect(added).toBeDefined()
    expect(added?.period).toBe('morning')
    expect(added?.streak).toBe(0)
    expect(added?.completedToday).toBe(false)
  })

  it('toggles a habit completion and updates streak', () => {
    const store = useTasksStore()
    store.addHabit('Morning Walk', 'morning', '🚶')
    const habit = store.habits.find((h) => h.title === 'Morning Walk')!
    expect(habit.completedToday).toBe(false)

    store.toggleHabit(habit.id)
    const updated = store.habits.find((h) => h.id === habit.id)!
    expect(updated.completedToday).toBe(true)
    expect(updated.streak).toBeGreaterThanOrEqual(1)
  })

  it('deletes a habit by id', () => {
    const store = useTasksStore()
    store.addHabit('Meditation', 'evening', '🧘')
    const habit = store.habits.find((h) => h.title === 'Meditation')!
    store.deleteHabit(habit.id)
    expect(store.habits.find((h) => h.id === habit.id)).toBeUndefined()
  })

  it('stores biometrics and exposes them reactively', () => {
    const store = useTasksStore()
    store.biometrics = {
      sleepHours: 7.5,
      deepSleepPercent: 22,
      restingHeartRate: 55,
      recoveryScore: 92,
      stepCount: 10500,
      lastSyncedAt: new Date().toISOString(),
      source: 'simulated',
    }
    expect(store.biometrics.recoveryScore).toBe(92)
    expect(store.biometrics.stepCount).toBe(10500)
  })

  it('sweeps completed tasks from the queue', () => {
    const store = useTasksStore()
    store.addTask('Done task A', 'high')
    store.addTask('Done task B', 'low')
    store.tasks.forEach((t) => { t.completed = true })
    const totalBefore = store.tasks.length
    store.sweepCompletedTasks()
    expect(store.tasks.length).toBeLessThan(totalBefore)
    expect(store.completedTasks.length).toBe(0)
  })
})

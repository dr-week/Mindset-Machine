import { computed, type Ref } from 'vue'
import type { Task, Goal, TimeBlock, Habit, DayReview, BiometricTelemetry } from '@/types/mindset'
import {
  computeHunterStats,
  computeDailyConsistencyGrid,
  computeActivityTimeline,
  computeTodayActivitySummary,
  computeDailyExecutionEfficiency,
} from '@/features/dashboard/gamification'

export function useTasksGetters(
  tasks: Ref<Task[]>,
  goals: Ref<Goal[]>,
  habits: Ref<Habit[]>,
  timetable: Ref<TimeBlock[]>,
  reviews: Ref<DayReview[]>,
  biometrics: Ref<BiometricTelemetry>,
  taskFilter: Ref<'all' | 'high' | 'deep' | 'flow' | 'quick'>
) {
  const uncompletedTasks = computed(() => tasks.value.filter((t) => !t.completed))
  const completedTasks = computed(() => tasks.value.filter((t) => t.completed))
  const activeGoals = computed(() => goals.value.filter((g) => !g.completed))
  const completedGoals = computed(() => goals.value.filter((g) => g.completed))

  const dailyConsistencyGrid = computed(() => computeDailyConsistencyGrid(tasks.value))

  const hunterStats = computed(() =>
    computeHunterStats({
      completedTasks: completedTasks.value,
      completedGoals: completedGoals.value,
      habits: habits.value,
      biometrics: biometrics.value,
      dailyConsistencyGrid: dailyConsistencyGrid.value,
    })
  )

  const activityTimeline = computed(() =>
    computeActivityTimeline({
      tasks: tasks.value,
      habits: habits.value,
      timetable: timetable.value,
      reviews: reviews.value,
    })
  )

  const todayActivitySummary = computed(() =>
    computeTodayActivitySummary(tasks.value, habits.value, timetable.value, biometrics.value)
  )

  const topThreeTasks = computed(() => {
    const pinned = tasks.value.filter((t) => t.isTopThree && !t.completed)
    if (pinned.length >= 3) return pinned.slice(0, 3)
    const highUncompleted = tasks.value.filter((t) => t.priority === 'high' && !t.completed)
    const combined = [...pinned, ...highUncompleted]
    return Array.from(new Set(combined)).slice(0, 3)
  })

  const filteredTasks = computed(() => {
    if (taskFilter.value === 'high') return tasks.value.filter((t) => t.priority === 'high')
    if (taskFilter.value === 'deep') return tasks.value.filter((t) => t.energy === 'deep')
    if (taskFilter.value === 'flow') return tasks.value.filter((t) => t.energy === 'flow')
    if (taskFilter.value === 'quick') return tasks.value.filter((t) => t.energy === 'quick')
    return tasks.value
  })

  const taskCompletionRate = computed(() => {
    if (!tasks.value.length) return 0
    return Math.round((completedTasks.value.length / tasks.value.length) * 100)
  })

  const dailyExecutionEfficiency = computed(() =>
    computeDailyExecutionEfficiency(tasks.value, completedTasks.value, habits.value, timetable.value)
  )

  const goalCompletionRate = computed(() => {
    if (!goals.value.length) return 0
    return Math.round((completedGoals.value.length / goals.value.length) * 100)
  })

  return {
    uncompletedTasks,
    completedTasks,
    activeGoals,
    completedGoals,
    dailyConsistencyGrid,
    hunterStats,
    activityTimeline,
    todayActivitySummary,
    topThreeTasks,
    filteredTasks,
    taskCompletionRate,
    dailyExecutionEfficiency,
    goalCompletionRate,
  }
}

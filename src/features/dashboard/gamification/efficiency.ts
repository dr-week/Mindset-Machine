import type { Task, Habit, TimeBlock } from '@/types/mindset'

export function computeDailyExecutionEfficiency(
  tasks: Task[],
  completedTasks: Task[],
  habits: Habit[],
  timetable: TimeBlock[],
): number {
  const totalItems = tasks.length + habits.length + timetable.length
  if (totalItems === 0) return 0

  const taskScore = completedTasks.reduce((acc, t) => {
    let weight = 1
    if (t.priority === 'high') weight += 0.5
    if (t.energy === 'deep') weight += 0.5
    return acc + weight
  }, 0)

  const habitScore = habits.filter((h) => h.completedToday).length * 1.2
  const blockScore = timetable.filter((b) => b.completed).length * 1.5

  const maxPossibleScore =
    tasks.reduce((acc, t) => {
      let weight = 1
      if (t.priority === 'high') weight += 0.5
      if (t.energy === 'deep') weight += 0.5
      return acc + weight
    }, 0) +
    habits.length * 1.2 +
    timetable.length * 1.5

  if (maxPossibleScore === 0) return 0
  return Math.min(100, Math.round(((taskScore + habitScore + blockScore) / maxPossibleScore) * 100))
}

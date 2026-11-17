import type { Task, Goal } from '@/types/mindset'

export function getOfflineTaskSuggestions(goals: Goal[]): string[] {
  const primaryGoal = goals.find((g) => !g.completed)?.text || 'Core Vision'
  return [
    `Execute 45-minute sprint on priority goal: "${primaryGoal}"`,
    'Review pending tasks and remove 1 non-essential friction item',
    'Synthesize milestone progress and schedule next focus session',
  ]
}

export function getOfflineMotivation(stagnantTasks: Task[]): string {
  const highPrioCount = stagnantTasks.filter((t) => t.priority === 'high').length
  if (highPrioCount > 0) {
    return `You have ${highPrioCount} critical mission tasks waiting. Eliminate the hardest one first.`
  }

  const quotes = [
    'Cut the noise. One focused hour beats eight hours of hesitation.',
    'Momentum is built by starting small, not by waiting for inspiration.',
    'Execute the highest priority item first—everything else is a distraction.',
    'Small completed reps compound into extraordinary breakthroughs.',
    'Clarity follows action. Start the task before you feel ready.',
  ]
  return quotes[Math.floor(Math.random() * quotes.length)] ?? 'Action cures fear. Start now.'
}

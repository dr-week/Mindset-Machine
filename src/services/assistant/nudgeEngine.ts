import type { Task } from '@/types/mindset'
import type { MotivationNudge } from '@/types/assistant'

export function generateMotivationalNudges(uncompletedTasks: Task[]): MotivationNudge[] {
  const highPriority = uncompletedTasks.filter((t) => t.priority === 'high')
  const targetTask = highPriority[0] || uncompletedTasks[0]
  const taskName = targetTask ? targetTask.title : 'your primary goal'

  return [
    {
      id: 'nudge-five-min',
      method: 'five_minute_rule',
      headline: 'The 5-Minute Non-Negotiable Contract',
      subtext: `Commit only to 5 minutes on "${taskName}". Open the workspace and do the smallest possible action. You are allowed to stop at minute 6.`,
      callToAction: 'Start 5-Minute Timer',
      xpBonus: 25,
    },
    {
      id: 'nudge-solo-leveling',
      method: 'solo_leveling_xp',
      headline: 'Hunter Awakening Quest Alert',
      subtext: `Completing "${taskName}" yields +30 STR XP and pushes you toward the next Hunter Rank. Slayers do not hesitate in the dungeon.`,
      callToAction: 'Accept Quest & Execute',
      xpBonus: 50,
    },
    {
      id: 'nudge-friction',
      method: 'friction_collapse',
      headline: 'Remove Initiation Friction',
      subtext: 'Break the task into a microscopic sub-action: write one line, open one file, or send one sentence. Momentum will carry the rest.',
      callToAction: 'Isolate Step 1',
      xpBonus: 20,
    },
    {
      id: 'nudge-circadian',
      method: 'circadian_pulse',
      headline: 'Circadian Peak Energy Window',
      subtext: 'Your cognitive focus window is open. High dopamine and norepinephrine levels make this the highest ROI time of your day.',
      callToAction: 'Enter Deep Focus',
      xpBonus: 35,
    },
  ]
}

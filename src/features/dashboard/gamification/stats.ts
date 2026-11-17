import type { Task, Goal, Habit, BiometricTelemetry, ConsistencyDay, HunterStats, HunterRank } from '@/types/mindset';

export interface HunterStatsInput {
  completedTasks: Task[];
  completedGoals: Goal[];
  habits: Habit[];
  biometrics: BiometricTelemetry;
  dailyConsistencyGrid: ConsistencyDay[];
}

export function computeHunterStats(input: HunterStatsInput): HunterStats {
  const { completedTasks, completedGoals, habits, biometrics, dailyConsistencyGrid } = input;

  const taskXp = completedTasks.reduce((acc, t) => {
    let weight = 15;
    if (t.priority === 'high') weight += 15;
    if (t.energy === 'deep') weight += 20;
    return acc + weight;
  }, 0);
  const goalXp = completedGoals.length * 100;
  const consistencyBonus = dailyConsistencyGrid.reduce((acc, d) => acc + d.count * 10, 0);
  const totalXp = taskXp + goalXp + consistencyBonus;

  const level = Math.max(1, Math.floor(totalXp / 100) + 1);

  let rank: HunterRank = 'E';
  let title = 'Awakened Novice';
  if (level >= 30) {
    rank = 'S';
    title = 'Shadow Sovereign';
  } else if (level >= 20) {
    rank = 'A';
    title = 'Apex Vanguard';
  } else if (level >= 12) {
    rank = 'B';
    title = 'Elite Striker';
  } else if (level >= 6) {
    rank = 'C';
    title = 'Raid Specialist';
  } else if (level >= 3) {
    rank = 'D';
    title = 'Dungeon Scout';
  }

  const strength = 10 + completedTasks.filter((t) => t.priority === 'high').length * 4;
  const intellect = 10 + completedTasks.filter((t) => t.energy === 'deep').length * 5;
  const vitality = Math.round(biometrics.recoveryScore / 2) + Math.min(25, Math.floor(biometrics.stepCount / 800));
  const completedHabitsCount = habits.filter((h) => h.completedToday).length;
  const discipline =
    10 +
    dailyConsistencyGrid.filter((d) => d.level >= 2).length * 6 +
    completedHabitsCount * 4;

  return {
    xp: totalXp,
    level,
    rank,
    title,
    strength,
    intellect,
    vitality,
    discipline,
  };
}

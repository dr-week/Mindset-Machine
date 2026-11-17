export function computeTodayActivitySummary(
  tasks: any[],
  habits: any[],
  timetable: any[],
  biometrics: any,
) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const completedTasksToday = tasks.filter((t) => {
    if (!t.completed) return false;
    const compDate = t.completedAt ? t.completedAt.slice(0, 10) : t.createdAt.slice(0, 10);
    return compDate === todayStr;
  }).length;

  const completedHabitsToday = habits.filter((h) => h.completedToday).length;
  const completedBlocksToday = timetable.filter((b) => b.completed).length;

  const totalActions = completedTasksToday + completedHabitsToday + completedBlocksToday;
  const estimatedFocusMinutes =
    timetable.filter((b) => b.completed && (b.category === 'deep' || b.category === 'ritual')).length * 60 +
    tasks.filter((t) => t.completed && t.energy === 'deep').length * 45;

  return {
    completedTasksToday,
    completedHabitsToday,
    completedBlocksToday,
    totalActions,
    estimatedFocusMinutes,
    steps: biometrics.stepCount,
    recovery: biometrics.recoveryScore,
  };
}

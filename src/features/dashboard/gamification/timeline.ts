import type { Task, Goal, Habit, TimeBlock, DayReview, ActivityEvent } from '@/types/mindset';

export interface ActivityFeedInput {
  tasks: Task[];
  habits: Habit[];
  timetable: TimeBlock[];
  reviews: DayReview[];
}

export function computeActivityTimeline(input: ActivityFeedInput): ActivityEvent[] {
  const { tasks, habits, timetable, reviews } = input;
  const events: ActivityEvent[] = [];

  tasks
    .filter((t) => t.completed)
    .forEach((t) => {
      const ts = t.completedAt || t.createdAt;
      events.push({
        id: `act-task-${t.id}`,
        title: t.title,
        type: 'task',
        timestamp: ts,
        icon: t.priority === 'high' ? '🔥' : t.energy === 'deep' ? '⚡' : '✓',
        details: `${t.priority.toUpperCase()} priority • ${t.energy ? t.energy.toUpperCase() : 'FLOW'} energy`,
        xpDelta: t.priority === 'high' ? 30 : t.energy === 'deep' ? 35 : 15,
      });
    });

  habits
    .filter((h) => h.completedToday)
    .forEach((h) => {
      events.push({
        id: `act-habit-${h.id}`,
        title: h.title,
        type: 'habit',
        timestamp: h.lastCompletedDate || new Date().toISOString(),
        icon: h.iconEmoji || '⚡',
        details: `Streak ${h.streak}d • ${h.period.toUpperCase()} protocol`,
        xpDelta: 15,
      });
    });

  timetable
    .filter((b) => b.completed)
    .forEach((b) => {
      events.push({
        id: `act-block-${b.id}`,
        title: b.title,
        type: 'timeblock',
        timestamp: new Date().toISOString().slice(0, 10) + `T${b.endTime}:00.000Z`,
        icon: '⏱️',
        details: `${b.startTime} - ${b.endTime} • ${b.category.toUpperCase()}`,
        xpDelta: 25,
      });
    });

  reviews.forEach((r) => {
    events.push({
      id: `act-review-${r.id}`,
      title: `Evening Audit: ${r.winNote}`,
      type: 'audit',
      timestamp: `${r.date}T21:30:00.000Z`,
      icon: '🌙',
      details: `Velocity: ${r.velocityRate}% • Next: ${r.tomorrowPriority}`,
      xpDelta: 50,
    });
  });

  return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

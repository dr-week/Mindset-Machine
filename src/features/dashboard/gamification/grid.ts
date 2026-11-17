export interface ConsistencyDay {
  date: string;
  dayLabel: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function computeDailyConsistencyGrid(tasks: any[]): ConsistencyDay[] {
  const days: ConsistencyDay[] = [];
  const now = new Date();
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = dayNames[d.getDay()] ?? 'Day';

    const count = tasks.filter((t) => {
      if (!t.completed) return false;
      const compDate = t.completedAt ? t.completedAt.slice(0, 10) : t.createdAt.slice(0, 10);
      return compDate === dateStr;
    }).length;

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count >= 5) level = 4;
    else if (count >= 3) level = 3;
    else if (count >= 2) level = 2;
    else if (count >= 1) level = 1;

    days.push({
      date: dateStr,
      dayLabel,
      count,
      level,
    });
  }
  return days;
}

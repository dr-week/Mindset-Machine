import { triggerHaptic } from '@/services/haptics'
import { playCheckSound, playSuccessChime } from '@/services/audioFeedback'
import type { TimeBlock, Habit, QuickNote, DayReview, BiometricTelemetry } from '@/types/mindset'
import type { Ref } from 'vue'

export function useLifeCycleActions(context: {
  timetable: Ref<TimeBlock[]>
  habits: Ref<Habit[]>
  notes: Ref<QuickNote[]>
  reviews: Ref<DayReview[]>
  biometrics: Ref<BiometricTelemetry>
  completedTasksCount: () => number
  taskCompletionRate: () => number
}) {
  const { timetable, habits, notes, reviews, biometrics, completedTasksCount, taskCompletionRate } = context

  function addNote(title: string, content: string): void {
    notes.value.unshift({
      id: `n-${Date.now().toString(36)}`,
      title: title || 'Quick Thought',
      content: content || '',
      updatedAt: new Date().toISOString(),
      pinned: false,
    })
    playCheckSound()
    void triggerHaptic('medium')
  }

  function deleteNote(id: string): void {
    notes.value = notes.value.filter((n) => n.id !== id)
    void triggerHaptic('light')
  }

  function togglePinNote(id: string): void {
    const note = notes.value.find((n) => n.id === id)
    if (note) {
      note.pinned = !note.pinned
      void triggerHaptic('light')
    }
  }

  function addTimeBlock(
    title: string,
    category: 'deep' | 'vitality' | 'admin' | 'rest' | 'ritual',
    startTime: string,
    endTime: string,
    notesText = '',
  ): void {
    timetable.value.push({
      id: `tb-${Date.now().toString(36)}`,
      title: title.trim() || 'Focus Session',
      category,
      startTime,
      endTime,
      completed: false,
      notes: notesText,
    })
    timetable.value.sort((a, b) => a.startTime.localeCompare(b.startTime))
    playCheckSound()
    void triggerHaptic('medium')
  }

  function toggleTimeBlock(id: string): void {
    const block = timetable.value.find((b) => b.id === id)
    if (block) {
      block.completed = !block.completed
      if (block.completed) {
        playSuccessChime()
        void triggerHaptic('heavy')
      } else {
        void triggerHaptic('light')
      }
    }
  }

  function deleteTimeBlock(id: string): void {
    timetable.value = timetable.value.filter((b) => b.id !== id)
    void triggerHaptic('light')
  }

  function toggleHabit(id: string): void {
    const habit = habits.value.find((h) => h.id === id)
    if (habit) {
      habit.completedToday = !habit.completedToday
      if (habit.completedToday) {
        habit.streak += 1
        habit.score = Math.min(100, habit.score + 5)
        playSuccessChime()
        void triggerHaptic('heavy')
      } else {
        habit.streak = Math.max(0, habit.streak - 1)
        habit.score = Math.max(0, habit.score - 5)
        void triggerHaptic('light')
      }
    }
  }

  function addHabit(
    title: string,
    period: 'morning' | 'afternoon' | 'evening',
    iconEmoji = '⚡',
    targetDaysPerWeek = 7,
  ): void {
    habits.value.push({
      id: `h-${Date.now().toString(36)}`,
      title: title.trim() || 'Daily Protocol',
      period,
      iconEmoji,
      streak: 0,
      completedToday: false,
      targetDaysPerWeek,
      score: 50,
    })
    playCheckSound()
    void triggerHaptic('medium')
  }

  function deleteHabit(id: string): void {
    habits.value = habits.value.filter((h) => h.id !== id)
    void triggerHaptic('light')
  }

  function addDayReview(winNote: string, tomorrowPriority: string): void {
    reviews.value.unshift({
      id: `r-${Date.now().toString(36)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      winNote,
      tomorrowPriority,
      completedCount: completedTasksCount(),
      velocityRate: taskCompletionRate(),
      biometrics: biometrics.value,
    })
    void triggerHaptic('heavy')
  }

  return {
    addNote,
    deleteNote,
    togglePinNote,
    addTimeBlock,
    toggleTimeBlock,
    deleteTimeBlock,
    toggleHabit,
    addHabit,
    deleteHabit,
    addDayReview,
  }
}

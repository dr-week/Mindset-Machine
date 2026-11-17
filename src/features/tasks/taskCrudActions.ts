import { triggerHaptic } from '@/services/haptics'
import { playCheckSound } from '@/services/audioFeedback'
import type { Task } from '@/types/mindset'
import type { Ref } from 'vue'

export function useTaskCrudActions(
  tasks: Ref<Task[]>,
  lastDeletedTask: Ref<Task | null>,
  lastDeletedGoal: Ref<any | null>,
  createTaskEntity: (opts: { title: string; priority?: 'low' | 'medium' | 'high'; energy?: import('@/types/mindset').EnergyLevel; time?: string }) => Task,
  setUndoToast: (message: string, durationMs?: number) => void
) {
  function addTask(
    title: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    energy: import('@/types/mindset').EnergyLevel = 'flow',
    time = 'Today',
  ): Task {
    const task = createTaskEntity({ title, priority, energy, time })
    tasks.value.unshift(task)
    void triggerHaptic('medium')
    return task
  }

  function toggleTask(id: string): void {
    const task = tasks.value.find((x) => x.id === id)
    if (task) {
      task.completed = !task.completed
      if (task.completed) {
        task.completedAt = new Date().toISOString()
        playCheckSound()
        void triggerHaptic('heavy')
      } else {
        task.completedAt = undefined
        void triggerHaptic('light')
      }
    }
  }

  function deleteTask(id: string): void {
    const taskIndex = tasks.value.findIndex((x) => x.id === id)
    if (taskIndex !== -1) {
      const deleted = tasks.value[taskIndex]
      if (deleted) {
        lastDeletedTask.value = deleted
        lastDeletedGoal.value = null
        tasks.value.splice(taskIndex, 1)
        void triggerHaptic('light')
        setUndoToast(`Task removed: "${deleted.title.slice(0, 22)}..."`, 5000)
      }
    }
  }

  function sweepCompletedTasks(): void {
    const completedList = tasks.value.filter((t) => t.completed)
    if (completedList.length === 0) return

    tasks.value = tasks.value.filter((t) => !t.completed)
    playCheckSound()
    void triggerHaptic('medium')
    setUndoToast(`Swept ${completedList.length} completed tasks from queue`, 4000)
  }

  return {
    addTask,
    toggleTask,
    deleteTask,
    sweepCompletedTasks,
  }
}

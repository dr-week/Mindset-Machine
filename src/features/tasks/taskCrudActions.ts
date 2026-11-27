import { triggerHaptic } from '@/services/haptics'
import { playCheckSound } from '@/services/audioFeedback'
import { createMicroTaskEntity } from '@/data/factories'
import type { Task, MicroTask } from '@/types/mindset'
import type { Ref } from 'vue'

export function useTaskCrudActions(
  tasks: Ref<Task[]>,
  lastDeletedTask: Ref<Task | null>,
  lastDeletedGoal: Ref<any | null>,
  createTaskEntity: (opts: {
    title: string
    priority?: 'low' | 'medium' | 'high'
    energy?: import('@/types/mindset').EnergyLevel
    time?: string
    goalId?: string | null
    microTasks?: MicroTask[]
  }) => Task,
  setUndoToast: (message: string, durationMs?: number) => void
) {
  function addTask(
    title: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    energy: import('@/types/mindset').EnergyLevel = 'flow',
    time = 'Today',
    goalId: string | null = null,
    microTasks: MicroTask[] = []
  ): Task {
    const task = createTaskEntity({ title, priority, energy, time, goalId, microTasks })
    tasks.value.unshift(task)
    void triggerHaptic('medium')
    return task
  }

  function addMicroTask(taskId: string, stepTitle: string, estimatedMinutes = 15): MicroTask | null {
    const task = tasks.value.find((x) => x.id === taskId)
    if (!task) return null
    if (!task.microTasks) task.microTasks = []
    const step = createMicroTaskEntity(stepTitle, estimatedMinutes)
    task.microTasks.push(step)
    void triggerHaptic('light')
    return step
  }

  function toggleMicroTask(taskId: string, microTaskId: string): void {
    const task = tasks.value.find((x) => x.id === taskId)
    if (!task || !task.microTasks) return
    const step = task.microTasks.find((m) => m.id === microTaskId)
    if (step) {
      step.completed = !step.completed
      playCheckSound()
      void triggerHaptic('light')
    }
  }

  function setTaskMicroTasks(taskId: string, steps: { title: string; estimatedMinutes?: number }[]): void {
    const task = tasks.value.find((x) => x.id === taskId)
    if (!task) return
    task.microTasks = steps.map((s) => createMicroTaskEntity(s.title, s.estimatedMinutes ?? 15))
    void triggerHaptic('medium')
  }

  function toggleTask(id: string): void {
    const task = tasks.value.find((x) => x.id === id)
    if (task) {
      task.completed = !task.completed
      task.updatedAt = new Date().toISOString()
      if (task.completed) {
        task.completedAt = task.updatedAt
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
        deleted.deletedAt = new Date().toISOString()
        deleted.updatedAt = deleted.deletedAt
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
    addMicroTask,
    toggleMicroTask,
    setTaskMicroTasks,
    toggleTask,
    deleteTask,
    sweepCompletedTasks,
  }
}

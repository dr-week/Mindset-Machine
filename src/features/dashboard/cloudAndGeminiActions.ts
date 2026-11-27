/**
 * Cloud, Google Account, Minimal Drive Sync & Gemini Breakdown Actions
 * Enforces the < 150 lines Zero-Monolith Rule.
 */
import type { Ref } from 'vue'
import type { Task, Goal, Habit, MicroTask, GoogleUserProfile, DriveSyncState, BiometricTelemetry, EnergyLevel } from '@/types/mindset'
import { googleAuthService } from '@/services/google/googleAuthService'
import { googleDriveSyncService } from '@/services/google/googleDriveSyncService'
import { googleFitService } from '@/services/googleFit/googleFitService'
import { generateGeminiGoalBreakdown, generateGeminiMicroStepsForTask } from '@/services/aiService'
import { createMicroTaskEntity } from '@/data/factories'
import { triggerHaptic } from '@/services/haptics'
import { playSuccessChime } from '@/services/audioFeedback'

export function useCloudAndGeminiActions(context: {
  tasks: Ref<Task[]>
  goals: Ref<Goal[]>
  habits: Ref<Habit[]>
  biometrics: Ref<BiometricTelemetry>
  googleUser: Ref<GoogleUserProfile | null>
  driveSync: Ref<DriveSyncState>
  loadingAi: Ref<boolean>
  syncingHealth: Ref<boolean>
  addTask: (title: string, priority?: 'low' | 'medium' | 'high', energy?: EnergyLevel, time?: string, goalId?: string | null, microTasks?: MicroTask[]) => Task
  addGoal: (text: string, category?: 'monumental' | 'quarterly' | 'monthly', targetDate?: string) => Goal
  setTaskMicroTasks: (taskId: string, steps: { title: string; estimatedMinutes?: number }[]) => void
  setUndoToast: (message: string, durationMs?: number) => void
}) {
  const { tasks, goals, habits, biometrics, googleUser, driveSync, loadingAi, syncingHealth, addTask, addGoal, setTaskMicroTasks, setUndoToast } = context

  async function connectGoogleAccount(tokenOrEmail = 'local-google-oauth-token', email = 'operator@gmail.com'): Promise<void> {
    const profile = await googleAuthService.connectWithToken(tokenOrEmail, email)
    googleUser.value = profile
    googleFitService.setAccessToken(tokenOrEmail)
    await syncMinimalToGoogleDrive()
    setUndoToast(`Google connected: ${profile.email}`, 4000)
    playSuccessChime()
    void triggerHaptic('heavy')
  }

  function disconnectGoogleAccount(): void {
    googleAuthService.signOut()
    googleUser.value = null
    driveSync.value = { status: 'idle' }
    setUndoToast('Google Account disconnected', 3000)
    void triggerHaptic('light')
  }

  async function syncMinimalToGoogleDrive(): Promise<DriveSyncState> {
    driveSync.value = { ...driveSync.value, status: 'syncing' }
    const res = await googleDriveSyncService.pushMinimalDatabase(googleUser.value?.accessToken, tasks.value, goals.value, habits.value)
    driveSync.value = res
    setUndoToast(`Drive synced (${res.payloadBytes}B minimal DB)`, 3500)
    void triggerHaptic('medium')
    return res
  }

  async function restoreMinimalFromGoogleDrive(): Promise<boolean> {
    driveSync.value = { ...driveSync.value, status: 'syncing' }
    const pulled = await googleDriveSyncService.pullMinimalDatabase(googleUser.value?.accessToken)
    if (!pulled) {
      driveSync.value = { status: 'error', errorMessage: 'No minimal snapshot found' }
      return false
    }
    tasks.value = pulled.tasks
    goals.value = pulled.goals
    driveSync.value = { status: 'synced', lastSyncedAt: new Date().toISOString(), payloadBytes: pulled.payloadBytes }
    setUndoToast(`Restored ${pulled.tasks.length} tasks from Drive`, 4000)
    playSuccessChime()
    return true
  }

  async function syncGoogleFitMetrics(): Promise<void> {
    syncingHealth.value = true
    try {
      const fit = await googleFitService.fetchDailyActivityMetrics()
      biometrics.value = {
        ...biometrics.value,
        stepCount: fit.steps,
        restingHeartRate: fit.restingHeartRate,
        sleepHours: fit.sleepHours,
        recoveryScore: fit.recoveryScore,
        lastSyncedAt: fit.syncedAt,
        source: 'google_fit',
      }
      setUndoToast(`Google Fit synced: ${fit.steps.toLocaleString()} steps · ${fit.recoveryScore}% recovery`, 4000)
      playSuccessChime()
    } finally {
      syncingHealth.value = false
    }
  }

  async function architectGoalWithGemini(goalPrompt: string) {
    loadingAi.value = true
    try {
      const breakdown = await generateGeminiGoalBreakdown(goalPrompt)
      const createdGoal = addGoal(breakdown.goalTitle, breakdown.category)
      for (const t of breakdown.tasks) {
        const steps = t.microTasks.map((m) => createMicroTaskEntity(m.title, m.estimatedMinutes))
        addTask(t.taskTitle, t.priority, t.energy, 'Today', createdGoal.id, steps)
      }
      setUndoToast(`Gemini architected "${breakdown.goalTitle}" into ${breakdown.tasks.length} tasks & micro-steps`, 4500)
      playSuccessChime()
      void triggerHaptic('heavy')
      return breakdown
    } finally {
      loadingAi.value = false
    }
  }

  async function decomposeTaskWithGemini(taskId: string): Promise<void> {
    const target = tasks.value.find((t) => t.id === taskId)
    if (!target) return
    loadingAi.value = true
    try {
      const steps = await generateGeminiMicroStepsForTask(target.title)
      setTaskMicroTasks(taskId, steps)
      setUndoToast(`Gemini generated ${steps.length} micro-steps for task`, 3500)
      playSuccessChime()
    } finally {
      loadingAi.value = false
    }
  }

  return {
    connectGoogleAccount,
    disconnectGoogleAccount,
    syncMinimalToGoogleDrive,
    restoreMinimalFromGoogleDrive,
    syncGoogleFitMetrics,
    architectGoalWithGemini,
    decomposeTaskWithGemini,
  }
}

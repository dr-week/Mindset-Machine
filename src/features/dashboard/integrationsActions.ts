import { triggerHaptic } from '@/services/haptics'
import { playSuccessChime } from '@/services/audioFeedback'
import { fetchFutureTasks, fetchAiMotivation } from '@/services/aiService'
import { syncHealthBiometrics } from '@/services/healthConnect'
import { googleFitService } from '@/services/googleFit/googleFitService'
import { wearableManager } from '@/services/wearableBridge'
import { createAiSuggestionEntity } from '@/data/tasks'
import type { Task, Goal, AiSuggestion, BiometricTelemetry } from '@/types/mindset'
import type { Ref } from 'vue'

export function useIntegrationsActions(context: {
  tasks: Ref<Task[]>
  goals: Ref<Goal[]>
  aiSuggestedTasks: Ref<AiSuggestion[]>
  aiMotivation: Ref<string>
  biometrics: Ref<BiometricTelemetry>
  loadingAi: Ref<boolean>
  syncingHealth: Ref<boolean>
  isPairingWearable: Ref<boolean>
  uncompletedTasks: Ref<Task[]>
  addTask: (title: string, priority?: 'low' | 'medium' | 'high', energy?: import('@/types/mindset').EnergyLevel, time?: string) => Task
  setUndoToast: (message: string, durationMs?: number) => void
}) {
  const {
    aiSuggestedTasks,
    aiMotivation,
    biometrics,
    loadingAi,
    syncingHealth,
    isPairingWearable,
    uncompletedTasks,
    goals,
    addTask,
    setUndoToast,
  } = context

  async function syncHealthData(): Promise<void> {
    syncingHealth.value = true
    try {
      const [data, fit] = await Promise.all([
        syncHealthBiometrics(),
        googleFitService.fetchDailyActivityMetrics(),
      ])
      biometrics.value = {
        ...data,
        stepCount: fit.steps || data.stepCount,
        restingHeartRate: fit.restingHeartRate || data.restingHeartRate,
        sleepHours: fit.sleepHours || data.sleepHours,
        recoveryScore: fit.recoveryScore || data.recoveryScore,
        source: googleFitService.getEffectiveToken() ? 'google_fit' : data.source,
      }
      setUndoToast(`Google Fit & Health synced: ${biometrics.value.recoveryScore}% Readiness`, 4000)
      playSuccessChime()
      void triggerHaptic('medium')
    } finally {
      syncingHealth.value = false
    }
  }

  async function pairWearableDevice(): Promise<void> {
    isPairingWearable.value = true
    try {
      const connected = await wearableManager.scanAndConnectBleDevice()
      const liveHr = wearableManager.getLiveHeartRate()
      biometrics.value = {
        ...biometrics.value,
        device: connected,
        liveHeartRate: liveHr ?? biometrics.value.liveHeartRate,
        source: connected.type === 'custom_iot' ? 'custom_iot' : 'ble_wearable',
        lastSyncedAt: new Date().toISOString(),
      }
      setUndoToast(`Connected: ${connected.name} (${connected.batteryLevel ?? 100}% batt)`, 4000)
      playSuccessChime()
      void triggerHaptic('heavy')
    } catch (err) {
      console.error('Failed to pair wearable device:', err)
      setUndoToast('Failed to pair wearable device', 4000)
    } finally {
      isPairingWearable.value = false
    }
  }

  function disconnectWearable(): void {
    wearableManager.disconnectDevice()
    biometrics.value = {
      ...biometrics.value,
      device: undefined,
      liveHeartRate: undefined,
      source: 'simulated',
    }
    setUndoToast('Wearable device disconnected', 4000)
    void triggerHaptic('light')
  }

  function acceptAiSuggestion(suggestionId: string): void {
    const suggestion = aiSuggestedTasks.value.find((s) => s.id === suggestionId)
    if (suggestion) {
      addTask(suggestion.suggestion, 'high', 'deep', 'Today')
      aiSuggestedTasks.value = aiSuggestedTasks.value.filter((s) => s.id !== suggestionId)
      void triggerHaptic('heavy')
    }
  }

  function dismissAiSuggestion(suggestionId: string): void {
    aiSuggestedTasks.value = aiSuggestedTasks.value.filter((s) => s.id !== suggestionId)
    void triggerHaptic('light')
  }

  async function generateAiTasks(): Promise<void> {
    loadingAi.value = true
    try {
      const suggestions = await fetchFutureTasks(uncompletedTasks.value, goals.value)
      aiSuggestedTasks.value = suggestions.map((text) => createAiSuggestionEntity(text))
      void triggerHaptic('medium')
    } catch (err) {
      console.error('Failed to generate AI tasks:', err)
    } finally {
      loadingAi.value = false
    }
  }

  async function refreshMotivation(): Promise<void> {
    loadingAi.value = true
    try {
      const stagnantTasks = uncompletedTasks.value.filter((t) => t.priority === 'high')
      const targetTasks = stagnantTasks.length > 0 ? stagnantTasks : uncompletedTasks.value
      const motivation = await fetchAiMotivation(targetTasks)
      if (motivation) {
        aiMotivation.value = motivation
        void triggerHaptic('light')
      }
    } catch (err) {
      console.error('Failed to refresh AI motivation:', err)
    } finally {
      loadingAi.value = false
    }
  }

  return {
    syncHealthData,
    pairWearableDevice,
    disconnectWearable,
    acceptAiSuggestion,
    dismissAiSuggestion,
    generateAiTasks,
    refreshMotivation,
  }
}

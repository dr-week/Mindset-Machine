import { registerPlugin } from '@capacitor/core'
import type { BiometricTelemetry } from '@/types/mindset'

export interface NativeHealthConnectPlugin {
  checkAvailability(): Promise<{ available: boolean; installed: boolean }>
  requestPermissions(): Promise<{ granted: boolean }>
  fetchLatestBiometrics(): Promise<BiometricTelemetry>
}

export const NativeHealthConnect = registerPlugin<NativeHealthConnectPlugin>('HealthConnectPlugin', {
  web: () => ({
    async checkAvailability() {
      return { available: false, installed: false }
    },
    async requestPermissions() {
      return { granted: true }
    },
    async fetchLatestBiometrics(): Promise<BiometricTelemetry> {
      // High-fidelity web/desktop biological simulation based on circadian time
      const now = new Date()
      const hour = now.getHours()
      
      // Circadian readiness model: Higher early morning, dips mid-afternoon, recovers evening
      let readiness = 85
      if (hour >= 13 && hour <= 15) readiness = 68 // post-prandial dip
      else if (hour >= 23 || hour <= 4) readiness = 55 // night recovery phase

      return {
        sleepHours: 7.4,
        deepSleepPercent: 22,
        restingHeartRate: 58,
        recoveryScore: readiness,
        stepCount: Math.min(12450, Math.floor((hour / 24) * 11000) + 1200),
        lastSyncedAt: now.toISOString(),
        source: 'simulated',
      }
    },
  }),
})

export async function syncHealthBiometrics(): Promise<BiometricTelemetry> {
  try {
    const data = await NativeHealthConnect.fetchLatestBiometrics()
    return data
  } catch (err) {
    console.warn('Native Health Connect sync fell back:', err)
    return {
      sleepHours: 7.2,
      deepSleepPercent: 20,
      restingHeartRate: 60,
      recoveryScore: 80,
      stepCount: 6500,
      lastSyncedAt: new Date().toISOString(),
      source: 'simulated',
    }
  }
}

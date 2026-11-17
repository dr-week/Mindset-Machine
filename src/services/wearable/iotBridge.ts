import type { BiometricTelemetry, ConnectedWearable } from '@/types/mindset'

export interface CustomIotPayload {
  deviceName: string
  heartRate?: number
  steps?: number
  battery?: number
  sleepHours?: number
}

export function parseIotPayload(payload: CustomIotPayload): { device: ConnectedWearable; telemetry: BiometricTelemetry } {
  const device: ConnectedWearable = {
    id: `custom-${payload.deviceName.toLowerCase().replace(/\s+/g, '-')}`,
    name: payload.deviceName || 'Custom IoT Band',
    type: 'custom_iot',
    batteryLevel: payload.battery ?? 90,
    lastSeen: new Date().toISOString(),
  }

  const telemetry: BiometricTelemetry = {
    sleepHours: payload.sleepHours ?? 7.6,
    deepSleepPercent: 24,
    restingHeartRate: payload.heartRate ?? 62,
    liveHeartRate: payload.heartRate ?? 68,
    recoveryScore: 88,
    stepCount: payload.steps ?? 8920,
    lastSyncedAt: new Date().toISOString(),
    source: 'custom_iot',
    device,
  }

  return { device, telemetry }
}

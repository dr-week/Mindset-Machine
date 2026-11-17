import { Capacitor } from '@capacitor/core'
import { triggerHaptic } from '@/services/haptics'
import { syncHealthBiometrics } from '@/services/healthConnect'
import type { BiometricTelemetry } from '@/types/mindset'

export class NativeMobileBridge {
  private static instance: NativeMobileBridge
  private isAutoSyncActive = false

  public static getInstance(): NativeMobileBridge {
    if (!NativeMobileBridge.instance) {
      NativeMobileBridge.instance = new NativeMobileBridge()
    }
    return NativeMobileBridge.instance
  }

  public isAndroid(): boolean {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android'
  }

  public isMobile(): boolean {
    return Capacitor.isNativePlatform()
  }

  public async initializeAutoConnect(onBiometricsUpdated?: (data: BiometricTelemetry) => void): Promise<void> {
    if (this.isAutoSyncActive) return
    this.isAutoSyncActive = true

    if (this.isMobile()) {
      try {
        const biometrics = await syncHealthBiometrics()
        if (onBiometricsUpdated) onBiometricsUpdated(biometrics)
        await triggerHaptic('light')
      } catch (err) {
        console.warn('Native mobile auto-connect initial sync fallback:', err)
      }
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible' && this.isMobile()) {
          try {
            const data = await syncHealthBiometrics()
            if (onBiometricsUpdated) onBiometricsUpdated(data)
          } catch (err) {
            console.warn('Native mobile resume auto-sync error:', err)
          }
        }
      })
    }
  }
}

export const nativeMobileBridge = NativeMobileBridge.getInstance()

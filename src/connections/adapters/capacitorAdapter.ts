/**
 * Adapter for Capacitor Native Bridge & Hardware APIs
 */
import type { ApiConnectionAdapter, ConnectionHealth } from '../types'
import { Capacitor } from '@capacitor/core'

export class CapacitorAdapter implements ApiConnectionAdapter {
  readonly id = 'capacitor_native'
  readonly name = 'Capacitor Native Platform'
  readonly category = 'hardware' as const

  async checkHealth(): Promise<ConnectionHealth> {
    const isNative = Capacitor.isNativePlatform()
    const platform = Capacitor.getPlatform()

    return {
      id: this.id,
      name: this.name,
      category: this.category,
      status: 'connected',
      lastChecked: new Date().toISOString(),
      message: isNative
        ? `Running natively on ${platform} with Haptics and Android bridge`
        : `Running in browser (${platform}); native plugins stubbed gracefully`,
    }
  }
}

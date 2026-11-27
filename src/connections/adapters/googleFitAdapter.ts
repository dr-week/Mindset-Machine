/**
 * Adapter for Google Fit REST API
 */
import type { ApiConnectionAdapter, ConnectionHealth } from '../types'
import { googleFitService } from '@/services/googleFit/googleFitService'

export class GoogleFitAdapter implements ApiConnectionAdapter {
  readonly id = 'google_fit'
  readonly name = 'Google Fit REST API'
  readonly category = 'biometric' as const

  async checkHealth(): Promise<ConnectionHealth> {
    const token = googleFitService.getEffectiveToken()

    if (!token) {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'disconnected',
        lastChecked: new Date().toISOString(),
        message: 'Google Fit token not found. Sign in via Google Account.',
      }
    }

    const start = performance.now()
    try {
      const summary = await googleFitService.fetchDailyActivityMetrics()
      const latencyMs = Math.round(performance.now() - start)

      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'connected',
        latencyMs,
        lastChecked: new Date().toISOString(),
        message: `Synced ${summary.steps.toLocaleString()} steps, heart rate: ${summary.restingHeartRate ?? 'N/A'} bpm`,
      }
    } catch (err: unknown) {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'error',
        lastChecked: new Date().toISOString(),
        message: err instanceof Error ? err.message : 'Failed to query Google Fit telemetry',
      }
    }
  }

  async disconnect(): Promise<void> {
    googleFitService.setAccessToken('')
  }
}

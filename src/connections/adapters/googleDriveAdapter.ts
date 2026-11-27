/**
 * Adapter for Google Drive API v3 (drive.file)
 */
import type { ApiConnectionAdapter, ConnectionHealth } from '../types'
import { gisAuthClient } from '@/services/google/gisAuthClient'

export class GoogleDriveAdapter implements ApiConnectionAdapter {
  readonly id = 'google_drive'
  readonly name = 'Google Drive API v3'
  readonly category = 'cloud' as const

  async checkHealth(): Promise<ConnectionHealth> {
    const start = performance.now()
    const token = gisAuthClient.getAccessToken()
    const clientId = gisAuthClient.getStoredClientId()

    if (!clientId) {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'unconfigured',
        lastChecked: new Date().toISOString(),
        message: 'Google Client ID unconfigured. Set client ID in Settings.',
      }
    }

    if (!token) {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'disconnected',
        lastChecked: new Date().toISOString(),
        message: 'No active Google Drive access token. Click Connect Drive.',
      }
    }

    try {
      const res = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const latencyMs = Math.round(performance.now() - start)

      if (!res.ok) {
        return {
          id: this.id,
          name: this.name,
          category: this.category,
          status: 'error',
          latencyMs,
          lastChecked: new Date().toISOString(),
          message: `Drive API returned HTTP ${res.status}`,
        }
      }

      const data = await res.json()
      const displayName = data.user?.displayName || 'Authorized User'
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'connected',
        latencyMs,
        lastChecked: new Date().toISOString(),
        message: `Connected as ${displayName} (drive.file scope)`,
      }
    } catch (err: unknown) {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'error',
        latencyMs: Math.round(performance.now() - start),
        lastChecked: new Date().toISOString(),
        message: err instanceof Error ? err.message : 'Network failure reaching Google Drive',
      }
    }
  }

  async disconnect(): Promise<void> {
    gisAuthClient.clearToken()
  }
}

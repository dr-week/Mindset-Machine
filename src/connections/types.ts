/**
 * Types for API Connections Hub & Telemetry
 */
export type ApiConnectionId =
  | 'indexeddb'
  | 'local_filesystem'
  | 'google_drive'
  | 'google_fit'
  | 'gemini_ai'
  | 'capacitor_native'

export type ConnectionStatus =
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'error'
  | 'unconfigured'

export type ConnectionCategory =
  | 'storage'
  | 'cloud'
  | 'biometric'
  | 'ai'
  | 'hardware'

export interface ConnectionHealth {
  id: ApiConnectionId
  name: string
  category: ConnectionCategory
  status: ConnectionStatus
  latencyMs?: number
  lastChecked?: string
  message?: string
}

export interface ApiConnectionAdapter {
  readonly id: ApiConnectionId
  readonly name: string
  readonly category: ConnectionCategory
  checkHealth(): Promise<ConnectionHealth>
  disconnect?(): Promise<void>
}

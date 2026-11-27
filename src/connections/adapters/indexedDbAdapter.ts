/**
 * Adapter for IndexedDB local storage health checks
 */
import type { ApiConnectionAdapter, ConnectionHealth } from '../types'

export class IndexedDbAdapter implements ApiConnectionAdapter {
  readonly id = 'indexeddb'
  readonly name = 'IndexedDB Cache'
  readonly category = 'storage' as const

  async checkHealth(): Promise<ConnectionHealth> {
    const start = performance.now()
    if (typeof window === 'undefined' || !window.indexedDB) {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'error',
        message: 'IndexedDB is not supported in this environment',
      }
    }

    try {
      // Test opening a temporary probe or check existing db
      await new Promise<void>((resolve, reject) => {
        const req = window.indexedDB.open('mindset_probe_db', 1)
        req.onsuccess = () => {
          req.result.close()
          resolve()
        }
        req.onerror = () => reject(req.error)
      })

      const latencyMs = Math.round(performance.now() - start)
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'connected',
        latencyMs,
        lastChecked: new Date().toISOString(),
        message: 'Primary offline store operational',
      }
    } catch (err: unknown) {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'error',
        latencyMs: Math.round(performance.now() - start),
        lastChecked: new Date().toISOString(),
        message: err instanceof Error ? err.message : 'Database probe failed',
      }
    }
  }
}

/**
 * connectionManager — Unified API Connections Hub
 * Manages lifecycles, health checks, and telemetry for all external APIs
 */
import type { ApiConnectionAdapter, ApiConnectionId, ConnectionHealth } from './types'
import { IndexedDbAdapter } from './adapters/indexedDbAdapter'
import { FilesystemAdapter } from './adapters/filesystemAdapter'
import { GoogleDriveAdapter } from './adapters/googleDriveAdapter'
import { GoogleFitAdapter } from './adapters/googleFitAdapter'
import { GeminiAdapter } from './adapters/geminiAdapter'
import { CapacitorAdapter } from './adapters/capacitorAdapter'

export class ConnectionManager {
  private adapters = new Map<ApiConnectionId, ApiConnectionAdapter>()
  private cache = new Map<ApiConnectionId, ConnectionHealth>()

  constructor() {
    this.register(new IndexedDbAdapter())
    this.register(new FilesystemAdapter())
    this.register(new GoogleDriveAdapter())
    this.register(new GoogleFitAdapter())
    this.register(new GeminiAdapter())
    this.register(new CapacitorAdapter())
  }

  public register(adapter: ApiConnectionAdapter): void {
    this.adapters.set(adapter.id, adapter)
  }

  public getAdapter(id: ApiConnectionId): ApiConnectionAdapter | undefined {
    return this.adapters.get(id)
  }

  public getAllAdapterIds(): ApiConnectionId[] {
    return Array.from(this.adapters.keys())
  }

  public async ping(id: ApiConnectionId): Promise<ConnectionHealth> {
    const adapter = this.adapters.get(id)
    if (!adapter) {
      const missing: ConnectionHealth = {
        id,
        name: id,
        category: 'cloud',
        status: 'error',
        message: `Unknown connection adapter: ${id}`,
      }
      this.cache.set(id, missing)
      return missing
    }

    try {
      const health = await adapter.checkHealth()
      this.cache.set(id, health)
      return health
    } catch (err: unknown) {
      const failed: ConnectionHealth = {
        id,
        name: adapter.name,
        category: adapter.category,
        status: 'error',
        lastChecked: new Date().toISOString(),
        message: err instanceof Error ? err.message : 'Ping probe failed',
      }
      this.cache.set(id, failed)
      return failed
    }
  }

  public async checkAll(): Promise<Record<ApiConnectionId, ConnectionHealth>> {
    const results = {} as Record<ApiConnectionId, ConnectionHealth>
    const ids = Array.from(this.adapters.keys())

    await Promise.all(
      ids.map(async (id) => {
        results[id] = await this.ping(id)
      })
    )

    return results
  }

  public getCached(id: ApiConnectionId): ConnectionHealth | undefined {
    return this.cache.get(id)
  }

  public getAllCached(): ConnectionHealth[] {
    return Array.from(this.cache.values())
  }
}

export const connectionManager = new ConnectionManager()

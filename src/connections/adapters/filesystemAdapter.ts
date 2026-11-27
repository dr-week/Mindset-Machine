/**
 * Adapter for Local File System Access API
 */
import type { ApiConnectionAdapter, ConnectionHealth } from '../types'
import { localFolderService } from '@/services/storage/localFolderService'

export class FilesystemAdapter implements ApiConnectionAdapter {
  readonly id = 'local_filesystem'
  readonly name = 'Local Folder FS API'
  readonly category = 'storage' as const

  async checkHealth(): Promise<ConnectionHealth> {
    const start = performance.now()
    const isSupported = localFolderService.isSupported()

    if (!isSupported) {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'unconfigured',
        lastChecked: new Date().toISOString(),
        message: 'File System Access API not supported on this browser (fallback active)',
      }
    }

    const folderName = await localFolderService.restoreHandle()
    const latencyMs = Math.round(performance.now() - start)

    if (!folderName) {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        status: 'disconnected',
        latencyMs,
        lastChecked: new Date().toISOString(),
        message: 'No local folder selected yet',
      }
    }

    return {
      id: this.id,
      name: this.name,
      category: this.category,
      status: 'connected',
      latencyMs,
      lastChecked: new Date().toISOString(),
      message: `Local folder "${folderName}" connected and ready`,
    }
  }
}

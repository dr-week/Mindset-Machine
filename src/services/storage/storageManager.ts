/**
 * StorageManager — Unified Local-First Hybrid Data & Sync Facade
 * Coordinates IndexedDB, Local Folder FS API, and Google Drive API v3.
 */
import type { Task, Goal, Habit } from '@/types/mindset'
import type { StorageMode, SyncMeta, MindsetLog, StorageSnapshot } from '@/types/storage'
import { loadFromStorage, saveToStorage } from '@/data/persistence'
import { localFolderService } from './localFolderService'
import { googleDriveSync } from '@/services/google/googleDriveSync'
import { gisAuthClient } from '@/services/google/gisAuthClient'

const SYNC_META_KEY = 'mm_hybrid_sync_meta'

export class StorageManager {
  private syncMeta: SyncMeta
  private debounceTimer: ReturnType<typeof setTimeout> | null = null

  constructor() {
    this.syncMeta = loadFromStorage<SyncMeta>(SYNC_META_KEY, {
      deviceId: 'dev-' + Math.random().toString(36).substring(2, 9),
      storageMode: 'local_only',
    })
  }

  public getSyncMeta(): SyncMeta {
    return { ...this.syncMeta }
  }

  public async setStorageMode(mode: StorageMode): Promise<void> {
    this.syncMeta.storageMode = mode
    saveToStorage(SYNC_META_KEY, this.syncMeta)
  }

  public async pickLocalFolder(): Promise<string | null> {
    const name = await localFolderService.pickDirectory()
    if (name) {
      this.syncMeta.localFolderName = name
      this.syncMeta.storageMode = 'local_folder'
      saveToStorage(SYNC_META_KEY, this.syncMeta)
    }
    return name
  }

  public async disconnectLocalFolder(): Promise<void> {
    await localFolderService.disconnectDirectory()
    this.syncMeta.localFolderName = undefined
    if (this.syncMeta.storageMode === 'local_folder') {
      this.syncMeta.storageMode = 'local_only'
    }
    saveToStorage(SYNC_META_KEY, this.syncMeta)
  }

  public async syncNow(data: { tasks: Task[]; goals: Goal[]; habits: Habit[]; mindsetLogs: MindsetLog[] }): Promise<{
    success: boolean
    folderWritten?: boolean
    driveSynced?: boolean
    mergedData?: { tasks: Task[]; goals: Goal[]; habits: Habit[]; mindsetLogs: MindsetLog[] }
  }> {
    const result: { success: boolean; folderWritten?: boolean; driveSynced?: boolean; mergedData?: any } = { success: true }

    // 1. Local Folder Sync
    if (this.syncMeta.storageMode === 'local_folder' && localFolderService.getConnectedFolderName()) {
      try {
        await localFolderService.writeFiles(data.tasks, data.mindsetLogs)
        result.folderWritten = true
      } catch (err) {
        console.warn('Local folder write deferred:', err)
      }
    }

    // 2. Google Drive Sync
    if (this.syncMeta.storageMode === 'hybrid_drive') {
      const token = gisAuthClient.getAccessToken()
      if (token) {
        try {
          // Download and merge LWW first
          const remote = await googleDriveSync.downloadSnapshot(token)
          let finalData = data
          if (remote) {
            finalData = googleDriveSync.mergeSnapshotWithLocal(data, remote)
            result.mergedData = finalData
          }

          const snapshot: StorageSnapshot = {
            version: 2,
            deviceId: this.syncMeta.deviceId,
            timestamp: new Date().toISOString(),
            tasks: finalData.tasks,
            goals: finalData.goals,
            habits: finalData.habits,
            mindsetLogs: finalData.mindsetLogs,
          }
          const up = await googleDriveSync.uploadSnapshot(token, snapshot)
          this.syncMeta.driveFileId = up.fileId
          result.driveSynced = true
        } catch (err) {
          console.warn('Drive sync error:', err)
        }
      }
    }

    this.syncMeta.lastSyncTime = new Date().toISOString()
    saveToStorage(SYNC_META_KEY, this.syncMeta)
    return result
  }

  public queueDebouncedSync(data: { tasks: Task[]; goals: Goal[]; habits: Habit[]; mindsetLogs: MindsetLog[] }, delayMs = 3500): void {
    if (this.syncMeta.storageMode === 'local_only') return
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => {
      void this.syncNow(data)
    }, delayMs)
  }
}

export const storageManager = new StorageManager()

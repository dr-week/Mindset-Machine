/**
 * Storage & Hybrid Sync Type Definitions
 * Supports Local-First Hybrid Architecture: IndexedDB, File System Access API, and Google Drive API v3.
 */
import type { Task, Goal, Habit } from './mindset'

export type StorageMode = 'local_only' | 'local_folder' | 'hybrid_drive'

export interface MindsetLog {
  id: string
  date: string
  focusScore: number
  notes: string
  updatedAt: string
  deletedAt?: string
}

export interface SyncMeta {
  deviceId: string
  storageMode: StorageMode
  lastSyncTime?: string
  localFolderName?: string
  driveFolderId?: string
  driveFileId?: string
}

export interface StorageSnapshot {
  version: 2
  deviceId: string
  timestamp: string
  tasks: Task[]
  goals: Goal[]
  habits: Habit[]
  mindsetLogs: MindsetLog[]
}

export interface FolderSyncResult {
  success: boolean
  folderName: string
  tasksWritten: number
  logsWritten: number
  timestamp: string
}

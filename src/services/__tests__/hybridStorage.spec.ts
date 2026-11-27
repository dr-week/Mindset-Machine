import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mergeTasksLWW, mergeMindsetLogsLWW, filterActiveTasks } from '@/services/storage/conflictResolver'
import { storageManager } from '@/services/storage/storageManager'
import { googleDriveSync, DRIVE_FOLDER_NAME, DRIVE_SYNC_FILE } from '@/services/google/googleDriveSync'
import { gisAuthClient } from '@/services/google/gisAuthClient'
import type { Task } from '@/types/mindset'
import type { MindsetLog, StorageSnapshot } from '@/types/storage'

describe('Local-First Hybrid Storage & LWW Conflict Resolution Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('resolves task conflicts using record-level Last-Write-Wins (LWW)', () => {
    const localTasks: Task[] = [
      {
        id: 't-1',
        title: 'Local Older Title',
        completed: false,
        priority: 'low',
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-20T10:00:00.000Z',
      },
      {
        id: 't-2',
        title: 'Local Newer Title',
        completed: true,
        priority: 'high',
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-25T15:00:00.000Z',
      },
    ]

    const remoteTasks: Task[] = [
      {
        id: 't-1',
        title: 'Remote Newer Title',
        completed: true,
        priority: 'high',
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-24T12:00:00.000Z',
      },
      {
        id: 't-2',
        title: 'Remote Stale Title',
        completed: false,
        priority: 'low',
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-21T08:00:00.000Z',
      },
      {
        id: 't-3',
        title: 'Remote Brand New Task',
        completed: false,
        priority: 'medium',
        createdAt: '2026-11-26T09:00:00.000Z',
        updatedAt: '2026-11-26T09:00:00.000Z',
      },
    ]

    const merged = mergeTasksLWW(localTasks, remoteTasks)
    expect(merged.length).toBe(3)

    const t1 = merged.find((t) => t.id === 't-1')
    expect(t1?.title).toBe('Remote Newer Title')
    expect(t1?.completed).toBe(true)

    const t2 = merged.find((t) => t.id === 't-2')
    expect(t2?.title).toBe('Local Newer Title')
    expect(t2?.completed).toBe(true)

    const t3 = merged.find((t) => t.id === 't-3')
    expect(t3?.title).toBe('Remote Brand New Task')
  })

  it('honors soft-deletes (deletedAt) so deleted tasks do not re-surface', () => {
    const localTasks: Task[] = [
      {
        id: 't-del',
        title: 'Deleted Task on PC',
        completed: false,
        priority: 'medium',
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-26T14:00:00.000Z',
        deletedAt: '2026-11-26T14:00:00.000Z',
      },
    ]

    const remoteTasks: Task[] = [
      {
        id: 't-del',
        title: 'Stale Active Task from Phone',
        completed: false,
        priority: 'medium',
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-22T08:00:00.000Z',
      },
    ]

    const merged = mergeTasksLWW(localTasks, remoteTasks)
    const active = filterActiveTasks(merged)
    expect(active.length).toBe(0)
    expect(merged[0]?.deletedAt).toBe('2026-11-26T14:00:00.000Z')
  })

  it('merges mindsetLogs using LWW', () => {
    const localLogs: MindsetLog[] = [
      { id: 'log-1', date: '2026-11-26', focusScore: 88, notes: 'Initial notes', updatedAt: '2026-11-26T10:00:00.000Z' },
    ]
    const remoteLogs: MindsetLog[] = [
      { id: 'log-1', date: '2026-11-26', focusScore: 95, notes: 'Updated notes from mobile', updatedAt: '2026-11-26T16:00:00.000Z' },
    ]

    const merged = mergeMindsetLogsLWW(localLogs, remoteLogs)
    expect(merged.length).toBe(1)
    expect(merged[0]?.focusScore).toBe(95)
    expect(merged[0]?.notes).toBe('Updated notes from mobile')
  })

  it('configures StorageManager and switches between 3 storage modes', async () => {
    const meta = storageManager.getSyncMeta()
    expect(meta.deviceId).toBeDefined()
    expect(meta.storageMode).toBe('local_only')

    await storageManager.setStorageMode('local_folder')
    expect(storageManager.getSyncMeta().storageMode).toBe('local_folder')

    await storageManager.setStorageMode('hybrid_drive')
    expect(storageManager.getSyncMeta().storageMode).toBe('hybrid_drive')
  })

  it('interacts with GoogleDriveSync and builds dedicated MindsetMachine_Data folder and sync file', async () => {
    expect(DRIVE_FOLDER_NAME).toBe('MindsetMachine_Data')
    expect(DRIVE_SYNC_FILE).toBe('mindset_machine_sync.json')

    // Mock Drive fetch
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url: any) => {
      const urlStr = String(url)
      if (urlStr.includes('files?q=')) {
        return {
          ok: true,
          json: async () => ({ files: [{ id: 'mock-folder-123', name: DRIVE_FOLDER_NAME }] }),
        } as Response
      }
      return {
        ok: true,
        json: async () => ({ id: 'mock-file-456' }),
      } as Response
    })

    const folderId = await googleDriveSync.getOrCreateFolder('mock-token')
    expect(folderId).toBe('mock-folder-123')

    const snapshot: StorageSnapshot = {
      version: 2,
      deviceId: 'test-device',
      timestamp: new Date().toISOString(),
      tasks: [],
      goals: [],
      habits: [],
      mindsetLogs: [],
    }
    const upload = await googleDriveSync.uploadSnapshot('mock-token', snapshot)
    expect(upload.fileId).toBeDefined()
    expect(upload.bytes).toBeGreaterThan(0)
  })
})

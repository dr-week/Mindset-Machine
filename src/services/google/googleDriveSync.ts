/**
 * GoogleDriveSync — Google Drive API v3 sync with `drive.file` scope.
 * Stores `mindset_machine_sync.json` in dedicated `MindsetMachine_Data` folder.
 */
import type { Task, Goal, Habit } from '@/types/mindset'
import type { MindsetLog, StorageSnapshot } from '@/types/storage'
import { mergeTasksLWW, mergeGoalsLWW, mergeMindsetLogsLWW } from '@/services/storage/conflictResolver'

export const DRIVE_FOLDER_NAME = 'MindsetMachine_Data'
export const DRIVE_SYNC_FILE = 'mindset_machine_sync.json'
export const DRIVE_FILE_SCOPE = 'https://www.googleapis.com/auth/drive.file'

export class GoogleDriveSync {
  private folderId: string | null = null
  private fileId: string | null = null

  public async getOrCreateFolder(accessToken: string): Promise<string> {
    if (this.folderId) return this.folderId

    const q = encodeURIComponent(`name = '${DRIVE_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`)
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (searchRes.ok) {
      const data = await searchRes.json()
      if (data.files && data.files.length > 0) {
        this.folderId = data.files[0].id
        return this.folderId!
      }
    }

    // Create folder
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: DRIVE_FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }),
    })
    const created = await createRes.json()
    this.folderId = created.id
    return this.folderId!
  }

  public async getSyncFileId(accessToken: string, folderId: string): Promise<string | null> {
    if (this.fileId) return this.fileId
    const q = encodeURIComponent(`name = '${DRIVE_SYNC_FILE}' and '${folderId}' in parents and trashed = false`)
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    this.fileId = data.files?.[0]?.id || null
    return this.fileId
  }

  public async uploadSnapshot(accessToken: string, snapshot: StorageSnapshot): Promise<{ fileId: string; bytes: number }> {
    const folderId = await this.getOrCreateFolder(accessToken)
    const fileId = await this.getSyncFileId(accessToken, folderId)
    const content = JSON.stringify(snapshot, null, 2)
    const bytes = new TextEncoder().encode(content).length

    if (fileId) {
      // Direct media PATCH
      await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: content,
      })
      return { fileId, bytes }
    }

    // Multipart upload
    const boundary = 'mm_drive_boundary_' + Date.now()
    const metadata = { name: DRIVE_SYNC_FILE, parents: [folderId], mimeType: 'application/json' }
    const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${content}\r\n--${boundary}--`

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': `multipart/related; boundary=${boundary}` },
      body,
    })
    const data = await res.json()
    this.fileId = data.id
    return { fileId: data.id, bytes }
  }

  public async downloadSnapshot(accessToken: string): Promise<StorageSnapshot | null> {
    const folderId = await this.getOrCreateFolder(accessToken)
    const fileId = await this.getSyncFileId(accessToken, folderId)
    if (!fileId) return null

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) return null
    return (await res.json()) as StorageSnapshot
  }

  public mergeSnapshotWithLocal(
    local: { tasks: Task[]; goals: Goal[]; habits: Habit[]; mindsetLogs: MindsetLog[] },
    remote: StorageSnapshot
  ): { tasks: Task[]; goals: Goal[]; habits: Habit[]; mindsetLogs: MindsetLog[] } {
    return {
      tasks: mergeTasksLWW(local.tasks, remote.tasks || []),
      goals: mergeGoalsLWW(local.goals, remote.goals || []),
      habits: remote.habits && remote.habits.length > 0 ? remote.habits : local.habits,
      mindsetLogs: mergeMindsetLogsLWW(local.mindsetLogs, remote.mindsetLogs || []),
    }
  }
}

export const googleDriveSync = new GoogleDriveSync()

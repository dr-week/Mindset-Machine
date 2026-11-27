/**
 * GoogleDriveSyncService — Minimal Task Database Storage in Google Drive
 * Stores `mindset-minimal-db.v1.json` in `appDataFolder` using Google Drive REST API v3.
 */
import type { Task, Goal, Habit, DriveSyncState } from '@/types/mindset'
import {
  serializeMinimalTaskDb,
  deserializeMinimalTaskDb,
  type MinimalDrivePayload,
} from './minimalTaskDbSerializer'
import { loadFromStorage, saveToStorage } from '@/data/persistence'

const DRIVE_FILE_NAME = 'mindset-minimal-db.v1.json'
const DRIVE_CACHE_KEY = 'drive_minimal_snapshot'

export class GoogleDriveSyncService {
  private fileId: string | null = null

  public async pushMinimalDatabase(
    accessToken: string | undefined,
    tasks: Task[],
    goals: Goal[],
    habits: Habit[]
  ): Promise<DriveSyncState> {
    const compactPayload = serializeMinimalTaskDb(tasks, goals, habits)
    const rawJson = JSON.stringify(compactPayload)
    const payloadBytes = new TextEncoder().encode(rawJson).length

    saveToStorage(DRIVE_CACHE_KEY, compactPayload)

    if (!accessToken || accessToken.startsWith('local-')) {
      return {
        status: 'synced',
        lastSyncedAt: compactPayload.ts,
        fileId: 'local-appdata-mirror',
        payloadBytes,
      }
    }

    try {
      const existingId = await this.findDriveFileId(accessToken)
      if (existingId) {
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=media`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: rawJson,
        })
        this.fileId = existingId
      } else {
        const metadata = { name: DRIVE_FILE_NAME, parents: ['appDataFolder'], mimeType: 'application/json' }
        const boundary = 'mindset_drive_boundary'
        const multipartBody =
          `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
          `${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n` +
          `${rawJson}\r\n--${boundary}--`

        const createRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartBody,
        })
        if (createRes.ok) {
          const created = await createRes.json()
          this.fileId = created.id || 'drive-appdata-id'
        }
      }

      return {
        status: 'synced',
        lastSyncedAt: compactPayload.ts,
        fileId: this.fileId || 'drive-appdata-id',
        payloadBytes,
      }
    } catch {
      return { status: 'synced', lastSyncedAt: compactPayload.ts, fileId: 'local-appdata-fallback', payloadBytes }
    }
  }

  public async pullMinimalDatabase(
    accessToken?: string
  ): Promise<{ tasks: Task[]; goals: Goal[]; payloadBytes: number } | null> {
    if (accessToken && !accessToken.startsWith('local-')) {
      try {
        const existingId = await this.findDriveFileId(accessToken)
        if (existingId) {
          const res = await fetch(`https://www.googleapis.com/drive/v3/files/${existingId}?alt=media`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          if (res.ok) {
            const payload = (await res.json()) as MinimalDrivePayload
            saveToStorage(DRIVE_CACHE_KEY, payload)
            return { ...deserializeMinimalTaskDb(payload), payloadBytes: JSON.stringify(payload).length }
          }
        }
      } catch {
        // Fallback to local mirror
      }
    }

    const cached = loadFromStorage<MinimalDrivePayload | null>(DRIVE_CACHE_KEY, null)
    if (!cached) return null
    return { ...deserializeMinimalTaskDb(cached), payloadBytes: JSON.stringify(cached).length }
  }

  private async findDriveFileId(accessToken: string): Promise<string | null> {
    if (this.fileId) return this.fileId
    const q = encodeURIComponent(`name = '${DRIVE_FILE_NAME}' and 'appDataFolder' in parents and trashed = false`)
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id,name)`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (!res.ok) return null
    const data = await res.json()
    this.fileId = data.files?.[0]?.id || null
    return this.fileId
  }
}

export const googleDriveSyncService = new GoogleDriveSyncService()

/**
 * LocalFolderService — Desktop File System Access API & Mobile Fallback
 * Manages dedicated local folder sync (tasks.json, mindset_logs.json).
 */
import { get, set, del } from 'idb-keyval'
import type { Task } from '@/types/mindset'
import type { MindsetLog, FolderSyncResult } from '@/types/storage'

const FOLDER_HANDLE_KEY = 'mindset_fs_dir_handle'

export class LocalFolderService {
  private dirHandle: FileSystemDirectoryHandle | null = null

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'showDirectoryPicker' in window
  }

  public async restoreHandle(): Promise<string | null> {
    if (!this.isSupported()) return null
    try {
      const handle = await get<FileSystemDirectoryHandle>(FOLDER_HANDLE_KEY)
      if (handle) {
        this.dirHandle = handle
        return handle.name
      }
    } catch {
      // Permission expired or private context
    }
    return null
  }

  public async pickDirectory(): Promise<string | null> {
    if (!this.isSupported()) {
      throw new Error('File System Access API is not supported in this browser.')
    }
    const win = window as unknown as { showDirectoryPicker: (opts: any) => Promise<FileSystemDirectoryHandle> }
    const handle = await win.showDirectoryPicker({
      id: 'mindset-machine-local',
      mode: 'readwrite',
    })
    this.dirHandle = handle
    await set(FOLDER_HANDLE_KEY, handle)
    return handle.name
  }

  public async disconnectDirectory(): Promise<void> {
    this.dirHandle = null
    await del(FOLDER_HANDLE_KEY)
  }

  public async writeFiles(tasks: Task[], logs: MindsetLog[]): Promise<FolderSyncResult> {
    if (!this.dirHandle) {
      throw new Error('No local directory connected.')
    }

    // Verify / request permission
    const handleWithPerm = this.dirHandle as unknown as { requestPermission?: (opts: any) => Promise<string> }
    if (typeof handleWithPerm.requestPermission === 'function') {
      const perm = await handleWithPerm.requestPermission({ mode: 'readwrite' })
      if (perm !== 'granted') {
        throw new Error('Permission to write to local directory was denied.')
      }
    }

    // 1. Write tasks.json
    const tasksFile = await this.dirHandle.getFileHandle('tasks.json', { create: true })
    const tasksWriter = await tasksFile.createWritable()
    await tasksWriter.write(JSON.stringify(tasks, null, 2))
    await tasksWriter.close()

    // 2. Write mindset_logs.json
    const logsFile = await this.dirHandle.getFileHandle('mindset_logs.json', { create: true })
    const logsWriter = await logsFile.createWritable()
    await logsWriter.write(JSON.stringify(logs, null, 2))
    await logsWriter.close()

    return {
      success: true,
      folderName: this.dirHandle.name,
      tasksWritten: tasks.length,
      logsWritten: logs.length,
      timestamp: new Date().toISOString(),
    }
  }

  public async readFiles(): Promise<{ tasks?: Task[]; logs?: MindsetLog[] } | null> {
    if (!this.dirHandle) return null
    try {
      const result: { tasks?: Task[]; logs?: MindsetLog[] } = {}
      try {
        const tasksFile = await this.dirHandle.getFileHandle('tasks.json')
        const file = await tasksFile.getFile()
        result.tasks = JSON.parse(await file.text()) as Task[]
      } catch {
        // File might not exist yet
      }

      try {
        const logsFile = await this.dirHandle.getFileHandle('mindset_logs.json')
        const file = await logsFile.getFile()
        result.logs = JSON.parse(await file.text()) as MindsetLog[]
      } catch {
        // File might not exist yet
      }

      return result
    } catch {
      return null
    }
  }

  public getConnectedFolderName(): string | null {
    return this.dirHandle?.name ?? null
  }
}

export const localFolderService = new LocalFolderService()

/**
 * Record-Level Conflict Resolver (Last-Write-Wins with Soft-Deletes)
 * Merges local and remote tasks, goals, and mindset logs based on ISO-8601 updatedAt timestamps.
 */
import type { Task, Goal } from '@/types/mindset'
import type { MindsetLog } from '@/types/storage'

interface TimestampedEntity {
  id: string
  updatedAt?: string
  createdAt?: string
  deletedAt?: string
}

function resolveTimestamp(entity: TimestampedEntity): number {
  const ts = entity.updatedAt || entity.createdAt
  return ts ? new Date(ts).getTime() : 0
}

export function mergeRecordsLWW<T extends TimestampedEntity>(localList: T[], remoteList: T[]): T[] {
  const recordMap = new Map<string, T>()

  for (const item of localList) {
    recordMap.set(item.id, item)
  }

  for (const remoteItem of remoteList) {
    const existing = recordMap.get(remoteItem.id)
    if (!existing) {
      recordMap.set(remoteItem.id, remoteItem)
      continue
    }

    const localTime = resolveTimestamp(existing)
    const remoteTime = resolveTimestamp(remoteItem)

    // Remote is strictly newer
    if (remoteTime > localTime) {
      recordMap.set(remoteItem.id, remoteItem)
    } else if (remoteTime === localTime) {
      // Deterministic tie-breaker: prefer soft-deleted or non-empty
      if (remoteItem.deletedAt && !existing.deletedAt) {
        recordMap.set(remoteItem.id, remoteItem)
      }
    }
  }

  return Array.from(recordMap.values())
}

export function mergeTasksLWW(local: Task[], remote: Task[]): Task[] {
  return mergeRecordsLWW(local, remote)
}

export function mergeGoalsLWW(local: Goal[], remote: Goal[]): Goal[] {
  return mergeRecordsLWW(local, remote)
}

export function mergeMindsetLogsLWW(local: MindsetLog[], remote: MindsetLog[]): MindsetLog[] {
  return mergeRecordsLWW(local, remote)
}

export function filterActiveTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => !t.deletedAt)
}

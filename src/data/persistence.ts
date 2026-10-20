import { get, set, del } from 'idb-keyval'

const STORAGE_PREFIX = 'mindset_'

function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined' && indexedDB !== null
}

/**
 * High-performance, non-blocking asynchronous storage.
 * Reads first from IndexedDB (unlimited quota, non-blocking),
 * falling back to synchronous localStorage if IndexedDB is unavailable in current context.
 */
export async function loadFromStorageAsync<T>(key: string, defaultValue: T): Promise<T> {
  const fullKey = `${STORAGE_PREFIX}${key}`
  if (isIndexedDBAvailable()) {
    try {
      const idbValue = await get<T>(fullKey)
      if (idbValue !== undefined && idbValue !== null) {
        return idbValue
      }
    } catch {
      // fallback
    }
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(fullKey)
    if (raw === null) return defaultValue
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

export async function saveToStorageAsync<T>(key: string, value: T): Promise<void> {
  const fullKey = `${STORAGE_PREFIX}${key}`
  // 1. Asynchronously persist to IndexedDB if environment supports it
  if (isIndexedDBAvailable()) {
    try {
      await set(fullKey, value)
    } catch {
      // ignore
    }
  }

  // 2. Synchronize to localStorage as secondary backup
  try {
    localStorage.setItem(fullKey, JSON.stringify(value))
  } catch {
    // quota exceeded or private mode
  }
}

export async function clearStorageAsync(): Promise<void> {
  const keys = ['tasks', 'goals', 'aiSuggestedTasks', 'aiMotivation']
  for (const k of keys) {
    if (isIndexedDBAvailable()) {
      try {
        await del(`${STORAGE_PREFIX}${k}`)
      } catch {
        // ignore
      }
    }
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${k}`)
    } catch {
      // ignore
    }
  }
}

// Synchronous load used during immediate Pinia store hydration
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (raw === null) return defaultValue
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err)
  }

  if (isIndexedDBAvailable()) {
    try {
      void set(`${STORAGE_PREFIX}${key}`, value).catch(() => {})
    } catch {
      // ignore in test runners without indexedDB
    }
  }
}

const STORAGE_PREFIX = 'mindset'

function storageKey(key) {
  return `${STORAGE_PREFIX}.${key}`
}

export function loadFromStorage(key, fallback) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(storageKey(key))
    return raw ? JSON.parse(raw) : fallback
  } catch (error) {
    console.warn('Unable to load stored data for', key, error)
    return fallback
  }
}

export function saveToStorage(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    window.localStorage.setItem(storageKey(key), JSON.stringify(value))
  } catch (error) {
    console.warn('Unable to save data for', key, error)
  }
}

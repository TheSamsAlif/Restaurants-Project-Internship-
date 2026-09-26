import { STORAGE_PREFIX } from '@/config'

/** Read and parse a value from Local Storage. Returns undefined when missing or unreadable. */
export function readStorage(key) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
    return raw === null ? undefined : JSON.parse(raw)
  } catch {
    return undefined
  }
}

/** Serialise and save a value. Returns false when the browser refuses (for example, storage is full). */
export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const fullKey = (key) => STORAGE_PREFIX + key

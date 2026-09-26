import { Notify } from 'quasar'
import { fullKey, readStorage, writeStorage } from '@/utils/storage'

/**
 * A tiny Pinia plugin that keeps chosen parts of a store in Local Storage.
 *
 * A store opts in with:  persist: { key: 'items', paths: ['items'] }   (or an array of those)
 *  - it loads the saved values when the store is first created
 *  - it saves again after every state change
 *  - it listens for changes made in other browser tabs and follows them
 */
const asList = (persist) => (!persist ? [] : Array.isArray(persist) ? persist : [persist])

const pick = (source = {}, paths) =>
  Object.fromEntries(paths.filter((p) => source[p] !== undefined).map((p) => [p, source[p]]))

export function persistPlugin({ store, options }) {
  const targets = asList(options.persist)
  if (!targets.length) return

  let applyingExternalChange = false
  const lastSaved = new Map()

  // 1. Load what was saved last time
  for (const target of targets) {
    const saved = readStorage(target.key)
    if (saved && typeof saved === 'object') store.$patch(pick(saved, target.paths))
    lastSaved.set(target.key, JSON.stringify(pick(store.$state, target.paths)))
  }

  // 2. Save after every change (skipped when nothing in that slice changed)
  store.$subscribe(
    (_mutation, state) => {
      if (applyingExternalChange) return
      for (const target of targets) {
        const slice = pick(state, target.paths)
        const serialised = JSON.stringify(slice)
        if (serialised === lastSaved.get(target.key)) continue
        if (writeStorage(target.key, slice)) lastSaved.set(target.key, serialised)
        else {
          Notify.create({
            type: 'negative',
            message: 'Your browser storage is full, so the latest change was not saved.',
          })
        }
      }
    },
    { detached: true, flush: 'sync' },
  )

  // 3. Follow changes made from another tab
  window.addEventListener('storage', (event) => {
    const target = targets.find((t) => fullKey(t.key) === event.key)
    if (!target) return
    let incoming
    try {
      incoming = event.newValue ? JSON.parse(event.newValue) : {}
    } catch {
      return
    }
    applyingExternalChange = true
    store.$patch(pick(incoming, target.paths))
    lastSaved.set(target.key, event.newValue ?? '')
    applyingExternalChange = false
  })
}

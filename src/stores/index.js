import { defineStore } from '#q-app'
import { createPinia } from 'pinia'
import { persistPlugin } from './persist'

export default defineStore((/* { ssrContext } */) => {
  const pinia = createPinia()

  // Every store that declares `persist: {...}` is mirrored into Local Storage.
  pinia.use(persistPlugin)

  return pinia
})

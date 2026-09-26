import { Dark } from 'quasar'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: null, // 'light' | 'dark' | null (null = follow the device until the user picks one)
  }),

  getters: {
    isDark: (state) =>
      state.mode
        ? state.mode === 'dark'
        : Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches),
  },

  actions: {
    apply() {
      Dark.set(this.isDark)
    },
    toggle() {
      this.mode = this.isDark ? 'light' : 'dark'
      this.apply()
    },
  },

  persist: { key: 'theme', paths: ['mode'] },
})

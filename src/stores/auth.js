import { defineStore } from 'pinia'
import { hashPassword } from '@/utils/hash'
import { uid } from '@/utils/ids'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    users: [], // every registered account (password hashes only)
    sessionUserId: null, // who is signed in right now
  }),

  getters: {
    /** The signed-in user without the password hash, or null. */
    currentUser: (state) => {
      const user = state.users.find((u) => u.id === state.sessionUserId)
      return user ? { id: user.id, name: user.name, email: user.email, phone: user.phone } : null
    },
    isLoggedIn() {
      return this.currentUser !== null
    },
  },

  actions: {
    register({ name, email, password, phone }) {
      const cleanEmail = email.trim().toLowerCase()
      if (this.users.some((u) => u.email === cleanEmail)) {
        return {
          ok: false,
          field: 'email',
          code: 'emailExists',
          message: 'An account with this email already exists.',
        }
      }
      this.users.push({
        id: uid(),
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        passwordHash: hashPassword(cleanEmail, password),
        createdAt: new Date().toISOString(),
      })
      return { ok: true, email: cleanEmail }
    },

    login(email, password) {
      const cleanEmail = email.trim().toLowerCase()
      const passwordHash = hashPassword(cleanEmail, password)
      const user = this.users.find((u) => u.email === cleanEmail && u.passwordHash === passwordHash)
      if (!user) return { ok: false, code: 'invalidCredentials', message: 'Email or password is incorrect.' }
      this.sessionUserId = user.id
      return { ok: true }
    },

    logout() {
      this.sessionUserId = null
    },
  },

  persist: [
    { key: 'users', paths: ['users'] },
    { key: 'session', paths: ['sessionUserId'] },
  ],
})

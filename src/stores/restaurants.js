import { defineStore } from 'pinia'
import { uid } from '@/utils/ids'

function clean(data) {
  const branches = [...new Set((data.branches || []).map((b) => b.trim()).filter(Boolean))]
  return {
    name: data.name.trim(),
    logo: data.logo || '',
    address: data.address.trim(),
    phone: data.phone.trim(),
    branches,
  }
}

export const useRestaurantStore = defineStore('restaurants', {
  state: () => ({
    list: [],
    activeId: null, // the restaurant whose details go on new invoices
  }),

  getters: {
    active: (state) => state.list.find((r) => r.id === state.activeId) ?? state.list[0] ?? null,

    /** Small copy stored on each order so old invoices keep the details they were printed with. */
    activeSnapshot() {
      const r = this.active
      return r ? { id: r.id, name: r.name, address: r.address, phone: r.phone } : null
    },

    /** What an invoice should show for a given order: the saved snapshot, plus the live logo. */
    forOrder: (state) => (order) => {
      const live = state.list.find((r) => r.id === order.restaurant?.id)
      const snap = order.restaurant
      if (!snap && !live) return null
      return {
        name: snap?.name ?? live.name,
        address: snap?.address ?? live.address,
        phone: snap?.phone ?? live.phone,
        logo: live?.logo || '',
      }
    },
  },

  actions: {
    add(data) {
      const now = new Date().toISOString()
      const restaurant = { id: uid(), ...clean(data), createdAt: now, updatedAt: now }
      this.list.push(restaurant)
      if (!this.activeId) this.activeId = restaurant.id
      return restaurant
    },

    update(id, data) {
      const index = this.list.findIndex((r) => r.id === id)
      if (index === -1) return null
      this.list[index] = { ...this.list[index], ...clean(data), updatedAt: new Date().toISOString() }
      return this.list[index]
    },

    remove(id) {
      this.list = this.list.filter((r) => r.id !== id)
      if (this.activeId === id) this.activeId = this.list[0]?.id ?? null
    },

    setActive(id) {
      if (this.list.some((r) => r.id === id)) this.activeId = id
    },
  },

  persist: { key: 'restaurants', paths: ['list', 'activeId'] },
})

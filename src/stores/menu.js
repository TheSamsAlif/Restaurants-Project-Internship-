import { defineStore } from 'pinia'
import { uid } from '@/utils/ids'
import { round2 } from '@/utils/money'

const SAMPLE_ITEMS = [
  ['Chicken Wings', 'Starters', 320],
  ['Veg Spring Rolls', 'Starters', 180],
  ['Garlic Bread', 'Starters', 150],
  ['Chicken Biryani', 'Mains', 350],
  ['Beef Burger', 'Mains', 380],
  ['Grilled Chicken Plate', 'Mains', 420],
  ['Margherita Pizza', 'Mains', 550],
  ['Chicken Fried Rice', 'Mains', 260],
  ['Lemon Mint Cooler', 'Drinks', 120],
  ['Cold Coffee', 'Drinks', 180],
  ['Mango Lassi', 'Drinks', 150],
  ['Mineral Water', 'Drinks', 40],
  ['Chocolate Brownie', 'Desserts', 200],
  ['Firni', 'Desserts', 120],
]

export const DEFAULT_CATEGORIES = ['Starters', 'Mains', 'Drinks', 'Desserts']

export const useMenuStore = defineStore('menu', {
  state: () => ({
    items: [],
  }),

  getters: {
    /** Every category in use, plus the usual ones, alphabetically. */
    categories: (state) =>
      [...new Set([...DEFAULT_CATEGORIES, ...state.items.map((i) => i.category)])].sort((a, b) =>
        a.localeCompare(b),
      ),
    /** Only categories that actually have items - used by filter bars. */
    usedCategories: (state) =>
      [...new Set(state.items.map((i) => i.category))].sort((a, b) => a.localeCompare(b)),
  },

  actions: {
    add({ name, category, price }) {
      const item = {
        id: uid(),
        name: name.trim(),
        category: category.trim(),
        price: round2(price),
        createdAt: new Date().toISOString(),
      }
      this.items.push(item)
      return item
    },

    update(id, { name, category, price }) {
      const index = this.items.findIndex((i) => i.id === id)
      if (index === -1) return null
      this.items[index] = {
        ...this.items[index],
        name: name.trim(),
        category: category.trim(),
        price: round2(price),
      }
      return this.items[index]
    },

    remove(id) {
      this.items = this.items.filter((i) => i.id !== id)
    },

    addSamples() {
      SAMPLE_ITEMS.forEach(([name, category, price]) => this.add({ name, category, price }))
    },
  },

  persist: { key: 'items', paths: ['items'] },
})

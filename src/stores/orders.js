import { defineStore } from 'pinia'
import { TAX_RATE } from '@/config'
import { uid } from '@/utils/ids'
import { round2 } from '@/utils/money'

const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)

const isToday = (dateStr) => {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  )
}

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [], // every placed order
    seq: 0, // last invoice number
    cart: [], // current order items
    discountType: 'none', // 'none' | 'student' | 'couple' | 'senior'
    discountRate: 0, // 0, 0.10, 0.15, 0.20
  }),

  getters: {
    cartCount: (state) => state.cart.reduce((n, line) => n + line.qty, 0),
    subtotal: (state) => round2(state.cart.reduce((sum, l) => sum + l.price * l.qty, 0)),
    discountAmount() {
      return round2(this.subtotal * (this.discountRate || 0))
    },
    discountedSubtotal() {
      return round2(Math.max(0, this.subtotal - this.discountAmount))
    },
    tax() {
      return round2(this.discountedSubtotal * TAX_RATE)
    },
    total() {
      return round2(this.discountedSubtotal + this.tax)
    },
    qtyInCart: (state) => (itemId) => state.cart.find((l) => l.itemId === itemId)?.qty ?? 0,

    /** Active / Upcoming orders - latest first */
    upcoming: (state) => state.orders.filter((o) => o.status === 'upcoming').sort(newestFirst),
    /** Completed orders - latest first */
    previous: (state) => state.orders.filter((o) => o.status === 'completed').sort(newestFirst),
    byId: (state) => (id) => state.orders.find((o) => o.id === id) ?? null,

    /** Table + seat conflict check (Requirement 4) */
    findActiveBookingConflict: (state) => ({ table, seat, branch, excludeOrderId } = {}) => {
      const norm = (v) => String(v ?? '').trim().toLowerCase()
      const normTable = norm(table)
      const normSeat = norm(seat)
      const normBranch = norm(branch)
      if (!normTable) return null

      return (
        state.orders.find((o) => {
          if (o.status !== 'upcoming') return false
          if (excludeOrderId && o.id === excludeOrderId) return false
          if (norm(o.table) !== normTable) return false
          // If seat specified on either order, check exact seat match; if no seat specified, table itself is occupied
          if (normSeat && norm(o.seat) && norm(o.seat) !== normSeat) return false
          const oBranch = norm(o.branch)
          if (normBranch && oBranch && oBranch !== normBranch) return false
          return true
        }) ?? null
      )
    },

    /** Table occupancy status dictionary for visual map */
    tableStatusMap: (state) => {
      const map = {}
      state.orders.forEach((o) => {
        if (o.status === 'upcoming') {
          const t = String(o.table).trim()
          if (!map[t]) {
            map[t] = {
              occupied: true,
              customerName: o.customer?.name || 'Guest',
              seat: o.seat || '1',
              invoiceNo: o.invoiceNo,
            }
          }
        }
      })
      return map
    },

    // Daily Revenue & Analytics (Requirement 3)
    todayOrders: (state) => state.orders.filter((o) => isToday(o.createdAt)),
    todayRevenue() {
      return round2(this.todayOrders.reduce((sum, o) => sum + (o.total || 0), 0))
    },
    todayCompletedRevenue() {
      return round2(
        this.todayOrders
          .filter((o) => o.status === 'completed')
          .reduce((sum, o) => sum + (o.total || 0), 0),
      )
    },
    todayPendingRevenue() {
      return round2(
        this.todayOrders
          .filter((o) => o.status === 'upcoming')
          .reduce((sum, o) => sum + (o.total || 0), 0),
      )
    },
    todayAov() {
      const count = this.todayOrders.length
      return count > 0 ? round2(this.todayRevenue / count) : 0
    },
    todayTopItems() {
      const itemMap = {}
      this.todayOrders.forEach((o) => {
        ;(o.lines || []).forEach((l) => {
          if (!itemMap[l.name]) {
            itemMap[l.name] = { name: l.name, qty: 0, revenue: 0 }
          }
          itemMap[l.name].qty += l.qty
          itemMap[l.name].revenue += round2(l.price * l.qty)
        })
      })
      return Object.values(itemMap)
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5)
    },
  },

  actions: {
    addToCart(item) {
      const line = this.cart.find((l) => l.itemId === item.id)
      if (line) line.qty += 1
      else {
        this.cart.push({
          itemId: item.id,
          name: item.name,
          nameBn: item.nameBn || item.name,
          category: item.category,
          price: item.price,
          qty: 1,
        })
      }
    },

    changeQty(itemId, delta) {
      const line = this.cart.find((l) => l.itemId === itemId)
      if (!line) return
      line.qty += delta
      if (line.qty <= 0) this.removeLine(itemId)
    },

    removeLine(itemId) {
      this.cart = this.cart.filter((l) => l.itemId !== itemId)
    },

    setDiscount(type) {
      this.discountType = type
      if (type === 'student') this.discountRate = 0.10
      else if (type === 'couple') this.discountRate = 0.15
      else if (type === 'senior') this.discountRate = 0.20
      else {
        this.discountType = 'none'
        this.discountRate = 0
      }
    },

    clearCart() {
      this.cart = []
      this.discountType = 'none'
      this.discountRate = 0
    },

    placeOrder({ customerName, phone, table, seat, branch, restaurant }) {
      if (!this.cart.length) return { ok: false, code: 'emptyCart' }

      const conflict = this.findActiveBookingConflict({ table, seat, branch })
      if (conflict) {
        return {
          ok: false,
          code: 'conflict',
          table: conflict.table,
          seat: conflict.seat,
          customerName: conflict.customer?.name || 'Guest',
        }
      }

      this.seq += 1
      const order = {
        id: uid(),
        invoiceNo: `INV-${String(this.seq).padStart(5, '0')}`,
        customer: { name: customerName.trim(), phone: (phone || '').trim() },
        table: String(table).trim(),
        seat: seat ? String(seat).trim() : '1',
        branch: branch || '',
        restaurant: restaurant || null,
        lines: this.cart.map((l) => ({ ...l, amount: round2(l.price * l.qty) })),
        subtotal: this.subtotal,
        discountType: this.discountType,
        discountRate: this.discountRate,
        discountAmount: this.discountAmount,
        discountedSubtotal: this.discountedSubtotal,
        taxRate: TAX_RATE,
        tax: this.tax,
        total: this.total,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
        completedAt: null,
      }
      this.orders.push(order)
      this.clearCart()
      return { ok: true, order }
    },

    complete(id) {
      const order = this.orders.find((o) => o.id === id)
      if (order) {
        order.status = 'completed'
        order.completedAt = new Date().toISOString()
      }
    },

    reopen(id) {
      const order = this.orders.find((o) => o.id === id)
      if (order) {
        order.status = 'upcoming'
        order.completedAt = null
      }
    },
  },

  persist: { key: 'orders', paths: ['orders', 'seq'] },
})

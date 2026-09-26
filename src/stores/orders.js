import { defineStore } from 'pinia'
import { TAX_RATE } from '@/config'
import { uid } from '@/utils/ids'
import { round2 } from '@/utils/money'

const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [], // every placed order (saved)
    seq: 0, // last invoice number handed out (saved)
    cart: [], // the order being built right now (kept while the app is open)
  }),

  getters: {
    cartCount: (state) => state.cart.reduce((n, line) => n + line.qty, 0),
    subtotal: (state) => round2(state.cart.reduce((sum, l) => sum + l.price * l.qty, 0)),
    tax() {
      return round2(this.subtotal * TAX_RATE)
    },
    total() {
      return round2(this.subtotal + this.tax)
    },
    qtyInCart: (state) => (itemId) => state.cart.find((l) => l.itemId === itemId)?.qty ?? 0,

    /** Orders still to be served - newest first. */
    upcoming: (state) => state.orders.filter((o) => o.status === 'upcoming').sort(newestFirst),
    /** Orders already completed - newest first. */
    previous: (state) => state.orders.filter((o) => o.status === 'completed').sort(newestFirst),
    byId: (state) => (id) => state.orders.find((o) => o.id === id) ?? null,

    /**
     * Table + seat conflict check (Task 5).
     *
     * The project has no start/end time or booking-duration model — a table is
     * simply occupied for as long as an order against it is still 'upcoming'
     * and free again once that order is completed. So "overlapping bookings"
     * here means: another order already active for the same table + seat
     * (and, when set, the same branch). This is re-run right before an order
     * is persisted, not only when the table was first picked, so a table
     * taken by someone else in the meantime is still caught.
     */
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
          if (norm(o.seat) !== normSeat) return false
          const oBranch = norm(o.branch)
          if (normBranch && oBranch && oBranch !== normBranch) return false
          return true
        }) ?? null
      )
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

    clearCart() {
      this.cart = []
    },

    /**
     * Turns the cart into a saved order and empties the cart.
     * Returns { ok: true, order } on success, or
     * { ok: false, code: 'emptyCart' | 'conflict', table?, seat? } when it can't be placed.
     *
     * The table/seat availability check runs here, right before the order is
     * persisted — this is the authoritative, single source of truth for what's
     * booked (see findActiveBookingConflict), so a table taken moments earlier
     * by another order is still rejected even if the UI let the user get this far.
     */
    placeOrder({ customerName, phone, table, seat, branch, restaurant }) {
      if (!this.cart.length) return { ok: false, code: 'emptyCart' }

      const conflict = this.findActiveBookingConflict({ table, seat, branch })
      if (conflict) return { ok: false, code: 'conflict', table: conflict.table, seat: conflict.seat }

      this.seq += 1
      const order = {
        id: uid(),
        invoiceNo: `INV-${String(this.seq).padStart(5, '0')}`,
        customer: { name: customerName.trim(), phone: (phone || '').trim() },
        table: String(table).trim(),
        seat: seat ? String(seat).trim() : '',
        branch: branch || '',
        restaurant: restaurant || null,
        lines: this.cart.map((l) => ({ ...l, amount: round2(l.price * l.qty) })),
        subtotal: this.subtotal,
        taxRate: TAX_RATE,
        tax: this.tax,
        total: this.total,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
        completedAt: null,
      }
      this.orders.push(order)
      this.cart = []
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

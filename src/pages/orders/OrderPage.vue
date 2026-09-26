<template>
  <q-page class="q-pa-md q-pa-lg-lg">
    <div class="order-container row q-col-gutter-lg items-start">
      <!-- Left side: Menu items selection -->
      <div class="col-12 col-lg-8">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="text-caption text-primary text-weight-bold text-uppercase">Step 4: Retail POS</div>
            <div class="text-h4 text-weight-bolder">New Order</div>
            <div class="text-body2 text-grey-6">Select items from the menu to build the customer's order.</div>
          </div>
        </div>

        <!-- Search & Category Filter -->
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 col-sm-8">
            <q-input
              v-model="search"
              outlined
              dense
              placeholder="Search menu items..."
              clearable
            >
              <template #prepend><q-icon name="sym_o_search" /></template>
            </q-input>
          </div>
          <div class="col-12 col-sm-4">
            <q-select
              v-model="categoryFilter"
              outlined
              dense
              emit-value
              map-options
              :options="filterOptions"
              label="Category"
            >
              <template #prepend><q-icon name="sym_o_filter_list" /></template>
            </q-select>
          </div>
        </div>

        <!-- Empty Menu Warning -->
        <div v-if="!menu.items.length" class="text-center q-pa-xl surface-card empty-card">
          <q-icon name="sym_o_restaurant_menu" size="56px" color="grey-5" class="q-mb-md" />
          <div class="text-h6 text-weight-bold">Menu is Empty</div>
          <div class="text-body2 text-grey-6 q-my-sm">
            Please add menu items or load the starter menu first.
          </div>
          <q-btn unelevated color="primary" label="Go to Items Page" to="/app/items" class="q-mt-sm" />
        </div>

        <!-- Menu Item Cards Grid -->
        <div v-else class="row q-col-gutter-sm">
          <div v-for="it in filtered" :key="it.id" class="col-12 col-sm-6 col-md-4">
            <q-card
              flat
              bordered
              class="pos-item-card cursor-pointer"
              :class="{ 'in-cart': orders.qtyInCart(it.id) > 0 }"
              @click="orders.addToCart(it)"
            >
              <q-card-section class="q-pa-sm">
                <div class="row items-center justify-between no-wrap">
                  <div class="text-subtitle2 text-weight-bolder ellipsis col">{{ it.name }}</div>
                  <q-badge
                    v-if="orders.qtyInCart(it.id) > 0"
                    color="positive"
                    :label="`${orders.qtyInCart(it.id)} in cart`"
                    class="q-ml-xs text-weight-bold"
                  />
                </div>
                <div class="row items-center justify-between q-mt-xs">
                  <q-chip dense color="primary" text-color="white" size="xs">{{ it.category }}</q-chip>
                  <div class="text-weight-bolder text-primary font-mono" style="font-size: 1rem;">
                    {{ formatMoney(it.price) }}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Right side: Chosen Items & Customer / Seating Input (POS Ticket) -->
      <div class="col-12 col-lg-4">
        <q-card flat bordered class="ticket-card sticky-ticket">
          <q-card-section class="bg-primary text-white q-py-sm">
            <div class="row items-center justify-between">
              <div class="row items-center" style="gap: 8px">
                <q-icon name="sym_o_receipt_long" size="24px" />
                <span class="text-subtitle1 text-weight-bold">Current Order</span>
              </div>
              <q-badge color="white" text-color="primary" :label="`${orders.cartCount} items`" class="text-weight-bold" />
            </div>
          </q-card-section>

          <!-- Cart Lines -->
          <q-card-section class="q-pa-md">
            <div v-if="!orders.cart.length" class="text-center q-py-xl text-grey-5">
              <q-icon name="sym_o_shopping_basket" size="48px" class="q-mb-sm text-grey-4" />
              <div class="text-subtitle2">No items selected</div>
              <div class="text-caption">Click items on the left to add to order</div>
            </div>

            <div v-else>
              <div class="cart-items-list q-mb-md">
                <div v-for="line in orders.cart" :key="line.itemId" class="row items-center justify-between q-py-xs border-bottom">
                  <div class="col q-pr-sm">
                    <div class="text-body2 text-weight-bold ellipsis">{{ line.name }}</div>
                    <div class="text-caption text-grey-6 font-mono">
                      {{ line.qty }} &times; {{ formatMoney(line.price) }}
                    </div>
                  </div>

                  <!-- Qty Steppers -->
                  <div class="row items-center no-wrap q-gutter-xs">
                    <q-btn flat round dense size="sm" icon="sym_o_remove" color="primary" @click.stop="orders.changeQty(line.itemId, -1)" />
                    <span class="font-mono text-weight-bold q-px-xs">{{ line.qty }}</span>
                    <q-btn flat round dense size="sm" icon="sym_o_add" color="primary" @click.stop="orders.changeQty(line.itemId, 1)" />
                    <q-btn flat round dense size="xs" icon="sym_o_close" color="negative" class="q-ml-xs" @click.stop="orders.removeLine(line.itemId)" />
                  </div>
                </div>
              </div>

              <!-- Price Breakdown -->
              <q-separator class="q-my-sm" />
              <div class="row justify-between text-body2 q-py-xs">
                <span class="text-grey-7">Subtotal:</span>
                <span class="font-mono text-weight-medium">{{ formatMoney(orders.subtotal) }}</span>
              </div>
              <div class="row justify-between text-body2 q-py-xs">
                <span class="text-grey-7">VAT ({{ Math.round(taxRate * 100) }}%):</span>
                <span class="font-mono text-grey-8">{{ formatMoney(orders.tax) }}</span>
              </div>
              <q-separator class="q-my-xs" />
              <div class="row justify-between text-h6 text-weight-bolder text-primary q-py-xs">
                <span>Total Amount:</span>
                <span class="font-mono">{{ formatMoney(orders.total) }}</span>
              </div>
            </div>
          </q-card-section>

          <!-- Input Fields as required by Step 4 -->
          <q-separator />
          <q-card-section class="q-pa-md">
            <div class="text-caption text-weight-bold text-uppercase text-grey-7 q-mb-sm">
              Customer & Table Seating
            </div>
            <q-form class="column q-gutter-y-sm" @submit.prevent="onSubmit">
              <q-input
                v-model="customerName"
                outlined
                dense
                label="Customer Name *"
                :rules="[required('Customer name is required')]"
                lazy-rules
              >
                <template #prepend><q-icon name="sym_o_person" /></template>
              </q-input>

              <q-input
                v-model="phone"
                outlined
                dense
                label="Phone Number *"
                :rules="[required('Phone number is required'), phoneRule]"
                lazy-rules
              >
                <template #prepend><q-icon name="sym_o_call" /></template>
              </q-input>

              <div class="row q-col-gutter-xs">
                <div class="col-6">
                  <q-input
                    v-model="table"
                    outlined
                    dense
                    label="Table Number *"
                    :rules="[required('Table is required')]"
                    lazy-rules
                  >
                    <template #prepend><q-icon name="sym_o_table_restaurant" /></template>
                  </q-input>
                </div>
                <div class="col-6">
                  <q-input
                    v-model="seat"
                    outlined
                    dense
                    label="Seat Number"
                  >
                    <template #prepend><q-icon name="sym_o_chair" /></template>
                  </q-input>
                </div>
              </div>

              <q-select
                v-if="branches.length > 1"
                v-model="branch"
                outlined
                dense
                :options="branches"
                label="Select Branch"
              >
                <template #prepend><q-icon name="sym_o_apartment" /></template>
              </q-select>

              <q-banner v-if="error" dense rounded class="bg-red-1 text-negative q-mt-xs">
                {{ error }}
              </q-banner>

              <q-btn
                type="submit"
                unelevated
                color="primary"
                size="lg"
                class="full-width q-mt-md text-weight-bold"
                icon="sym_o_receipt_long"
                label="Submit Order & View Invoice"
                :disable="!orders.cart.length"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@/stores/menu'
import { useOrderStore } from '@/stores/orders'
import { useRestaurantStore } from '@/stores/restaurants'
import { formatMoney } from '@/utils/money'
import { required, phoneRule } from '@/utils/validators'
import { TAX_RATE } from '@/config'

const router = useRouter()
const menu = useMenuStore()
const orders = useOrderStore()
const restaurantStore = useRestaurantStore()

const taxRate = TAX_RATE
const search = ref('')
const categoryFilter = ref('all')

const filterOptions = computed(() => [
  { label: 'All Categories', value: 'all' },
  ...menu.usedCategories.map((c) => ({ label: c, value: c })),
])

const filtered = computed(() => {
  const needle = search.value?.trim().toLowerCase() ?? ''
  return menu.items.filter((it) => {
    const matchesSearch = !needle || it.name.toLowerCase().includes(needle)
    const matchesCategory = categoryFilter.value === 'all' || it.category === categoryFilter.value
    return matchesSearch && matchesCategory
  })
})

const branches = computed(() => restaurantStore.active?.branches ?? [])
const branch = ref('')

const customerName = ref('')
const phone = ref('')
const table = ref('')
const seat = ref('')
const error = ref('')

function onSubmit() {
  error.value = ''
  if (!orders.cart.length) {
    error.value = 'Please add at least one item to the cart.'
    return
  }

  const result = orders.placeOrder({
    customerName: customerName.value,
    phone: phone.value,
    table: table.value,
    seat: seat.value,
    branch: branch.value || branches.value[0] || 'Main Branch',
    restaurant: restaurantStore.activeSnapshot,
  })

  if (!result.ok) {
    if (result.code === 'conflict') {
      error.value = `Table ${result.table} (Seat: ${result.seat || 'Any'}) is currently occupied by an active order.`
    } else {
      error.value = 'Unable to place order. Please review your entries.'
    }
    return
  }

  // Redirect to invoice page as required by Step 4
  router.push(`/app/invoices/${result.order.id}`)
}
</script>

<style scoped>
.order-container {
  max-width: 1200px;
  margin: 0 auto;
}
.pos-item-card {
  border-radius: 12px;
  background: var(--surface);
  transition: all 0.15s ease;
}
.pos-item-card:hover {
  transform: translateY(-2px);
  border-color: var(--q-primary);
}
.pos-item-card.in-cart {
  border: 2px solid var(--q-primary);
  background: var(--surface-sunken);
}
.ticket-card {
  border-radius: 14px;
  background: var(--surface);
}
.sticky-ticket {
  position: sticky;
  top: 80px;
}
.cart-items-list {
  max-height: 240px;
  overflow-y: auto;
}
.border-bottom {
  border-bottom: 1px solid var(--line);
}
.empty-card {
  border-radius: 16px;
  border: 2px dashed var(--line);
}
</style>

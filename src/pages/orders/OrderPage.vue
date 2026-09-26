<template>
  <q-page class="q-pa-md q-pa-lg-lg">
    <div class="order-container row q-col-gutter-lg items-start">
      <!-- Left side: Menu items selection -->
      <div class="col-12 col-lg-8">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="text-caption text-primary text-weight-bold text-uppercase">
              {{ locale.t('orders.badge') }}
            </div>
            <div class="text-h4 text-weight-bolder">
              {{ locale.t('orders.title') }}
            </div>
            <div class="text-body2 text-grey-6">
              {{ locale.t('orders.subtitle') }}
            </div>
          </div>
        </div>

        <!-- Search & Category Filter -->
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 col-sm-8">
            <q-input
              v-model="search"
              outlined
              dense
              :placeholder="locale.t('orders.searchPlaceholder')"
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

        <!-- Interactive Visual Table Map (Unique Feature & Conflict Prevention) -->
        <q-card flat bordered class="q-pa-md q-mb-md bg-surface table-map-card">
          <div class="row items-center justify-between q-mb-sm">
            <div class="row items-center" style="gap: 8px">
              <q-icon name="sym_o_table_restaurant" color="primary" size="20px" />
              <span class="text-subtitle2 text-weight-bold">{{ locale.t('orders.tableMapTitle') }}</span>
            </div>
            <div class="row items-center q-gutter-sm text-caption">
              <span class="row items-center"><span class="table-legend-dot bg-positive q-mr-xs" /> {{ locale.t('orders.tableStatusFree') }}</span>
              <span class="row items-center"><span class="table-legend-dot bg-negative q-mr-xs" /> {{ locale.t('orders.tableStatusBusy') }}</span>
            </div>
          </div>

          <div class="row q-gutter-xs">
            <q-btn
              v-for="tNum in quickTables"
              :key="tNum"
              dense
              :color="isTableOccupied(tNum) ? 'negative' : (table === String(tNum) ? 'primary' : 'grey-3')"
              :text-color="isTableOccupied(tNum) ? 'white' : (table === String(tNum) ? 'white' : 'black')"
              :icon="isTableOccupied(tNum) ? 'sym_o_lock' : 'sym_o_chair'"
              class="q-px-sm text-weight-bold"
              style="font-size: 0.78rem; border-radius: 8px;"
              @click="selectTable(tNum)"
            >
              T-{{ tNum }}
              <q-tooltip v-if="isTableOccupied(tNum)">
                {{ locale.t('orders.tableOccupiedBy', { name: getOccupantName(tNum) }) }}
              </q-tooltip>
            </q-btn>
          </div>
        </q-card>

        <!-- Empty Menu Warning -->
        <div v-if="!menu.items.length" class="text-center q-pa-xl surface-card empty-card">
          <q-icon name="sym_o_restaurant_menu" size="56px" color="grey-5" class="q-mb-md" />
          <div class="text-h6 text-weight-bold">Menu is Empty</div>
          <div class="text-body2 text-grey-6 q-my-sm">
            Please add menu items or load the starter menu first.
          </div>
          <q-btn unelevated color="primary" label="Load Starter Menu" @click="menu.addSamples()" class="q-mt-sm" />
        </div>

        <!-- Menu Item Cards Grid WITH PICTURES -->
        <div v-else class="row q-col-gutter-sm">
          <div v-for="it in filtered" :key="it.id" class="col-12 col-sm-6 col-md-4">
            <q-card
              flat
              bordered
              class="pos-item-card cursor-pointer overflow-hidden"
              :class="{ 'in-cart': orders.qtyInCart(it.id) > 0 }"
              @click="orders.addToCart(it)"
            >
              <!-- Food Image Thumbnail -->
              <q-img
                :src="it.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'"
                style="height: 120px;"
                fit="cover"
              >
                <div class="absolute-bottom-left text-caption text-weight-bold q-pa-xs">
                  {{ locale.getItemCategory(it) }}
                </div>
              </q-img>

              <q-card-section class="q-pa-sm">
                <div class="row items-center justify-between no-wrap">
                  <div class="text-subtitle2 text-weight-bolder ellipsis col" :title="locale.getItemName(it)">
                    {{ locale.getItemName(it) }}
                  </div>
                </div>

                <div class="row items-center justify-between q-mt-xs">
                  <span class="text-weight-bolder text-primary font-mono" style="font-size: 1.05rem;">
                    {{ formatMoney(it.price) }}
                  </span>

                  <!-- Cart Controls / Add Button -->
                  <div v-if="orders.qtyInCart(it.id) > 0" class="row items-center no-wrap q-gutter-xs" @click.stop>
                    <q-btn flat round dense size="xs" icon="sym_o_remove" color="primary" @click="orders.changeQty(it.id, -1)" />
                    <span class="font-mono text-weight-bold q-px-xs text-primary">{{ orders.qtyInCart(it.id) }}</span>
                    <q-btn flat round dense size="xs" icon="sym_o_add" color="primary" @click="orders.changeQty(it.id, 1)" />
                  </div>
                  <q-btn
                    v-else
                    round
                    dense
                    unelevated
                    size="sm"
                    color="primary"
                    icon="sym_o_add_shopping_cart"
                    @click.stop="orders.addToCart(it)"
                  />
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
                <span class="text-subtitle1 text-weight-bold">{{ locale.t('orders.currentOrder') }}</span>
              </div>
              <q-badge color="white" text-color="primary" :label="locale.t('orders.itemsCount', { count: orders.cartCount })" class="text-weight-bold" />
            </div>
          </q-card-section>

          <!-- Cart Lines -->
          <q-card-section class="q-pa-md">
            <div v-if="!orders.cart.length" class="text-center q-py-lg text-grey-5">
              <q-icon name="sym_o_shopping_basket" size="44px" class="q-mb-xs text-grey-4" />
              <div class="text-subtitle2">{{ locale.t('orders.noItems') }}</div>
              <div class="text-caption">{{ locale.t('orders.tapToAdd') }}</div>
            </div>

            <div v-else>
              <div class="cart-items-list q-mb-sm">
                <div v-for="line in orders.cart" :key="line.itemId" class="row items-center justify-between q-py-xs border-bottom">
                  <div class="col q-pr-sm">
                    <div class="text-body2 text-weight-bold ellipsis">{{ line.name }}</div>
                    <div class="text-caption text-grey-6 font-mono">
                      {{ line.qty }} &times; {{ formatMoney(line.price) }}
                    </div>
                  </div>

                  <!-- Qty Steppers -->
                  <div class="row items-center no-wrap q-gutter-xs">
                    <q-btn flat round dense size="sm" icon="sym_o_remove" color="primary" @click="orders.changeQty(line.itemId, -1)" />
                    <span class="font-mono text-weight-bold q-px-xs">{{ line.qty }}</span>
                    <q-btn flat round dense size="sm" icon="sym_o_add" color="primary" @click="orders.changeQty(line.itemId, 1)" />
                    <q-btn flat round dense size="xs" icon="sym_o_close" color="negative" class="q-ml-xs" @click="orders.removeLine(line.itemId)" />
                  </div>
                </div>
              </div>

              <!-- Price Breakdown -->
              <q-separator class="q-my-xs" />
              <div class="row justify-between text-body2 q-py-xs">
                <span class="text-grey-7">{{ locale.t('orders.subtotal') }}</span>
                <span class="font-mono text-weight-medium">{{ formatMoney(orders.subtotal) }}</span>
              </div>
              <div class="row justify-between text-body2 q-py-xs">
                <span class="text-grey-7">{{ locale.t('orders.vat', { rate: Math.round(taxRate * 100) }) }}</span>
                <span class="font-mono text-grey-8">{{ formatMoney(orders.tax) }}</span>
              </div>
              <q-separator class="q-my-xs" />
              <div class="row justify-between text-h6 text-weight-bolder text-primary q-py-xs">
                <span>{{ locale.t('orders.total') }}</span>
                <span class="font-mono">{{ formatMoney(orders.total) }}</span>
              </div>
            </div>
          </q-card-section>

          <!-- Input Fields as required by Step 4 -->
          <q-separator />
          <q-card-section class="q-pa-md">
            <div class="text-caption text-weight-bold text-uppercase text-grey-7 q-mb-sm">
              {{ locale.t('orders.customerDetails') }}
            </div>
            <q-form class="column q-gutter-y-sm" @submit.prevent="onSubmit">
              <q-input
                v-model="customerName"
                outlined
                dense
                :label="locale.t('orders.customerName')"
                :rules="[required('Customer name is required')]"
                lazy-rules
              >
                <template #prepend><q-icon name="sym_o_person" /></template>
              </q-input>

              <q-input
                v-model="phone"
                outlined
                dense
                :label="locale.t('orders.phone')"
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
                    :label="locale.t('orders.tableNo')"
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
                    :label="locale.t('orders.seatNo')"
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
                :label="locale.t('orders.selectBranch')"
              >
                <template #prepend><q-icon name="sym_o_apartment" /></template>
              </q-select>

              <!-- Conflict error banner showing customer name (Requirement 4) -->
              <q-banner v-if="error" dense rounded class="bg-red-1 text-negative q-mt-xs">
                <template #avatar>
                  <q-icon name="sym_o_report" color="negative" />
                </template>
                {{ error }}
              </q-banner>

              <q-btn
                type="submit"
                unelevated
                color="primary"
                size="lg"
                class="full-width q-mt-md text-weight-bold"
                icon="sym_o_receipt_long"
                :label="locale.t('orders.submitBtn')"
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
import { Notify } from 'quasar'
import { useMenuStore } from '@/stores/menu'
import { useOrderStore } from '@/stores/orders'
import { useRestaurantStore } from '@/stores/restaurants'
import { useLocaleStore } from '@/stores/locale'
import { formatMoney } from '@/utils/money'
import { required, phoneRule } from '@/utils/validators'
import { TAX_RATE } from '@/config'

const router = useRouter()
const menu = useMenuStore()
const orders = useOrderStore()
const restaurantStore = useRestaurantStore()
const locale = useLocaleStore()

const taxRate = TAX_RATE
const search = ref('')
const categoryFilter = ref('all')

const filterOptions = computed(() => [
  { label: locale.t('items.allCategories'), value: 'all' },
  ...menu.usedCategories.map((c) => ({ label: c, value: c })),
])

const filtered = computed(() => {
  const needle = search.value?.trim().toLowerCase() ?? ''
  return menu.items.filter((it) => {
    const matchesSearch =
      !needle ||
      it.name.toLowerCase().includes(needle) ||
      (it.nameBn && it.nameBn.toLowerCase().includes(needle))
    const matchesCategory = categoryFilter.value === 'all' || it.category === categoryFilter.value
    return matchesSearch && matchesCategory
  })
})

const quickTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function isTableOccupied(tNum) {
  return Boolean(orders.tableStatusMap[String(tNum)])
}

function getOccupantName(tNum) {
  return orders.tableStatusMap[String(tNum)]?.customerName || 'Guest'
}

function selectTable(tNum) {
  const tStr = String(tNum)
  if (isTableOccupied(tNum)) {
    const occupant = getOccupantName(tNum)
    Notify.create({
      type: 'warning',
      message:
        locale.lang === 'bn'
          ? `টেবিল ${tNum} ইতোমধ্যে "${occupant}" এর নামে বুক করা আছে!`
          : `Table ${tNum} is currently reserved by "${occupant}".`,
    })
  } else {
    table.value = tStr
    seat.value = '1'
    Notify.create({
      type: 'positive',
      message: locale.lang === 'bn' ? `টেবিল ${tNum} নির্বাচিত হয়েছে` : `Table ${tNum} selected.`,
    })
  }
}

const branches = computed(() => restaurantStore.active?.branches ?? [])
const branch = ref('')

const customerName = ref('')
const phone = ref('')
const table = ref('1')
const seat = ref('1')
const error = ref('')

function onSubmit() {
  error.value = ''
  if (!orders.cart.length) {
    error.value = locale.lang === 'bn' ? 'দয়া করে কার্টে অন্তত একটি আইটেম যোগ করুন।' : 'Please add at least one item to the cart.'
    return
  }

  const result = orders.placeOrder({
    customerName: customerName.value,
    phone: phone.value,
    table: table.value,
    seat: seat.value || '1',
    branch: branch.value || branches.value[0] || 'Main Branch',
    restaurant: restaurantStore.activeSnapshot,
  })

  // Requirement 4: seat already reserved "name"
  if (!result.ok) {
    if (result.code === 'conflict') {
      const seatText = result.seat ? `Seat ${result.seat}` : 'Any Seat'
      if (locale.lang === 'bn') {
        error.value = `টেবিল ${result.table}, সিট ${result.seat || '1'} ইতোমধ্যে "${result.customerName}" এর নামে বুক করা আছে!`
      } else {
        error.value = `Seat already reserved by "${result.customerName}" (Table ${result.table}, ${seatText})`
      }
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
.table-map-card {
  border-radius: 12px;
}
.table-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
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

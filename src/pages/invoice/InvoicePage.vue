<template>
  <q-page class="q-pa-md q-pa-lg-lg page-shell">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md" style="gap: 12px">
      <div>
        <div class="text-caption text-primary text-weight-bold text-uppercase">
          {{ locale.t('invoices.badge') }}
        </div>
        <div class="text-h4 text-weight-bolder">
          {{ locale.t('invoices.title') }}
        </div>
        <div class="text-body2 text-grey-6 q-mt-xs">
          {{ locale.t('invoices.subtitle') }}
        </div>
      </div>
      <q-btn
        unelevated
        color="primary"
        icon="sym_o_add"
        :label="locale.t('invoices.newOrderBtn')"
        to="/app/orders"
        class="text-weight-bold"
      />
    </div>

    <!-- DAILY REVENUE & POS PERFORMANCE DASHBOARD (Requirement 3) -->
    <q-card flat bordered class="revenue-card q-mb-lg">
      <q-card-section class="q-pb-sm">
        <div class="row items-center justify-between">
          <div class="row items-center" style="gap: 10px">
            <q-avatar size="34px" color="primary" text-color="white" icon="sym_o_insights" />
            <div>
              <div class="text-subtitle1 text-weight-bolder">
                {{ locale.t('revenue.title') }}
              </div>
              <div class="text-caption text-grey-6 font-mono">
                {{ todayDateFormatted }}
              </div>
            </div>
          </div>
          <q-badge
            color="primary"
            outline
            :label="orders.todayOrders.length + ' ' + (locale.lang === 'bn' ? 'টি অর্ডার' : 'orders')"
            class="text-weight-bold"
          />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Metric Grid -->
      <q-card-section class="q-py-md">
        <div class="row q-col-gutter-md">
          <!-- Total Revenue Today -->
          <div class="col-12 col-sm-6 col-md-3">
            <div class="metric-box surface-sunken q-pa-md rounded-borders">
              <div class="row items-center justify-between q-mb-xs">
                <span class="text-caption text-grey-7 text-weight-medium">{{ locale.t('revenue.totalRevenue') }}</span>
                <q-icon name="sym_o_payments" color="primary" size="22px" />
              </div>
              <div class="text-h5 text-weight-bolder text-primary font-mono">
                {{ formatMoney(orders.todayRevenue) }}
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                {{ orders.todayOrders.length }} {{ locale.lang === 'bn' ? 'টি মোট অর্ডার' : 'orders placed today' }}
              </div>
            </div>
          </div>

          <!-- Average Order Value (AOV) -->
          <div class="col-12 col-sm-6 col-md-3">
            <div class="metric-box surface-sunken q-pa-md rounded-borders">
              <div class="row items-center justify-between q-mb-xs">
                <span class="text-caption text-grey-7 text-weight-medium">{{ locale.t('revenue.avgOrder') }}</span>
                <q-icon name="sym_o_query_stats" color="info" size="22px" />
              </div>
              <div class="text-h5 text-weight-bolder font-mono">
                {{ formatMoney(orders.todayAov) }}
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                {{ locale.lang === 'bn' ? 'গড় টিকিট সাইজ' : 'Average basket size' }}
              </div>
            </div>
          </div>

          <!-- Completed Sales -->
          <div class="col-12 col-sm-6 col-md-3">
            <div class="metric-box surface-sunken q-pa-md rounded-borders">
              <div class="row items-center justify-between q-mb-xs">
                <span class="text-caption text-grey-7 text-weight-medium">{{ locale.t('revenue.completedSales') }}</span>
                <q-icon name="sym_o_task_alt" color="positive" size="22px" />
              </div>
              <div class="text-h5 text-weight-bolder text-positive font-mono">
                {{ formatMoney(orders.todayCompletedRevenue) }}
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                {{ orders.todayOrders.filter((o) => o.status === 'completed').length }} {{ locale.lang === 'bn' ? 'টি সম্পন্ন' : 'settled orders' }}
              </div>
            </div>
          </div>

          <!-- Pending / In-Kitchen Sales -->
          <div class="col-12 col-sm-6 col-md-3">
            <div class="metric-box surface-sunken q-pa-md rounded-borders">
              <div class="row items-center justify-between q-mb-xs">
                <span class="text-caption text-grey-7 text-weight-medium">{{ locale.t('revenue.pendingSales') }}</span>
                <q-icon name="sym_o_hourglass_top" color="warning" size="22px" />
              </div>
              <div class="text-h5 text-weight-bolder text-warning font-mono">
                {{ formatMoney(orders.todayPendingRevenue) }}
              </div>
              <div class="text-caption text-grey-6 q-mt-xs">
                {{ orders.todayOrders.filter((o) => o.status === 'upcoming').length }} {{ locale.lang === 'bn' ? 'টি চলমান' : 'in-kitchen/pending' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Top Selling Dishes Today -->
        <div class="q-mt-md">
          <div class="text-caption text-weight-bold text-grey-7 text-uppercase q-mb-sm row items-center" style="gap: 6px">
            <q-icon name="sym_o_local_fire_department" color="primary" size="18px" />
            <span>{{ locale.t('revenue.topDishes') }}</span>
          </div>

          <div v-if="orders.todayTopItems.length" class="row q-gutter-sm">
            <q-chip
              v-for="dish in orders.todayTopItems"
              :key="dish.name"
              outline
              color="primary"
              class="q-pa-md text-weight-medium"
            >
              <q-avatar icon="sym_o_restaurant" color="primary" text-color="white" />
              <span class="text-weight-bold q-mr-xs">{{ dish.name }}</span>
              <span class="font-mono text-caption text-grey-8">({{ dish.qty }} &times; &bull; {{ formatMoney(dish.revenue) }})</span>
            </q-chip>
          </div>
          <div v-else class="text-caption text-grey-5 italic q-py-xs">
            {{ locale.t('invoices.emptyToday') }}
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Search Input -->
    <div class="q-mb-md">
      <q-input
        v-model="search"
        outlined
        dense
        :placeholder="locale.t('invoices.searchPlaceholder')"
        clearable
      >
        <template #prepend><q-icon name="sym_o_search" /></template>
      </q-input>
    </div>

    <!-- Separate Sections: Upcoming Orders vs Previous Orders as required by Step 5 -->
    <q-tabs
      v-model="tab"
      dense
      class="text-grey-7 bg-surface q-mb-md rounded-borders"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab name="upcoming">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="sym_o_pending_actions" color="warning" />
          <span class="text-weight-bold">{{ locale.t('invoices.upcoming') }}</span>
          <q-badge color="warning" text-color="black" :label="orders.upcoming.length" />
        </div>
      </q-tab>
      <q-tab name="previous">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="sym_o_task_alt" color="positive" />
          <span class="text-weight-bold">{{ locale.t('invoices.previous') }}</span>
          <q-badge color="positive" :label="orders.previous.length" />
        </div>
      </q-tab>
    </q-tabs>

    <!-- Empty State -->
    <div v-if="!rows.length" class="text-center q-pa-xl surface-card empty-card">
      <q-icon name="sym_o_receipt" size="56px" color="grey-5" class="q-mb-md" />
      <div class="text-h6 text-weight-bold">
        {{ orders.orders.length ? (locale.lang === 'bn' ? 'কোনো ইনভয়েস খুঁজে পাওয়া যায়নি' : 'No Matching Invoices Found') : (locale.lang === 'bn' ? 'এখনও কোনো অর্ডার নেই' : 'No Orders Recorded Yet') }}
      </div>
      <div class="text-body2 text-grey-6 q-my-sm">
        {{ orders.orders.length ? (locale.lang === 'bn' ? 'ভিন্ন অনুসন্ধান শব্দ চেষ্টা করুন' : 'Try a different search query') : (locale.lang === 'bn' ? 'ইনভয়েস তৈরির জন্য POS থেকে নতুন অর্ডার গ্রহণ করুন।' : 'Place orders from the POS to generate invoices.') }}
      </div>
      <q-btn
        v-if="!orders.orders.length"
        unelevated
        color="primary"
        :label="locale.lang === 'bn' ? 'প্রথম অর্ডার গ্রহণ করুন' : 'Create First Order'"
        to="/app/orders"
        class="q-mt-sm"
      />
    </div>

    <!-- Orders Cards List -->
    <div v-else class="column q-gutter-y-md">
      <q-card
        v-for="o in rows"
        :key="o.id"
        flat
        bordered
        class="order-row-card cursor-pointer"
        @click="openOrder(o)"
      >
        <q-card-section class="q-py-md">
          <div class="row items-center justify-between">
            <!-- Left Info -->
            <div class="row items-center" style="gap: 14px">
              <q-avatar
                size="42px"
                :color="o.status === 'upcoming' ? 'amber-1' : 'green-1'"
                :text-color="o.status === 'upcoming' ? 'warning' : 'positive'"
                :icon="o.status === 'upcoming' ? 'sym_o_schedule' : 'sym_o_check_circle'"
              />

              <div>
                <div class="row items-center" style="gap: 8px">
                  <span class="text-subtitle1 text-weight-bolder">{{ o.customer?.name || 'Customer' }}</span>
                  <q-badge
                    :color="o.status === 'upcoming' ? 'warning' : 'positive'"
                    :label="o.status === 'upcoming' ? (locale.lang === 'bn' ? 'চলমান' : 'Upcoming') : (locale.lang === 'bn' ? 'সম্পন্ন' : 'Completed')"
                  />
                  <span class="text-caption font-mono text-grey-6">{{ o.invoiceNo }}</span>
                </div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  <q-icon name="sym_o_calendar_today" size="14px" class="q-mr-xs" />
                  {{ formatDateTime(o.createdAt) }}
                  <span class="q-mx-xs">&bull;</span>
                  <q-icon name="sym_o_table_restaurant" size="14px" class="q-mr-xs" />
                  {{ locale.t('invoices.table') }} {{ o.table }}
                  <span v-if="o.seat"> ({{ locale.t('invoices.seat') }} {{ o.seat }})</span>
                </div>
              </div>
            </div>

            <!-- Right: Amount and Actions -->
            <div class="row items-center" style="gap: 16px">
              <div class="text-right">
                <div class="text-h6 text-weight-bolder font-mono text-primary">
                  {{ formatMoney(o.total) }}
                </div>
                <div class="text-caption text-grey-6">
                  {{ o.lines?.length || 0 }} {{ locale.lang === 'bn' ? 'টি আইটেম' : 'items' }}
                </div>
              </div>

              <!-- Quick action buttons on each order as required by Step 5 -->
              <div class="row q-gutter-xs" @click.stop>
                <q-btn
                  unelevated
                  dense
                  size="sm"
                  color="primary"
                  icon="sym_o_visibility"
                  :label="locale.t('invoices.view')"
                  class="q-px-sm"
                  @click="openOrder(o)"
                />
                <q-btn
                  outline
                  dense
                  size="sm"
                  color="secondary"
                  icon="sym_o_print"
                  @click="quickPrint(o)"
                >
                  <q-tooltip>{{ locale.t('invoices.print') }}</q-tooltip>
                </q-btn>
                <q-btn
                  outline
                  dense
                  size="sm"
                  color="primary"
                  icon="sym_o_picture_as_pdf"
                  @click="quickPdf(o)"
                >
                  <q-tooltip>{{ locale.t('invoices.pdf') }}</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Invoice Detail & History Dialog (Requirement 2) -->
    <InvoiceDialog
      v-if="activeOrder"
      v-model="dialogOpen"
      :order="activeOrder"
      :restaurant="restaurantStore.forOrder(activeOrder)"
      @complete="onComplete"
      @reopen="onReopen"
      @close="onDialogClose"
    />
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useOrderStore } from '@/stores/orders'
import { useRestaurantStore } from '@/stores/restaurants'
import { useLocaleStore } from '@/stores/locale'
import { formatDateTime } from '@/utils/dates'
import { formatMoney } from '@/utils/money'
import { downloadInvoicePdf, printInvoice } from '@/utils/invoice'
import InvoiceDialog from '@/components/invoice/InvoiceDialog.vue'

const props = defineProps({ id: { type: String, default: '' } })
const route = useRoute()
const router = useRouter()
const orders = useOrderStore()
const restaurantStore = useRestaurantStore()
const locale = useLocaleStore()

const search = ref('')
const tab = ref('upcoming')

const todayDateFormatted = computed(() => {
  const d = new Date()
  return d.toLocaleDateString(locale.lang === 'bn' ? 'bn-BD' : 'en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})

const matches = (o, needle) =>
  !needle ||
  o.invoiceNo.toLowerCase().includes(needle) ||
  (o.customer?.name || '').toLowerCase().includes(needle) ||
  String(o.table).toLowerCase().includes(needle)

const rows = computed(() => {
  const needle = search.value?.trim().toLowerCase() ?? ''
  const source = tab.value === 'upcoming' ? orders.upcoming : orders.previous
  return source.filter((o) => matches(o, needle))
})

const dialogOpen = ref(false)
const activeOrder = ref(null)

function openOrder(o) {
  activeOrder.value = o
  dialogOpen.value = true
  if (route.params.id !== o.id) router.replace(`/app/invoices/${o.id}`)
}

function onDialogClose() {
  if (route.params.id) router.replace('/app/invoices')
}

function onComplete(id) {
  orders.complete(id)
  dialogOpen.value = false
  Notify.create({
    type: 'positive',
    message: locale.lang === 'bn' ? 'অর্ডার সম্পন্ন হিসেবে চিহ্নিত হয়েছে।' : 'Order marked as completed.',
  })
}

function onReopen(id) {
  orders.reopen(id)
  dialogOpen.value = false
  Notify.create({
    type: 'info',
    message: locale.lang === 'bn' ? 'অর্ডার আবার চলমানে ফেরত নেওয়া হয়েছে।' : 'Order moved back to upcoming.',
  })
}

function quickPrint(o) {
  const restaurant = restaurantStore.forOrder(o)
  try {
    printInvoice(o, restaurant)
  } catch {
    Notify.create({ type: 'negative', message: 'Print blocked by browser.' })
  }
}

async function quickPdf(o) {
  const restaurant = restaurantStore.forOrder(o)
  try {
    await downloadInvoicePdf(o, restaurant)
    Notify.create({ type: 'positive', message: 'PDF generated!' })
  } catch {
    Notify.create({ type: 'negative', message: 'Failed to generate PDF.' })
  }
}

watch(
  () => props.id,
  (id) => {
    if (!id) return
    const order = orders.byId(id)
    if (order) {
      activeOrder.value = order
      dialogOpen.value = true
      tab.value = order.status === 'upcoming' ? 'upcoming' : 'previous'
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.page-shell {
  max-width: 1040px;
  margin: 0 auto;
}
.revenue-card {
  border-radius: 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-card);
}
.metric-box {
  background: var(--surface-sunken);
  border: 1px solid var(--line);
  transition: transform 0.2s ease;
}
.metric-box:hover {
  transform: translateY(-2px);
}
.order-row-card {
  border-radius: 14px;
  background: var(--surface);
  transition: all 0.2s ease;
}
.order-row-card:hover {
  transform: translateY(-2px);
  border-color: var(--q-primary);
  box-shadow: var(--shadow-card);
}
.empty-card {
  border-radius: 16px;
  border: 2px dashed var(--line);
}
</style>

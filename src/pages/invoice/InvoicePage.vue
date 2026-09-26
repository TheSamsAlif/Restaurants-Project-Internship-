<template>
  <q-page class="q-pa-md q-pa-lg-lg page-shell">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg" style="gap: 12px">
      <div>
        <div class="text-caption text-primary text-weight-bold text-uppercase">Step 5: Ledger & Records</div>
        <div class="text-h4 text-weight-bolder">Invoices & Orders</div>
        <div class="text-body2 text-grey-6 q-mt-xs">
          Browse, view, download, and print past and upcoming dining invoices.
        </div>
      </div>
      <q-btn
        unelevated
        color="primary"
        icon="sym_o_add"
        label="New Order"
        to="/app/orders"
        class="text-weight-bold"
      />
    </div>

    <!-- Search Input -->
    <div class="q-mb-md">
      <q-input
        v-model="search"
        outlined
        dense
        placeholder="Search by customer name, invoice #, or table number..."
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
          <span class="text-weight-bold">Upcoming Orders</span>
          <q-badge color="warning" text-color="black" :label="orders.upcoming.length" />
        </div>
      </q-tab>
      <q-tab name="previous">
        <div class="row items-center" style="gap: 8px">
          <q-icon name="sym_o_task_alt" color="positive" />
          <span class="text-weight-bold">Previous Orders</span>
          <q-badge color="positive" :label="orders.previous.length" />
        </div>
      </q-tab>
    </q-tabs>

    <!-- Empty State -->
    <div v-if="!rows.length" class="text-center q-pa-xl surface-card empty-card">
      <q-icon name="sym_o_receipt" size="56px" color="grey-5" class="q-mb-md" />
      <div class="text-h6 text-weight-bold">
        {{ orders.orders.length ? 'No Matching Invoices Found' : 'No Orders Recorded Yet' }}
      </div>
      <div class="text-body2 text-grey-6 q-my-sm">
        {{ orders.orders.length ? 'Try a different search query' : 'Place orders from the POS to generate invoices.' }}
      </div>
      <q-btn v-if="!orders.orders.length" unelevated color="primary" label="Create First Order" to="/app/orders" class="q-mt-sm" />
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
                    :label="o.status === 'upcoming' ? 'Upcoming' : 'Completed'"
                  />
                  <span class="text-caption font-mono text-grey-6">{{ o.invoiceNo }}</span>
                </div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  <q-icon name="sym_o_calendar_today" size="14px" class="q-mr-xs" />
                  {{ formatDateTime(o.createdAt) }}
                  <span class="q-mx-xs">&bull;</span>
                  <q-icon name="sym_o_table_restaurant" size="14px" class="q-mr-xs" />
                  Table {{ o.table }}
                  <span v-if="o.seat"> (Seat {{ o.seat }})</span>
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
                  {{ o.lines?.length || 0 }} items
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
                  label="View"
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
                  <q-tooltip>Print Invoice</q-tooltip>
                </q-btn>
                <q-btn
                  outline
                  dense
                  size="sm"
                  color="primary"
                  icon="sym_o_picture_as_pdf"
                  @click="quickPdf(o)"
                >
                  <q-tooltip>Download PDF</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Invoice Detail Dialog -->
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
import { formatDateTime } from '@/utils/dates'
import { formatMoney } from '@/utils/money'
import { downloadInvoicePdf, printInvoice } from '@/utils/invoice'
import InvoiceDialog from '@/components/invoice/InvoiceDialog.vue'

const props = defineProps({ id: { type: String, default: '' } })
const route = useRoute()
const router = useRouter()
const orders = useOrderStore()
const restaurantStore = useRestaurantStore()

const search = ref('')
const tab = ref('upcoming')

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
  Notify.create({ type: 'positive', message: 'Order marked as completed.' })
}

function onReopen(id) {
  orders.reopen(id)
  dialogOpen.value = false
  Notify.create({ type: 'info', message: 'Order moved back to upcoming.' })
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

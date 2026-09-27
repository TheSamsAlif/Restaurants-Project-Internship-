<template>
  <q-dialog v-model="open" @hide="$emit('close')">
    <q-card
      class="surface-card column no-wrap"
      style="width: 720px; max-width: 96vw; max-height: 92vh; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column;"
    >
      <!-- Dialog Header (Fixed at top) -->
      <q-card-section class="col-auto row items-center q-pb-none no-print border-bottom">
        <div class="row items-center" style="gap: 10px">
          <q-avatar
            size="38px"
            :color="order.status === 'upcoming' ? 'amber-1' : 'green-1'"
            :text-color="order.status === 'upcoming' ? 'warning' : 'positive'"
            :icon="order.status === 'upcoming' ? 'sym_o_schedule' : 'sym_o_check_circle'"
          />
          <div>
            <div class="row items-center" style="gap: 8px">
              <span class="text-subtitle1 text-weight-bolder">{{ order.invoiceNo }}</span>
              <q-badge
                :color="order.status === 'upcoming' ? 'warning' : 'positive'"
                :label="order.status === 'upcoming' ? (locale.lang === 'bn' ? 'চলমান কিচেন অর্ডার' : 'Upcoming Order') : (locale.lang === 'bn' ? 'সম্পন্ন অর্ডার' : 'Completed Order')"
                class="text-weight-bold"
              />
            </div>
            <div class="text-caption text-grey-6">
              {{ restaurant?.name || 'Restaurant POS' }} &bull; {{ formatDateTime(order.createdAt) }}
            </div>
          </div>
        </div>
        <q-space />
        <q-btn flat round dense icon="sym_o_close" v-close-popup />
      </q-card-section>

      <!-- View Selector Tabs: Details & History vs Printable Thermal Slip -->
      <div class="col-auto q-px-md q-pt-sm bg-surface-sunken border-bottom no-print">
        <q-tabs
          v-model="activeTab"
          dense
          active-color="primary"
          indicator-color="primary"
          align="left"
        >
          <q-tab name="details" icon="sym_o_manage_history" :label="locale.t('invoices.detailsTab')" />
          <q-tab name="slip" icon="sym_o_receipt" :label="locale.t('invoices.slipTab')" />
        </q-tabs>
      </div>

      <!-- Scrollable Tab Panels Body -->
      <q-tab-panels v-model="activeTab" animated class="col scroll bg-surface">
        <!-- TAB 1: Order Details & History -->
        <q-tab-panel name="details" class="q-pa-md q-gutter-y-md">
          <!-- Order History Timeline -->
          <div class="history-banner q-pa-md rounded-borders">
            <div class="text-caption text-weight-bold text-primary text-uppercase q-mb-xs">
              {{ locale.t('invoices.timeline') }}
            </div>
            <div class="row items-center justify-between text-body2 q-col-gutter-sm">
              <!-- Step 1: Placed -->
              <div class="col-12 col-sm-4 row items-center" style="gap: 8px">
                <q-icon name="sym_o_check_circle" color="positive" size="22px" />
                <div>
                  <div class="text-weight-bold text-caption">{{ locale.t('invoices.orderPlaced') }}</div>
                  <div class="text-caption text-grey-6 font-mono">{{ formatDateTime(order.createdAt) }}</div>
                </div>
              </div>

              <!-- Step 2: Seating & Kitchen -->
              <div class="col-12 col-sm-4 row items-center" style="gap: 8px">
                <q-icon
                  :name="order.status === 'completed' ? 'sym_o_check_circle' : 'sym_o_soup_kitchen'"
                  :color="order.status === 'completed' ? 'positive' : 'warning'"
                  size="22px"
                />
                <div>
                  <div class="text-weight-bold text-caption">
                    {{ locale.t('invoices.table') }} {{ order.table }} ({{ locale.t('invoices.seat') }} {{ order.seat || '1' }})
                  </div>
                  <div class="text-caption text-grey-6">{{ locale.t('invoices.kitchenPrep') }}</div>
                </div>
              </div>

              <!-- Step 3: Completed / Status (with one-click inline completion button) -->
              <div class="col-12 col-sm-4 row items-center" style="gap: 8px">
                <q-icon
                  :name="order.status === 'completed' ? 'sym_o_task_alt' : 'sym_o_hourglass_top'"
                  :color="order.status === 'completed' ? 'positive' : 'warning'"
                  size="22px"
                />
                <div class="col">
                  <div class="text-weight-bold text-caption">
                    {{ order.status === 'completed' ? locale.t('invoices.completedServed') : (locale.lang === 'bn' ? 'চলমান / পরিবেশন বাকি' : 'Awaiting Serving') }}
                  </div>
                  <div class="text-caption text-grey-6 font-mono q-mb-xs">
                    {{ order.completedAt ? formatDateTime(order.completedAt) : (locale.lang === 'bn' ? 'কিচেনে প্রস্তুত হচ্ছে' : 'In Kitchen Preparation') }}
                  </div>
                  <q-btn
                    v-if="order.status === 'upcoming'"
                    unelevated
                    dense
                    color="positive"
                    size="xs"
                    icon="sym_o_check_circle"
                    :label="locale.lang === 'bn' ? 'সম্পন্ন করুন' : 'Complete Order'"
                    class="q-px-sm text-weight-bolder"
                    @click="$emit('complete', order.id)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Customer & Seating Card -->
          <div class="surface-sunken q-pa-md rounded-borders">
            <div class="text-caption text-weight-bold text-grey-7 text-uppercase q-mb-sm">
              {{ locale.t('invoices.customerDetails') }}
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-6 col-sm-3">
                <div class="text-caption text-grey-6">{{ locale.t('invoices.customer') }}</div>
                <div class="text-body2 text-weight-bolder">{{ customerName }}</div>
              </div>
              <div class="col-6 col-sm-3">
                <div class="text-caption text-grey-6">{{ locale.t('invoices.phone') }}</div>
                <div class="text-body2 font-mono">{{ customerPhone }}</div>
              </div>
              <div class="col-6 col-sm-3">
                <div class="text-caption text-grey-6">{{ locale.t('invoices.seating') }}</div>
                <div class="text-body2 text-weight-bolder text-primary">
                  {{ locale.t('invoices.table') }} {{ order.table }} &bull; {{ locale.t('invoices.seat') }} {{ order.seat || '1' }}
                </div>
              </div>
              <div class="col-6 col-sm-3">
                <div class="text-caption text-grey-6">{{ locale.lang === 'bn' ? 'শাখা' : 'Branch' }}</div>
                <div class="text-body2">{{ order.branch || restaurant?.branches?.[0] || 'Main Branch' }}</div>
              </div>
            </div>
          </div>

          <!-- Itemized Food Details Table -->
          <div>
            <div class="text-caption text-weight-bold text-grey-7 text-uppercase q-mb-xs">
              {{ locale.t('invoices.itemsOrdered') }} ({{ (order.lines || []).length }})
            </div>
            <q-markup-table flat bordered dense class="rounded-borders">
              <thead>
                <tr class="bg-surface-sunken text-grey-8">
                  <th class="text-left">#</th>
                  <th class="text-left">{{ locale.lang === 'bn' ? 'খাবারের নাম' : 'Item' }}</th>
                  <th class="text-right">{{ locale.t('invoices.unitPrice') }}</th>
                  <th class="text-center">{{ locale.t('invoices.qty') }}</th>
                  <th class="text-right">{{ locale.t('invoices.amount') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(l, idx) in (order.lines || [])" :key="l.itemId || idx">
                  <td class="text-grey-6 font-mono">{{ idx + 1 }}</td>
                  <td class="text-weight-bold">
                    <div>{{ locale.lang === 'bn' && l.nameBn ? l.nameBn : l.name }}</div>
                    <div v-if="l.category" class="text-caption text-grey-5">{{ l.category }}</div>
                  </td>
                  <td class="text-right font-mono">{{ formatMoney(l.price) }}</td>
                  <td class="text-center font-mono text-weight-bold">{{ l.qty }}</td>
                  <td class="text-right font-mono text-weight-bold">{{ formatMoney(l.amount || (l.price * l.qty)) }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <!-- Billing & Financial Breakdown -->
          <div class="row justify-end q-mt-sm">
            <div class="col-12 col-sm-7 surface-sunken q-pa-md rounded-borders column q-gutter-y-xs">
              <div class="row justify-between text-body2">
                <span class="text-grey-6">{{ locale.t('invoices.subtotal') }}:</span>
                <span class="font-mono">{{ formatMoney(order.subtotal || 0) }}</span>
              </div>
              <div v-if="order.discountAmount > 0" class="row justify-between text-body2 text-positive text-weight-bold">
                <span>
                  {{ order.discountType === 'student' ? (locale.lang === 'bn' ? 'শিক্ষার্থী ছাড় (১০%)' : 'Student Discount (10%)') :
                     order.discountType === 'couple' ? (locale.lang === 'bn' ? 'কাপল অফার (১৫%)' : 'Couple Offer (15%)') :
                     (locale.lang === 'bn' ? 'সিনিয়র সিটিজেন ছাড় (২০%)' : 'Senior Citizen Discount (20%)') }}:
                </span>
                <span class="font-mono">-{{ formatMoney(order.discountAmount) }}</span>
              </div>
              <div class="row justify-between text-body2">
                <span class="text-grey-6">{{ locale.t('invoices.vat') }} ({{ Math.round((order.taxRate || 0.05) * 100) }}%):</span>
                <span class="font-mono">{{ formatMoney(order.tax || 0) }}</span>
              </div>
              <q-separator class="q-my-xs" />
              <div class="row justify-between text-h6 text-weight-bolder text-primary">
                <span>{{ locale.t('invoices.total') }}:</span>
                <span class="font-mono">{{ formatMoney(order.total || 0) }}</span>
              </div>
            </div>
          </div>

          <!-- Upcoming order notice & direct action -->
          <div
            v-if="order.status === 'upcoming'"
            class="q-mt-sm q-pa-sm rounded-borders bg-amber-1 row items-center justify-between"
            style="border: 1px dashed rgba(217, 119, 6, 0.4);"
          >
            <div class="row items-center" style="gap: 8px">
              <q-icon name="sym_o_info" color="warning" size="20px" />
              <span class="text-caption text-grey-9 text-weight-medium">
                {{ locale.lang === 'bn' ? 'পরিবেশন শেষ হলে "অর্ডার সম্পন্ন করুন" বাটনে ক্লিক করুন, বিক্রির টাকা হিসেবে যুক্ত হবে।' : 'Click "Mark as Completed" after serving to record sales into revenue.' }}
              </span>
            </div>
            <q-btn
              unelevated
              dense
              color="positive"
              icon="sym_o_check_circle"
              :label="locale.lang === 'bn' ? 'সম্পন্ন করুন' : 'Mark Completed'"
              class="q-px-sm text-weight-bold"
              @click="$emit('complete', order.id)"
            />
          </div>
        </q-tab-panel>

        <!-- TAB 2: Thermal Receipt Slip -->
        <q-tab-panel name="slip" class="q-pa-md">
          <InvoiceSlip :order="order" :restaurant="restaurant" />
        </q-tab-panel>
      </q-tab-panels>

      <!-- Action Buttons Footer (ALWAYS FIXED AT BOTTOM, NEVER CLIPPED) -->
      <q-card-actions class="col-auto q-px-md q-py-sm no-print row items-center justify-between border-top bg-surface" style="flex-shrink: 0; min-height: 56px;">
        <!-- Status Switcher -->
        <div>
          <q-btn
            v-if="order.status === 'upcoming'"
            unelevated
            color="positive"
            icon="sym_o_check_circle"
            :label="locale.lang === 'bn' ? 'অর্ডার সম্পন্ন করুন' : 'Mark as Completed'"
            class="q-px-md text-weight-bolder shadow-1"
            @click="$emit('complete', order.id)"
          >
            <q-tooltip>{{ locale.lang === 'bn' ? 'অর্ডারটি সম্পন্ন করুন ও সেলস রেভিনিউতে যোগ করুন' : 'Mark order as completed and add to completed sales' }}</q-tooltip>
          </q-btn>
          <q-btn
            v-else
            flat
            color="warning"
            icon="sym_o_undo"
            :label="locale.lang === 'bn' ? 'আবার চলমানে ফেরত নিন' : 'Move back to Upcoming'"
            class="q-px-sm text-weight-bold"
            @click="$emit('reopen', order.id)"
          />
        </div>

        <!-- Print & Export Buttons -->
        <div class="row q-gutter-xs">
          <q-btn
            outline
            dense
            color="primary"
            icon="sym_o_print"
            :label="locale.t('invoices.print')"
            class="q-px-sm text-weight-bold"
            @click="onPrint"
          />
          <q-btn
            outline
            dense
            color="secondary"
            icon="sym_o_description"
            :label="locale.t('invoices.text')"
            class="q-px-sm text-weight-bold"
            @click="onDownloadText"
          />
          <q-btn
            unelevated
            dense
            color="primary"
            icon="sym_o_picture_as_pdf"
            :label="locale.t('invoices.pdf')"
            class="q-px-sm text-weight-bold"
            :loading="pdfLoading"
            @click="onDownloadPdf"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Notify } from 'quasar'
import InvoiceSlip from '@/components/invoice/InvoiceSlip.vue'
import { downloadInvoicePdf, downloadInvoiceText, printInvoice } from '@/utils/invoice'
import { formatDateTime } from '@/utils/dates'
import { formatMoney } from '@/utils/money'
import { useLocaleStore } from '@/stores/locale'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  order: { type: Object, required: true },
  restaurant: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'close', 'complete', 'reopen'])

const locale = useLocaleStore()
const activeTab = ref('details')

const open = ref(props.modelValue)
watch(
  () => props.modelValue,
  (v) => {
    open.value = v
    if (v) activeTab.value = 'details'
  },
)
watch(open, (v) => emit('update:modelValue', v))

watch(
  () => props.order?.id,
  () => {
    activeTab.value = 'details'
  },
)

const customerName = computed(() => {
  const c = props.order?.customer
  if (!c) return 'Walk-in Guest'
  if (typeof c === 'string') return c.trim() || 'Walk-in Guest'
  return c.name || 'Walk-in Guest'
})

const customerPhone = computed(() => {
  const c = props.order?.customer
  if (!c || typeof c === 'string') return 'N/A'
  return c.phone || 'N/A'
})

const pdfLoading = ref(false)

function onPrint() {
  try {
    printInvoice(props.order, props.restaurant)
  } catch {
    Notify.create({ type: 'negative', message: 'Unable to open print preview.' })
  }
}

function onDownloadText() {
  try {
    downloadInvoiceText(props.order, props.restaurant)
    Notify.create({ type: 'positive', message: 'Invoice text downloaded.' })
  } catch {
    Notify.create({ type: 'negative', message: 'Download blocked by browser.' })
  }
}

async function onDownloadPdf() {
  pdfLoading.value = true
  try {
    await downloadInvoicePdf(props.order, props.restaurant)
    Notify.create({ type: 'positive', message: 'PDF generated successfully!' })
  } catch {
    Notify.create({ type: 'negative', message: 'Could not generate PDF.' })
  } finally {
    pdfLoading.value = false
  }
}
</script>

<style scoped>
.history-banner {
  background: rgba(168, 67, 42, 0.08);
  border: 1px solid rgba(168, 67, 42, 0.2);
}
.surface-sunken {
  background: var(--surface-sunken);
  border: 1px solid var(--line);
}
.border-bottom {
  border-bottom: 1px solid var(--line);
}
.border-top {
  border-top: 1px solid var(--line);
}
</style>

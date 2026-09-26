<template>
  <q-dialog v-model="open" @hide="$emit('close')">
    <q-card class="surface-card" style="width: 660px; max-width: 96vw; border-radius: 16px;">
      <!-- Dialog Header -->
      <q-card-section class="row items-center q-pb-none no-print border-bottom">
        <div class="row items-center" style="gap: 10px">
          <q-avatar
            size="36px"
            :color="order.status === 'upcoming' ? 'amber-1' : 'green-1'"
            :text-color="order.status === 'upcoming' ? 'warning' : 'positive'"
            :icon="order.status === 'upcoming' ? 'sym_o_schedule' : 'sym_o_check_circle'"
          />
          <div>
            <div class="row items-center" style="gap: 8px">
              <span class="text-subtitle1 text-weight-bolder">{{ order.invoiceNo }}</span>
              <q-badge
                :color="order.status === 'upcoming' ? 'warning' : 'positive'"
                :label="order.status === 'upcoming' ? (locale.lang === 'bn' ? 'চলমান অর্ডার' : 'Upcoming Order') : (locale.lang === 'bn' ? 'সম্পন্ন অর্ডার' : 'Completed Order')"
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
      <div class="q-px-md q-pt-sm bg-surface-sunken border-bottom no-print">
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

      <q-tab-panels v-model="activeTab" animated class="bg-surface">
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
                <q-icon name="sym_o_check_circle" color="positive" size="20px" />
                <div>
                  <div class="text-weight-bold text-caption">{{ locale.t('invoices.orderPlaced') }}</div>
                  <div class="text-caption text-grey-6 font-mono">{{ formatDateTime(order.createdAt) }}</div>
                </div>
              </div>

              <!-- Step 2: Seating & Kitchen -->
              <div class="col-12 col-sm-4 row items-center" style="gap: 8px">
                <q-icon
                  :name="order.status === 'completed' ? 'sym_o_check_circle' : 'sym_o_hourglass_top'"
                  :color="order.status === 'completed' ? 'positive' : 'warning'"
                  size="20px"
                />
                <div>
                  <div class="text-weight-bold text-caption">
                    {{ locale.t('invoices.table') }} {{ order.table }} ({{ locale.t('invoices.seat') }} {{ order.seat || '1' }})
                  </div>
                  <div class="text-caption text-grey-6">{{ locale.t('invoices.kitchenPrep') }}</div>
                </div>
              </div>

              <!-- Step 3: Completed / Status -->
              <div class="col-12 col-sm-4 row items-center" style="gap: 8px">
                <q-icon
                  :name="order.status === 'completed' ? 'sym_o_task_alt' : 'sym_o_radio_button_unchecked'"
                  :color="order.status === 'completed' ? 'positive' : 'grey-5'"
                  size="20px"
                />
                <div>
                  <div class="text-weight-bold text-caption">{{ locale.t('invoices.completedServed') }}</div>
                  <div class="text-caption text-grey-6 font-mono">
                    {{ order.completedAt ? formatDateTime(order.completedAt) : (locale.lang === 'bn' ? 'চলমান...' : 'In Progress') }}
                  </div>
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
                <div class="text-body2 text-weight-bolder">{{ order.customer?.name || 'Walk-in Guest' }}</div>
              </div>
              <div class="col-6 col-sm-3">
                <div class="text-caption text-grey-6">{{ locale.t('invoices.phone') }}</div>
                <div class="text-body2 font-mono">{{ order.customer?.phone || 'N/A' }}</div>
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
              {{ locale.t('invoices.itemsOrdered') }} ({{ order.lines?.length || 0 }})
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
                <tr v-for="(l, idx) in order.lines" :key="l.itemId || idx">
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
            <div class="col-12 col-sm-6 surface-sunken q-pa-md rounded-borders column q-gutter-y-xs">
              <div class="row justify-between text-body2">
                <span class="text-grey-6">{{ locale.t('invoices.subtotal') }}:</span>
                <span class="font-mono">{{ formatMoney(order.subtotal) }}</span>
              </div>
              <div class="row justify-between text-body2">
                <span class="text-grey-6">{{ locale.t('invoices.vat') }} ({{ Math.round((order.taxRate || 0.05) * 100) }}%):</span>
                <span class="font-mono">{{ formatMoney(order.tax) }}</span>
              </div>
              <q-separator class="q-my-xs" />
              <div class="row justify-between text-h6 text-weight-bolder text-primary">
                <span>{{ locale.t('invoices.total') }}:</span>
                <span class="font-mono">{{ formatMoney(order.total) }}</span>
              </div>
            </div>
          </div>
        </q-tab-panel>

        <!-- TAB 2: Thermal Receipt Slip -->
        <q-tab-panel name="slip" class="q-pa-md">
          <InvoiceSlip :order="order" :restaurant="restaurant" />
        </q-tab-panel>
      </q-tab-panels>

      <!-- Action Buttons Footer -->
      <q-card-actions class="q-px-md q-pb-md no-print row items-center justify-between border-top">
        <!-- Status Switcher -->
        <div>
          <q-btn
            v-if="order.status === 'upcoming'"
            unelevated
            dense
            color="positive"
            icon="sym_o_check_circle"
            :label="locale.t('invoices.markDone')"
            class="q-px-sm"
            @click="$emit('complete', order.id)"
          />
          <q-btn
            v-else
            flat
            dense
            color="warning"
            icon="sym_o_undo"
            :label="locale.t('invoices.reopen')"
            class="q-px-sm"
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
import { ref, watch } from 'vue'
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
watch(() => props.modelValue, (v) => (open.value = v))
watch(open, (v) => emit('update:modelValue', v))

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

<template>
  <q-dialog v-model="open" @hide="$emit('close')">
    <q-card class="surface-card" style="width: 420px; max-width: 95vw; border-radius: 16px;">
      <q-card-section class="row items-center q-pb-none no-print">
        <div class="row items-center" style="gap: 8px">
          <q-badge
            :color="order.status === 'upcoming' ? 'warning' : 'positive'"
            :label="order.status === 'upcoming' ? 'Upcoming Order' : 'Completed Order'"
            class="text-weight-bold"
          />
          <span class="text-caption text-grey-6 font-mono">{{ order.invoiceNo }}</span>
        </div>
        <q-space />
        <q-btn flat round dense icon="sym_o_close" v-close-popup />
      </q-card-section>

      <!-- Slip Component -->
      <q-card-section class="q-pt-md">
        <InvoiceSlip :order="order" :restaurant="restaurant" />
      </q-card-section>

      <!-- Action Buttons as required by Step 5: View, Download, Print -->
      <q-card-actions class="q-px-md q-pb-sm no-print row q-col-gutter-xs justify-center">
        <div class="col-4">
          <q-btn
            outline
            dense
            color="primary"
            class="full-width text-weight-bold"
            icon="sym_o_print"
            label="Print"
            @click="onPrint"
          />
        </div>
        <div class="col-4">
          <q-btn
            outline
            dense
            color="secondary"
            class="full-width text-weight-bold"
            icon="sym_o_description"
            label="Text"
            @click="onDownloadText"
          />
        </div>
        <div class="col-4">
          <q-btn
            unelevated
            dense
            color="primary"
            class="full-width text-weight-bold"
            icon="sym_o_picture_as_pdf"
            label="PDF"
            :loading="pdfLoading"
            @click="onDownloadPdf"
          />
        </div>
      </q-card-actions>

      <!-- Status Toggle Action -->
      <q-card-actions class="q-px-md q-pb-md no-print justify-center">
        <q-btn
          v-if="order.status === 'upcoming'"
          flat
          dense
          color="positive"
          icon="sym_o_check_circle"
          label="Mark as Completed"
          @click="$emit('complete', order.id)"
        />
        <q-btn
          v-else
          flat
          dense
          color="warning"
          icon="sym_o_undo"
          label="Move back to Upcoming"
          @click="$emit('reopen', order.id)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Notify } from 'quasar'
import InvoiceSlip from '@/components/invoice/InvoiceSlip.vue'
import { downloadInvoicePdf, downloadInvoiceText, printInvoice } from '@/utils/invoice'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  order: { type: Object, required: true },
  restaurant: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'close', 'complete', 'reopen'])

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

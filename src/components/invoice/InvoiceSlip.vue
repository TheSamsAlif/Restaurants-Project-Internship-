<template>
  <div class="receipt-slip q-pa-sm">
    <div class="text-center q-mb-xs">
      <img v-if="restaurant?.logo" :src="restaurant.logo" class="receipt-logo" />
      <div class="text-h6 text-weight-bolder">{{ restaurant?.name || 'Restaurant POS' }}</div>
      <div v-if="restaurant?.address" class="text-caption text-grey-7">{{ restaurant.address }}</div>
      <div v-if="restaurant?.phone" class="text-caption text-grey-7 font-mono">Tel: {{ restaurant.phone }}</div>
      <div v-if="order.branch" class="text-caption text-grey-7">Branch: {{ order.branch }}</div>
    </div>

    <q-separator dashed class="q-my-sm" />

    <div class="column q-gutter-y-xs text-caption">
      <div class="row justify-between">
        <span class="text-grey-6">Invoice No:</span>
        <span class="font-mono text-weight-bold">{{ order.invoiceNo }}</span>
      </div>
      <div class="row justify-between">
        <span class="text-grey-6">Date & Time:</span>
        <span class="font-mono">{{ formatDateTime(order.createdAt) }}</span>
      </div>
      <div class="row justify-between">
        <span class="text-grey-6">Customer:</span>
        <span class="text-weight-bold">{{ order.customer?.name || 'Walk-in' }}</span>
      </div>
      <div v-if="order.customer?.phone" class="row justify-between">
        <span class="text-grey-6">Phone:</span>
        <span class="font-mono">{{ order.customer.phone }}</span>
      </div>
      <div v-if="seating" class="row justify-between">
        <span class="text-grey-6">Seating:</span>
        <span class="font-mono text-weight-bold">{{ seating }}</span>
      </div>
      <div v-if="order.status === 'completed' && order.completedAt" class="row justify-between">
        <span class="text-grey-6">Completed:</span>
        <span class="font-mono">{{ formatDateTime(order.completedAt) }}</span>
      </div>
    </div>

    <q-separator dashed class="q-my-sm" />

    <!-- Ordered Items -->
    <div class="items-receipt-list q-my-sm">
      <div v-for="l in order.lines" :key="l.itemId" class="row justify-between items-start q-py-xs text-body2">
        <div class="col">
          <div class="text-weight-bold">{{ locale.lang === 'bn' && l.nameBn ? l.nameBn : l.name }}</div>
          <div class="text-caption text-grey-6 font-mono">
            {{ l.qty }} &times; {{ formatMoney(l.price) }}
          </div>
        </div>
        <div class="font-mono text-weight-bold">{{ formatMoney(l.amount) }}</div>
      </div>
    </div>

    <q-separator dashed class="q-my-sm" />

    <!-- Summary -->
    <div class="column q-gutter-y-xs text-body2">
      <div class="row justify-between">
        <span class="text-grey-7">Subtotal:</span>
        <span class="font-mono">{{ formatMoney(order.subtotal) }}</span>
      </div>
      <div class="row justify-between">
        <span class="text-grey-7">VAT ({{ Math.round((order.taxRate || 0.05) * 100) }}%):</span>
        <span class="font-mono">{{ formatMoney(order.tax) }}</span>
      </div>
      <q-separator class="q-my-xs" />
      <div class="row justify-between text-h6 text-weight-bolder text-primary">
        <span>TOTAL:</span>
        <span class="font-mono">{{ formatMoney(order.total) }}</span>
      </div>
    </div>

    <q-separator dashed class="q-my-sm" />
    <div class="text-center text-caption text-grey-6 q-mt-sm">
      {{ locale.t('invoices.thankYou') }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDateTime } from '@/utils/dates'
import { formatMoney } from '@/utils/money'
import { useLocaleStore } from '@/stores/locale'

const props = defineProps({
  order: { type: Object, required: true },
  restaurant: { type: Object, default: null },
})

const locale = useLocaleStore()

const seating = computed(() => {
  const tLabel = locale.t('invoices.table')
  const sLabel = locale.t('invoices.seat')
  return [props.order.table && `${tLabel} ${props.order.table}`, props.order.seat && `${sLabel} ${props.order.seat}`]
    .filter(Boolean)
    .join(', ')
})
</script>

<style scoped>
.receipt-slip {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  font-family: var(--font-body);
}
.receipt-logo {
  max-width: 60px;
  max-height: 60px;
  border-radius: 8px;
  margin-bottom: 6px;
}
</style>

<template>
  <q-dialog v-model="open" persistent @hide="$emit('close')">
    <q-card class="surface-card" style="width: 440px; max-width: 95vw; border-radius: 16px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bolder">
          {{ editing ? 'Edit Menu Item' : 'Add New Menu Item' }}
        </div>
        <q-space />
        <q-btn flat round dense icon="sym_o_close" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form ref="formRef" class="column q-gutter-y-md" @submit.prevent="onSubmit">
          <q-input
            v-model="name"
            outlined
            dense
            label="Item Name *"
            :rules="[required('Item name is required')]"
            lazy-rules
            autofocus
          >
            <template #prepend><q-icon name="sym_o_restaurant" /></template>
          </q-input>

          <q-select
            v-model="category"
            outlined
            dense
            use-input
            new-value-mode="add-unique"
            label="Category *"
            :options="categoryOptions"
            @filter="filterCategories"
            @new-value="onNewCategory"
            :rules="[required('Category is required')]"
            lazy-rules
            hint="Select an existing category or type a new one"
          >
            <template #prepend><q-icon name="sym_o_category" /></template>
          </q-select>

          <q-input
            v-model.number="price"
            outlined
            dense
            label="Price *"
            prefix="৳ "
            type="number"
            step="0.01"
            min="0"
            :rules="[positivePrice]"
            lazy-rules
          >
            <template #prepend><q-icon name="sym_o_payments" /></template>
          </q-input>

          <q-card-actions align="right" class="q-px-none q-pt-md">
            <q-btn flat label="Cancel" color="grey-7" v-close-popup />
            <q-btn
              type="submit"
              unelevated
              color="primary"
              class="q-px-lg text-weight-bold"
              :label="editing ? 'Save Changes' : 'Add Item'"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useMenuStore } from '@/stores/menu'
import { required, positivePrice } from '@/utils/validators'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'close', 'submit'])

const menu = useMenuStore()

const open = ref(props.modelValue)
watch(() => props.modelValue, (v) => (open.value = v))
watch(open, (v) => emit('update:modelValue', v))

const editing = ref(false)
const name = ref('')
const category = ref('')
const price = ref(null)
const formRef = ref(null)
const categoryOptions = ref(menu.categories)

watch(
  () => props.item,
  (it) => {
    editing.value = Boolean(it)
    name.value = it?.name ?? ''
    category.value = it?.category ?? ''
    price.value = it?.price ?? null
  },
  { immediate: true },
)

function filterCategories(val, update) {
  update(() => {
    const needle = val.toLowerCase()
    categoryOptions.value = menu.categories.filter((c) => c.toLowerCase().includes(needle))
  })
}

function onNewCategory(val, done) {
  const clean = val.trim()
  if (clean) done(clean, 'add-unique')
}

async function onSubmit() {
  const valid = await formRef.value.validate()
  if (!valid) return
  emit('submit', { name: name.value, category: category.value, price: price.value })
}
</script>

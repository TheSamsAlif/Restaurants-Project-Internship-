<template>
  <q-dialog v-model="open" persistent @hide="$emit('close')">
    <q-card class="surface-card" style="width: 480px; max-width: 95vw; border-radius: 16px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bolder">
          {{ editing ? locale.t('items.editItem') : locale.t('items.newItem') }}
        </div>
        <q-space />
        <q-btn flat round dense icon="sym_o_close" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form ref="formRef" class="column q-gutter-y-sm" @submit.prevent="onSubmit">
          <!-- Food Image Preview & Input -->
          <div class="column items-center q-mb-xs">
            <q-img
              :src="image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'"
              style="width: 100%; height: 140px; border-radius: 12px;"
              fit="cover"
            >
              <template #error>
                <div class="absolute-full flex flex-center bg-grey-2 text-grey-7">
                  <q-icon name="sym_o_restaurant" size="32px" color="primary" />
                </div>
              </template>
              <div class="absolute-bottom text-caption text-center q-pa-xs">
                {{ locale.lang === 'bn' ? 'খাবারের ছবির প্রিভিউ' : 'Food Image Preview' }}
              </div>
            </q-img>
          </div>

          <q-input
            v-model="image"
            outlined
            dense
            :label="locale.t('items.imageUrl')"
            :hint="locale.t('items.imageHint')"
          >
            <template #prepend><q-icon name="sym_o_image" /></template>
          </q-input>

          <!-- Preset Image Quick Pickers -->
          <div class="row q-gutter-xs q-mb-xs" style="font-size: 0.75rem;">
            <q-btn
              v-for="p in presets"
              :key="p.name"
              outline
              dense
              size="xs"
              color="primary"
              :label="p.name"
              @click="image = p.url"
            />
          </div>

          <div class="row q-col-gutter-xs">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="name"
                outlined
                dense
                label="English Name *"
                :rules="[required('Item name is required')]"
                lazy-rules
                autofocus
              >
                <template #prepend><q-icon name="sym_o_restaurant" /></template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="nameBn"
                outlined
                dense
                label="বাংলা নাম (Bangla Name)"
                placeholder="যেমন: চিকেন বিরিয়ানি"
              >
                <template #prepend><q-icon name="sym_o_translate" /></template>
              </q-input>
            </div>
          </div>

          <div class="row q-col-gutter-xs">
            <div class="col-12 col-sm-6">
              <q-select
                v-model="category"
                outlined
                dense
                use-input
                new-value-mode="add-unique"
                :label="locale.t('items.category')"
                :options="categoryOptions"
                @filter="filterCategories"
                @new-value="onNewCategory"
                :rules="[required('Category is required')]"
                lazy-rules
              >
                <template #prepend><q-icon name="sym_o_category" /></template>
              </q-select>
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model.number="price"
                outlined
                dense
                :label="locale.t('items.priceLabel')"
                prefix="৳ "
                type="number"
                step="0.01"
                min="0"
                :rules="[positivePrice]"
                lazy-rules
              >
                <template #prepend><q-icon name="sym_o_payments" /></template>
              </q-input>
            </div>
          </div>

          <q-card-actions align="right" class="q-px-none q-pt-sm">
            <q-btn flat label="Cancel" color="grey-7" v-close-popup />
            <q-btn
              type="submit"
              unelevated
              color="primary"
              class="q-px-lg text-weight-bold"
              :label="editing ? locale.t('setup.saveChanges') : locale.t('items.addItem')"
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
import { useLocaleStore } from '@/stores/locale'
import { required, positivePrice } from '@/utils/validators'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'close', 'submit'])

const menu = useMenuStore()
const locale = useLocaleStore()

const open = ref(props.modelValue)
watch(() => props.modelValue, (v) => (open.value = v))
watch(open, (v) => emit('update:modelValue', v))

const editing = ref(false)
const name = ref('')
const nameBn = ref('')
const category = ref('')
const price = ref(null)
const image = ref('')
const formRef = ref(null)
const categoryOptions = ref(menu.categories)

const presets = [
  { name: 'Fried Chicken', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80' },
  { name: 'Set Menu', url: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?w=500&auto=format&fit=crop&q=80' },
  { name: 'Fanta', url: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=500&auto=format&fit=crop&q=80' },
  { name: 'Sprite', url: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&auto=format&fit=crop&q=80' },
  { name: 'Coke', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80' },
  { name: 'Borhani', url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80' },
  { name: 'Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80' },
  { name: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80' },
  { name: 'Pizza', url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80' },
  { name: 'Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80' },
  { name: 'Fries', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80' },
]

watch(
  () => props.item,
  (it) => {
    editing.value = Boolean(it)
    name.value = it?.name ?? ''
    nameBn.value = it?.nameBn ?? ''
    category.value = it?.category ?? ''
    price.value = it?.price ?? null
    image.value = it?.image ?? ''
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
  emit('submit', {
    name: name.value,
    nameBn: nameBn.value || name.value,
    category: category.value,
    price: price.value,
    image: image.value || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
  })
}
</script>

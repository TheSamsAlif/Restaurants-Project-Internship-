<template>
  <q-page class="q-pa-md q-pa-lg-lg page-shell">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg" style="gap: 12px">
      <div>
        <div class="text-caption text-primary text-weight-bold text-uppercase">
          {{ locale.t('items.badge') }}
        </div>
        <div class="text-h4 text-weight-bolder">
          {{ locale.t('items.title') }}
        </div>
        <div class="text-body2 text-grey-6 q-mt-xs">
          {{ locale.t('items.showing', { count: filtered.length, total: menu.items.length }) }}
        </div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          outline
          color="secondary"
          icon="sym_o_dataset"
          :label="locale.t('items.loadSample')"
          @click="menu.addSamples()"
        />
        <q-btn
          unelevated
          color="primary"
          icon="sym_o_add"
          :label="locale.t('items.addItem')"
          class="text-weight-bold"
          @click="openAdd"
        />
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="row q-col-gutter-md q-mb-lg items-center">
      <div class="col-12 col-sm-8">
        <q-input
          v-model="search"
          outlined
          dense
          :placeholder="locale.t('items.searchPlaceholder')"
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
          :label="locale.t('items.filterLabel')"
        >
          <template #prepend><q-icon name="sym_o_filter_alt" /></template>
        </q-select>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!menu.items.length" class="text-center q-pa-xl surface-card empty-card">
      <q-icon name="sym_o_restaurant_menu" size="56px" color="grey-5" class="q-mb-md" />
      <div class="text-h6 text-weight-bold">{{ locale.t('items.emptyTitle') }}</div>
      <div class="text-body2 text-grey-6 q-my-sm">
        {{ locale.t('items.emptyDesc') }}
      </div>
      <div class="row justify-center q-gutter-sm q-mt-md">
        <q-btn unelevated color="primary" icon="sym_o_add" :label="locale.t('items.addItem')" @click="openAdd" />
        <q-btn outline color="secondary" icon="sym_o_dataset" :label="locale.t('items.loadSample')" @click="menu.addSamples()" />
      </div>
    </div>

    <!-- No Search Results -->
    <div v-else-if="!filtered.length" class="text-center q-pa-xl text-grey-6">
      <q-icon name="sym_o_search_off" size="48px" class="q-mb-sm text-grey-4" />
      <div class="text-h6">No matching items found</div>
      <div class="text-caption">Try adjusting your search query or filter</div>
    </div>

    <!-- Items in Card Format WITH FOOD PICTURES -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="it in filtered" :key="it.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card flat bordered class="item-card full-height column justify-between overflow-hidden">
          <div>
            <!-- Item Picture -->
            <div class="image-wrapper relative-position">
              <q-img
                :src="it.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'"
                style="height: 150px;"
                fit="cover"
              >
                <template #error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                    <q-icon name="sym_o_restaurant" size="36px" />
                  </div>
                </template>
              </q-img>
              <!-- Category Chip over image -->
              <q-chip
                dense
                color="primary"
                text-color="white"
                size="sm"
                class="absolute-top-left q-ma-sm shadow-2 text-weight-bold"
              >
                {{ locale.getItemCategory(it) }}
              </q-chip>
            </div>

            <!-- Card Content -->
            <q-card-section class="q-pt-sm q-pb-none">
              <div class="row items-start justify-between no-wrap q-mb-xs">
                <div class="text-subtitle1 text-weight-bolder ellipsis col q-pr-xs" :title="locale.getItemName(it)">
                  {{ locale.getItemName(it) }}
                </div>
                <div class="row no-wrap q-gutter-xs">
                  <q-btn flat round dense size="sm" color="primary" icon="sym_o_edit" @click="openEdit(it)">
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense size="sm" color="negative" icon="sym_o_delete" @click="confirmDelete(it)">
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </div>

          <q-card-section class="q-pt-none">
            <q-separator class="q-mb-sm" />
            <div class="row items-center justify-between">
              <span class="text-caption text-grey-6">{{ locale.t('items.price') }}</span>
              <span class="text-h6 text-weight-bolder font-mono text-primary">
                {{ formatMoney(it.price) }}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Add / Edit Dialog -->
    <ItemFormDialog v-model="dialogOpen" :item="editingItem" @submit="onSubmit" />

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteOpen">
      <q-card style="min-width: 320px; border-radius: 12px;">
        <q-card-section class="row items-center" style="gap: 12px">
          <q-avatar icon="sym_o_warning" color="negative" text-color="white" />
          <div class="text-h6 text-weight-bold">Confirm Deletion</div>
        </q-card-section>
        <q-card-section class="q-pt-none text-grey-7">
          Are you sure you want to delete <strong>{{ toDelete ? locale.getItemName(toDelete) : '' }}</strong>?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn unelevated color="negative" label="Delete" v-close-popup @click="doDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Notify } from 'quasar'
import { useMenuStore } from '@/stores/menu'
import { useLocaleStore } from '@/stores/locale'
import { formatMoney } from '@/utils/money'
import ItemFormDialog from '@/components/items/ItemFormDialog.vue'

const menu = useMenuStore()
const locale = useLocaleStore()

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

const dialogOpen = ref(false)
const editingItem = ref(null)
const deleteOpen = ref(false)
const toDelete = ref(null)

function openAdd() {
  editingItem.value = null
  dialogOpen.value = true
}

function openEdit(it) {
  editingItem.value = it
  dialogOpen.value = true
}

function onSubmit(data) {
  if (editingItem.value) {
    menu.update(editingItem.value.id, data)
    Notify.create({ type: 'positive', message: 'Item updated successfully!' })
  } else {
    menu.add(data)
    Notify.create({ type: 'positive', message: 'New item added to menu!' })
  }
  dialogOpen.value = false
}

function confirmDelete(it) {
  toDelete.value = it
  deleteOpen.value = true
}

function doDelete() {
  menu.remove(toDelete.value.id)
  Notify.create({ type: 'info', message: 'Item deleted.' })
}
</script>

<style scoped>
.page-shell {
  max-width: 1100px;
  margin: 0 auto;
}
.item-card {
  border-radius: 14px;
  background: var(--surface);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.item-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}
.empty-card {
  border-radius: 16px;
  border: 2px dashed var(--line);
}
</style>

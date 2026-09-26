<template>
  <q-page class="q-pa-md q-pa-lg-lg page-shell">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg" style="gap: 12px">
      <div>
        <div class="text-caption text-primary text-weight-bold text-uppercase">Step 3: Menu Management</div>
        <div class="text-h4 text-weight-bolder">All Restaurant Items</div>
        <div class="text-body2 text-grey-6 q-mt-xs">
          Showing {{ filtered.length }} of {{ menu.items.length }} menu items
        </div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          v-if="!menu.items.length"
          outline
          color="secondary"
          icon="sym_o_dataset"
          label="Load Sample Menu"
          @click="menu.addSamples()"
        />
        <q-btn
          unelevated
          color="primary"
          icon="sym_o_add"
          label="Add New Item"
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
          placeholder="Search items by name..."
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
          label="Filter by Category"
        >
          <template #prepend><q-icon name="sym_o_filter_alt" /></template>
        </q-select>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!menu.items.length" class="text-center q-pa-xl surface-card empty-card">
      <q-icon name="sym_o_restaurant_menu" size="56px" color="grey-5" class="q-mb-md" />
      <div class="text-h6 text-weight-bold">No Menu Items Yet</div>
      <div class="text-body2 text-grey-6 q-my-sm">
        Add your restaurant's food and beverage items or load a sample starter menu.
      </div>
      <div class="row justify-center q-gutter-sm q-mt-md">
        <q-btn unelevated color="primary" icon="sym_o_add" label="Add New Item" @click="openAdd" />
        <q-btn outline color="secondary" icon="sym_o_dataset" label="Load Sample Menu" @click="menu.addSamples()" />
      </div>
    </div>

    <!-- No Search Results -->
    <div v-else-if="!filtered.length" class="text-center q-pa-xl text-grey-6">
      <q-icon name="sym_o_search_off" size="48px" class="q-mb-sm text-grey-4" />
      <div class="text-h6">No matching items found</div>
      <div class="text-caption">Try adjusting your search query or filter</div>
    </div>

    <!-- Items in Card Format as strictly required by Step 3 -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="it in filtered" :key="it.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card flat bordered class="item-card full-height column justify-between">
          <q-card-section>
            <div class="row items-start justify-between no-wrap q-mb-sm">
              <div class="text-subtitle1 text-weight-bolder ellipsis col q-pr-xs">{{ it.name }}</div>
              <div class="row no-wrap q-gutter-xs">
                <q-btn flat round dense size="sm" color="primary" icon="sym_o_edit" @click="openEdit(it)">
                  <q-tooltip>Edit Item</q-tooltip>
                </q-btn>
                <q-btn flat round dense size="sm" color="negative" icon="sym_o_delete" @click="confirmDelete(it)">
                  <q-tooltip>Delete Item</q-tooltip>
                </q-btn>
              </div>
            </div>

            <q-chip dense color="primary" text-color="white" size="sm" class="q-mb-sm">
              {{ it.category }}
            </q-chip>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-separator class="q-mb-sm" />
            <div class="row items-center justify-between">
              <span class="text-caption text-grey-6">Price:</span>
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
          Are you sure you want to delete <strong>{{ toDelete?.name }}</strong>?
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
import { formatMoney } from '@/utils/money'
import ItemFormDialog from '@/components/items/ItemFormDialog.vue'

const menu = useMenuStore()
const search = ref('')
const categoryFilter = ref('all')

const filterOptions = computed(() => [
  { label: 'All Categories', value: 'all' },
  ...menu.usedCategories.map((c) => ({ label: c, value: c })),
])

const filtered = computed(() => {
  const needle = search.value?.trim().toLowerCase() ?? ''
  return menu.items.filter((it) => {
    const matchesSearch = !needle || it.name.toLowerCase().includes(needle)
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

<template>
  <q-page class="q-pa-md q-pa-lg-lg page-shell">
    <!-- Header section -->
    <div class="row items-center justify-between q-mb-lg" style="gap: 12px">
      <div>
        <div class="text-caption text-primary text-weight-bold text-uppercase">
          {{ locale.t('setup.badge') }}
        </div>
        <div class="text-h4 text-weight-bolder">
          {{ locale.t('setup.title') }}
        </div>
        <div class="text-body2 text-grey-6 q-mt-xs">
          {{ locale.t('setup.subtitle') }}
        </div>
      </div>
      <q-btn
        unelevated
        color="primary"
        icon="sym_o_add"
        :label="locale.t('setup.addBtn')"
        class="text-weight-bold"
        @click="openAdd"
      />
    </div>

    <!-- Explicit Navigation Buttons as required by Step 2 in assignment PDF -->
    <q-card flat bordered class="q-pa-md q-mb-xl bg-surface">
      <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm">
        {{ locale.t('setup.quickNav') }}
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          outline
          color="primary"
          icon="sym_o_restaurant_menu"
          :label="locale.t('setup.allItems')"
          to="/app/items"
          class="text-weight-bold"
        />
        <q-btn
          outline
          color="secondary"
          icon="sym_o_point_of_sale"
          :label="locale.t('setup.ordersPage')"
          to="/app/orders"
          class="text-weight-bold"
        />
        <q-btn
          outline
          color="accent"
          icon="sym_o_receipt_long"
          :label="locale.t('setup.invoicePage')"
          to="/app/invoices"
          class="text-weight-bold"
        />
      </div>
    </q-card>

    <!-- Empty State -->
    <div v-if="!restaurants.length" class="text-center q-pa-xl surface-card empty-card">
      <q-icon name="sym_o_storefront" size="56px" color="grey-5" class="q-mb-md" />
      <div class="text-h6 text-weight-bold">{{ locale.t('setup.noRestaurant') }}</div>
      <div class="text-body2 text-grey-6 q-my-sm">
        {{ locale.t('setup.noRestaurantDesc') }}
      </div>
      <q-btn
        unelevated
        color="primary"
        icon="sym_o_add"
        :label="locale.t('setup.setUpBtn')"
        class="q-mt-md"
        @click="openAdd"
      />
    </div>

    <!-- Restaurant Cards List -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="r in restaurants" :key="r.id" class="col-12 col-md-6">
        <q-card
          flat
          bordered
          class="restaurant-card"
          :class="{ 'active-restaurant': r.id === store.activeId }"
        >
          <q-card-section>
            <div class="row items-start no-wrap" style="gap: 16px">
              <q-avatar size="64px" rounded class="restaurant-logo">
                <img v-if="r.logo" :src="r.logo" style="object-fit: cover;" />
                <q-icon v-else name="sym_o_storefront" size="32px" color="primary" />
              </q-avatar>

              <div class="col min-width-0">
                <div class="row items-center justify-between no-wrap">
                  <div class="text-h6 text-weight-bolder ellipsis">{{ r.name }}</div>
                  <q-badge
                    v-if="r.id === store.activeId"
                    color="positive"
                    :label="locale.t('setup.active')"
                    class="q-px-sm text-weight-bold"
                  />
                </div>

                <div class="text-body2 text-grey-7 q-mt-xs">
                  <q-icon name="sym_o_location_on" size="16px" class="q-mr-xs text-grey-5" />
                  {{ r.address }}
                </div>
                <div class="text-body2 text-grey-7 q-mt-xs font-mono">
                  <q-icon name="sym_o_call" size="16px" class="q-mr-xs text-grey-5" />
                  {{ r.phone }}
                </div>

                <div class="row items-center q-mt-sm" style="gap: 6px; flex-wrap: wrap;">
                  <span class="text-caption text-weight-bold text-grey-6">{{ locale.t('setup.branches') }}</span>
                  <q-chip
                    v-for="branch in r.branches"
                    :key="branch"
                    dense
                    color="primary"
                    text-color="white"
                    size="sm"
                  >
                    {{ branch }}
                  </q-chip>
                  <span v-if="!r.branches || !r.branches.length" class="text-caption text-grey-5">
                    Main Branch
                  </span>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="between" class="q-px-md">
            <div>
              <q-btn
                v-if="r.id !== store.activeId"
                flat
                dense
                no-caps
                color="primary"
                :label="locale.t('setup.setActive')"
                class="text-weight-bold"
                @click="store.setActive(r.id)"
              />
            </div>
            <div class="row q-gutter-xs">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="sym_o_edit"
                @click="openEdit(r)"
              >
                <q-tooltip>Edit</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="sym_o_delete"
                @click="confirmDelete(r)"
              >
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Add/Edit Modal Dialog -->
    <RestaurantFormDialog v-model="dialogOpen" :restaurant="editingRestaurant" @submit="onSubmit" />

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteOpen">
      <q-card style="min-width: 320px; border-radius: 12px;">
        <q-card-section class="row items-center" style="gap: 12px">
          <q-avatar icon="sym_o_warning" color="negative" text-color="white" />
          <div class="text-h6 text-weight-bold">Confirm Deletion</div>
        </q-card-section>
        <q-card-section class="q-pt-none text-grey-7">
          Are you sure you want to remove <strong>{{ toDelete?.name }}</strong>?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            unelevated
            color="negative"
            label="Delete"
            v-close-popup
            @click="doDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Notify } from 'quasar'
import { useRestaurantStore } from '@/stores/restaurants'
import { useLocaleStore } from '@/stores/locale'
import RestaurantFormDialog from '@/components/restaurant/RestaurantFormDialog.vue'

const store = useRestaurantStore()
const locale = useLocaleStore()
const restaurants = computed(() => store.list)

const dialogOpen = ref(false)
const editingRestaurant = ref(null)
const deleteOpen = ref(false)
const toDelete = ref(null)

function openAdd() {
  editingRestaurant.value = null
  dialogOpen.value = true
}

function openEdit(r) {
  editingRestaurant.value = r
  dialogOpen.value = true
}

function onSubmit(data) {
  if (editingRestaurant.value) {
    store.update(editingRestaurant.value.id, data)
    Notify.create({ type: 'positive', message: 'Restaurant updated successfully!' })
  } else {
    store.add(data)
    Notify.create({ type: 'positive', message: 'Restaurant created successfully!' })
  }
  dialogOpen.value = false
}

function confirmDelete(r) {
  toDelete.value = r
  deleteOpen.value = true
}

function doDelete() {
  store.remove(toDelete.value.id)
  Notify.create({ type: 'info', message: 'Restaurant removed.' })
}
</script>

<style scoped>
.page-shell {
  max-width: 1040px;
  margin: 0 auto;
}
.restaurant-card {
  border-radius: 14px;
  transition: all 0.2s ease;
  background: var(--surface);
}
.restaurant-card.active-restaurant {
  border: 2px solid var(--q-primary);
}
.restaurant-logo {
  border-radius: 12px;
  background: var(--surface-sunken);
  border: 1px solid var(--line);
}
.empty-card {
  border-radius: 16px;
  border: 2px dashed var(--line);
}
</style>

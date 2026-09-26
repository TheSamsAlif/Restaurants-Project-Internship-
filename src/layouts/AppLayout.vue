<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-surface text-ink border-bottom">
      <q-toolbar class="q-px-md">
        <q-btn
          flat
          dense
          round
          icon="sym_o_menu"
          class="q-mr-sm"
          @click="drawer = !drawer"
        />

        <!-- Brand / Restaurant Identity -->
        <div class="row items-center no-wrap cursor-pointer" style="gap: 12px" @click="$router.push('/app/restaurant')">
          <q-avatar v-if="restaurant?.logo" size="34px" rounded class="logo-avatar">
            <img :src="restaurant.logo" style="object-fit: cover;" />
          </q-avatar>
          <q-avatar v-else size="34px" rounded color="primary" text-color="white" icon="sym_o_storefront" />

          <div>
            <div class="text-subtitle1 text-weight-bolder ellipsis" style="line-height: 1.2;">
              {{ restaurant?.name || 'Restaurant POS' }}
            </div>
            <div v-if="activeBranch" class="text-caption text-grey-6" style="line-height: 1;">
              {{ activeBranch }}
            </div>
          </div>
        </div>

        <q-space />

        <!-- Branch Selector -->
        <q-select
          v-if="branches.length > 1"
          v-model="activeBranch"
          :options="branches"
          dense
          outlined
          class="q-mr-md gt-xs"
          style="min-width: 150px"
        />

        <!-- Language Toggle (EN / বাংলা) -->
        <q-btn
          flat
          dense
          no-caps
          class="q-mr-sm text-weight-bolder lang-toggle-btn"
          @click="locale.toggle()"
        >
          <q-icon name="sym_o_translate" size="18px" class="q-mr-xs" />
          <span style="font-size: 13px;">{{ locale.lang === 'en' ? 'বাংলা' : 'English' }}</span>
          <q-tooltip>{{ locale.t('nav.langToggle') }}</q-tooltip>
        </q-btn>

        <!-- Light / Dark Mode Toggle (Quasar $q.dark) -->
        <q-btn
          flat
          round
          dense
          :icon="$q.dark.isActive ? 'sym_o_light_mode' : 'sym_o_dark_mode'"
          class="q-mr-sm"
          @click="toggleTheme"
        >
          <q-tooltip>{{ $q.dark.isActive ? locale.t('nav.lightMode') : locale.t('nav.darkMode') }}</q-tooltip>
        </q-btn>

        <!-- Logout Button -->
        <q-btn flat round dense icon="sym_o_logout" color="negative" @click="confirmLogout = true">
          <q-tooltip>{{ locale.t('nav.logout') }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Navigation Drawer -->
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="240"
      :breakpoint="768"
      bordered
      class="bg-surface text-ink"
    >
      <div class="q-pa-md">
        <div class="text-caption text-primary text-weight-bold text-uppercase">
          {{ locale.lang === 'bn' ? 'নেভিগেশন মেনু' : 'Navigation' }}
        </div>
      </div>

      <q-list padding class="q-pt-none">
        <q-item
          v-for="link in links"
          :key="link.to"
          clickable
          v-ripple
          :to="link.to"
          exact
          active-class="bg-primary-tint text-primary text-weight-bolder"
          class="rounded-borders q-mx-sm q-mb-xs"
        >
          <q-item-section avatar style="min-width: 40px">
            <q-icon :name="link.icon" size="22px" />
          </q-item-section>
          <q-item-section class="text-body2">{{ link.label }}</q-item-section>
        </q-item>
      </q-list>

      <div class="absolute-bottom q-pa-md text-caption text-grey-5 border-top">
        Resto POS &bull; Retail Edition
      </div>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Mobile Bottom Tabs -->
    <q-footer v-if="$q.screen.lt.md" bordered class="bg-surface text-ink no-print">
      <q-tabs active-color="primary" indicator-color="primary" dense align="justify">
        <q-route-tab
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :icon="link.icon"
          :label="link.shortLabel"
        />
      </q-tabs>
    </q-footer>

    <!-- Sign Out Confirmation Modal -->
    <q-dialog v-model="confirmLogout">
      <q-card style="min-width: 300px; border-radius: 12px;">
        <q-card-section class="row items-center" style="gap: 12px">
          <q-avatar icon="sym_o_logout" color="negative" text-color="white" />
          <div class="text-h6 text-weight-bold">
            {{ locale.lang === 'bn' ? 'লগআউট নিশ্চিতকরণ' : 'Sign Out' }}
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none text-grey-7">
          {{ locale.lang === 'bn' ? 'আপনি কি আপনার সেশন শেষ করে লগআউট করতে চান?' : 'Are you sure you want to end your session?' }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="locale.lang === 'bn' ? 'বাতিল' : 'Cancel'" v-close-popup />
          <q-btn unelevated color="negative" :label="locale.lang === 'bn' ? 'লগআউট' : 'Sign Out'" v-close-popup @click="onLogout" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import { useRestaurantStore } from '@/stores/restaurants'
import { useThemeStore } from '@/stores/theme'
import { useLocaleStore } from '@/stores/locale'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()
const restaurantStore = useRestaurantStore()
const theme = useThemeStore()
const locale = useLocaleStore()

const drawer = ref(true)
const confirmLogout = ref(false)

const restaurant = computed(() => restaurantStore.active)
const branches = computed(() => restaurant.value?.branches ?? [])
const activeBranch = ref(branches.value[0] || '')

watch(
  branches,
  (b) => {
    if (!b.includes(activeBranch.value)) {
      activeBranch.value = b[0] || ''
    }
  },
  { immediate: true },
)

const links = computed(() => [
  {
    to: '/app/restaurant',
    icon: 'sym_o_storefront',
    label: locale.t('nav.setup'),
    shortLabel: locale.lang === 'bn' ? 'সেটআপ' : 'Setup',
  },
  {
    to: '/app/items',
    icon: 'sym_o_restaurant_menu',
    label: locale.t('nav.items'),
    shortLabel: locale.lang === 'bn' ? 'মেনু' : 'Items',
  },
  {
    to: '/app/orders',
    icon: 'sym_o_point_of_sale',
    label: locale.t('nav.orders'),
    shortLabel: locale.lang === 'bn' ? 'অর্ডার' : 'Orders',
  },
  {
    to: '/app/invoices',
    icon: 'sym_o_receipt_long',
    label: locale.t('nav.invoices'),
    shortLabel: locale.lang === 'bn' ? 'ইনভয়েস' : 'Invoices',
  },
])

function toggleTheme() {
  theme.toggle()
}

function onLogout() {
  auth.logout()
  router.replace('/')
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid var(--line);
}
.border-top {
  border-top: 1px solid var(--line);
}
.bg-primary-tint {
  background: rgba(168, 67, 42, 0.12);
}
.logo-avatar {
  border-radius: 8px;
  background: var(--surface-sunken);
  border: 1px solid var(--line);
}
</style>

<template>
  <q-page class="flex flex-center column q-pa-xl" style="min-height: 100vh">
    <div class="text-h1 text-weight-bolder text-primary">404</div>
    <div class="text-h5 text-weight-bold q-mt-sm">Page Not Found</div>
    <div class="text-body1 text-grey-6 q-mt-xs q-mb-lg">The page you are looking for does not exist.</div>
    <q-btn unelevated color="primary" :to="landing" label="Back to Safety" class="text-weight-bold q-px-lg" />
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const landing = computed(() => (auth.isLoggedIn ? '/app' : '/'))
</script>

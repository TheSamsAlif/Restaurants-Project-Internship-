<template>
  <q-page class="auth-page flex flex-center">
    <div class="auth-container row items-center justify-center">
      <!-- Left side: POS Branding & Live Highlights -->
      <div class="brand-panel col-12 col-md-6 flex flex-center q-pa-xl text-white">
        <div class="brand-content">
          <div class="row items-center q-mb-lg" style="gap: 12px">
            <q-avatar size="44px" color="primary" text-color="white" icon="sym_o_point_of_sale" />
            <div class="text-h4 text-weight-bolder">Resto POS</div>
          </div>

          <div class="text-h5 text-weight-bold q-mb-sm">Restaurant Management & Retail POS</div>
          <p class="text-body1 text-grey-4 q-mb-xl">
            Streamline your restaurant operations, live billing, kitchen orders, and table seating with modern retail POS tools.
          </p>

          <div class="features-list column q-gutter-y-sm">
            <div class="row items-center" style="gap: 10px">
              <q-icon name="sym_o_check_circle" color="positive" size="20px" />
              <span>Real-time Table & Seat billing management</span>
            </div>
            <div class="row items-center" style="gap: 10px">
              <q-icon name="sym_o_check_circle" color="positive" size="20px" />
              <span>Menu item management & custom categories</span>
            </div>
            <div class="row items-center" style="gap: 10px">
              <q-icon name="sym_o_check_circle" color="positive" size="20px" />
              <span>Instant Invoice generation, PDF export & Receipt printing</span>
            </div>
            <div class="row items-center" style="gap: 10px">
              <q-icon name="sym_o_check_circle" color="positive" size="20px" />
              <span>100% Client-side persistence via Local Storage</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side: Authentication Card (Swaps in place) -->
      <div class="card-panel col-12 col-md-6 flex flex-center q-pa-lg">
        <transition name="card-fade" mode="out-in">
          <LoginForm v-if="mode === 'login'" key="login" @register="mode = 'register'" />
          <RegisterCard v-else key="register" @back="mode = 'login'" />
        </transition>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterCard from '@/components/auth/RegisterCard.vue'

const mode = ref('login')
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: var(--bg);
}
.auth-container {
  width: 100%;
  max-width: 1100px;
  min-height: 640px;
  margin: auto;
}
.brand-panel {
  background: linear-gradient(135deg, #1b2420 0%, #26352c 100%);
  border-radius: 20px;
  min-height: 520px;
}
@media (max-width: 1023px) {
  .brand-panel {
    display: none;
  }
}
.brand-content {
  max-width: 440px;
}
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.25s ease-out;
}
.card-fade-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
.card-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
}
</style>

<template>
  <q-page class="auth-page flex flex-center">
    <!-- Language Toggle Top Right -->
    <div class="lang-bar fixed-top-right q-pa-md no-print" style="z-index: 20;">
      <q-btn
        outline
        rounded
        color="primary"
        class="bg-surface text-weight-bold"
        icon="sym_o_translate"
        :label="locale.lang === 'en' ? 'বাংলা' : 'English'"
        @click="locale.toggle()"
      />
    </div>

    <div class="auth-container row items-center justify-center">
      <!-- Left side: ANIMATED RESTAURANT POS SHOWCASE -->
      <div class="brand-panel col-12 col-md-6 flex flex-center q-pa-lg text-white">
        <div class="brand-content full-width">
          <!-- Top Brand Badge -->
          <div class="row items-center justify-between q-mb-lg">
            <div class="row items-center" style="gap: 12px">
              <q-avatar size="44px" color="primary" text-color="white" icon="sym_o_restaurant" class="pulse-icon" />
              <div>
                <div class="text-h5 text-weight-bolder font-display" style="letter-spacing: -0.5px;">Resto POS</div>
                <div class="text-caption text-primary-300 font-mono">{{ locale.t('auth.staffPortal') }}</div>
              </div>
            </div>
            <!-- Live Pulse Pill -->
            <div class="live-pill row items-center q-px-sm q-py-xs">
              <span class="live-dot" />
              <span class="text-caption text-weight-bold q-ml-xs">{{ locale.t('auth.kitchenLive') }}</span>
            </div>
          </div>

          <!-- Animated Kitchen Ticket / Order Chit Display -->
          <div class="pos-terminal-card q-pa-md q-mb-lg">
            <div class="terminal-header row items-center justify-between q-pb-sm">
              <div class="row items-center" style="gap: 6px">
                <q-icon name="sym_o_point_of_sale" size="18px" color="primary-300" />
                <span class="font-mono text-caption text-weight-bold">TABLE #04 &bull; SEAT 02</span>
              </div>
              <q-badge color="positive" label="COOKING" class="font-mono text-weight-bold" />
            </div>

            <!-- Animated floating dish chits -->
            <div class="dishes-container column q-gutter-y-xs q-my-sm">
              <div class="dish-chit chit-1 row items-center justify-between q-pa-xs">
                <div class="row items-center" style="gap: 8px">
                  <span class="chit-emoji">🍗</span>
                  <span class="text-body2 text-weight-medium">Special Chicken Biryani</span>
                </div>
                <span class="font-mono text-weight-bold text-amber-3">৳ 360</span>
              </div>

              <div class="dish-chit chit-2 row items-center justify-between q-pa-xs">
                <div class="row items-center" style="gap: 8px">
                  <span class="chit-emoji">🍔</span>
                  <span class="text-body2 text-weight-medium">Double Beef Cheese Burger</span>
                </div>
                <span class="font-mono text-weight-bold text-amber-3">৳ 380</span>
              </div>

              <div class="dish-chit chit-3 row items-center justify-between q-pa-xs">
                <div class="row items-center" style="gap: 8px">
                  <span class="chit-emoji">🍹</span>
                  <span class="text-body2 text-weight-medium">Fresh Mint Lime Cooler</span>
                </div>
                <span class="font-mono text-weight-bold text-amber-3">৳ 130</span>
              </div>
            </div>

            <!-- Terminal Footer with live calculation -->
            <div class="terminal-footer row items-center justify-between q-pt-sm border-dashed-top">
              <span class="text-caption text-grey-4">Est. Total (Inc. 5% VAT)</span>
              <span class="font-mono text-subtitle1 text-weight-bolder text-green-3">৳ 913.50</span>
            </div>
          </div>

          <!-- Floating Feature Badges -->
          <div class="row q-gutter-xs justify-center q-mb-md">
            <div class="feature-tag float-anim-1">
              <q-icon name="sym_o_table_restaurant" size="16px" color="amber-4" class="q-mr-xs" />
              <span>Table Conflict Lock</span>
            </div>
            <div class="feature-tag float-anim-2">
              <q-icon name="sym_o_receipt_long" size="16px" color="teal-3" class="q-mr-xs" />
              <span>Thermal Receipt & PDF</span>
            </div>
            <div class="feature-tag float-anim-3">
              <q-icon name="sym_o_analytics" size="16px" color="light-blue-3" class="q-mr-xs" />
              <span>Daily Revenue Stats</span>
            </div>
          </div>

          <div class="text-center text-caption text-grey-5 q-mt-sm">
            {{ locale.t('auth.heroSubtitle') }}
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
import { useLocaleStore } from '@/stores/locale'

const mode = ref('login')
const locale = useLocaleStore()
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: var(--bg);
  position: relative;
}
.auth-container {
  width: 100%;
  max-width: 1140px;
  min-height: 660px;
  margin: auto;
}
.brand-panel {
  background: linear-gradient(145deg, #18241d 0%, #223528 50%, #152219 100%);
  border-radius: 24px;
  min-height: 580px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}
.brand-panel::before {
  content: '';
  position: absolute;
  top: -50px;
  left: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(168, 67, 42, 0.25) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
}
@media (max-width: 1023px) {
  .brand-panel {
    display: none;
  }
}
.brand-content {
  max-width: 460px;
  z-index: 1;
}
.pulse-icon {
  animation: pulse-glow 3s infinite alternate;
}
@keyframes pulse-glow {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(168, 67, 42, 0.4); }
  100% { transform: scale(1.05); box-shadow: 0 0 15px 4px rgba(168, 67, 42, 0.6); }
}

.live-pill {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  backdrop-filter: blur(4px);
}
.live-dot {
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  display: inline-block;
  animation: blink 1.5s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.pos-terminal-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
.dish-chit {
  background: rgba(0, 0, 0, 0.22);
  border-radius: 8px;
  padding: 8px 12px;
  border-left: 3px solid #e0855a;
  transition: all 0.3s ease;
}
.chit-1 { animation: float-subtle 4s ease-in-out infinite; }
.chit-2 { animation: float-subtle 4s ease-in-out 1.2s infinite; }
.chit-3 { animation: float-subtle 4s ease-in-out 2.4s infinite; }

@keyframes float-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.chit-emoji {
  font-size: 1.2rem;
}
.border-dashed-top {
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
}

.feature-tag {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}
.float-anim-1 { animation: tag-float 3.5s ease-in-out infinite; }
.float-anim-2 { animation: tag-float 3.5s ease-in-out 1s infinite; }
.float-anim-3 { animation: tag-float 3.5s ease-in-out 2s infinite; }

@keyframes tag-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
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

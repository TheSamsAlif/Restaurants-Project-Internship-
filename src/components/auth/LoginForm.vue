<template>
  <q-card flat class="auth-card">
    <div class="text-caption text-primary text-weight-bold text-uppercase q-mb-xs">Staff Portal</div>
    <div class="text-h5 text-weight-bolder q-mb-lg">Welcome Back</div>

    <q-form class="column q-gutter-y-md" @submit.prevent="onSubmit">
      <q-input
        v-model="email"
        outlined
        label="Email Address"
        type="email"
        :rules="[required('Email is required'), emailRule]"
        lazy-rules
        autocomplete="username"
      >
        <template #prepend>
          <q-icon name="sym_o_mail" />
        </template>
      </q-input>

      <q-input
        v-model="password"
        outlined
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        :rules="[required('Password is required')]"
        lazy-rules
        autocomplete="current-password"
      >
        <template #prepend>
          <q-icon name="sym_o_lock" />
        </template>
        <template #append>
          <q-icon
            :name="showPassword ? 'sym_o_visibility_off' : 'sym_o_visibility'"
            class="cursor-pointer"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>

      <q-banner v-if="error" dense rounded class="bg-red-1 text-negative q-mt-xs">
        <template #avatar>
          <q-icon name="sym_o_error" color="negative" />
        </template>
        {{ error }}
      </q-banner>

      <q-btn
        type="submit"
        unelevated
        color="primary"
        size="lg"
        class="full-width q-mt-md text-weight-bold"
        :loading="loading"
        label="Sign In"
        icon-right="sym_o_login"
      />
    </q-form>

    <q-separator class="q-my-lg" />

    <div class="text-center text-body2 text-grey-7">
      Don't have an account?
      <a href="#" class="text-primary text-weight-bold text-decoration-none q-ml-xs" @click.prevent="$emit('register')">
        Register here
      </a>
    </div>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { emailRule, required } from '@/utils/validators'

defineEmits(['register'])

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

function onSubmit() {
  error.value = ''
  loading.value = true
  const result = auth.login(email.value, password.value)
  loading.value = false
  if (!result.ok) {
    error.value = result.message || 'Invalid email or password.'
    return
  }
  router.replace('/app')
}
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 36px 32px;
  border-radius: 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-card);
}
@media (max-width: 599px) {
  .auth-card {
    padding: 24px 20px;
  }
}
</style>

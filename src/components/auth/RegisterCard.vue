<template>
  <q-card flat class="auth-card">
    <div class="row items-center no-wrap q-mb-md" style="gap: 8px">
      <q-btn flat round dense icon="sym_o_arrow_back" color="primary" @click="$emit('back')" />
      <div>
        <div class="text-caption text-primary text-weight-bold text-uppercase">
          {{ locale.t('auth.newAccount') }}
        </div>
        <div class="text-h5 text-weight-bolder">
          {{ locale.t('auth.createAccount') }}
        </div>
      </div>
    </div>

    <q-form class="column q-gutter-y-sm" @submit.prevent="onSubmit">
      <q-input
        v-model="name"
        outlined
        dense
        :label="locale.t('auth.fullName') + ' *'"
        :rules="[required('Full Name is required')]"
        lazy-rules
      >
        <template #prepend><q-icon name="sym_o_person" /></template>
      </q-input>

      <q-input
        v-model="email"
        outlined
        dense
        :label="locale.t('auth.email') + ' *'"
        type="email"
        :rules="[required('Email is required'), emailRule]"
        lazy-rules
      >
        <template #prepend><q-icon name="sym_o_mail" /></template>
      </q-input>

      <q-input
        v-model="phone"
        outlined
        dense
        :label="locale.t('auth.phone') + ' *'"
        :rules="[required('Phone number is required'), phoneRule]"
        lazy-rules
      >
        <template #prepend><q-icon name="sym_o_call" /></template>
      </q-input>

      <q-input
        v-model="password"
        outlined
        dense
        :type="showPassword ? 'text' : 'password'"
        :label="locale.t('auth.password') + ' *'"
        :rules="[required('Password is required'), minLength(6)]"
        lazy-rules
      >
        <template #prepend><q-icon name="sym_o_lock" /></template>
        <template #append>
          <q-icon
            :name="showPassword ? 'sym_o_visibility_off' : 'sym_o_visibility'"
            class="cursor-pointer"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>

      <q-input
        v-model="confirm"
        outlined
        dense
        :type="showPassword ? 'text' : 'password'"
        :label="locale.t('auth.confirmPassword') + ' *'"
        :rules="[required('Confirm password is required'), sameAs(() => password, 'Passwords do not match')]"
        lazy-rules
      >
        <template #prepend><q-icon name="sym_o_lock_clock" /></template>
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
        :label="locale.t('auth.completeReg')"
        icon-right="sym_o_how_to_reg"
      />
    </q-form>

    <div class="text-center text-body2 text-grey-7 q-mt-md">
      {{ locale.t('auth.hasAccount') }}
      <a href="#" class="text-primary text-weight-bold text-decoration-none q-ml-xs" @click.prevent="$emit('back')">
        {{ locale.t('auth.signInLink') }}
      </a>
    </div>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import { useLocaleStore } from '@/stores/locale'
import { emailRule, minLength, phoneRule, required, sameAs } from '@/utils/validators'

const emit = defineEmits(['back'])

const auth = useAuthStore()
const locale = useLocaleStore()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirm = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

function onSubmit() {
  error.value = ''
  loading.value = true
  const result = auth.register({
    name: name.value,
    email: email.value,
    password: password.value,
    phone: phone.value,
  })
  loading.value = false
  if (!result.ok) {
    error.value = locale.lang === 'bn' ? 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।' : (result.message || 'Registration failed.')
    return
  }
  Notify.create({
    type: 'positive',
    message: locale.lang === 'bn' ? 'রেজিস্ট্রেশন সফল হয়েছে! দয়া করে লগইন করুন।' : 'Account registered successfully! Please sign in.',
    position: 'top',
  })
  emit('back')
}
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 440px;
  padding: 30px 28px;
  border-radius: 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-card);
}
@media (max-width: 599px) {
  .auth-card {
    padding: 20px 16px;
  }
}
</style>

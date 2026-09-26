<template>
  <q-dialog v-model="open" persistent @hide="$emit('close')">
    <q-card class="surface-card form-card" style="width: 520px; max-width: 95vw; border-radius: 16px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bolder">
          {{ editing ? 'Edit Restaurant Info' : 'Add New Restaurant' }}
        </div>
        <q-space />
        <q-btn flat round dense icon="sym_o_close" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form ref="formRef" class="column q-gutter-y-md" @submit.prevent="onSubmit">
          <!-- Logo Upload Section -->
          <div class="row items-center q-mb-xs" style="gap: 16px">
            <q-avatar size="68px" rounded class="logo-preview">
              <img v-if="logo" :src="logo" style="object-fit: cover;" />
              <q-icon v-else name="sym_o_storefront" size="32px" color="grey-6" />
            </q-avatar>
            <div>
              <q-btn
                outline
                dense
                no-caps
                class="q-px-md"
                color="primary"
                icon="sym_o_upload"
                label="Upload Logo"
                @click="fileInput?.click()"
              />
              <q-btn
                v-if="logo"
                flat
                dense
                round
                color="negative"
                icon="sym_o_delete"
                class="q-ml-sm"
                @click="logo = ''"
              >
                <q-tooltip>Remove logo</q-tooltip>
              </q-btn>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onLogoChange"
              />
              <div class="text-caption text-grey-6 q-mt-xs">PNG or JPG up to 2MB</div>
            </div>
          </div>

          <q-input
            v-model="name"
            outlined
            dense
            label="Restaurant Name *"
            :rules="[required('Restaurant name is required')]"
            lazy-rules
          >
            <template #prepend><q-icon name="sym_o_storefront" /></template>
          </q-input>

          <q-input
            v-model="address"
            outlined
            dense
            type="textarea"
            autogrow
            label="Address *"
            :rules="[required('Address is required')]"
            lazy-rules
          >
            <template #prepend><q-icon name="sym_o_location_on" /></template>
          </q-input>

          <q-input
            v-model="phone"
            outlined
            dense
            label="Phone Number *"
            :rules="[required('Phone number is required'), phoneRule]"
            lazy-rules
          >
            <template #prepend><q-icon name="sym_o_call" /></template>
          </q-input>

          <q-select
            v-model="branches"
            outlined
            dense
            multiple
            use-input
            use-chips
            new-value-mode="add-unique"
            label="Branch Name(s)"
            hint="Type a branch name and press Enter to add"
          >
            <template #prepend><q-icon name="sym_o_apartment" /></template>
          </q-select>

          <q-banner v-if="error" dense rounded class="bg-red-1 text-negative q-mt-xs">
            {{ error }}
          </q-banner>

          <q-card-actions align="right" class="q-px-none q-pt-md">
            <q-btn flat label="Cancel" color="grey-7" v-close-popup />
            <q-btn
              type="submit"
              unelevated
              color="primary"
              class="q-px-lg text-weight-bold"
              :label="editing ? 'Save Changes' : 'Create Restaurant'"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Notify } from 'quasar'
import { required, phoneRule } from '@/utils/validators'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  restaurant: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'close', 'submit'])

const open = ref(props.modelValue)
watch(() => props.modelValue, (v) => (open.value = v))
watch(open, (v) => emit('update:modelValue', v))

const editing = ref(false)
const name = ref('')
const address = ref('')
const phone = ref('')
const branches = ref([])
const logo = ref('')
const fileInput = ref(null)
const error = ref('')

watch(
  () => props.restaurant,
  (r) => {
    if (r) {
      editing.value = true
      name.value = r.name || ''
      address.value = r.address || ''
      phone.value = r.phone || ''
      branches.value = Array.isArray(r.branches) ? [...r.branches] : []
      logo.value = r.logo || ''
    } else {
      editing.value = false
      name.value = ''
      address.value = ''
      phone.value = ''
      branches.value = ['Main Branch']
      logo.value = ''
    }
  },
  { immediate: true },
)

function onLogoChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    Notify.create({ type: 'warning', message: 'Logo file size exceeds 2MB limit.' })
    return
  }
  const reader = new FileReader()
  reader.onload = (event) => {
    logo.value = event.target.result
  }
  reader.readAsDataURL(file)
}

function onSubmit() {
  error.value = ''
  emit('submit', {
    name: name.value,
    address: address.value,
    phone: phone.value,
    branches: branches.value,
    logo: logo.value,
  })
}
</script>

<style scoped>
.logo-preview {
  border-radius: 12px;
  border: 2px dashed var(--line);
  background: var(--surface-sunken);
  overflow: hidden;
}
</style>

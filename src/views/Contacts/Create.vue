<template>
  <AppLayout header-title="Create Contact">
    <FormKit type="form" @submit="save" v-model="form" formClass="grid grid-cols-12 gap-3">
      <FormKit type="hidden" name="account_id" :value="1" />
      <FormKit type="text" name="first_name" label="First Name" outerClass="col-span-6" innerClass="ring-gray-300" />
      <FormKit type="text" name="last_name" label="Last Name" outerClass="col-span-6" />
      <FormKit type="email" name="email" label="Email" outerClass="col-span-12" />
      <FormKit type="tel" name="phone" label="Phone" outerClass="col-span-12" />
    </FormKit>
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layouts/AppLayout.vue";
import { useForm } from '@inertiajs/vue3';

const form = useForm({
  first_name: null,
  last_name: null,
  email: null,
  phone: null,
})

function save() {
  form.post(route('contacts.store'))
}
</script>
<template>
  <AppLayout header-title="Create Contact">
    <FormKit type="form" @submit="save" formClass="grid grid-cols-12 gap-3" :value="contact">
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
import { useInertia as useInertiaForm } from "formkit-addon-inertia";

defineProps({
  contact: {
    type: Object,
    default: {}
  }
});

function save(fields, node) {
  useInertiaForm(node).post(route('contacts.store'), fields)
}
</script>
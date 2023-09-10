<template>
  <AppLayout header-title="Update Contact">
    <div class="relative flex items-center justify-between py-5 bg-gray-50 hover:bg-gray-100 rounded-lg px-4 mb-4">
      <div class="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
        <img class="h-12 w-12 flex-none rounded-full bg-gray-50" :src="`https://ui-avatars.com/api/?name=${contact.first_name}+${contact.last_name}`" alt="">
        <div class="flex flex-col space-y-1 min-w-0 flex-auto">
          <span class="text-sm font-semibold leading-6 text-gray-900">{{ contact.first_name }} {{ contact.last_name }}</span>
          <span class="text-xs leading-5 text-gray-500">{{ contact.email }}</span>
        </div>
      </div>
    </div>
    <FormKit type="form" @submit="save" formClass="grid grid-cols-12 gap-3" :value="contact">
      <FormKit type="text" name="first_name" label="First Name" outerClass="col-span-6" />
      <FormKit type="text" name="last_name" label="Last Name" outerClass="col-span-6" />
      <FormKit type="email" name="email" label="Email" outerClass="col-span-12" />
      <FormKit type="tel" name="phone" label="Phone" outerClass="col-span-12" />
    </FormKit>
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layouts/AppLayout.vue";
import { useInertia as useInertiaForm } from "formkit-addon-inertia";

const props = defineProps({
  contact: {
    type: Object,
    required: true,
  }
});

function save(fields, node) {
  useInertiaForm(node).put(route('contacts.update', props.contact.id), fields)
}
</script>
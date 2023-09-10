<template>
  <AppLayout header-title="Contacts">
    <!-- Users Table -->
    <template #headerAction>
      <Link :href="route('contacts.create')" class="ml-3 inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Create Contact</Link>
    </template>

    <ul role="list" class="space-y-4">
      <template v-for="contact in contacts.data" :key="contact.id">
        <li class="relative flex items-center justify-between py-5 bg-gray-50 hover:bg-gray-100 rounded-lg px-4">
          <div class="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
            <img class="h-12 w-12 flex-none rounded-full bg-gray-50" :src="`https://ui-avatars.com/api/?name=${contact.name}`" alt="">
            <div class="flex flex-col space-y-1 min-w-0 flex-auto">
              <span class="text-sm font-semibold leading-6 text-gray-900">{{ contact.name }}</span>
              <span class="text-xs leading-5 text-gray-500">{{ contact.email }}</span>
            </div>
          </div>
          <Link :href="route('contacts.edit', contact.id)">
            <Icon icon="ri:edit-box-line" class="h-5 w-5 text-gray-400" />
          </Link>
        </li>
      </template>
    </ul>
    <Pagination class="mt-4" :links="contacts.links" />
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layouts/AppLayout.vue";
import Pagination from "@/components/Pagination.vue";
import { Link } from '@inertiajs/vue3';
import { Icon } from "@iconify/vue";

defineProps({
  contacts: {
    type: Object,
    required: true,
  }
})
</script>
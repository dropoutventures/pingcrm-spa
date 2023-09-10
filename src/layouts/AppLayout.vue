<template>
  <div class="bg-indigo-800 pt-safe-top col-start-1 row-start-1 flex focus:outline-offset-[32px] ui-not-focus-visible:outline-none" tabindex="0">
    <div class="flex flex-col w-full">
      <div class="flex items-center justify-between px-4 pt-4">
        <Link :href="route('index')">
          <Icon icon="ri:home-6-line" class="text-white h-6 w-6 flex-none" />
        </Link>
        <Logo class="h-6" />
        <Link v-if="!isAuthed" :href="route('login')">
          <Icon icon="ri:login-circle-line" class="text-white h-6 w-6 flex-none" />
        </Link>
        <Link v-else :href="route('logout')" method="delete" as="button">
          <Icon icon="ri:logout-circle-line" class="text-red-500 h-6 w-6 flex-none" />
        </Link>
      </div>
      <div class="flex items-center justify-between mt-6 px-4 text-white">
        <slot name="header">
          <div>
            <h1 v-if="headerTitle" class="text-2xl text-white">{{ headerTitle }}</h1>
            <span v-if="headerSubtitle" class="text-sm text-gray-500">{{ headerSubtitle }}</span>
          </div>
          <slot name="headerAction"></slot>
        </slot>
      </div>
      <div class="mt-6 flex-auto rounded-t-2xl bg-white">
        <div class="px-4 py-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Link, Head, usePage } from '@inertiajs/vue3';
import { Icon } from "@iconify/vue";
import Logo from "@/components/Logo.vue";

const props = defineProps({
  headerTitle: {
    type: String,
    default: null,
  },
  headerSubtitle: {
    type: String,
    default: null,
  },
});

const isAuthed = computed(() => {
  return usePage().props.auth.user !== null && usePage().props.auth?.user !== undefined;
});
</script>
<template>
  <Head title="Login Here" />
  <main class="h-full min-h-screen bg-gray-900 flex flex-col space-y-10 justify-center px-6 py-12 lg:px-8">
    <Logo class="mx-auto" />
    <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign in to your account</h2>

    <article v-if="!!usePage().props?.flash?.error" class="sm:mx-auto sm:w-full sm:max-w-sm | flex rounded-md bg-red-600 border border-red-500 p-4 space-x-3">
      <div class="flex-shrink-0">
        <Icon icon="mdi:close-octagon-outline" class="h-5 w-5 text-red-900" />
      </div>
      <div>
        <p class="text-sm font-medium text-red-900">{{ usePage().props.flash.error }}</p>
      </div>
      <div class="!ml-auto">
        <div class="-mx-1.5 -my-1.5">
          <button type="button" class="inline-flex rounded-md bg-red-600 p-1.5 text-red-800 hover:bg-red-700/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-500">
            <span class="sr-only">Dismiss</span>
            <Icon icon="mdi:close" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>

    <FormKit type="form" @submit="login" formClass="sm:mx-auto sm:w-full sm:max-w-sm space-y-6" :actions="false"
      :value="{ email: 'johndoe@example.com', password: 'secret' }"
    >
      <FormKit type="email" name="email" label="Email address" innerClass="$remove:ring-gray-300 ring-white/10" inputClass="$remove:text-gray-900 text-gray-50" labelClass="text-white" />
      <FormKit type="password" name="password" label="Password" innerClass="$remove:ring-gray-300 ring-white/10" inputClass="$remove:text-gray-900 text-gray-50" labelClass="text-white" />
      <FormKit type="submit">Sign In</FormKit>
    </FormKit>

    <Link :href="route('dashboard')" class="mx-auto mt-3 inline-flex items-center space-x-1 text-indigo-50 hover:text-indigo-300 hover:underline text-sm">
      <Icon icon="mdi:arrow-left" class="h-4 w-4 inline-block" />
      <span>Back To Home</span>
    </Link>
  </main>
</template>

<script setup>
import {Link, Head, usePage} from '@inertiajs/vue3';
import Logo from "@/components/Logo.vue";
import { useInertia as useInertiaForm } from "formkit-addon-inertia";
import { Icon } from "@iconify/vue";

function login(fields, node) {
  useInertiaForm(node).post(route('login'), fields)
}
</script>

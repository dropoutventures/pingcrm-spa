<template>
  <Head title="Login Here" />
  <main class="h-full min-h-screen bg-gray-900 flex flex-col justify-center px-6 py-12 lg:px-8">
    <section class="sm:mx-auto sm:w-full sm:max-w-sm">
      <Logo class="mx-auto" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign in to your account</h2>
    </section>

    <!--<pre class="text-red-500">{{ usePage().props.flash.error }}</pre>-->

    <FormKit type="form" @submit="login" formClass="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6" :actions="false"
      :value="{ email: 'johndoe@example.com', password: 'secret' }"
    >
      <FormKit type="email" name="email" label="Email address" innerClass="$remove:ring-gray-300 ring-white/10" inputClass="$remove:text-gray-900 text-gray-50" labelClass="text-white" />
      <FormKit type="password" name="password" label="Password" innerClass="$remove:ring-gray-300 ring-white/10" inputClass="$remove:text-gray-900 text-gray-50" labelClass="text-white" />
      <FormKit type="submit">Sign In</FormKit>
    </FormKit>

    <Link :href="route('index')" class="mx-auto mt-3 inline-flex items-center space-x-1 text-indigo-50 hover:text-indigo-300 hover:underline text-sm">
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

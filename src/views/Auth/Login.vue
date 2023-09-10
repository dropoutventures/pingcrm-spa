<template>
  <main class="h-full min-h-screen bg-gray-900 flex flex-col justify-center px-6 py-12 lg:px-8">
    <section class="sm:mx-auto sm:w-full sm:max-w-sm">
      <Logo class="mx-auto" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign in to your account</h2>
    </section>

    <FormKit type="form" @submit="login" v-model="form" formClass="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6" :actions="false">
      <FormKit type="email" name="email" label="Email address" innerClass="$remove:ring-gray-300 ring-white/10" inputClass="$remove:text-gray-900 text-gray-50" labelClass="text-white" />
      <FormKit type="password" name="password" label="Password" innerClass="$remove:ring-gray-300 ring-white/10" inputClass="$remove:text-gray-900 text-gray-50" labelClass="text-white" />
      <FormKit type="submit">Sign In</FormKit>
    </FormKit>
  </main>
</template>

<script setup>
import { Link, usePage, useForm } from '@inertiajs/vue3';
import { Capacitor } from '@capacitor/core';
import Logo from "@/components/Logo.vue";
import axios from "axios";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

const form = useForm({
  email: 'johndoe@example.com',
  password: 'secret',
})

function login() {
    const loginRoute = Capacitor.isNativePlatform() ? 'login.mobile' : 'login';
  form.post(route('login'));
}
</script>

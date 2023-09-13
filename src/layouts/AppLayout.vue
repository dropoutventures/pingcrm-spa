<template>
  <div class="bg-indigo-800 pt-safe-top col-start-1 row-start-1 flex focus:outline-offset-[32px] ui-not-focus-visible:outline-none" tabindex="0">
    <div class="flex flex-col w-full">
      <div class="flex items-center justify-between px-4 pt-4">
        <Link :href="route('dashboard')">
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
          <article v-if="!!usePage().props?.flash?.error" class="mb-4 sm:mx-auto sm:w-full sm:max-w-sm | flex rounded-md bg-red-600 border border-red-500 p-4 space-x-3">
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
          <article v-if="!!usePage().props?.flash?.success" class="mb-4 sm:mx-auto sm:w-full sm:max-w-sm | flex rounded-md bg-green-600 border border-green-500 p-4 space-x-3">
            <div class="flex-shrink-0">
              <Icon icon="mdi:check-circle-outline" class="h-5 w-5 text-green-900" />
            </div>
            <div>
              <p class="text-sm font-medium text-green-900">{{ usePage().props.flash.success }}</p>
            </div>
            <div class="!ml-auto">
              <div class="-mx-1.5 -my-1.5">
                <button type="button" class="inline-flex rounded-md bg-green-600 p-1.5 text-green-800 hover:bg-green-700/50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-500">
                  <span class="sr-only">Dismiss</span>
                  <Icon icon="mdi:close" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </article>
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
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from '@capacitor/push-notifications';
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";
import axios from "axios";
import { store } from '@/state.js';

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

// console.log('isAuthed', isAuthed.value);
if (Capacitor.isNativePlatform()) {
  if (isAuthed.value && !store.pushRegistered) {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
        console.error('NOT GRANTED!')
      }
    });

    PushNotifications.addListener('registration',
        (token) => {
          axios.post(
              route('push-token'),
              {
                token: token.value,
              },
          ).then((response) => {
            console.info('Push registration success, token: ' + token.value);
          });
        }
    );

    store.pushRegistered = true;
    console.log('pushRegistered', store.pushRegistered);
  }

  // Some issue with our setup and push will not work
  PushNotifications.addListener('registrationError',
      (error) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
  );

  // Show us the notification payload if the app is open on our device
  PushNotifications.addListener('pushNotificationReceived',
      (notification) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
  );

  // Method called when tapping on a notification
  PushNotifications.addListener('pushNotificationActionPerformed',
      (notification) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
  );
}

</script>
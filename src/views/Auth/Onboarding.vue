<template>

</template>

<script setup>
import { Capacitor } from "@capacitor/core";
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";
import { Preferences } from '@capacitor/preferences';

// Step 1: Ask If They Want To Enable FaceID/TouchID
async function enableAutoLogin() {
  await Preferences.set({
    key: 'autoLogin',
    value: true,
  });
}
// Step 2: Enable Notifications
</script>
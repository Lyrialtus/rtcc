<template>
  <v-layout>
    <!-- No v-app-bar, because of some unresolved Suspense issues in Vue 3 -->
    <v-main>
      <v-toolbar color="surface" class="elevation-6">
        <NuxtLink to="/">
          <img
            src="/logo.svg"
            height="42"
            width="42"
            class="ml-3 mt-1"
            alt="Totally not the Binance logo"
          >
        </NuxtLink>
        <v-app-bar-title class="d-none d-sm-flex">
          Real-Time Crypto Converter
        </v-app-bar-title>
        <v-app-bar-title class="d-flex d-sm-none">
          RTCC
        </v-app-bar-title>
        <noscript>
          JavaScript is required!
        </noscript>
        <v-btn icon variant="outlined" color="info" @click="toggleTheme">
          <v-icon :icon="mdiThemeLightDark" />
        </v-btn>
      </v-toolbar>
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup>
import { useTheme } from 'vuetify'
import { mdiThemeLightDark } from '@mdi/js'

const theme = useTheme()
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

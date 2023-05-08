<template>
  <NuxtLayout>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-alert
            prominent
            type="error"
            color="info"
            variant="outlined"
            class="ma-6"
          >
            <div class="d-flex flex-row align-center justify-space-between">
              {{ error.statusCode }} - {{ error.statusMessage || error.message }}
              <v-btn variant="outlined" @click="handleError">
                Go Home
              </v-btn>
            </div>
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </NuxtLayout>
</template>

<script setup>
defineProps({
  error: {
    type: Object,
    default: null
  }
})

const handleError = () => clearError({ redirect: '/' })
</script>

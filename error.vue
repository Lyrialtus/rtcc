<template>
  <NuxtLayout>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-alert
            prominent
            type="error"
            color="no"
            variant="outlined"
            class="ma-6"
          >
            <div class="d-flex flex-row align-center justify-space-between">
              {{ errorMessage }}
              <v-btn v-if="showButton" variant="outlined" @click="handleError">
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
const props = defineProps({
  error: {
    type: Object,
    default: null
  }
})

const errorMessage = computed(() => {
  const plug = 'An error occurred'
  const message = props.error.statusMessage || props.error.message || plug
  return `${props.error.statusCode} - ${message}`
})
const showButton = computed(() => props.error.url !== '/')
const handleError = () => clearError({ redirect: '/' })
</script>

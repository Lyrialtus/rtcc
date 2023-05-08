<template>
  <v-form>
    <v-container class="mt-6">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="amount"
            type="number"
            min="0"
            label="Amount"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-autocomplete
            v-model="selected"
            v-model:search="search"
            :loading="loading"
            :items="items"
            label="Crypto pair (Binance symbol)"
            placeholder="e.g. BTCUSDT"
            variant="outlined"
            hide-no-data
            clearable
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-btn
            id="rt-price"
            variant="outlined"
            block
            height="56px"
            disabled
            :prepend-icon="mdiArrowRight"
            :color="dynamicColor"
          >
            {{ result }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { mdiArrowRight } from '@mdi/js'

let socket = null
let allPrices = []
let allSymbols = []
let items = []
let timeoutID = null
let resultDisplay = null

// Refs... or it could be a single reactive state
const amount = ref(1)
const selected = ref(null)
const search = ref(null)
const loading = ref(true)
const price = ref(null)
const dynamicColor = ref('on-surface-variant')

const result = computed(() => {
  if (!price.value || amount.value === '') {
    return null
  }
  return amount.value * price.value
})

onMounted(async () => {
  resultDisplay = document.querySelector('#rt-price')
  setupSocket()

  // More SSR-friendly, I guess
  const apiLink = 'https://api.binance.com/api/v3/ticker/price'
  const { data, pending, error, refresh } = await useFetch(apiLink)
  if (error.value) {
    throw error.value
  }
  if (pending.value) {
    watch(data, (value) => {
      finishSetup(value)
    })
    refresh()
  } else {
    finishSetup(data.value)
  }
})

const finishSetup = (data) => {
  allPrices = data
  allSymbols = data.map(item => item.symbol)
  loading.value = false
}

watch(amount, (number) => {
  if (number < 0) {
    amount.value = 0
  }
})

// Color-dependent transitions require some effort, I guess
watch(dynamicColor, (color) => {
  if (color !== 'on-surface-variant') {
    resultDisplay.style.transition = null
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => {
      dynamicColor.value = 'on-surface-variant'
    }, 1500)
  } else {
    resultDisplay.style.transition = 'color 1s linear'
  }
})

// Because of the very slow Vuetify autocomplete in 3.2.2
watch(search, (query) => {
  if (query.length > 1) {
    items = allSymbols.filter(symbol => symbol.includes(query.toUpperCase()))
  } else {
    items = []
  }
})

watch(selected, (symbol) => {
  checkStreams()
  if (symbol) {
    price.value = allPrices.find(item => item.symbol === symbol).price
    dynamicColor.value = 'on-surface-variant'
    subscribe(symbol.toLowerCase())
  } else {
    price.value = null
  }
})

const setupSocket = () => {
  socket = new WebSocket('wss://stream.binance.com:9443/ws')
  socket.onopen = (event) => { console.log(event) }
  socket.onerror = (event) => { console.log(event) }
  socket.onclose = (event) => { console.log(event) }
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    // For subscription-related messages
    if (data.result !== undefined) {
      if (data.result?.length) {
        unsubscribe(data.result)
      }
      return
    }
    const newPrice = data.c || data.p
    if (newPrice > price.value) {
      dynamicColor.value = 'green'
    } else if (newPrice < price.value) {
      dynamicColor.value = 'red'
    } else {
      dynamicColor.value = 'on-surface-variant'
    }
    price.value = newPrice
  }
}

const checkStreams = () => {
  socket.send(JSON.stringify({
    method: 'LIST_SUBSCRIPTIONS',
    id: 42
  }))
}

const subscribe = (symbol) => {
  socket.send(JSON.stringify({
    method: 'SUBSCRIBE',
    params: [`${symbol}@miniTicker`], // and/or @trade
    id: 42
  }))
}

const unsubscribe = (streams) => {
  socket.send(JSON.stringify({
    method: 'UNSUBSCRIBE',
    params: streams,
    id: 42
  }))
}
</script>

<style scoped>
#rt-price {
  opacity: 1;
  border-radius: 0px;
  border-color: #666;
  justify-content: left;
}
</style>

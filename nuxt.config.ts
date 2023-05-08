import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  modules: [
    (_, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(vuetify())
      })
    }
  ],
  css: ['vuetify/lib/styles/main.sass'],
  build: {
    transpile: ['vuetify']
  },
  app: {
    head: {
      title: 'RTCC',
      link: [{ rel: 'icon', href: '/logo.svg' }]
    }
  }
})

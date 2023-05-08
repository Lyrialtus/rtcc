# Test project: Real-Time Crypto Converter

Another attempt to do the `Nuxt 3 + Vuetify 3` thing. It just shows the price for a selected crypto pair with a multiplier applied to it. It only uses [Binance API](https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams); a websocket updates the price when and if it changes. The project language is... JS in TS. Don't expect anything special from it.

## Some observations

* Nuxt 3 works great, Vuetify integration is fine
* Vue 3 could be better, honestly
* Vuetify 3.2.2 is still noticeably in βeta
* Binance API is OK and free
* Sometimes it's all about nuances and details

### [Live Demo](https://rtcc.vercel.app/)

This is a static (`nuxt generate`) version of the app hosted on Vercel. But both SSG and SSR work pretty much the same for something so unsophisticated.

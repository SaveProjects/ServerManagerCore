import { defineConfig, store, drivers } from '@adonisjs/cache'
import string from '@adonisjs/core/helpers/string'

const cacheConfig = defineConfig({
  default: 'memory',
  stores: {
    memory: store().useL1Layer(
      drivers.memory({
        maxSize: string.bytes.parse('1000MB'),
      })
    ),
  },
  ttl: '10min',
  gracePeriod: {
    enabled: false,
  },
})

export default cacheConfig

declare module '@adonisjs/cache/types' {
  interface CacheStores extends InferStores<typeof cacheConfig> {}
}

import cache from '@adonisjs/cache/services/main'
import Server from '#models/server'
import CacheUtil from '../utils/cache_serializer/cache_util.js'
import { errors as lucidErrors } from '@adonisjs/lucid'

export default class ServerService {
  #cache = cache.namespace('servers')

  async fetchServer(id: string): Promise<Server | null> {
    const cacheRow = await this.#cache.get<Server>(id)
    if (cacheRow) return Server.$createFromAdapterResult(cacheRow)

    const server = await Server.find(id)
    if (!server) return null

    await this.#cache.set(id, new CacheUtil(Server).prepareModelToAdapter(server))
    return server
  }

  async fetchServerOrFail(id: string): Promise<Server> {
    const server = await this.fetchServer(id)
    if (!server) throw new lucidErrors.E_ROW_NOT_FOUND()

    return server
  }

  async fetchServerByDockerId(dockerId: string): Promise<Server | null> {
    const server = await Server.findBy('dockerId', dockerId)
    if (server)
      await this.#cache.set(server.id, new CacheUtil(Server).prepareModelToAdapter(server))

    return server
  }

  async saveServer(
    server: Server,
    options: { deleteFromCache: boolean } = { deleteFromCache: false }
  ): Promise<Server> {
    await server.save()

    if (options.deleteFromCache) await this.#cache.delete(server.id)
    else await this.#cache.set(server.id, new CacheUtil(Server).prepareModelToAdapter(server))

    return server
  }
}

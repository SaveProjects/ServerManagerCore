import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
import { Logger } from '@adonisjs/core/logger'
import DockerModem from 'docker-modem'
import env from '#start/env'
import { readFile } from 'node:fs/promises'
import Dockerode from 'dockerode'
import ServerService from '#services/server_service'

export default class Docker {
  readonly #log: Logger
  #client: Dockerode | null = null

  //#network: Dockerode.Network | null = null

  constructor(protected serverService: ServerService) {
    this.#log = logger.child({ service: 'Docker' })

    this.#log.info('Docker service initialisation...')
    this.#init().then(() => {
      this.#log.info('Docker service initialisation... OK')
    })
  }

  async #init() {
    const privateKey = await readFile(app.makePath('keys', 'docker_private.pem'))

    const modem = new DockerModem({
      host: env.get('DOCKER_HOST'),
      username: 'docker',
      sshOptions: {
        privateKey: privateKey.toString(),
      },
      protocol: 'ssh',
    })

    this.#client = new Dockerode(({ modem }['modem'] = modem))
    await this.#fetchNetwork()
    await this.sync()
  }

  async #fetchNetwork() {
    const networks = await this.#client?.listNetworks()
    const network = networks?.find((n) => n.Name === 'server-manager-network')

    if (!network) {
      this.#log.error("ServerManager network doesn't exist, core is unable to start any server!")
      await app.terminate()
      return
    }

    //this.#network = this.#client?.getNetwork(network.Id)!
  }

  async sync() {
    this.#log.info('ServerManager containers sync...')

    let managedServers = 0

    const containers = await this.#client?.listContainers()
    for (const container of containers!) {
      if (container.Labels['dev.splrge.edmine-server-manager.enabled'] !== 'true') continue
      this.#log.info(`Container ${container.Id}${container.Names[0]} detected`)

      const server = await this.serverService.fetchServerByDockerId(container.Id)
      if (!server || server.status === 'ERROR' || server.status === 'OFF') {
        this.#log.warn(`Orphelin server ${container.Id}${container.Names[0]} detected, removing...`)
        await this.#client?.getContainer(container.Id).stop()

        continue
      }

      if (server.status === 'LAUNCHING') {
        await this.#client?.getContainer(container.Id).stop()

        server.status = 'OFF'
        await this.serverService.saveServer(server, { deleteFromCache: true })

        continue
      }

      managedServers++
    }

    this.#log.info(`ServerManager containers sync... OK (${managedServers} managed servers)`)
  }
}

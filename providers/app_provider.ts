import type { ApplicationService } from '@adonisjs/core/types'
import Docker from "#services/docker";
import ServerService from "#services/server_service";

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    'docker': Docker
  }
}

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(Docker, async (resolver) => {
      const serverService = await resolver.make(ServerService)
      return new Docker(serverService)
    })
    this.app.container.alias('docker', Docker)
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {
    const docker = await this.app.container.make('docker')
    await docker.init()
  }

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}

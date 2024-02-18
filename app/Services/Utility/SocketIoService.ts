import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'

/**
 * Represents a service for managing Socket.io connections.
 */
class SocketIoService {
  public io: Server
  private booted: boolean = false

  /**
   * Boots up the server and initializes the necessary resources.
   *
   * @returns {void}
   */
  public boot(): void {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(AdonisServer.instance!, {
      cors: {
        origin: '*',
      },
    })
  }
}

export default new SocketIoService()

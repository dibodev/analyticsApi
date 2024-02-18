import { ResponseContract } from '@ioc:Adonis/Core/Response'

export class SseService {
  private static clients: Map<string, ResponseContract> = new Map()

  public static addClient(id: string, client: ResponseContract) {
    this.clients.set(id, client)
  }

  public static removeClient(id: string) {
    this.clients.delete(id)
  }

  public static sendMessage(id: string, message: string) {
    const client = this.clients.get(id)
    if (client) {
      console.log('sending message', message)
      // client.write(`data: ${message}\n\n`)
    }
  }

  public static handleDisconnect(id: string) {
    // Traiter la déconnexion ici, par exemple, en considérant cela comme un événement 'leave'
    console.log('client disconnected', id)
  }
}

export default new SseService()

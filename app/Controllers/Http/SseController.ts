import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SseService } from 'App/Services/SseService'

export default class SseController {
  protected async init({ response }: HttpContextContract) {
    response.header('Content-Type', 'text/event-stream')
    response.header('Cache-Control', 'no-cache')
    response.header('Connection', 'keep-alive')

    const clientId = 'temp-clientId'
    SseService.addClient('clientId', response)

    response.request.on('data', (data) => {
      console.log('data', data)
    })

    response.request.on('close', () => {
      SseService.removeClient(clientId)
      SseService.handleDisconnect(clientId)
    })
  }
}

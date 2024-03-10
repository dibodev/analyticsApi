import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import VisitorTrackingDataService from 'App/Services/Tracking/VisitorTrackingDataService'
import IPService, { IPApiResponse } from 'App/Services/Network/IPService'
// import { SseService } from 'App/Services/SseService'

export default class SseController {
  protected async initPageView({ response, request }: HttpContextContract) {
    response.header('Content-Type', 'text/event-stream')
    response.header('Cache-Control', 'no-cache')
    response.header('Connection', 'keep-alive')
    response.response.write(`data: Connection established\n\n`)
    Logger.info('SSE Connection established')

    request.request.on('close', async () => {
      const pageViewId: number | undefined = request.input('pageViewId')
      const clientIpInfos: IPApiResponse | null = await IPService.getClientIpInfo(request)

      if (clientIpInfos && pageViewId) {
        console.log(pageViewId)
        await VisitorTrackingDataService.leave(pageViewId, clientIpInfos.ip)
      }
    })
  }
}

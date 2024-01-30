import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VisitorTrackingDataService from 'App/Services/VisitorTrackingDataService'
import type { VisitorData } from 'App/Services/VisitorTrackingDataService'
import VisitorTrackingDataValidator from 'App/Validators/VisitorTrackingDataValidator'
import type { VisitorTrackingData } from 'App/Validators/VisitorTrackingDataValidator'
import IPService from 'App/Services/IPService'

export default class VisitorTrackingController {
  public async join({ request }: HttpContextContract): Promise<VisitorData> {
    const visitorTrackingData: VisitorTrackingData = await request.validate(
      VisitorTrackingDataValidator
    )
    const userAgent: string = visitorTrackingData.userAgent || request.header('User-Agent') || ''

    const clientIp: string = await IPService.getClientIp(request.ip())

    return await VisitorTrackingDataService.collectVisitorData(clientIp, {
      ...visitorTrackingData,
      userAgent,
    })
  }
  public async leave({ request, response }: HttpContextContract): Promise<void> {
    const visitorTrackingData: VisitorTrackingData = await request.validate(
      VisitorTrackingDataValidator
    )
    const userAgent: string = visitorTrackingData.userAgent || request.header('User-Agent') || ''

    const clientIp: string = await IPService.getClientIp(request.ip())

    await VisitorTrackingDataService.leave(clientIp, { ...visitorTrackingData, userAgent })
    response.send({ success: true })
  }
}

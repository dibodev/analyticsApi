import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AnalyticsService from 'App/Services/AnalyticsService'
import { DateTime } from 'luxon'

export default class AnalyticsController {
  public async stats({ request, params }: HttpContextContract) {
    const period: string = request.input('period')
    const dateString: string = request.input('date') || DateTime.now().toISODate()
    const date: DateTime = DateTime.fromISO(dateString)

    return await AnalyticsService.getStats({
      domain: params.domain,
      period,
      endAt: date,
    })
  }
}

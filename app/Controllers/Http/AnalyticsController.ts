import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AnalyticsService from 'App/Services/AnalyticsService'

export default class AnalyticsController {
  public async getAnalytics({ params }: HttpContextContract) {
    return await AnalyticsService.getAnalytics(params.projectId)
  }
}

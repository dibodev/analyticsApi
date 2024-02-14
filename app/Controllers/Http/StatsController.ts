import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AnalyticsDataService from 'App/Services/analytics/AnalyticsDataService'
import Project from 'App/Models/Project'
import ProjectService from 'App/Services/ProjectService'
import AnalyticsPeriodService from 'App/Services/analytics/AnalyticsPeriodService'
import type { AnalyticsPeriod } from 'App/Services/analytics/AnalyticsPeriodService'
import type { OverviewMetrics } from 'App/Services/analytics/AnalyticsDataService'

export default class StatsController {
  // public async overview({ request }: HttpContextContract) {
  //   const period = request.input('period', '7d')
  //   const stats = await AnalyticsDataService.getGlobalStats(period)
  //   return stats
  // }

  /**
   * Retrieves overview metrics for a specific domain.
   *
   * @async
   * @param {HttpContextContract} context - The HTTP context containing the request and params.
   * @returns {Promise<OverviewMetrics>} - The overview metrics for the specified domain.
   */
  public async domainOverview({ request, params }: HttpContextContract): Promise<OverviewMetrics> {
    const { domain } = params
    const periodQuery: string | undefined = request.input('period', '7d')
    const period: AnalyticsPeriod | undefined = periodQuery
      ? AnalyticsPeriodService.getPeriod(periodQuery)
      : undefined
    const project: Project = await ProjectService.getByDomain(domain)
    return await AnalyticsDataService.getOverviewMetrics(project.id, period)
  }
}

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'
import ProjectService from 'App/Services/ProjectService'
import AnalyticsPeriodService from 'App/Services/Analytics/AnalyticsPeriodService'
import type { AnalyticsPeriod, OverviewMetrics } from 'App/Services/Analytics/AnalyticsTypes'
import AnalyticsOverviewService from 'App/Services/Analytics/AnalyticsOverviewService'

export default class AnalyticsController {
  // public async overview({ request }: HttpContextContract) {
  //   const period = request.input('period', '7d')
  //   const stats = await AnalyticsOverviewService.getGlobalStats(period)
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
    return await AnalyticsOverviewService.getOverviewMetrics({ projectId: project.id, period })
  }
}

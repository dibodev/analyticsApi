import { DateTime } from 'luxon'
import AnalyticsViewsService from 'App/Services/analytics/AnalyticsViewsService'
import { roundToTwoDecimals } from 'App/Utils/NumberUtils'

export type OverviewMetrics = {
  uniqueVisitors: number
  uniqueSessions: number
  totalSessions: number
  totalViews: number
  viewsPerVisit: number
  avgVisitDuration: number
  bounceRate: number
}

export default class AnalyticsDataService {
  /**
   * Retrieves the overview metrics for a given project.
   *
   * @param {number} projectId - The ID of the project.
   * @param {object} period - The period for which to retrieve metrics. Optional, defaults to the entire project duration.
   * @param {DateTime} period.startAt - The start date/time of the period.
   * @param {DateTime} period.endAt - The end date/time of the period.
   *
   * @return {Promise<OverviewMetrics>} - A Promise that resolves to an object containing the overview metrics.
   *
   * @throws {Error} - If an error occurs while retrieving the metrics.
   */
  public static async getOverviewMetrics(
    projectId: number,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
  ): Promise<OverviewMetrics> {
    const uniqueVisitors: number = await AnalyticsViewsService.getUniqueViewsOfProject(
      projectId,
      period
    )

    const uniqueSessions: number = await AnalyticsViewsService.getUniqueSessions(projectId, period)

    const totalSessions: number = await AnalyticsViewsService.getTotalSessions(projectId, period)

    const totalViews: number = await AnalyticsViewsService.getViewsOfProject(projectId, period)

    const viewsPerVisit: number = roundToTwoDecimals(totalViews / uniqueVisitors)

    const avgVisitDuration: number = await AnalyticsViewsService.getAverageVisitDuration(
      projectId,
      period
    )

    const bounceRate: number = await AnalyticsViewsService.getBounceRate(projectId, period)

    return {
      uniqueVisitors,
      uniqueSessions,
      totalSessions,
      totalViews,
      viewsPerVisit,
      avgVisitDuration,
      bounceRate,
    }
  }
}

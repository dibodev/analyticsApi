import AnalyticsViewsService from 'App/Services/Analytics/AnalyticsViewsService'
import { roundToTwoDecimals } from 'App/Utils/NumberUtils'
import type {
  AnalyticsProjectViewsPayload,
  OverviewMetrics,
} from 'App/Services/Analytics/AnalyticsTypes'
import AnalyticsSessionService from 'App/Services/Analytics/AnalyticsSessionService'
import AnalyticsBounceRateService from 'App/Services/Analytics/AnalyticsBounceRateService'

/**
 * Service class for retrieving overview metrics for a project's views.
 */
export default class AnalyticsOverviewService {
  /**
   * Retrieves overview metrics for a project's views.
   *
   * @param {AnalyticsProjectViewsPayload} payload - The payload containing the project ID and period.
   *
   * @return {Promise<OverviewMetrics>} - A promise that resolves to an object containing overview metrics:
   *                                      - uniqueVisitors: The number of unique visitors to the project.
   *                                      - uniqueSessions: The number of unique sessions for the project.
   *                                      - totalSessions: The total number of sessions for the project.
   *                                      - totalViews: The total number of views for the project.
   *                                      - viewsPerVisit: The average number of views per visit.
   *                                      - avgVisitDuration: The average visit duration in seconds.
   *                                      - bounceRate: The bounce rate for the project.
   */
  public static async getOverviewMetrics({
    projectId,
    period,
  }: AnalyticsProjectViewsPayload): Promise<OverviewMetrics> {
    const uniqueVisitors: number = await AnalyticsViewsService.getUniqueViewsOfProject({
      projectId,
      period,
    })

    const uniqueSessions: number = await AnalyticsSessionService.getUniqueSessions({
      projectId,
      period,
    })

    const totalSessions: number = await AnalyticsSessionService.getTotalSessions({
      projectId,
      period,
    })

    const totalViews: number = await AnalyticsViewsService.getViewsOfProject({ projectId, period })

    const viewsPerVisit: number = roundToTwoDecimals(totalViews / uniqueVisitors)

    const avgVisitDuration: number = await AnalyticsViewsService.getAverageVisitDuration({
      projectId,
      period,
    })

    const bounceRate: number = await AnalyticsBounceRateService.getBounceRate({ projectId, period })

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

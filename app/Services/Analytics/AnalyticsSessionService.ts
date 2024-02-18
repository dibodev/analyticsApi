import type { AnalyticsProjectViewsPayload } from 'App/Services/Analytics/AnalyticsTypes'
import PageView from 'App/Models/PageView'
import PageViewSessionService from 'App/Services/PageView/PageViewSessionService'

/**
 * Provides methods to retrieve analytics data related to sessions.
 */
export default class AnalyticsSessionService {
  /**
   * Retrieves the number of unique sessions for a given project and period.
   *
   * @param {AnalyticsProjectViewsPayload} payload - The payload containing the project ID and period.
   * @property {number} projectId - The ID of the project to retrieve unique sessions for.
   * @property {AnalyticsPeriod} period - [Optional] The period of time to retrieve unique sessions for.
   * @returns {Promise<number>} The number of unique sessions.
   */
  public static async getUniqueSessions({
    projectId,
    period,
  }: AnalyticsProjectViewsPayload): Promise<number> {
    const pageViews: Array<PageView> =
      await PageViewSessionService.getUniquePageViewsBySessionInPeriod({
        projectId,
        period,
      })
    return pageViews.length
  }

  /**
   * Retrieves the total number of sessions for a given project within a specified period.
   *
   * @param {AnalyticsProjectViewsPayload} payload - The payload containing the project ID and period.
   * @property {number} projectId - The ID of the project to retrieve the total sessions for.
   * @property {AnalyticsPeriod} period - [Optional] The period of time to retrieve the total sessions for.
   * @returns {Promise<number>} - A promise that resolves to the total number of sessions.
   */
  public static async getTotalSessions({
    projectId,
    period,
  }: AnalyticsProjectViewsPayload): Promise<number> {
    const pageViews: Array<PageView> = await PageViewSessionService.getPageViewsBySessionInPeriod({
      projectId,
      period,
    })
    return pageViews.length
  }
}

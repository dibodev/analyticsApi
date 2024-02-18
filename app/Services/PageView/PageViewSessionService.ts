import PageView from 'App/Models/PageView'
import PageViewService from 'App/Services/PageView/PageViewService'
import type { AnalyticsProjectViewsPayload } from 'App/Services/Analytics/AnalyticsTypes'

/**
 * Provides methods to retrieve page views by session for a given project.
 */
export default class PageViewSessionService {
  // For total sessions of a project
  /**
   * Retrieves page views by session in a given period.
   *
   * @param {AnalyticsProjectViewsPayload} payload - The payload containing the project ID and period.
   * @property {number} projectId - The ID of the project to retrieve page views for.
   * @property {AnalyticsPeriod} period - [Optional] The period to filter the page views.
   * @return {Promise<Array<PageView>>} - The array of page views within the specified period.
   */
  public static async getPageViewsBySessionInPeriod({
    projectId,
    period,
  }: AnalyticsProjectViewsPayload): Promise<Array<PageView>> {
    const pageViews: Array<PageView> = await PageViewService.getPageViewsInPeriod({
      projectId,
      period,
    })

    // Delete duplicate entries with the same visitor_id and user_agent_id
    const sessionPageViews: Array<PageView> = []
    const userAgentIds: Set<number> = new Set()

    for (const pageView of pageViews) {
      if (pageView.userAgentId) {
        userAgentIds.add(pageView.userAgentId)
      }
      if (pageView.userAgentId === null || !userAgentIds.has(pageView.userAgentId)) {
        sessionPageViews.push(pageView)
      }
    }
    return sessionPageViews
  }

  // For total unique sessions of a project
  /**
   * Retrieves unique page views by session in a given period.
   *
   * @param {AnalyticsProjectViewsPayload} payload - The payload containing the project ID and period.
   * @property {number} projectId - The ID of the project to retrieve page views for.
   * @property {AnalyticsPeriod} period - [Optional] The period to filter the page views
   * @return {Promise<Array<PageView>>} - The array of unique page views within the specified period.
   */
  public static async getUniquePageViewsBySessionInPeriod({
    projectId,
    period,
  }: AnalyticsProjectViewsPayload): Promise<Array<PageView>> {
    const pageViews: Array<PageView> = await PageViewService.getPageViewsInPeriod({
      projectId,
      period,
    })

    // Delete duplicate entries with the same visitor_id and user_agent_id
    const uniquePageViews: Array<PageView> = []
    const uniqueSessions: Set<string> = new Set()

    for (const pageView of pageViews) {
      // If userAgentId is null, consider each pageView as a single session
      if (pageView.userAgentId === null) {
        uniquePageViews.push(pageView)
      } else {
        // For non-null userAgentId, group by the combination of visitorId and userAgentId
        const sessionKey: string = `${pageView.visitorId}:${pageView.userAgentId}`
        if (!uniqueSessions.has(sessionKey)) {
          uniquePageViews.push(pageView)
          uniqueSessions.add(sessionKey)
        }
      }
    }

    return uniquePageViews
  }
}

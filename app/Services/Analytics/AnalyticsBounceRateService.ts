import PageView from 'App/Models/PageView'
import PageViewService from 'App/Services/PageView/PageViewService'
import type { AnalyticsProjectViewsPayload } from 'App/Services/Analytics/AnalyticsTypes'
import { calculatePercentage } from 'App/Utils/NumberUtils'
import AnalyticsViewsService from 'App/Services/Analytics/AnalyticsViewsService'

/**
 * AnalyticsBounceRateService is a class that provides methods to retrieve and calculate bounce rate for a given project and time period.
 */
export default class AnalyticsBounceRateService {
  /**
   * Retrieves the number of bounce visits for a given project and time period.
   *
   * @param {AnalyticsProjectViewsPayload} payload - The payload containing the projectId and period.
   * @property {number} projectId - The ID of the project.
   * @property {AnalyticsPeriod} period - [Optional] The period for which to retrieve the bounce visits.
   * @return {Promise<number>} - A promise that resolves to the number of bounce visits.
   */
  public static async getNumberOfBounceVisits({
    projectId,
    period,
  }: AnalyticsProjectViewsPayload): Promise<number> {
    const pageViews: Array<PageView> = await PageViewService.getPageViewsInPeriod({
      projectId,
      period,
    })

    let singlePageSessions: number = 0
    const sessionsCount: Map<number, number> = new Map()

    for (const pageView of pageViews) {
      const count: number = sessionsCount.get(pageView.visitorId) || 0
      sessionsCount.set(pageView.visitorId, count + 1)
    }

    sessionsCount.forEach((count: number): void => {
      if (count === 1) {
        singlePageSessions++
      }
    })

    return singlePageSessions
  }

  /**
   * Calculates the bounce rate for a given project and period.
   * Bounce rate = (Number of visits to a single page / Total number of visits) * 100
   *
   * @param {AnalyticsProjectViewsPayload} payload - The payload containing the project ID and period.
   * @property {number} projectId - The ID of the project.
   * @property {AnalyticsPeriod} period - [Optional] The period for which to calculate the bounce rate.
   * @returns {Promise<number>} - The calculated bounce rate as a percentage.
   */
  public static async getBounceRate({
    projectId,
    period,
  }: AnalyticsProjectViewsPayload): Promise<number> {
    const uniqueViews: number = await AnalyticsViewsService.getUniqueViewsOfProject({
      projectId,
      period,
    })
    const bounceVisits: number = await this.getNumberOfBounceVisits({ projectId, period })

    return calculatePercentage(bounceVisits, uniqueViews)
  }
}

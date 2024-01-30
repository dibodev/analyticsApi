import AnalyticsRealTimeService from './AnalyticsRealTimeService'
import { DateTime } from 'luxon'
import AnalyticsHistoricalService from 'App/Services/analytics/AnalyticsHistoricalService'
import type { TopStats } from 'App/Services/analytics/AnalyticsHistoricalService'

export default class AnalyticsService {
  /**
   * Retrieves real-time analytics data.
   * @param {string} domain - The domain to get real-time analytics for.
   * @return {number} The number of current visitors.
   */
  public static getRealTimeVisitorCount(domain: string): number {
    return AnalyticsRealTimeService.getVisitorCountForProject(domain)
  }

  /**
   * Adds a visitor to the real-time tracking system.
   * @param {string} domain - The domain where the visitor is.
   * @param {string} visitorId - The ID of the visitor.
   */
  public static addRealTimeVisitor(domain: string, visitorId: string): void {
    AnalyticsRealTimeService.addVisitor(domain, visitorId)
  }

  /**
   * Removes a visitor from the real-time tracking system.
   * @param {string} domain - The domain where the visitor was.
   * @param {string} visitorId - The ID of the visitor.
   */
  public static removeRealTimeVisitor(domain: string, visitorId: string): void {
    AnalyticsRealTimeService.removeVisitor(domain, visitorId)
  }

  /**
   * Retrieves historical analytics data for a given domain and time period.
   * @param {string} domain - The domain to get historical analytics for.
   * @param {string} period - The period for which to retrieve analytics.
   * @param {DateTime} endAt - The end date time for the analytics period.
   * @return {Promise<Object>} The historical analytics data.
   */
  public static async getHistoricalStats({
    domain,
    period,
    endAt,
  }: {
    domain: string
    period?: string
    endAt: DateTime
  }): Promise<Array<TopStats>> {
    return AnalyticsHistoricalService.getStats({ domain, period, endAt })
  }
}

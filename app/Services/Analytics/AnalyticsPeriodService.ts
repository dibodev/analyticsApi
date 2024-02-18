import { DateTime } from 'luxon'
import type { AnalyticsPeriod } from 'App/Services/Analytics/AnalyticsTypes'

export default class AnalyticsPeriodService {
  // convert a string period to startAt and endAt (e.g. '7d' -> { startAt: DateTime, endAt: DateTime })
  /**
   * Retrieves the start and end date of an analytics period based on the given period name.
   *
   * @param {string} period - The name of the period. Possible values are '24h', '7d', and '30d'.
   * @return {AnalyticsPeriod} An object containing the start and end dates of the analytics period.
   */
  public static getPeriod(period: string): AnalyticsPeriod {
    const periodStart: DateTime = DateTime.now()
    const periodEnd: DateTime = DateTime.now()

    switch (period) {
      case '24h':
        return {
          startAt: periodStart.minus({ hours: 24 }),
          endAt: periodEnd,
        }
      case '7d':
        return {
          startAt: periodStart.minus({ days: 7 }),
          endAt: periodEnd,
        }
      case '30d':
        return {
          startAt: periodStart.minus({ days: 30 }),
          endAt: periodEnd,
        }
      default:
        return {
          startAt: periodStart.minus({ days: 7 }),
          endAt: periodEnd,
        }
    }
  }
}

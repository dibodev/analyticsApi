import type { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import PageView from 'App/Models/PageView'
import { DateTime } from 'luxon'
import DateProvider from 'App/providers/DateProvider'
import type { AnalyticsPeriod } from 'App/Services/Analytics/AnalyticsTypes'

/**
 * Service class for filtering page views based on a time period.
 */
export default class PageViewFilterService {
  /**
   * Applies a time filter to a given query.
   *
   * @param {ModelQueryBuilderContract<typeof PageView, PageView>} query - The query to be filtered.
   * @param {AnalyticsPeriod} period - The time period to filter the query. Default is undefined.
   * @property {DateTime} period.startAt - The start date and time of the period.
   * @property {DateTime} period.endAt - The end date and time of the period.
   * @returns {Promise<Array<PageView>>} A Promise with the filtered array of PageView objects.
   */
  public static applyTimeFilter(
    query: ModelQueryBuilderContract<typeof PageView, PageView>,
    period?: AnalyticsPeriod
  ): Promise<Array<PageView>> {
    if (period !== undefined) {
      let hours: number = period.startAt.diff(period.endAt, 'hours').hours

      // transform negative hours to positive
      if (hours < 0) {
        hours = -hours
      }

      const endTimeProvider: DateProvider = new DateProvider()

      const startTime: DateTime = endTimeProvider.date.minus({ hours })

      const startTimeProvider: DateProvider = new DateProvider(startTime)

      const startTimeSQL: string = startTimeProvider.toSQL()
      const endTimeSQL: string = endTimeProvider.toSQL()

      query.where((query: ModelQueryBuilderContract<typeof PageView, PageView>): void => {
        query
          .whereBetween('session_start', [startTimeSQL, endTimeSQL])
          .orWhereBetween('session_end', [startTimeSQL, endTimeSQL])
      })
    }
    return query
  }
}

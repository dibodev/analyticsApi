import PageView from 'App/Models/PageView'
import { DateTime } from 'luxon'
import type { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class PageViewService {
  /**
   * Retrieves page views for given visitor IDs within the last specified number of hours.
   *
   * @param visitorIds - Array of visitor IDs
   * @param hours - Number of hours to look back (default is 24)
   * @returns Promise<PageView[]>
   */
  public static async getPageViewsForVisitorsInLastHours(
    visitorIds: Array<number>,
    hours: number
  ): Promise<Array<PageView>> {
    const endTime: DateTime = DateTime.now()
    const startTime: DateTime = endTime.minus({ hours })

    const startTimeSQL: string | null = startTime.toSQL()
    const endTimeSQL: string | null = endTime.toSQL()

    if (!startTimeSQL || !endTimeSQL) {
      throw new Error('Invalid date')
    }

    return PageView.query()
      .whereIn('visitor_id', visitorIds)
      .where((query: ModelQueryBuilderContract<typeof PageView, PageView>): void => {
        query
          .whereBetween('session_start', [startTimeSQL, endTimeSQL])
          .orWhereBetween('session_end', [startTimeSQL, endTimeSQL])
      })
  }

  /**
   * Retrieves the number of page views for given visitor IDs within the last specified number of hours.
   *
   * @param visitorIds - Array of visitor IDs
   * @param hours - Number of hours to look back (default is 24)
   * @returns Promise<number>
   */

  public static async getNumberPageViewsForVisitorsInLastHours(
    visitorIds: Array<number>,
    hours: number
  ): Promise<number> {
    const pageViews: Array<PageView> = await this.getPageViewsForVisitorsInLastHours(
      visitorIds,
      hours
    )

    return pageViews.length
  }

  /**
   * Retrieves the number of unique page views for given visitor IDs within the last specified number of hours.
   *
   * @param visitorIds - Array of visitor IDs
   * @param hours - Number of hours to look back (default is 24)
   * @returns Promise<number>
   */

  public static async getNumberUniquePageViewsForVisitorsInLastHours(
    visitorIds: Array<number>,
    hours: number
  ): Promise<number> {
    const pageViews: Array<PageView> = await this.getPageViewsForVisitorsInLastHours(
      visitorIds,
      hours
    )

    return new Set(pageViews.map((pv: PageView) => pv.visitorId)).size
  }
}

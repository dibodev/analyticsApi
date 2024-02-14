import PageView from 'App/Models/PageView'
import { DateTime } from 'luxon'
import type { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import VisitorService from 'App/Services/VisitorService'
import DateProvider from 'App/providers/DateProvider'
import PageService from 'App/Services/PageService'

export default class PageViewService {
  // For total page views of a project
  /**
   * Retrieves the page views within a specified period for a given project.
   *
   * @param {number} projectId - The ID of the project.
   * @param {object} period - (Optional) The period object containing startAt and endAt properties.
   * @param {DateTime} period.startAt - The starting date and time of the period.
   * @param {DateTime} period.endAt - The ending date and time of the period.
   *
   * @return {Promise<Array<PageView>>} - The array of page views within the specified period.
   */
  public static async getPageViewsInPeriod(
    projectId: number,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
  ): Promise<Array<PageView>> {
    const pageIds: Array<number> = await PageService.getPageIdsByProjectId(projectId)

    const query: ModelQueryBuilderContract<typeof PageView, PageView> = PageView.query().whereIn(
      'page_id',
      pageIds
    )

    return await this.applyTimeFilter(query, period)
  }

  // For total sessions of a project
  /**
   * Retrieves page views by session in a given period.
   *
   * @param {number} projectId - The ID of the project.
   * @param {object | undefined} period - The time period to filter the page views. Optional.
   * @param {DateTime} period.startAt - The start date/time of the period.
   * @param {DateTime} period.endAt - The end date/time of the period.
   * @return {Promise<Array<PageView>>} A Promise that resolves to an array of PageView objects for each session in the specified period.
   */
  public static async getPageViewsBySessionInPeriod(
    projectId: number,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
  ): Promise<Array<PageView>> {
    const pageViews: Array<PageView> = await this.getPageViewsInPeriod(projectId, period)

    // Delete duplicate entries with same visitor_id and user_agent_id
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
   * @param {number} projectId - The ID of the project.
   * @param {Object} [period] - The period in which to retrieve the page views. If not provided, retrieves all page views.
   * @param {DateTime} period.startAt - The start date/time of the period.
   * @param {DateTime} period.endAt - The end date/time of the period.
   * @returns {Promise<Array<PageView>>} - A promise that resolves to an array of unique page views.
   */
  public static async getUniquePageViewsBySessionInPeriod(
    projectId: number,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
  ): Promise<Array<PageView>> {
    const pageViews: Array<PageView> = await this.getPageViewsInPeriod(projectId, period)

    // Delete duplicate entries with same visitor_id and user_agent_id
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

  // for Total unique visitors of a project
  /**
   * Retrieves unique page views by visitor in a specified period.
   *
   * @param {number} projectId - The ID of the project to retrieve page views for.
   * @param {Object} [period] - The period to filter page views. If not provided, retrieves all page views.
   * @param {DateTime} period.startAt - The start date/time of the period.
   * @param {DateTime} period.endAt - The end date/time of the period.
   *
   * @return {Promise<Array<PageView>>} - A promise that resolves to an array of unique page views.
   */
  public static async getUniquePageViewsByVisitorInPeriod(
    projectId: number,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
  ): Promise<Array<PageView>> {
    const visitorIds: Array<number> = await VisitorService.getVisitorIdsByProjectId(projectId)

    const query: ModelQueryBuilderContract<typeof PageView, PageView> = PageView.query().whereIn(
      'visitor_id',
      visitorIds
    )

    // Delete duplicate entries with same visitor_id
    const pageViews: Array<PageView> = await this.applyTimeFilter(query, period)
    const uniquePageViews: Array<PageView> = []
    const visitorIdsSet: Set<number> = new Set()
    for (const pageView of pageViews) {
      if (!visitorIdsSet.has(pageView.visitorId)) {
        uniquePageViews.push(pageView)
        visitorIdsSet.add(pageView.visitorId)
      }
    }

    return uniquePageViews
  }

  /**
   * Applies a time filter to a given query.
   *
   * @param {ModelQueryBuilderContract<typeof PageView, PageView>} query - The query to be filtered.
   * @param {Object} [period] - The time period to filter the query. Default is undefined.
   * @param {DateTime} period.startAt - The start date and time of the period.
   * @param {DateTime} period.endAt - The end date and time of the period.
   * @returns {Promise<Array<PageView>>} A Promise with the filtered array of PageView objects.
   */
  public static applyTimeFilter(
    query: ModelQueryBuilderContract<typeof PageView, PageView>,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
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

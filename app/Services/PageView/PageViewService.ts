import PageView from 'App/Models/PageView'
import type { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import VisitorService from 'App/Services/VisitorService'
import PageService from 'App/Services/PageService'
import PageViewFilterService from 'App/Services/PageView/PageViewFilterService'
import type { AnalyticsProjectViewsPayload } from 'App/Services/Analytics/AnalyticsTypes'
import type { PageViewPayload } from 'App/Services/PageView/PageViewTypes'
import { DateTime } from 'luxon'

/**
 * Represents a service for managing page views.
 */
export default class PageViewService {
  // For total page views of a project
  /**
   * Retrieves the page views within a specified period for a given project.
   * @param {AnalyticsProjectViewsPayload} payload - The payload containing the project ID and period.
   * @property {number} projectId - The ID of the project to retrieve page views for.
   * @property {AnalyticsPeriod} period - [Optional] The period to filter the page views.
   * @return {Promise<Array<PageView>>} - The array of page views within the specified period.
   */
  public static async getPageViewsInPeriod({
    projectId,
    period,
  }: AnalyticsProjectViewsPayload): Promise<Array<PageView>> {
    const pageIds: Array<number> = await PageService.getPageIdsByProjectId(projectId)

    const query: ModelQueryBuilderContract<typeof PageView, PageView> = PageView.query().whereIn(
      'page_id',
      pageIds
    )

    return await PageViewFilterService.applyTimeFilter(query, period)
  }

  // for Total unique visitors of a project
  /**
   * Retrieves unique page views by visitor in a specified period.
   *
   * @param {AnalyticsProjectViewsPayload} payload - The payload containing the project ID and period.
   * @property {number} projectId - The ID of the project to retrieve page views for.
   * @property {AnalyticsPeriod} period - [Optional] The period to filter the page views.
   * @return {Promise<Array<PageView>>} - The array of unique page views within the specified period.
   */
  public static async getUniquePageViewsByVisitorInPeriod({
    projectId,
    period,
  }: AnalyticsProjectViewsPayload): Promise<Array<PageView>> {
    const visitorIds: Array<number> = await VisitorService.getVisitorIdsByProjectId(projectId)

    const query: ModelQueryBuilderContract<typeof PageView, PageView> = PageView.query().whereIn(
      'visitor_id',
      visitorIds
    )

    // Delete duplicate entries with the same visitor_id
    const pageViews: Array<PageView> = await PageViewFilterService.applyTimeFilter(query, period)
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
   * Creates a new PageView record in the database.
   *
   * @param {PageViewPayload} pageViewPayload - The payload object containing the data for the new PageView record.
   * @return {Promise<PageView>} - A promise that resolves with the newly created PageView record.
   */
  public static async create(pageViewPayload: PageViewPayload): Promise<PageView> {
    const sessionStart: string = DateTime.now().toISO()
    const sessionEnd: string | undefined = pageViewPayload.sessionEnd?.toISO() || undefined

    return await PageView.create({
      ...pageViewPayload,
      sessionStart,
      sessionEnd,
    })
  }
}

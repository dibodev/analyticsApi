import PageView from 'App/Models/PageView'
import PageViewService from 'App/Services/PageView/PageViewService'
import { roundToTwoDecimals } from 'App/Utils/NumberUtils'
import type { AnalyticsProjectViewsPayload } from 'App/Services/Analytics/AnalyticsTypes'

/**
 * Provides analytical services for views of projects.
 */
export default class AnalyticsViewsService {
  /**
   * Retrieves the number of views for a project within a specific period.
   *
   * @param {AnalyticsProjectViewsPayload} payload - The payload containing the project id and period.
   * @property {number} projectId - The id of the project.
   * @property {AnalyticsPeriod} period - [Optional] The time period in which to retrieve the views.
   *
   * @return {Promise<number>} - A promise that resolves to the number of views for the project.
   */
  public static async getViewsOfProject({
    projectId,
    period,
  }: AnalyticsProjectViewsPayload): Promise<number> {
    const pageViews: Array<PageView> = await PageViewService.getPageViewsInPeriod({
      projectId,
      period,
    })

    return pageViews.length
  }

  /**
   * Retrieves the number of unique views of a project within a specified period of time.
   *
   * @param {AnalyticsProjectViewsPayload} payload - The payload containing the project id and period.
   * @property {number} projectId - The ID of the project.
   * @property {AnalyticsPeriod} period - [Optional] The time period in which to retrieve the unique views.
   * @returns {Promise<number>} - A Promise that resolves to the number of unique views of the project.
   */
  public static async getUniqueViewsOfProject({
    projectId,
    period,
  }: AnalyticsProjectViewsPayload): Promise<number> {
    const pageViews: Array<PageView> = await PageViewService.getUniquePageViewsByVisitorInPeriod({
      projectId,
      period,
    })

    return pageViews.length
  }

  /**
   * Calculates the average visit duration for a given project and time period.
   *
   * @param {AnalyticsProjectViewsPayload} payload - The payload object containing project ID and period.
   * @property {number} projectId - The ID of the project.
   * @property {AnalyticsPeriod} period - [Optional] The time period for which to calculate the average visit duration.
   * @return {Promise<number>} - A promise that resolves to the average visit duration (in seconds)
   */
  public static async getAverageVisitDuration({
    projectId,
    period,
  }: AnalyticsProjectViewsPayload): Promise<number> {
    const pageViews: Array<PageView> = await PageViewService.getPageViewsInPeriod({
      projectId,
      period,
    })
    const totalDuration: number = pageViews.reduce((acc: number, pageView: PageView) => {
      return acc + pageView.duration
    }, 0)
    return roundToTwoDecimals(totalDuration / pageViews.length)
  }
}

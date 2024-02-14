import PageView from 'App/Models/PageView'
import PageViewService from 'App/Services/PageViewService'
import { DateTime } from 'luxon'
import { calculatePercentage, roundToTwoDecimals } from 'App/Utils/NumberUtils'

export default class AnalyticsViewsService {
  /**
   * Retrieves the number of page views for a given project within a specified period.
   *
   * @param {number} projectId - The ID of the project to get views for.
   * @param {Object} period - The period of time to consider for the page views.
   * @param {DateTime} period.startAt - The start date and time of the period.
   * @param {DateTime} period.endAt - The end date and time of the period.
   * @return {Promise<number>} - A Promise that resolves to the number of page views for the project.
   */
  public static async getViewsOfProject(
    projectId: number,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
  ): Promise<number> {
    const pageViews: Array<PageView> = await PageViewService.getPageViewsInPeriod(projectId, period)

    return pageViews.length
  }

  /**
   * Retrieves the number of unique views of a project within a specified period of time.
   *
   * @param {number} projectId - The ID of the project to retrieve the unique views for.
   * @param {Object} period - The period of time to retrieve the views for.
   * @param {DateTime} period.startAt - The start date and time of the period.
   * @param {DateTime} period.endAt - The end date and time of the period.
   * @returns {Promise<number>} - A Promise that resolves to the number of unique views of the project.
   */
  public static async getUniqueViewsOfProject(
    projectId: number,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
  ): Promise<number> {
    const pageViews: Array<PageView> = await PageViewService.getUniquePageViewsByVisitorInPeriod(
      projectId,
      period
    )

    return pageViews.length
  }

  /**
   * Retrieves the number of unique sessions for a given project ID and optional period.
   *
   * @param {number} projectId - The ID of the project.
   * @param {Object} [period] - The optional period for which to retrieve the unique sessions.
   * @param {DateTime} period.startAt - The start date and time of the period.
   * @param {DateTime} period.endAt - The end date and time of the period.
   * @returns {Promise<number>} - A promise that resolves to the number of unique sessions.
   */
  public static async getUniqueSessions(
    projectId: number,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
  ): Promise<number> {
    const pageViews: Array<PageView> = await PageViewService.getUniquePageViewsBySessionInPeriod(
      projectId,
      period
    )
    return pageViews.length
  }

  /**
   * Retrieves the total number of sessions for a given project within a specified period.
   *
   * @param {number} projectId - The ID of the project.
   * @param {Object} [period] - Optional parameter to specify the period for which the total sessions are calculated.
   * @param {DateTime} period.startAt - The start date and time of the period.
   * @param {DateTime} period.endAt - The end date and time of the period.
   * @returns {Promise<number>} - A promise that resolves to the total number of sessions.
   */
  public static async getTotalSessions(
    projectId: number,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
  ): Promise<number> {
    const pageViews: Array<PageView> = await PageViewService.getPageViewsInPeriod(projectId, period)
    return pageViews.length
  }

  /**
   * Retrieves the average visit duration for a specified project within a given time period.
   *
   * @param {number} projectId - The ID of the project.
   * @param {Object} [period] - The time period to consider. If not provided, the entire project history will be used.
   * @param {DateTime} period.startAt - The start date of the time period.
   * @param {DateTime} period.endAt - The end date of the time period.
   * @returns {Promise<number>} - The average visit duration, in seconds.
   */
  public static async getAverageVisitDuration(
    projectId: number,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
  ): Promise<number> {
    const pageViews: Array<PageView> = await PageViewService.getPageViewsInPeriod(projectId, period)
    const totalDuration: number = pageViews.reduce((acc: number, pageView: PageView) => {
      return acc + pageView.duration
    }, 0)
    return roundToTwoDecimals(totalDuration / pageViews.length)
  }

  /**
   * Retrieves the number of bounce visits for a given project and time period.
   *
   * @param {number} projectId - The ID of the project.
   * @param {Object} [period] - An optional object specifying the start date and end date of the period.
   * @param {DateTime} period.startAt - The start date of the time period.
   * @param {DateTime} period.endAt - The end date of the time period.
   * @returns {Promise<number>} The number of bounce visits.
   */
  public static async getNumberOfBounceVisits(
    projectId: number,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
  ): Promise<number> {
    const pageViews: Array<PageView> = await PageViewService.getPageViewsInPeriod(projectId, period)

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
   *
   * @param {number} projectId - The ID of the project.
   * @param {Object} [period] - The period for which to calculate the bounce rate.
   * @param {DateTime} period.startAt - The start date and time of the period.
   * @param {DateTime} period.endAt - The end date and time of the period.
   * @return {Promise<number>} The calculated bounce rate as a decimal value.
   */
  public static async getBounceRate(
    projectId: number,
    period?: {
      startAt: DateTime
      endAt: DateTime
    }
  ): Promise<number> {
    const totalSessions: number = await this.getTotalSessions(projectId, period)
    const bounceVisits: number = await this.getNumberOfBounceVisits(projectId, period)

    return calculatePercentage(bounceVisits, totalSessions)
  }
}

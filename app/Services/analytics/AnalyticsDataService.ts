import VisitorService from 'App/Services/VisitorService'
import VisitorEventService from 'App/Services/VisitorEventService'
import SessionService from 'App/Services/SessionService'
import { DateTime } from 'luxon'
import Visitor from 'App/Models/Visitor'
import Session from 'App/Models/Session'
import VisitorEvent from 'App/Models/VisitorEvent'

export type Metrics = {
  uniqueVisitors: number
  totalPageViews: number
  viewPerVisit: number
  bounceRate: number
  avgVisitDuration: number
}

export default class AnalyticsDataService {
  public static async getMetrics(
    projectId: number,
    startAt: DateTime,
    endAt: DateTime
  ): Promise<Metrics> {
    const uniqueVisitors: Array<Visitor> = await this.getUniqueVisitors(projectId, startAt, endAt)
    const projectVisitorEvents: Array<VisitorEvent> = await this.getVisitorEvents(
      projectId,
      startAt,
      endAt
    )

    const totalPageViews: number = projectVisitorEvents.length

    const viewPerVisit: number = this.roundToTwoDecimals(
      totalPageViews / uniqueVisitors.length || 0
    )
    const bounceRate: number = await this.getBounceRate(uniqueVisitors, startAt, endAt)
    const avgVisitDuration: number = await this.getAverageVisitDuration(projectId, startAt, endAt)

    return {
      uniqueVisitors: uniqueVisitors.length,
      totalPageViews,
      viewPerVisit,
      bounceRate,
      avgVisitDuration,
    }
  }

  private static async getUniqueVisitors(
    projectId: number,
    startAt: DateTime,
    endAt: DateTime
  ): Promise<Array<Visitor>> {
    return await VisitorService.getVisitorsByProjectId(projectId, { startAt, endAt })
  }

  private static async getVisitorEvents(
    projectId: number,
    startAt: DateTime,
    endAt: DateTime
  ): Promise<Array<VisitorEvent>> {
    return await VisitorEventService.getVisitorEventsByProjectId(projectId, { startAt, endAt })
  }

  private static async getBounceRate(
    uniqueVisitors: Array<Visitor>,
    startAt: DateTime,
    endAt: DateTime
  ): Promise<number> {
    let bounceVisitors: number = 0
    for (const visitor of uniqueVisitors) {
      const visitorEvents: Array<VisitorEvent> = await VisitorEventService.getByVisitorId(
        visitor.id,
        { startAt, endAt }
      )
      if (visitorEvents.length === 1) {
        bounceVisitors++
      }
    }
    return this.calculatePercentage(bounceVisitors, uniqueVisitors.length)
  }

  private static async getAverageVisitDuration(
    projectId: number,
    startAt: DateTime,
    endAt: DateTime
  ): Promise<number> {
    // Implementation for calculating average visit duration
    const sessions: Array<Session> = await SessionService.getByProjectId(projectId, {
      startAt,
      endAt,
    })
    const totalVisitDuration: number = sessions.reduce(
      (sum: number, session: Session) => sum + (session.visitDuration || 0),
      0
    )
    return this.roundToTwoDecimals(sessions.length ? totalVisitDuration / sessions.length : 0)
  }

  private static roundToTwoDecimals(num: number): number {
    return Math.round(num * 100) / 100
  }

  private static calculatePercentage(part: number, whole: number): number {
    return (part / whole) * 100
  }
}

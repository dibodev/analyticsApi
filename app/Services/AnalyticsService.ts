import SocketIoService from 'App/Services/SocketIoService'
import ProjectsService from 'App/Services/ProjectsService'
import { DateTime, Duration } from 'luxon'
import Project from 'App/Models/Project'
import VisitorService from 'App/Services/VisitorService'
import VisitorEventService from 'App/Services/VisitorEventService'
import Visitor from 'App/Models/Visitor'
import type { Period } from 'App/Types/DateTypes'
import SessionService from 'App/Services/SessionService'
import {
  calculatePercentage,
  calculatePercentageDifference,
  roundToTwoDecimals,
} from 'App/Utils/NumberUtils'

interface TopStats {
  name: string
  value: number
  comparison_value?: number
  change?: number
}

export default class AnalyticsService {
  private static realtimeVisitors = new Map<string, Set<string>>()

  public static async getStats({
    domain,
    period,
    endAt,
  }: {
    domain: string
    period?: string
    endAt: DateTime
  }) {
    const project = await ProjectsService.getByDomain(domain)
    const startAt = this.getStartAt(period, endAt, project)
    const topStats = await this.getTopStats(project, startAt, endAt)
    return {
      topStats,
    }
  }

  private static async getTopStats(project: Project, startAt: DateTime, endAt: DateTime) {
    const topStats: TopStats[] = []

    const stats = await this.getMetrics(project.id, startAt, endAt)
    const comparisonStats = await this.getMetrics(
      project.id,
      startAt.minus(Duration.fromMillis(endAt.diff(startAt).milliseconds)),
      endAt.minus(Duration.fromMillis(endAt.diff(startAt).milliseconds))
    )

    this.pushToTopStats(
      topStats,
      'Visiteurs uniques',
      stats.uniqueVisitors,
      comparisonStats.uniqueVisitors
    )
    this.pushToTopStats(
      topStats,
      'Total de pages vues',
      stats.totalPageViews,
      comparisonStats.totalPageViews
    )
    this.pushToTopStats(
      topStats,
      'Vues par visite',
      stats.viewPerVisit,
      comparisonStats.viewPerVisit
    )
    this.pushToTopStats(topStats, 'Taux de rebond', stats.bounceRate, comparisonStats.bounceRate)
    this.pushToTopStats(
      topStats,
      'Durée moyenne de visite',
      stats.avgVisitDuration,
      comparisonStats.avgVisitDuration
    )

    return topStats
  }

  private static pushToTopStats(
    topStats: TopStats[],
    name: string,
    value: number,
    comparisonValue: number
  ) {
    topStats.push({
      name: name,
      value: value,
      comparison_value: comparisonValue,
      change: calculatePercentageDifference(value, comparisonValue),
    })
  }

  private static async getMetrics(projectId: number, startAt: DateTime, endAt: DateTime) {
    const uniqueVisitors = await this.getUniqueVisitors(projectId, startAt, endAt)
    const totalPageViews = await this.getVisitorEvents(projectId, startAt, endAt)
    const viewPerVisit = roundToTwoDecimals(totalPageViews.length / uniqueVisitors.length || 0)
    const bounceRate = await this.getBounceRate(uniqueVisitors, startAt, endAt)
    const avgVisitDuration = await this.getAverageVisitDuration(projectId, { startAt, endAt })

    return {
      uniqueVisitors: uniqueVisitors.length,
      totalPageViews: totalPageViews.length,
      viewPerVisit,
      bounceRate,
      avgVisitDuration,
    }
  }

  private static async getAverageVisitDuration(projectId: number, { startAt, endAt }: Period) {
    const sessions = await SessionService.getByProjectId(projectId, { startAt, endAt })

    const totalVisitDuration = sessions.reduce(
      (sum, session) => sum + (session.visitDuration || 0),
      0
    )
    return sessions.length ? totalVisitDuration / sessions.length : 0
  }

  private static async getBounceRate(
    uniqueVisitors: Visitor[],
    startAt: DateTime,
    endAt: DateTime
  ) {
    if (uniqueVisitors.length === 0) {
      return 0
    }

    let bounceVisitors = 0

    for (let visitor of uniqueVisitors) {
      const visitorEvents = await VisitorEventService.getByVisitorId(visitor.id, { startAt, endAt })
      if (visitorEvents.length === 1) {
        bounceVisitors++
      }
    }

    return calculatePercentage(bounceVisitors, uniqueVisitors.length)
  }

  private static async getUniqueVisitors(projectId: number, startAt: DateTime, endAt: DateTime) {
    return await VisitorService.getVisitorsByProjectId(projectId, {
      startAt,
      endAt,
    })
  }

  private static async getVisitorEvents(projectId: number, startAt: DateTime, endAt: DateTime) {
    return await VisitorEventService.getVisitorEventsByProjectId(projectId, {
      startAt,
      endAt,
    })
  }

  private static getStartAt(
    period: string | undefined,
    endDate: DateTime,
    project: Project
  ): DateTime {
    if (period) {
      if (period === 'all') {
        // Si la période est 'all', la date de début doit être la date de création du projet
        return project.createdAt
      }
      // Si la période est de la forme '7d', '30d', etc.
      const match = period.match(/^(\d+)([a-z])$/)

      if (match) {
        const value = parseInt(match[1])
        const unit = match[2] === 'd' ? 'days' : 'unknown'

        if (unit !== 'unknown') {
          // Si c'est un nombre de jours, soustraire ce nombre de jours de la date de fin pour obtenir la date de début
          return endDate.minus(Duration.fromObject({ [unit]: value }))
        }
      }
    }

    // Si la période n'est pas valide, on utilise par défaut une période de 30 jours
    return endDate.minus({ days: 30 })
  }

  public static addVisitor(domain: string, visitorId: string) {
    let visitors = this.realtimeVisitors.get(domain)

    if (!visitors) {
      visitors = new Set<string>()
      this.realtimeVisitors.set(domain, visitors)
    }

    visitors.add(visitorId)
  }

  public static removeVisitor(domain: string, visitorId: string) {
    const visitors = this.realtimeVisitors.get(domain)

    if (visitors) {
      visitors.delete(visitorId)
    }
  }

  public static getVisitorCountForProject(domain: string): number {
    const visitors = this.realtimeVisitors.get(domain)
    return visitors ? visitors.size : 0
  }

  public static emitVisitorCountForProject(domain: string) {
    const count = this.getVisitorCountForProject(domain)
    SocketIoService.io.to(domain).emit('visitorCount', count)
  }
}

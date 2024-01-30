import { DateTime, Duration } from 'luxon'
import Project from 'App/Models/Project'
import ProjectsService from 'App/Services/ProjectsService'
import AnalyticsDataService from 'App/Services/analytics/AnalyticsDataService'
import type { Metrics } from 'App/Services/analytics/AnalyticsDataService'
import AnalyticsUtilityService from 'App/Services/analytics/AnalyticsUtilityService'

export type TopStats = {
  name: string
  value: number
  comparison_value: number
  change: number
}

export default class AnalyticsHistoricalService {
  public static async getStats({
    domain,
    period,
    endAt,
  }: {
    domain: string
    period?: string
    endAt: DateTime
  }): Promise<Array<TopStats>> {
    const project: Project = await ProjectsService.getByDomain(domain)
    const startAt: DateTime = this.getStartAt(period, endAt, project)
    return await this.getTopStats(project, startAt, endAt)
  }

  private static async getTopStats(
    project: Project,
    startAt: DateTime,
    endAt: DateTime
  ): Promise<Array<TopStats>> {
    const topStats: Array<TopStats> = []

    const stats: Metrics = await AnalyticsDataService.getMetrics(project.id, startAt, endAt)
    const comparisonStats: Metrics = await AnalyticsDataService.getMetrics(
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
    topStats: Array<TopStats>,
    name: string,
    value: number,
    comparisonValue: number
  ): void {
    topStats.push({
      name,
      value,
      comparison_value: comparisonValue,
      change: AnalyticsUtilityService.calculatePercentageDifference(value, comparisonValue),
    })
  }

  private static getStartAt(
    period: string | undefined,
    endDate: DateTime,
    project: Project
  ): DateTime {
    if (period) {
      if (period === 'all') {
        return project.createdAt
      }
      const match: RegExpMatchArray | null = period.match(/^(\d+)([a-z])$/)
      if (match) {
        const value: number = parseInt(match[1])
        const unit: 'days' | 'unknown' = match[2] === 'd' ? 'days' : 'unknown'
        if (unit !== 'unknown') {
          return endDate.minus(Duration.fromObject({ [unit]: value }))
        }
      }
    }
    return endDate.minus({ days: 30 })
  }
}

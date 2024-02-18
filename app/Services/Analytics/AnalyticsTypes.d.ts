import { DateTime } from 'luxon'

export type OverviewMetrics = {
  uniqueVisitors: number
  uniqueSessions: number
  totalSessions: number
  totalViews: number
  viewsPerVisit: number
  avgVisitDuration: number
  bounceRate: number
}

export type AnalyticsPeriod = {
  startAt: DateTime
  endAt: DateTime
}

export type AnalyticsViewsPayload = {
  period?: AnalyticsPeriod
}

export type AnalyticsProjectViewsPayload = {
  projectId: number
  period?: AnalyticsPeriod
}

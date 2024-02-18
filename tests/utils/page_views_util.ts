import VisitorIp from 'App/Models/VisitorIp'
import { faker } from '@faker-js/faker'
import Visitor from 'App/Models/Visitor'
import Page from 'App/Models/Page'
import PageView from 'App/Models/PageView'
import { DateTime } from 'luxon'
import type { DurationLike } from 'luxon/src/duration'
import Location from 'App/Models/Location'

/* TYPES */
export type Period = {
  startAt: DateTime
  endAt: DateTime
}

export type VisitorAndPageView = {
  visitorIp: VisitorIp
  visitor: Visitor
  page: Page
  pageView: PageView
}

export type VisitorAndPageViewPayload = {
  projectId: number
  sessionStartMinus?: DurationLike
  duration?: number
  visitorId?: number
}

/* UTILS FUNCTION */

/**
 * Simulate a visitor and a page view for a project.
 * @returns Promise<void>
 * @param projectId - The ID of the project.
 * @param sessionStartMinus - The duration to subtract from the current time to get the session start time.
 * @param duration - The duration of the page view in seconds.
 * @param visitorId - The ID of the visitor.
 */
export async function simulateVisitorAndPageView({
  projectId,
  sessionStartMinus = { minute: 10 },
  duration = 600,
  visitorId,
}: VisitorAndPageViewPayload): Promise<VisitorAndPageView> {
  const location: Location = await Location.create({
    city: faker.location.city(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  })

  const visitorIp: VisitorIp = await VisitorIp.create({
    ip: faker.internet.ip(),
    type: 'IPv4',
    locationId: location.id,
  })

  let visitor: Visitor | null = null

  if (visitorId) {
    visitor = await Visitor.find(visitorId)
  }

  if (!visitor) {
    visitor = await Visitor.create({
      visitorIpId: visitorIp.id,
      projectId,
    })
  }

  const page: Page = await Page.create({
    projectId,
    url: faker.internet.url(),
  })

  const pageView: PageView = await PageView.create({
    pageId: page.id,
    visitorId: visitor.id,
    sessionStart: DateTime.now().minus(sessionStartMinus).toFormat('yyyy-MM-dd HH:mm:ss'),
    duration,
  })

  return {
    visitorIp,
    visitor,
    page,
    pageView,
  }
}

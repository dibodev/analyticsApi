import VisitorIp from 'App/Models/VisitorIp'
import { faker } from '@faker-js/faker'
import Visitor from 'App/Models/Visitor'
import Page from 'App/Models/Page'
import PageView from 'App/Models/PageView'
import { DateTime } from 'luxon'

/* UTILS FUNCTION */

/**
 * Simulate a visitor and a page view for a project.
 * @returns Promise<void>
 * @param projectId
 */
export async function simulateVisitorAndPageView(projectId: number): Promise<void> {
  const visitorIp: VisitorIp = await VisitorIp.create({
    ip: faker.internet.ip(),
    type: 'IPv4',
  })

  const visitor: Visitor = await Visitor.create({
    visitorIpId: visitorIp.id,
    projectId,
  })

  const page: Page = await Page.create({
    projectId,
    url: faker.internet.url(),
  })

  await PageView.create({
    pageId: page.id,
    visitorId: visitor.id,
    sessionStart: DateTime.now().minus({ minutes: 10 }).toFormat('yyyy-MM-dd HH:mm:ss'),
  })
}

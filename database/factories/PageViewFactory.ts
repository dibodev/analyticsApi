import Factory from '@ioc:Adonis/Lucid/Factory'
import PageView from 'App/Models/PageView'
import Visitor from 'App/Models/Visitor'
import Page from 'App/Models/Page'
import UserAgent from 'App/Models/UserAgent'
import { DateTime } from 'luxon'

export default Factory.define(PageView, async ({ faker }) => {
  const visitors: Array<Visitor> = await Visitor.all()
  const pages: Array<Page> = await Page.all()
  const userAgents: Array<UserAgent> = await UserAgent.all()

  const sessionStart: string = DateTime.fromJSDate(faker.date.past()).toFormat(
    'yyyy-MM-dd HH:mm:ss'
  )
  const sessionEnd: string = DateTime.fromJSDate(faker.date.future()).toFormat(
    'yyyy-MM-dd HH:mm:ss'
  )

  return {
    visitorId: faker.helpers.arrayElement(visitors).id,
    pageId: faker.helpers.arrayElement(pages).id,
    userAgentId: faker.helpers.arrayElement(userAgents).id,
    sessionStart,
    sessionEnd,
    duration: faker.number.int({ min: 0, max: 3600 }),
    referrer: faker.internet.url(),
  }
}).build()

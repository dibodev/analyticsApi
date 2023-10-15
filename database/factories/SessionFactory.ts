import Session from 'App/Models/Session'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'
import Visitor from 'App/Models/Visitor'

export default Factory.define(Session, async ({ faker }) => {
  const visitorIds: number[] = (await Visitor.all()).map((visitor: Visitor) => visitor.id)
  const randomVisitorId: number = faker.helpers.arrayElement(visitorIds)

  return {
    active: faker.datatype.boolean(),
    sessionStart: DateTime.fromJSDate(faker.date.recent()),
    sessionEnd: DateTime.fromJSDate(faker.date.recent()),
    visitDuration: faker.number.int({ min: 1, max: 3000 }),
    visitorId: randomVisitorId,
  }
}).build()

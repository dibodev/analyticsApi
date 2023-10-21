import VisitorEvent from 'App/Models/VisitorEvent'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(VisitorEvent, async ({ faker }) => {
  const randomVisitorId: number = faker.number.int({ min: 1, max: 1800 })

  return {
    browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge', null]),
    os: faker.helpers.arrayElement(['Windows', 'macOS', 'Linux', 'Android', 'iOS', null]),
    url: faker.internet.url(),
    deviceType: faker.helpers.arrayElement(['Desktop', 'Mobile', 'Tablet', null]),
    referrer: faker.internet.url(),
    visitorId: randomVisitorId,
  }
}).build()

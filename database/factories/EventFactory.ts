import Factory from '@ioc:Adonis/Lucid/Factory'
import Event from 'App/Models/Event'
import PageView from 'App/Models/PageView'

export default Factory.define(Event, async ({ faker }) => {
  const pageViews: Array<PageView> = await PageView.all()

  return {
    pageViewId: faker.helpers.arrayElement(pageViews).id,
    eventType: faker.helpers.arrayElement(['click', 'submit', 'hover']),
    eventData: JSON.stringify({ clickId: faker.string.uuid(), value: faker.lorem.words(5) }),
  }
}).build()

import Factory from '@ioc:Adonis/Lucid/Factory'
import RealTimePageView from 'App/Models/RealTimePageView'
import PageView from 'App/Models/PageView'

export default Factory.define(RealTimePageView, async ({ faker }) => {
  const pageViews: Array<PageView> = await PageView.all()

  return {
    pageViewId: faker.helpers.arrayElement(pageViews).id,
    active: faker.datatype.boolean(),
  }
}).build()

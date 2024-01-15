import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import VisitorEventFactory from 'Database/factories/VisitorEventFactory'
import VisitorEvent from 'App/Models/VisitorEvent'

export default class extends BaseSeeder {
  public async run(): Promise<void> {
    const visitorEventsMax: number = 2000
    const visitorEvents: Array<VisitorEvent> = await VisitorEvent.all()
    if (visitorEvents.length < visitorEventsMax) {
      await VisitorEventFactory.createMany(visitorEventsMax)
    }
  }
}

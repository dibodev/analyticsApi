import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import EventFactory from 'Database/factories/EventFactory'

export default class EventSeeder extends BaseSeeder {
  public async run(): Promise<void> {
    const eventsMax: number = 60
    await EventFactory.createMany(eventsMax)
  }
}

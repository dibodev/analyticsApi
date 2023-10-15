import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import VisitorEventFactory from 'Database/factories/VisitorEventFactory'

export default class extends BaseSeeder {
  public async run() {
    await VisitorEventFactory.createMany(2000)
  }
}

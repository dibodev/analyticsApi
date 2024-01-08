import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import VisitorFactory from 'Database/factories/VisitorFactory'

export default class extends BaseSeeder {
  public async run() {
    await VisitorFactory.createMany(1800)
  }
}

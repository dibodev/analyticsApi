import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import VisitorFactory from 'Database/factories/VisitorFactory'

export default class VisitorSeeder extends BaseSeeder {
  public async run(): Promise<void> {
    const visitorsMax: number = 30
    await VisitorFactory.createMany(visitorsMax)
  }
}

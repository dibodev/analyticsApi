import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import VisitorFactory from 'Database/factories/VisitorFactory'
import Visitor from 'App/Models/Visitor'

export default class extends BaseSeeder {
  public async run(): Promise<void> {
    const visitorsMax: number = 1800
    const visitors: Array<Visitor> = await Visitor.all()
    if (visitors.length < visitorsMax) {
      await VisitorFactory.createMany(visitorsMax)
    }
  }
}

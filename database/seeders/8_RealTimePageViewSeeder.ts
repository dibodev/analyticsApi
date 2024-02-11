import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RealTimePageViewFactory from 'Database/factories/RealTimePageViewFactory'

export default class RealTimePageViewSeeder extends BaseSeeder {
  public async run(): Promise<void> {
    const realTimePageViewsMax: number = 40
    await RealTimePageViewFactory.createMany(realTimePageViewsMax)
  }
}

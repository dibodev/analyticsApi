import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PageViewFactory from 'Database/factories/PageViewFactory'

export default class PageViewSeeder extends BaseSeeder {
  public async run(): Promise<void> {
    const pageViewsMax: number = 100
    await PageViewFactory.createMany(pageViewsMax)
  }
}

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PageFactory from 'Database/factories/PageFactory'

export default class PageSeeder extends BaseSeeder {
  public async run(): Promise<void> {
    const pagesMax: number = 50
    await PageFactory.createMany(pagesMax)
  }
}

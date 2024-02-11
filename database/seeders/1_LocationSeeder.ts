import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import LocationFactory from 'Database/factories/LocationFactory'

export default class LocationSeeder extends BaseSeeder {
  public async run(): Promise<void> {
    const locationsMax: number = 20
    await LocationFactory.createMany(locationsMax)
  }
}

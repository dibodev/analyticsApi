import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import LocationFactory from 'Database/factories/LocationFactory'
import Location from 'App/Models/Location'

export default class extends BaseSeeder {
  public async run(): Promise<void> {
    const locationsMax: number = 20
    const locations: Array<Location> = await Location.all()
    if (locations.length < locationsMax) {
      await LocationFactory.createMany(locationsMax)
    }
  }
}

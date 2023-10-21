import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import LocationFactory from 'Database/factories/LocationFactory'

export default class extends BaseSeeder {
  public async run() {
    await LocationFactory.createMany(20)
  }
}

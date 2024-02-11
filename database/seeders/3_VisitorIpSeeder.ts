import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import VisitorIpFactory from 'Database/factories/VisitorIpFactory'

export default class VisitorIpSeeder extends BaseSeeder {
  public async run(): Promise<void> {
    const visitorIpsMax: number = 25
    await VisitorIpFactory.createMany(visitorIpsMax)
  }
}

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserAgentFactory from 'Database/factories/UserAgentFactory'

export default class UserAgentSeeder extends BaseSeeder {
  public async run(): Promise<void> {
    const userAgentsMax: number = 15
    await UserAgentFactory.createMany(userAgentsMax)
  }
}

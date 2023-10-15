import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import SessionFactory from 'Database/factories/SessionFactory'

export default class extends BaseSeeder {
  public async run() {
    await SessionFactory.createMany(50)
  }
}

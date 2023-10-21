import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ProjectFactory from 'Database/factories/ProjectFactory'

export default class extends BaseSeeder {
  public async run() {
    await ProjectFactory.createMany(10)
  }
}

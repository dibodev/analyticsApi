import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ProjectFactory from 'Database/factories/ProjectFactory'

export default class ProjectSeeder extends BaseSeeder {
  public async run(): Promise<void> {
    const projectsMax: number = 10
    await ProjectFactory.createMany(projectsMax)
  }
}

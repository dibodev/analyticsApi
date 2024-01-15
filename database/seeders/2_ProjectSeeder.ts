import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ProjectFactory from 'Database/factories/ProjectFactory'
import Project from 'App/Models/Project'

export default class extends BaseSeeder {
  public async run(): Promise<void> {
    const projectsMax: number = 10
    const projects: Array<Project> = await Project.all()
    if (projects.length < projectsMax) {
      await ProjectFactory.createMany(projectsMax)
    }
  }
}

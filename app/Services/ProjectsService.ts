import Project from 'App/Models/Project'
import DomainService from 'App/Services/DomainService'
import VisitorService from 'App/Services/VisitorService'

export default class ProjectsService {
  public static async getAll(): Promise<Project[]> {
    return await Project.all()
  }

  public static async getById(id: number): Promise<Project> {
    return await Project.findOrFail(id)
  }

  public static async getByDomain(domain: string): Promise<Project> {
    return await Project.query().where('domain', domain).firstOrFail()
  }

  public static async getAllWithVisitorCount(): Promise<
    { project: Project; visitorLast24Hours: number }[]
  > {
    const projects = await this.getAll()

    return await Promise.all(
      projects.map(async (project) => {
        const visitorLast24Hours = await VisitorService.getVisitorCountLast24Hours(project.id)
        return { project, visitorLast24Hours }
      })
    )
  }

  public static async create(domain: string): Promise<Project> {
    try {
      const favicon: string | null = await DomainService.uploadDomainFavicon(domain)
      const project = await Project.create({ domain, favicon })
      return await Project.findOrFail(project.id)
    } catch (error) {
      console.error('Error retrieving favicon:', error)
      const project = await Project.create({ domain })
      return await Project.findOrFail(project.id)
    }
  }

  public static async update(id: number, domain?: string): Promise<Project> {
    const project = await Project.findOrFail(id)
    if (domain) {
      project.domain = domain

      try {
        project.favicon = await DomainService.uploadDomainFavicon(domain)
      } catch (error) {
        project.favicon = null
        console.error('Error retrieving favicon:', error)
      }
    }

    await project.save()

    return project
  }

  public static async delete(id: number): Promise<void> {
    const project = await Project.findOrFail(id)
    await project.delete()
  }
}

import Project from 'App/Models/Project'
import DomainService from 'App/Services/DomainService'
import VisitorService from 'App/Services/VisitorService'

export default class ProjectsService {
  public static async getAll() {
    return await Project.all()
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

  public static async create(domain: string) {
    try {
      const favicon = await DomainService.uploadDomainFavicon(domain)
      return await Project.create({ domain, favicon })
    } catch (error) {
      console.error('Error retrieving favicon:', error)
      return await Project.create({ domain })
    }
  }

  public static async getById(id: number) {
    return await Project.findOrFail(id)
  }

  public static async update(id: number, domain?: string) {
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

  public static async delete(id: number) {
    const project = await Project.findOrFail(id)
    await project.delete()
  }
}

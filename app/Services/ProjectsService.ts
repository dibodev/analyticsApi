import Project from 'App/Models/Project'
import UploadService from 'App/Services/UploadService'
import DomainService from 'App/Services/DomainService'

export default class ProjectsService {
  public static async getAll() {
    return await Project.all()
  }

  public static async create(domain: string, name: string) {
    try {
      const { favicon, contentType } = await DomainService.getDomainFavicon(domain)
      if (favicon) {
        const domainName = DomainService.getDomaineName(domain)
        await UploadService.uploadImage(favicon, contentType, domainName)
      }
      return await Project.create({ domain, name })
    } catch (error) {
      console.error('Error retrieving favicon:', error)
      return await Project.create({ domain, name })
    }
  }

  public static async getById(id: number) {
    return await Project.findOrFail(id)
  }

  public static async update(id: number, domain?: string, name?: string) {
    const project = await Project.findOrFail(id)
    if (name) project.name = name
    if (domain) project.domain = domain
    await project.save()

    return project
  }

  public static async delete(id: number) {
    const project = await Project.findOrFail(id)
    await project.delete()
  }
}

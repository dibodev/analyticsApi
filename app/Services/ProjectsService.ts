import Project from 'App/Models/Project'
import axios from 'axios'
import UploadService from 'App/Services/UploadService'

export default class ProjectsService {
  public static async getAll() {
    return await Project.all()
  }

  public static async create(domain: string, name: string) {
    const faviconUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`
    const response = await axios.get(faviconUrl)
    await UploadService.uploadFile(response.data.file)
    return await Project.create({ domain, name })
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

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProjectsService from 'App/Services/ProjectsService'
import CreateProjectValidator from 'App/Validators/CreateProjectValidator'
import UpdateProjectValidator from 'App/Validators/UpdateProjectValidator'
import Project from 'App/Models/Project'

export default class ProjectsController {
  protected async index({}: HttpContextContract): Promise<
    { project: Project; visitorLast24Hours: number }[]
  > {
    return await ProjectsService.getAllWithVisitorCount()
  }

  protected async store({ request }: HttpContextContract): Promise<Project> {
    const { domain }: { domain: string } = await request.validate(CreateProjectValidator)
    return await ProjectsService.create(domain)
  }

  protected async show({ params }: HttpContextContract): Promise<Project> {
    return await ProjectsService.getById(params.id)
  }

  protected async update({ params, request }: HttpContextContract): Promise<Project> {
    const { domain }: { domain?: string } = await request.validate(UpdateProjectValidator)
    return await ProjectsService.update(params.id, domain)
  }

  protected async destroy({ params, response }: HttpContextContract) {
    await ProjectsService.delete(params.id)
    return response.status(204)
  }
}

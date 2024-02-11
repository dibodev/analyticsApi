import ProjectService from 'App/Services/ProjectService'
import CreateProjectValidator from 'App/Validators/CreateProjectValidator'
import UpdateProjectValidator from 'App/Validators/UpdateProjectValidator'
import Project from 'App/Models/Project'
import type { ResponseContract } from '@ioc:Adonis/Core/Response'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { ProjectWithUniqueVisitorCountLast24Hours } from 'App/Services/ProjectService'
import type { CreateProjectSchema } from 'App/Validators/CreateProjectValidator'
import type { UpdateProjectSchema } from 'App/Validators/UpdateProjectValidator'

export default class ProjectsController {
  protected async index({}: HttpContextContract): Promise<
    Array<ProjectWithUniqueVisitorCountLast24Hours>
  > {
    return await ProjectService.getAllWithVisitorCount()
  }

  protected async show({ params }: HttpContextContract): Promise<Project> {
    return await ProjectService.getById(params.id)
  }

  protected async store({ request }: HttpContextContract): Promise<Project> {
    const { domain }: CreateProjectSchema = await request.validate(CreateProjectValidator)
    return await ProjectService.create(domain)
  }

  protected async update({ params, request }: HttpContextContract): Promise<Project> {
    const { domain }: UpdateProjectSchema = await request.validate(UpdateProjectValidator)
    return await ProjectService.update(params.id, domain)
  }

  protected async destroy({ params, response }: HttpContextContract): Promise<ResponseContract> {
    await ProjectService.delete(params.id)
    return response.status(204)
  }
}

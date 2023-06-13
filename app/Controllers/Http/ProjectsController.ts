import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProjectsService from 'App/Services/ProjectsService'
import CreateProjectValidator from 'App/Validators/CreateProjectValidator'
import UpdateProjectValidator from 'App/Validators/UpdateProjectValidator'

export default class ProjectsController {
  protected async index({}: HttpContextContract) {
    return await ProjectsService.getAllWithVisitorCount()
  }

  protected async store({ request }: HttpContextContract) {
    const { domain } = await request.validate(CreateProjectValidator)
    return await ProjectsService.create(domain)
  }

  protected async show({ params }: HttpContextContract) {
    return await ProjectsService.getById(params.id)
  }

  protected async update({ params, request }: HttpContextContract) {
    const { domain } = await request.validate(UpdateProjectValidator)
    return await ProjectsService.update(params.id, domain)
  }

  protected async destroy({ params, response }: HttpContextContract) {
    await ProjectsService.delete(params.id)
    return response.status(204)
  }
}

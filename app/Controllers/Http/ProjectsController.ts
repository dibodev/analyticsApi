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
  /**
   * Retrieves all projects with their unique visitor count in the last 24 hours.
   *
   * @param {HttpContextContract} ctx - The HTTP context of the request.
   * @return {Promise<Array<ProjectWithUniqueVisitorCountLast24Hours>>} - An array of projects with their unique visitor count in the last 24 hours.
   */
  protected async index({}: HttpContextContract): Promise<
    Array<ProjectWithUniqueVisitorCountLast24Hours>
  > {
    return await ProjectService.getAllWithVisitorCount()
  }

  /**
   * Retrieves a project based on the provided ID.
   *
   * @async
   * @param {Object} params - The parameters object containing the project ID.
   * @param {HttpContextContract} response - The response object used to send HTTP responses.
   * @returns {Promise<Project>} - A promise that resolves to the retrieved project.
   * @throws {Error} - If the project with the provided ID is not found.
   */
  protected async show({ params, response }: HttpContextContract): Promise<Project> {
    const project: Project | null = await ProjectService.findById(params.id)
    if (!project) {
      const errorMessage: string = 'Project not found'
      response.status(404).send({ message: errorMessage })
      throw new Error(errorMessage)
    }
    return project
  }

  /**
   * Store a new project.
   *
   * @param {HttpContextContract} request - The HTTP Context Contract object containing the request.
   * @returns {Promise<Project>} - Returns a Promise that resolves with the created Project.
   */
  protected async store({ request }: HttpContextContract): Promise<Project> {
    const { domain }: CreateProjectSchema = await request.validate(CreateProjectValidator)
    return await ProjectService.create(domain)
  }

  /**
   * Updates a project.
   *
   * @param {HttpContextContract} ctx - The HTTP context contract.
   * @param {Object} ctx.params - The parameter object.
   * @param {Object} ctx.request - The request object.
   * @return {Promise<Project>} - The updated project object.
   */
  protected async update({ params, request }: HttpContextContract): Promise<Project> {
    const { domain }: UpdateProjectSchema = await request.validate(UpdateProjectValidator)
    return await ProjectService.update(params.id, domain)
  }

  /**
   * Destroys a project.
   *
   * @param {object} context - The HTTP context object containing the request parameters and response.
   * @param {object} context.params - The request parameters.
   * @param {object} context.response - The HTTP response object.
   * @returns {Promise} A promise that resolves to a response object with a 204 status code.
   */
  protected async destroy({ params, response }: HttpContextContract): Promise<ResponseContract> {
    await ProjectService.delete(params.id)
    return response.status(204)
  }
}

import Project from 'App/Models/Project'
import DomainService from 'App/Services/DomainService'
import Visitor from 'App/Models/Visitor'
import AnalyticsViewsService from 'App/Services/Analytics/AnalyticsViewsService'
import { DateTime } from 'luxon'
import NotFoundException from 'App/Exceptions/NotFoundException'

export type ProjectWithUniqueVisitorCountLast24Hours = {
  project: Project
  nbUniqueVisitorLast24Hours: number
}

export default class ProjectService {
  /**
   * Retrieves all the projects.
   *
   * @returns {Promise<Array<Project>>} A Promise that resolves to an array of Project objects.
   */
  public static async getAll(): Promise<Array<Project>> {
    return await Project.all()
  }

  /**
   * Retrieves a project by its ID.
   * @param {number} id - Project ID
   * @returns {Promise<Project>} - Promise that resolves with the retrieved project.
   */
  public static async findById(id: number): Promise<Project | null> {
    return await Project.query().where('id', id).first()
  }

  /**
   * Retrieves visitors for a project by its ID.
   * @param id - Project ID
   * @returns Promise<Visitor[]>
   */
  public static async getVisitors(id: number): Promise<Array<Visitor>> {
    const projectsWithVisitors: Project = await Project.query()
      .where('id', id)
      .preload('visitors')
      .firstOrFail()

    return projectsWithVisitors.visitors
  }

  /**
   * Find or create a Project by domain.
   *
   * @param {string} domain - The domain to find or create the Project for.
   * @returns {Promise<Project>} - A Promise that resolves to a Project.
   * @throws {Error} - If an error occurs during the operation.
   */
  public static async findOrCreateByDomain(domain: string): Promise<Project> {
    try {
      return await this.getByDomain(domain)
    } catch (error) {
      if (error instanceof NotFoundException) {
        return await this.create(domain)
      }
      throw error
    }
  }

  /**
   * Retrieves a project by its domain.
   *
   **/
  public static async getByDomain(domain: string): Promise<Project> {
    const project: Project | null = await Project.findBy('domain', domain)

    if (!project) {
      throw new NotFoundException(`Project with domain ${domain} not found.`)
    }

    return project
  }

  /**
   * Retrieves all projects with the number of unique visitors in the last 24 hours.
   * @returns Promise<ProjectWithUniqueVisitorCountLast24Hours[]>
   */
  public static async getAllWithVisitorCount(): Promise<
    Array<ProjectWithUniqueVisitorCountLast24Hours>
  > {
    const projects: Array<Project> = await this.getAll()

    return Promise.all(
      projects.map(async (project: Project): Promise<ProjectWithUniqueVisitorCountLast24Hours> => {
        const periodOf24HoursAgo: {
          startAt: DateTime
          endAt: DateTime
        } = {
          startAt: DateTime.now().minus({ hours: 24 }),
          endAt: DateTime.now(),
        }
        const nbUniqueVisitorLast24Hours: number =
          await AnalyticsViewsService.getUniqueViewsOfProject({
            projectId: project.id,
            period: periodOf24HoursAgo,
          })

        return { project, nbUniqueVisitorLast24Hours }
      })
    )
  }

  /**
   * Creates a project.
   * @param domain - Project domain
   * @returns Promise<Project>
   */
  public static async create(domain: string): Promise<Project> {
    try {
      const favicon: string | null = await DomainService.uploadDomainFavicon(domain)
      const project: Project = await Project.create({ domain, favicon })
      return await Project.findOrFail(project.id)
    } catch (error) {
      console.error('Error retrieving favicon:', error)
      const project: Project = await Project.create({ domain })
      return await Project.findOrFail(project.id)
    }
  }

  /**
   * Updates a project by its ID.
   * @param id - Project ID
   * @param domain - Project domain
   * @returns Promise<Project>
   */
  public static async update(id: number, domain: string): Promise<Project> {
    const project: Project = await Project.findOrFail(id)

    project.domain = domain

    try {
      project.favicon = await DomainService.uploadDomainFavicon(domain)
    } catch (error) {
      project.favicon = null
      console.error('Error retrieving favicon:', error)
    }

    await project.save()

    return project
  }

  /**
   * Deletes a project by its ID.
   * @param id - Project ID
   */
  public static async delete(id: number): Promise<void> {
    const project: Project = await Project.findOrFail(id)
    await project.delete()
  }
}

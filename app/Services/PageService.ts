import Page from 'App/Models/Page'
import ProjectService from 'App/Services/ProjectService'
import Project from 'App/Models/Project'

export type PagePayload = {
  url: string
  endpoint?: string
  projectId: number
}

export default class PageService {
  /**
   * Retrieves pages by project ID
   * @param {number} projectId - The ID of the project
   * @return {Promise<Array<Page>>} A promise that resolves to an array of pages
   */
  public static async getPagesByProjectId(projectId: number): Promise<Array<Page>> {
    return Page.query().where('project_id', projectId)
  }
  /**
   * Retrieves an array of page IDs based on the given project ID.
   *
   * @async
   * @param {number} projectId - The ID of the project.
   * @return {Promise<Array<number>>} - A Promise that resolves to an array of page IDs.
   */
  public static async getPageIdsByProjectId(projectId: number): Promise<Array<number>> {
    const pages: Array<Page> = await this.getPagesByProjectId(projectId)
    return pages.map((page: Page) => page.id)
  }

  /**
   * Finds or creates a page by the URL.
   *
   * @param {number} projectId - The ID of the project.
   * @param {PagePayload} pagePayload - The payload containing the page data.
   * @return {Promise<Page>} - A promise that resolves to the found or created page.
   */
  public static async findOrCreateByUrl(
    projectId: number,
    pagePayload: PagePayload
  ): Promise<Page> {
    let page: Page | null = await this.findByUrl(projectId, pagePayload.url)
    if (!page) {
      page = await this.create(pagePayload)
    }
    return page
  }

  /**
   * Find a page by project ID and URL.
   *
   * @param {number} projectId - The project ID.
   * @param {string} url - The page URL.
   * @return {Promise<Page | null>} - A promise that resolves with the found page, or null if not found.
   */
  public static findByUrl(projectId: number, url: string): Promise<Page | null> {
    return Page.query().where('project_id', projectId).where('url', url).first()
  }

  /**
   * Create a new page record.
   *
   * @param {PagePayload} pagePayload - The payload containing page data.
   * @returns {Promise<Page>} - A promise that resolves to the created page record.
   * @throws {Error} - If the project does not exist.
   */
  public static async create(pagePayload: PagePayload): Promise<Page> {
    // verify if project exists
    const project: Project | null = await ProjectService.findById(pagePayload.projectId)
    if (!project) {
      throw new Error('Project not found for creating page record')
    }
    return Page.create(pagePayload)
  }
}

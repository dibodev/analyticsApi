import Page from 'App/Models/Page'

export default class PageService {
  public static async getPagesByProjectId(projectId: number): Promise<Array<Page>> {
    return Page.query().where('project_id', projectId)
  }
  public static async getPageIdsByProjectId(projectId: number): Promise<Array<number>> {
    const pages: Array<Page> = await this.getPagesByProjectId(projectId)
    return pages.map((page: Page) => page.id)
  }
}

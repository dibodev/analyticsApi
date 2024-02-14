import Visitor from 'App/Models/Visitor'

export default class VisitorService {
  /**
   * Finds a Visitor by visitor ID.
   *
   * @param {string} visitorId - The ID of the visitor.
   * @return {Promise<Visitor|null>} A Promise that resolves with the found Visitor object or null if not found.
   */
  public static async findByVisitorId(visitorId: string): Promise<Visitor | null> {
    return await Visitor.query().where('visitor_id', visitorId).first()
  }

  /**
   * Retrieves the visitor IDs for a given project ID.
   *
   * @param {number} projectId - The ID of the project.
   * @return {Promise<number[]>} - A promise that resolves to an array of visitor IDs.
   */
  public static async getVisitorIdsByProjectId(projectId: number): Promise<number[]> {
    const visitors: Array<Visitor> = await Visitor.query()
      .where('project_id', projectId)
      .select('id')
    return visitors.map((visitor) => visitor.id)
  }
}

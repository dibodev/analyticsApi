import Visitor from 'App/Models/Visitor'
import ProjectService from 'App/Services/ProjectService'
import Project from 'App/Models/Project'
import VisitorIpService from 'App/Services/VisitorIpService'
import VisitorIp from 'App/Models/VisitorIp'

export type CreateVisitorPayload = {
  visitorIpId?: number
  projectId: number
}

export default class VisitorService {
  /**
   * Finds or creates a visitor record by visitor IP ID.
   *
   * @param {number} projectId - The ID of the project.
   * @param {number} [visitorIpId] - The ID of the visitor IP (optional).
   *
   * @returns {Promise<Visitor>} The created or found visitor record.
   */
  public static async findOrCreateByVisitorIpId(
    projectId: number,
    visitorIpId?: number
  ): Promise<Visitor> {
    let visitor: Visitor | null = null

    if (visitorIpId) {
      visitor = await VisitorService.findByVisitorIpId(visitorIpId)
    }

    if (!visitor) {
      visitor = await VisitorService.create({
        visitorIpId,
        projectId,
      })
    }
    return visitor
  }

  /**
   * Finds a visitor by the provided visitor IP ID.
   *
   * @param {number} visitorIpId - The ID of the visitor IP.
   * @return {Promise<Visitor | null>} A promise that resolves to the found visitor or null if not found.
   */
  public static async findByVisitorIpId(visitorIpId: number): Promise<Visitor | null> {
    return await Visitor.query().where('visitor_ip_id', visitorIpId).first()
  }

  public static async findByIp(ip: string): Promise<Visitor | null> {
    const visitorIp: VisitorIp | null = await VisitorIpService.findByIp(ip)
    if (!visitorIp) {
      return null
    }
    return await VisitorService.findByVisitorIpId(visitorIp.id)
  }

  /**
   * Creates a new Visitor record.
   *
   * @param {CreateVisitorPayload} visitorPayload - The payload containing the data for creating a new Visitor.
   * @return {Promise<Visitor>} - A Promise that resolves to the created Visitor record.
   */
  public static async create(visitorPayload: CreateVisitorPayload): Promise<Visitor> {
    // verify if project exists
    const project: Project | null = await ProjectService.findById(visitorPayload.projectId)
    if (!project) {
      throw new Error('Project not found for creating visitor record.')
    }
    return await Visitor.create(visitorPayload)
  }

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

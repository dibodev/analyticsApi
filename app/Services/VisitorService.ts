import Visitor from 'App/Models/Visitor'
import LocationService from './LocationService'
import type { LocationPayload } from './LocationService'
import { DateTime } from 'luxon'
import ProjectService from 'App/Services/ProjectService'
import Location from 'App/Models/Location'
import Project from 'App/Models/Project'

export default class VisitorService {
  public static async findOrCreate(
    visitorId: string,
    domain: string,
    locationPayload: LocationPayload | null
  ): Promise<Visitor> {
    let visitor: Visitor | null = await this.findByVisitorId(visitorId)
    if (!visitor) {
      const location: Location | null = await LocationService.findOrCreate(locationPayload)

      visitor = await this.create(visitorId, domain, location?.id)
    }
    return visitor
  }
  public static async findByVisitorId(visitorId: string): Promise<Visitor | null> {
    return await Visitor.query().where('visitor_id', visitorId).first()
  }

  public static async create(
    visitorId: string,
    domain: string,
    locationId?: number
  ): Promise<Visitor> {
    const project: Project = await ProjectService.getByDomain(domain)
    if (!project) throw new Error('Project not found')
    return await Visitor.create({ visitorId, locationId, projectId: project.id })
  }

  public static async getVisitorIdsByProjectId(projectId: number): Promise<number[]> {
    const visitors: Array<Visitor> = await Visitor.query()
      .where('project_id', projectId)
      .select('id')
    return visitors.map((visitor) => visitor.id)
  }
}

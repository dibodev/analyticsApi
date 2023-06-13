import Visitor from 'App/Models/Visitor'
import LocationService from './LocationService'
import type { GeoLocation } from './LocationService'
import { DateTime } from 'luxon'

export default class VisitorService {
  public static async findOrCreate(visitorId: string, projectId: number, geo: GeoLocation | null) {
    let visitor = await this.findByVisitorId(visitorId)
    if (!visitor) {
      const location = await LocationService.findOrCreate(geo)

      visitor = await this.create(visitorId, projectId, location?.id)
    }
    return visitor
  }
  public static async findByVisitorId(visitorId: string) {
    return await Visitor.query().where('visitor_id', visitorId).first()
  }
  public static async create(visitorId: string, projectId: number, locationId?: number) {
    return await Visitor.create({ visitorId, locationId, projectId })
  }

  public static async getVisitorCountByProject(
    projectId: number,
    fromTime: DateTime,
    toTime: DateTime
  ): Promise<number> {
    const count = await Visitor.query()
      .where('project_id', projectId)
      .andWhere('created_at', '>=', fromTime.toString())
      .andWhere('created_at', '<=', toTime.toString())

    return count.length
  }

  public static async getVisitorCountLast24Hours(projectId: number): Promise<number> {
    const currentTime = DateTime.now()
    const past24Hours = currentTime.minus({ hours: 24 })

    return this.getVisitorCountByProject(projectId, past24Hours, currentTime)
  }
}

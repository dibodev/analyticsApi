import Visitor from 'App/Models/Visitor'
import LocationService from './LocationService'
import type { GeoLocation } from './LocationService'

export default class VisitorService {
  public static async findOrCreate(visitorId: string, geo: GeoLocation | null) {
    let visitor = await this.findByVisitorId(visitorId)
    if (!visitor) {
      const location = await LocationService.findOrCreate(geo)

      visitor = await this.create(visitorId, location?.id)
    }
    return visitor
  }
  public static async findByVisitorId(visitorId: string) {
    return await Visitor.query().where('visitor_id', visitorId).first()
  }
  public static async create(visitorId: string, locationId?: number) {
    return await Visitor.create({ visitorId, locationId })
  }
}

import Visitor from 'App/Models/Visitor'
import type { GeoLocation } from './LocationService'
import LocationService from './LocationService'
import { DateTime } from 'luxon'
import ProjectsService from 'App/Services/ProjectsService'
import crypto from 'crypto'

export default class VisitorService {
  public static async findOrCreate(visitorId: string, domain: string, geo: GeoLocation | null) {
    let visitor = await this.findByVisitorId(visitorId)
    if (!visitor) {
      const location = await LocationService.findOrCreate(geo)

      visitor = await this.create(visitorId, domain, location?.id)
    }
    return visitor
  }
  public static async findByVisitorId(visitorId: string) {
    return await Visitor.query().where('visitor_id', visitorId).first()
  }

  public static async getVisitorsByProjectId(
    projectId: number,
    period?: { startAt: DateTime; endAt: DateTime }
  ): Promise<Visitor[]> {
    let visitors = Visitor.query().where('project_id', projectId)

    if (period) {
      // Set endAt to the end of the day
      const endOfDay = period.endAt.set({ hour: 23, minute: 59, second: 59 })
      visitors = visitors.whereBetween('createdAt', [
        period.startAt.toJSDate(),
        endOfDay.toJSDate(),
      ])
    }

    return visitors
  }
  public static async create(visitorId: string, domain: string, locationId?: number) {
    const project = await ProjectsService.getByDomain(domain)
    if (!project) throw new Error('Project not found')
    return await Visitor.create({ visitorId, locationId, projectId: project.id })
  }

  public static async getVisitorCountLast24Hours(projectId: number): Promise<number> {
    const currentTime = DateTime.now()
    const past24Hours = currentTime.minus({ hours: 24 })

    const visitors = await this.getVisitorsByProjectId(projectId, {
      startAt: past24Hours,
      endAt: currentTime,
    })

    return visitors.length
  }
  public static async generateVisitorId(
    salt: string,
    domain: string,
    clientIp: string,
    userAgent: string
  ): Promise<string> {
    return crypto
      .createHash('sha256')
      .update(`${salt}${domain}${clientIp}${userAgent}`)
      .digest('hex')
  }
}

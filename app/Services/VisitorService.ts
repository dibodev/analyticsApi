import Visitor from 'App/Models/Visitor'
import type { Lookup } from 'geoip-lite'
import LocationService from './LocationService'
import { DateTime } from 'luxon'
import ProjectsService from 'App/Services/ProjectsService'
import crypto from 'crypto'
import Location from 'App/Models/Location'
import Project from 'App/Models/Project'

export default class VisitorService {
  public static async findOrCreate(
    visitorId: string,
    domain: string,
    geo: Lookup | null
  ): Promise<Visitor> {
    let visitor: Visitor | null = await this.findByVisitorId(visitorId)
    if (!visitor) {
      const location: Location | null = await LocationService.findOrCreate(geo)

      visitor = await this.create(visitorId, domain, location?.id)
    }
    return visitor
  }
  public static async findByVisitorId(visitorId: string): Promise<Visitor | null> {
    return await Visitor.query().where('visitor_id', visitorId).first()
  }

  public static async getVisitorsByProjectId(
    projectId: number,
    period?: { startAt: DateTime; endAt: DateTime }
  ): Promise<Visitor[]> {
    let visitors = Visitor.query().where('project_id', projectId)

    if (period) {
      // Set endAt to the end of the day
      const endOfDay: DateTime = period.endAt.set({ hour: 23, minute: 59, second: 59 })
      visitors = visitors.whereBetween('createdAt', [
        period.startAt.toJSDate(),
        endOfDay.toJSDate(),
      ])
    }

    return visitors
  }
  public static async create(
    visitorId: string,
    domain: string,
    locationId?: number
  ): Promise<Visitor> {
    const project: Project = await ProjectsService.getByDomain(domain)
    if (!project) throw new Error('Project not found')
    return await Visitor.create({ visitorId, locationId, projectId: project.id })
  }

  public static async getVisitorCountLast24Hours(projectId: number): Promise<number> {
    const currentTime: DateTime = DateTime.now()
    const past24Hours: DateTime = currentTime.minus({ hours: 24 })

    const visitors: Visitor[] = await this.getVisitorsByProjectId(projectId, {
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

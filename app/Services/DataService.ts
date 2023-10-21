import VisitorService from 'App/Services/VisitorService'
import VisitorEventService from 'App/Services/VisitorEventService'
import DailySaltService from 'App/Services/DailySaltService'
import UAParser from 'ua-parser-js'
import type { UAParserInstance } from 'ua-parser-js'
import geoip from 'geoip-lite'
import type { Lookup } from 'geoip-lite'
import ProjectsService from 'App/Services/ProjectsService'
import AnalyticsService from 'App/Services/AnalyticsService'
import SessionService from 'App/Services/SessionService'
import Visitor from 'App/Models/Visitor'
import Session from 'App/Models/Session'
import VisitorEvent from 'App/Models/VisitorEvent'
import Project from 'App/Models/Project'

export interface EventData {
  userAgent: string
  url: string
  referrer: string | null
  domain: string
}

export interface VisitorData {
  visitorId: string
  event: VisitorEvent
  session: Session
  browserName: string | null
  osName: string | null
  deviceType: string
  geo: Lookup
  referrer: string | null
  url: string
}

export default class DataService {
  public static async collectVisitorData(clientIp: string, data: EventData): Promise<VisitorData> {
    const uaParser: UAParserInstance = new UAParser(data.userAgent)
    const browserName: string | null = uaParser.getBrowser().name || null
    const osName: string | null = uaParser.getOS().name || null
    const deviceType: string = uaParser.getDevice().type || 'desktop'
    const geo: Lookup = geoip.lookup(clientIp) as Lookup
    const url: string = data.url
    const userAgent: string = data.userAgent

    const salt: string = await DailySaltService.getSalt()

    const visitorId: string = await VisitorService.generateVisitorId(
      salt,
      data.domain,
      clientIp,
      userAgent
    )

    const visitor: Visitor = await VisitorService.findOrCreate(visitorId, data.domain, geo)

    AnalyticsService.addVisitor(data.domain, visitorId)
    AnalyticsService.emitVisitorCountForProject(data.domain)

    if (!visitor) {
      throw new Error('Visitor could not be created')
    }

    const session: Session = await SessionService.findOrCreate(visitor.id)

    const visitorEvent: VisitorEvent = await VisitorEventService.create({
      visitorId: visitor.id,
      browser: browserName,
      os: osName,
      deviceType,
      referrer: data.referrer,
      url,
    })

    const project: Project = await ProjectsService.getByDomain(data.domain)

    if (project) {
      project.active = true
      await project.save()
    }

    return {
      visitorId: visitor.visitorId,
      event: visitorEvent,
      session,
      browserName,
      osName,
      deviceType,
      geo,
      referrer: data.referrer,
      url,
    }
  }
  public static async leave(clientIp: string, data: EventData): Promise<void> {
    const salt: string = await DailySaltService.getSalt()

    const visitorId: string = await VisitorService.generateVisitorId(
      salt,
      data.domain,
      clientIp,
      data.userAgent
    )

    AnalyticsService.removeVisitor(data.domain, visitorId)
    AnalyticsService.emitVisitorCountForProject(data.domain)

    await SessionService.endSession(visitorId)
  }
}

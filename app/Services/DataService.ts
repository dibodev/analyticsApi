import VisitorService from 'App/Services/VisitorService'
import VisitorEventService from 'App/Services/VisitorEventService'
import DailySaltService from 'App/Services/DailySaltService'
import UAParser from 'ua-parser-js'
import geoip from 'geoip-lite'
import type { GeoInfo } from 'geoip-lite'
import ProjectsService from 'App/Services/ProjectsService'
import AnalyticsService from 'App/Services/AnalyticsService'
import SessionService from 'App/Services/SessionService'

interface EventData {
  userAgent: string
  url: string
  referrer: string | null
  domain: string
}

export default class DataService {
  public static async collectVisitorData(clientIp: string, data: EventData) {
    const uaParser = new UAParser(data.userAgent)
    const browserName = uaParser.getBrowser().name
    const osName = uaParser.getOS().name
    const deviceType = uaParser.getDevice().type || 'desktop'
    const geo = geoip.lookup(clientIp) as GeoInfo
    const url = data.url
    const userAgent = data.userAgent

    const salt = await DailySaltService.getSalt()

    const visitorId = await VisitorService.generateVisitorId(salt, data.domain, clientIp, userAgent)

    const visitor = await VisitorService.findOrCreate(visitorId, data.domain, geo)

    AnalyticsService.addVisitor(data.domain, visitorId)
    AnalyticsService.emitVisitorCountForProject(data.domain)

    if (!visitor) {
      throw new Error('Visitor could not be created')
    }

    const session = await SessionService.findOrCreate(visitor.id)

    const visitorEvent = await VisitorEventService.create({
      visitorId: visitor.id,
      browser: browserName,
      os: osName,
      deviceType,
      referrer: data.referrer,
      url,
    })

    const project = await ProjectsService.getByDomain(data.domain)

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
  public static async leave(clientIp: string, data: EventData) {
    const salt = await DailySaltService.getSalt()

    const visitorId = await VisitorService.generateVisitorId(
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

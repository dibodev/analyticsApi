import VisitorService from 'App/Services/VisitorService'
import VisitorEventService from 'App/Services/VisitorEventService'
import DailySaltService from 'App/Services/DailySaltService'
import UAParser from 'ua-parser-js'
import type { UAParserInstance } from 'ua-parser-js'
import ProjectsService from 'App/Services/ProjectsService'
import SessionService from 'App/Services/SessionService'
import Visitor from 'App/Models/Visitor'
import Session from 'App/Models/Session'
import VisitorEvent from 'App/Models/VisitorEvent'
import Project from 'App/Models/Project'
import AnalyticsRealTimeService from 'App/Services/analytics/AnalyticsRealTimeService'
import IPService, { IPApiResponse } from 'App/Services/IPService'
import type { VisitorTrackingData } from 'App/Validators/VisitorTrackingDataValidator'
import type { LocationPayload } from 'App/Services/LocationService'

export interface VisitorData {
  visitorId: string | null
  event: VisitorEvent | null
  session: Session | null
  browserName: string | null
  osName: string | null
  deviceType: string
  geo: LocationPayload | null
  referrer: string | null
  clientIp?: string | null
  url: string
}

export default class VisitorTrackingDataService {
  public static async collectVisitorData(
    clientIpInfos: IPApiResponse | null,
    visitorTrackingData: VisitorTrackingData
  ): Promise<VisitorData> {
    const clientIp: string | null = clientIpInfos ? clientIpInfos.ip : null
    const userAgent: string = visitorTrackingData.userAgent || ''

    const uaParser: UAParserInstance = new UAParser(userAgent)
    const browserName: string | null = uaParser.getBrowser().name || null
    const osName: string | null = uaParser.getOS().name || null
    const deviceType: string = uaParser.getDevice().type || 'desktop'

    const url: string = visitorTrackingData.url

    const salt: string = await DailySaltService.getSalt()

    const visitorId: string | null = clientIp
      ? await VisitorService.generateVisitorId(
          salt,
          visitorTrackingData.domain,
          clientIp,
          userAgent
        )
      : null

    const visitorLocationInfos: LocationPayload | null =
      IPService.extractLocationInfo(clientIpInfos)

    let visitor: Visitor | null = null
    let session: Session | null = null
    let visitorEvent: VisitorEvent | null = null

    if (visitorId) {
      visitor = await VisitorService.findOrCreate(
        visitorId,
        visitorTrackingData.domain,
        visitorLocationInfos
      )

      AnalyticsRealTimeService.addVisitor(visitorTrackingData.domain, visitorId)
      AnalyticsRealTimeService.emitVisitorCountForProject(visitorTrackingData.domain)

      session = await SessionService.findOrCreate(visitor.id)

      visitorEvent = await VisitorEventService.create({
        visitorId: visitor.id,
        browser: browserName,
        os: osName,
        deviceType,
        referrer: visitorTrackingData.referrer,
        url,
      })
    }

    const project: Project = await ProjectsService.getByDomain(visitorTrackingData.domain)

    if (project) {
      project.active = true
      await project.save()
    }

    return {
      visitorId,
      event: visitorEvent,
      session,
      browserName,
      osName,
      deviceType,
      clientIp,
      geo: visitorLocationInfos,
      referrer: visitorTrackingData.referrer,
      url,
    }
  }
  public static async leave(
    clientIpInfos: IPApiResponse | null,
    visitorTrackingData: VisitorTrackingData
  ): Promise<void> {
    const clientIp: string | null = clientIpInfos ? clientIpInfos.ip : null
    const salt: string = await DailySaltService.getSalt()

    const visitorId: string | null = clientIp
      ? await VisitorService.generateVisitorId(
          salt,
          visitorTrackingData.domain,
          clientIp,
          visitorTrackingData.userAgent
        )
      : null

    if (visitorId) {
      AnalyticsRealTimeService.removeVisitor(visitorTrackingData.domain, visitorId)
      AnalyticsRealTimeService.emitVisitorCountForProject(visitorTrackingData.domain)

      await SessionService.endSession(visitorId)
    }
  }
}

import VisitorService from 'App/Services/VisitorService'
import AnalyticsRealTimeService from 'App/Services/Analytics/AnalyticsRealTimeService'
import IPService from 'App/Services/Network/IPService'
import LocationService from 'App/Services/LocationService'
import VisitorIpService from 'App/Services/VisitorIpService'
import Location from 'App/Models/Location'
import VisitorIp from 'App/Models/VisitorIp'
import ProjectService from 'App/Services/ProjectService'
import Project from 'App/Models/Project'
import type { IPApiResponse } from 'App/Services/Network/IPService'
import type { VisitorTrackingDataPayload } from 'App/Validators/VisitorTrackingDataValidator'
import type { RequestContract } from '@ioc:Adonis/Core/Request'
import PageViewService from 'App/Services/PageView/PageViewService'
import Visitor from 'App/Models/Visitor'
import PageService from 'App/Services/PageService'
import Page from 'App/Models/Page'
import UrlUtils from 'App/Utils/UrlUtils'
import UserAgent from 'App/Models/UserAgent'
import UserAgentService from 'App/Services/UserAgentService'
import UAParser from 'ua-parser-js'
import type { UAParserInstance } from 'ua-parser-js'
import Logger from '@ioc:Adonis/Core/Logger'
import PageView from 'App/Models/PageView'

export default class VisitorTrackingDataService {
  /**
   * Collects visitor data and saves it to the database.
   *
   * @param {VisitorTrackingDataPayload} visitorTrackingData - The visitor tracking data payload.
   * @param {RequestContract} request - The request object containing visitor information.
   * @return {Promise<{ visitorId: number }>} - The visitor ID that was created or retrieved.
   * @throws {Error} - If the domain of the visitor does not match the provided hostname.
   */
  public static async collectVisitorData(
    visitorTrackingData: VisitorTrackingDataPayload,
    request: RequestContract
  ): Promise<{ pageViewId: number }> {
    // Determines whether the domain of a visitor is matched with the provided hostname.
    const isDomainMatched: boolean = visitorTrackingData.domain === request.hostname()

    // If the domain of a visitor is not matched with the provided hostname, throw an error.
    if (!isDomainMatched) {
      throw new Error('Domain mismatch')
    }

    // Retrieves a project by its domain. If the project does not exist, creates a new one.
    const project: Project = await ProjectService.findOrCreateByDomain(visitorTrackingData.domain)

    // Represents the client IP information.
    const clientIpInfos: IPApiResponse | null = await IPService.getClientIpInfo(request)

    let visitorIp: VisitorIp | null = null

    if (clientIpInfos) {
      // Finds or creates a location record by IP.
      const location: Location = await LocationService.findOrCreate(clientIpInfos)
      // Finds or creates a visitor IP record by IP.
      visitorIp = await VisitorIpService.findOrCreateByIp({
        clientIpInfos,
        locationId: location.id,
      })
    }

    // Finds or creates a visitor record by visitor IP ID.
    const visitor: Visitor = await VisitorService.findOrCreateByVisitorIpId(
      project.id,
      visitorIp?.id
    )

    // Finds or creates a page record by URL.
    const endpoint: string = UrlUtils.findEndpoint(visitorTrackingData.url)

    const page: Page = await PageService.findOrCreateByUrl(project.id, {
      url: visitorTrackingData.url,
      endpoint,
      projectId: project.id,
    })

    // Creates a user agent record.
    const userAgent: string | undefined = this.findUserAgent(visitorTrackingData, request)
    const uaParser: UAParserInstance = new UAParser(userAgent)
    const browserName: string | undefined = uaParser.getBrowser().name
    const browserVersion: string | undefined = uaParser.getBrowser().version
    const preferredLanguage: string | undefined = request.language(request.languages()) || undefined
    const osName: string | undefined = uaParser.getOS().name
    const osVersion: string | undefined = uaParser.getOS().version
    const deviceType: string | undefined = uaParser.getDevice().type
    const referrer: string | undefined = visitorTrackingData.referrer || undefined

    const userAgentEntity: UserAgent = await UserAgentService.findOrCreate({
      userAgent,
      browserName,
      browserVersion,
      browserLanguage: preferredLanguage,
      osName,
      osVersion,
      deviceType,
    })

    // Creates a page view record.
    const pageView: PageView = await PageViewService.create({
      visitorId: visitor.id,
      pageId: page.id,
      userAgentId: userAgentEntity.id,
      referrer,
    })

    // Adds a visitor to the specified domain in the realtimeVisitors.
    if (visitorIp) {
      await AnalyticsRealTimeService.addVisitor(pageView.id, visitorIp.ip)
      // AnalyticsRealTimeService.emitVisitorCountForProject(visitorTrackingData.domain)
    }

    return {
      pageViewId: pageView.id,
    }
  }
  // /**
  //  * Removes the visitor with the specified visitorId from the analytics real-time service.
  //  * Updates the visitor count for the project associated with the visitorTrackingData domain.
  //  *
  //  * @param {VisitorTrackingDataPayload} visitorTrackingData - The tracking data for the visitor.
  //  * @param {number} visitorId - The ID of the visitor to remove.
  //  *
  //  * @return {Promise<void>} A Promise that resolves when the visitor is removed.
  //  */
  // public static async leave(
  //   visitorTrackingData: VisitorTrackingDataPayload,
  //   visitorId: number
  // ): Promise<void> {
  //   if (visitorId) {
  //     AnalyticsRealTimeService.removeVisitor(visitorTrackingData.domain, visitorId)
  //     AnalyticsRealTimeService.emitVisitorCountForProject(visitorTrackingData.domain)
  //   }
  // }

  public static async leave(pageViewId: number, ip: string): Promise<void> {
    Logger.info('Leave visitor tracking data service')
    await AnalyticsRealTimeService.removeVisitor(pageViewId, ip)
  }

  /**
   * Retrieves the user agent from the visitor tracking data or the request.
   *
   * @param {VisitorTrackingDataPayload} visitorTrackingData - The visitor tracking data.
   * @param {RequestContract} request - The request object.
   * @returns {string | undefined} The user agent string, or undefined if not found.
   */
  private static findUserAgent(
    visitorTrackingData: VisitorTrackingDataPayload,
    request: RequestContract
  ): string | undefined {
    return visitorTrackingData.userAgent || request.header('User-Agent') || undefined
  }
}

import VisitorService from 'App/Services/VisitorService'
import VisitorEventService from 'App/Services/VisitorEventService'
import DailySaltService from 'App/Services/DailySaltService'
import * as crypto from 'crypto'
import UAParser from 'ua-parser-js'
import geoip from 'geoip-lite'
import type { GeoInfo } from 'geoip-lite'
import ProjectsService from 'App/Services/ProjectsService'

interface VisitorData {
  userAgent: string
  url: string
  referrer: string | null
}

interface EventData {
  data: VisitorData
  projectId: number
}

export default class DataService {
  public static async collectVisitorData(clientIp: string, data: EventData) {
    const uaParser = new UAParser(data.data.userAgent)
    const browserName = uaParser.getBrowser().name
    const osName = uaParser.getOS().name
    const deviceType = uaParser.getDevice().type || 'desktop'
    const geo = geoip.lookup(clientIp) as GeoInfo
    const url = data.data.url
    const websiteDomain = new URL(url).hostname

    const salt = await DailySaltService.getSalt()
    const visitorId = crypto
      .createHash('sha256')
      .update(`${salt}${websiteDomain}${clientIp}${data.data.userAgent}`)
      .digest('hex')

    const visitor = await VisitorService.findOrCreate(visitorId, geo)

    if (!visitor) {
      throw new Error('Visitor could not be created')
    }

    const visitorEvent = await VisitorEventService.create({
      visitorId: visitor.id,
      projectId: data.projectId,
      browser: browserName,
      os: osName,
      deviceType,
      referrer: data.data.referrer,
      url,
    })

    const project = await ProjectsService.getById(data.projectId)

    if (project) {
      project.active = true
      await project.save()
    }

    return {
      visitorId: visitor.visitorId,
      event: visitorEvent,
      browserName,
      osName,
      deviceType,
      geo,
      referrer: data.data.referrer,
      url,
    }
  }
}

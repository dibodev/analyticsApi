import VisitorIp from 'App/Models/VisitorIp'
import type { IPApiResponse } from 'App/Services/Network/IPService'
import LocationService from 'App/Services/LocationService'
import Location from 'App/Models/Location'

export type CreateVisitorIpPayload = {
  clientIpInfos: IPApiResponse
  locationId: number
}

export default class VisitorIpService {
  /**
   * Finds or creates a visitor IP record by IP.
   *
   * @param {CreateVisitorIpPayload} visitorIpPayload - The payload containing client IP information.
   * @returns {Promise<VisitorIp>} - A promise that resolves to a VisitorIp object.
   */
  public static async findOrCreateByIp(
    visitorIpPayload: CreateVisitorIpPayload
  ): Promise<VisitorIp> {
    let visitorIp: VisitorIp | null = await VisitorIpService.findByIp(
      visitorIpPayload.clientIpInfos.ip
    )
    if (!visitorIp) {
      visitorIp = await VisitorIpService.create(visitorIpPayload)
    }
    return visitorIp
  }

  /**
   * Finds a visitor by IP.
   *
   * @param {string} ip - The IP address to search for.
   *
   * @return {Promise<VisitorIp | null>} - A promise that resolves to the VisitorIp object with the given IP address or null if not found.
   */
  public static async findByIp(ip: string): Promise<VisitorIp | null> {
    return await VisitorIp.query().where('ip', ip).first()
  }

  /**
   * Create a new VisitorIp record.
   *
   * @param {CreateVisitorIpPayload} visitorIpPayload - The payload containing information for creating the VisitorIp record.
   * @property {IPApiResponse} visitorIpPayload.clientIpInfos - The client IP information.
   * @property {number} visitorIpPayload.locationId - [optional] The ID of the location associated with the VisitorIp record.
   *
   * @returns {Promise<VisitorIp>} - A promise that resolves with the created VisitorIp record.
   */
  public static async create(visitorIpPayload: CreateVisitorIpPayload): Promise<VisitorIp> {
    const { clientIpInfos, locationId }: CreateVisitorIpPayload = visitorIpPayload

    // Verify if location exists
    const location: Location | null = await LocationService.findById(locationId)

    if (!location) {
      throw new Error('Location not found for visitor IP creation')
    }

    return await VisitorIp.create({
      ip: clientIpInfos.ip,
      type: clientIpInfos.type,
      asn: clientIpInfos.connection.asn,
      org: clientIpInfos.connection.org,
      isp: clientIpInfos.connection.isp,
      domain: clientIpInfos.connection.domain,
      locationId,
    })
  }
}

import Location from 'App/Models/Location'
import IPService from 'App/Services/Network/IPService'
import type { IPApiResponse } from 'App/Services/Network/IPService'

export type LocationPayload = {
  continent?: string
  continentCode?: string
  country?: string
  countryCode?: string
  region?: string
  regionCode?: string
  city: string
  latitude: number
  longitude: number
  postal?: string
  flagImgUrl?: string
  flagEmoji?: string
}

/**
 * LocationService is a class that provides methods for finding and creating locations.
 */
export default class LocationService {
  /**
   * Finds or creates a location based on IP information.
   *
   * @param {IPApiResponse} ipInfos - The IP information.
   * @returns {Promise<Location>} - A promise that resolves to a Location object.
   */
  public static async findOrCreate(ipInfos: IPApiResponse): Promise<Location> {
    let location: Location | null = await this.findByCoordinates(
      ipInfos.latitude,
      ipInfos.longitude
    )
    if (!location) {
      const locationPayload: LocationPayload = IPService.extractLocationInfo(ipInfos)
      location = await this.create(locationPayload)
    }
    return location
  }

  /**
   * Finds a location by its coordinates.
   *
   * @param {number} latitude - The latitude of the location.
   * @param {number} longitude - The longitude of the location.
   * @returns {Promise<Location|null>} - A promise that resolves to the found location or null if no location is found.
   */
  public static async findByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<Location | null> {
    return await Location.query().where('latitude', latitude).where('longitude', longitude).first()
  }

  public static async findById(id: number): Promise<Location | null> {
    return await Location.query().where('id', id).first()
  }

  /**
   * Creates a new location record from the given location payload.
   *
   * @param {LocationPayload} locationPayload - The payload containing the location details.
   * @return {Promise<Location>} - A Promise that resolves to the created location record.
   */
  public static async create(locationPayload: LocationPayload): Promise<Location> {
    return await Location.create(locationPayload)
  }
}

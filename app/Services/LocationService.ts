import Location from 'App/Models/Location'

export interface LocationPayload {
  country: string
  region: string
  city: string
}

export default class LocationService {
  public static async findOrCreate(
    locationPayload: LocationPayload | null
  ): Promise<Location | null> {
    if (!locationPayload) {
      return null
    }
    let location: Location | null = await this.find(locationPayload)
    if (!location) {
      await this.create(locationPayload)
    }
    return location
  }
  public static async find(locationPayload: LocationPayload): Promise<Location | null> {
    return await Location.query()
      .where('country', locationPayload.country)
      .where('region', locationPayload.region)
      .where('city', locationPayload.city)
      .first()
  }

  public static async create(locationPayload: LocationPayload): Promise<Location> {
    const location: Location = new Location()
    location.country = locationPayload.country
    location.region = locationPayload.region
    location.city = locationPayload.city
    await location.save()
    return location
  }
}

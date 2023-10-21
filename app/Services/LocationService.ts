import Location from 'App/Models/Location'
import type { Lookup } from 'geoip-lite'
export default class LocationService {
  public static async findOrCreate(geo: Lookup | null): Promise<Location | null> {
    if (!geo) {
      return null
    }
    let location: Location | null = await this.find(geo)
    if (!location) {
      await this.create(geo)
    }
    return location
  }
  public static async find(geo: Lookup): Promise<Location | null> {
    return await Location.query()
      .where('country', geo.country)
      .where('region', geo.region)
      .where('city', geo.city)
      .first()
  }

  public static async create(geo: Lookup): Promise<Location> {
    const location: Location = new Location()
    location.country = geo.country
    location.region = geo.region
    location.city = geo.city
    await location.save()
    return location
  }
}

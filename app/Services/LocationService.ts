import Location from 'App/Models/Location'
export interface GeoLocation {
  country: string
  region: string
  city: string
}
export default class LocationService {
  public static async findOrCreate(geo: GeoLocation | null) {
    if (!geo) {
      return null
    }
    let location = await this.find(geo)
    if (!location) {
      await this.create(geo)
    }
    return location
  }
  public static async find(geo: GeoLocation) {
    return await Location.query()
      .where('country', geo.country)
      .where('region', geo.region)
      .where('city', geo.city)
      .first()
  }

  public static async create(geo: GeoLocation) {
    const location = new Location()
    location.country = geo.country
    location.region = geo.region
    location.city = geo.city
    await location.save()
    return location
  }
}

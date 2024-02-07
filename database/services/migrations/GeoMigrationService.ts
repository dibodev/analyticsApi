import axios from 'axios'
import type { AxiosResponse } from 'axios'

type FlagInfo = {
  flag_img_url: string | null
  flag_emoji: string | null
}

type OpenCageResult = {
  components: {
    continent: string
    country: string
    country_code: string | null
    state: string
    state_code: string | null
    city: string
    town: string
    postcode: string
  }
  geometry: {
    lat: number
    lng: number
  }
}

type OpenCageApiResponse = {
  results: Array<OpenCageResult>
}

type RestCountriesApiResponse = {
  flags: {
    svg: string
  }
}

export type LocationInfo = {
  continent: string | null
  continent_code: string | null
  country: string | null
  country_code: string | null
  region: string | null
  region_code: string | null
  city: string
  latitude: number
  longitude: number
  postal: string | null
  flag_img_url: string | null
  flag_emoji: string | null
}

class GeoMigrationService {
  // Map continent name to continent code
  public static mapContinentToCode(continent: string): string | null {
    const continentMap: { [key: string]: string } = {
      'Europe': 'EU',
      'Asia': 'AS',
      'Africa': 'AF',
      'North America': 'NA',
      'South America': 'SA',
      'Antarctica': 'AN',
      'Oceania': 'OC',
    }

    return continentMap[continent] || null
  }

  // Get flag URL with country code
  public static async getFlagUrlWithCountryCode(countryCode: string): Promise<string | null> {
    try {
      const response: AxiosResponse<RestCountriesApiResponse> =
        await axios.get<RestCountriesApiResponse>(
          `https://restcountries.com/v2/alpha/${countryCode}`
        )
      return response.data.flags.svg
    } catch (error) {
      console.error('Error retrieving flag URL:', error)
      return null
    }
  }

  public static getUnicodeFlagEmojiWithCountryCode(countryCode: string): string {
    const codePoints: Array<number> = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  public static async getLocationFlags(countryCode: string | null): Promise<FlagInfo> {
    if (!countryCode) {
      return { flag_img_url: null, flag_emoji: null }
    }
    const flagUrl: string | null = await this.getFlagUrlWithCountryCode(countryCode)
    const flagEmoji: string = this.getUnicodeFlagEmojiWithCountryCode(countryCode)

    return { flag_img_url: flagUrl, flag_emoji: flagEmoji }
  }

  public static async getLocationInfoByCity(city: string): Promise<LocationInfo | null> {
    const openCageApiKey: string | undefined = process.env.OPENCAGE_API_KEY

    if (!openCageApiKey) {
      console.error('OpenCage API key is not defined')
      return null
    }

    const url: string = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${openCageApiKey}`

    try {
      const response: AxiosResponse<OpenCageApiResponse> = await axios.get<OpenCageApiResponse>(url)
      const findIndexWithPostCode: number =
        response.data.results.findIndex((result: OpenCageResult) => result.components.postcode) || 0

      const data: OpenCageResult | undefined = response.data.results[findIndexWithPostCode]

      if (!data) {
        console.error('No location data found')
        return null
      }

      const flags: FlagInfo = await this.getLocationFlags(data.components.country_code)
      const continentCode: string | null = this.mapContinentToCode(data.components.continent)

      return {
        ...flags,
        continent: data.components.continent,
        continent_code: continentCode,
        country: data.components.country,
        country_code: data.components.country_code?.toUpperCase() || null,
        region: data.components.state,
        region_code: data.components.state_code?.toUpperCase() || null,
        city,
        latitude: data.geometry.lat,
        longitude: data.geometry.lng,
        postal: data.components.postcode,
      }
    } catch (error) {
      console.error('Error retrieving location information:', error)
      return null
    }
  }
}

export default GeoMigrationService

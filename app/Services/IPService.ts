import axios from 'axios'
import type { RequestContract } from '@ioc:Adonis/Core/Request'
import type { LocationPayload } from 'App/Services/LocationService'

type IPApiErrorResponse = {
  ip: string
  success: false
  message: string
}

export type IPApiResponse = {
  ip: string
  success: true
  type: 'IPv4' | 'IPv6'
  continent: string
  continent_code: string
  country: string
  country_code: string
  region: string
  region_code: string
  city: string
  latitude: number
  longitude: number
  is_eu: boolean
  postal: string
  calling_code: string
  capital: string
  borders: string
  flag: {
    img: string
    emoji: string
    emoji_unicode: string
  }
  connection: {
    asn: number
    org: string
    isp: string
    domain: string
  }
  timezone: {
    id: string
    abbr: string
    is_dst: boolean
    offset: number
    utc: string
    current_time: string
  }
  currency: {
    name: string
    code: string
    symbol: string
    plural: string
    exchange_rate: number
  }
  security: {
    anonymous: boolean
    proxy: boolean
    vpn: boolean
    tor: boolean
    hosting: boolean
  }
}

export default class IPService {
  /**
   * Retrieves IP address information from an external API.
   *
   * @param {RequestContract} request - The HTTP request object.
   *
   * @returns {Promise<IPApiResponse | null>} Returns a promise that resolves to IP address information or null if it cannot be retrieved.
   */
  public static async getClientIpInfo(request: RequestContract): Promise<IPApiResponse | null> {
    const env: string | undefined = process.env.NODE_ENV

    if (!env || env === 'development') {
      return await this.fetchIpInfo()
    } else {
      const ip: string = this.getIpFromHeaders(request)
      return await this.fetchIpInfo(ip)
    }
  }

  /**
   * Fetches IP information from the ipwho.is API.
   *
   * @param {string} [ip] - Optional IP address to fetch information for. If not provided, information for the current IP will be fetched.
   * @returns {Promise<IPApiResponse | null>} - A Promise that resolves with the fetched IP information or null if an error occurred.
   */
  private static async fetchIpInfo(ip?: string): Promise<IPApiResponse | null> {
    try {
      const url: string = ip ? `https://ipwho.is/${ip}` : 'https://ipwho.is/'
      const response: { data: IPApiResponse | IPApiErrorResponse } = await axios.get(url)
      if (!response.data.success) {
        console.error('Error fetching IP info:', response.data.message)
        return null
      }
      return response.data
    } catch (error) {
      console.error('Error fetching IP info:', error)
      return null
    }
  }

  /**
   * Extracts location information from the provided IP API response.
   *
   * @param {IPApiResponse | null} ipApiResponse - The IP API response.
   * @return {LocationPayload | null} - The extracted location information.
   *             Returns null if the IP API response is null.
   */
  public static extractLocationInfo(ipApiResponse: IPApiResponse | null): LocationPayload | null {
    if (!ipApiResponse) {
      return null
    }
    return {
      country: ipApiResponse.country,
      region: ipApiResponse.region,
      city: ipApiResponse.city,
    }
  }

  /**
   * Retrieves the IP address from the given request headers.
   *
   * @param {RequestContract} request - The request object containing the headers.
   *
   * @return {string} The IP address extracted from the headers. If not found, the IP address from the request object is returned.
   */
  private static getIpFromHeaders(request: RequestContract): string {
    const forwarded: string | undefined =
      request.header('X-Forwarded-For') || request.header('X-Real-IP')
    return forwarded ? forwarded.split(',')[0].trim() : request.ip()
  }
}

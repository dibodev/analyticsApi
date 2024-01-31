import axios from 'axios'
import type { RequestContract } from '@ioc:Adonis/Core/Request'
import type { LocationPayload } from 'App/Services/LocationService'

export type IPApiResponse = {
  ip: string
  success: boolean
  type: string
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
  public static async getClientIpInfo(request: RequestContract): Promise<IPApiResponse | null> {
    const env: string | undefined = process.env.NODE_ENV

    if (!env || env === 'development') {
      return await this.fetchIpInfo()
    } else {
      const ip: string = this.getIpFromHeaders(request)
      return await this.fetchIpInfo(ip)
    }
  }

  private static async fetchIpInfo(ip?: string): Promise<IPApiResponse | null> {
    try {
      const url: string = ip ? `https://ipwho.is/${ip}` : 'https://ipwho.is/'
      const response: { data: IPApiResponse } = await axios.get(url)
      return response.data
    } catch (error) {
      console.error('Error fetching IP info:', error)
      return null
    }
  }

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

  private static getIpFromHeaders(request: RequestContract): string {
    const forwarded = request.header('X-Forwarded-For') || request.header('X-Real-IP')
    return forwarded ? forwarded.split(',')[0].trim() : request.ip()
  }
}

import axios from 'axios'
import type { AxiosInstance, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios'
import UploadService from 'App/Services/UploadService'

export default class DomainService {
  public static getDomaineName(domain: string): string | undefined {
    try {
      if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
        domain = 'http://' + domain
      }
      const url: URL = new URL(domain)
      return url.hostname.split('.')[0]
    } catch (err) {
      return undefined
    }
  }
  public static async getDomainFavicon(
    domain: string
  ): Promise<{ favicon: string | null; contentType: string | null }> {
    const faviconUrl: string = `https://icons.duckduckgo.com/ip3/${domain}.ico`

    const axiosInstance: AxiosInstance = axios.create({
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false,
      }),
    })

    let favicon: string | null = null
    let contentType: string | null = null

    try {
      const {
        data,
        headers,
      }: { data: string; headers: RawAxiosResponseHeaders | AxiosResponseHeaders } =
        await axiosInstance.get(faviconUrl, { responseType: 'arraybuffer' })
      favicon = data
      contentType = headers['content-type']
    } catch (err) {
      console.error("Domain doesn't have a favicon.")
    }

    return {
      favicon,
      contentType,
    }
  }

  public static async uploadDomainFavicon(domain: string): Promise<string | null> {
    const { favicon, contentType } = await this.getDomainFavicon(domain)
    if (favicon) {
      const domainName: string | undefined = this.getDomaineName(domain)
      return await UploadService.uploadImage(favicon, contentType, domainName)
    }
    return null
  }
}

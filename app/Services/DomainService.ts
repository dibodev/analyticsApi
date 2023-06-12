import axios from 'axios'
import UploadService from 'App/Services/UploadService'

export default class DomainService {
  public static getDomaineName(domain: string): string | undefined {
    try {
      if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
        domain = 'http://' + domain
      }
      const url = new URL(domain)
      return url.hostname.split('.')[0]
    } catch (err) {
      return undefined
    }
  }
  public static async getDomainFavicon(domain: string) {
    const faviconUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`
    const { data, headers } = await axios.get(faviconUrl, { responseType: 'arraybuffer' })
    return {
      favicon: data,
      contentType: headers['content-type'],
    }
  }

  public static async uploadDomainFavicon(domain: string): Promise<string | null> {
    const { favicon, contentType } = await this.getDomainFavicon(domain)
    if (favicon) {
      const domainName = this.getDomaineName(domain)
      return await UploadService.uploadImage(favicon, contentType, domainName)
    }
    return null
  }
}

import axios from 'axios'
import UploadService from 'App/Services/Utility/UploadService'

export default class DomainService {
  /**
   * Retrieves the domain name from the given URL.
   *
   * @param {string} domain - The URL or domain name to extract the domain name from.
   * @return {string | undefined} - The domain name extracted from the given URL, or undefined if an error occurs.
   */
  public static getDomaineName(domain: string): string | undefined {
    try {
      const url: URL = new URL(domain.startsWith('http') ? domain : 'http://' + domain)
      return url.hostname.split('.')[0]
    } catch (err) {
      return undefined
    }
  }

  /**
   * Retrieves the favicon and content type of given domain.
   *
   * @param {string} domain - The domain for which to retrieve the favicon.
   * @return {Promise<{ favicon: string | null; contentType: string | null }>} - A promise that resolves to an object containing the favicon data and content type.
   */
  public static async getDomainFavicon(
    domain: string
  ): Promise<{ favicon: string | null; contentType: string | null }> {
    const faviconUrl: string = `https://icons.duckduckgo.com/ip3/${domain}.ico`
    let favicon: string | null = null
    let contentType: string | null = null

    try {
      const { data, headers } = await axios.get(faviconUrl, {
        responseType: 'arraybuffer',
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
      })
      favicon = data
      contentType = headers['content-type']
    } catch (err) {
      console.error("Domain doesn't have a favicon.")
    }

    return { favicon, contentType }
  }

  /**
   * Uploads the favicon for a given domain.
   *
   * @param {string} domain - The domain for which to upload the favicon.
   * @return {Promise<string | null>} - A promise that resolves with the URL of the uploaded favicon or null if favicon is not found.
   */
  public static async uploadDomainFavicon(domain: string): Promise<string | null> {
    const { favicon, contentType } = await this.getDomainFavicon(domain)
    return favicon
      ? await UploadService.uploadImage(favicon, contentType, this.getDomaineName(domain))
      : null
  }
}

/**
 * Utility class for working with URLs.
 */
export default class UrlUtils {
  /**
   * Finds the endpoint of a given URL.
   *
   * @param {string} url - The URL to find the endpoint of.
   * @returns {string} - The endpoint path of the URL.
   */
  public static findEndpoint(url: string): string {
    const parsedUrl: URL = new URL(url)
    let path: string = parsedUrl.pathname

    // Remove the trailing slash if it exists
    if (path.endsWith('/') && path.length > 1) {
      path = path.slice(0, -1)
    }

    // If the path is empty, return "/"
    return path || '/'
  }
}

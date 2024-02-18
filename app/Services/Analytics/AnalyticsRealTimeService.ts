import SocketIoService from 'App/Services/Utility/SocketIoService'

/**
 * Class representing the AnalyticsRealTimeService.
 */
export default class AnalyticsRealTimeService {
  private static realtimeVisitors: Map<string, Set<number>> = new Map<string, Set<number>>()

  /**
   * Adds a visitor to the specified domain in the realtimeVisitors map.
   *
   * @param {string} domain - The domain where the visitor is being added.
   * @param {number} visitorId - The ID of the visitor to be added.
   * @return {void}
   */
  public static addVisitor(domain: string, visitorId: number): void {
    let visitors: Set<number> = this.realtimeVisitors.get(domain) || new Set<number>()
    visitors.add(visitorId)
    this.realtimeVisitors.set(domain, visitors)
  }

  /**
   * Remove a visitor from the specified domain.
   *
   * @param {string} domain - The domain from which the visitor should be removed.
   * @param {number} visitorId - The ID of the visitor to be removed.
   * @return {void}
   */
  public static removeVisitor(domain: string, visitorId: number): void {
    const visitors: Set<number> | undefined = this.realtimeVisitors.get(domain)
    if (visitors) {
      visitors.delete(visitorId)
    }
  }

  /**
   * Gets the visitor count for a specific project domain.
   *
   * @param {string} domain - The domain of the project.
   * @return {number} - The number of visitors for the project.
   */
  public static getVisitorCountForProject(domain: string): number {
    const visitors: Set<number> | undefined = this.realtimeVisitors.get(domain)
    return visitors ? visitors.size : 0
  }

  /**
   * Emits the visitor count for the specified project domain.
   *
   * @param {string} domain - The project domain for which to emit the visitor count.
   *
   * @return {void}
   */
  public static emitVisitorCountForProject(domain: string): void {
    const count: number = this.getVisitorCountForProject(domain)
    SocketIoService.io.to(domain).emit('visitorCount', count)
  }
}

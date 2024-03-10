// import SocketIoService from 'App/Services/Utility/SocketIoService'
import VisitorService from 'App/Services/VisitorService'
import Visitor from 'App/Models/Visitor'
import PageViewService from 'App/Services/PageView/PageViewService'
import RealtimePageViewService from 'App/Services/PageView/RealtimePageViewService'
import PageView from 'App/Models/PageView'

/**
 * Class representing the AnalyticsRealTimeService.
 */
export default class AnalyticsRealTimeService {
  /**
   * Add a visitor to a page view.
   *
   * @param {number} pageViewId - The ID of the page view.
   * @param {string} ip - The IP address of the visitor.
   * @return {Promise<void>} - A promise that resolves once the visitor is added to the page view.
   */
  public static async addVisitor(pageViewId: number, ip: string): Promise<void> {
    const visitor: Visitor | null = await VisitorService.findByIp(ip)
    const pageView: PageView = await PageViewService.findById(pageViewId)

    if (visitor && pageView.visitorId === visitor.id) {
      await RealtimePageViewService.create({
        pageViewId,
      })
    }
  }

  /**
   * Removes a visitor from a page view.
   *
   * @param {number} pageViewId - The ID of the page view.
   * @param {string} ip - The IP address of the visitor.
   * @returns {Promise<void>} - A promise that resolves when the visitor is removed successfully.
   */
  public static async removeVisitor(pageViewId: number, ip: string): Promise<void> {
    const visitor: Visitor | null = await VisitorService.findByIp(ip)
    const pageView: PageView = await PageViewService.findById(pageViewId)

    if (visitor && pageView.visitorId === visitor.id) {
      await RealtimePageViewService.deactivateByPageViewId(pageViewId)
    }
  }

  // /**
  //  * Remove a visitor from the specified domain.
  //  *
  //  * @param {string} domain - The domain from which the visitor should be removed.
  //  * @param {number} visitorId - The ID of the visitor to be removed.
  //  * @return {void}
  //  */
  // public static removeVisitor(domain: string, visitorId: number): void {
  //   const visitors: Set<number> | undefined = this.realtimeVisitors.get(domain)
  //   if (visitors) {
  //     visitors.delete(visitorId)
  //   }
  // }
  //
  // /**
  //  * Gets the visitor count for a specific project domain.
  //  *
  //  * @param {string} domain - The domain of the project.
  //  * @return {number} - The number of visitors for the project.
  //  */
  // public static getVisitorCountForProject(domain: string): number {
  //   const visitors: Set<number> | undefined = this.realtimeVisitors.get(domain)
  //   return visitors ? visitors.size : 0
  // }
  //
  // /**
  //  * Emits the visitor count for the specified project domain.
  //  *
  //  * @param {string} domain - The project domain for which to emit the visitor count.
  //  *
  //  * @return {void}
  //  */
  // public static emitVisitorCountForProject(domain: string): void {
  //   const count: number = this.getVisitorCountForProject(domain)
  //   SocketIoService.io.to(domain).emit('visitorCount', count)
  // }
}

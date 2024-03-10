import RealTimePageView from 'App/Models/RealTimePageView'

export type RealTimePageViewPayload = {
  pageViewId: number
  active?: boolean
}

export default class RealtimePageViewService {
  /**
   * Creates a new RealTimePageView.
   *
   * @param {RealTimePageViewPayload} realTimePageViewPayload - The payload for the RealTimePageView.
   * @return {Promise<RealTimePageView>} - A Promise that resolves to the created RealTimePageView.
   */
  public static async create(
    realTimePageViewPayload: RealTimePageViewPayload
  ): Promise<RealTimePageView> {
    return RealTimePageView.create(realTimePageViewPayload)
  }

  /**
   * Deactivates a page view by its ID.
   *
   * @param {number} pageViewId - The ID of the page view to deactivate.
   * @returns {Promise<void>} - A promise that resolves once the deactivation is complete.
   */
  public static async deactivateByPageViewId(pageViewId: number): Promise<void> {
    await RealTimePageView.query().where('page_view_id', pageViewId).update({ active: false })
  }
}

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VisitorTrackingDataValidator from 'App/Validators/VisitorTrackingDataValidator'
import type { VisitorTrackingDataPayload } from 'App/Validators/VisitorTrackingDataValidator'
import VisitorTrackingDataService from 'App/Services/Tracking/VisitorTrackingDataService'

export default class VisitorTrackingController {
  /**
   * Collects visitor tracking data and sends a response indicating success or failure.
   *
   * @param {HttpContextContract} httpContext - The HTTP context.
   * @returns {Promise<void>} - Resolves with no value upon completion.
   */
  public async pageView({ request, response }: HttpContextContract): Promise<void> {
    const visitorTrackingData: VisitorTrackingDataPayload = await request.validate(
      VisitorTrackingDataValidator
    )

    const { pageViewId }: { pageViewId: number } =
      await VisitorTrackingDataService.collectVisitorData(visitorTrackingData, request)
    response.send({ success: true, pageViewId })
  }
}

// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// // import VisitorTrackingDataService from 'App/Services/VisitorTrackingDataService'
// // import type { VisitorData } from 'App/Services/VisitorTrackingDataService'
// import VisitorTrackingDataValidator from 'App/Validators/VisitorTrackingDataValidator'
// import type { VisitorTrackingData } from 'App/Validators/VisitorTrackingDataValidator'
// import IPService from 'App/Services/IPService'
// import type { IPApiResponse } from 'App/Services/IPService'
// import { RequestContract } from '@ioc:Adonis/Core/Request'
//
// export default class VisitorTrackingController {
//   public async join({ request }: HttpContextContract): Promise<VisitorData> {
//     const visitorTrackingData: VisitorTrackingData = await request.validate(
//       VisitorTrackingDataValidator
//     )
//
//     const userAgent: string | null = this.getUserAgent(visitorTrackingData, request)
//
//     const clientIpInfos: IPApiResponse | null = await IPService.getClientIpInfo(request)
//
//     return await VisitorTrackingDataService.collectVisitorData(clientIpInfos, {
//       ...visitorTrackingData,
//       userAgent,
//     })
//   }
//   public async leave({ request, response }: HttpContextContract): Promise<void> {
//     const visitorTrackingData: VisitorTrackingData = await request.validate(
//       VisitorTrackingDataValidator
//     )
//     const userAgent: string | null = this.getUserAgent(visitorTrackingData, request)
//
//     const clientIpInfos: IPApiResponse | null = await IPService.getClientIpInfo(request)
//
//     await VisitorTrackingDataService.leave(clientIpInfos, { ...visitorTrackingData, userAgent })
//     response.send({ success: true })
//   }
//
//   private getUserAgent(
//     visitorTrackingData: VisitorTrackingData,
//     request: RequestContract
//   ): string | null {
//     return visitorTrackingData.userAgent || request.header('User-Agent') || null
//   }
// }

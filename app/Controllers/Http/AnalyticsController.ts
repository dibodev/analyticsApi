// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import AnalyticsService from 'App/Services/analytics/AnalyticsService'
// import { DateTime } from 'luxon'
// import AnalyticsLocationService from 'App/Services/analytics/AnalyticsLocationService'
// import type { ProjectCountryResponse } from 'App/Services/analytics/AnalyticsLocationService'
// import type { TopStats } from 'App/Services/analytics/AnalyticsHistoricalService'
//
// export default class AnalyticsController {
//   public async stats({ request, params }: HttpContextContract): Promise<Array<TopStats>> {
//     const period: string = request.input('period')
//     const dateString: string = request.input('date') || DateTime.now().toISODate()
//     const date: DateTime = DateTime.fromISO(dateString)
//
//     return await AnalyticsService.getHistoricalStats({
//       domain: params.domain,
//       period,
//       endAt: date,
//     })
//   }
//
//   public async countries({ params }: HttpContextContract): Promise<Array<ProjectCountryResponse>> {
//     return AnalyticsLocationService.getProjectCountries({
//       domain: params.domain,
//     })
//   }
// }

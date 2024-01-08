import Project from 'App/Models/Project'
import Database from '@ioc:Adonis/Lucid/Database'
import { calculatePercentage } from 'App/Utils/NumberUtils'
import VisitorService from 'App/Services/VisitorService'
import getCountryFlag from 'country-flag-icons/unicode'

export type ProjectCountryResponse = {
  code: string
  name: string
  flag: string
  percentage: number
  alpha_3: string
  visitors: number
}

export default class AnalyticsLocationService {
  public static async getProjectCountries({
    domain,
  }: {
    domain: string
  }): Promise<Array<ProjectCountryResponse>> {
    const project = await Project.query().where('domain', domain).firstOrFail()

    const countryStats = await Database.from('visitors')
      .innerJoin('locations', 'visitors.location_id', 'locations.id')
      .where('visitors.project_id', project.id)
      .groupBy('locations.country')
      .select('locations.country as name', 'locations.country', 'locations.alpha_3')
      .countDistinct('visitors.visitor_id as visitors')

    const totalVisitors: number = await VisitorService.getVisitorCount(project.id)

    return countryStats.map((stat) => {
      return {
        code: stat.code,
        name: stat.name,
        flag: getCountryFlag(stat.code),
        percentage: calculatePercentage(stat.visitors, totalVisitors),
        alpha_3: stat.alpha_3,
        visitors: stat.visitors,
      }
    })
  }
}

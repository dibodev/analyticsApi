import Website from 'App/Models/Website'

export default class WebsiteService {
  public static async createWebsite(name: string, domain: string) {
    return await Website.create({ name, domain })
  }
}

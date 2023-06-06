import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WebsiteService from 'App/Services/WebsiteService'

export default class WebsitesController {
  protected async generateScript({ request, response }: HttpContextContract) {
    const { name, domain } = request.body()
    const res = await WebsiteService.createWebsite(name, domain)
    const script = `<script src="http://localhost:3333/tracker.js?id=${res.id}"></script>`

    // Renvoyer le script à l'utilisateur.
    return response.send({ script })
  }
  protected async all({ response }: HttpContextContract) {
    const websites = await WebsiteService.getAll()
    return response.send(websites)
  }

  protected async collectData({ request, response }: HttpContextContract) {
    const { id, data } = request.body()
    return response.send({ id, data })
  }
}

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WebsiteService from 'App/Services/WebsiteService'
import UAParser from 'ua-parser-js'
import geoip from 'geoip-lite'

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
    const clientIp = request.ip() // Récupère l'IP du client.

    // Analyser la chaîne de l'agent utilisateur pour obtenir des informations sur le navigateur et le système d'exploitation.
    const uaParser = new UAParser(data.userAgent)
    const browserName = uaParser.getBrowser().name
    const osName = uaParser.getOS().name
    const deviceType = uaParser.getDevice().type || 'desktop'

    // Utiliser un service comme geoip-lite pour convertir l'adresse IP en informations de localisation.
    const geo = geoip.lookup(clientIp)

    // Vous pouvez extraire des informations supplémentaires de la requête ou des données du script de tracking ici...

    // Enregistrer ou traiter les informations collectées...

    return response.json({
      id,
      clientIp,
      browserName,
      osName,
      deviceType,
      geo,
    })
  }
}

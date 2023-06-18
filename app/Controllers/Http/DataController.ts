import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DataService from 'App/Services/DataService'
import DataValidator from 'App/Validators/DataValidator'
import IPService from 'App/Services/IPService'

export default class DataController {
  public async collectVisitorData({ request }: HttpContextContract) {
    const data = await request.validate(DataValidator)
    const userAgent = data.userAgent || request.header('User-Agent') || ''

    const clientIp = await IPService.getClientIp(request.ip())

    return await DataService.collectVisitorData(clientIp, { ...data, userAgent })
  }
  public async leave({ request, response }: HttpContextContract) {
    const data = await request.validate(DataValidator)
    const userAgent = data.userAgent || request.header('User-Agent') || ''

    const clientIp = await IPService.getClientIp(request.ip())

    await DataService.leave(clientIp, { ...data, userAgent })
    response.send({ success: true })
  }
}

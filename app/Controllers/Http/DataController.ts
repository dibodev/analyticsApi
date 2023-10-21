import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DataService from 'App/Services/DataService'
import type { VisitorData } from 'App/Services/DataService'
import DataValidator from 'App/Validators/DataValidator'
import type { DataValidatorInterface } from 'App/Validators/DataValidator'
import IPService from 'App/Services/IPService'

export default class DataController {
  public async collectVisitorData({ request }: HttpContextContract): Promise<VisitorData> {
    const data: DataValidatorInterface = await request.validate(DataValidator)
    const userAgent: string = data.userAgent || request.header('User-Agent') || ''

    const clientIp: string = await IPService.getClientIp(request.ip())

    return await DataService.collectVisitorData(clientIp, { ...data, userAgent })
  }
  public async leave({ request, response }: HttpContextContract): Promise<void> {
    const data: DataValidatorInterface = await request.validate(DataValidator)
    const userAgent: string = data.userAgent || request.header('User-Agent') || ''

    const clientIp: string = await IPService.getClientIp(request.ip())

    await DataService.leave(clientIp, { ...data, userAgent })
    response.send({ success: true })
  }
}

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DataService from 'App/Services/DataService'
import DataValidator from 'App/Validators/DataValidator'
import axios from 'axios'

export default class DataController {
  public async collectVisitorData({ request }: HttpContextContract) {
    const data = await request.validate(DataValidator)
    let clientIp = request.ip()

    if (process.env.NODE_ENV === 'development') {
      const response = await axios.get('https://api.myip.com')
      clientIp = response.data.ip
    }

    return await DataService.collectVisitorData(clientIp, data)
  }
}

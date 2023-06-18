import axios from 'axios'

export default class IPService {
  public static async getClientIp(requestIp: string): Promise<string> {
    let clientIp = requestIp
    const env = process.env.NODE_ENV

    if (!env || env === 'development') {
      const response = await axios.get('https://api.myip.com')
      clientIp = response.data.ip
    }

    return clientIp
  }
}

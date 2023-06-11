import cron from 'node-cron'
import DailySaltService from 'App/Services/DailySaltService'
import Logger from '@ioc:Adonis/Core/Logger'

export default class CronService {
  public static executeAllTasks() {
    this.refreshDailySalt()
  }
  public static refreshDailySalt() {
    cron.schedule('0 0 * * *', async () => {
      await DailySaltService.create()
      await DailySaltService.deleteOldestSalt()
      const salt = await DailySaltService.getSalt()
      Logger.info(`Daily salt refreshed: ${salt}`)
    })
  }
}

import CronService from 'App/Services/CronService'
import DailySaltService from 'App/Services/DailySaltService'

const initDailySalt = async () => {
  const salt = await DailySaltService.getSalt()
  if (!salt) {
    await DailySaltService.create()
  }
}
initDailySalt()
CronService.executeAllTasks()

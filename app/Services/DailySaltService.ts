import { DateTime } from 'luxon'
import * as crypto from 'crypto'
import DailySalt from 'App/Models/DailySalt'

export default class DailySaltService {
  public static async getSalt(): Promise<string> {
    const today = DateTime.local().toFormat('yyyy-MM-dd')
    let saltRow = await DailySalt.query().whereRaw('DATE(created_at) = ?', [today]).first()

    if (!saltRow) {
      saltRow = await this.create()
    }

    return saltRow.salt
  }

  public static async create(): Promise<DailySalt> {
    await this.deleteOldestSalt()
    const salt = crypto.randomBytes(64).toString('hex')
    return await DailySalt.create({ salt })
  }

  public static async deleteOldestSalt(): Promise<void> {
    const oldestSalt = await DailySalt.query().orderBy('created_at', 'asc').first()

    if (oldestSalt) {
      await oldestSalt.delete()
    }
  }
}

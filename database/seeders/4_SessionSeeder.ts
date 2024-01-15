import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import SessionFactory from 'Database/factories/SessionFactory'
import Session from 'App/Models/Session'

export default class extends BaseSeeder {
  public async run(): Promise<void> {
    const sessionsMax: number = 50
    const sessions: Array<Session> = await Session.all()
    if (sessions.length < sessionsMax) {
      await SessionFactory.createMany(sessionsMax)
    }
  }
}

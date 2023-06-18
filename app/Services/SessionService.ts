import Session from 'App/Models/Session'
import { DateTime } from 'luxon'
import VisitorService from 'App/Services/VisitorService'
import type { Period } from 'App/Types/DateTypes'

export default class SessionService {
  public static async findOrCreate(visitorId: number): Promise<Session> {
    // Try to find an active session
    let session = await this.findActiveSession(visitorId)

    // If no active session is found, create a new one
    if (!session) {
      session = await this.create(visitorId)
    }

    return session
  }

  public static async getByProjectId(projectId: number, period: Period): Promise<Session[]> {
    // Set endAt to the end of the day
    const endOfDay = period.endAt.set({ hour: 23, minute: 59, second: 59 })

    return await Session.query()
      .preload('visitor', (visitorQuery) => {
        visitorQuery.where('project_id', projectId)
      })
      .where('created_at', '>=', period.startAt.toJSDate())
      .where('created_at', '<=', endOfDay.toJSDate())
      .andWhere('active', false) // Consider only completed sessions
  }

  public static async findActiveSession(visitorId: number): Promise<Session | null> {
    return await Session.query().where('visitor_id', visitorId).where('active', true).first()
  }

  public static async create(visitorId: number): Promise<Session> {
    return await Session.create({
      visitorId,
    })
  }

  public static async endSession(visitorId: string): Promise<void> {
    const visitor = await VisitorService.findByVisitorId(visitorId)
    if (!visitor) {
      return
    }
    // Find active session and set it to inactive, calculate the duration
    const session = await Session.query()
      .where('visitor_id', visitor.id)
      .where('active', true)
      .first()

    if (session) {
      session.active = false
      session.sessionEnd = DateTime.now()
      session.visitDuration = session.sessionEnd.diff(session.createdAt, 'seconds').seconds
      await session.save()
    }
  }
}

import VisitorEvent from 'App/Models/VisitorEvent'
import { Period } from 'App/Types/DateTypes'

export interface VisitorEventCommand {
  visitorId: number
  browser: string | null
  os: string | null
  deviceType: string | undefined
  referrer: string | null
  url: string | null
}

export default class VisitorEventService {
  public static async create(command: VisitorEventCommand) {
    return await VisitorEvent.create(command)
  }

  public static async getByVisitorId(
    visitorId: number,
    { startAt, endAt }: Period
  ): Promise<VisitorEvent[]> {
    // Set endAt to the end of the day
    const endOfDay = endAt.set({ hour: 23, minute: 59, second: 59 })
    return await VisitorEvent.query()
      .where('visitor_id', visitorId)
      .whereBetween('createdAt', [startAt.toJSDate(), endOfDay.toJSDate()])
      .exec()
  }

  public static async getVisitorEventsByProjectId(
    projectId: number,
    { startAt, endAt }: Period
  ): Promise<VisitorEvent[]> {
    // Set endAt to the end of the day
    const endOfDay = endAt.set({ hour: 23, minute: 59, second: 59 })
    return await VisitorEvent.query()
      .whereHas('visitor', (visitorQuery) => {
        visitorQuery.where('project_id', projectId)
      })
      .whereBetween('createdAt', [startAt.toJSDate(), endOfDay.toJSDate()])
      .exec()
  }
}

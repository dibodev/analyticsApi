import VisitorEvent from 'App/Models/VisitorEvent'

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
}

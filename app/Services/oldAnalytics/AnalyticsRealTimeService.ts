import SocketIoService from 'App/Services/SocketIoService'

export default class AnalyticsRealTimeService {
  private static realtimeVisitors: Map<string, Set<string>> = new Map<string, Set<string>>()

  public static addVisitor(domain: string, visitorId: string): void {
    let visitors: Set<string> = this.realtimeVisitors.get(domain) || new Set<string>()
    visitors.add(visitorId)
    this.realtimeVisitors.set(domain, visitors)
  }

  public static removeVisitor(domain: string, visitorId: string): void {
    const visitors: Set<string> | undefined = this.realtimeVisitors.get(domain)
    if (visitors) {
      visitors.delete(visitorId)
    }
  }

  public static getVisitorCountForProject(domain: string): number {
    const visitors: Set<string> | undefined = this.realtimeVisitors.get(domain)
    return visitors ? visitors.size : 0
  }

  public static emitVisitorCountForProject(domain: string): void {
    const count: number = this.getVisitorCountForProject(domain)
    SocketIoService.io.to(domain).emit('visitorCount', count)
  }
}

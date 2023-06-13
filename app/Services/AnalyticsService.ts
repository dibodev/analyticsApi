import Project from 'App/Models/Project'
import VisitorEvent from 'App/Models/VisitorEvent'
import SocketIoService from 'App/Services/SocketIoService'

export default class AnalyticsService {
  private static realtimeVisitors = new Map<string, Set<string>>()

  public static async getAnalytics(projectId: number) {
    const project = await Project.findOrFail(projectId)

    // You can add more complex queries based on what you need to return for analytics
    const visitorEvents = await VisitorEvent.query()
      .where('project_id', project.id)
      .preload('visitor', (query) => query.preload('location'))
      .orderBy('created_at', 'desc')

    return { project, visitorEvents }
  }

  public static addVisitor(domain: string, visitorId: string) {
    let visitors = this.realtimeVisitors.get(domain)

    if (!visitors) {
      visitors = new Set<string>()
      this.realtimeVisitors.set(domain, visitors)
    }

    visitors.add(visitorId)
  }

  public static getVisitorCountForProject(domain: string): number {
    const visitors = this.realtimeVisitors.get(domain)
    return visitors ? visitors.size : 0
  }

  public static getTotalVisitorCount(): number {
    let total = 0

    for (const visitors of this.realtimeVisitors.values()) {
      total += visitors.size
    }

    return total
  }

  public static emitVisitorCountForProject(domain: string) {
    const count = this.getVisitorCountForProject(domain)
    SocketIoService.io.to(domain).emit('visitorCount', count)
  }
}

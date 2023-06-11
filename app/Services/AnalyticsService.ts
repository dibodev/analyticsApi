import Project from 'App/Models/Project'
import VisitorEvent from 'App/Models/VisitorEvent'

export default class AnalyticsService {
  public static async getAnalytics(projectId: number) {
    const project = await Project.findOrFail(projectId)

    // You can add more complex queries based on what you need to return for analytics
    const visitorEvents = await VisitorEvent.query()
      .where('project_id', project.id)
      .preload('visitor', (query) => query.preload('location'))
      .orderBy('created_at', 'desc')

    return { project, visitorEvents }
  }
}

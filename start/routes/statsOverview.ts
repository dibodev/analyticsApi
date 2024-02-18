import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/overview', 'AnalyticsController.overview')
  Route.get('/:domain/overview', 'AnalyticsController.domainOverview')
}).prefix('/analytics')

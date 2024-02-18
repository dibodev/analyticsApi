import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/top-sources', 'AnalyticsController.topSources')
  Route.get('/:domain/top-sources', 'AnalyticsController.domainTopSources')
}).prefix('/analytics')

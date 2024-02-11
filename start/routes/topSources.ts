import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/top-sources', 'StatsController.topSources')
  Route.get('/:domain/top-sources', 'StatsController.domainTopSources')
}).prefix('/stats')

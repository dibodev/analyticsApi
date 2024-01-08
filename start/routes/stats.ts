import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/:domain/top-stats', 'AnalyticsController.stats')
  Route.get('/:domain/countries', 'AnalyticsController.countries')
}).prefix('/stats')

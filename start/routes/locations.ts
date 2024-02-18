import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/locations', 'AnalyticsController.locations')
  Route.get('/:domain/locations', 'AnalyticsController.domainLocations')
}).prefix('/analytics')

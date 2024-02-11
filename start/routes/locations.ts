import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/locations', 'StatsController.locations')
  Route.get('/:domain/locations', 'StatsController.domainLocations')
}).prefix('/stats')

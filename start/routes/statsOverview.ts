import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/overview', 'StatsController.overview')
}).prefix('/stats')

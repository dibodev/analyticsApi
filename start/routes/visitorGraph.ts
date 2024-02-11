import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/visitors-graph', 'StatsController.visitorsGraph')
}).prefix('/stats')

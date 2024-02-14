import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/pages', 'StatsController.pages')
  Route.get('/:domain/pages', 'StatsController/.domainPages')
}).prefix('/stats')

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/pages', 'AnalyticsController.pages')
  Route.get('/:domain/pages', 'AnalyticsController/.domainPages')
}).prefix('/analytics')

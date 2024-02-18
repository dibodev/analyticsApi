import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/devices', 'AnalyticsController.devices')
  Route.get('/:domain/devices', 'AnalyticsController.domainDevices')
}).prefix('/analytics')

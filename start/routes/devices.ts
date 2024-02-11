import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/devices', 'StatsController.devices')
  Route.get('/:domain/devices', 'StatsController.domainDevices')
}).prefix('/stats')

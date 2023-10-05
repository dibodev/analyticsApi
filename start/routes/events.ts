import Route from '@ioc:Adonis/Core/Route'

Route.post('/event', 'DataController.collectVisitorData')
Route.post('/leave', 'DataController.leave')

import Route from '@ioc:Adonis/Core/Route'

Route.post('/pageview', 'VisitorTrackingController.join')
Route.post('/leave', 'VisitorTrackingController.leave')

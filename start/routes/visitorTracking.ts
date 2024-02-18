import Route from '@ioc:Adonis/Core/Route'

Route.post('/pageview', 'VisitorTrackingController.pageView')
Route.post('/leave', 'VisitorTrackingController.leave')

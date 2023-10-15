import Route from '@ioc:Adonis/Core/Route'

Route.get('/stats/:domain/top-stats', 'AnalyticsController.stats')

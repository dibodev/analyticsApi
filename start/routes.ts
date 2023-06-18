import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'

Route.get('/', async () => {
  return { success: true, version: 2 }
})

Route.post('/event', 'DataController.collectVisitorData')
Route.post('/leave', 'DataController.leave')

Route.get('/projects', 'ProjectsController.index')
Route.post('/projects', 'ProjectsController.store')
Route.get('/projects/:id', 'ProjectsController.show')
Route.put('/projects/:id', 'ProjectsController.update')
Route.delete('/projects/:id', 'ProjectsController.destroy')

Route.get('/stats/:domain', 'AnalyticsController.stats')

Route.get('/analytics.js', async ({ response }) => {
  return response.download(Application.publicPath('analytics.js'))
})

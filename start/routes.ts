import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'
import View from '@ioc:Adonis/Core/View'

Route.get('/', async () => {
  return { success: true, version: 2 }
})

Route.get('/test', async () => {
  return { test: true }
})

Route.post('/generate-script', 'WebsitesController.generateScript')
Route.post('/collect', 'WebsitesController.collectData')
Route.get('/websites', 'WebsitesController.all')

Route.get('/tracker', async () => {
  return Application.publicPath('tracker.js')
})

// Route.get('/tracker.js', async ({ response }) => {
//   return response.download(Application.publicPath('tracker.js'))
// })
Route.get('/tracker.js', async ({ response }) => {
  const baseUrl = process.env.NODE_ENV

  const trackerScript = await View.render('tracker', { baseUrl })

  response.header('Content-Type', 'text/javascript')
  return response.send(trackerScript)
})

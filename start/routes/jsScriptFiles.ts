import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'

Route.get('/analytics.js', async ({ response }) => {
  return response.download(Application.publicPath('analytics.js'))
})

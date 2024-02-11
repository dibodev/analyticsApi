import Route from '@ioc:Adonis/Core/Route'
/* ROUTES */
import './routes/projects'
import './routes/jsScriptFiles'
import './routes/visitorTracking'
import './routes/statsOverview'
import './routes/visitorGraph'
import './routes/topSources'
import './routes/pages'
import './routes/locations'
import './routes/devices'

Route.get('/', async () => {
  return { success: true, version: 2.4 }
})

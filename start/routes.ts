import Route from '@ioc:Adonis/Core/Route'
/* ROUTES */
import './routes/projects'
import './routes/jsScriptFiles'
import './routes/events'
import './routes/stats'

Route.get('/', async () => {
  return { success: true, version: 2.1 }
})

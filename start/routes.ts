import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'
Route.get('/', async () => {
  return { success: true, version: 2.4 }
})

/* SERVER SENT EVENTS */
Route.get('/sse', 'SseController.init')

/* ANALYTICS JS CLIENT SCRIPTS */
Route.get('/analytics.js', async ({ response }) => {
  return response.download(Application.publicPath('analytics.js'))
})

/* PROJECTS */
Route.get('/projects', 'ProjectsController.index')
Route.get('/projects/:id', 'ProjectsController.show')
Route.post('/projects', 'ProjectsController.store')
Route.put('/projects/:id', 'ProjectsController.update')
Route.delete('/projects/:id', 'ProjectsController.destroy')

/* VISITOR TRACKING */
Route.post('/pageview', 'VisitorTrackingController.pageView')
Route.post('/leave', 'VisitorTrackingController.leave')

/* ANALYTICS */

// Device analytics
Route.get('/analytics/devices', 'AnalyticsController.devices')
Route.get('/analytics/:domain/devices', 'AnalyticsController.domainDevices')

// Location analytics
Route.get('/analytics/locations', 'AnalyticsController.locations')
Route.get('/analytics/:domain/locations', 'AnalyticsController.domainLocations')

// Page analytics
Route.get('/analytics/pages', 'AnalyticsController.pages')
Route.get('/analytics/:domain/pages', 'AnalyticsController.domainPages')

// Overview analytics
Route.get('/analytics/overview', 'AnalyticsController.overview')
Route.get('/analytics/:domain/overview', 'AnalyticsController.domainOverview')

// Top sources analytics
Route.get('/analytics/top-sources', 'AnalyticsController.topSources')
Route.get('/analytics/:domain/top-sources', 'AnalyticsController.domainTopSources')

// Visitors graph analytics
Route.get('/analytics/visitors-graph', 'AnalyticsController.visitorsGraph')

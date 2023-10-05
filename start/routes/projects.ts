import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ProjectsController.index')
  Route.post('/', 'ProjectsController.store')
  Route.get('/:id', 'ProjectsController.show')
  Route.put('/:id', 'ProjectsController.update')
  Route.delete('/:id', 'ProjectsController.destroy')
}).prefix('/projects')

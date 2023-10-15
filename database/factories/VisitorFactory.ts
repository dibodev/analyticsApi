import Visitor from 'App/Models/Visitor'
import Factory from '@ioc:Adonis/Lucid/Factory'
import Location from 'App/Models/Location'
import Project from 'App/Models/Project'
export default Factory.define(Visitor, async ({ faker }) => {
  const locationIds: number[] = (await Location.all()).map((location: Location) => location.id)
  const randomLocationId: number = faker.helpers.arrayElement(locationIds)

  const projectIds: number[] = (await Project.all()).map((project: Project) => project.id)
  const randomProjectId: number = faker.helpers.arrayElement(projectIds)

  return {
    visitorId: faker.string.uuid(),
    locationId: randomLocationId,
    projectId: randomProjectId,
  }
}).build()

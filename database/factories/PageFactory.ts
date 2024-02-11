import Factory from '@ioc:Adonis/Lucid/Factory'
import Page from 'App/Models/Page'
import Project from 'App/Models/Project'

export default Factory.define(Page, async ({ faker }) => {
  const projects: Array<Project> = await Project.all()

  return {
    url: faker.internet.url(),
    endpoint: faker.internet.domainSuffix(),
    projectId: faker.helpers.arrayElement(projects).id,
  }
}).build()

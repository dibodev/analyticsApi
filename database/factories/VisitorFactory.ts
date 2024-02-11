import Factory from '@ioc:Adonis/Lucid/Factory'
import Visitor from 'App/Models/Visitor'
import VisitorIp from 'App/Models/VisitorIp'
import Project from 'App/Models/Project'

export default Factory.define(Visitor, async ({ faker }) => {
  const visitorIps: Array<VisitorIp> = await VisitorIp.all()
  const projects: Array<Project> = await Project.all()

  return {
    visitorIpId: faker.helpers.arrayElement(visitorIps).id,
    projectId: faker.helpers.arrayElement(projects).id,
  }
}).build()

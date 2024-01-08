import Project from 'App/Models/Project'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Project, ({ faker }) => {
  return {
    favicon: faker.datatype.boolean() ? faker.image.url() : null,
    domain: faker.internet.domainName(),
    active: faker.datatype.boolean(),
  }
}).build()

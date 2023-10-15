import Location from 'App/Models/Location'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Location, ({ faker }) => {
  return {
    country: faker.location.country(),
    region: faker.location.state(),
    city: faker.location.city(),
  }
}).build()

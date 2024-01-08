import Location from 'App/Models/Location'
import Factory from '@ioc:Adonis/Lucid/Factory'
import countries from 'i18n-iso-countries'

export default Factory.define(Location, ({ faker }) => {
  const countryCode = faker.location.countryCode()
  const alpha3Code: string | undefined = countries.alpha2ToAlpha3(countryCode)

  return {
    country: countryCode,
    region: faker.location.state(),
    city: faker.location.city(),
    alpha_3: alpha3Code,
  }
}).build()

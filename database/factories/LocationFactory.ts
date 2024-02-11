import Location from 'App/Models/Location'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Location, ({ faker }) => {
  const continents: Array<string> = [
    'Africa',
    'Antarctica',
    'Asia',
    'Europe',
    'North America',
    'Oceania',
    'South America',
  ]

  const continentsCodes: Array<string> = ['AF', 'AN', 'AS', 'EU', 'NA', 'OC', 'SA']

  return {
    continent: faker.helpers.arrayElement(continents),
    continent_code: faker.helpers.arrayElement(continentsCodes),
    country: faker.location.country(),
    country_code: faker.location.countryCode(),
    region: faker.location.state(),
    region_code: faker.location.state({ abbreviated: true }),
    city: faker.location.city(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    postal: faker.location.zipCode(),
    flag_img_url: `https://cdn.ipwhois.io/flags/${faker.location.countryCode().toLowerCase()}.svg`,
    flag_emoji: faker.helpers.arrayElement(['🇫🇷', '🇺🇸', '🇬🇧']),
  }
}).build()

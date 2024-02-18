import Factory from '@ioc:Adonis/Lucid/Factory'
import VisitorIp from 'App/Models/VisitorIp'
import Location from 'App/Models/Location'

export default Factory.define(VisitorIp, async ({ faker }) => {
  const locations: Array<Location> = await Location.all()

  const orgs: Array<string> = [
    'Orange Mobile',
    'MTN',
    'Nexttel',
    'Camtel',
    'Yoomee',
    'Vodafone',
    'Viettel',
    'Airtel',
    'Camoo',
    'Ringo',
    'Nexxtel',
    'Orange S.A.',
    'MTN Group',
    'Vodafone Group',
    'Viettel Group',
    'Airtel Africa',
    'Camoo Sarl',
    'Ringo S.A.',
    'Nexxtel S.A.',
  ]

  const isps: Array<string> = [
    'Orange S.A.',
    'MTN Group',
    'Vodafone Group',
    'Viettel Group',
    'Airtel Africa',
    'Camoo Sarl',
    'Ringo S.A.',
    'Nexxtel S.A.',
  ]

  return {
    ip: faker.internet.ip(),
    type: faker.helpers.arrayElement(['IPv4', 'IPv6']),
    asn: faker.number.int({ min: 1000, max: 9999 }),
    org: faker.helpers.arrayElement(orgs),
    isp: faker.helpers.arrayElement(isps),
    domain: faker.internet.domainName(),
    locationId: faker.helpers.arrayElement(locations).id,
  }
}).build()

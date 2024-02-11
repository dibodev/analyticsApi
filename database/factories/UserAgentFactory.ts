import Factory from '@ioc:Adonis/Lucid/Factory'
import UserAgent from 'App/Models/UserAgent'

export default Factory.define(UserAgent, ({ faker }) => {
  const browsers: Array<string> = [
    'Chrome',
    'Firefox',
    'Safari',
    'Edge',
    'Opera',
    'Internet Explorer',
  ]

  const osNames: Array<string> = [
    'Windows',
    'macOS',
    'Linux',
    'Ubuntu',
    'Fedora',
    'Debian',
    'Android',
    'iOS',
  ]

  return {
    userAgent: faker.internet.userAgent(),
    browserName: faker.helpers.arrayElement(browsers),
    browserVersion: faker.system.semver(),
    browserLanguage: faker.location.countryCode(),
    osName: faker.helpers.arrayElement(osNames),
    osVersion: faker.system.semver(),
    deviceType: faker.helpers.arrayElement(['Desktop', 'Mobile', 'Tablet']),
  }
}).build()

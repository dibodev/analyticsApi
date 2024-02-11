import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import ProjectService from 'App/Services/ProjectService'

test.group('Project service', (group) => {
  group.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  test('should create a new project', async ({ assert }) => {
    const domain = 'example.com'
    const project = await ProjectService.create(domain)
    assert.equal(project.domain, domain)
  })

  group.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})

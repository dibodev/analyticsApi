import { test } from '@japa/runner'
import type { TestContext } from '@japa/runner'
import type { ApiResponse } from '@japa/api-client'
import Project from 'App/Models/Project'
import { simulateVisitorAndPageView } from '../../utils/page_views_util'
import type { ProjectWithUniqueVisitorCountLast24Hours } from 'App/Services/ProjectService'

test.group('Projects Controller', (): void => {
  test('should create a new project', async ({ client, assert }: TestContext): Promise<void> => {
    const domain: string = 'testproject.com'
    const response: ApiResponse = await client.post('/projects').json({ domain })
    response.assertStatus(200)
    assert.equal(response.body().domain, domain)

    await Project.query().where('domain', domain).delete()
  })

  test('should update a project', async ({ client, assert }: TestContext): Promise<void> => {
    const project: Project = await Project.create({ domain: 'testproject.com' })
    const newDomain: string = 'newtestproject.com'
    const response: ApiResponse = await client
      .put(`/projects/${project.id}`)
      .json({ domain: newDomain })
    response.assertStatus(200)
    assert.equal(response.body().domain, newDomain)

    await project.delete()
  })

  test('should delete a project', async ({ client, assert }: TestContext): Promise<void> => {
    const project: Project = await Project.create({ domain: 'testproject.com' })
    const response: ApiResponse = await client.delete(`/projects/${project.id}`)
    response.assertStatus(204)

    const foundProject: Project | null = await Project.find(project.id)
    assert.isNull(foundProject)

    const deleteProjectResponse: ApiResponse = await client.delete(`/projects/${project.id}`)
    deleteProjectResponse.assertStatus(404)
  })

  test('should retrieve a project by ID', async ({
    client,
    assert,
  }: TestContext): Promise<void> => {
    const project: Project = await Project.create({ domain: 'testproject.com' })
    const response: ApiResponse = await client.get(`/projects/${project.id}`)
    response.assertStatus(200)
    assert.equal(response.body().id, project.id)

    await project.delete()
  })

  test('should retrieve all projects with visitor count in the last 24 hours', async ({
    client,
    assert,
  }: TestContext): Promise<void> => {
    const project: Project = await Project.create({ domain: 'testproject.com' })

    // Simulate visitors and page views
    await simulateVisitorAndPageView(project.id)
    await simulateVisitorAndPageView(project.id)

    const response: ApiResponse = await client.get('/projects')
    response.assertStatus(200)
    const projects: Array<ProjectWithUniqueVisitorCountLast24Hours> = response.body()
    const foundProject: ProjectWithUniqueVisitorCountLast24Hours | undefined = projects.find(
      (p: ProjectWithUniqueVisitorCountLast24Hours): boolean => p.project.id === project.id
    )
    assert.equal(foundProject?.nbUniqueVisitorLast24Hours, 2)

    await project.delete()
  })
})

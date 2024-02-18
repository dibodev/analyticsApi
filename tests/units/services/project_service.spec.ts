import { test } from '@japa/runner'
import type { Group, TestContext } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Project from 'App/Models/Project'
import ProjectService from 'App/Services/ProjectService'
import type { ProjectWithUniqueVisitorCountLast24Hours } from 'App/Services/ProjectService'
import { simulateVisitorAndPageView } from '../../utils/page_views_util'

test.group('Project service', (group: Group): void => {
  group.setup(async (): Promise<void> => {
    await Database.beginGlobalTransaction()
  })

  test('should create a new project', async ({ assert }: TestContext): Promise<void> => {
    const domain: string = 'example.com'
    const project: Project = await ProjectService.create(domain)
    assert.equal(project.domain, domain)
    await project.delete()
  })

  test('should retrieve a project by ID', async ({ assert }: TestContext): Promise<void> => {
    const domain: string = 'example.com'
    const newProject: Project = await Project.create({
      domain,
    })

    const fetchedProject: Project | null = await ProjectService.findById(newProject.id)
    if (fetchedProject) {
      assert.equal(fetchedProject.id, newProject.id)
      await newProject.delete()
    }
  })

  test('should update a project by ID', async ({ assert }: TestContext): Promise<void> => {
    const domain: string = 'example.com'
    const newDomain: string = 'updatedexample.com'
    const project: Project = await Project.create({
      domain,
    })

    const updatedProject: Project = await ProjectService.update(project.id, newDomain)
    assert.equal(updatedProject.domain, newDomain)
    await project.delete()
  })

  test('should delete a project by ID', async ({ assert }: TestContext): Promise<void> => {
    const domain: string = 'example.com'
    const project: Project = await Project.create({
      domain,
    })

    await ProjectService.delete(project.id)
    const fetchedProject: Project | null = await Project.query().where('id', project.id).first()
    assert.isNull(fetchedProject)
    await project.delete()
  })

  test('should retrieve all projects', async ({ assert }: TestContext): Promise<void> => {
    await Project.create({
      domain: 'example1.com',
    })

    await Project.create({
      domain: 'example2.com',
    })

    const projects: Array<Project> = await ProjectService.getAll()
    assert.isTrue(projects.length >= 2)
  })

  test('should retrieve all projects with visitor count in the last 24 hours', async ({
    assert,
  }: TestContext) => {
    // Create a test project
    const domain: string = 'example.com'
    const project: Project = await Project.create({
      domain,
    })

    // Simulate a visitor and a page view for the project
    await simulateVisitorAndPageView({ projectId: project.id })
    await simulateVisitorAndPageView({ projectId: project.id })

    // Test de la méthode du service
    const projectsWithVisitorCount: Array<ProjectWithUniqueVisitorCountLast24Hours> =
      await ProjectService.getAllWithVisitorCount()
    const testProjectData: ProjectWithUniqueVisitorCountLast24Hours | undefined =
      projectsWithVisitorCount.find(
        (p: ProjectWithUniqueVisitorCountLast24Hours): boolean => p.project.id === project.id
      )
    assert.equal(testProjectData?.nbUniqueVisitorLast24Hours, 2)

    await project.delete()
  })

  group.teardown(async (): Promise<void> => {
    await Database.rollbackGlobalTransaction()
  })
})

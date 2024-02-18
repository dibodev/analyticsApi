import { test } from '@japa/runner'
import type { Group, TestContext } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Project from 'App/Models/Project'
import { DateTime } from 'luxon'
import { simulateVisitorAndPageView } from '../../../utils/page_views_util'
import type { Period } from '../../../utils/page_views_util'
import AnalyticsSessionService from 'App/Services/Analytics/AnalyticsSessionService'

test.group('AnalyticsSessionService', (group: Group) => {
  const domain: string = 'example.com'

  group.setup(async (): Promise<void> => {
    await Database.beginGlobalTransaction()
  })

  group.each.setup(async (): Promise<void> => {
    // find the project by domain and delete it
    const project: Project | null = await Project.findBy('domain', domain)
    if (project) {
      await project.delete()
    }
  })

  test('should calculate unique sessions', async ({ assert }: TestContext): Promise<void> => {
    const seconds: number = 2
    const numberOfUniqueSessionsViews: number = 3
    const project: Project = await Project.create({ domain: 'example.com' })

    // Simulate uniques sessions
    for (let i: number = 0; i < numberOfUniqueSessionsViews; i++) {
      await simulateVisitorAndPageView({
        projectId: project.id,
        sessionStartMinus: { second: seconds - 1 },
      })
    }

    // Define the period for the test
    const period: Period = {
      startAt: DateTime.now().minus({ second: seconds }),
      endAt: DateTime.now(),
    }

    const uniqueSessions: number = await AnalyticsSessionService.getUniqueSessions({
      projectId: project.id,
      period,
    })

    // Check if the number of unique sessions matches the number of simulated sessions
    assert.equal(uniqueSessions, numberOfUniqueSessionsViews)

    // Wait 10 seconds and check if the sessions are still the same
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000))

    // The sessions should be 0 after n seconds
    const uniqueSessionsAfterNSeconds: number = await AnalyticsSessionService.getUniqueSessions({
      projectId: project.id,
      period,
    })
    assert.equal(uniqueSessionsAfterNSeconds, 0)
  })

  test('should calculate total sessions', async ({ assert }: TestContext): Promise<void> => {
    const seconds: number = 2
    const numberOfSessionsViews: number = 3
    const project: Project = await Project.create({ domain: 'example.com' })

    // Simulate uniques sessions
    for (let i: number = 0; i < numberOfSessionsViews; i++) {
      await simulateVisitorAndPageView({
        projectId: project.id,
        sessionStartMinus: { second: seconds - 1 },
      })
    }

    // Define the period for the test
    const period: Period = {
      startAt: DateTime.now().minus({ second: seconds }),
      endAt: DateTime.now(),
    }

    const totalSessions: number = await AnalyticsSessionService.getTotalSessions({
      projectId: project.id,
      period,
    })

    // Check if the number of total sessions matches the number of simulated sessions
    assert.equal(totalSessions, numberOfSessionsViews)

    // Wait 10 seconds and check if the sessions are still the same
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000))

    // The sessions should be 0 after n seconds
    const totalSessionsAfterNSeconds: number = await AnalyticsSessionService.getTotalSessions({
      projectId: project.id,
      period,
    })

    assert.equal(totalSessionsAfterNSeconds, 0)
  })

  group.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})

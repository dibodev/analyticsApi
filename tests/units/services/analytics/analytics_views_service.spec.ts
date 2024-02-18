import { test } from '@japa/runner'
import type { Group, TestContext } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Project from 'App/Models/Project'
import AnalyticsViewsService from 'App/Services/Analytics/AnalyticsViewsService'
import { DateTime } from 'luxon'
import { simulateVisitorAndPageView } from '../../../utils/page_views_util'
import type { Period, VisitorAndPageView } from '../../../utils/page_views_util'
import { roundToTwoDecimals } from 'App/Utils/NumberUtils'

test.group('Analytics Views Service', (group: Group) => {
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

  test('should calculate project views', async ({ assert }: TestContext): Promise<void> => {
    const seconds: number = 2
    const numberOfViews: number = 5
    const project: Project = await Project.create({ domain: 'example.com' })

    for (let i: number = 0; i < numberOfViews; i++) {
      await simulateVisitorAndPageView({
        projectId: project.id,
        sessionStartMinus: { second: seconds - 1 },
      })
    }

    const period: Period = {
      startAt: DateTime.now().minus({ second: seconds }),
      endAt: DateTime.now(),
    }
    const views: number = await AnalyticsViewsService.getViewsOfProject({
      projectId: project.id,
      period,
    })
    assert.deepEqual(views, numberOfViews)

    // Wait 10 seconds and check if the views are still the same
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000))

    // The views should be 0 after n seconds
    const viewsAfterNSeconds: number = await AnalyticsViewsService.getViewsOfProject({
      projectId: project.id,
      period,
    })

    assert.deepEqual(viewsAfterNSeconds, 0)
  })

  test('should calculate unique project views', async ({ assert }: TestContext): Promise<void> => {
    const seconds: number = 2
    const numberOfUniqueVisitorsViews: number = 3

    const project: Project = await Project.create({ domain: 'example.com' })

    // Simulate page views by different visitors
    for (let i: number = 0; i < numberOfUniqueVisitorsViews; i++) {
      const visitorAndPageView: VisitorAndPageView = await simulateVisitorAndPageView({
        projectId: project.id,
        sessionStartMinus: { second: seconds - 1 },
      })
      if (i === 0) {
        // Simulate additional page views by the same visitor
        for (let j: number = 0; j < 5; j++) {
          await simulateVisitorAndPageView({
            projectId: project.id,
            sessionStartMinus: { second: seconds - 1 },
            visitorId: visitorAndPageView.visitor.id,
          })
        }
      }
    }

    const period: Period = {
      startAt: DateTime.now().minus({ second: seconds }),
      endAt: DateTime.now(),
    }

    const uniqueViews: number = await AnalyticsViewsService.getUniqueViewsOfProject({
      projectId: project.id,
      period,
    })

    // Check if the number of unique views matches the number of unique visitors
    assert.equal(uniqueViews, numberOfUniqueVisitorsViews)

    // Wait 10 seconds and check if the views are still the same
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000))

    // The views should be 0 after n seconds
    const uniqueViewsAfterNSeconds: number = await AnalyticsViewsService.getUniqueViewsOfProject({
      projectId: project.id,
      period,
    })
    assert.equal(uniqueViewsAfterNSeconds, 0)
  })

  test('should calculate average visit duration', async ({ assert }): Promise<void> => {
    const seconds: number = 2
    const numberOfViews: number = 5
    const durations: number[] = [300, 600, 900, 1200, 1500]
    const project: Project = await Project.create({ domain: 'example.com' })

    // Simulate page views by different visitors with different durations
    for (let i: number = 0; i < numberOfViews; i++) {
      await simulateVisitorAndPageView({
        projectId: project.id,
        sessionStartMinus: { second: seconds - 1 },
        duration: durations[i],
      })
    }

    // Define the period for the test
    const period: Period = {
      startAt: DateTime.now().minus({ second: seconds }),
      endAt: DateTime.now(),
    }

    // Calculate the average visit duration
    const avgDuration: number = await AnalyticsViewsService.getAverageVisitDuration({
      projectId: project.id,
      period,
    })

    // Calculate the expected average visit duration
    const expectedAvgDuration: number =
      durations.reduce((a: number, b: number) => a + b, 0) / durations.length

    // Check if the average visit duration matches the expected value
    assert.equal(roundToTwoDecimals(avgDuration), roundToTwoDecimals(expectedAvgDuration))

    // Wait 10 seconds and check if the average visit duration is still the same
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000))

    // The average visit duration should be 0 after n seconds
    const avgDurationAfterNSeconds: number = await AnalyticsViewsService.getAverageVisitDuration({
      projectId: project.id,
      period,
    })

    assert.equal(avgDurationAfterNSeconds, 0)
  })

  group.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})

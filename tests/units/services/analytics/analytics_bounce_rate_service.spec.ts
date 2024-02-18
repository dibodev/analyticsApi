import { test } from '@japa/runner'
import type { Group, TestContext } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Project from 'App/Models/Project'
import { DateTime } from 'luxon'
import { simulateVisitorAndPageView } from '../../../utils/page_views_util'
import type { Period, VisitorAndPageView } from '../../../utils/page_views_util'
import { roundToTwoDecimals } from 'App/Utils/NumberUtils'
import AnalyticsBounceRateService from 'App/Services/Analytics/AnalyticsBounceRateService'

test.group('AnalyticsBounceRateService', (group: Group) => {
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

  test('should calculate bounce rate', async ({ assert }: TestContext): Promise<void> => {
    const seconds: number = 2
    const project: Project = await Project.create({ domain: 'example.com' })
    const numberOfViews: number = 5
    const numberOfNoBounceVisits: number = 2

    for (let i: number = 0; i < numberOfViews; i++) {
      // Simulate a bounce visit
      await simulateVisitorAndPageView({
        projectId: project.id,
        sessionStartMinus: { second: seconds - 1 },
      })
    }

    // Simulate a non-bounce visit
    for (let i: number = 0; i < numberOfNoBounceVisits; i++) {
      const visitorAndPageView: VisitorAndPageView = await simulateVisitorAndPageView({
        projectId: project.id,
        sessionStartMinus: { second: seconds - 1 },
      })

      // Additional page view for the same visitor
      await simulateVisitorAndPageView({
        projectId: project.id,
        sessionStartMinus: { second: seconds - 1 },
        visitorId: visitorAndPageView.visitor.id,
      })
    }

    const period: Period = {
      startAt: DateTime.now().minus({ second: seconds }),
      endAt: DateTime.now(),
    }

    const bounceRate: number = await AnalyticsBounceRateService.getBounceRate({
      projectId: project.id,
      period,
    })
    const expectedBounceRate: number = roundToTwoDecimals(
      (numberOfViews / (numberOfViews + numberOfNoBounceVisits)) * 100
    )
    assert.equal(bounceRate, expectedBounceRate)

    await project.delete()
  })

  group.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})

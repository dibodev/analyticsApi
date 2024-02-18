import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Database from '@ioc:Adonis/Lucid/Database'

type Session = {
  id: number
  visitor_id: number | null
  active: boolean
  session_start: string
  session_end: string | null
  visit_duration: number | null
  created_at: string
  updated_at: string
}

type Project = {
  id: number
  domain: string
  favicon: string | null
  active: boolean
  created_at: string
  updated_at: string
}

type Page = {
  id: number
  url: string
  endpoint: string | null
  project_id: number
  created_at: string
  updated_at: string
}

type Visitor = {
  id: number
  visitor_id: string
  project_id: number | null
  location_id: number | null
  created_at: string
  updated_at: string
}

/*
 * This function takes a URL and returns the endpoint.
 * The endpoint is the path of the URL, e.g.:
 * - `https://example.com/` -> `/`
 * - `https://example.com/about/` -> `/about`
 * - `https://example.com/about` -> `/about`
 */
function findEndpoint(url: string): string {
  const parsedUrl: URL = new URL(url)
  let path: string = parsedUrl.pathname

  // Remove the trailing slash if it exists
  if (path.endsWith('/') && path.length > 1) {
    path = path.slice(0, -1)
  }

  // If the path is empty, return "/"
  return path || '/'
}

export default class extends BaseSchema {
  protected tableName = 'sessions'

  public async up() {
    const sessions: Array<Session> = await Database.from(this.tableName).select('*')

    for (const session of sessions) {
      if (!session.visitor_id) {
        console.log('Skipping session without visitor_id:', session.id)
      }
      if (session.visitor_id) {
        // Find the visitor with the visitor_id from the session
        const sessionVisitor: Visitor | undefined = await Database.from('visitors')
          .where('id', session.visitor_id)
          .first()

        if (!sessionVisitor || !sessionVisitor.project_id) {
          console.log('Skipping session without project_id:', session.id)
          continue
        }

        if (sessionVisitor && sessionVisitor.project_id) {
          const project: Project | undefined = await Database.from('projects')
            .where('id', sessionVisitor.project_id)
            .first()

          if (!project) {
            console.log('Skipping session without project:', session.id)
            continue
          }

          if (project) {
            const pageUrl: string = `https://${project.domain}/`
            const endpoint: string = findEndpoint(pageUrl)
            let page: Page | undefined = await Database.from('pages').where('url', pageUrl).first()

            if (!page) {
              const pagesRows: Array<number> = await Database.table('pages')
                .insert({
                  url: pageUrl,
                  endpoint,
                  project_id: sessionVisitor.project_id,
                  created_at: session.created_at,
                  updated_at: session.updated_at,
                })
                .returning(['id'])

              const pageId: number | null = pagesRows[0]

              if (pageId) {
                page = await Database.from('pages').where('id', pageId).first()
              }
            }

            if (!page) {
              console.log('Skipping session without page:', session.id)
              continue
            }

            if (page) {
              const pageViewsRow: Array<number> = await Database.table('page_views')
                .insert({
                  visitor_id: session.visitor_id,
                  page_id: page.id,
                  session_start: session.session_start,
                  session_end: session.session_end,
                  duration: session.visit_duration || 0,
                  referrer: null,
                  created_at: session.created_at,
                  updated_at: session.updated_at,
                })
                .returning(['id'])

              const pageViewId: number | null = pageViewsRow[0]

              if (!pageViewId) {
                console.log('Skipping session without page view:', pageViewsRow)
                continue
              }

              if (pageViewId) {
                await Database.table('real_time_page_views').insert({
                  page_view_id: pageViewId,
                  active: false,
                })
              }
            }
          }
        }
      }
    }
  }

  public async down() {
    // No, down function because we can't revert the data migration
  }
}

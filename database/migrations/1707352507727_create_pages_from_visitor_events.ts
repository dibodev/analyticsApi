import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Database from '@ioc:Adonis/Lucid/Database'

type VisitorEvent = {
  id: number
  visitor_id: number | null
  url: string | null
  browser: string | null
  os: string | null
  device_type: string | null
  referrer: string | null
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
  protected tableName = 'visitor_events'

  public async up() {
    const visitorEvents: Array<VisitorEvent> = await Database.from(this.tableName).select('*')

    for (const visitorEvent of visitorEvents) {
      if (visitorEvent.visitor_id) {
        // Find the visitor with the visitor_id from the visitor_event
        const visitor: Visitor | undefined = await Database.from('visitors')
          .where('id', visitorEvent.visitor_id)
          .first()

        if (visitor && visitor.project_id) {
          const project: Project | undefined = await Database.from('projects')
            .where('id', visitor.project_id)
            .first()

          if (project) {
            const pageUrl: string = `https://${project.domain}/`
            const endpoint: string = findEndpoint(pageUrl)
            let page: Page | undefined = await Database.from('pages').where('url', pageUrl).first()

            if (!page) {
              const pagesRows: Array<number> = await Database.table('pages')
                .insert({
                  url: pageUrl,
                  endpoint,
                  project_id: visitor.project_id,
                  created_at: visitorEvent.created_at,
                  updated_at: visitorEvent.updated_at,
                })
                .returning(['id'])

              const pageId: number | null = pagesRows[0]

              if (pageId) {
                page = await Database.from('pages').where('id', pageId).first()
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

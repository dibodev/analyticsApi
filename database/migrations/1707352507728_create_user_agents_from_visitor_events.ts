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

type UserAgent = {
  id: number
  user_agent: string | null
  browser_name: string | null
  browser_version: string | null
  browser_language: string | null
  os_name: string | null
  os_version: string | null
  device_type: string | null
  created_at: string
  updated_at: string
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
            // find page with project_id
            const page: Page | undefined = await Database.from('pages')
              .where('project_id', visitor.project_id)
              .first()

            if (page) {
              // find user_agent with browser_name and os_name and device_type
              const userAgentAlreadyExist: UserAgent | null = await Database.from('user_agents')
                .where({
                  browser_name: visitorEvent.browser,
                  os_name: visitorEvent.os,
                  device_type: visitorEvent.device_type,
                })
                .first()

              let userAgentId: number | null = userAgentAlreadyExist
                ? userAgentAlreadyExist.id
                : null

              if (!userAgentAlreadyExist) {
                const userAgentsRows: Array<number> = await Database.table('user_agents')
                  .insert({
                    user_agent: null,
                    browser_name: visitorEvent.browser,
                    browser_version: null,
                    browser_language: null,
                    os_name: visitorEvent.os,
                    os_version: null,
                    device_type: visitorEvent.device_type,
                    created_at: visitorEvent.created_at,
                    updated_at: visitorEvent.updated_at,
                  })
                  .returning(['id'])

                userAgentId = userAgentsRows[0]
              }

              await Database.table('page_views').insert({
                visitor_id: visitorEvent.visitor_id,
                user_agent_id: userAgentId,
                page_id: page.id,
                session_start: visitorEvent.created_at,
                session_end: visitorEvent.updated_at,
                duration: 0,
                referrer: visitorEvent.referrer,
                created_at: visitorEvent.created_at,
                updated_at: visitorEvent.updated_at,
              })
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
